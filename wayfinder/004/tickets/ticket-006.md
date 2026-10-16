---
id: ticket-006
type: wayfinder:task
status: resolved
claimed_by: agent
blocked_by:
  - ./ticket-002.md
  - ./ticket-003.md
specification: functional_specification_004.md
---

# Ticket 006: Hardware D-Pad & Button Hitbox Mapping via Dual-Layer CSS `mask-image` (Visual LCD Aperture) + SVG `clipPath` (Interactive Control Regions)

**Claimed by:** `agent`  
**Status:** `resolved`  
**Blocked By:** [`ticket-002.md`](./ticket-002.md), [`ticket-003.md`](./ticket-003.md)  
**Governing Specification:** [`functional_specification_004.md`](../../functional_specification_004.md) (§ 2.2.1, § 3.4, § 4.4, `AC-03`)  
**Governing Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)

---

## 1. Question

How must the 3D Game Boy shell (`#bartending-showcase-unit`) map native user clicks/taps on its physical controls—**D-Pad Up** (`button-cross-up`), **D-Pad Down** (`button-cross-down`), **D-Pad Left** (`button-cross-left`), **D-Pad Right** (`button-cross-right`), **A** (`button-a`), **B** (`button-b`), **START** (`button-start`), **SELECT** (`button-select`), and **POWER** (`power-button`)—directly into the live cross-origin **DITHER-OS Bartending** runtime (`https://luisp1028.github.io/Bartending/`) while keeping the visual iframe strictly confined to the recessed LCD screen aperture and preserving 3D drag-to-rotate on the Game Boy housing (`body`)?

---

## 2. Root Cause & Verified Architectural Facts

1. **Cross-Origin Isolation & Absence of `postMessage` Handlers in Remote Runtime**:
   - `https://luisp1028.github.io/Bartending/` embeds `https://talk-gst-routers-insulation.trycloudflare.com` (`_next/static/chunks/1y4k2t7tq1b9c.js`), which is cross-origin relative to `https://platodoom.com` and registers **zero** `window.addEventListener('message', ...)` handlers for hardware controls.
   - Inside the remote runtime, `GameBoy3DShell.tsx` (`oR` in `1y4k2t7tq1b9c.js`) binds the React game-state handlers (`onDpad: tz`, `onPressA: tV`, `onPressB: tG`, `onPressStart: tW`, `onPressSelect: tX`, and power switch toggle `m(e => !e)`) directly to its projected `.gb-shell__controls` (`[data-gb-3d-controls="true"]`) `<button>` elements and its 3D raycaster.
2. **Exact 1:1 Projective Alignment Between Outer & Inner 3D Game Boy Shells**:
   - Both the outer portfolio Three.js controller (`js/bartending-gameboy.js`) and the inner `GameBoy3DShell.tsx` render the exact same 15-mesh `game-boy.glb` model with `fov = 32`.
   - When `#bartending-game-iframe` is positioned inside `#bartending-gb-screen` at `width: 828.7816%; height: 828.7816%; left: -115.7563%; top: -53.8839%; transform: scale(0.4); transform-origin: 0 0;`, **all 9 hardware controls inside `#bartending-game-iframe` project to the exact same container coordinates (within `< 0.5px`) as the outer 3D Game Boy shell's meshes**.
3. **Why Buttons Were Previously Unreachable**:
   - `.gb-grid-showcase__screen` (`#bartending-gb-screen`) previously set `overflow: hidden`, clipping both the visual painting and pointer hit-testing of `#bartending-game-iframe` strictly to the `150px × 132px` LCD screen rectangle and blocking all clicks on the lower housing controls (`D-Pad`, `A`, `B`, `Select`, `Start`) and top `Power` switch from reaching `#bartending-game-iframe`.

---

## 3. Resolution & Locked Architectural Decisions

