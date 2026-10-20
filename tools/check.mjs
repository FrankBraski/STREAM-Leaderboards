// Checks every leaderboard and the tour before anything is pushed or published.
// Run: npm run check        (add --quick to skip the browser checks)
// Exit code 0 = all good. Every failure prints a line starting with "FAIL".
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const quick = process.argv.includes('--quick');
let failures = 0;
const fail = msg => { failures++; console.log('FAIL ' + msg); };
const ok = msg => console.log('ok   ' + msg);

// --- playlist ---------------------------------------------------------------
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'playlist.js'), 'utf8'), sandbox);
const TOUR = sandbox.window.TOUR;
if (!TOUR || !Array.isArray(TOUR.boards) || !TOUR.boards.length) { fail('playlist.js has no boards'); process.exit(1); }
ok(`playlist.js lists ${TOUR.boards.length} boards`);

// --- static checks on each board ---------------------------------------------
// A student name must be a first name plus at most one initial: "Camilla D", "Camilla D.", "Juddy".
const SHORT_NAME = /^[^\s"]+( [A-Z]\.?)?$/;
const NAME_FIELDS = [/"name"\s*:\s*"([^"]+)"/g, /\bname\s*:\s*"([^"]+)"/g];

for (const b of TOUR.boards) {
  const file = path.join(ROOT, b.file);
  if (!fs.existsSync(file)) { fail(`${b.file}: file missing`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const need = [
    ['<script src="../fit-side.js"></script>', 'fit-side.js include'],
    ['<script src="../tour-agent.js"></script>', 'tour-agent.js include'],
    ['class="side"', 'left column (.side)'],
    ['class="main"', 'right column (.main)'],
    ['Wide screens (16:9', 'wide-screen CSS block'],
  ];
  for (const [text, what] of need) if (!html.includes(text)) fail(`${b.file}: missing ${what}`);
  if (b.replay && !html.includes(`id="${b.replay.slice(1)}"`)) fail(`${b.file}: playlist replay ${b.replay} not found`);
  if (b.ready && !html.includes(`id="${b.ready.selector.slice(1)}"`)) fail(`${b.file}: ready element ${b.ready.selector} not found`);
  if (b.parts && !html.includes('data-mode=')) fail(`${b.file}: playlist says tabs (${b.parts}) but page has none`);
  const bad = new Set();
  for (const re of NAME_FIELDS) for (const m of html.matchAll(re)) if (!SHORT_NAME.test(m[1])) bad.add(m[1]);
  if (bad.size) fail(`${b.file}: names longer than first name + last initial: ${[...bad].join(', ')}`);
  else ok(`${b.file}: hooks present, names are first name + initial`);
}

// --- browser checks ----------------------------------------------------------
if (!quick) {
  let chromium;
  try { ({ chromium } = await import('playwright')); }
  catch { fail('playwright is not installed (run: npm install && npx playwright install chromium), or use --quick'); }
  if (chromium) {
    const opts = process.env.PLAYWRIGHT_CHROMIUM_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } : {};
    const browser = await chromium.launch(opts);
    for (const [w, h] of [[1920, 1080], [1366, 768]]) {
      for (const b of TOUR.boards) {
        const page = await browser.newPage({ viewport: { width: w, height: h } });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(pathToFileURL(path.join(ROOT, b.file)).href);
        if (b.ready) {
          await page.waitForFunction(r => (document.querySelector(r.selector)?.textContent || '').toUpperCase().includes(r.text.toUpperCase()),
            b.ready, { timeout: 25000 }).catch(() => errors.push(`never showed "${b.ready.text}"`));
        }
        await page.waitForTimeout((b.settle ?? 1000) + 500);
        const r = await page.evaluate(() => {
          const s = document.querySelector('.side');
          return s && { sticky: getComputedStyle(s).position === 'sticky', need: s.scrollHeight, have: s.clientHeight,
                        tabs: document.querySelectorAll('[data-mode]').length };
        });
        const tag = `${b.file} @${w}x${h}`;
        if (errors.length) fail(`${tag}: ${errors.join(' | ')}`);
        if (!r) fail(`${tag}: no .side column`);
        else {
          if (!r.sticky) fail(`${tag}: left column is not in two-column mode`);
          if (r.need > r.have + 4) fail(`${tag}: left column is cut off (${r.need}px of content in ${r.have}px)`);
          if (b.parts && r.tabs < 2) fail(`${tag}: expected tabs, found ${r.tabs}`);
          if (!errors.length && r.sticky && r.need <= r.have + 4) ok(`${tag}: renders, left column fits${b.parts ? `, ${r.tabs} tabs` : ''}`);
        }
        await page.close();
      }
    }
    // the tour visits every board (fast settings)
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    page.on('pageerror', e => fail(`tour: ${e.message}`));
    await page.goto(pathToFileURL(path.join(ROOT, 'index.html')).href + '?speed=4000&dwellTop=0.1&dwellBottom=0.1&minStop=0.5');
    const seen = new Set(), t0 = Date.now();
    while (seen.size < TOUR.boards.length && Date.now() - t0 < 180000) {
      seen.add(await page.evaluate(() => document.getElementById('nowBoard').textContent));
      await page.waitForTimeout(300);
    }
    const missing = TOUR.boards.map(b => b.title).filter(t => !seen.has(t));
    if (missing.length) fail(`tour never reached: ${missing.join(', ')}`);
    else ok(`tour visited all ${TOUR.boards.length} boards`);
    await browser.close();
  }
}

console.log(failures ? `\n${failures} problem(s) found.` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
