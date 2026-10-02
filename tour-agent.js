/* Tour agent: lets index.html (the auto-tour) drive a leaderboard page that it shows in a frame.
   It picks tabs, replays the intro animation, auto-scrolls, and reports when the viewer touches the page.
   Opened on its own (not inside the tour), the page behaves exactly as before. */
(function () {
  if (window.__tourAgent || window.parent === window) return;
  window.__tourAgent = true;

  const DEFAULTS = {
    parts: null,        // selector for tab buttons, one tour stop per button
    replay: null,       // selector for a button that restarts the intro animation
    ready: null,        // {selector, text}: wait until this element shows this text before scrolling
    readyTimeout: 20000,
    settle: 1000,       // extra wait after ready, for late fade-ins
    hide: null,         // selector for controls that would fight the tour (own auto-cycle, own fullscreen)
    speed: 45,          // auto-scroll speed, px per second
    dwellTop: 4000,
    dwellBottom: 6000,
    minPart: 15000      // shortest time a stop stays on screen
  };
  const TOUR_KEYS = new Set(['ArrowLeft', 'ArrowRight', ' ', 'f', 'F', 'p', 'P']);

  let cfg = { ...DEFAULTS };
  let gen = 0;          // bumped to cancel whatever run is in flight
  let state = null;     // progress through the current stop
  const send = (type, data) => window.parent.postMessage({ tour: 1, type, ...data }, '*');
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const frame = () => new Promise(r => requestAnimationFrame(() => r()));
  const root = () => document.scrollingElement || document.documentElement;
  const maxScroll = () => Math.max(0, root().scrollHeight - window.innerHeight);
  const partButtons = () => (cfg.parts ? [...document.querySelectorAll(cfg.parts)] : []);
  const label = b => b.textContent.replace(/\s+/g, ' ').trim();

  function isReady() {
    if (!cfg.ready) return true;
    const el = document.querySelector(cfg.ready.selector);
    return !!el && (!cfg.ready.text || el.textContent.toUpperCase().includes(cfg.ready.text.toUpperCase()));
  }

  function enter(part, newCfg) {
    gen++;
    if (newCfg) {
      cfg = { ...DEFAULTS, ...newCfg };
      if (cfg.hide) document.querySelectorAll(cfg.hide).forEach(el => (el.style.display = 'none'));
    }
    const btns = partButtons();
    if (btns.length) {
      if (part < 0 || part >= btns.length) part = part < 0 ? btns.length - 1 : 0;
      btns[part].click();
    } else {
      part = 0;
      if (cfg.replay) document.querySelector(cfg.replay)?.click();
    }
    root().scrollTop = 0;
    state = { entered: performance.now(), settled: false, topDone: false };
    send('info', { part, parts: btns.map(label) });
  }

  async function run(token) {
    const my = ++gen;
    const alive = () => my === gen;
    if (!state) state = { entered: performance.now(), settled: false, topDone: false };
    if (!state.settled) {
      const t0 = performance.now();
      while (!isReady() && performance.now() - t0 < cfg.readyTimeout) {
        await sleep(150);
        if (!alive()) return;
      }
      await sleep(cfg.settle);
      if (!alive()) return;
      state.settled = true;
    }
    if (!state.topDone) {
      if (maxScroll() > 4 && root().scrollTop < 4) {
        await sleep(cfg.dwellTop);
        if (!alive()) return;
      }
      state.topDone = true;
    }
    let y = root().scrollTop, last = performance.now();
    while (y < maxScroll() - 1) {
      await frame();
      if (!alive()) return;
      const now = performance.now();
      y = Math.min(maxScroll(), y + cfg.speed * Math.min(100, now - last) / 1000);
      last = now;
      root().scrollTop = y;
    }
    await sleep(Math.max(cfg.dwellBottom, cfg.minPart - (performance.now() - state.entered)));
    if (alive()) send('done', { token });
  }

  window.addEventListener('message', e => {
    if (e.source !== window.parent || !e.data || e.data.tour !== 1) return;
    const m = e.data;
    if (m.type === 'enter') enter(m.part, m.cfg);
    else if (m.type === 'run') run(m.token);
    else if (m.type === 'hold') gen++;
  });

  // Anything the viewer does to the page pauses the tour (the tour resumes on its own later).
  const touched = kind => { gen++; send('interact', { kind }); };
  window.addEventListener('wheel', e => e.isTrusted && touched('wheel'), { passive: true });
  window.addEventListener('touchstart', e => e.isTrusted && touched('touch'), { passive: true });
  window.addEventListener('mousedown', e => {
    if (!e.isTrusted) return;
    const btn = cfg.parts && e.target.closest ? e.target.closest(cfg.parts) : null;
    if (btn) send('partClicked', { part: partButtons().indexOf(btn) });
    touched('click');
  }, true);
  window.addEventListener('keydown', e => {
    if (!e.isTrusted) return;
    const typing = e.target.closest && e.target.closest('input,select,textarea');
    if (!typing && TOUR_KEYS.has(e.key)) {
      e.preventDefault();
      send('key', { key: e.key, shift: e.shiftKey });
    } else touched('key');
  }, true);
  let lastPoke = 0;
  window.addEventListener('mousemove', () => {
    const now = Date.now();
    if (now - lastPoke > 250) { lastPoke = now; send('poke', {}); }
  }, { passive: true });

  send('hello', {});
})();