1. **Decouple Visual Masking (`mask-image`) from Hit-Test Clipping (`clip-path`) on `#bartending-game-iframe`**:
   - Change `.gb-grid-showcase__screen` (`#bartending-gb-screen`) in [`css/animations.css`](../../css/animations.css) and [`css/modal.css`](../../css/modal.css) from `overflow: hidden; background: #050505;` to `overflow: visible; background: transparent;`.
   - Apply a CSS `mask-image` to `.gb-grid-showcase__iframe` (`#bartending-game-iframe`) that visually paints **only** the LCD screen aperture (`30.16476% × 30.16476%` at offset `left: 34.91762%`, `top: 16.25395%`, which corresponds to CSS mask percentage coordinates `50% 23.27471%`):
     ```css
     -webkit-mask-image: linear-gradient(#000, #000);
     -webkit-mask-repeat: no-repeat;
     -webkit-mask-position: 50% 23.27471%;
     -webkit-mask-size: 30.16476% 30.16476%;
     mask-image: linear-gradient(#000, #000);
     mask-repeat: no-repeat;
     mask-position: 50% 23.27471%;
     mask-size: 30.16476% 30.16476%;
     ```
     Every pixel of `#bartending-game-iframe` outside the LCD screen aperture is masked to `alpha = 0`, ensuring zero visual bleed over the outer Three.js 3D Game Boy shell (`#bartending-gb-canvas`).

2. **Inline SVG `<clipPath id="gb-interactive-regions" clipPathUnits="objectBoundingBox">` for Hardware Control Hit-Testing**:
   - Embed `<svg id="gb-clip-svg" width="0" height="0">` inside `#bartending-showcase-unit` in [`index.html`](../../index.html) and [`components/cards/card-bartending.html`](../../components/cards/card-bartending.html) with 8 normalized `objectBoundingBox` `<rect>` apertures:
     - **LCD Screen**: `x="0.349176" y="0.162539" width="0.301648" height="0.301648" rx="0.004"`
     - **D-Pad Vertical (`button-cross-up` + `button-cross-down`)**: `x="0.308" y="0.647" width="0.058" height="0.165" rx="0.006"`
     - **D-Pad Horizontal (`button-cross-left` + `button-cross-right`)**: `x="0.263" y="0.697" width="0.148" height="0.065" rx="0.006"`
     - **B Button (`button-b`)**: `x="0.579" y="0.713" width="0.070" height="0.078" rx="0.035"`
     - **A Button (`button-a`)**: `x="0.663" y="0.663" width="0.070" height="0.078" rx="0.035"`
     - **Select Button (`button-select`)**: `x="0.398" y="0.862" width="0.071" height="0.054" rx="0.015"`
     - **Start Button (`button-start`)**: `x="0.495" y="0.862" width="0.071" height="0.054" rx="0.015"`
     - **Power Switch (`power-button`)**: `x="0.285" y="0.048" width="0.060" height="0.028" rx="0.005"`
   - Apply `-webkit-clip-path: url(#gb-interactive-regions); clip-path: url(#gb-interactive-regions);` to `.gb-grid-showcase__iframe`.
   - Native browser pointer events inside those 8 regions go directly to `#bartending-game-iframe` (driving the live Bartending game's `D-Pad`, `A`, `B`, `Select`, `Start`, `Power`, and screen UI), while pointer events anywhere else on the 3D Game Boy shell (`body`, `cartridge-pocket`, speaker grille, bevels) bypass `#bartending-game-iframe` and hit `CANVAS#bartending-gb-canvas` for smooth 3D rotation.

3. **Front-Facing Pointer-Event Gating & Tactile 3D Button Feedback in `js/bartending-gameboy.js`**:
   - When the 3D Game Boy shell is front-facing (`!isDragging && Math.abs(yawCurrent) <= 0.35 && Math.abs(pitchCurrent) <= 0.35`), `screenEl.style.pointerEvents = 'auto'` so all 9 hardware buttons and the LCD screen are directly playable.
   - When the 3D shell is rotated past `0.35 rad` or actively dragging (`isDragging`), `screenEl.style.pointerEvents = 'none'` so the user can drag anywhere on the rotated shell to orient it back to front-facing.
   - Track pointer coordinates over `#bartending-showcase-unit` (`pointermove` / `pointerdown`) to trigger tactile 3D mesh depression/tilt feedback on the outer Three.js button meshes whenever a button region is hovered/actuated.
