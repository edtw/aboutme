import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const cv = JSON.parse(fs.readFileSync(path.join(root, 'src/cv.json'), 'utf8'));
const L = (obj, lang) => obj?.[lang] ?? obj?.en ?? '';

const esc = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const SITE = cv.meta.siteUrl;
const FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&amp;family=IBM+Plex+Mono:wght@400;500&amp;family=Inter+Tight:wght@400;500;600&amp;family=UnifrakturCook:wght@700&amp;display=swap';

function head({ lang, title, desc, canonical, prefix }) {
  const ogLocale = lang === 'pt' ? 'pt_BR' : 'en_US';
  const ogAlt = lang === 'pt' ? 'pt-BR' : 'en';
  return `  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="${esc(desc)}" />
  <meta name="theme-color" content="#0b0b0c" />
  <link rel="canonical" href="${canonical}" />
  ${lang === 'en'
    ? `<link rel="alternate" hreflang="pt-BR" href="${SITE}/pt/" /><link rel="alternate" hreflang="x-default" href="${SITE}/" />`
    : `<link rel="alternate" hreflang="en" href="${SITE}/" />`}
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:locale" content="${ogLocale}" />
  <title>${esc(title)}</title>
  <link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${FONTS}" rel="stylesheet" />
  <link rel="stylesheet" href="${prefix}styles.css" />
  <link rel="stylesheet" href="${prefix}assets/css/resume.css" media="print" />
  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: cv.person.name, url: SITE, sameAs: [cv.person.profiles.github, cv.person.profiles.linkedin], address: { '@type': 'PostalAddress', addressLocality: 'Rio de Janeiro', addressCountry: 'BR' }, knowsAbout: ['Rust', 'Python', 'TypeScript', 'C++', 'Security Engineering', 'Roblox Studio', 'Local AI inference', 'Distributed systems'] })}</script>`;
}

function header(lang, prefix, t) {
  const other = lang === 'en' ? { href: `${prefix}pt/`, label: 'PT', aria: 'Switch to Portuguese' } : { href: `${prefix}`, label: 'EN', aria: 'Mudar para inglês' };
  return `<a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <a class="monogram" href="${prefix}#top" aria-label="Felipe Lemos home">FL</a>
      <nav aria-label="${lang === 'pt' ? 'Navegação principal' : 'Main navigation'}">
        <a href="${prefix}${lang === 'pt' ? 'pt/' : ''}#work">[${t.navWork}]</a>
        <a href="${prefix}${lang === 'pt' ? 'pt/' : ''}#security">[${t.navSecurity}]</a>
        <a href="${prefix}${lang === 'pt' ? 'pt/' : ''}#resume">[${t.navResume}]</a>
        <a href="${prefix}${lang === 'pt' ? 'pt/' : ''}#contact">[${t.navContact}]</a>
      </nav>
      <div class="header-actions">
        <a href="${cv.person.profiles.linkedin}" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a class="lang-link" href="${other.href}" hreflang="${lang === 'en' ? 'pt-BR' : 'en'}" aria-label="${other.aria}">${other.label}</a>
      </div>
    </header>`;
}

const T = {
  en: { navWork: 'Work', navSecurity: 'Security', navResume: 'Résumé', navContact: 'Contact' },
  pt: { navWork: 'Projetos', navSecurity: 'Segurança', navResume: 'Currículo', navContact: 'Contato' }
};

function heroGraphic() {
  return `<div class="hero-graphic" aria-hidden="true">
          <svg viewBox="0 0 1200 450" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M 18 0 L 0 0 0 18" fill="none" stroke="currentColor" stroke-width="0.45" /></pattern>
              <radialGradient id="orb"><stop offset="0" stop-color="#d9b9bc" stop-opacity=".8"/><stop offset="1" stop-color="#d9b9bc" stop-opacity="0"/></radialGradient>
            </defs>
            <rect x="100" y="60" width="300" height="250" fill="url(#grid)" />
            <rect x="800" y="60" width="300" height="250" fill="url(#grid)" />
            <path d="M0 275 C90 275 90 215 160 215 S245 320 330 270 420 255 500 280 580 180 650 245 740 330 815 240 910 230 970 275 1100 250 1200 250" fill="none" stroke="currentColor" stroke-width="2" />
            <path d="M0 295 C100 295 100 255 175 255 S250 335 340 290 440 285 520 300 610 225 685 275 750 330 830 275 930 270 1000 295 1120 275 1200 275" fill="none" stroke="currentColor" stroke-opacity=".35" />
            <circle cx="250" cy="180" r="90" fill="none" stroke="currentColor" /><circle cx="950" cy="180" r="90" fill="none" stroke="currentColor" />
            <circle cx="250" cy="180" r="46" fill="#0b0b0c" stroke="currentColor" /><circle cx="950" cy="180" r="46" fill="#0b0b0c" stroke="currentColor" />
            <circle cx="360" cy="82" r="70" fill="url(#orb)" /><circle cx="840" cy="82" r="70" fill="url(#orb)" />
          </svg>
        </div>`;
}

