# Engineering Portfolio 2.0 — Jeffrey Murithi (@Agustasvj)

[![Deploy to GitHub Pages](https://github.com/Agustasvj/svjeff-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Agustasvj/svjeff-portfolio/actions/workflows/deploy.yml)
[![Sync Portfolio Projects](https://github.com/Agustasvj/svjeff-portfolio/actions/workflows/sync-projects.yml/badge.svg)](https://github.com/Agustasvj/svjeff-portfolio/actions/workflows/sync-projects.yml)

An engineering portfolio platform showcasing work across **IoT, embedded systems, custom PCB design, mechanical CAD, and software engineering**. Built with React 19, TypeScript, Three.js, Framer Motion, and Vite.

---

## 🚀 Key Features

- **Project Workspaces & Viewers**:
  - **Interactive 3D CAD Viewport**: Built with Three.js featuring orbit controls, wireframe inspection, camera presets (ISO, Top, Front), and procedural models (Spaceframe chassis, Handheld controller, Mountain bike frame, PCB).
  - **System Architecture Diagrams**: Technical block diagrams detailing MCU pins, optical break-beam sensors, signal pre-amps, power regulation, and cloud MQTT telemetry with animated bus traces.
  - **Interactive Git History Graph**: Branch rail visualization with commit inspector, SHAs, timestamps, and commit links.
  - **Sandboxed Web & Telemetry Preview**: Multi-viewport switcher (Desktop, Tablet, Mobile) with live device terminal output.
  - **High-Resolution Visual Gallery**: Zoomable lightbox inspection for hardware CAD renders and schematics.
- **GitHub Intelligence Dashboard**:
  - Live discovery of repositories tagged with topic `portfolio`.
  - Rate-limit resilient client with local caching and offline fallback.
  - Automated CI sync workflow updating `public/data/projects.json` via GitHub Actions cron.
- **Full Content Preservation**:
  - All 5 projects: ESP32 Face Recognition, Sound-Reactive LED PCB, Handheld Controller, SxS Spaceframe, and MTB Frame Study.
  - Verified credentials & certificates: Cisco IoT, Cisco Security Awareness, Moi University Hackathon, Climate Action.
  - Categorized engineering skills matrix with lab & workshop capabilities.
  - Deep linking (`#projects`, `#about`, `#skills`, `#certifications`, `#contact`, and `#project-<id>`).

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8 with manual chunk splitting
- **3D Graphics**: Three.js (WebGL 2.0)
- **Motion**: Framer Motion
- **Styling**: Vanilla CSS Design Tokens (Dark engineering aesthetic)
- **Deployment**: GitHub Pages via GitHub Actions

---

## 💻 Local Development

```bash
# 1. Clone repository
git clone https://github.com/Agustasvj/svjeff-portfolio.git
cd svjeff-portfolio

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build production bundle
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 📦 Tagging Projects for Auto-Discovery

To make any of your GitHub repositories appear dynamically in the **GitHub Intelligence Dashboard**:

1. In your GitHub repository, add the topic **`portfolio`**.
2. (Optional) Place a `portfolio.project.json` in the root of your repository (see [`public/portfolio.project.json.example`](./public/portfolio.project.json.example)):

```json
{
  "$schema": "https://agustasvj.github.io/svjeff-portfolio/schemas/project-manifest.json",
  "schemaVersion": 1,
  "featured": true,
  "title": "ESP32 Break-Beam Face Recognition System",
  "description": "Embedded identity verification system utilizing ESP32-CAM.",
  "category": "iot",
  "stage": "prototype",
  "technologies": ["ESP32-CAM", "NodeMCU", "Arduino Framework"]
}
```

---

## 🌐 Deployment to GitHub Pages

Deployment is automated via GitHub Actions:
- On every push to `main`, `.github/workflows/deploy.yml` builds and deploys to `https://agustasvj.github.io/svjeff-portfolio/`.
- Every 6 hours, `.github/workflows/sync-projects.yml` queries GitHub for new projects and commits updated data.

---

## 👤 Author

**Jeffrey Murithi**
- **Location**: Syokimau, Machakos, Kenya
- **Institution**: Moi University (B.Sc. Informatics)
- **GitHub**: [@Agustasvj](https://github.com/Agustasvj)
- **WhatsApp**: [+254 790 438 394](https://wa.me/+254790438394)
