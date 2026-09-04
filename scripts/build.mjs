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
        <a href="${prefix}${lang === 'pt' ? 'pt/' : ''}#profile">${t.navProfile}</a>
        <a href="${prefix}${lang === 'pt' ? 'pt/' : ''}#work">${t.navWork}</a>
        <a href="${prefix}${lang === 'pt' ? 'pt/' : ''}#expertise">${t.navExpertise}</a>
        <a href="${prefix}microruntime/${lang === 'pt' ? '../pt/microruntime/' : ''}">${t.navRuntime}</a>
        <a href="${prefix}resume/${lang === 'pt' ? 'pt.html' : 'en.html'}">${t.navResume}</a>
      </nav>
      <div class="header-actions">
        <a href="${cv.person.profiles.linkedin}" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a class="lang-link" href="${other.href}" hreflang="${lang === 'en' ? 'pt-BR' : 'en'}" aria-label="${other.aria}">${other.label}</a>
      </div>
    </header>`;
}

const T = {
  en: { navProfile: 'Profile', navWork: 'Work', navExpertise: 'Expertise', navRuntime: 'Runtime', navResume: 'Résumé' },
  pt: { navProfile: 'Perfil', navWork: 'Projetos', navExpertise: 'Competências', navRuntime: 'Runtime', navResume: 'Currículo' }
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

  const projectCards = projects.map((p, i) => `
            <article class="case-card${i === 0 ? ' case-large' : ''}${p.id === 'prisma-platform' ? ' case-wide' : ''}">
              <div class="case-top"><span>0${i + 1}</span><span>${lang === 'pt' ? 'Estudo de caso privado' : 'Private case study'}</span></div>
              <p class="case-domain">${esc(L(p.domain, lang))}${p.org ? ` · ${esc(p.org)}` : ''}</p>
              <h3>${esc(p.name)}</h3>
              <p>${esc(L(p.summary, lang))}</p>
              <dl><div><dt>${lang === 'pt' ? 'Desafio' : 'Challenge'}</dt><dd>${esc(L(p.challenge, lang))}</dd></div><div><dt>${lang === 'pt' ? 'Evidências' : 'Engineering evidence'}</dt><dd>${esc(p.evidence)}</dd></div></dl>
            </article>`).join('');

  const skills = cv.skills.map((s, i) => `
            <article><span>0${i + 1}</span><h3>${esc(L(s.group, lang))}</h3><p>${esc(L(s.body, lang))}</p><small>${esc(s.items)}</small></article>`).join('');

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
            <a class="primary-link" href="#work">${lang === 'pt' ? 'Explorar projetos' : 'Explore selected work'} ↓</a>
            <a href="${prefix}resume/${lang === 'pt' ? 'pt.html' : 'en.html'}">${lang === 'pt' ? 'Currículo em PDF' : 'Résumé as PDF'} ↗</a>
          </div>
          <aside class="dossier" aria-label="${lang === 'pt' ? 'Ficha do perfil' : 'Profile file info'}">
            <p class="dossier-title"><span>${lang === 'pt' ? 'FICHA' : 'FILE INFO'}</span></p>
            <table>
              <tr><th scope="row">HANDLE</th><td>Felipe Lemos</td></tr>
              <tr><th scope="row">${lang === 'pt' ? 'FUNÇÃO' : 'ROLE'}</th><td>${esc(L(cv.person.role, lang))}</td></tr>
              <tr><th scope="row">${lang === 'pt' ? 'ATUAL' : 'CURRENT'}</th><td><a href="${cv.person.profiles.robloxNexus}" target="_blank" rel="noreferrer">NEXUS</a> · Roblox Studio</td></tr>
              <tr><th scope="row">STACK</th><td>Rust · C/C++ · Python · TypeScript · Luau</td></tr>
              <tr><th scope="row">${lang === 'pt' ? 'SEGURANÇA' : 'SECURITY'}</th><td>${lang === 'pt' ? 'Laboratório isolado · somente testes autorizados' : 'Isolated lab · authorized testing only'}</td></tr>
              <tr><th scope="row">${lang === 'pt' ? 'CONTATO' : 'CONTACT'}</th><td><a href="${cv.person.profiles.linkedin}" target="_blank" rel="noreferrer">LinkedIn ↗</a> · <a href="${cv.person.profiles.github}" target="_blank" rel="noreferrer">GitHub ↗</a></td></tr>
            </table>
          </aside>
        </div>
        <div class="hero-footer"><span>EST. 2020</span><span>SOFTWARE / SYSTEMS / SECURITY / GAMES</span><span>22°54'S 43°12'W</span></div>
      </section>

      <section class="profile section" id="profile">
        <div class="section-inner">
          <div class="section-heading">
            ${sec('I', lang === 'pt' ? 'Perfil profissional' : 'Professional profile')}
            <h2>${lang === 'pt' ? 'Amplitude generalista.<br /><em>Profundidade técnica.</em>' : 'Generalist range.<br /><em>Engineering depth.</em>'}</h2>
          </div>
          <div class="profile-copy">
            <p class="lead">${esc(L(cv.person.summary, lang).split('. ')[0])}.</p>
            <div class="profile-columns">
              <p>${esc(L(cv.person.summary, lang))}</p>
              <p>${lang === 'pt' ? 'Atualmente desenvolvo gameplay no NEXUS (Roblox Studio) e conduzo pesquisa aplicada em runtimes Rust com IA local, sistemas distribuídos, telemetria licenciada e segurança ofensiva em laboratório isolado — sempre com escopo autorizado e foco defensivo.' : 'I currently develop gameplay on NEXUS (Roblox Studio) and conduct applied research across Rust runtimes with local AI, distributed systems, licensed telemetry, and offensive security in an isolated lab — always scoped, authorized, and defense-oriented.'}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="career section">
        <div class="section-inner">
          <div class="section-heading compact">
            ${sec('II', lang === 'pt' ? 'Momento atual' : 'Current chapter')}
            <h2>${lang === 'pt' ? 'Construindo sistemas<br /><em>que as pessoas sentem.</em>' : 'Building systems<br /><em>people can feel.</em>'}</h2>
          </div>
          <article class="career-entry">
            <div class="entry-meta"><span>${lang === 'pt' ? 'Atual' : 'Current'}</span><span>${esc(exp.platform)}</span></div>
            <div class="entry-content">
              <p class="entry-overline">${lang === 'pt' ? 'Desenvolvedor' : 'Developer'} · ${esc(exp.organization)}</p>
              <h3>${esc(L(exp.title, lang))}</h3>
              <p>${esc(L(exp.body, lang))}</p>
              <a href="${cv.person.profiles.robloxNexus}" target="_blank" rel="noreferrer">${lang === 'pt' ? 'Ver experiência' : 'View the experience'} ↗</a>
            </div>
          </article>
        </div>
      </section>

      <section class="work section" id="work">
        <div class="section-inner">
          <div class="section-heading wide">
            <div>${sec('III', lang === 'pt' ? 'Engenharia selecionada' : 'Selected engineering work')}<h2>${lang === 'pt' ? 'Evidências acima<br /><em>de adjetivos.</em>' : 'Evidence over<br /><em>adjectives.</em>'}</h2></div>
            <p>${lang === 'pt' ? 'Estudos de caso de repositórios públicos e privados. Código confidencial é descrito no nível de arquitetura, sem expor implementação sensível.' : 'Representative case studies from public and private repositories. Confidential codebases are described at an architectural level without exposing sensitive implementation.'}</p>
          </div>
          <div class="case-grid">
${projectCards}
          </div>
          <p class="showcase-link"><a href="${prefix}microruntime/${lang === 'pt' ? '../pt/microruntime/' : ''}">${lang === 'pt' ? 'Ver demonstração pública do Micro Runtime →' : 'See the public Micro Runtime showcase →'}</a></p>
        </div>
      </section>

      <section class="security section">
        <div class="section-inner">
          <div class="section-heading wide">
            <div>${sec('IV', lang === 'pt' ? 'Segurança & Red Team' : 'Security & Red Team')}<h2>${lang === 'pt' ? 'Capacidade ofensiva,<br /><em>postura defensiva.</em>' : 'Offensive capability,<br /><em>defensive posture.</em>'}</h2></div>
            <p>${esc(L(secRes.intro, lang))}</p>
          </div>
          <ul class="security-list">
            ${secRes.areas.map((a) => `<li>${esc(L(a, lang))}</li>`).join('\n            ')}
          </ul>
          <p class="fineprint">${lang === 'pt' ? 'Todo trabalho sensível permanece privado. Discussões externas limitam-se a conceitos, limites de escopo e resultados defensivos.' : 'All sensitive work stays private. External discussion is limited to concepts, scope boundaries, and defensive outcomes.'}</p>
        </div>
      </section>

      <section class="expertise section" id="expertise">
        <div class="section-inner">
          <div class="section-heading compact">${sec('V', lang === 'pt' ? 'Disciplinas' : 'Engineering disciplines')}<h2>${lang === 'pt' ? 'Amplitude com<br /><em>um centro claro.</em>' : 'Breadth with<br /><em>a clear center.</em>'}</h2></div>
          <div class="discipline-list">
${skills}
          </div>
        </div>
      </section>

      <section class="contact section" id="contact">
        <div class="contact-ornament" aria-hidden="true">✦</div>
        ${sec('VI', lang === 'pt' ? 'Contato' : 'Contact')}
        <h2>${lang === 'pt' ? 'Vamos construir algo<br /><em>que vale compreender.</em>' : 'Let us build something<br /><em>worth understanding.</em>'}</h2>
        <p>${lang === 'pt' ? 'Aberto a engenharia de software, backend, sistemas, segurança de aplicações, DevSecOps, automação e tecnologia para jogos.' : 'Open to software engineering, backend, systems, application security, DevSecOps, automation, and game technology opportunities.'}</p>
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

fs.writeFileSync(path.join(root, 'index.html'), portfolioPage('en'));
fs.writeFileSync(path.join(root, 'pt/index.html'), portfolioPage('pt'));
fs.writeFileSync(path.join(root, 'microruntime/index.html'), runtimePage('en'));
fs.writeFileSync(path.join(root, 'pt/microruntime/index.html'), runtimePage('pt'));
fs.writeFileSync(path.join(root, 'resume/en.html'), resumePage('en', false));
fs.writeFileSync(path.join(root, 'resume/en-detailed.html'), resumePage('en', true));
fs.writeFileSync(path.join(root, 'resume/pt.html'), resumePage('pt', false));
fs.writeFileSync(path.join(root, 'resume/pt-detailed.html'), resumePage('pt', true));

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