function portfolioPage(lang) {
  const t = T[lang];
  const prefix = lang === 'pt' ? '../' : '';
  const canonical = lang === 'pt' ? `${SITE}/pt/` : `${SITE}/`;
  const title = lang === 'pt' ? 'Felipe Lemos | Engenheiro de Software' : 'Felipe Lemos | Software Engineer';
  const desc = L(cv.person.summary, lang).slice(0, 155);
  const exp = cv.experience[0];
  const projects = cv.projects;
  const sec = (n, label) => `<p class="section-index">${n} / <span>${label}</span></p>`;

  const ordered = [...projects].sort((a, b) => (a.order ?? 9) - (b.order ?? 9));
  const tracks = ['ALL', 'SYSTEMS', 'PRODUCT', 'SECURITY', 'GAMES'];
  const trackLabel = (tr) => lang === 'pt'
    ? ({ ALL: 'TODOS', SYSTEMS: 'SISTEMAS', PRODUCT: 'PRODUTO', SECURITY: 'SEGURANÇA', GAMES: 'JOGOS' }[tr])
    : ({ ALL: 'ALL', SYSTEMS: 'SYSTEMS', PRODUCT: 'PRODUCT', SECURITY: 'SECURITY', GAMES: 'GAMES' }[tr]);
  const projectLink = (p) => {
    if (!p.link) return '';
    if (p.link.kind === 'showcase') return `<a class="work-link" href="${prefix}microruntime/${lang === 'pt' ? '../pt/microruntime/' : ''}">${lang === 'pt' ? 'Ver demonstração' : 'Open showcase'} →</a>`;
    return `<a class="work-link" href="${p.link.url}" target="_blank" rel="noreferrer">${lang === 'pt' ? 'Ver ao vivo' : 'See it live'} ↗</a>`;
  };
  const projectCards = ordered.map((p, i) => `
            <article class="work-card" data-track="${p.track}">
              <div class="work-top"><span>[0${i + 1}]</span><span class="track">${p.track}</span><span class="codename">${esc(p.codename)}</span></div>
              <h3>${esc(p.name)}${p.org ? ` <small>· ${esc(p.org)}</small>` : ''}</h3>
              <p class="oneliner">${esc(L(p.blurb, lang))}</p>
              <p class="stack">${esc(p.stack)}</p>
              <dl class="roles"><div><dt>${lang === 'pt' ? 'PAPEL' : 'ROLE'}</dt><dd>${esc(L(p.role, lang))}</dd></div><div><dt>FOCO</dt><dd>${esc(L(p.focus, lang))}</dd></div></dl>
              ${projectLink(p)}
            </article>`).join('');

  const secRes = cv.securityResearch;

  return `<!doctype html>
<html lang="${lang === 'pt' ? 'pt-BR' : 'en'}">
  <head>
${head({ lang, title, desc, canonical, prefix })}
  </head>
  <body>
    <div class="grain" aria-hidden="true"></div>
    <div class="scanlines" aria-hidden="true"></div>
${header(lang, prefix, t)}
    <main id="main">
      <section class="hero" aria-labelledby="hero-title">
        <div class="dither" aria-hidden="true"></div>
        ${heroGraphic()}
        <div class="hero-center">
          <p class="kicker">${esc(L(cv.person.location, lang))} <span>/</span> ${lang === 'pt' ? 'Aberto a oportunidades' : 'Open to opportunities'}<span class="cursor" aria-hidden="true">▊</span></p>
          <h1 id="hero-title">Felipe Lemos</h1>
          <p class="hero-role">${esc(L(cv.person.role, lang))}</p>
          <p class="hero-statement">${esc(L(cv.person.statement, lang))}</p>
          <div class="hero-links">
            <a class="primary-link" href="#work">${lang === 'pt' ? 'Ver projetos' : 'See work'} ↓</a>
            <a href="${prefix}resume/${lang === 'pt' ? 'pt.html' : 'en.html'}">${lang === 'pt' ? 'Currículo' : 'Résumé'} ↗</a>
          </div>
          <ul class="stat-strip" aria-label="${lang === 'pt' ? 'Números' : 'Numbers'}">
            <li><strong>07</strong><span>${lang === 'pt' ? 'estudos de caso' : 'case studies'}</span></li>
            <li><strong>02</strong><span>${lang === 'pt' ? 'idiomas' : 'locales'}</span></li>
            <li><strong>04</strong><span>${lang === 'pt' ? 'currículos em PDF' : 'PDF résumés'}</span></li>
            <li><strong>NEXUS</strong><span>${lang === 'pt' ? 'no ar agora' : 'live now'}</span></li>
          </ul>
        </div>
        <div class="hero-footer"><span>EST. 2020</span><span>SOFTWARE / SYSTEMS / SECURITY / GAMES</span><span>22°54'S 43°12'W</span></div>
      </section>

      <section class="profile section" id="profile">
        <div class="section-inner">
          <div class="section-heading">
            ${sec('00', lang === 'pt' ? 'Perfil' : 'Profile')}
            <h2>${lang === 'pt' ? 'Perto da máquina.<br /><em>Perto das pessoas.</em>' : 'Close to the machine.<br /><em>Close to people.</em>'}</h2>
          </div>
          <p class="lead">${lang === 'pt' ? 'Sou engenheiro de software no Rio de Janeiro. Trabalho perto da máquina — Rust, C++, Windows internals — e entrego coisas que gente usa: um PDV, serviços de IA, uma arena no Roblox.' : 'I write software in Rio de Janeiro. I work close to the machine — Rust, C++, Windows internals — and I ship things people touch: a POS, AI services, a Roblox arena.'}</p>
          <div class="trio">
            <div><h3>Build</h3><p>${lang === 'pt' ? 'Sistemas pequenos que aguentam trabalho real.' : 'Small systems that carry real workloads.'}</p></div>
            <div><h3>Break</h3><p>${lang === 'pt' ? 'Forçar limites no lab antes que a realidade force.' : 'Abuse it in the lab before reality does.'}</p></div>
            <div><h3>Harden</h3><p>${lang === 'pt' ? 'Documentar limites. Entregar mais fácil de operar.' : 'Document the limits. Leave it easier to run.'}</p></div>
          </div>
          <div class="toolbox">
            ${cv.skills.map((s) => `<div class="tool-group"><span>${esc(L(s.group, lang))}</span><p>${esc(s.items)}</p></div>`).join('\n            ')}
          </div>
          <p class="now-line"><span>${lang === 'pt' ? 'AGORA' : 'NOW'}</span> → <a href="${cv.person.profiles.robloxNexus}" target="_blank" rel="noreferrer">NEXUS</a> · ${lang === 'pt' ? 'gameplay de combate no Roblox Studio' : 'combat gameplay in Roblox Studio'}</p>
        </div>
      </section>

      <section class="work section" id="work">
        <div class="section-inner">
          <div class="section-heading">
            ${sec('01', lang === 'pt' ? 'Projetos' : 'Selected work')}
            <h2>${lang === 'pt' ? 'Sete coisas que <em>eu construí.</em>' : 'Seven things <em>I built.</em>'}</h2>
          </div>
          <div class="filters" role="group" aria-label="${lang === 'pt' ? 'Filtrar projetos' : 'Filter projects'}">
            ${tracks.map((tr, i) => `<button type="button" data-filter="${tr}" aria-pressed="${i === 0}"${i === 0 ? ' class="active"' : ''}>[${trackLabel(tr)}]</button>`).join('\n            ')}
          </div>
          <div class="work-grid">
${projectCards}
          </div>
          <p class="fineprint">${lang === 'pt' ? 'Código privado descrito em nível de arquitetura. Nada sensível é publicado.' : 'Private code described at architecture level. Nothing sensitive is published.'}</p>
        </div>
      </section>

      <section class="security section" id="security">
        <div class="section-inner">
          <div class="section-heading">
            ${sec('02', lang === 'pt' ? 'Segurança' : 'Security')}
            <h2>${lang === 'pt' ? 'Sei atacar.<br /><em>Prefiro defender.</em>' : 'I can attack.<br /><em>I prefer to defend.</em>'}</h2>
          </div>
          <div class="sec-grid">
            ${secRes.points.map((pt_, i) => `<div><span>0${i + 1}</span><h3>${esc(L(pt_.t, lang))}</h3><p>${esc(L(pt_.d, lang))}</p></div>`).join('\n            ')}
          </div>
          <p class="rules">${esc(L(secRes.rules, lang))}</p>
        </div>
      </section>

      <section class="resumes section" id="resume">
        <div class="section-inner">
          <div class="section-heading">
            ${sec('03', lang === 'pt' ? 'Currículo' : 'Résumé')}
            <h2>${lang === 'pt' ? 'Leve <em>o papel.</em>' : 'Take <em>the paper.</em>'}</h2>
          </div>
          <div class="resume-cards">
            ${[
              { f: lang === 'pt' ? 'pt.html' : 'en.html', pdf: lang === 'pt' ? 'felipe-lemos-curriculo-pt.pdf' : 'felipe-lemos-resume-en.pdf', t: lang === 'pt' ? 'Uma página' : 'One page' },
              { f: lang === 'pt' ? 'pt-detailed.html' : 'en-detailed.html', pdf: lang === 'pt' ? 'felipe-lemos-curriculo-pt-detalhado.pdf' : 'felipe-lemos-resume-en-detailed.pdf', t: lang === 'pt' ? 'Detalhado' : 'Detailed' }
            ].map((r) => `<div><h3>${r.t}</h3><p>${lang === 'pt' ? 'ATS, uma coluna, sem firula.' : 'ATS-safe, one column, no gimmicks.'}</p><a href="${prefix}resume/${r.f}">${lang === 'pt' ? 'Abrir' : 'Open'} ↗</a> <a href="${prefix}downloads/${r.pdf}" download>PDF ↓</a></div>`).join('\n            ')}
          </div>
        </div>
      </section>

      <section class="contact section" id="contact">
        <div class="contact-ornament" aria-hidden="true">✦</div>
        ${sec('04', lang === 'pt' ? 'Contato' : 'Contact')}
        <h2>${lang === 'pt' ? 'Tem um sistema <em>difícil?</em>' : 'Got a hard <em>system?</em>'}</h2>
        <p>${lang === 'pt' ? 'Software, backend, sistemas, segurança, jogos. Rio de Janeiro, aberto a propostas.' : 'Software, backend, systems, security, games. Rio de Janeiro, open to work.'}</p>
        <div class="contact-links"><a href="${cv.person.profiles.linkedin}" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="${cv.person.profiles.github}" target="_blank" rel="noreferrer">GitHub ↗</a><a href="${prefix}resume/${lang === 'pt' ? 'pt.html' : 'en.html'}">${lang === 'pt' ? 'Currículo' : 'Résumé'} ↗</a></div>
      </section>
    </main>
    <footer class="statusbar"><span>● ${lang === 'pt' ? 'CONECTADO' : 'CONNECTED'} · Felipe Lemos · ${esc(L(cv.person.location, lang))}</span><span>${lang === 'pt' ? 'Segurança: educação, defesa e testes autorizados.' : 'Security work: education, defense, authorized testing.'}</span><span>© 2026</span></footer>
    <script src="${prefix}assets/js/site.js"></script>
  </body>
</html>
`;
}

