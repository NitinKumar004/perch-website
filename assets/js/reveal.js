/* Scroll reveals via IntersectionObserver + count-up stats. Exposes
   Perch.revealObserve so elements injected later (module cards) still reveal. */
(function () {
  const { $$, reduceMotion } = Perch;

  if (reduceMotion) {
    // Everything shown immediately; still expose the hook for injected nodes.
    Perch.revealObserve = (el) => {
      el.classList.add('revealed');
      if (el.hasAttribute('data-count')) el.textContent = el.getAttribute('data-count');
    };
    $$('[data-reveal]').forEach(Perch.revealObserve);
    $$('[data-count]').forEach(Perch.revealObserve);
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      if (entry.target.hasAttribute('data-count')) countUp(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  Perch.revealObserve = (el) => io.observe(el);
  $$('[data-reveal]').forEach(Perch.revealObserve);
  $$('[data-count]').forEach(Perch.revealObserve);

  function countUp(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (target === 0) { el.textContent = '0'; return; }
    const dur = 1100, start = performance.now();
    function tick(now) {
      const p = Perch.clamp((now - start) / dur, 0, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
