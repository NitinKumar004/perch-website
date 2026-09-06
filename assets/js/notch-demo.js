/* The pinned centrepiece. As you scroll, the notch device advances through a
   scripted story — build running → green → a review lands → the whole board —
   with the pills AND the panel rows changing each step (touring ~12 modules).
   The device also scales gently with scroll progress so it feels alive. */
(function () {
  const { $, clamp, reduceMotion } = Perch;

  const track = $('#demo');
  const scaleEl = document.querySelector('.demo-scale');
  const leftPill = $('#demoLeft'), bar = $('#demoBar'), barWrap = $('#demoBarWrap'), count = $('#demoCount');
  const rightPill = $('#demoRight'), rightTxt = $('#demoRightTxt');
  const panel = $('#demoPanel'), title = $('#demoTitle'), text = $('#demoText');
  const dots = document.querySelectorAll('.demo-progress i');
  if (!track || !panel) return;

  const row = (tint, t, sub, tag, barPct) => `
    <div class="panel-row ${tint}">
      <span class="pdot"></span>
      <div class="body"><div class="title">${t}</div><div class="sub">${sub}</div>${barPct != null ? `<div class="panel-bar"><i style="width:${barPct}%"></i></div>` : ''}</div>
      ${tag ? `<span class="tag">${tag}</span>` : ''}
    </div>`;

  const STEPS = [
    { title: 'A build kicks off',
      text: 'The left pill tracks CI live — progress and all.',
      left: { count: '2/10', bar: 20, tint: 'info' }, right: { txt: '3 PRs', tint: 'neutral' },
      rows: [ ['info', 'CI · main', 'deploy.yml · 2/10 checks', 'running', 20], ['neutral', 'CPU', '41% · steady', ''], ['warning', '#2418 review', 'acme/api', 'yours'] ] },
    { title: 'It turns green',
      text: 'Passing — and you never left your editor to find out.',
      left: { count: '', bar: 100, tint: 'good' }, right: { txt: '3 PRs', tint: 'neutral' },
      rows: [ ['good', 'CI · main', 'deploy.yml · passing', '1m48s'], ['info', 'Memory', '58%'], ['info', 'Network', '↓ 2.1 MB/s'] ] },
    { title: 'A review lands',
      text: 'Your queue updates itself — one glance, you know.',
      left: { count: '', bar: 100, tint: 'good' }, right: { txt: '2 PRs', tint: 'good' },
      rows: [ ['good', '#2418 Ship rate limiter', 'acme/api · approved', 'ready'], ['good', 'Deploy health', 'api.acme.dev', 'up'], ['neutral', 'Clock', 'local time', '14:30'] ] },
    { title: 'Everything, at a glance',
      text: 'The worst state always wins the colour. Nothing hidden.',
      left: { txt: '1✗', tint: 'critical' }, right: { txt: 'up', tint: 'good' },
      rows: [ ['critical', 'acme/api', 'build failing', 'red'], ['good', 'Battery', '82% · charging'], ['warning', 'Next: standup', 'in 8m'] ] },
  ];

  let current = -1;
  function apply(i) {
    if (i === current) return;
    current = i;
    const s = STEPS[i];

    // Caption: slide + fade.
    [title, text].forEach((el) => { el.style.opacity = 0; el.style.transform = 'translateY(8px)'; });
    setTimeout(() => {
      title.textContent = s.title; text.textContent = s.text;
      [title, text].forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
    }, reduceMotion ? 0 : 180);

    // Left pill: some steps are a bar+count (CI), one is a plain badge (builds).
    leftPill.className = `pill left ${s.left.tint}`;
    if (s.left.bar != null) {
      barWrap.style.display = ''; count.style.display = '';
      bar.style.width = s.left.bar + '%'; count.textContent = s.left.count;
      setLeftLabel('CI');
    } else {
      barWrap.style.display = 'none'; count.style.display = 'none';
      setLeftLabel(s.left.txt);
    }
    rightPill.className = `pill right ${s.right.tint}`;
    rightTxt.textContent = s.right.txt;

    // Panel: cross-fade the rows.
    panel.style.opacity = 0;
    setTimeout(() => {
      panel.innerHTML = s.rows.map((r) => row(r[0], r[1], r[2], r[3], r[4])).join('');
      panel.style.opacity = 1;
    }, reduceMotion ? 0 : 180);

    dots.forEach((d, di) => d.classList.toggle('on', di <= i));
  }

  // The left pill's text label sits between the dot and the mini-bar.
  function setLeftLabel(txt) {
    const label = leftPill.childNodes[1]; // text node after .dot
    if (label && label.nodeType === 3) label.textContent = ' ' + txt + ' ';
  }

  if (reduceMotion) { apply(3); scaleEl.style.transform = 'scale(1.04)'; return; }

  function onScroll() {
    const rect = track.getBoundingClientRect();
    const total = track.offsetHeight - window.innerHeight;
    const progress = clamp(-rect.top / total, 0, 1);
    if (scaleEl) scaleEl.style.transform = `scale(${1 + progress * 0.08})`;
    apply(clamp(Math.floor(progress * STEPS.length), 0, STEPS.length - 1));
  }
  apply(0);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();
