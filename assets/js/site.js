(() => {
  // Smooth-scroll offset for sticky header is handled in CSS via scroll-margin.
  // Add visible focus state for keyboard users on older browsers.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.add('kbd');
  }, { once: true });
})();
