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
