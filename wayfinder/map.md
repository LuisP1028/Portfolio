# Wayfinder Map: Freestanding 3D Game Boy Shell & DITHER-OS Bartending Inline Grid Showcase (`functional_specification_004.md`)

**Governing Specification:** [`functional_specification_004.md`](../functional_specification_004.md)  
**Governing System Glossary:** [`LANGUAGE.md`](../LANGUAGE.md)  
**Status:** Canonical Plan & Integration Test Plan Locked; Zero Architectural Ambiguity (Tickets 001–006 Resolved, Master Matrix & Test Matrix Synthesized)

---

## 1. Destination

Establish a complete, deterministic, and verified decision set detailing every asset, DOM markup, Three.js WebGL rendering, projective homography, hardware D-Pad/button hitbox mapping, CSS responsive grid, and z-index stacking requirement across the codebase to implement and verify the freestanding 3D Game Boy shell and live **DITHER-OS Bartending** (`https://luisp1028.github.io/Bartending/`) inline grid showcase specified in [`functional_specification_004.md`](../functional_specification_004.md):

1. **Frameless Inline Grid Slot Markup & Zero `OBJ-*` Chrome Architecture (Ticket 001):** Mount `#bartending-showcase-unit.gb-grid-showcase` directly inside `<section id="projects"><div class="grid">` in [`index.html`](../index.html) (and [`components/cards/card-bartending.html`](../components/cards/card-bartending.html)) alongside `OBJ-200`, `OBJ-04`, and `OBJ-01`, with zero `.card` border, zero `.card-header`/`OBJ-*` badge/reticle `✜`, zero `200px` `.card-img` box, zero title/summary text, and zero `{Action Buttons / Button Groups}`.
2. **3D Game Boy Asset Provisioning, Native Three.js Shell Renderer, Interactive Axis Spin, and 1:1 Projective Screen Homography (Ticket 002):** Provision the 15-part `game-boy.glb` model and 4 baked surface textures under `assets/gameboy/` and implement [`js/bartending-gameboy.js`](../js/bartending-gameboy.js) to render the freestanding 3D Game Boy over a transparent WebGL canvas (`alpha: true`) with unclipped camera framing, 1:1 sub-pixel inner screen registration for `#bartending-game-iframe`, `matrix3d` perspective homography with rear-face occlusion (`facingDot <= 0.08`), pointer/touch drag-to-rotate with scroll disambiguation, `devicemotion` / `gb-shake-reset` origin reset, and tactile 3D button depression/tilt animations.
3. **Diegetic Transparent Grid Styling, Responsive Breakpoint Proportions, and `{Stacking Context & Z-Index Layering}` Governance (Ticket 003):** Add `.gb-grid-showcase` and child rules to [`css/animations.css`](../css/animations.css) and [`css/modal.css`](../css/modal.css) enforcing `background: transparent; border: none; position: relative; z-index: 1; isolation: isolate;`, balanced grid proportions across `1920px`, `1440px`, `1024px`, `768px`, `375px` viewports and `200%` zoom, and strict z-index subordination beneath `<header>` (`10005`), `#chat-widget-container` (`50000`), and `.modal-overlay` (`100000`).
4. **Sibling `{Project Cards / OBJ Boxes}` Non-Regression & Zero `{Label Truncation & Text Overflow}` Verification (Ticket 004):** Preserve 100% of sibling card functionality (`OBJ-200`, `OBJ-04`, `OBJ-01`), modal launches (`TERMINAL_200`, `TERMINAL_04`, `TERMINAL_01`, PDF viewer), and 100% glyph visibility (`scrollWidth <= clientWidth`) on `LIVE_DEMO`, `SRC_CODE`, and `WHITE_PAPER` across all viewports.
5. **End-to-End Integration Test Decision Mapping, Live Runtime Payload Admissibility & Verification Architecture (Ticket 005):** Synthesize [`test-matrix.md`](./test-matrix.md) covering all 5 Acceptance Criteria in [`functional_specification_004.md`](../functional_specification_004.md) with zero mocks and zero `{errors}`.
6. **Hardware D-Pad & Button Hitbox Mapping via Dual-Layer CSS `mask-image` + SVG `clipPath` (Ticket 006):** Map all 9 physical controls (`D-Pad Up/Down/Left/Right`, `A`, `B`, `Select`, `Start`, `Power`) on the outer 3D Game Boy shell 1:1 onto the live cross-origin Bartending runtime (`#bartending-game-iframe`) using CSS `mask-image` (visual LCD aperture) and `<clipPath id="gb-interactive-regions" clipPathUnits="objectBoundingBox">` (interactive hit regions), while preserving 3D drag-to-rotate on the Game Boy housing (`body`).

---

## 2. Notes & Architectural Foundation

