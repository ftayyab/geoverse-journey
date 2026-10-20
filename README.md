# GeoVerse Journey V4 — The Topography Edition

**Faizan Tayyab** · interactive Three.js portfolio based on the supplied CV.

This revision replaces the flat landscape of V3 with a **true, procedurally generated 3D elevation surface** inspired by the supplied terrain reference. It keeps the colorful, separate company mini-worlds, six domain areas, comprehensive experience/education/certifications/skills content, and a red London telephone kiosk opening [LinkedIn](https://www.linkedin.com/in/ftayyab).

## New in V4

- **Real sculpted terrain:** multi-ridge elevation field, varied valleys and hills, elevation-based sandstone-to-teal colors, geological cut faces around the world edge.
- **True elevation contours:** calculated by marching squares from the same heightfield driving the terrain mesh; not flat decoration or a borrowed texture.
- **Terrain-aware scene:** all career and domain buildings, the London phone box, archive buildings, gardens, routes, traveler and camera follow the variable elevation. Ground pads are smoothly flattened only where required.
- **Dark-teal topographic atmosphere:** pale contours, survey marker pins, colorful miniature buildings and readable editorial overlay.
- **Real loading bar:** immediately visible before the JS module completes; tracks scene setup, terrain/world construction, shader compilation (`renderer.compileAsync`), first rendered GPU frame, and web font readiness before clearing. Progress is milestone-based, not a fake timer.
- **CV content retained:** 12 chronological chapters (2 education + 10 professional stops/roles), six disciplines, 18 CV-listed certifications/courses, six technical skill groups and detailed company responsibilities. Overlapping work and inconsistent date records are not silently corrected.

## Quick start

Requires **Node.js 20.19+ or 22.12+** and a current browser with WebGL2.

```bash
npm install
npm run dev
```

Open the localhost URL Vite prints (usually `http://localhost:5173`). `start-windows.bat` and `start-macos-linux.sh` are also provided. To create a deployment package, run `npm run build` and publish the generated `dist/` folder to a static host.

## Navigation

- **W / A / S / D** walk around the raised landscape, with the character following elevation changes.
- **Click a company**, choose a **career timeline** stop, or select a **domain world** to travel there.
- **Guided tour** narrates the full chronological journey; **Atlas view** switches to a top-down view; mouse drag rotates the camera and wheel zooms.
- **CV Vault** offers Experience, Education, Certifications, Skillset and Knowledge & Impact.
- **London red telephone box** provides an in-world LinkedIn connection at `https://www.linkedin.com/in/ftayyab`.

## Files

- `src/terrain.js` — deterministic heightfield and plateau blending.
- `src/terrain-mesh.js` — shaded 3D mesh, edge walls, elevation contours, survey markers.
- `src/world.js` — buildings, phone booth, mini-worlds, labels, vegetation and paths.
- `src/main.js` — camera, travel, interactive UI, first-frame loader.
- `src/data.js` — public professional content derived from the CV.
- `terrain-topography-preview.png` — **illustrative concept rendering**, not a Three.js screenshot.
- `illustrative-preview.html` — offline explorable content preview; not the WebGL site.
- `concept-overview.png` — current topographic concept image (same as terrain-topography-preview.png).

## Verification

Run `npm test` for content/privacy/integrity checks and terrain/loader/navigation assertions. JavaScript syntax can be checked using `node --check`. A full Vite build and live WebGL browser test require installing the npm dependencies; do not treat the illustrative preview as a live rendering verification.

---

## Additional V3 documentation (historical reference)

# GeoVerse Journey V3 — Sunset Chroma Edition

A brighter, more colorful, more reference-inspired edition of the Three.js portfolio world for **Faizan Tayyab**.

## What's new in V3

- richer peach / gold / teal / purple visual palette
- each company represented as a clearer mini-world
- dedicated **Experience** section in the CV Vault
- Experience, Education, Certifications, Skillset, and Knowledge & Impact all included
- updated illustrated preview and concept overview
- classic red London phone booth retained for LinkedIn contact

# GEOVERSE JOURNEY V2 — CHROMATIC EDITION
**Faizan Tayyab · An interactive 3D career universe built with Three.js**

A playable, stylized-premium 3D diorama of a career spanning geographical information systems, software engineering, energy and exploration, data architecture, cloud systems, GeoAI, leadership and education. **V2** enriches every CV chapter, adds a credentials-and-skills collection and redesigns the contact feature as a **traditional London red telephone box** linking to the approved LinkedIn profile.

The game is a true Three.js/WebGL site. `illustrative-preview.html` and `concept-overview.png` are **illustrated representations**, not screenshots of the live 3D scene.

## Run locally

Install **Node.js 20.19+ (or 22.12+)** and run:

```bash
npm install
npm run dev
```

Then open the address printed by Vite (usually `http://localhost:5173/`). You may double-click `start-windows.bat` on Windows or run `./start-macos-linux.sh` on macOS/Linux.

## Explore

| Control | Behavior |
|---|---|
| Explore the world | Enter at the University of Nottingham |
| Click a 3D company landmark or timeline stop | Travel there and open a detailed CV-based chapter |
| Left-side worlds | Navigate to six GIS/engineering/cloud/data/GeoAI/leadership districts |
| **CV Vault** (header or purple shortcut) | Open **Education**, **Certifications**, **Skillset**, **Knowledge & Impact** |
| 3D **Certification Gallery / Skills Atelier** | Walk to dedicated buildings; activates corresponding Vault tab |
| Red London phone box / **Let's connect** | Travel to the phone box, then open public LinkedIn profile |
| **W A S D** | Walk the 3D cartographer around the world |
| Drag / pinch / wheel | Orbit and zoom camera |
| Left / right arrow | Previous / next chronological chapter |
| **M** | Toggle top-down atlas view |
| Guided tour | Automatic camera and walker tour through all chapters |
| Minimap | Visit a company, domain, archive building, or phone box |
| **E** near phone box | Open LinkedIn interaction card |
| **Esc** | Exit vault/help/story panel or stop tour |

## Company career timeline — sourced from CV_2025.docx

Two separate academic milestones and ten career/secondment chapters:

| # | Date | Place | CV role |
|---|---|---|---|
| 01 | 2001–2004 | University of Nottingham | BSc (Hons) Computing and Information Systems · Distinction |
| 02 | 2005–2006 | University of Nottingham | MSc Geographical Information Sciences · Merit |
| 03 | Dec 2006 – Jan 2008 | Ordnance Survey | GIS Developer |
| 04 | Feb 2008 – Jan 2011 | KBR / Granherne | GIS Specialist |
| 05 | 2008 | BP (secondment) | GIS Technical Consultant |
| 06 | Jan 2011 – May 2014 | Tullow Oil | Senior GIS Developer |
| 07 | Jan 2015 – Apr 2015 | ADAS | GIS Developer / Consultant |
| 08 | Jun 2015 – Apr 2018 | SCISYS | GIS Technical Architect; also Solution Architect / Engineer (Apr 2017–Apr 2018) |
| 09 | Apr 2018 – May 2021 | Wood Mackenzie | Senior Engineering Manager / Architect GIS & AWS |
| 10 | 2021 | Verisk Analytics | Geospatial Engineering Manager |
| 11 | Feb 2021 – 2022 | Wood Mackenzie | Senior Principal Data Architect |
| 12 | Jan 2022 – Present | Saudi Aramco | Senior Exploration Analyst |

Each chapter shows **company, role, duration, role responsibilities, key work and tools**, with a relevant colored themed station. An animated arc visually links the station to connected technical domains. The two education chapters have separate clickable university scenes. BP secondment and concurrent job records are not represented as exclusive periods.

**Source caveat:** The CV prints an inconsistent/reversed month range for the Verisk role, so the site deliberately uses **2021 only**, without inventing new months. No conflicting dates were silently repaired. Role summaries and responsibilities are condensed from the supplied CV, not independent employer endorsements.

## Credentials, skills and knowledge

- **18 CV-listed certifications and courses** grouped into AI & Machine Learning, Cloud & Architecture, Data & Streaming, and Leadership & Practice. This includes Google AI/Cloud certificates, AWS certifications, Kubernetes, Udacity programs, and data/AI courses. **If no year was supplied, “Not specified” is displayed.** These qualifications have not been independently verified against issuing-body registries.
- **Six searchable-by-reading skill categories:** Geospatial & GIS, Software Engineering, Cloud & DevOps, Data & Analytics, AI & GeoAI, and Leadership & Delivery. Skills are taken from the CV and arranged for readability; category placement does not imply certification or identical levels of proficiency.
- **Education** comprises separate BSc and MSc milestones, including thesis subjects, grades, and academic scholarships.
- **Knowledge & Impact** covers teaching and technology presentations (including Geo 4.0 in 2025).

## The London phone box

A geometrically modeled, red **K6-style** London telephone booth replaces the earlier generic pastel contact landmark. It features a red domed roof, cream **TELEPHONE** signs, multi-pane window frames, a handset/keypad, and an internal LinkedIn plaque. The booth is an interactive Three.js landmark near the central hub. Visitors travel to it and deliberately click **Open LinkedIn profile**, which opens `https://www.linkedin.com/in/ftayyab` in a new tab.

## Color treatment

The world uses warm peach promenades, emerald vegetation, teal ponds, lilac/cloud-blue architecture, yellow and coral pavilions, lavender GeoAI lighting, colorful trees/flags and soft editorial glass panels. It is colorful, but still a professional technology portfolio rather than a cartoon game.

## Build for deployment

```bash
npm run build
npm run preview
npm test
```

The `dist/` directory is the static production site. `vercel.json` is included; deploy as a **Vite** project (build `npm run build`, output `dist`). GitHub Pages/Netlify can also serve `dist/`. The application has **not been deployed publicly** from this session, so no public URL is claimed.

## Source layout

```text
GeoVerse_Journey_V2/
├── index.html                  # UI shell with timeline, story and CV Vault
├── package.json                # Three.js + Vite
├── src/
│   ├── data.js                 # CV-grounded roles, schools, credentials and skills
│   ├── world.js                # 3D terrain, career stations, knowledge pavilions, phone box
│   ├── main.js                 # Controls, tours, data panels and interactive links
│   └── style.css               # Chromatic premium UI
├── public/world-data.json      # Preview-only data snapshot
├── illustrative-preview.html   # Standalone illustrated preview (NOT WebGL)
├── concept-overview.png        # Concept illustration (NOT WebGL)
├── tests/content.test.mjs      # Structural, content, DOM and privacy tests
├── tools/                      # Optional illustration generators
├── start-windows.bat
├── start-macos-linux.sh
├── vite.config.js
└── vercel.json
```

## Security / privacy / validation

The portfolio intentionally includes the requested **Faizan Tayyab**, the professional histories, education, listed qualifications, and the approved LinkedIn URL. It excludes personal postal address, phone number and email addresses. There are no analytics, login systems, contact forms, third-party GLB models or API keys.

**Validation run in this environment:** `node --check` passed for all JS modules and `npm test` passed for 12 chapter records, 18 qualifications, six skill categories, required role details, source privacy exclusions, UI identifiers, and the London booth. npm registry access was blocked, so `npm install`, Vite's bundled production build and a live WebGL/browser QA session were **not completed here**. The playable implementation should be browser-tested with dependencies installed before publication.
