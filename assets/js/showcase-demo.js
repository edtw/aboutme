(() => {
  const run = document.querySelector('#demo-run');
  if (!run) return;
  run.addEventListener('click', () => {
    const ops = Number(document.querySelector('#demo-ops').value || 0);
    const arenaKb = Number(document.querySelector('#demo-arena').value || 0);
    const out = document.querySelector('#demo-out');
    const okOps = ops >= 1 && ops <= 64;
    const okArena = arenaKb >= 1 && arenaKb <= 256;
    if (okOps && okArena) {
      out.textContent = `ACCEPT — ops=${ops} arena=${arenaKb}KiB within M35-style budgets (demo only).`;
      out.dataset.state = 'ok';
    } else {
      out.textContent = `REJECT (fail-closed) — over budget: max 64 ops / 256 KiB in this demo. Requested ops=${ops} arena=${arenaKb}KiB.`;
      out.dataset.state = 'reject';
    }
  });
})();
