/* Pointer-tracking sheen on glass cards — sets --mx/--my custom props the CSS
   radial-gradient reads. Throttled to a frame; disabled under reduced motion. */
(function () {
  const { $$, rafThrottle, reduceMotion } = Perch;
  if (reduceMotion) return;

  function attach(card) {
    const move = rafThrottle((e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
    card.addEventListener('mousemove', move);
  }

  // Cards are injected by modules-data.js, so run after that on load.
  window.addEventListener('load', () => $$('.card').forEach(attach));
})();
