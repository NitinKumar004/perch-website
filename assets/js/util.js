/* Shared helpers + the global namespace. Kept classic (no ES modules) so the
   site runs by double-clicking index.html over file://. */
window.Perch = (function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  // Trailing-safe rAF throttle for mousemove-style handlers.
  function rafThrottle(fn) {
    let ticking = false, lastArgs;
    return function (...args) {
      lastArgs = args;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { fn.apply(this, lastArgs); ticking = false; });
    };
  }

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  return { reduceMotion, clamp, rafThrottle, $, $$ };
})();
