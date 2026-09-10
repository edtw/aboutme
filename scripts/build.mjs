import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const cv = JSON.parse(fs.readFileSync(path.join(root, 'src/cv.json'), 'utf8'));
const L = (obj, lang) => obj?.[lang] ?? obj?.en ?? '';
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clean = (s) => s.replace(/[ \t]+$/gm, '');
const SITE = cv.meta.siteUrl;

const T = {
  en: {
    navWork: 'Work', navProfile: 'Profile', navSecurity: 'Security', navResume: 'Resume', navContact: 'Contact',
    skip: 'Skip to content', routeHome: 'Portfolio', routeRuntime: 'Micro Runtime', menu: 'Menu'
  },
  pt: {
    navWork: 'Projetos', navProfile: 'Perfil', navSecurity: 'Segurança', navResume: 'Currículo', navContact: 'Contato',
    skip: 'Pular para o conteúdo', routeHome: 'Portfólio', routeRuntime: 'Micro Runtime', menu: 'Menu'
  }
};

function routeConfig(lang, page) {
  const runtime = page === 'runtime';
  const prefix = runtime ? (lang === 'pt' ? '../../' : '../') : (lang === 'pt' ? '../' : '');
  const home = `${prefix}${lang === 'pt' ? 'pt/' : ''}`;
  const alternate = runtime
    ? (lang === 'pt' ? `${SITE}/microruntime/` : `${SITE}/pt/microruntime/`)
    : (lang === 'pt' ? `${SITE}/` : `${SITE}/pt/`);
  const alternateHref = runtime
    ? (lang === 'pt' ? '../../microruntime/' : '../pt/microruntime/')
    : (lang === 'pt' ? '../' : 'pt/');
  return { prefix, home, alternate, alternateHref };
}

function head({ lang, title, desc, canonical, route }) {
  const ogLocale = lang === 'pt' ? 'pt_BR' : 'en_US';
  const alternateLang = lang === 'pt' ? 'en' : 'pt-BR';
  const defaultUrl = lang === 'en' ? canonical : route.alternate;
  return `  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="${esc(desc)}" />
  <meta name="theme-color" content="#04060a" />
  <meta name="color-scheme" content="dark" />
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="${alternateLang}" href="${route.alternate}" />
  <link rel="alternate" hreflang="x-default" href="${defaultUrl}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:locale" content="${ogLocale}" />
  <meta property="og:image" content="${SITE}/assets/social-card.png" />
  <meta property="og:image:alt" content="YUEE systems engineering portfolio" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <title>${esc(title)}</title>
  <link rel="icon" href="${route.prefix}favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="${route.prefix}styles.css" />
  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: cv.person.name, url: SITE, sameAs: [cv.person.profiles.github, cv.person.profiles.linkedin], address: { '@type': 'PostalAddress', addressLocality: 'Rio de Janeiro', addressCountry: 'BR' }, knowsAbout: ['Red Team', 'Blue Team', 'Cybersecurity Research', 'Detection Engineering', 'Rust', 'Python', 'TypeScript', 'C++', 'Local AI inference', 'Distributed systems', 'Roblox Studio'] })}</script>`;
}

function header(lang, page, route) {
  const t = T[lang];
  const other = lang === 'en'
    ? { label: 'PT', aria: 'Mudar para português', hreflang: 'pt-BR' }
    : { label: 'EN', aria: 'Switch to English', hreflang: 'en' };
  const nav = `<a href="${route.home}#work">${t.navWork}</a>
          <a href="${route.home}#profile">${t.navProfile}</a>
          <a href="${route.home}#security">${t.navSecurity}</a>
          <a href="${route.home}#resume">${t.navResume}</a>
          <a href="${route.home}#contact">${t.navContact}</a>`;
  return `<a class="skip-link" href="#main">${t.skip}</a>
    <header class="site-header">
      <a class="brand" href="${route.home}#top" aria-label="Felipe Yuee Lemos home">
        <span class="brand-mark">YUEE.SYS</span>
        <span class="route-label">/ ${page === 'runtime' ? t.routeRuntime : t.routeHome}</span>
      </a>
      <nav class="desktop-nav" aria-label="${lang === 'pt' ? 'Navegação principal' : 'Main navigation'}">
          ${nav}
      </nav>
      <div class="header-actions">
        <span class="hud-clock" id="hud-clock" aria-hidden="true">--:--:--</span>
        <button class="palette-trigger" type="button" data-palette-open aria-label="${lang === 'pt' ? 'Abrir paleta de comandos' : 'Open command palette'}">CMD <kbd>&#8984;K</kbd></button>
        <a class="network-link" href="${cv.person.profiles.linkedin}" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
        <a class="lang-link" href="${route.alternateHref}" hreflang="${other.hreflang}" aria-label="${other.aria}">${other.label}</a>
        <details class="mobile-nav">
          <summary>${t.menu}</summary>
          <nav aria-label="${lang === 'pt' ? 'Navegação móvel' : 'Mobile navigation'}">${nav}</nav>
        </details>
      </div>
    </header>`;
}

function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function sparkline(points, label) {
  return `<svg class="spark" viewBox="0 0 120 28" aria-hidden="true"><polyline points="${points}" fill="none" stroke="currentColor" stroke-width="1.2" /><circle cx="120" cy="${points.split(' ').pop().split(',')[1]}" r="2" fill="currentColor" stroke="none" /><title>${label}</title></svg>`;
}

