/* Live clock in the menu bar — the small touch that sells "this is macOS". */
(function () {
  const el = Perch.$('#mbClock');
  if (!el) return;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function tick() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    el.textContent = `${days[d.getDay()]} ${hh}:${mm}`;
  }
  tick();
  setInterval(tick, 1000 * 15);
})();
