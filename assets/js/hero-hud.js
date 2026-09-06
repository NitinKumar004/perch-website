/* Makes the MacBook's HUD feel alive: the notch pills and detail panel cycle
   through real module states on a loop — a build finishing, a review landing,
   a focus timer, an ops board — so the hero reads as a running app, not a
   screenshot. It also quietly showcases the breadth of modules. */
(function () {
  const { $, reduceMotion } = Perch;
  const panel = $('#sPanel');
  if (!panel) return;

  const dot = (c) => `<span class="d" style="background:var(--${c})"></span>`;
  const row = (c, t, g) => `<div class="sp-row">${dot(c)}<span class="t">${t}</span><span class="g">${g}</span></div>`;

  // Each scene = the two pills + three panel rows. Together they tour the app.
  const SCENES = [
    { l: { txt: 'CI', bar: 45, dot: 'warning' }, r: { txt: '3 PR', dot: 'neutral' },
      rows: [ ['warning', 'deploy.yml', '5/10 · running'], ['info', 'CPU', '62%'], ['warning', '#2418 review', 'waiting on you'] ] },
    { l: { txt: 'CI', bar: 100, dot: 'good' }, r: { txt: '2 PR', dot: 'good' },
      rows: [ ['good', 'deploy.yml', '1m48s · passing'], ['info', 'Memory', '61%'], ['info', 'Network', '↓ 1.2 MB/s'] ] },
    { l: { txt: '24:12', bar: null, dot: 'info' }, r: { txt: '14:30', dot: 'neutral' },
      rows: [ ['info', 'Focus timer', '24:12 left'], ['good', 'Dev server', ':3000 up'], ['warning', 'Next: standup', 'in 8m'] ] },
    { l: { txt: '1✗', bar: null, dot: 'critical' }, r: { txt: 'up', dot: 'good' },
      rows: [ ['critical', 'acme/api', 'build failing'], ['good', 'Battery', '82% · charging'], ['neutral', 'Clock', '14:31'] ] },
  ];

  const el = {
    lDot: $('#sLdot'), lTxt: $('#sLtxt'), lBar: $('#sLbar'), lBarWrap: $('#sLbarWrap'),
    rDot: $('#sRdot'), rTxt: $('#sRtxt'),
  };

  function paint(scene) {
    el.lDot.style.background = `var(--${scene.l.dot})`;
    el.lTxt.textContent = scene.l.txt;
    if (scene.l.bar == null) { el.lBarWrap.style.display = 'none'; }
    else { el.lBarWrap.style.display = ''; el.lBar.style.width = scene.l.bar + '%'; }
    el.rDot.style.background = `var(--${scene.r.dot})`;
    el.rTxt.textContent = scene.r.txt;
    panel.innerHTML = scene.rows.map((r) => row(r[0], r[1], r[2])).join('');
  }

  paint(SCENES[0]);
  if (reduceMotion) return; // one representative, static frame

  let i = 0;
  setInterval(() => {
    i = (i + 1) % SCENES.length;
    // Fade the panel out, swap, fade back — the pills cross-transition on their own.
    panel.style.opacity = '0';
    setTimeout(() => { paint(SCENES[i]); panel.style.opacity = '1'; }, 320);
  }, 3200);
})();
