/* The interactive "build your own notch". Click a chip to cycle its slot
   (Left → Right → Panel → Off); the mock notch updates live. Presets reconfigure
   in one click. Fully keyboard-operable and reset-able. */
(function () {
  const { $ } = Perch;
  const chipsEl = $('#pgChips');
  const leftPill = $('#pgLeft');
  const rightPill = $('#pgRight');
  const panel = $('#pgPanel');
  if (!chipsEl || !Perch.MODULES) return;

  // The subset offered in the playground (a readable handful, not all 15).
  const KEYS = ['combined', 'prs', 'builds', 'deploy', 'cpu', 'thermal', 'swap', 'disk', 'net', 'port', 'timer', 'clock', 'cal'];
  const byKey = Object.fromEntries(Perch.MODULES.map((m) => [m.key, m]));
  const mods = KEYS.map((k) => byKey[k]).filter(Boolean);

  const PRESETS = {
    work:  { builds: 'left', prs: 'right', deploy: 'panel', cpu: 'panel' },
    focus: { timer: 'left', clock: 'right', cpu: 'panel' },
    ops:   { deploy: 'left', net: 'right', builds: 'panel', port: 'panel', cpu: 'panel' },
  };

  const ORDER = ['off', 'left', 'right', 'panel'];
  let slots = {};   // key -> slot

  function applyPreset(name) {
    slots = {};
    mods.forEach((m) => (slots[m.key] = 'off'));
    Object.entries(PRESETS[name] || {}).forEach(([k, s]) => { if (k in slots) slots[k] = s; });
    render();
  }

  function cycle(key) {
    const next = ORDER[(ORDER.indexOf(slots[key]) + 1) % ORDER.length];
    // A pill holds exactly one module — displace whoever's there.
    if (next === 'left' || next === 'right') {
      Object.keys(slots).forEach((k) => { if (k !== key && slots[k] === next) slots[k] = 'off'; });
    }
    slots[key] = next;
    render();
  }

  function faceHTML(m) {
    const bar = m.face.bar != null
      ? `<span class="mini-bar"><i style="width:${m.face.bar}%"></i></span>` : '';
    return `<span class="dot"></span><span>${m.face.t}</span>${bar}`;
  }

  function setPill(el, side, mod) {
    if (!mod) { el.className = `pill ${side} neutral`; el.innerHTML = `<span class="dot"></span><span>—</span>`; return; }
    el.className = `pill ${side} ${mod.face.tint}`;
    el.innerHTML = faceHTML(mod);
  }

  function render() {
    // Pills.
    setPill(leftPill, 'left', mods.find((m) => slots[m.key] === 'left'));
    setPill(rightPill, 'right', mods.find((m) => slots[m.key] === 'right'));

    // Panel rows.
    const panelMods = mods.filter((m) => slots[m.key] === 'panel');
    panel.innerHTML = panelMods.length
      ? panelMods.map((m) => `
        <div class="panel-row ${m.panel.tint}">
          <span class="icon">•</span>
          <div class="body"><div class="title">${m.panel.title}</div><div class="sub">${m.panel.sub}</div></div>
          ${m.panel.tag ? `<span class="tag">${m.panel.tag}</span>` : ''}
        </div>`).join('')
      : `<div class="panel-row"><div class="body"><div class="sub" style="padding:4px 0">Assign a module to the panel to see it here.</div></div></div>`;

    // Chips reflect their slot.
    chipsEl.querySelectorAll('.chip').forEach((chip) => {
      const key = chip.dataset.key;
      const slot = slots[key];
      chip.dataset.slot = slot;
      chip.querySelector('.slot-flag').textContent = slot === 'off' ? 'Off' : slot;
      chip.setAttribute('aria-label', `${byKey[key].name}: ${slot === 'off' ? 'not shown' : 'in ' + slot}. Activate to change.`);
      chip.setAttribute('aria-selected', String(slot !== 'off'));
    });

    // Presets highlight only if the layout still matches one.
    document.querySelectorAll('.preset-btn').forEach((b) => {
      b.classList.toggle('active', matchesPreset(b.dataset.preset));
    });
  }

  function matchesPreset(name) {
    const p = PRESETS[name] || {};
    return mods.every((m) => (slots[m.key] === 'off' ? !(m.key in p) : p[m.key] === slots[m.key]));
  }

  // Build chips once.
  mods.forEach((m) => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.dataset.key = m.key;
    chip.setAttribute('role', 'option');
    chip.innerHTML = `<span class="slot-flag">Off</span>${m.name}`;
    chip.addEventListener('click', () => cycle(m.key));
    chipsEl.appendChild(chip);
  });

  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
  });

  // Demo switches (visual only).
  document.querySelectorAll('[data-switch]').forEach((sw) => {
    sw.setAttribute('role', 'switch');
    sw.setAttribute('tabindex', '0');
    sw.setAttribute('aria-checked', String(sw.classList.contains('on')));
    const toggle = () => { const on = sw.classList.toggle('on'); sw.setAttribute('aria-checked', String(on)); };
    sw.addEventListener('click', toggle);
    sw.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  applyPreset('work');
})();
