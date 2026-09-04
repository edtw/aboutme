import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cv = JSON.parse(fs.readFileSync(path.join(root, 'src/cv.json'), 'utf8'));
const errors = [];
const forLang = (obj, lang) => obj?.[lang];
for (const lang of ['en', 'pt']) {
  for (const k of ['location', 'headline', 'role', 'statement', 'summary']) {
    if (!forLang(cv.person[k], lang)) errors.push(`person.${k} missing ${lang}`);
  }
  for (const p of cv.projects) {
    for (const k of ['domain', 'summary', 'challenge']) if (!forLang(p[k], lang)) errors.push(`project ${p.id}.${k} missing ${lang}`);
    if (!p.resumeBullets?.[lang]?.length) errors.push(`project ${p.id}.resumeBullets missing ${lang}`);
  }
  for (const k of ['title', 'intro']) if (!forLang(cv.securityResearch[k], lang)) errors.push(`securityResearch.${k} missing ${lang}`);
  cv.securityResearch.areas.forEach((a, i) => { if (!forLang(a, lang)) errors.push(`securityResearch.areas[${i}] missing ${lang}`); });
  cv.skills.forEach((s, i) => {
    if (!forLang(s.group, lang)) errors.push(`skills[${i}].group missing ${lang}`);
    if (!forLang(s.body, lang)) errors.push(`skills[${i}].body missing ${lang}`);
  });
  cv.certifications.forEach((c, i) => { if (!forLang(c, lang)) errors.push(`certifications[${i}] missing ${lang}`); });
  for (const k of ['languages', 'interests']) if (!forLang(cv.extras[k], lang)) errors.push(`extras.${k} missing ${lang}`);
}
const ids = new Set();
for (const p of cv.projects) {
  if (ids.has(p.id)) errors.push(`duplicate project id ${p.id}`);
  ids.add(p.id);
  if (!['private-case-study', 'public'].includes(p.visibility)) errors.push(`project ${p.id} bad visibility`);
}
for (const v of ['onePage', 'detailed']) for (const id of cv.documents[v].projectIds) if (!ids.has(id)) errors.push(`documents.${v} unknown project ${id}`);
// no public links to private repos
const html = ['index.html', 'pt/index.html', 'microruntime/index.html', 'pt/microruntime/index.html'].map((f) => { try { return fs.readFileSync(path.join(root, f), 'utf8'); } catch { return ''; } }).join('\n');
for (const m of html.matchAll(/github\.com\/edtw\/([A-Za-z0-9_.-]+)/g)) {
  const repo = m[1];
  if (['karma', 'micro_runtime', 'esth', 'minecraft', 'pdvmar', 'prismaapp', 'airshipper', 'velorenmod', 'velorens'].includes(repo)) errors.push(`public page links private repo ${repo}`);
}
if (errors.length) { console.error(errors.map((e) => ` - ${e}`).join('\n')); process.exit(1); }
console.log(`validate ok: ${cv.projects.length} projects, 2 locales, no private links`);
