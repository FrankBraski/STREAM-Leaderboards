# Prompt: build a classroom leaderboard screen

Paste everything below the line into the bot, then attach the data files. One run builds one screen (one HTML file). Run it once per data source per class.

---

You are building an animated leaderboard screen for a classroom TV at Donovan Catholic (STREAM program). Students in middle school (grades 6–8) or high school (grades 9–12) will watch it from across the room. It runs unattended inside an auto-tour (`index.html`) that rotates through several screens. Build a single self-contained HTML file from the attached data.

## 1. Before you build

1. Open every attached file and list what is in it: which platform, which class, the date range, how many students, and which columns hold numbers. Do not guess at columns you cannot see.
2. Decide how many screens the data needs (section 2). If it needs more than one, build them as separate files and say so.
3. State the XP formula you will use (section 4) and the tie-break rule before writing code.
4. If a file is missing something this prompt needs, such as a date range or student names, ask. Don't invent data.

## 2. One screen per data set

- **One screen per platform per class.** Khan Academy, Google Classroom and FTCsim are separate screens, even for the same class. CS1 and CS2 are separate screens. Do not merge platforms into one score.
- **Several measures from the same platform go on one screen** as a stacked-bar race (section 3). They can also be tabs on that screen (section 6).
- **Unrelated data gets its own screen with its own animation.** For example, a class-wide team progress meter is not one of the race's measures, so it gets its own screen.

Expected inputs (inspect the real files; formats change):

| Platform | Typical file | Useful measures |
| --- | --- | --- |
| Khan Academy | Activity report saved as HTML ("Webpage, HTML only"); assignment scores as .xlsx or .csv | Minutes on task, skills leveled up, skills at Proficient+, assignments completed, average score |
| Google Classroom | Grades export (.csv): student name and email columns, then one column per assignment, sometimes with due-date and points rows above the students | Assignments turned in, turned in on time |
| FTCsim.org | Progress page saved as HTML: per student, four courses (Intro 3, Movement 10, Sensors 10, Puzzles 10 = 33), each puzzle checked, unchecked or flagged | Puzzles cleared per course, next puzzle, flagged (stuck) puzzles |

## 3. The core animation: stacked-bar race

This is the centerpiece and must work exactly like this:

1. **Start:** every student row is in alphabetical order with an empty bar and 0 XP.
2. **Rounds:** each measure is one round, about 2.2 seconds long. A banner reads `ROUND 2 / 4 · SKILLS LEVELED UP`. During a round, that measure's colored segment grows on every bar (ease-out), the XP number counts up, and **rows slide to their new rank as they pass each other**. Rows keep earlier rounds' segments, so the bar becomes a stack.
3. **Skip empty rounds:** skip a measure that no shown student has any of.
4. **Finish:** the banner changes to exactly `FINAL SCORES`. Then the medal stand rises (bronze, then silver, then gold, about 200 ms apart), one confetti burst plays, and award cards pop in one at a time.
5. **Timing:** the whole sequence takes 15 seconds or less.

How to build the reordering (required):
- Each row is a `position:absolute` element **keyed to one student and never recreated**.
- Rank changes only set `transform: translateY(rank × rowHeight)`, with `transition: transform .45s cubic-bezier(.3,1.2,.4,1)`.
- Set the board container's height to `rows × rowHeight + padding`, so the page's scroll height is correct.
- Never rebuild rows with `innerHTML` mid-animation. That makes rows jump instead of slide.
- Drive the animation with `requestAnimationFrame` and cancel any running animation before restarting.

When tabs change (section 6), use the same reordering: rows slide to the new order and bars resize. Rows must not vanish and reappear.

## 4. XP and scoring

- Use **whole-number XP**, never decimals. Points per action are easy for kids to understand.
- **Default weights:**
  - Khan Academy: 1 per minute on task, 10 per skill leveled up, 10 per skill Proficient+, 15 per assignment completed.
  - Google Classroom: 20 per assignment turned in, plus 5 bonus if it was on time.
  - FTCsim: 100 per puzzle cleared, plus course-clear bonuses of 250 Intro, 500 Movement, 750 Sensors and 1,000 Puzzles.