function runtimePage(lang) {
  const prefix = lang === 'pt' ? '../../' : '../';
  const canonical = lang === 'pt' ? `${SITE}/pt/microruntime/` : `${SITE}/microruntime/`;
  const title = lang === 'pt' ? 'Micro Runtime — Demonstração pública | Felipe Lemos' : 'Micro Runtime — Public showcase | Felipe Lemos';
  const desc = lang === 'pt' ? 'Demonstração pública e sanitizada do Micro Runtime: IA local com GGUF, VM TinyML M35 e envelopes MRE1.' : 'Sanitized public showcase of Micro Runtime: local GGUF AI, M35 TinyML VM, and MRE1 envelopes.';
  const en = lang === 'en';
  return `<!doctype html>
<html lang="${en ? 'en' : 'pt-BR'}">
  <head>
${head({ lang, title, desc, canonical, prefix })}
    <link rel="stylesheet" href="${prefix}assets/css/showcase.css" />
  </head>
  <body>
    <div class="grain" aria-hidden="true"></div>
    <div class="scanlines" aria-hidden="true"></div>
${header(lang, prefix, T[lang])}
    <main id="main" class="showcase">
      <div class="dither" aria-hidden="true"></div>
      <p class="section-index"><a href="${prefix}${en ? '' : 'pt/'}">← Felipe Lemos</a> · ${en ? 'Public technical showcase' : 'Demonstração técnica pública'} · ${en ? 'Sanitized subset — no private code' : 'Subconjunto sanitizado — sem código privado'}</p>
      <h1>Micro Runtime <em>${en ? 'can run AI locally.' : 'executa IA localmente.'}</em></h1>
      <p class="lede">${en ? 'A modular Rust 2021 runtime for constrained environments. This public page demonstrates only the safe, non-sensitive ideas: how numeric model output becomes bounded actions, how tiny models stay within budgets, and how envelopes keep artifacts canonical.' : 'Runtime modular em Rust 2021 para ambientes restritos. Esta página demonstra apenas ideias seguras e não sensíveis: como a saída numérica do modelo vira ações limitadas, como modelos minúsculos respeitam orçamentos e como envelopes mantêm artefatos canônicos.'}</p>
      <div class="showcase-grid">
        <article><span>01</span><h2>${en ? 'Decision plane, not autopilot' : 'Plano de decisão, não piloto automático'}</h2><p>${en ? 'A minimal TokenEngine trait returns single numeric tokens. A bridge maps model tokens to dispatch tokens, then a fixed 256-slot one-shot dispatcher invokes a closed HostOp handler. Probabilistic output never becomes ambient authority.' : 'Um trait mínimo TokenEngine retorna tokens numéricos. Uma ponte mapeia tokens do modelo para tokens de dispatch, e um dispatcher fixo de 256 slots one-shot invoca um handler HostOp fechado. Saída probabilística nunca vira autoridade ambiente.'}</p><pre><code>trait TokenEngine {
  fn infer_next_token(&amp;self, input: &amp;[u32]) -&gt; u32;
  fn reset(&amp;mut self);
}
// bridge: model_token -&gt; dispatch_token -&gt; HostOp
// dispatcher: one-shot, fixed 256 slots, closed enum</code></pre></article>
        <article><span>02</span><h2>${en ? 'Local GGUF, explicit and boring' : 'GGUF local, explícito e previsível'}</h2><p>${en ? 'Memory-mapped or fully in-memory model loading (no disk writes), quantized Qwen/Llama/Gemma/Phi on CPU, explicit model resolution with no silent fallback, constrained decoding to a digit vocabulary, and zeroized buffers on drop.' : 'Carregamento via mmap ou totalmente em memória (sem escrita em disco), modelos quantizados Qwen/Llama/Gemma/Phi em CPU, resolução explícita sem fallback silencioso, decodificação restrita a vocabulário de dígitos e buffers zerados no drop.'}</p><pre><code>MICRO_RUNTIME_GGUF=/models/qwen3-0.6b-q4_k_m.gguf
# missing model =&gt; None (no silent fallback)
# think budget default 2048, act budget 32 digits</code></pre></article>
        <article><span>03</span><h2>M35 TinyML VM</h2><p>${en ? 'Canonical 64-byte header, fixed-length opcodes (FC_W8A8, ADD_RQ, LUT8, ARGMAX, END), full tape validation once (spans, aliasing, quantization, order, budgets), int8 only, no heap, no float, no graph. Offline assembler and trainer produce byte-identical images with SHA manifests; only synthetic fixtures ship publicly.' : 'Header canônico de 64 bytes, opcodes de tamanho fixo (FC_W8A8, ADD_RQ, LUT8, ARGMAX, END), validação completa da tape (spans, aliasing, quantização, ordem, orçamentos), apenas int8, sem heap, sem float, sem grafo. Assembler e trainer offline geram imagens byte-idênticas com manifests SHA; publicamente, apenas fixtures sintéticas.'}</p><pre><code>MAGIC M35\\0 · VERSION 1 · HEADER 64B
MAX_OPS 4096 · MAX_ARENA 16MiB · budgets enforced
tape: ARGMAX penultimate, END last</code></pre></article>
        <article><span>04</span><h2>MRE1 ${en ? 'envelopes' : 'envelopes'}</h2><p>${en ? '144-byte header + up to 256 × 80-byte records + 104-byte trailer. Canonical order, sizes, zero-reserved fields, and authority cross-rules. Zero-copy borrowed views; trust (signatures, counters) stays in the bootstrap, never in the parser.' : 'Header de 144 bytes + até 256 registros de 80 bytes + trailer de 104 bytes. Ordem canônica, tamanhos, campos zero-reserved e regras cruzadas de autoridade. Views emprestadas zero-copy; confiança (assinaturas, contadores) fica no bootstrap, nunca no parser.'}</p></article>
        <article><span>05</span><h2>${en ? 'Memory discipline' : 'Disciplina de memória'}</h2><p>${en ? 'Custom global allocator with 4 KiB pages, sharded heap, and ephemeral scopes; read-only no-follow memory maps; one-shot dispatch that scrubs caller buffers. CI enforces formatting, architecture inventory, tests, and object size gates.' : 'Alocador global customizado com páginas de 4 KiB, heap fragmentado e escopos efêmeros; maps somente leitura sem follow; dispatch one-shot que limpa buffers. O CI impõe formatação, inventário de arquitetura, testes e limites de tamanho.'}</p></article>
        <article><span>06</span><h2>${en ? 'What is deliberately excluded' : 'O que fica deliberadamente de fora'}</h2><p>${en ? 'No weights, keys, certificates, transports, mixnet, kernel, driver, C2, or evasion content. No private source. This showcase is an original explanation of public concepts, not a release of the private runtime.' : 'Sem pesos, chaves, certificados, transportes, mixnet, kernel, drivers, C2 ou evasão. Sem código privado. Esta demonstração é uma explicação original de conceitos públicos, não um release do runtime privado.'}</p><a class="primary-link" href="${prefix}resume/${en ? 'en-detailed.html' : 'pt-detailed.html'}">${en ? 'See résumé detail →' : 'Ver detalhe no currículo →'}</a></article>
      </div>
      <section class="demo" aria-label="${en ? 'Interactive TinyML budget demo' : 'Demo interativa de orçamento TinyML'}">
        <h2>${en ? 'Try the budget logic' : 'Teste a lógica de orçamento'}</h2>
        <p>${en ? 'A tiny client-side simulation of M35-style budget enforcement. No model, no private code — just the idea that oversized tapes fail closed.' : 'Uma simulação mínima em JS da imposição de orçamentos estilo M35. Sem modelo, sem código privado — apenas a ideia de que tapes grandes falham fechadas.'}</p>
        <label>ops <input id="demo-ops" type="number" value="64" min="1" max="5000" /></label>
        <label>arena_kb <input id="demo-arena" type="number" value="256" min="1" max="16384" /></label>
        <button id="demo-run" type="button">${en ? 'Validate tape' : 'Validar tape'}</button>
        <p id="demo-out" role="status"></p>
      </section>
    </main>
    <footer class="statusbar"><span>● ${en ? 'CONNECTED' : 'CONECTADO'} · Felipe Lemos · Micro Runtime ${en ? 'public showcase' : 'demonstração pública'}</span><span>© 2026</span></footer>
    <script src="${prefix}assets/js/site.js"></script>
    <script src="${prefix}assets/js/showcase-demo.js"></script>
  </body>
</html>
`;
}

