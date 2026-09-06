/* Two jobs tied to which section you're in:
   1. Highlight the left index rail.
   2. Narrate the menu-bar notch — its pills change per section, so the notch is
      a live character that follows the story (the product, demonstrating itself). */
(function () {
  const { $, $$ } = Perch;
  const rail = $('#rail');
  const barLeft = $('#barLeft'), barLeftTxt = $('#barLeftTxt');
  const barRight = $('#barRight'), barRightTxt = $('#barRightTxt');

  // Per-section notch state: [leftTint, leftText, rightTint, rightText].
  const NARRATION = {
    hero:      ['good', 'all good',  'neutral', 'Perch'],
    problem:   ['warning', '7 tabs', 'neutral', 'still checking'],
    demo:      ['info', 'CI 5/10',   'good', '2 PRs'],
    modules:   ['good', '15 modules','neutral', 'your pick'],
    customize: ['good', 'your notch','info', 'live'],
    principles:['good', 'accurate',  'good', 'local'],
    install:   ['good', 'ready',     'good', '60s'],
    hood:      ['good', 'swift 6',   'good', '76 tests'],
  };

  function narrate(id) {
    const n = NARRATION[id];
    if (!n || !barLeft) return;
    barLeft.className = `mb-pill l ${n[0]}`; barLeftTxt.textContent = n[1];
    barRight.className = `mb-pill r ${n[2]}`; barRightTxt.textContent = n[3];
  }

  const sections = $$('main section[id], #hood');
  const railLinks = rail ? $$('a', rail) : [];

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      narrate(id);
      railLinks.forEach((a) => a.classList.toggle('active', a.dataset.sec === id));
    });
  }, { threshold: 0.01, rootMargin: '-45% 0px -45% 0px' });

  sections.forEach((s) => io.observe(s));
})();
