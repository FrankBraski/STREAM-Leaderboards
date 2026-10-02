/* The auto-tour playlist. Boards play in this order, then the tour loops.
   To add a leaderboard: put its .html file in the leaderboards folder, add
   <script src="../tour-agent.js"></script> just before its </body>, and add an entry below.

   Entry options (all optional except title and file):
     parts   – selector for the page's tab buttons; the tour visits each tab in turn
     replay  – selector for a button that restarts the page's intro animation
     ready   – {selector, text}: wait for this before scrolling (e.g. the animation's final banner)
     settle  – ms to wait after ready, so late fade-ins finish
     hide    – selector for controls the tour replaces (the page's own auto-cycle or fullscreen buttons) */
window.TOUR = {
  idleResumeSeconds: 30,   // after the viewer pauses or scrolls, the tour resumes this long after their last touch
  scrollSpeed: 45,         // px per second
  dwellTopSeconds: 4,      // pause at the top of a long page before scrolling
  dwellBottomSeconds: 6,   // pause at the bottom before moving on
  minStopSeconds: 15,      // shortest time any stop stays on screen
  fallbackSeconds: 25,     // for a page without the tour agent: how long to show it

  boards: [
    {
      title: 'Middle School STREAM High Scores',
      file: 'leaderboards/middle-school-stream-high-scores.html',
      replay: '#replay', ready: { selector: '#round', text: 'FINAL SCORES' }, settle: 2500, hide: '#full'
    },
    {
      title: 'CS1 High Scores',
      file: 'leaderboards/cs1-high-scores.html',
      replay: '#replay', ready: { selector: '#round', text: 'FINAL SCORES' }, settle: 2500, hide: '#full'
    },
    // CS2 High Scores: add its file to the leaderboards folder, then uncomment.
    // {
    //   title: 'CS2 High Scores',
    //   file: 'leaderboards/cs2-high-scores.html',
    //   replay: '#replay', ready: { selector: '#round', text: 'FINAL SCORES' }, settle: 2500, hide: '#full'
    // },
    {
      title: 'CS1 Code Quest',
      file: 'leaderboards/cs1-code-quest.html',
      parts: '[data-mode]', hide: '#cycle'
    },
    {
      title: 'CS1 FTCsim Grand Prix',
      file: 'leaderboards/cs1-ftcsim-grand-prix.html',
      replay: '#replay', ready: { selector: '#status', text: 'FINAL STANDINGS' }, settle: 1500, hide: '#full'
    },
    {
      title: 'CS1 FTCsim Chaos Mode',
      file: 'leaderboards/cs1-ftcsim-chaos-mode.html',
      parts: '[data-mode]', hide: '#cycle'
    }
  ]
};
