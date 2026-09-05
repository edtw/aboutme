import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const publicPages = ['index.html', 'pt/index.html', 'microruntime/index.html', 'pt/microruntime/index.html'];
const resumePages = ['resume/en.html', 'resume/en-detailed.html', 'resume/pt.html', 'resume/pt-detailed.html'];

test('build outputs and allowlisted deployment artifact exist', () => {
  for (const file of [...publicPages, ...resumePages, 'sitemap.xml', 'robots.txt']) {
    assert.ok(fs.existsSync(path.join(root, file)), file);
    assert.ok(fs.existsSync(path.join(root, 'dist', file)), `dist/${file}`);
  }
  assert.deepEqual(
    fs.readdirSync(path.join(root, 'dist')).sort(),
    ['assets', 'downloads', 'favicon.svg', 'index.html', 'microruntime', 'pt', 'resume', 'robots.txt', 'sitemap.xml', 'styles.css'].sort()
  );
  for (const privateName of ['poc', 'src', 'scripts', 'tests', 'node_modules', 'downloads/ascii arts']) {
    assert.ok(!fs.existsSync(path.join(root, 'dist', privateName)), `${privateName} must not be deployed`);
  }
});

test('no private repository links on public pages', () => {
  const html = publicPages.map(read).join('\n');
  for (const repository of ['karma', 'micro_runtime', 'esth', 'minecraft', 'pdvmar', 'prismaapp', 'airshipper']) {
    assert.ok(!html.includes(`github.com/edtw/${repository}`), repository);
  }
});