- **Domain:** Portfolio UI, Three.js WebGL 3D Hardware Showcase, Projective `matrix3d` Screen Homography, Responsive CSS Grid, and `{Stacking Context & Z-Index Layering}`.
- **Authoritative Glossary:** [`LANGUAGE.md`](../LANGUAGE.md)
- **Locked Invariants:**
  - `INV-NO-OBJ-CHROME-01`: Complete absence of `.card`, `.card-header`, `.card-id`, `✜`, `.card-img`, `h3`, `p`, `.btn-group`, and `.btn` inside `#bartending-showcase-unit`.
  - `INV-UNCLIPPED-SHELL-01`: Complete 15-part 3D Game Boy silhouette renders with `alpha: true` transparent background over `#050505` and `.bg-grid`, unclipped across all viewports.
  - `INV-SCREEN-ALIGN-01`: 1:1 sub-pixel alignment of `https://luisp1028.github.io/Bartending/` to the 3D `screen` mesh with `matrix3d` perspective homography and rear-face occlusion when rotated > 90°.
  - `INV-INTERACT-SCROLL-01`: Direct in-place shell rotation, physical 3D button actuation mapped 1:1 into live gameplay via SVG `clipPath` + CSS `mask-image`, live screen gameplay, and native page scroll disambiguation.
  - `INV-STACKING-01`: Strict z-index subordination (`z-index: 1; isolation: isolate`) beneath `<header>` (`10005`), `#chat-widget-container` (`50000`), and `.modal-overlay` (`100000`).
  - `INV-BTN-GLYPHS-01`: Zero `{Label Truncation & Text Overflow}` on neighboring `{Project Cards / OBJ Boxes}` (`OBJ-200`, `OBJ-04`, `OBJ-01`) across all viewports.
  - `INV-FAILFAST-01`: Deterministic fail-fast asset and DOM validation with zero silent fallbacks (`RULE[user_global]`).

---

## 3. Decisions So Far

- **[Ticket 001: Frameless Inline Grid Slot Markup & Zero `OBJ-*` Chrome Architecture in `index.html` and `components/cards/card-bartending.html`](./tickets/ticket-001.md)** — Resolved. Locked frameless `#bartending-showcase-unit.gb-grid-showcase` markup inside `#projects .grid` with zero `OBJ-*` chrome and full runtime media permissions on `#bartending-game-iframe`.
- **[Ticket 002: 3D Game Boy Asset Provisioning, Native Three.js Shell Renderer, Interactive Axis Spin, and 1:1 Projective Screen Homography in `js/bartending-gameboy.js`](./tickets/ticket-002.md)** — Resolved. Locked `assets/gameboy/` provisioning and `js/bartending-gameboy.js` transparent WebGL renderer, unclipped camera framing (`[-1.96, 1.98]`), 1:1 screen mapping, `matrix3d` homography, rear-face occlusion, raycast scroll disambiguation, and 3D button animations.
- **[Ticket 003: Diegetic Transparent Grid Styling, Responsive Breakpoint Proportions, and `{Stacking Context & Z-Index Layering}` Governance in `css/animations.css`, `css/modal.css`, and `css/styles.css`](./tickets/ticket-003.md)** — Resolved. Locked `.gb-grid-showcase` transparent styling, `z-index: 1; isolation: isolate;` stacking context, and responsive breakpoint sizing across `1920px`–`375px` and `200%` zoom.
- **[Ticket 004: Sibling `{Project Cards / OBJ Boxes}` Non-Regression & Zero `{Label Truncation & Text Overflow}` Verification across All Viewports](./tickets/ticket-004.md)** — Resolved. Locked 4-unit grid column geometry and 100% glyph visibility verification for `LIVE_DEMO`, `SRC_CODE`, and `WHITE_PAPER` on `OBJ-200`, `OBJ-04`, and `OBJ-01`.
- **[Ticket 005: End-to-End Integration Test Decision Mapping, Live Runtime Payload Admissibility & Verification Architecture (`test-matrix.md`)](./tickets/ticket-005.md)** — Resolved. Locked live DOM/WebGL verification schemas, deterministic oracles, and synthesized [`test-matrix.md`](./test-matrix.md).
- **[Ticket 006: Hardware D-Pad & Button Hitbox Mapping via Dual-Layer CSS `mask-image` (Visual LCD Aperture) + SVG `clipPath` (Interactive Control Regions)](./tickets/ticket-006.md)** — Resolved. Locked dual-layer CSS `mask-image` (`50% 23.27471%` / `30.16476%`) + `<clipPath id="gb-interactive-regions" clipPathUnits="objectBoundingBox">` so native clicks on `D-Pad Up/Down/Left/Right`, `A`, `B`, `Select`, `Start`, and `Power` drive the live Bartending game directly while clicks/drags on `body` rotate the 3D shell.

---

## 4. Not Yet Specified

*(All functional requirements, asset specifications, file transformations, and verification oracles for `functional_specification_004.md` have been charted and resolved. Zero fog remains.)*

---

## 5. Out of Scope

- Modifying the visual design, copy, or modal workflows of `OBJ-200`, `OBJ-04`, or `OBJ-01`.
- Modifying the startup `#intro-layer`, `.hero` section, or `PLATODOOM` (`#chat-widget-container`).
- Adding `OBJ-*` card borders, headers, text summaries, or `{Action Buttons / Button Groups}` to the 3D Game Boy showcase slot.
