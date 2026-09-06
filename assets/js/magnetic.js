/* Magnetic buttons: the button (and its label) drift toward the cursor, then
   spring back on leave. Skipped entirely under reduced motion. */
(function () {
  const { $$, reduceMotion } = Perch;
  if (reduceMotion) return;

  $$('[data-magnetic]').forEach((btn) => {
    const label = btn.querySelector('.label') || btn;
    const strength = 0.35;

    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      label.style.transform = `translate(${x * strength * 0.5}px, ${y * strength * 0.5}px)`;
    });

    const reset = () => { btn.style.transform = ''; label.style.transform = ''; };
    btn.addEventListener('mouseleave', reset);
    btn.addEventListener('blur', reset);
  });
})();