test('locale metadata and page switches are reciprocal', () => {
  assert.match(read('index.html'), /<html lang="en">/);
  assert.match(read('pt/index.html'), /<html lang="pt-BR">/);
  assert.match(read('index.html'), /class="lang-link" href="pt\//);
  assert.match(read('pt/index.html'), /class="lang-link" href="\.\.\//);
  assert.match(read('microruntime/index.html'), /class="lang-link" href="\.\.\/pt\/microruntime\//);
  assert.match(read('pt/microruntime/index.html'), /class="lang-link" href="\.\.\/\.\.\/microruntime\//);
  assert.ok(read('microruntime/index.html').includes(`${rootUrl()}/pt/microruntime/`));
  assert.ok(read('pt/microruntime/index.html').includes(`${rootUrl()}/microruntime/`));
  assert.ok(read('resume/en.html').includes('noindex,follow'));
});

test('resume variants differ and use standard section order', () => {
  assert.ok(read('resume/en-detailed.html').length > read('resume/en.html').length);
  const headings = {
    en: ['Summary', 'Technical Skills', 'Experience', 'Selected Projects', 'Security Research', 'Certifications'],
    pt: ['Resumo', 'Habilidades Técnicas', 'Experiência', 'Projetos Selecionados', 'Pesquisa em Segurança', 'Certificações']
  };
  for (const file of resumePages) {
    const html = read(file);
    const order = headings[file.includes('/pt') ? 'pt' : 'en'].map((heading) => html.indexOf(`<h2>${heading}</h2>`));
    assert.ok(order.every((index) => index >= 0), `${file} missing heading`);
    assert.deepEqual(order, [...order].sort((a, b) => a - b), `${file} headings out of order`);
    assert.ok(!html.includes('…'), `${file} contains mechanically truncated copy`);
    assert.match(html, /class="resume-meta"[\s\S]*<a href=/, `${file} profile URLs must be links`);
  }
});

test('hero has a focused identity and direct actions', () => {
  for (const file of ['index.html', 'pt/index.html']) {
    const html = read(file);
    assert.ok(html.includes('class="identity-mark"'), `${file} missing identity mark`);
    assert.ok(html.includes('ascii-console'), `${file} missing ASCII console`);
    assert.ok(html.includes('ascii-bg'), `${file} missing systems backdrop`);
    assert.ok(html.includes('tree-svg'), `${file} missing dot-matrix tree`);
    assert.ok(html.includes('telemetry-grid'), `${file} missing telemetry grid`);
    assert.ok(html.includes('wave-field'), `${file} missing particle wave`);
    assert.ok(!html.includes('class="stat-strip"'), `${file} still has implementation stats`);
    const statement = html.match(/<p class="hero-statement">([\s\S]*?)<\/p>/);
    assert.ok(statement && statement[1].length < 220, `${file} hero statement too long`);
    assert.ok(html.includes('href="#work"'), `${file} missing primary work action`);
  }
});

test('motion system animates identity, ASCII, and technical flow', () => {
  const css = read('styles.css');
  for (const animation of ['identity-enter', 'ascii-decode', 'signal-glitch', 'node-signal', 'canopy-twinkle', 'wave-drift']) {
    assert.ok(css.includes(`@keyframes ${animation}`), `missing ${animation} animation`);
  }
  assert.ok(css.includes('prefers-reduced-motion'), 'missing reduced motion fallback');
});

test('social preview uses a crawler-compatible image', () => {
  assert.ok(fs.existsSync(path.join(root, 'assets/social-card.png')));
  assert.ok(fs.statSync(path.join(root, 'assets/social-card.png')).size > 10000);
  for (const file of publicPages) {
    const html = read(file);
    assert.ok(html.includes('/assets/social-card.png'));
    assert.ok(html.includes('og:image:width'));
    assert.ok(html.includes('og:image:height'));
  }
});

test('work is proof-first, filterable, and hierarchically varied', () => {
  for (const file of ['index.html', 'pt/index.html']) {
    const html = read(file);
    assert.ok(html.indexOf('id="work"') < html.indexOf('id="profile"'), `${file} work must precede profile`);
    assert.ok(html.includes('class="flagship work-item reveal"'), `${file} missing flagship`);
    assert.ok(html.includes('class="runtime-diagram"'), `${file} missing project-derived diagram`);
    assert.equal((html.match(/class="[^"]*work-item reveal"/g) ?? []).length, 7, `${file} expected seven projects`);
    assert.ok(html.includes('work-card-major') && html.includes('work-card-compact'), `${file} missing card hierarchy`);
    for (const track of ['ALL', 'SYSTEMS', 'PRODUCT', 'SECURITY', 'GAMES']) {
      assert.ok(html.includes(`data-filter="${track}"`), `${file} missing ${track} filter`);
    }
    assert.ok(html.includes('class="filter-count"'), `${file} missing announced result count`);
  }
});

test('navigation and interactions remain available on mobile', () => {
  for (const file of publicPages) {
    const html = read(file);
    assert.ok(html.includes('class="mobile-nav"'), `${file} missing mobile menu`);
    assert.ok(html.includes('class="lang-link"'), `${file} missing persistent locale switch`);
    assert.ok(html.includes('id="top"'), `${file} missing top target`);
    assert.ok(html.includes('tabindex="-1"'), `${file} main must accept skip-link focus`);
  }
  assert.ok(read('pt/index.html').includes('Pular para o conteúdo'));
  const css = read('styles.css');
  assert.match(css, /min-height: 44px/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /scroll-behavior: auto/);
});

test('showcase is localized and exposes budgets before interaction', () => {
  const pt = read('pt/microruntime/index.html');
  assert.ok(pt.includes('Máximo de 64 operações e 256 KiB'));
  assert.ok(pt.includes('data-lang="pt"'));
  const js = read('assets/js/showcase-demo.js');
  assert.ok(js.includes('ACEITO'));
  assert.ok(js.includes('REJEITADO'));
  assert.ok(js.includes('Maximum 64 ops / 256 KiB'));
});

test('public pages avoid stale design and version trivia', () => {
  for (const file of publicPages) {
    const html = read(file);
    assert.ok(!html.includes('—'), `${file} contains an em dash`);
    assert.ok(!html.includes('Unifraktur'), `${file} loads blackletter`);
    assert.ok(!html.includes('Rust 2021') && !html.includes('Rust 2024') && !html.includes('C++17'), `${file} has version trivia`);
    assert.ok(!html.includes('fonts.googleapis.com'), `${file} has an external font dependency`);
  }
  assert.ok(read('styles.css').includes('--display: "Arial Narrow"'));
});

test('resume pages link current static PDFs', () => {
  const pairs = [
    ['resume/en.html', 'felipe-lemos-resume-en.pdf'],
    ['resume/en-detailed.html', 'felipe-lemos-resume-en-detailed.pdf'],
    ['resume/pt.html', 'felipe-lemos-curriculo-pt.pdf'],
    ['resume/pt-detailed.html', 'felipe-lemos-curriculo-pt-detalhado.pdf']
  ];
  for (const [html, pdf] of pairs) {
    assert.ok(read(html).includes(`downloads/${pdf}`), `${html} missing ${pdf} link`);
    assert.ok(fs.existsSync(path.join(root, 'downloads', pdf)), `${pdf} not generated`);
  }
});

test('static PDFs contain the current name and expected page counts', async () => {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const expected = [
    ['felipe-lemos-resume-en.pdf', 1],
    ['felipe-lemos-resume-en-detailed.pdf', 2],
    ['felipe-lemos-curriculo-pt.pdf', 1],
    ['felipe-lemos-curriculo-pt-detalhado.pdf', 2]
  ];
  for (const [file, pages] of expected) {
    const task = getDocument({ data: new Uint8Array(fs.readFileSync(path.join(root, 'downloads', file))) });
    const pdf = await task.promise;
    let text = '';
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(' ');
    }
    assert.equal(pdf.numPages, pages, `${file} page count`);
    assert.ok(text.includes('Felipe "Yuee" Lemos'), `${file} has a stale name`);
    assert.ok(!text.includes('…'), `${file} contains clipped copy`);
    assert.ok(!text.includes('—'), `${file} contains an em dash`);
    assert.ok(!text.includes('Rust 2021') && !text.includes('Rust 2024') && !text.includes('C++17'), `${file} contains version trivia`);
    await task.destroy();
  }
});

function rootUrl() {
  return 'https://edtw.github.io/aboutme';
}