function treeDots() {
  const rand = seededRandom(20260904);
  const dots = [];
  let i = 0;
  const push = (x, y, r, o, accent) => {
    const cls = accent ? 'tree-dot accent' : (i % 6 === 0 ? 'tree-dot tw' : 'tree-dot');
    dots.push(`<circle class="${cls}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" opacity="${o.toFixed(2)}" style="animation-delay:${(rand() * 4).toFixed(2)}s"/>`);
    i += 1;
  };
  for (let k = 0; k < 620; k += 1) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand());
    const x = 240 + Math.cos(a) * r * 138 * (0.75 + 0.25 * rand());
    const y = 146 + Math.sin(a) * r * 94 * (0.7 + 0.3 * rand());
    if (y > 232 && Math.abs(x - 240) < 24) continue;
    push(x, y, 0.6 + rand() * 0.9, 0.25 + rand() * 0.65, rand() > 0.986);
  }
  for (let k = 0; k < 90; k += 1) {
    const t = rand();
    const y = 196 + t * 102;
    const w = 6 + t * 10;
    push(240 + (rand() - 0.5) * 2 * w + Math.sin(t * 3) * 3, y, 0.7 + rand() * 0.8, 0.5 + rand() * 0.4, false);
  }
  for (let k = 0; k < 160; k += 1) {
    const x = 240 + (rand() - 0.5) * 360 * (0.4 + rand() * 0.6);
    push(x, 296 + rand() * 22 - Math.abs(x - 240) * 0.02 * rand(), 0.5 + rand() * 0.9, 0.2 + rand() * 0.5, rand() > 0.988);
  }
  return dots.join('');
}

function asciiBackdrop(lang) {
  const en = lang === 'en';
  const cells = [
    { label: en ? 'RUNTIME' : 'RUNTIME', value: 'NOMINAL', spark: '0,22 18,20 36,21 54,16 72,17 90,11 108,13 120,8' },
    { label: en ? 'LOCAL AI' : 'IA LOCAL', value: 'M35 / GGUF', spark: '0,10 20,12 40,11 60,15 80,16 100,20 120,21' },
    { label: en ? 'FLEET' : 'FROTA', value: 'mTLS OK', spark: '0,18 25,17 50,15 75,14 100,10 120,9' },
    { label: en ? 'HARDENING' : 'HARDENING', value: 'W^X ON', spark: '0,24 20,22 40,23 60,18 80,16 100,12 120,9' },
    { label: en ? 'DISPATCH' : 'DISPATCH', value: '256 SLOTS', spark: '0,14 30,14 60,13 90,13 120,12' },
    { label: en ? 'STACK' : 'STACK', value: 'RS · PY · TS', spark: '0,20 24,18 48,18 72,14 96,14 120,10' }
  ];
  return `<div class="ascii-console tree-console" role="img" aria-label="${en ? 'Dot-matrix system tree with runtime telemetry' : 'Árvore de sistema em matriz de pontos com telemetria de runtime'}">
    <div class="ascii-console-head"><span>YUEE.SYS • ${en ? 'CONNECTED' : 'CONECTADO'}</span><span>${en ? 'TODAY' : 'HOJE'}</span></div>
    <div class="ascii-bg tree-body"><svg class="tree-svg" viewBox="0 0 480 330" aria-hidden="true">${treeDots()}</svg>
      <div class="telemetry-grid">${cells.map((c) => `<div class="tele-cell"><span>${c.label}</span>${sparkline(c.spark, c.label)}<b>${c.value}</b></div>`).join('')}</div>
    </div>
    <div class="ascii-console-foot"><span>RX 011001</span><b></b><span>LAT 00.7</span></div>
  </div>`;
}

function waveField() {
  const rand = seededRandom(77031);
  const parts = [];
  for (let k = 0; k < 60; k += 1) {
    parts.push(`<circle class="wave-star" cx="${(rand() * 1200).toFixed(1)}" cy="${(rand() * 120).toFixed(1)}" r="${(0.5 + rand() * 0.7).toFixed(2)}" opacity="${(0.2 + rand() * 0.5).toFixed(2)}" style="animation-delay:${(rand() * 5).toFixed(2)}s"/>`);
  }
  let bands = '';
  for (let layer = 0; layer < 4; layer += 1) {
    let d = '';
    for (let x = 0; x <= 1200; x += 9) {
      const y = 212 + layer * 24 + Math.sin(x / 130 + layer * 1.1) * 22 + Math.sin(x / 47 + layer) * 8 + (rand() - 0.5) * 10;
      const edge = 1 - Math.abs(x - 600) / 900;
      d += `<circle class="wave-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.6 + rand() * 1.1 + (layer === 0 ? 0.4 : 0)).toFixed(2)}" opacity="${(0.18 + edge * 0.5).toFixed(2)}"/>`;
    }
    bands += `<g class="wave-swell" style="animation-delay:${(layer * 0.9).toFixed(1)}s">${d}</g>`;
  }
  const figure = (cx, baseY, dir) => {
    let f = '';
    const dot = (x, y, r, o) => { f += `<circle class="wave-dot figure-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" opacity="${o.toFixed(2)}"/>`; };
    for (let k = 0; k < 42; k += 1) {
      const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * 9;
      dot(cx + Math.cos(a) * r, baseY - 92 + Math.sin(a) * r, 0.8 + rand() * 0.7, 0.55 + rand() * 0.4);
    }
    const seg = (x1, y1, x2, y2, n, w) => {
      for (let k = 0; k < n; k += 1) {
        const t = rand();
        dot(x1 + (x2 - x1) * t + (rand() - 0.5) * w, y1 + (y2 - y1) * t + (rand() - 0.5) * w, 0.7 + rand() * 0.7, 0.45 + rand() * 0.45);
      }
    };
    seg(cx, baseY - 80, cx, baseY - 30, 46, 9);
    seg(cx, baseY - 66, cx + dir * 46, baseY - 60, 30, 6);
    seg(cx, baseY - 64, cx - dir * 12, baseY - 34, 22, 7);
    seg(cx, baseY - 30, cx - 10, baseY, 26, 7);
    seg(cx, baseY - 30, cx + 11, baseY, 26, 7);
    return f;
  };
  return `<div class="wave-field" aria-hidden="true"><svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice">${parts.join('')}${bands}<g>${figure(505, 196, 1)}${figure(608, 188, -1)}</g></svg></div>`;
}

