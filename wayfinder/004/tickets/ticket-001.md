---
id: ticket-001
type: wayfinder:task
status: resolved
claimed_by: agent
blocked_by: []
specification: functional_specification_004.md
---

# Ticket 001: Frameless Inline Grid Slot Markup & Zero `OBJ-*` Chrome Architecture in `index.html` and `components/cards/card-bartending.html`

**Claimed by:** `agent`  
**Status:** `resolved`  
**Blocked By:** *(None — Frontier Root)*  
**Governing Specification:** [`functional_specification_004.md`](../../functional_specification_004.md) (§ 1, § 2.1.1, § 2.1.2, § 2.2.1, § 2.2.3)  
**Governing Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)

---

## 1. Question

What exact DOM markup and component structure must be added to `index.html` (and modular template `components/cards/card-bartending.html`) so the freestanding 3D Game Boy shell showcasing **DITHER-OS Bartending** (`https://luisp1028.github.io/Bartending/`) occupies a first-class slot inside `<section id="projects"><div class="grid">` alongside `OBJ-200`, `OBJ-04`, and `OBJ-01` with zero `OBJ-*` card chrome, zero metadata text, zero `{Action Buttons / Button Groups}`, and full runtime device permissions?

---

## 2. Resolution & Locked Architectural Decisions

1. **Inline Grid Slot Placement (`index.html`)**:
   - Insert `<div class="gb-grid-showcase" id="bartending-showcase-unit" data-unit="dither-os-bartending">` directly inside `<section id="projects"><div class="grid">` alongside `<article class="card" id="obj-200-card">`, `<article class="card" id="obj-04-card">`, and `<article class="card">` (`OBJ-01`).
   - Also create the corresponding standalone component file `components/cards/card-bartending.html` and load `<script type="module" src="js/bartending-gameboy.js"></script>` in `index.html`.
   - Also remove the stray duplicate `</main>` tag at line 246 of `index.html` if present, keeping HTML structure valid.

2. **Strict Zero `OBJ-*` Card Chrome Enforcement (`INV-NO-OBJ-CHROME-01`)**:
   - `#bartending-showcase-unit` does **not** carry the `.card` class and contains:
     - Zero `.card-header`, `.card-id`, or `✜` target reticle nodes.
     - Zero `.card-img` `200px` bounding box nodes.
     - Zero `<h3>` headline or `<p>` summary description nodes.
     - Zero `.btn-group` or `.btn` (`LIVE_DEMO`, `SRC_CODE`, `WHITE_PAPER`) nodes.

3. **3D Game Boy Shell Host & Integrated Bartending Screen Structure**:
   - Inside `#bartending-showcase-unit`:
     - `<div class="gb-3d-shell-host" id="bartending-gb-host" data-rotation-x="0.0000" data-rotation-y="0.0000" data-screen-visible="true" data-power-on="true">`:
       - `<canvas id="bartending-gb-canvas" data-gb-3d-canvas="true"></canvas>`: WebGL canvas rendering the 15-part 3D Game Boy (`assets/gameboy/game-boy.glb` + baked textures) with `alpha: true` and transparent background.
       - `<div class="gb-shell__screen-cont gb-3d-screen-projection" id="bartending-gb-screen">`: Projected 3D screen container aligned to the `screen` mesh of `game-boy.glb`, containing:
         - `<div class="gb-shell__playfield">`:
           - `<iframe id="bartending-game-iframe" title="DITHER-OS Bartending" src="https://luisp1028.github.io/Bartending/" allow="camera; microphone; fullscreen; autoplay; clipboard-read; clipboard-write" allowfullscreen loading="eager" referrerpolicy="no-referrer-when-downgrade"></iframe>`
           - `<img class="gb-screen-shadow" src="assets/gameboy/baked-screen-shadow.png" alt="" aria-hidden="true" draggable="false" />`
       - `<div class="gb-shell__controls" id="bartending-gb-controls" data-gb-3d-controls="true">`: Projected 3D physical button hit targets (`button-cross-up`, `button-cross-down`, `button-cross-left`, `button-cross-right`, `button-b`, `button-a`, `button-select`, `button-start`, `power-button`).