function resumePage(lang, detailed) {
  const prefix = '../';
  const variant = detailed ? 'detailed' : 'one-page';
  const canonical = `${SITE}/resume/${lang === 'pt' ? 'pt' : 'en'}${detailed ? '-detailed' : ''}.html`;
  const title = `${cv.person.name} — ${(lang === 'pt' ? 'Currículo' : 'Résumé')}${detailed ? (lang === 'pt' ? ' (Detalhado)' : ' (Detailed)') : ''}`;
  const sel = detailed ? cv.documents.detailed : cv.documents.onePage;
  const projects = sel.projectIds.map((id) => cv.projects.find((p) => p.id === id)).filter(Boolean);
  const exp = cv.experience[0];
  const pdfFile = { en: detailed ? 'felipe-lemos-resume-en-detailed.pdf' : 'felipe-lemos-resume-en.pdf', pt: detailed ? 'felipe-lemos-curriculo-pt-detalhado.pdf' : 'felipe-lemos-curriculo-pt.pdf' }[lang];
  const short = (s, n) => { const t = String(s); return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t; };
  const summaryText = detailed ? short(L(cv.person.summary, lang), 450) : short(L(cv.person.summary, lang).split('. ')[0] + '.', 150);
  const projSummary = (p) => detailed ? short(L(p.summary, lang), 400) : short(L(p.summary, lang), 150);
  const secAreas = detailed ? cv.securityResearch.areas : cv.securityResearch.areas.slice(0, 2);
  const secIntro = detailed ? short(L(cv.securityResearch.intro, lang), 260) : short(L(cv.securityResearch.intro, lang), 140);
  return `<!doctype html>
<html lang="${lang === 'pt' ? 'pt-BR' : 'en'}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${esc(title)} — ${esc(L(cv.person.headline, lang))}" />
    <meta name="robots" content="noindex,follow" />
    <link rel="canonical" href="${canonical}" />
    <title>${esc(title)}</title>
    <link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="${prefix}assets/css/resume.css" />
    <link rel="stylesheet" href="${prefix}assets/css/print.css" media="print" />
  </head>
  <body class="resume ${detailed ? 'detailed' : 'compact'}">
    <div class="resume-actions screen-only">
      <a href="${prefix}${lang === 'pt' ? 'pt/' : ''}">← ${lang === 'pt' ? 'Portfólio' : 'Portfolio'}</a>
      <span>${lang === 'pt' ? 'Currículo' : 'Résumé'} · ${lang === 'pt' ? (detailed ? 'Detalhado' : 'Uma página') : (detailed ? 'Detailed' : 'One page')} · ${lang === 'pt' ? 'Português' : 'English'}</span>
      <span><a href="${lang === 'pt' ? (detailed ? 'pt.html' : 'pt-detailed.html') : (detailed ? 'en.html' : 'en-detailed.html')}">${lang === 'pt' ? (detailed ? 'Versão 1 página' : 'Versão detalhada') : (detailed ? 'One-page version' : 'Detailed version')}</a> · <a href="${detailed ? (lang === 'pt' ? 'en-detailed.html' : 'pt-detailed.html') : (lang === 'pt' ? 'en.html' : 'pt.html')}">${lang === 'pt' ? 'English' : 'Português'}</a> · <a href="../downloads/${pdfFile}" download>${lang === 'pt' ? 'Baixar PDF' : 'Download PDF'}</a></span>
      <button type="button" onclick="window.print()">${lang === 'pt' ? 'Imprimir / Salvar PDF' : 'Print / Save PDF'}</button>
    </div>
    <main class="resume-sheet">
      <header>
        <h1>${esc(cv.person.name)}</h1>
        <p class="resume-headline">${esc(L(cv.person.headline, lang))}</p>
        <p class="resume-meta">${esc(L(cv.person.location, lang))} · ${esc(cv.person.profiles.linkedin)} · ${esc(cv.person.profiles.github)} · ${esc(cv.person.profiles.robloxNexus)}</p>
      </header>
      <section><h2>${lang === 'pt' ? 'Resumo' : 'Summary'}</h2><p>${esc(summaryText)}</p></section>
      <section><h2>${lang === 'pt' ? 'Habilidades Técnicas' : 'Technical Skills'}</h2><ul>${cv.skills.map((s) => `<li><strong>${esc(L(s.group, lang))}:</strong> ${esc(s.items)}</li>`).join('')}</ul></section>
      <section><h2>${lang === 'pt' ? 'Experiência' : 'Experience'}</h2>
        <article class="resume-entry"><h3>${esc(L(exp.role, lang))} — ${esc(exp.organization)} (${esc(exp.platform)})</h3><p class="resume-when">${lang === 'pt' ? 'Atual' : 'Current'}</p><p><strong>${esc(L(exp.title, lang))}</strong> ${esc(detailed ? short(L(exp.body, lang), 300) : short(L(exp.body, lang), 170))}</p></article>
      </section>
      <section><h2>${lang === 'pt' ? 'Projetos Selecionados' : 'Selected Projects'}</h2>
        ${projects.map((p) => `<article class="resume-entry"><h3>${esc(p.name)}${p.org ? ` · ${esc(p.org)}` : ''} — ${esc(L(p.domain, lang))}</h3><p>${esc(projSummary(p))}</p><ul>${(L(p.resumeBullets, lang)).slice(0, sel.highlightCount).map((b) => `<li>${esc(detailed ? b : short(b, 115))}</li>`).join('')}</ul><p class="resume-tech">${esc(p.evidence)}</p></article>`).join('\n        ')}
      </section>
      <section><h2>${lang === 'pt' ? 'Pesquisa em Segurança' : 'Security Research'}</h2><p>${esc(secIntro)}</p><ul>${secAreas.map((a) => `<li>${esc(L(a, lang))}</li>`).join('')}</ul></section>
      <section><h2>${lang === 'pt' ? 'Certificações' : 'Certifications'}</h2><ul>${cv.certifications.map((c) => `<li>${esc(L(c, lang))}</li>`).join('')}</ul></section>
      <section><h2>${lang === 'pt' ? 'Idiomas e Interesses' : 'Languages & Interests'}</h2><p>${esc(L(cv.extras.languages, lang))}<br />${esc(L(cv.extras.interests, lang))}</p></section>
      <section><h2>${lang === 'pt' ? 'Observação' : 'Note'}</h2><p>${lang === 'pt' ? 'Repositórios sensíveis são descritos como estudos de caso privados, sem código operacional. Detalhes arquiteturais disponíveis em entrevistas técnicas quando apropriado.' : 'Sensitive repositories are described as private case studies without operational code. Architectural detail available in technical interviews where appropriate.'} ${lang === 'pt' ? 'Atualizado em ' : 'Updated '}2026-09-04 · v${cv.meta.contentVersion}</p></section>
    </main>
    <script>if (new URLSearchParams(location.search).get('print') === '1') addEventListener('load', () => setTimeout(() => print(), 400));</script>
  </body>
</html>
`;
}

