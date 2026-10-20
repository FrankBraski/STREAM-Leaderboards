# STREAM Leaderboards

Donovan Catholic class leaderboards, plus an auto-tour that rotates through all of them on a classroom display.

## Run the tour

Open `index.html` in Chrome or Edge (double-clicking it works, no server needed), then press **F** for fullscreen.

The tour:
- shows each leaderboard in turn and replays its intro animation,
- visits every tab on boards that have tabs (Code Quest, Chaos Mode),
- auto-scrolls long pages to the bottom before moving on,
- loops forever and keeps the screen awake.

## Controls

| Key / button | Does |
| --- | --- |
| → / ← | Skip forward / go back one stop (a tab, or a whole board when it has no tabs) |
| Shift + → / ← | Next / previous leaderboard |
| Space | Pause / resume |
| F | Fullscreen |
| Bar segments at the bottom | Jump to that leaderboard |

Scrolling, clicking or touching a leaderboard pauses the tour so you can look around. It resumes on its own 30 seconds after the last touch (a countdown shows top right), or press **Resume now**. Skipping while paused keeps it paused and restarts the countdown.

The control bar hides itself while the tour runs; move the mouse to bring it back.

## Change the playlist or timing

Edit `playlist.js`: board order, how long the tour waits before resuming, scroll speed, and the pauses at the top and bottom of each page. For a quick one-off change you can also add URL options, e.g. `index.html?idle=60&speed=30&start=3`.

To add a leaderboard (for example CS2 High Scores):
1. Put its `.html` file in `leaderboards/`.
2. Add `<script src="../tour-agent.js"></script>` just before its `</body>`.
3. Add an entry for it in `playlist.js` (there is a commented CS2 entry ready to uncomment).

Each leaderboard still works on its own; the tour script does nothing unless the page is inside the tour.

## For coding agents and helpers

`AGENTS.md` is the operating manual: how the pieces fit, the rules (privacy first), and a runbook for each role (data updater, screen builder, reviewer, publisher). `docs/dashboard-builder-prompt.md` is the design spec for new screens. Run `npm run check` before pushing; GitHub runs the same check on every push.