- **One formula per platform, everywhere.** Every screen that uses a platform's data must use the same formula, so the same class always has the same champion.
- **Show the formula** in plain words in a footer line, e.g. `XP = 1 per minute on task + 10 per skill leveled up + … Ties go alphabetical.`
- **Make the weights editable** in a settings drawer, saved to `localStorage` under a key unique to this screen.
- **Ties:** for FTCsim, the student further into the later courses ranks higher; otherwise ties go alphabetical. If scores are still exactly equal, both students show the same rank number with a `T-` prefix (`T-2`).

## 5. Medal stand

- Three pedestals: gold in the center (tallest), silver on the left, bronze on the right.
- Give the blocks metallic gradients:
  - gold `#ffe27a → #f5b423`
  - silver `#f4f7fb → #c5ced8`
  - bronze `#f2ae7c → #c46a32`
- Show the rank number big on each block. Put the student's name and XP above it, and the word `CHAMPION` over gold.
- **Hold the medal stand's space from the start** with empty pedestals showing `?`, so the board doesn't jump. Fill in the names when the race finishes.
- The medal stand sits in the left column (section 7), so the race board on the right stays fully visible during the race.

## 6. Tabs (optional single-measure views)

- If a platform has more than one interesting measure, add tab buttons, each with `data-mode="<key>"` (for example Overall XP, Time, Skills, Assignments).
- The first tab is always the full XP race.
- Each other tab re-ranks by that one measure, using the slide-to-new-rank animation, and updates the medal stand.
- The tour clicks each `[data-mode]` button in turn, so tabs must work by click alone.
- Do not build your own auto-cycle timer. The tour does that.

## 7. Layout for a classroom TV

Design for large 16:9 displays (1920 × 1080), viewed from 15–25 feet. Use **two columns**: wrap everything in `<div class="wrap">`, with `<div class="side">` on the left and `<div class="main">` on the right.

**Left column (`.side`, about 42% wide): fixed, never scrolls.**
1. **Header:** school eyebrow (`DONOVAN CATHOLIC · COMPUTER SCIENCE I`), big title (`CS1 HIGH SCORES`), a subtitle with the platform and date range, and the tab buttons.
2. **Round banner.**
3. **Medal stand.**
4. **Class stats tiles** (optional, 2 × 2: e.g. students, total hours, skills mastered, current leader).
5. **Class awards**, 2 cards per row.
6. **Formula footer.**

**Right column (`.main`, about 58% wide): the long list.**
- The race board, one row per student, max 4 columns: rank, name, stacked bar, XP.
- The color legend, directly above or below it.

How to build it:
- Apply the two columns only inside `@media (min-width:1100px) and (min-aspect-ratio:4/3)`, so narrow windows stack the columns like a normal page.
- The CSS that makes it work:
  - `.wrap`: `display:grid; grid-template-columns:minmax(0,42fr) minmax(0,58fr); align-items:start`
  - `.side`: `position:sticky; top:0; height:100vh; overflow:hidden; display:flex; flex-direction:column`
  - children of `.side`: `flex-shrink:0`
- The page itself scrolls normally, but only the right column moves, because the left column is sticky.
- Include `<script src="../fit-side.js"></script>`. It shrinks the left column on short screens so it always fits one screen height. Still size the left column to fit 1080 px without it, using `vh`-based heights for the medal-stand blocks.
- Long lists are fine: the tour scrolls down slowly after `FINAL SCORES` and returns to the top for the next screen. **Do not auto-scroll in the page itself.**

Readability minimums at 1920 × 1080:
- Student names and XP numbers ≥ 22 px.
- Rank ≥ 20 px.
- Labels and legend ≥ 16 px.
- Nothing on screen below 14 px. No 10–12 px badges or detail lines.
- Text contrast at least 4.5:1 against its background.
- Detail like "Intro 3/3 · Movement 10/10 · …" belongs in a tab, not in tiny text under the name.

Visual style:
- Dark theme with a deep navy background (`#060b1d`).
- One display font for headings and numbers, such as Silkscreen, Orbitron or Barlow Condensed, and one readable body font.
- Keep colors fixed per measure on every screen, so the legend means the same thing everywhere:
  - Khan Academy: time `#3f8cff` blue, skills leveled `#4cf0a0` green, Proficient+ `#ffd23f` gold, assignments `#ff4f8b` pink.
  - FTCsim courses: Intro blue, Movement green, Sensors gold, Puzzles pink.
  - Google Classroom: turned in blue, on time green.

