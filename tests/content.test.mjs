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

test('hero statement names real work and dossier is present', () => {
  for (const f of ['index.html', 'pt/index.html']) {
    const html = read(f);
    assert.ok(html.includes('class="dossier"'), `${f} missing dossier`);
    assert.ok(html.includes('NEXUS'), `${f} statement missing NEXUS`);
    assert.ok(html.includes('Rust'), `${f} statement missing Rust`);
  }
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