function palette(lang) {
  const en = lang === 'en';
  return `<div class="palette" id="palette" hidden>
      <div class="palette-panel" role="dialog" aria-modal="true" aria-label="${en ? 'Command palette' : 'Paleta de comandos'}">
        <div class="palette-input"><span class="prompt" aria-hidden="true">root@yuee:~$</span><input id="palette-input" type="search" autocomplete="off" placeholder="${en ? 'jump to section...' : 'ir para a seção...'}" aria-label="${en ? 'Search sections' : 'Buscar seções'}" /></div>
        <ul class="palette-list" id="palette-list" role="listbox" aria-label="${en ? 'Sections' : 'Seções'}"></ul>
        <div class="palette-hint"><span>↑↓ ${en ? 'navigate' : 'navegar'}</span><span>↵ ${en ? 'open' : 'abrir'}</span><span>esc ${en ? 'close' : 'fechar'}</span></div>
      </div>
    </div>`;
}

function runtimeDiagram(lang) {
  const en = lang === 'en';
  return `<div class="runtime-diagram" role="img" aria-label="${en ? 'Micro Runtime flow from bounded model output through token dispatch to closed host operations' : 'Fluxo do Micro Runtime, da saída limitada do modelo ao dispatch de tokens e operações fechadas do host'}">
    <div class="diagram-head"><span>TRACE / RED-001</span><span>BOUNDARIES: ENFORCED</span></div>
    <div class="diagram-flow">
      <div><small>01</small><strong>${en ? 'LOCAL MODEL' : 'MODELO LOCAL'}</strong><span>GGUF / M35</span></div>
      <i aria-hidden="true">&gt;</i>
      <div><small>02</small><strong>TOKEN ENGINE</strong><span>u32 / budgeted</span></div>
      <i aria-hidden="true">&gt;</i>
      <div><small>03</small><strong>BROKER</strong><span>one-shot / 256</span></div>
      <i aria-hidden="true">&gt;</i>
      <div><small>04</small><strong>HOST OP</strong><span>closed enum</span></div>
    </div>
    <div class="budget-line"><span>MEMORY</span><b></b><strong>HARD LIMIT</strong></div>
  </div>`;
}

function projectLink(project, lang, route) {
  if (!project.link) return `<span class="work-status">${lang === 'pt' ? 'ESTUDO PRIVADO' : 'PRIVATE CASE STUDY'}</span>`;
  if (project.link.kind === 'showcase') {
    return `<a class="work-link" href="${route.prefix}${lang === 'pt' ? 'pt/microruntime/' : 'microruntime/'}">${lang === 'pt' ? 'Inspecionar caso' : 'Inspect case study'} <span aria-hidden="true">→</span></a>`;
  }
  return `<a class="work-link" href="${project.link.url}" target="_blank" rel="noreferrer">${lang === 'pt' ? 'Abrir projeto' : 'Open live project'} <span aria-hidden="true">↗</span></a>`;
}

function projectCard(project, lang, index, route) {
  const major = ['karma', 'nexus'].includes(project.id);
  return `<article class="work-card ${major ? 'work-card-major' : 'work-card-compact'} work-item reveal" data-track="${project.track}" style="--d:${(index % 3) * 70}ms">
    <div class="work-top"><span>0${index + 1}</span><span>${project.track}</span><span>${esc(project.codename)}</span></div>
    <div class="work-copy">
      <h3>${esc(project.name)}${project.org ? ` <small>/ ${esc(project.org)}</small>` : ''}</h3>
      <p>${esc(L(project.blurb, lang))}</p>
    </div>
    <dl>
      <div><dt>${lang === 'pt' ? 'CONTRIBUIÇÃO' : 'CONTRIBUTION'}</dt><dd>${esc(L(project.role, lang))}</dd></div>
      <div><dt>${lang === 'pt' ? 'FOCO' : 'FOCUS'}</dt><dd>${esc(L(project.focus, lang))}</dd></div>
    </dl>
    <p class="stack">${esc(project.stack)}</p>
    ${projectLink(project, lang, route)}
  </article>`;
}

