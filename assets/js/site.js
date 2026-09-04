(() => {
  // Content remains visible if motion is reduced or observation is unavailable.
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  // Project filters: progressive enhancement, all cards visible without JS.
  const chips = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.work-item')];
  const count = document.querySelector('.filter-count');
  const countLabel = document.documentElement.lang === 'pt-BR' ? 'PROJETOS ONLINE' : 'PROJECTS ONLINE';
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => { const on = c === chip; c.classList.toggle('active', on); c.setAttribute('aria-pressed', on); });
    cards.forEach((c) => { c.hidden = f !== 'ALL' && c.dataset.track !== f; });
    const visible = cards.filter((card) => !card.hidden).length;
    if (count) count.textContent = `${String(visible).padStart(2, '0')} ${countLabel}`;
  }));

  document.querySelectorAll('.mobile-nav nav a').forEach((link) => link.addEventListener('click', () => {
    link.closest('details')?.removeAttribute('open');
  }));
})();
