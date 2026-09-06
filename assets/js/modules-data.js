/* The catalogue of modules — the single source for both the module grid and the
   customization playground, mirroring the real app's modules. */
(function () {
  const { $ } = Perch;

  // face:  short pill text + tint, for the playground pills.
  // panel: {title, sub, tag, tint} for the playground panel rows.
  // mini:  a tiny SVG/markup preview for the grid card.
  const MODULES = [
    { group: 'GitHub / CI', key: 'prs', k: 'Pull requests', name: 'Pull requests',
      desc: 'Who’s waiting on your review — with verdict, mergeable state, and live CI progress like “CI 5/10”.',
      face: { t: '2 PRs', tint: 'warning' },
      panel: { title: '#2418 Ship rate limiter', sub: 'acme/api · approved', tag: 'ready', tint: 'good' },
      mini: pillMini('warning', '2 PRs') },
    { group: 'GitHub / CI', key: 'builds', k: 'Builds', name: 'Builds',
      desc: 'Latest GitHub Actions run — passing, running, or failing, with workflow, commit and duration.',
      face: { t: 'CI', tint: 'good', bar: 100 },
      panel: { title: 'deploy.yml', sub: 'main · 1m48s', tag: 'passing', tint: 'good' },
      mini: barMini('good', 100) },
    { group: 'GitHub / CI', key: 'multi', k: 'Multi-repo builds', name: 'Multi-repo builds',
      desc: 'Watch several repos at once. The pill shows the worst state and a red count; the panel lists each.',
      face: { t: '1✗', tint: 'critical' },
      panel: { title: '3 repos', sub: 'acme/api · acme/web · acme/cli', tag: '1 failing', tint: 'critical' },
      mini: pillMini('critical', '1✗') },
    { group: 'GitHub / CI', key: 'deploy', k: 'Deploy health', name: 'Deploy health',
      desc: 'Ping any URL — healthy, degraded, or down — with hysteresis so a blip never flaps the pill.',
      face: { t: 'up', tint: 'good' },
      panel: { title: 'Deploy health', sub: 'api.acme.dev', tag: 'up', tint: 'good' },
      mini: pillMini('good', 'up') },

    { group: 'On your Mac · zero setup, private', key: 'cpu', k: 'CPU vitals', name: 'CPU vitals',
      desc: 'Live CPU with a trend sparkline — a runaway build reads as a rising line, not just a number.',
      face: { t: 'CPU 27%', tint: 'good' },
      panel: { title: 'CPU', sub: '27%', tag: '', tint: 'good' },
      mini: sparkMini() },
    { group: 'On your Mac · zero setup, private', key: 'mem', k: 'Memory', name: 'Memory',
      desc: 'RAM in use, colour-coded so pressure is obvious at a glance.',
      face: { t: 'RAM 61%', tint: 'good' },
      panel: { title: 'Memory', sub: '61%', tag: '', tint: 'good' },
      mini: barMini('good', 61) },
    { group: 'On your Mac · zero setup, private', key: 'net', k: 'Network', name: 'Network',
      desc: 'Live download and upload throughput — watch a big pull or slow deploy move.',
      face: { t: '↓ 1.2 MB/s', tint: 'info' },
      panel: { title: 'Download', sub: '1.2 MB/s', tag: '↑ 240 KB/s', tint: 'info' },
      mini: pillMini('info', '↓ 1.2 MB/s') },
    { group: 'On your Mac · zero setup, private', key: 'batt', k: 'Battery', name: 'Battery',
      desc: 'Charge and charging state — honest “AC” on a desktop, never a fake 0%.',
      face: { t: '82%', tint: 'good' },
      panel: { title: 'Battery', sub: 'charging · 82%', tag: '', tint: 'good' },
      mini: pillMini('good', '⚡ 82%') },
    { group: 'On your Mac · zero setup, private', key: 'clock', k: 'Clock', name: 'Clock',
      desc: '12- or 24-hour, with optional seconds. The simplest possible module.',
      face: { t: '14:30', tint: 'neutral' },
      panel: { title: 'Clock', sub: 'local time', tag: '14:30', tint: 'neutral' },
      mini: pillMini('neutral', '14:30') },
    { group: 'On your Mac · zero setup, private', key: 'port', k: 'Dev server', name: 'Dev server',
      desc: '“Is :3000 up?” Pings a local port so you know your dev server is live — no terminal.',
      face: { t: ':3000', tint: 'good' },
      panel: { title: ':3000', sub: 'listening on 127.0.0.1', tag: 'up', tint: 'good' },
      mini: pillMini('good', ':3000') },
    { group: 'On your Mac · zero setup, private', key: 'clip', k: 'Clipboard', name: 'Clipboard history',
      desc: 'Your recent copies, on-device. Click one to copy it again. Nothing is stored or sent.',
      face: { t: '5', tint: 'neutral' },
      panel: { title: 'git rebase -i HEAD~3', sub: 'on the clipboard now', tag: '', tint: 'info' },
      mini: pillMini('neutral', '📋 5') },
    { group: 'On your Mac · zero setup, private', key: 'shelf', k: 'File shelf', name: 'File shelf',
      desc: 'Drag files onto the panel to stash them; click to reveal in Finder. Paths only.',
      face: { t: 'shelf', tint: 'neutral' },
      panel: { title: 'report.pdf', sub: '…/Downloads/report.pdf', tag: '', tint: 'info' },
      mini: pillMini('neutral', '🗄 3') },
    { group: 'On your Mac · zero setup, private', key: 'timer', k: 'Timer', name: 'Timer / Pomodoro',
      desc: 'A local focus timer with pause and reset right in the panel.',
      face: { t: '24:12', tint: 'info' },
      panel: { title: 'Focus', sub: 'pause · reset', tag: '24:12', tint: 'info' },
      mini: pillMini('info', '⏱ 24:12') },
    { group: 'On your Mac · zero setup, private', key: 'cal', k: 'Next meeting', name: 'Next meeting',
      desc: 'Your next calendar event with a live countdown — amber inside five minutes. Stays on your Mac.',
      face: { t: 'in 8m', tint: 'warning' },
      panel: { title: 'Standup', sub: 'in 8m · 14:30', tag: '', tint: 'warning' },
      mini: pillMini('warning', '📅 in 8m') },
  ];

  Perch.MODULES = MODULES;

  // ---- Render the grid, grouped by section label. ----
  const grid = $('#moduleGrid');
  if (grid) {
    let lastGroup = null;
    MODULES.forEach((m, i) => {
      if (m.group !== lastGroup) {
        const label = document.createElement('div');
        label.className = 'grid-label';
        label.textContent = m.group;
        grid.appendChild(label);
        lastGroup = m.group;
      }
      const card = document.createElement('article');
      card.className = 'card';
      card.setAttribute('data-reveal', '');
      card.style.setProperty('--reveal-delay', `${(i % 4) * 0.05}s`);
      const nn = String(i + 1).padStart(2, '0');
      card.innerHTML = `
        <span class="idx">${nn} — ${m.k}</span>
        <h3>${m.name}</h3>
        <p>${m.desc}</p>
        <div class="mini">${m.mini}</div>`;
      grid.appendChild(card);
      // These cards are injected after reveal.js scanned the page, so register
      // them explicitly — otherwise they'd stay hidden (opacity 0) forever.
      if (Perch.revealObserve) Perch.revealObserve(card);
    });
  }

  // ---- Mini-visual builders ----
  function pillMini(tint, text) {
    return `<span class="pill ${tint}" style="position:static"><span class="dot"></span>${text}</span>`;
  }
  function barMini(tint, pct) {
    return `<span class="pill ${tint}" style="position:static"><span class="dot"></span>CI
      <span class="mini-bar"><i style="width:${pct}%"></i></span></span>`;
  }
  function sparkMini() {
    return `<svg class="spark" viewBox="0 0 120 34" preserveAspectRatio="none" aria-hidden="true">
      <path class="area" d="M0,28 L12,24 24,26 36,18 48,20 60,10 72,16 84,8 96,14 108,6 120,12 L120,34 L0,34 Z"/>
      <path class="line" d="M0,28 L12,24 24,26 36,18 48,20 60,10 72,16 84,8 96,14 108,6 120,12"/>
    </svg>`;
  }
})();
