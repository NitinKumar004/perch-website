/* Glue: hero reveal, the mono ticker, and the problem-section flicker. Runs last
   so the DOM and module data are ready. */
(function () {
  const { $, $$, reduceMotion } = Perch;

  // Hero headline mask-up.
  requestAnimationFrame(() => document.body.classList.add('is-ready'));

  // Fill the ticker with module names (+ a few taglines), duplicated so the
  // marquee loops seamlessly.
  const ticker = $('#ticker');
  if (ticker && Perch.MODULES) {
    const words = Perch.MODULES.map((m) => m.name)
      .concat(['glance, don’t hunt', 'local-only', 'no account', 'free & open source']);
    const half = words.map((w) => `<span class="ticker-item">${w}</span>`).join('');
    ticker.innerHTML = half + half; // two copies → -50% translate loops cleanly
  }

  // Problem section: windows flicker, then calm — the echo of context-switching.
  if (!reduceMotion) {
    $$('[data-win]').forEach((w, i) => {
      let flips = 0;
      const iv = setInterval(() => {
        w.classList.toggle('flash');
        if (++flips > 6 + i) { clearInterval(iv); w.classList.remove('flash'); }
      }, 340 + i * 100);
    });
  }
})();