Motion rules:
- Confetti plays once per finish, stays out of the race board's area, and is gone within 3 seconds.
- No looping "float" or "bounce" motion on content people need to read.
- Nothing flashes more than 3 times per second.
- Under `prefers-reduced-motion`, skip straight to the final state.

## 8. Age-appropriate and kind

- **Names:** default to first name + last initial (`Pat L.`). Use the preferred name when the roster shows one in parentheses (`(Sam) Jordan Rivera` → `Sam R.`). The settings drawer offers full name, initials, or "Player 01" numbering.
- **No grades on the public board.** Do not show average scores or percent grades in rows. A score may appear only inside a positive award with a threshold (for example, Sharpshooter needs ≥ 70% average over ≥ 5 assignments).
- **Lift people up, never down.** Badges and comments are for effort and milestones ("Movement Master", "Time Lord"). Never put a negative label on the bottom ranks. Students with zero activity are left off the race; a gentle line under the board can say "3 players still on the starting grid."
- **Humor:** middle school is upbeat and simple. High school may have playful, upward-only commentary behind a settings toggle that is off by default. No roasting of individuals.
- **Middle school screens** use at most 3–4 measures, bigger type and more celebration. **High school screens** may add tabs and an extra stats row.

## 9. Class awards

- Show 3–5 cards after the race, each naming the top student in one measure, for example:
  - Khan Academy: Time Lord (minutes), Skill Hunter (skills leveled up), Mastery Mage (Proficient+), Assignment Ace (assignments), Sharpshooter (average, with threshold).
  - Google Classroom: On-Time Streak, Turn-In Titan.
  - FTCsim: Pole Position (leader), Movement Master (all 10), Sensor Pioneer (first sensor puzzle), Puzzle Cracker (first puzzle).
- If nobody has earned an award yet, show it as an open dashed card with what it takes to earn it ("First to solve an FTC Puzzle earns it").

## 10. Required hooks for the auto-tour

The tour drives the page through these. Use these exact names:

- A `#replay` button that restarts the whole animation from the alphabetical start.
- An element `#round` whose text becomes `FINAL SCORES` when the animation is done (FTCsim race screens may use `#status` with `FINAL STANDINGS`).
- Tab buttons with `data-mode`, if the screen has tabs.
- A `#full` fullscreen button (the tour hides it).
- `<script src="../tour-agent.js"></script>` just before `</body>`.
- The animation starts by itself on page load.

## 11. Technical rules

- **One self-contained `.html` file** that works when double-clicked from disk (`file://`). External resources are limited to Google Fonts and `cdnjs.cloudflare.com` (e.g. SheetJS for .xlsx import).
- **Embed the data** as a `const SAMPLE = {...}` near the top, with the date range in it. Include file loaders in the settings drawer, so the teacher can load the next export without editing code, plus a "Reset to <date> data" button.
- **Use the platform's exact student-name text** as the key when merging files. Normalize whitespace; don't guess at mismatched names.
- **Put student names into the page with `textContent`, never `innerHTML`.**
- **Check the page renders with no console errors.**

## 12. Deliver

1. The HTML file, named `<class>-<platform>-<style>.html`, e.g. `cs2-khan-high-scores.html`.
2. The `playlist.js` entry for it, e.g.:
   `{ title: 'CS2 High Scores', file: 'leaderboards/cs2-khan-high-scores.html', replay: '#replay', ready: { selector: '#round', text: 'FINAL SCORES' }, settle: 2500, hide: '#full' }`.
3. A screenshot at 1920 × 1080 taken mid-race, and one after `FINAL SCORES`.
4. A short list of anything in the data you could not use, and why.

## Acceptance checklist

- [ ] Rows start alphabetical and slide (not jump) to new ranks every round and on every tab change.
- [ ] Every bar is a stack of measure-colored segments, with a matching legend.
- [ ] On a 1920 × 1080 screen: title, medal stand, stats and awards on the left, the list on the right; scrolling moves only the right column, and the left column fits without being cut off (also check 1366 × 768).
- [ ] Gold, silver and bronze stand appears after `FINAL SCORES`; ties are handled as stated.
- [ ] XP is whole numbers; the formula footer matches the code; other screens on the same platform use the same formula.
- [ ] No text under 14 px; names and scores ≥ 22 px.
- [ ] First name + last initial by default; no grades in rows; no negative labels.
- [ ] Works from `file://`, has the tour hooks, and has no auto-scroll or auto-cycle of its own.