fs.mkdirSync(path.join(root, 'pt'), { recursive: true });
fs.mkdirSync(path.join(root, 'microruntime'), { recursive: true });
fs.mkdirSync(path.join(root, 'pt/microruntime'), { recursive: true });
fs.mkdirSync(path.join(root, 'resume'), { recursive: true });
fs.mkdirSync(path.join(root, 'assets/css'), { recursive: true });
fs.mkdirSync(path.join(root, 'assets/js'), { recursive: true });
fs.mkdirSync(path.join(root, 'downloads'), { recursive: true });

const clean = (s) => s.replace(/[ \t]+$/gm, '');
fs.writeFileSync(path.join(root, 'index.html'), clean(portfolioPage('en')));
fs.writeFileSync(path.join(root, 'pt/index.html'), clean(portfolioPage('pt')));
fs.writeFileSync(path.join(root, 'microruntime/index.html'), clean(runtimePage('en')));
fs.writeFileSync(path.join(root, 'pt/microruntime/index.html'), clean(runtimePage('pt')));
fs.writeFileSync(path.join(root, 'resume/en.html'), clean(resumePage('en', false)));
fs.writeFileSync(path.join(root, 'resume/en-detailed.html'), clean(resumePage('en', true)));
fs.writeFileSync(path.join(root, 'resume/pt.html'), clean(resumePage('pt', false)));
fs.writeFileSync(path.join(root, 'resume/pt-detailed.html'), clean(resumePage('pt', true)));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>${SITE}/</loc><xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE}/pt/"/><xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/></url>
  <url><loc>${SITE}/pt/</loc><xhtml:link rel="alternate" hreflang="en" href="${SITE}/"/></url>
  <url><loc>${SITE}/microruntime/</loc></url>
  <url><loc>${SITE}/pt/microruntime/</loc></url>
</urlset>
`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /resume/\nDisallow: /downloads/\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('build ok: index, pt, microruntime x2, resume x4, sitemap, robots');
