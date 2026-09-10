<div align="center">

# Felipe "Yuee" Lemos

### Security Engineer · Red Team & Blue Team · AI & Rust Systems

Red team and blue team security engineering. Rust runtimes with local AI. Distributed mesh and telemetry. Combat gameplay on NEXUS.

[Portfolio](https://edtw.github.io/aboutme/) · [Português](https://edtw.github.io/aboutme/pt/) · [Micro Runtime showcase](https://edtw.github.io/aboutme/microruntime/) · [Résumé EN](https://edtw.github.io/aboutme/resume/en.html) · [Currículo PT](https://edtw.github.io/aboutme/resume/pt.html) · [LinkedIn](https://www.linkedin.com/in/yuee/) · [GitHub](https://github.com/edtw)

Rio de Janeiro, Brazil · Open to opportunities

</div>

---

## What this is

A unified bilingual professional identity:

- **Editorial portfolio** (EN + PT-BR static pages) with a cyber-operator console visual system
- **Evidence-based case studies**: Karma Network, Micro Runtime, ESTH, Marambaia PDV, Prisma Platform, Airshipper, NEXUS
- **Security & Red Team section** framed for authorized lab work and defensive outcomes
- **Public Micro Runtime showcase**: architecture-level case study of the operator platform: endpoint agent, command-and-control plane, local AI with per-action authorization, and the red-to-blue workflow. No private code.
- **Résumé creator**: ATS-friendly one-page + detailed résumés in EN + PT-BR, with print CSS and optional PDF generation

## Professional profile

Software engineer and security researcher with a systems-oriented mindset across red team, blue team, product, infrastructure, and game development: real-time web platforms, Rust runtimes with local AI execution, cross-platform release infrastructure, distributed mesh/blockchain/compute research, licensed telemetry systems, isolated-lab security research, computer vision, and Roblox gameplay on NEXUS.

## Selected work (private case studies, architecture-level only)

- **Karma Network · Spirix:** Rust mesh/blockchain/compute framework with PoA chain, DHT overlay, DAG sync, federated learning, Candle inference, and a reference agent.
- **Micro Runtime:** Red team operator platform in Rust: endpoint agent + command-and-control plane for authorized operations, local AI (GGUF, M35 TinyML) behind a capability broker, site PKI, and CI architecture gates.
- **ESTH:** Licensed scripting/telemetry system with a C++ agent, FastAPI cloud, ownership-gated sync, AES-GCM delivery, versioned contracts, and lab-only scope.
- **Marambaia PDV:** Real-time restaurant operations with QR flows and consistency fixes.
- **Prisma Platform:** WhatsApp/AI service platform with provider abstraction.
- **Airshipper:** Cross-platform launcher/release customization with upstream attribution.
- **NEXUS (Roblox Studio):** Live PvP arena gameplay development.

## Responsible practice

Security work is education, defense, and authorized testing only. Sensitive repositories stay private and are described at architecture level. No operational tradecraft, weights, keys, payloads, or targeting details are published.

## Repository architecture

Single source of truth → static bilingual output. No client-side content mutation.

```text
src/cv.json                  # canonical content (EN + PT), projects, skills, doc selections
scripts/build.mjs            # generates pages and an allowlisted dist/ deployment artifact
scripts/validate.mjs         # locale completeness, IDs, no private-repo links
scripts/generate-pdfs.mjs    # Playwright PDFs from resume pages (optional dep)
assets/css/{resume,print,showcase}.css
assets/js/{site,showcase-demo}.js
resume/{en,en-detailed,pt,pt-detailed}.html   # generated, ATS-friendly, noindex
microruntime/, pt/microruntime/               # generated public showcase
downloads/                   # generated and versioned PDFs
dist/                        # generated public artifact (gitignored)
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
