/* Wide-screen layout helper: the left column (.side) must fit one screen height because it never scrolls.
   On short screens this shrinks it just enough to fit; on tall screens and in the stacked layout it does nothing. */
(function () {
  const side = document.querySelector('.side');
  if (!side) return;
  let queued = false;
  function fit() {
    queued = false;
    side.style.zoom = '';
    side.style.height = '';
    if (getComputedStyle(side).position !== 'sticky') return;
    const need = side.scrollHeight, have = side.clientHeight;
    if (need > have + 1) {
      const z = Math.max(0.6, have / (need + 8));   // a little slack for rounding
      side.style.zoom = z;
      side.style.height = (window.innerHeight / z) + 'px';
    }
  }
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(fit); } };
  window.addEventListener('resize', later);
  // podiums, awards and stats are filled in after load, so refit when the column's content changes
  new MutationObserver(later).observe(side, { childList: true, subtree: true, characterData: true });
  document.fonts && document.fonts.ready.then(later);
  fit();
})();
