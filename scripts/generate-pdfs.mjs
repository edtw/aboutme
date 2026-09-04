import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  ['resume/en.html', 'downloads/felipe-lemos-resume-en.pdf'],
  ['resume/en-detailed.html', 'downloads/felipe-lemos-resume-en-detailed.pdf'],
  ['resume/pt.html', 'downloads/felipe-lemos-curriculo-pt.pdf'],
  ['resume/pt-detailed.html', 'downloads/felipe-lemos-curriculo-pt-detalhado.pdf']
];
for (const [, out] of pages) fs.mkdirSync(path.dirname(path.join(root, out)), { recursive: true });

let playwright;
try {
  ({ chromium: playwright } = await import('playwright'));
} catch {
  console.log('pdf skip: playwright not installed. Run `npm i -D playwright && npx playwright install chromium` then `npm run pdf`.');
  process.exit(0);
}
const { createServer } = await import('node:http');
const { readFile } = await import('node:fs/promises');
const ext = { '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml', '.js': 'text/javascript', '.xml': 'text/xml', '.txt': 'text/plain' };
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '');
    if (p === '') p = 'index.html';
    const f = path.join(root, p);
    if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
    res.writeHead(200, { 'Content-Type': ext[path.extname(f)] ?? 'application/octet-stream' });
    res.end(await readFile(f));
  } catch { res.writeHead(500); res.end('err'); }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const browser = await playwright.launch();
try {
  for (const [page, out] of pages) {
    const pg = await browser.newPage();
    await pg.goto(`http://127.0.0.1:${port}/${page}?print=1`, { waitUntil: 'networkidle' });
    await pg.pdf({ path: path.join(root, out), format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true });
    await pg.close();
    const bytes = fs.statSync(path.join(root, out)).size;
    console.log(`pdf ok: ${out} (${bytes} bytes)`);
    if (bytes < 5000) throw new Error(`suspiciously small PDF: ${out}`);
  }
} finally {
  await browser.close();
  server.close();
}
