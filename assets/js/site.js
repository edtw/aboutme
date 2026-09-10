(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lang = document.documentElement.lang === 'pt-BR' ? 'pt' : 'en';
  const transitionWipe = document.querySelector('.transition-wipe');

  // Content remains visible if motion is reduced or observation is unavailable.
  if (!reduced && 'IntersectionObserver' in window) {
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
  const countLabel = lang === 'pt' ? 'PROJETOS ONLINE' : 'PROJECTS ONLINE';
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

  // HUD clock.
  const clock = document.getElementById('hud-clock');
  if (clock) {
    const tick = () => { clock.textContent = new Date().toLocaleTimeString(lang === 'pt' ? 'pt-BR' : 'en-GB', { hour12: false }); };
    tick();
    setInterval(tick, 1000);
  }

  // Boot strip typewriter.
  const boot = document.getElementById('boot-text');
  if (boot) {
    const lines = lang === 'pt'
      ? ['inicializando runtime...', 'IA local: m35 / gguf', 'red team + blue team', 'escopo: laboratorio isolado']
      : ['initializing runtime...', 'local ai: m35 / gguf', 'red team + blue team', 'scope: isolated lab'];
    if (reduced) {
      boot.textContent = lines[1];
    } else {
      let line = 0;
      let char = 0;
      let deleting = false;
      const step = () => {
        const text = lines[line];
        boot.textContent = text.slice(0, char);
        if (!deleting && char < text.length) { char += 1; setTimeout(step, 42); }
        else if (!deleting) { deleting = true; setTimeout(step, 1700); }
        else if (char > 0) { char -= 1; setTimeout(step, 16); }
        else { deleting = false; line = (line + 1) % lines.length; setTimeout(step, 240); }
      };
      step();
    }
  }

  // Hero canvas: drifting node field, paused when hidden or when motion is reduced.
  const canvas = document.getElementById('hero-canvas');
  if (canvas && !reduced) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      let w = 0;
      let h = 0;
      let nodes = [];
      let raf = 0;
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const total = Math.min(64, Math.max(18, Math.round((w * h) / 30000)));
        nodes = Array.from({ length: total }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.3 + 0.5
        }));
      };
      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
        for (let i = 0; i < nodes.length; i += 1) {
          for (let j = i + 1; j < nodes.length; j += 1) {
            const a = nodes[i];
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 14400) {
              const alpha = (1 - Math.sqrt(d2) / 120) * 0.16;
              ctx.strokeStyle = `rgba(0, 255, 156, ${alpha.toFixed(3)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
        for (const n of nodes) {
          ctx.fillStyle = 'rgba(56, 217, 255, 0.5)';
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        }
        raf = requestAnimationFrame(draw);
      };
      resize();
      draw();
      addEventListener('resize', resize);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
      });
    }
  }

  // Command palette: keyboard-first navigation over real page links.
  const palette = document.getElementById('palette');
  if (palette) {
    const input = document.getElementById('palette-input');
    const list = document.getElementById('palette-list');
    const entries = [];
    const seen = new Set();
    const add = (label, href) => {
      if (!href || seen.has(href)) return;
      seen.add(href);
      entries.push({ label, href });
    };
    add(lang === 'pt' ? 'Início' : 'Home', '#top');
    document.querySelectorAll('.desktop-nav a').forEach((a) => add(a.textContent.trim(), a.getAttribute('href')));
    document.querySelectorAll('.work-link').forEach((a) => add(a.textContent.replace('→', '').trim(), a.getAttribute('href')));
    document.querySelectorAll('.resume-cards a[download]').forEach((a) => add(a.textContent.replace('↓', '').trim(), a.getAttribute('href')));
    const linkedin = document.querySelector('.network-link');
    if (linkedin) add('LinkedIn', linkedin.getAttribute('href'));
    let filtered = entries;
    let active = 0;
    const render = () => {
      list.textContent = '';
      filtered.forEach((entry, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('role', 'option');
        button.setAttribute('aria-selected', index === active ? 'true' : 'false');
        const name = document.createElement('span');
        name.textContent = entry.label;
        const path = document.createElement('small');
        path.textContent = entry.href.startsWith('http') ? 'external' : entry.href;
        button.append(name, path);
        button.addEventListener('click', () => {
          if (transitionWipe && !reduced && entry.href.includes('microruntime')) {
            document.body.classList.add('leaving');
            setTimeout(() => { location.href = entry.href; }, 780);
          } else {
            location.href = entry.href;
          }
        });
        li.append(button);
        list.append(li);
      });
    };
    const open = () => {
      palette.hidden = false;
      input.value = '';
      filtered = entries;
      active = 0;
      render();
      input.focus();
    };
    const close = () => {
      palette.hidden = true;
      input.blur();
    };
    const move = (delta) => {
      if (!filtered.length) return;
      active = (active + delta + filtered.length) % filtered.length;
      render();
      list.children[active]?.scrollIntoView({ block: 'nearest' });
    };
    document.querySelectorAll('[data-palette-open]').forEach((button) => button.addEventListener('click', open));
    palette.addEventListener('click', (event) => { if (event.target === palette) close(); });
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      filtered = entries.filter((entry) => `${entry.label} ${entry.href}`.toLowerCase().includes(query));
      active = 0;
      render();
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') { event.preventDefault(); move(1); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); move(-1); }
      else if (event.key === 'Enter' && filtered[active]) { location.href = filtered[active].href; }
      else if (event.key === 'Escape') { close(); }
    });
    addEventListener('keydown', (event) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? '');
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        palette.hidden ? open() : close();
      } else if (event.key === '/' && !typing && palette.hidden) {
        event.preventDefault();
        open();
      } else if (event.key === 'Escape' && !palette.hidden) {
        close();
      }
    });
  }

  // Page transition: leaving the portfolio for the operator case study.
  if (!document.body.classList.contains('showcase-page')) {
    document.querySelectorAll('a[href*="microruntime"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (reduced || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
        if (!transitionWipe) return;
        event.preventDefault();
        document.body.classList.add('leaving');
        setTimeout(() => { location.href = link.href; }, 780);
      });
    });
  }
})();
