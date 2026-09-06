/* Menu-bar interactions: mobile menu toggle. The bar itself is always frosted. */
(function () {
  const { $ } = Perch;
  const toggle = $('#mbToggle');
  const menu = $('#mbMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });
})();