function portfolioPage(lang) {
  const en = lang === 'en';
  const route = routeConfig(lang, 'portfolio');
  const canonical = en ? `${SITE}/` : `${SITE}/pt/`;
  const title = en ? 'Felipe "Yuee" Lemos | Systems Software Engineer' : 'Felipe "Yuee" Lemos | Engenheiro de Software de Sistemas';
  const desc = L(cv.person.statement, lang);
  const projects = [...cv.projects].sort((a, b) => (a.order ?? 9) - (b.order ?? 9));
  const flagship = projects.find((project) => project.id === 'micro-runtime');
  const remaining = projects
    .filter((project) => project.id !== 'micro-runtime')
    .sort((a, b) => Number(!['karma', 'nexus'].includes(a.id)) - Number(!['karma', 'nexus'].includes(b.id)));
  const tracks = ['ALL', 'SYSTEMS', 'PRODUCT', 'SECURITY', 'GAMES'];
  const trackLabels = en
    ? { ALL: 'ALL WORK', SYSTEMS: 'SYSTEMS', PRODUCT: 'PRODUCT', SECURITY: 'SECURITY', GAMES: 'GAMES' }
    : { ALL: 'TODOS', SYSTEMS: 'SISTEMAS', PRODUCT: 'PRODUTO', SECURITY: 'SEGURANÇA', GAMES: 'JOGOS' };
  const sec = (n, label) => `<p class="section-index"><span>${n}</span>${label}</p>`;
  const secRes = cv.securityResearch;

  return `<!doctype html>
<html lang="${en ? 'en' : 'pt-BR'}">
  <head>
${head({ lang, title, desc, canonical, route })}
  </head>
  <body id="top">
    <div class="screen-texture" aria-hidden="true"></div>
${header(lang, 'portfolio', route)}
    <main id="main" tabindex="-1">
      <section class="hero" aria-labelledby="hero-title">
        <canvas class="hero-canvas" id="hero-canvas" aria-hidden="true"></canvas>
        ${asciiBackdrop(lang)}
        <div class="hero-rail" aria-hidden="true"><span>OPERATOR / 01</span><span>RJ.BR / UTC-3</span></div>
        <div class="hero-center">
          <p class="kicker"><span class="status-dot"></span>${en ? 'Rio de Janeiro / Open to work' : 'Rio de Janeiro / Aberto a oportunidades'}</p>
          <p class="boot-strip" aria-hidden="true"><b>&gt;</b><span id="boot-text"></span><span class="caret"></span></p>
          <p class="identity-mark" data-text="YUEE" aria-hidden="true">YUEE</p>
          <h1 id="hero-title">Felipe <span>"Yuee"</span> Lemos</h1>
          <p class="hero-role">${esc(L(cv.person.role, lang))}</p>
          <p class="hero-statement">${esc(desc)}</p>
          <div class="hero-links">
            <a class="button button-primary" href="#work">${en ? 'Inspect work' : 'Inspecionar projetos'} <span aria-hidden="true">↓</span></a>
            <a class="button" href="${route.prefix}resume/${en ? 'en.html' : 'pt.html'}">${en ? 'Open resume' : 'Abrir curriculo'} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div class="hero-footer"><span>RED TEAM</span><span>BLUE TEAM</span><span>RESEARCH</span><span>AI</span></div>
      </section>

      <section class="work section" id="work">
        <div class="section-inner">
          <div class="section-heading reveal">
            ${sec('01', en ? 'Selected work' : 'Projetos selecionados')}
            <h2>${en ? 'Systems under <span>real constraints.</span>' : 'Sistemas sob <span>restrições reais.</span>'}</h2>
            <p>${en ? 'Architecture, implementation, and the evidence that connects them.' : 'Arquitetura, implementação e as evidências que conectam as duas.'}</p>
          </div>

          <article class="flagship work-item reveal" data-track="${flagship.track}">
            <div class="flagship-copy">
              <div class="work-top"><span>00 / FLAGSHIP</span><span>${flagship.track}</span><span>${esc(flagship.codename)}</span></div>
              <p class="eyebrow">${en ? 'RUST / LOCAL AI / SECURITY' : 'RUST / IA LOCAL / SEGURANÇA'}</p>
              <h3>${esc(flagship.name)}</h3>
              <p class="flagship-lede">${esc(L(flagship.blurb, lang))}</p>
              <dl>
                <div><dt>${en ? 'PROBLEM' : 'PROBLEMA'}</dt><dd>${esc(L(flagship.challenge, lang))}</dd></div>
                <div><dt>${en ? 'BUILT' : 'CONSTRUIDO'}</dt><dd>${esc(L(flagship.role, lang))}</dd></div>
                <div><dt>${en ? 'BOUNDARY' : 'LIMITE'}</dt><dd>${esc(L(flagship.focus, lang))}</dd></div>
              </dl>
              ${projectLink(flagship, lang, route)}
            </div>
            ${runtimeDiagram(lang)}
          </article>

          <div class="work-toolbar reveal">
            <div class="filters" role="group" aria-label="${en ? 'Filter projects' : 'Filtrar projetos'}">
              ${tracks.map((track, index) => `<button type="button" data-filter="${track}" aria-pressed="${index === 0}"${index === 0 ? ' class="active"' : ''}>${trackLabels[track]}</button>`).join('\n              ')}
            </div>
            <output class="filter-count" aria-live="polite">${projects.length.toString().padStart(2, '0')} ${en ? 'PROJECTS ONLINE' : 'PROJETOS ONLINE'}</output>
          </div>
          <div class="work-list">
            ${remaining.map((project) => projectCard(project, lang, projects.indexOf(project), route)).join('\n            ')}
          </div>
          <p class="fineprint">${en ? 'Private systems are described at architecture level. Public links and upstream work are labeled directly.' : 'Sistemas privados sao descritos no nivel de arquitetura. Links publicos e trabalho upstream sao identificados diretamente.'}</p>
        </div>
      </section>

      <section class="profile section" id="profile">
        <div class="section-inner profile-layout">
          <div class="section-heading reveal">
            ${sec('02', en ? 'Operator profile' : 'Perfil do operador')}
            <h2>${en ? 'How I <span>work.</span>' : 'Como eu <span>trabalho.</span>'}</h2>
          </div>
          <div class="profile-copy reveal">
            <p class="lead">${en ? 'I build close to the machine, then carry that discipline into products people use.' : 'Construo perto da máquina e levo essa disciplina para produtos que pessoas usam.'}</p>
            <ol class="principles">
              <li><span>01</span><div><h3>${en ? 'Start with the boundary' : 'Começar pelo limite'}</h3><p>${en ? 'Memory, authority, latency, ownership: make the constraint explicit before choosing the abstraction.' : 'Memória, autoridade, latência, ownership: tornar a restrição explícita antes de escolher a abstração.'}</p></div></li>
              <li><span>02</span><div><h3>${en ? 'Test the failure path' : 'Testar o caminho de falha'}</h3><p>${en ? 'Use isolated labs and integration tests to learn how a system fails before users have to.' : 'Usar laboratórios isolados e testes de integração para entender a falha antes dos usuários.'}</p></div></li>
              <li><span>03</span><div><h3>${en ? 'Leave operational evidence' : 'Deixar evidência operacional'}</h3><p>${en ? 'Ship diagnostics, architecture checks, and documentation with the implementation.' : 'Entregar diagnósticos, verificações de arquitetura e documentação junto da implementação.'}</p></div></li>
            </ol>
          </div>
          <div class="toolbox reveal">
            ${cv.skills.map((skill, index) => {
              const meter = Number(skill.meter ?? 0);
              return `<div class="tool-group"><span>0${index + 1} / ${esc(L(skill.group, lang))}</span><p>${esc(skill.items)}</p><div class="meter"><div class="meter-head"><span>${en ? 'SELF-ASSESSED' : 'AUTOAVALIAÇÃO'}</span><b>${meter}%</b></div><div class="meter-bar" role="img" aria-label="${esc(L(skill.group, lang))} ${meter}%"><i style="--v:${meter}%"></i></div></div></div>`;
            }).join('\n            ')}
          </div>
        </div>
      </section>

      <section class="security section" id="security">
        <div class="section-inner">
          <div class="section-heading reveal">
            ${sec('03', en ? 'Security practice' : 'Prática de segurança')}
            <h2>${en ? 'Red team. <span>Blue team.</span>' : 'Red team. <span>Blue team.</span>'}</h2>
            <p>${en ? 'Offense and defense under explicit authorization: adversary emulation, detection engineering, and research that ships defensive outcomes.' : 'Ofensa e defesa sob autorização explícita: emulação de adversário, detection engineering e pesquisa que entrega resultados defensivos.'}</p>
          </div>
          <div class="security-console reveal">
            <div class="console-head"><span>POLICY / LAB-01</span><span class="status-ok">SCOPE VERIFIED</span></div>
            <div class="sec-grid">
              ${secRes.points.map((point, index) => `<div><span>0${index + 1}</span><h3>${esc(L(point.t, lang))}</h3><p>${esc(L(point.d, lang))}</p></div>`).join('\n              ')}
            </div>
            <p class="rules">${esc(L(secRes.rules, lang))}</p>
          </div>
        </div>
      </section>

      <section class="resumes section" id="resume">
        <div class="section-inner resume-layout">
          <div class="section-heading reveal">
            ${sec('04', en ? 'Resume' : 'Currículo')}
            <h2>${en ? 'Readable by people.<br><span>Parseable by systems.</span>' : 'Legível por pessoas.<br><span>Interpretável por sistemas.</span>'}</h2>
          </div>
          <div class="resume-cards reveal">
            ${[
              { f: en ? 'en.html' : 'pt.html', pdf: en ? 'felipe-lemos-resume-en.pdf' : 'felipe-lemos-curriculo-pt.pdf', title: en ? 'One page' : 'Uma página', code: '01' },
              { f: en ? 'en-detailed.html' : 'pt-detailed.html', pdf: en ? 'felipe-lemos-resume-en-detailed.pdf' : 'felipe-lemos-curriculo-pt-detalhado.pdf', title: en ? 'Detailed' : 'Detalhado', code: '02' }
            ].map((resume) => `<article><span>${resume.code}</span><h3>${resume.title}</h3><p>${en ? 'Single column, ATS-safe, direct.' : 'Uma coluna, compatível com ATS, direto.'}</p><div><a href="${route.prefix}resume/${resume.f}">${en ? 'Open HTML' : 'Abrir HTML'} ↗</a><a href="${route.prefix}downloads/${resume.pdf}" download>PDF ↓</a></div></article>`).join('\n            ')}
          </div>
        </div>
      </section>

      <section class="contact section" id="contact">
        ${waveField()}
        <div class="contact-code" aria-hidden="true">05 / CONNECT</div>
        <p class="kicker"><span class="status-dot"></span>${en ? 'AVAILABLE FOR THE RIGHT SYSTEM' : 'DISPONÍVEL PARA O SISTEMA CERTO'}</p>
        <h2>${en ? 'Let us inspect the <span>problem.</span>' : 'Vamos inspecionar o <span>problema.</span>'}</h2>
        <p>${en ? 'Software, backend, systems, security, or gameplay work. Based in Rio de Janeiro.' : 'Software, backend, sistemas, segurança ou gameplay. Rio de Janeiro.'}</p>
        <div class="contact-links"><a class="button button-primary" href="${cv.person.profiles.linkedin}" target="_blank" rel="noreferrer">LinkedIn ↗</a><a class="button" href="${cv.person.profiles.github}" target="_blank" rel="noreferrer">GitHub ↗</a></div>
      </section>
    </main>
    <footer class="statusbar"><span><i></i>${en ? 'SYSTEM READY' : 'SISTEMA PRONTO'} / Felipe "Yuee" Lemos</span><span>${en ? 'Red team. Blue team. Authorized research.' : 'Red team. Blue team. Pesquisa autorizada.'}</span><span>2026 / v${esc(cv.meta.contentVersion)}</span></footer>
    ${palette(lang)}
    <script src="${route.prefix}assets/js/site.js"></script>
  </body>
</html>
`;
}

