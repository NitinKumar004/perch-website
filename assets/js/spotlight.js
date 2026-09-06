/* A soft ember "glance" that follows the cursor — the ambient signature. Off
   under reduced motion and on touch (no pointer to follow). */
(function () {
  const { $, rafThrottle, reduceMotion } = Perch;
  const el = $('#spotlight');
  if (!el || reduceMotion || !window.matchMedia('(pointer:fine)').matches) return;

  const move = rafThrottle((e) => {
    el.style.setProperty('--cx', `${e.clientX}px`);
    el.style.setProperty('--cy', `${e.clientY}px`);
    el.classList.add('on');
  });
  window.addEventListener('mousemove', move, { passive: true });
  window.addEventListener('mouseleave', () => el.classList.remove('on'));
})();
