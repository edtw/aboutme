import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

test('build outputs exist', () => {
  for (const f of ['index.html', 'pt/index.html', 'microruntime/index.html', 'pt/microruntime/index.html', 'resume/en.html', 'resume/en-detailed.html', 'resume/pt.html', 'resume/pt-detailed.html', 'sitemap.xml', 'robots.txt']) {
    assert.ok(fs.existsSync(path.join(root, f)), f);
  }
});

test('no private repo links on public pages', () => {
  const html = ['index.html', 'pt/index.html', 'microruntime/index.html', 'pt/microruntime/index.html'].map(read).join('\n');
  for (const r of ['karma', 'micro_runtime', 'esth', 'minecraft', 'pdvmar', 'prismaapp', 'airshipper']) {
    assert.ok(!html.includes(`github.com/edtw/${r}`), r);
  }
});

test('locale metadata', () => {
  assert.ok(read('index.html').includes('<html lang="en">'));
  assert.ok(read('pt/index.html').includes('<html lang="pt-BR">'));
  assert.ok(read('index.html').includes('hreflang="pt-BR"'));
  assert.ok(read('resume/en.html').includes('noindex,follow'));
});

test('resume variants differ sanely', () => {
  const one = read('resume/en.html').length;
  const det = read('resume/en-detailed.html').length;
  assert.ok(det > one, 'detailed should be longer');
});

test('resume section order is ATS-standard', () => {
  for (const f of ['resume/en.html', 'resume/pt.html', 'resume/en-detailed.html', 'resume/pt-detailed.html']) {
    const html = read(f);
    const order = ['Summary', 'Technical Skills', 'Experience', 'Selected Projects', 'Resumo', 'Habilidades Técnicas', 'Experiência', 'Projetos Selecionados']
      .filter((h) => html.includes(`<h2>${h}</h2>`));
    const idx = order.map((h) => html.indexOf(`<h2>${h}</h2>`));
    assert.deepEqual([...idx].sort((a, b) => a - b), idx, `${f} headings out of order`);
    assert.ok(html.includes('Technical Skills') || html.includes('Habilidades Técnicas'), `${f} missing skills heading`);
    assert.ok(html.includes('Certifications') || html.includes('Certificações'), `${f} missing certifications`);
  }
});

test('hero is short, human, visual', () => {
  for (const f of ['index.html', 'pt/index.html']) {
    const html = read(f);
    assert.ok(!html.includes('class="dossier"'), `${f} still has dossier`);
    assert.ok(html.includes('class="stat-strip"'), `${f} missing stat strip`);
    const m = html.match(/<p class="hero-statement">([\s\S]*?)<\/p>/);
    assert.ok(m && m[1].length < 220, `${f} hero statement too long`);
  }
  assert.ok(read('index.html').includes('On purpose'));
  assert.ok(read('pt/index.html').includes('De propósito'));
});

test('work board has filters, cards, approach', () => {
  for (const f of ['index.html', 'pt/index.html']) {
    const html = read(f);
    for (const tr of ['ALL', 'SYSTEMS', 'PRODUCT', 'SECURITY', 'GAMES']) {
      assert.ok(html.includes(`data-filter="${tr}"`), `${f} missing filter ${tr}`);
    }
    const cards = html.match(/class="work-card"/g) || [];
    assert.equal(cards.length, 7, `${f} expected 7 cards`);
    assert.ok(html.includes('LOCAL MIND'), `${f} missing codenames`);
    assert.ok(html.includes('Build') || html.includes('Build'), `${f} missing approach trio`);
  }
});

test('ascii-arts dressing present (dither, statusbar)', () => {
  for (const f of ['index.html', 'pt/index.html', 'microruntime/index.html', 'pt/microruntime/index.html']) {
    const html = read(f);
    assert.ok(html.includes('class="dither"'), `${f} missing dither`);
    assert.ok(html.includes('class="statusbar"'), `${f} missing statusbar`);
  }
});

test('no em-dashes, blackletter, or version trivia on portfolio pages', () => {
  for (const f of ['index.html', 'pt/index.html', 'microruntime/index.html', 'pt/microruntime/index.html']) {
    const html = read(f);
    assert.ok(!html.includes('—'), `${f} contains em-dash`);
    assert.ok(!html.includes('Unifraktur'), `${f} still loads blackletter`);
    assert.ok(!html.includes('Rust 2021') && !html.includes('Rust 2024') && !html.includes('C++17'), `${f} has version trivia`);
  }
  assert.ok(read('styles.css').includes('Anton'), 'display font missing');
});

test('resume pages link static PDFs', () => {
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