function runtimePage(lang) {
  const en = lang === 'en';
  const route = routeConfig(lang, 'runtime');
  const canonical = en ? `${SITE}/microruntime/` : `${SITE}/pt/microruntime/`;
  const title = en ? 'Micro Runtime | Red team operator platform' : 'Micro Runtime | Plataforma de operador red team';
  const desc = en ? 'A red team operator platform: endpoint agent, command-and-control plane, and local AI with per-action authorization. Architecture-level case study, private code off-page.' : 'Plataforma de operador red team: agente de endpoint, plano de command-and-control e IA local com autorização por ação. Estudo de caso em nível de arquitetura, código privado fora da página.';
  return `<!doctype html>
<html lang="${en ? 'en' : 'pt-BR'}">
  <head>
${head({ lang, title, desc, canonical, route })}
    <link rel="stylesheet" href="${route.prefix}assets/css/showcase.css" />
  </head>
  <body id="top" class="showcase-page">
    <div class="screen-texture" aria-hidden="true"></div>
${header(lang, 'runtime', route)}
    <main id="main" class="showcase" tabindex="-1">
      <div class="showcase-intro">
        <p class="section-index"><span>CASE / 001</span>${en ? 'Red team platform / public record' : 'Plataforma red team / registro público'}</p>
        <p class="mode-strip"><span class="status-dot"></span><b id="mode-label">${en ? 'MODE / STANDBY' : 'MODO / STANDBY'}</b><span>${en ? 'AUTHORIZED OPERATIONS ONLY' : 'SOMENTE OPERAÇÕES AUTORIZADAS'}</span></p>
        <p class="kicker">${en ? 'ARCHITECTURE LEVEL / PRIVATE CODE OFF-PAGE' : 'NÍVEL DE ARQUITETURA / CÓDIGO PRIVADO FORA DA PÁGINA'}</p>
        <h1>Micro Runtime <span>${en ? 'a red team operator platform.' : 'uma plataforma de operador red team.'}</span></h1>
        <p class="lede">${en ? 'A Rust runtime, endpoint agent, and command-and-control plane I designed and built for authorized red-team operations. Local AI supports decisions at the edge, and every model-proposed action is typed, authorized, and audited. This page is the architecture story; private code stays private.' : 'Runtime Rust, agente de endpoint e plano de command-and-control que projetei e construí para operações red team autorizadas. IA local apoia decisões na borda, e cada ação proposta pelo modelo é tipada, autorizada e auditada. Esta página é a história de arquitetura; código privado permanece privado.'}</p>
        ${runtimeDiagram(lang)}
      </div>
      <div class="case-register">
        <article><span>01 / WHAT IT IS</span><h2>${en ? 'An operator platform' : 'Uma plataforma de operador'}</h2><p>${en ? 'An endpoint agent plus a command-and-control plane for authorized red-team work, with an operator HMI and one binary for Linux, macOS, and Windows. I designed the architecture, the tasking model, and the security boundaries.' : 'Um agente de endpoint mais um plano de command-and-control para trabalho red team autorizado, com HMI de operador e um binário para Linux, macOS e Windows. Projetei a arquitetura, o modelo de tasking e os limites de segurança.'}</p></article>
        <article><span>02 / CONTROL PLANE</span><h2>${en ? 'Tasking with identity' : 'Tasking com identidade'}</h2><p>${en ? 'Operators issue typed tasks over mutual TLS, agents are pinned to site certificates, and every instruction, result, and decision lands in the audit trail. Nothing depends on a shell or an implicit channel.' : 'Operadores emitem tarefas tipadas via mTLS, agentes são fixados a certificados de site, e cada instrução, resultado e decisão entra na trilha de auditoria. Nada depende de shell ou canal implícito.'}</p><pre><code>operator -&gt; control plane -&gt; agent
identity: certificate + pinned PKI</code></pre></article>
        <article><span>03 / LOCAL AI</span><h2>${en ? 'A model that cannot act alone' : 'Um modelo que não age sozinho'}</h2><p>${en ? 'Quantized GGUF on CPU and a tiny INT8 model VM give the agent local decision support with no cloud. A capability broker authorizes each proposed action, so probabilistic output never receives ambient authority.' : 'GGUF quantizado em CPU e uma VM minúscula de modelo INT8 dão ao agente suporte de decisão local sem nuvem. Um capability broker autoriza cada ação proposta, então saída probabilística nunca recebe autoridade ambiente.'}</p><pre><code>model_token -&gt; dispatch_token -&gt; HostOp
one-shot / 256 slots / closed enum</code></pre></article>
        <article><span>04 / BOUNDARIES</span><h2>${en ? 'Strict everywhere else' : 'Rígido em todo o resto'}</h2><p>${en ? 'A closed task ISA, isolated workers with no shell, hard memory and operation budgets, sealed weights, and zeroization on sensitive buffers. Powerful under authorization, fail-closed everywhere else.' : 'ISA de tarefas fechada, workers isolados sem shell, orçamentos rígidos de memória e operação, pesos selados e zeroização em buffers sensíveis. Poderoso sob autorização, fail-closed em todo o resto.'}</p></article>
        <article><span>05 / RED TO BLUE</span><h2>${en ? 'Emulation to detection' : 'Da emulação à detecção'}</h2><p>${en ? 'I run the platform for adversary emulation in isolated labs, then turn what it produces into telemetry, detections, and hardening. Offense and defense share the same evidence, and only authorized scopes.' : 'Uso a plataforma para emulação de adversário em laboratórios isolados e transformo o que ela produz em telemetria, detecções e hardening. Ofensa e defesa compartilham a mesma evidência, e apenas escopos autorizados.'}</p></article>
        <article><span>06 / SKILLS SHOWN</span><h2>${en ? 'What this proves' : 'O que isso prova'}</h2><p>${en ? 'Low-level Rust, memory and allocator design, PKI and secure transport, protocol design, cross-platform internals, local inference, and the discipline to gate every build with architecture checks.' : 'Rust de baixo nível, desenho de memória e alocador, PKI e transporte seguro, desenho de protocolo, internals multiplataforma, inferência local e a disciplina de validar cada build com checks de arquitetura.'}</p></article>
        <article class="excluded"><span>07 / PUBLIC BOUNDARY</span><h2>${en ? 'Architecture level' : 'Nível de arquitetura'}</h2><p>${en ? 'Private implementation, weights, keys, live transports, and privileged research stay off this page. I can walk through the architecture in interviews.' : 'Implementação privada, pesos, chaves, transportes reais e pesquisa privilegiada ficam fora desta página. Posso detalhar a arquitetura em entrevistas.'}</p></article>
      </div>
      <section class="showcase-meters reveal" aria-labelledby="meters-title">
        <span>${en ? 'CAPABILITY / SELF-ASSESSED' : 'CAPACIDADE / AUTOAVALIAÇÃO'}</span>
        <h2 id="meters-title">${en ? 'Where I am strong' : 'Onde eu sou forte'}</h2>
        <div class="meter-grid">
          ${cv.skills.map((skill) => {
            const meter = Number(skill.meter ?? 0);
            return `<div class="meter"><div class="meter-head"><span>${esc(L(skill.group, lang))}</span><b>${meter}%</b></div><div class="meter-bar" role="img" aria-label="${esc(L(skill.group, lang))} ${meter}%"><i style="--v:${meter}%"></i></div></div>`;
          }).join('\n          ')}
        </div>
      </section>
      <section class="demo" data-lang="${lang}" aria-labelledby="demo-title">
        <div><span>INTERACTIVE CHECK / M35</span><h2 id="demo-title">${en ? 'Validate a budget' : 'Validar um orçamento'}</h2><p>${en ? 'Client-side simulation only. Maximum 64 operations and 256 KiB for this demonstration.' : 'Apenas uma simulação no navegador. Máximo de 64 operações e 256 KiB nesta demonstração.'}</p></div>
        <form class="demo-controls" onsubmit="return false">
          <label for="demo-ops">ops <input id="demo-ops" type="number" value="64" min="1" max="5000" /></label>
          <label for="demo-arena">arena_kb <input id="demo-arena" type="number" value="256" min="1" max="16384" /></label>
          <button id="demo-run" type="button">${en ? 'Validate tape' : 'Validar tape'}</button>
        </form>
        <p id="demo-out" class="demo-output" role="status" aria-live="polite">${en ? 'AWAITING INPUT' : 'AGUARDANDO ENTRADA'}</p>
      </section>
      <a class="back-link" href="${route.home}#work">← ${en ? 'Return to selected work' : 'Voltar aos projetos'}</a>
    </main>
    <footer class="statusbar"><span><i></i>${en ? 'CASE ONLINE' : 'CASO ONLINE'} / Micro Runtime</span><span>${en ? 'Authorized operations only. Architecture-level public record.' : 'Somente operações autorizadas. Registro público em nível de arquitetura.'}</span><span>2026 / v${esc(cv.meta.contentVersion)}</span></footer>
    ${palette(lang)}
    <script src="${route.prefix}assets/js/site.js"></script>
    <script src="${route.prefix}assets/js/showcase-demo.js"></script>
  </body>
</html>
`;
}

