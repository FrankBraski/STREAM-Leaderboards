# STREAM Leaderboards: guide for coding agents

This repo runs animated class leaderboards for Donovan Catholic's STREAM program. They play on large 16:9 classroom TVs in an unattended auto-tour. The owner is a teacher (GitHub: FrankBraski). Agents keep the data current, build new screens, review them, and publish.

**Read this whole file before changing anything.** The design spec for screens is `docs/dashboard-builder-prompt.md`; it is required reading for anyone building or reviewing a screen.

## How it fits together

Plain HTML, CSS and JavaScript. No build step, no framework, no server. Everything must work when `index.html` is double-clicked from disk (`file://`) and when served by GitHub Pages.

| File | What it is |
| --- | --- |
| `index.html` | The auto-tour. Shows one leaderboard at a time in a full-screen `<iframe>`, with a "Next up" card between boards and a control bar (skip, back, pause, fullscreen). Viewer interaction pauses it; it resumes 30 s after the last touch. |
| `playlist.js` | The tour's playlist and timing (`window.TOUR`). Board order, scroll speed, pause times, and per-board hooks. **The only file to edit to add, remove or reorder boards.** |
| `tour-agent.js` | Loaded by every leaderboard. When the page is inside the tour, it takes commands over `postMessage`: pick a tab, press replay, wait for the animation, auto-scroll, report when done. It reports viewer scrolls and clicks back to the tour. When the page is opened on its own, it does nothing. |
| `fit-side.js` | Loaded by every leaderboard. Shrinks the fixed left column on short screens so it never gets cut off. |
| `leaderboards/*.html` | One self-contained screen per class and data source. Student data is embedded as JSON in each file. |
| `docs/dashboard-builder-prompt.md` | The design spec: animation, XP rules, medal stand, two-column layout, readability, kindness rules, required hooks. |
| `tools/check.mjs` | The automated check (`npm run check`). CI runs it on every push (`.github/workflows/check.yml`). |

The tour and the pages talk only through `postMessage`, because pages opened from disk can't reach into each other directly. Messages from the tour are `enter`, `run` and `hold`; replies from the page are `hello`, `info`, `done`, `interact`, `partClicked`, `key` and `poke`. Don't change that protocol without updating both `index.html` and `tour-agent.js`.

### Contract every leaderboard must meet

The check enforces most of this.

- Markup is `<div class="wrap"><div class="side">…</div><div class="main">…</div></div>`. The left column (`.side`: title, tabs, round banner, medal stand, stats, awards, formula) is sticky and never scrolls. The right column (`.main`) holds the long list.
- The two-column CSS lives in a block that starts with the comment `Wide screens (16:9`. It applies only at `min-width:1100px` and `min-aspect-ratio:4/3`.
- The left column fits one screen at 1920×1080 and 1366×768, with no clipping.
- Both of these appear just before `</body>`, in this order:
  `<script src="../fit-side.js"></script>`
  `<script src="../tour-agent.js"></script>`
- The animation starts by itself on load. If there is a replay button (`#replay`), it restarts the animation.
- Pages with an intro animation set an element's text to a final marker the tour can wait for: `#round` shows `FINAL SCORES`, or `#status` shows `FINAL STANDINGS`.
- Tabs are buttons with `data-mode`. Pages must not run their own auto-cycle or auto-scroll while in the tour; the playlist's `hide` option hides those buttons.
- **Student names are first name + last initial only.** That applies to the embedded data, comments and examples. Importers shorten names on load with `shortName()`.

## Rules for every agent

1. **Privacy comes first.** The repo and the Pages site are public.
   - Never commit a student's full name, email address, student ID, or a raw export file (Khan Academy HTML, Classroom CSV, FTCsim HTML). Turn exports into first name + last initial JSON before they touch the repo.
   - Never show grades or average scores next to a name in a row. The only exception is a positive award with a threshold (see the spec).
   - Never add negative labels for the bottom ranks.
   - If you find a full name anywhere, stop. Fix it and tell the owner.
