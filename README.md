<div align="center">

# Felipe Lemos

### Software Engineer · Systems & Security · Roblox Developer

Rust runtimes with local AI · distributed mesh & telemetry systems · combat gameplay on NEXUS — grounded in isolated-lab security research.

[Portfolio](https://edtw.github.io/aboutme/) · [Português](https://edtw.github.io/aboutme/pt/) · [Micro Runtime showcase](https://edtw.github.io/aboutme/microruntime/) · [Résumé EN](https://edtw.github.io/aboutme/resume/en.html) · [Currículo PT](https://edtw.github.io/aboutme/resume/pt.html) · [LinkedIn](https://www.linkedin.com/in/yuee/) · [GitHub](https://github.com/edtw)

Rio de Janeiro, Brazil · Open to opportunities

</div>

---

## What this is

A unified bilingual professional identity:

- **Editorial portfolio** (EN + PT-BR static pages) with gothic-noir visual system
- **Evidence-based case studies**: Karma Network, Micro Runtime, ESTH, Marambaia PDV, Prisma Platform, Airshipper, NEXUS
- **Security & Red Team section** framed for authorized lab work and defensive outcomes
- **Public Micro Runtime showcase**: sanitized demonstration that the runtime can run AI locally (TokenEngine, GGUF, M35 TinyML, MRE1) — concepts only, no private code
- **Résumé creator**: ATS-friendly one-page + detailed résumés in EN + PT-BR, with print CSS and optional PDF generation

## Professional profile

Software engineer with a systems-oriented mindset across product, infrastructure, security, and game development: real-time web platforms, Rust runtimes with local AI execution, cross-platform release infrastructure, distributed mesh/blockchain/compute research, licensed telemetry systems, AI service architectures, isolated-lab security research, computer vision, and Roblox gameplay on NEXUS.

## Selected work (private case studies, architecture-level only)

- **Karma Network · Spirix** — Rust mesh/blockchain/compute framework: PoA chain, DHT overlay, DAG sync, federated learning, Candle inference, reference agent.
- **Micro Runtime** — Rust 2021 runtime for constrained hosts: no_std, custom allocator, one-shot dispatcher, local GGUF + M35 TinyML + MRE1 envelopes, CI architecture gates.
- **ESTH** — Licensed scripting/telemetry system: C++ agent + FastAPI cloud, ownership-gated sync, AES-GCM delivery, versioned contracts, lab-only scope.
- **Marambaia PDV** — Real-time restaurant operations with QR flows and consistency fixes.
- **Prisma Platform** — WhatsApp/AI service platform with provider abstraction.
- **Airshipper** — Cross-platform launcher/release customization (upstream-attributed).
- **NEXUS (Roblox Studio)** — Live PvP arena gameplay development.

## Responsible practice

Security work is education, defense, and authorized testing only. Sensitive repositories stay private and are described at architecture level. No operational tradecraft, weights, keys, payloads, or targeting details are published.

## Repository architecture

Single source of truth → static bilingual output. No client-side content mutation.

```text
src/cv.json                  # canonical content (EN + PT), projects, skills, doc selections
scripts/build.mjs            # generates index, pt, microruntime x2, resume x4, sitemap, robots
scripts/validate.mjs         # locale completeness, IDs, no private-repo links
scripts/generate-pdfs.mjs    # Playwright PDFs from resume pages (optional dep)
assets/css/{resume,print,showcase}.css
assets/js/{site,showcase-demo}.js
resume/{en,en-detailed,pt,pt-detailed}.html   # generated, ATS-friendly, noindex
microruntime/, pt/microruntime/               # generated public showcase
downloads/                   # generated PDFs (gitignored)
schemas/cv.schema.json
tests/content.test.mjs
.github/workflows/{ci,pages}.yml
```

## Development

```bash
npm run build     # generate all pages
npm run validate  # locale + link checks
npm test          # content tests
npm run check     # syntax checks
npm start         # serve at http://localhost:4173
```

PDFs (optional):

```bash
npm i -D playwright && npx playwright install chromium
npm run pdf       # writes downloads/*.pdf
```

## LinkedIn positioning

**Headline:** Software Engineer | Backend & Systems | Security Engineering | Rust, Python, TypeScript, C/C++ | Roblox Developer

**Título:** Engenheiro de Software | Backend e Sistemas | Engenharia de Segurança | Rust, Python, TypeScript, C/C++ | Desenvolvedor Roblox
