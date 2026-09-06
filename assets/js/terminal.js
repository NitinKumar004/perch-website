/* The install terminal: types the command out when scrolled into view, runs a
   faux install, lands on success. Copy button actually copies. */
(function () {
  const { $ } = Perch;
  const term = $('#term');
  const copyBtn = $('#copyBtn');
  const CMD = 'curl -fsSL https://raw.githubusercontent.com/NitinKumar004/perch/main/get.sh | bash';

  // Copy works regardless of animation.
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(CMD);
        copyBtn.textContent = 'Copied ✓';
      } catch { copyBtn.textContent = 'Copy failed'; }
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1600);
    });
  }
  if (!term) return;

  const OUT = [
    '▸ downloading Perch…',
    '  sha256 9f2c…verified',
    '▸ installing to /Applications',
    '<ok>✓ Perch is live in your notch.</ok>',
  ];

  function staticRender() {
    term.innerHTML =
      `<div><span class="prompt">$</span> <span class="cmd">${CMD}</span></div>` +
      OUT.map((l) => `<div class="term-out">${l.replace('<ok>', '<span class="ok">').replace('</ok>', '</span>')}</div>`).join('');
  }

  if (Perch.reduceMotion) { staticRender(); return; }

  let played = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting && !played) { played = true; play(); } });
  }, { threshold: 0.5 });
  io.observe(term);

  function play() {
    term.innerHTML = `<div><span class="prompt">$</span> <span class="cmd" id="typed"></span><span class="term-cursor"></span></div>`;
    const typed = $('#typed');
    let i = 0;
    (function type() {
      if (i <= CMD.length) {
        typed.textContent = CMD.slice(0, i++);
        setTimeout(type, 22 + Math.random() * 30);
      } else {
        emitLine(0);
      }
    })();

    function emitLine(n) {
      if (n >= OUT.length) { $('.term-cursor')?.remove(); return; }
      setTimeout(() => {
        const div = document.createElement('div');
        div.className = 'term-out';
        div.innerHTML = OUT[n].replace('<ok>', '<span class="ok">').replace('</ok>', '</span>');
        term.appendChild(div);
        term.querySelector('.term-cursor') && term.appendChild(term.querySelector('.term-cursor'));
        emitLine(n + 1);
      }, 480);
    }
  }
})();
