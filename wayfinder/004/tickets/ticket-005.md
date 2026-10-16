---
id: ticket-005
type: wayfinder:task
status: resolved
claimed_by: agent
blocked_by:
  - ./ticket-001.md
  - ./ticket-002.md
  - ./ticket-003.md
  - ./ticket-004.md
specification: functional_specification_004.md
---

# Ticket 005: End-to-End Integration Test Decision Mapping, Live Runtime Payload Admissibility & Verification Architecture (`test-matrix.md`)

**Claimed by:** `agent`  
**Status:** `resolved`  
**Blocked By:** [`ticket-001.md`](./ticket-001.md), [`ticket-002.md`](./ticket-002.md), [`ticket-003.md`](./ticket-003.md), [`ticket-004.md`](./ticket-004.md)  
**Governing Specification:** [`functional_specification_004.md`](../../functional_specification_004.md) (§ 5 Acceptance Criteria 1–5)  
**Governing Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)

---

## 1. Question

What authentic runtime telemetry payloads and deterministic Playwright verification oracles are required to certify 100% of Acceptance Criteria 1–5 in [`functional_specification_004.md`](../../functional_specification_004.md) with zero mocks and zero `{errors}`?

---

## 2. Resolution & Locked Verification Oracles

1. **Oracle 1 — Pure 3D Game Boy Shell Grid Presence (`AC-01`)**:
   - `#projects .grid` contains 4 direct unit children: `#bartending-showcase-unit` plus the 3 `{Project Cards / OBJ Boxes}` (`#obj-200-card`, `#obj-04-card`, `OBJ-01`).
   - `#bartending-showcase-unit` has `classList.contains('card') === false` and contains zero `.card-header`, `.card-id`, `.card-img`, `h3`, `p`, `.btn-group`, or `.btn` elements.
   - `#bartending-gb-canvas` (`data-gb-3d-canvas="true"`), `#bartending-gb-screen`, `#bartending-game-iframe` (`src === "https://luisp1028.github.io/Bartending/"`), and `#bartending-gb-controls` are mounted and active.

2. **Oracle 2 — Frameless Diegetic Visual Integration & Unclipped 3D Silhouette (`AC-02`)**:
   - Computed styles on `#bartending-showcase-unit` and `#bartending-gb-host`: `backgroundColor === 'rgba(0, 0, 0, 0)'`, `borderTopWidth === '0px'`, `boxShadow === 'none'`.
   - WebGL context on `#bartending-gb-canvas` has `alpha === true`, all 15 `game-boy.glb` parts loaded (`data-gb-ready="true"`), and projected 3D bounding box of the entire Game Boy assembly (`minX`, `maxX`, `minY`, `maxY`) lies strictly inside the canvas bounds (`0 <= minX`, `maxX <= clientWidth`, `0 <= minY`, `maxY <= clientHeight`) across all 5 viewports (`1920px`, `1440px`, `1024px`, `768px`, `375px`) and `200%` zoom.

3. **Oracle 3 — Direct Gameplay, 3D Shell Rotation, Screen Homography & Permissions (`AC-03`)**:
   - `#bartending-game-iframe` carries `allow` attribute containing `camera`, `microphone`, `autoplay`, `fullscreen`, `clipboard-read`, `clipboard-write` and loads `https://luisp1028.github.io/Bartending/` with HTTP 200.
   - Dragging on the 3D Game Boy shell updates `data-rotation-y` and `data-rotation-x`, applies a 3D `matrix3d(...)` homography to `#bartending-gb-screen`, occludes `#bartending-gb-screen` (`data-screen-visible="false"`, `visibility === 'hidden'`) when rotated > 90° to the rear, and smoothly resets to `(0.0000, 0.0000)` upon `gb-shake-reset` / `devicemotion` shake.
   - Clicking the physical 3D controls (`Start`, `Select`, `A`, `B`, `D-Pad`, `Power`) actuates the 3D meshes and updates control state without error.

4. **Oracle 4 — Neighboring Card Integrity & `{Stacking Context & Z-Index Layering}` (`AC-04`)**:
   - Across `1920px`, `1440px`, `1024px`, `768px`, `375px`, and `200%` zoom, 100% of `.card .btn-group .btn` elements (`LIVE_DEMO`, `SRC_CODE`, `WHITE_PAPER`) have `scrollWidth <= clientWidth + 1` and zero card boundary overflow.
   - Computed `z-index` of `#bartending-showcase-unit` (`1` with `isolation: isolate`) is strictly below `<header>` (`10005`), `#chat-widget-container` (`50000`), and `.modal-overlay` (`100000`). Verified via `document.elementFromPoint` when scrolling behind `<header>`, opening `PLATODOOM` chatbox, and opening `TERMINAL_200`.

5. **Oracle 5 — Zero `{errors}` Verification (`AC-05`)**:
   - Zero `pageerror` exceptions, zero `console.error` messages, and zero failed network requests across page load, 3D shell rotation, button actuation, scroll, modal open/close, and viewport resize cycles.
