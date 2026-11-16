# MoneyBall — drop-in for STREAM Leaderboards

Standalone 16:9 digital-sign screen plus a compact class panel that can be iframed into the existing [STREAM Leaderboards](https://frankbraski.github.io/STREAM-Leaderboards/).

Copy the **entire** `moneyball/` folder to the **root** of the `STREAM-Leaderboards` repo (next to `index.html` and `leaderboards/`). After a GitHub Pages publish, the sign will be:

`https://frankbraski.github.io/STREAM-Leaderboards/moneyball/moneyball.html`

Keep this folder's relative layout. These files must stay together:

```
moneyball/
  moneyball.html          ← full 16:9 sign (1920×1080, scales to any 16:9)
  moneyball-panel.html    ← class panel (iframe this)
  moneyball.js
  moneyball.css
  opportunities.json      ← live data (replace this to refresh)
  vendor/qrcode.min.js
  fonts/                  ← bundled, no Google Fonts CDN required
```

Serve over `http://` or GitHub Pages. Opening the HTML as a `file://` still works, but it will use the inlined fallback data inside `moneyball.js` instead of `opportunities.json`.

## Digital sign (standalone)

Point a classroom / hallway sign at `moneyball/moneyball.html` and press **F11** (or the device's kiosk/fullscreen mode). The stage is designed at 1920×1080 and scales to any 16:9 display. Non-16:9 screens letterbox with a dark bezel.

The sign:

- Fetches `opportunities.json` sitting next to the HTML (`cache: no-store`)
- Counts down, live, to the next open deadline (Eastern Time)
- Drops items automatically once `deadline_et` has passed
- Shows rolling items as **Rolling** (they do not expire)
- Marks estimates **est.** and unconfirmed items **confirm** — do not hide these badges
- Sums only numeric `award_usd` values and labels the total **UP TO**
- Builds a QR code per item in the browser (no CDN)

Optional: add the sign to the auto-tour in `playlist.js`:

```js
{
  title: 'MoneyBall · STREAM Opportunities',
  file: 'moneyball/moneyball.html',
  fallbackSeconds: 45
}
```

## Class panel (iframe)

`moneyball-panel.html` takes two query parameters:

| Param    | Values                                      | Default |
|----------|---------------------------------------------|---------|
| `class`  | `CS1` · `CS2` · `LAB102` · `MS101` · `TEAM` | all open items |
| `layout` | `side` (480×1080) or `strip` (1920×240)     | `side`  |

The panel scales to fill its iframe the same way the sign does, so the iframe should be **4:9** for `side` or **8:1** for `strip` (or any size with that aspect). On a 1920×1080 board:

- Side column: **480×1080** (right or left)
- Bottom strip: **1920×240**

### Iframe snippets

Drop one of these into the matching class leaderboard. Paths assume the leaderboard file lives in `leaderboards/` and MoneyBall lives in `moneyball/` at the repo root.

**CS1 — side**

```html
<iframe
  class="moneyball-frame"
  src="../moneyball/moneyball-panel.html?class=CS1&layout=side"
  title="CS1 MoneyBall opportunities"
  style="width:480px;height:1080px;border:0;flex:0 0 480px;background:#060f24"
></iframe>
```

**CS2 — side**

```html
<iframe
  class="moneyball-frame"
  src="../moneyball/moneyball-panel.html?class=CS2&layout=side"
  title="CS2 MoneyBall opportunities"
  style="width:480px;height:1080px;border:0;flex:0 0 480px;background:#060f24"
></iframe>
```

**STREAM Lab 102 — side**

```html
<iframe
  class="moneyball-frame"
  src="../moneyball/moneyball-panel.html?class=LAB102&layout=side"
  title="STREAM Lab 102 MoneyBall opportunities"
  style="width:480px;height:1080px;border:0;flex:0 0 480px;background:#060f24"
></iframe>
```

**MS STREAM 101 — side**

```html
<iframe
  class="moneyball-frame"
  src="../moneyball/moneyball-panel.html?class=MS101&layout=side"
  title="MS STREAM 101 MoneyBall career goals"
  style="width:480px;height:1080px;border:0;flex:0 0 480px;background:#060f24"
></iframe>
```

MS STREAM 101 has no current scholarship deadlines. The panel shows evergreen **goals** (dual enrollment starting in 10th grade, Coolidge as a junior-year aim), labeled as goals, not deadlines.

**STREAM Team — side**

```html
<iframe
  class="moneyball-frame"
  src="../moneyball/moneyball-panel.html?class=TEAM&layout=side"
  title="STREAM Team MoneyBall opportunities"
  style="width:480px;height:1080px;border:0;flex:0 0 480px;background:#060f24"
></iframe>
```

**Bottom strip** (swap the class key; example is CS1):

```html
<iframe
  class="moneyball-frame"
  src="../moneyball/moneyball-panel.html?class=CS1&layout=strip"
  title="CS1 MoneyBall opportunities"
  style="width:1920px;height:240px;border:0;flex:0 0 240px;background:#060f24"
></iframe>
```

If the parent leaderboard is itself a scaled 1920×1080 stage, put the iframe **inside that stage** at 480×1080 or 1920×240 — do not also scale the iframe, or type will shrink twice. A simple CSS pattern for a side-by-side 16:9 board:

```css
.board-row { display: flex; width: 1920px; height: 1080px; }
.board-row .leaderboard { flex: 1 1 auto; min-width: 0; height: 1080px; border: 0; }
.board-row .moneyball-frame { flex: 0 0 480px; width: 480px; height: 1080px; border: 0; }
```

```html
<div class="board-row">
  <iframe class="leaderboard" src="cs1-high-scores.html" title="CS1 High Scores"></iframe>
  <iframe class="moneyball-frame" src="../moneyball/moneyball-panel.html?class=CS1&layout=side" title="CS1 MoneyBall"></iframe>
</div>
```

For a bottom strip, stack them (leaderboard 1920×840 + strip 1920×240). The existing boards are already 16:9, so adding a panel means shrinking or cropping the original board — pick a layout and test on the classroom display before leaving it up.

## Class mapping

G-$ tags each opportunity with a pipe-separated `classes` field. The panel maps those labels to the `?class=` keys as follows (case-insensitive):

| G-$ `classes` token | `?class=` key | On-screen name    |
|---------------------|---------------|-------------------|
| `CS1`               | `CS1`         | CS1               |
| `CS2`               | `CS2`         | CS2               |
| `STREAM Lab 102`    | `LAB102`      | STREAM Lab 102    |
| `STREAM Team`       | `TEAM`        | STREAM Team       |
| *(none in the feed)*| `MS101`       | MS STREAM 101     |

Aliases also accepted: `Lab 102`, `Lab102`, `STREAM Team`, `MS STREAM 101`, `middle school`.

## Refresh the data

1. Get a fresh export from STREAM DREAMS Future$ (G-$):
   - `opportunities.json` (preferred)
   - `opportunities.csv` is the same table, not read by the screens
2. Replace `moneyball/opportunities.json` with the new file. Keep the filename exactly `opportunities.json`.
3. Hard-refresh the sign / iframe (the page requests the JSON with `cache: no-store`, but a long-running kiosk may need a reload). A once-a-day reload, or a reload after midnight Eastern, is a good habit so “DUE TODAY” items drop overnight.
4. You do **not** need to rebuild QR codes or edit the HTML. New URLs get a QR in the browser.
5. The copy baked into `moneyball.js` (`FALLBACK`) is only used when the JSON file cannot be fetched (for example `file://`). After a data refresh, either also update that fallback or always serve over http so the JSON wins.

Expected JSON shape (Eastern Time throughout):

```json
{
  "generated": "2026-11-16",
  "timezone": "America/New_York",
  "items": [
    {
      "name": "...",
      "sponsor": "...",
      "type": "scholarship | competition | camp",
      "award": "human-readable award text",
      "award_usd": 25000,
      "grades": "12",
      "deadline": "2026-11-20",
      "deadline_et": "2026-11-20 5:00 PM ET",
      "other_dates": "",
      "url": "https://...",
      "blurb": "...",
      "classes": "CS2|STREAM Team",
      "flags": "visible on the card — estimates and unconfirmed items belong here",
      "source_pulled": "..."
    }
  ]
}
```

Rules the screen already implements:

- `deadline` empty, or `deadline_et` like “Rolling…” / “window not posted yet” → shown as **Rolling**, never auto-dropped
- Date with no clock time → kept through 11:59:59 PM Eastern that day
- `award_usd` `null` is left out of the “UP TO $X” total (full rides are counted separately)
- `flags` containing “est.” / “estimate” get an **est.** badge; “unconfirmed” gets a **confirm** badge. The full flag text also stays on the card.

## Test-only query

`?now=2026-11-17T00:00:00-05:00` freezes “now” so you can confirm that a deadline drops after it passes. Do not use this on the classroom signs.

## Colors

Navy `#0b1f44`, card `#13306b`, yellow `#ffe94d`, green `#7CFC9a`, red `#ff6b6b`. Urgency: red ≤ 3 days (plus a **DUE TODAY** banner), yellow ≤ 14 days, green later.
