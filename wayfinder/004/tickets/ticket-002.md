---
id: ticket-002
type: wayfinder:task
status: resolved
claimed_by: agent
blocked_by:
  - ./ticket-001.md
specification: functional_specification_004.md
---

# Ticket 002: 3D Game Boy Asset Provisioning, Native Three.js Shell Renderer, Interactive Axis Spin, and 1:1 Projective Screen Homography in `js/bartending-gameboy.js`

**Claimed by:** `agent`  
**Status:** `resolved`  
**Blocked By:** [`ticket-001.md`](./ticket-001.md)  
**Governing Specification:** [`functional_specification_004.md`](../../functional_specification_004.md) (§ 2.1.3, § 2.2.1, § 2.2.2, § 3.4, § 4.2, § 4.4)  
**Governing Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)

---

## 1. Question

How must the 3D Game Boy shell (`game-boy.glb` and its baked textures) and the Three.js runtime controller (`js/bartending-gameboy.js`) be architected so that:
1. The entire 15-part 3D Game Boy silhouette renders over a 100% transparent background (`alpha: true`) directly above `#050505` and `.bg-grid` without clipping at any viewport size or rotation angle;
2. The live `https://luisp1028.github.io/Bartending/` screen maps 1:1 onto the recessed `screen` mesh at all viewing angles (`matrix3d` homography + rear-face occlusion when rotated > 90°);
3. Pointer/touch manipulation smoothly rotates the 3D shell and actuates its physical 3D controls while preserving native page scrolling outside the shell silhouette and fail-fast error handling?

---

## 2. Resolution & Locked Architectural Decisions

1. **Asset Provisioning (`assets/gameboy/`)**:
   - Copy the authoritative 15-part Nintendo Game Boy asset bundle into `/Users/diesel/portfolio/portfolio/assets/gameboy/`:
     - `assets/gameboy/game-boy.glb` (15 parts: `body`, `screen`, `cartridge-pocket`, `power-button`, `power-button-frame`, `power-indicator`, `volume-control`, `button-a`, `button-b`, `button-select`, `button-start`, `button-cross-up`, `button-cross-down`, `button-cross-left`, `button-cross-right`)
     - `assets/gameboy/baked-game-boy.jpg`
     - `assets/gameboy/baked-cartridge-pocket.jpg`
     - `assets/gameboy/baked-power-indicator.jpg`
     - `assets/gameboy/baked-screen-shadow.png`

2. **Transparent WebGL Renderer & Unclipped Camera Framing (`INV-UNCLIPPED-SHELL-01`)**:
   - Initialize `THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' })` with `renderer.setClearColor(0x000000, 0)` and `renderer.outputColorSpace = THREE.SRGBColorSpace`.
   - Use `THREE.PerspectiveCamera(32, w / h, 0.1, 100)`.
   - Frame the full 3D Game Boy geometry (`body` Y `[-1.8587, +1.8587]`, `power-button` Y `+1.8910`, `body`/`volume-control` X `[-1.1253, +1.1340]`) plus rotational clearance using:
     - `targetMinY = -1.96`, `targetMaxY = 1.98`, `targetCenterY = 0.01`
     - `spanY = (targetMaxY - targetMinY) * 1.06` (`4.1764` units)
     - `spanX = 2.52` units, `frontZ = 0.44`
     - `camDist = Math.max((spanY * 0.5) / tanHalfVFov, (spanX * 0.5) / Math.max(0.05, tanHalfHFov))`
   - Guarantees 100% of the 3D Game Boy silhouette from top edge to bottom corners renders with comfortable margin and zero clipping across all aspect ratios and viewports.

3. **1:1 Inner Screen Registration & Projective `matrix3d` Homography (`INV-SCREEN-ALIGN-01`)**:
   - At neutral rotation `(0, 0, 0)`, project the 3D `screen` mesh bounding box (`1.2382295 × 1.0921676`, aspect ratio `1.1337358`) to viewport coordinates `baseScreenRect = { left, top, width, height }` and position `#bartending-gb-screen` at `baseScreenRect`.
   - Inside `#bartending-gb-screen` (`overflow: hidden`), size and offset `#bartending-game-iframe` to the exact inverse projection of the remote runtime's screen viewport (`width: 331.5126%; height: 331.5126%; left: -115.7563%; top: -53.8839%;`), so the Bartending game display fills 100% of `#bartending-gb-screen` with 1:1 sub-pixel accuracy and zero surrounding backdrop or nested shell.
   - Fade `#bartending-game-iframe` in smoothly over the `#0b0b0e` screen backing once loaded so no `#eee` loading flash ever appears.
   - When the 3D Game Boy rotates (`rotX`, `rotY`), compute the exact 3D-to-2D projective homography `matrix3d(h11, h21, 0, h31, h12, h22, 0, h32, 0, 0, 1, 0, h13, h23, 0, 1)` from `mvpMatrix = camera.projectionMatrix * camera.matrixWorldInverse * gameBoyRoot.matrixWorld` and apply it to `#bartending-gb-screen`.
   - When rotated past edge-on (`facingDot <= 0.08`), occlude `#bartending-gb-screen` (`visibility: hidden; opacity: 0; pointer-events: none`) and `#bartending-gb-controls` so the rear `cartridge-pocket` renders cleanly without screen bleed-through.

4. **Direct In-Place Interactivity & Scroll Disambiguation (`INV-INTERACT-SCROLL-01`)**:
   - Clicking/tapping or dragging inside `#bartending-gb-screen` (when front-facing) passes directly to `#bartending-game-iframe` without rotating the 3D shell.
   - Clicking/tapping physical 3D buttons (`D-Pad`, `A`, `B`, `Start`, `Select`, `Power`) via projected DOM hit targets or 3D raycasting animates 3D button depression (`targetBtnOffset`) / D-Pad cross tilt (`targetCrossRot`) / power switch slide & red LED shader (`powerIndicatorUniforms`), updates `data-last-control` / `data-power-on`, and posts control messages to `#bartending-game-iframe`.
   - Dragging on the 3D Game Boy shell (`raycastPartAt` hits the 3D Game Boy mesh or controls) smoothly spins the console around `Y` (`stepDx * 0.011`) and tilts around `X` (`clamp(rx + stepDy * 0.008, -0.65, 0.65)`).
   - Touching or scrolling outside the 3D Game Boy silhouette (or using the mouse wheel anywhere) does not capture the pointer or block native page scrolling.
   - `DeviceMotionEvent` shake detection and `gb-shake-reset` custom event smoothly unwrap and reset rotation to `(0, 0, 0)`.

5. **Fail-Fast Asset & DOM Validation (`INV-FAILFAST-01`)**:
   - Missing required DOM nodes, missing `.glb` binary, missing any of the 15 required mesh parts, or failed texture loads immediately throw an explicit fatal `Error` and surface a deterministic error state without silent suppression (`RULE[user_global]`).