2. **Run `npm run check` before every push.** Don't push a red check. If CI fails, fix the cause; never disable or loosen a check to get green.
3. **Test the real thing.** For any visual change, look at a 1920×1080 screenshot of the page and of the tour reaching it. A passing check is necessary but not enough.
4. **Keep it static.** No build tools, frameworks, trackers or analytics. External loads are limited to Google Fonts and `cdnjs.cloudflare.com`. Never require a server.
5. **Don't rewrite history** on shared branches, and don't force-push, unless the owner explicitly asks. One agent owns a branch at a time.
6. **Keep the teacher's tools working.** Every page's settings drawer and file importers must keep working after your change.
7. **Ask the owner before:**
   - changing an XP formula
   - removing a board
   - publishing a new board for the first time
   - anything that makes data more visible (e.g. a new column or a new metric)

## Roles

A team can run all four roles, or one agent can cover several. Hand off by branch and pull request, and give each PR a short "what changed / how checked" note.

### 1. Data updater (weekly, or when the teacher sends new exports)

Input: new Khan Academy, Google Classroom or FTCsim exports from the teacher.

1. Work on a branch named `data/<class>-<yyyy-mm-dd>`.
2. Parse the exports outside the repo, using the parsing rules already in each page's importer (`parseActivity`, `parseScores`, `parseFtcsim`).
3. Match students by their exact name text, then shorten each name to first name + last initial. If two students would get the same short name, ask the owner how to tell them apart; don't guess.
4. Replace the page's embedded data constant (`SAMPLE`, `students` or `drivers`). Update the date range or "as of" text, and the "Reset to <date> data" label.
5. Check the new totals against the export for at least three students.
6. Run `npm run check`, take screenshots, and open a PR.

### 2. Screen builder (new class or new data source)

1. Follow `docs/dashboard-builder-prompt.md` exactly. Start from the closest existing page:
   - `middle-school-stream-high-scores.html` or `cs1-high-scores.html` for a stacked-bar race
   - `cs1-ftcsim-grand-prix.html` for a course-progress race
   - `cs1-ftcsim-pit-board.html` for a tabbed list
2. Name the file `leaderboards/<class>-<platform>-<style>.html`, add the two script tags, and add an entry to `playlist.js` next to the other boards for the same data source.
3. Run `npm run check` and send 1920×1080 screenshots (mid-race and final) to the reviewer.

### 3. Reviewer / QA

Review every PR against:
- the acceptance checklist at the end of `docs/dashboard-builder-prompt.md`
- the contract above
- the privacy rules above

Then:
- Run the tour locally at 1920×1080 and watch the changed board play through once.
- Check that skip, back, pause and the 30-second resume still work.
- Approve only when CI is green and the screenshots match the spec.

### 4. Publisher

- GitHub Pages serves the repo's default branch, from the root folder (`.nojekyll` is present). Merging to that branch publishes the site. The owner turns Pages on and changes its settings; agents can't.
- After a merge, open the live site, wait for Pages to update (1–2 minutes), and confirm the tour reaches every board.
- If the live site breaks, revert the merge commit rather than pushing a hurried fix.

## Common tasks

- **Add a board:** put the file in `leaderboards/`, meet the contract, and add a `playlist.js` entry. The options are documented at the top of `playlist.js`.
- **Change timing:** edit `playlist.js` (`idleResumeSeconds`, `scrollSpeed`, `dwellTopSeconds`, `dwellBottomSeconds`, `minStopSeconds`). For a one-off, use URL options on `index.html`, e.g. `?idle=60&speed=30&start=3`.
- **Test fast:** `index.html?speed=3000&dwellTop=0.2&dwellBottom=0.2&minStop=1` runs the whole tour in about a minute.
- **Run the checks:** `npm install && npx playwright install chromium`, then `npm run check`. Use `npm run check:quick` for the static checks only (no browser). If Chromium is preinstalled somewhere else, set `PLAYWRIGHT_CHROMIUM_PATH`.

## Definition of done

- `npm run check` passes locally and in CI.
- Screenshots at 1920×1080 were looked at, not just taken.
- Nothing in the diff shows more about a student than first name + last initial and effort-based numbers.
- `README.md` (for the teacher) and this file (for agents) still describe how things work. Update them in the same PR if not.
