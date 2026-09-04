(() => {
  // Smooth-scroll offset for sticky header is handled in CSS via scroll-margin.
  // Add visible focus state for keyboard users on older browsers.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.add('kbd');
  }, { once: true });

  // Project filters: progressive enhancement, all cards visible without JS.
  const chips = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.work-card')];
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => { const on = c === chip; c.classList.toggle('active', on); c.setAttribute('aria-pressed', on); });
    cards.forEach((c) => { c.hidden = f !== 'ALL' && c.dataset.track !== f; });
  }));
})();