function completeExcerpt(value, max, fallback) {
  const text = String(value).trim();
  if (text.length <= max) return text;
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
  let result = '';
  for (const sentence of sentences) {
    if (`${result} ${sentence}`.trim().length > max) break;
    result = `${result} ${sentence}`.trim();
  }
  return result || fallback;
}

function resumePage(lang, detailed) {
  const prefix = '../';
  const canonical = `${SITE}/resume/${lang === 'pt' ? 'pt' : 'en'}${detailed ? '-detailed' : ''}.html`;
  const title = `${cv.person.name} · ${(lang === 'pt' ? 'Currículo' : 'Resume')}${detailed ? (lang === 'pt' ? ' (Detalhado)' : ' (Detailed)') : ''}`;
  const selected = detailed ? cv.documents.detailed : cv.documents.onePage;
  const projects = selected.projectIds.map((id) => cv.projects.find((project) => project.id === id)).filter(Boolean);
  const experience = cv.experience[0];
  const pdfFile = { en: detailed ? 'felipe-lemos-resume-en-detailed.pdf' : 'felipe-lemos-resume-en.pdf', pt: detailed ? 'felipe-lemos-curriculo-pt-detalhado.pdf' : 'felipe-lemos-curriculo-pt.pdf' }[lang];
  const summaryText = detailed ? completeExcerpt(L(cv.person.summary, lang), 520, L(cv.person.statement, lang)) : L(cv.person.statement, lang);
  const projectSummary = (project) => detailed ? completeExcerpt(L(project.summary, lang), 420, L(project.blurb, lang)) : L(project.blurb, lang);
  const securityAreas = detailed ? cv.securityResearch.areas : cv.securityResearch.areas.slice(0, 2);
  const securityIntro = detailed ? completeExcerpt(L(cv.securityResearch.intro, lang), 320, L(cv.securityResearch.rules, lang)) : L(cv.securityResearch.rules, lang);
  const en = lang === 'en';
  return `<!doctype html>
<html lang="${en ? 'en' : 'pt-BR'}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${esc(title)}: ${esc(L(cv.person.headline, lang))}" />
    <meta name="robots" content="noindex,follow" />
    <link rel="canonical" href="${canonical}" />
    <title>${esc(title)}</title>
    <link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="${prefix}assets/css/resume.css" />
    <link rel="stylesheet" href="${prefix}assets/css/print.css" media="print" />
  </head>
  <body class="resume ${detailed ? 'detailed' : 'compact'}">
    <div class="resume-actions screen-only">
      <a href="${prefix}${en ? '' : 'pt/'}">← ${en ? 'Portfolio' : 'Portfolio'}</a>
      <span>${en ? 'Resume' : 'Currículo'} / ${detailed ? (en ? 'Detailed' : 'Detalhado') : (en ? 'One page' : 'Uma página')} / ${en ? 'English' : 'Português'}</span>
      <span><a href="${en ? (detailed ? 'en.html' : 'en-detailed.html') : (detailed ? 'pt.html' : 'pt-detailed.html')}">${detailed ? (en ? 'One-page version' : 'Versão de uma página') : (en ? 'Detailed version' : 'Versão detalhada')}</a> / <a href="${detailed ? (en ? 'pt-detailed.html' : 'en-detailed.html') : (en ? 'pt.html' : 'en.html')}">${en ? 'Português' : 'English'}</a> / <a href="../downloads/${pdfFile}" download>${en ? 'Download PDF' : 'Baixar PDF'}</a></span>
      <button type="button" onclick="window.print()">${en ? 'Print / Save PDF' : 'Imprimir / Salvar PDF'}</button>
    </div>
    <main class="resume-sheet">
      <header>
        <h1>${esc(cv.person.name)}</h1>
        <p class="resume-headline">${esc(L(cv.person.headline, lang))}</p>
        <p class="resume-meta">${esc(L(cv.person.location, lang))} · <a href="${cv.person.profiles.linkedin}">${esc(cv.person.profiles.linkedin)}</a> · <a href="${cv.person.profiles.github}">${esc(cv.person.profiles.github)}</a> · <a href="${cv.person.profiles.robloxNexus}">NEXUS on Roblox</a></p>
      </header>
      <section><h2>${en ? 'Summary' : 'Resumo'}</h2><p>${esc(summaryText)}</p></section>
      <section><h2>${en ? 'Technical Skills' : 'Habilidades Técnicas'}</h2><ul>${cv.skills.map((skill) => `<li><strong>${esc(L(skill.group, lang))}:</strong> ${esc(skill.items)}</li>`).join('')}</ul></section>
      <section><h2>${en ? 'Experience' : 'Experiência'}</h2><article class="resume-entry"><h3>${esc(L(experience.role, lang))}, ${esc(experience.organization)} (${esc(experience.platform)})</h3><p class="resume-when">${en ? 'Current' : 'Atual'}</p><p><strong>${esc(L(experience.title, lang))}</strong>${detailed ? ` ${esc(completeExcerpt(L(experience.body, lang), 360, ''))}` : ''}</p></article></section>
      <section><h2>${en ? 'Selected Projects' : 'Projetos Selecionados'}</h2>
        ${projects.map((project) => `<article class="resume-entry"><h3>${esc(project.name)}${project.org ? ` · ${esc(project.org)}` : ''}: ${esc(L(project.domain, lang))}</h3><p>${esc(projectSummary(project))}</p><ul>${L(project.resumeBullets, lang).slice(0, selected.highlightCount).map((bullet) => `<li>${esc(bullet)}</li>`).join('')}</ul><p class="resume-tech">${esc(project.stack)}</p></article>`).join('\n        ')}
      </section>
      <section><h2>${en ? 'Security Research' : 'Pesquisa em Segurança'}</h2><p>${esc(securityIntro)}</p><ul>${securityAreas.map((area) => `<li>${esc(L(area, lang))}</li>`).join('')}</ul></section>
      <section><h2>${en ? 'Certifications' : 'Certificações'}</h2><ul>${cv.certifications.map((certification) => `<li>${esc(L(certification, lang))}</li>`).join('')}</ul></section>
      <section><h2>${en ? 'Languages & Interests' : 'Idiomas e Interesses'}</h2><p>${esc(L(cv.extras.languages, lang))}<br />${esc(L(cv.extras.interests, lang))}</p></section>
      <section><h2>${en ? 'Note' : 'Observação'}</h2><p>${en ? 'Sensitive repositories are described as private case studies without operational code. Architecture detail is available in technical interviews when appropriate.' : 'Repositórios sensíveis são descritos como estudos de caso privados, sem código operacional. Detalhes de arquitetura estão disponíveis em entrevistas técnicas quando apropriado.'} ${en ? 'Updated' : 'Atualizado'} ${cv.meta.lastUpdated} · v${cv.meta.contentVersion}</p></section>
    </main>
    <script>if (new URLSearchParams(location.search).get('print') === '1') addEventListener('load', () => setTimeout(() => print(), 400));</script>
  </body>
</html>
`;
}

