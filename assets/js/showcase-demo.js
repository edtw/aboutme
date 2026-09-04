(() => {
  const run = document.querySelector('#demo-run');
  if (!run) return;
  const pt = run.closest('.demo')?.dataset.lang === 'pt';
  run.addEventListener('click', () => {
    const ops = Number(document.querySelector('#demo-ops').value || 0);
    const arenaKb = Number(document.querySelector('#demo-arena').value || 0);
    const out = document.querySelector('#demo-out');
    const okOps = ops >= 1 && ops <= 64;
    const okArena = arenaKb >= 1 && arenaKb <= 256;
    if (okOps && okArena) {
      out.textContent = pt
        ? `ACEITO: ops=${ops} arena=${arenaKb}KiB dentro dos limites desta demonstração.`
        : `ACCEPT: ops=${ops} arena=${arenaKb}KiB within this demonstration's limits.`;
      out.dataset.state = 'ok';
    } else {
      out.textContent = pt
        ? `REJEITADO: acima do limite. Máximo 64 ops / 256 KiB. Solicitado: ops=${ops} arena=${arenaKb}KiB.`
        : `REJECT: over budget. Maximum 64 ops / 256 KiB. Requested: ops=${ops} arena=${arenaKb}KiB.`;
      out.dataset.state = 'reject';
    }
  });
})();