const generated = [
  ['index.html', portfolioPage('en')],
  ['pt/index.html', portfolioPage('pt')],
  ['microruntime/index.html', runtimePage('en')],
  ['pt/microruntime/index.html', runtimePage('pt')],
  ['resume/en.html', resumePage('en', false)],
  ['resume/en-detailed.html', resumePage('en', true)],
  ['resume/pt.html', resumePage('pt', false)],
  ['resume/pt-detailed.html', resumePage('pt', true)]
];

for (const [relative, content] of generated) {
  const output = path.join(root, relative);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, clean(content));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>${SITE}/</loc><xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE}/pt/"/><xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/></url>
  <url><loc>${SITE}/pt/</loc><xhtml:link rel="alternate" hreflang="en" href="${SITE}/"/></url>
  <url><loc>${SITE}/microruntime/</loc><xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE}/pt/microruntime/"/></url>
  <url><loc>${SITE}/pt/microruntime/</loc><xhtml:link rel="alternate" hreflang="en" href="${SITE}/microruntime/"/></url>
</urlset>
`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /resume/\nDisallow: /downloads/\nSitemap: ${SITE}/sitemap.xml\n`);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
for (const relative of ['index.html', 'styles.css', 'favicon.svg', 'robots.txt', 'sitemap.xml']) {
  fs.copyFileSync(path.join(root, relative), path.join(dist, relative));
}
for (const directory of ['pt', 'microruntime', 'resume', 'assets']) {
  fs.cpSync(path.join(root, directory), path.join(dist, directory), { recursive: true });
}
const distDownloads = path.join(dist, 'downloads');
fs.mkdirSync(distDownloads, { recursive: true });
for (const file of fs.readdirSync(path.join(root, 'downloads')).filter((file) => file.endsWith('.pdf'))) {
  fs.copyFileSync(path.join(root, 'downloads', file), path.join(distDownloads, file));
}

console.log(`build ok: ${generated.length} pages and allowlisted dist/ artifact`);
