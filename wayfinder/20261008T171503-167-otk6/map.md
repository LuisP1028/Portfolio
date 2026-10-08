# Map 20261008T171503-167-otk6: Project Card Action Button Text Rendering & Layout Preservation

**Governing Specification:**
- [`functional_specification_002.md`](../../functional_specification_002.md) (Project Card Action Button Text Rendering & Layout Preservation)

**Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)  
**Run Identifier:** `20261008T171503-167-otk6`  
**Execution Node:** `wayfinder-test-plan`  
**Status:** Canonical Plan & Integration Test Plan Locked; Zero Architectural Ambiguity (Tickets 001–006 Resolved, Master Matrix & Test Matrix Synthesized)

---

## 1. Destination

Establish a complete, deterministic, and verified decision set detailing every architectural, layout reflow, box model normalization, and verification requirement across the codebase to implement and verify complete project card action button text rendering and layout preservation specified in [`functional_specification_002.md`](../../functional_specification_002.md) without invention:
1. **Button Group Flex Container Reflow & Adaptive Multi-Row Wrapping Architecture (Ticket 001):** Transform `.btn-group` in `css/styles.css` with `flex-wrap: wrap; gap: 0.6rem; width: 100%;`, eliminating the rigid single-row flex constraint and enabling responsive multi-line wrapping when horizontal space is constrained.
2. **Button Box Model, Padding Normalization & Text Truncation Elimination (Ticket 002):** Calibrate `.btn` padding from `1.5rem` to `0.75rem`, apply `white-space: nowrap;`, configure `min-width: max-content;` and `flex: 1 1 auto;`, and set `display: inline-flex; align-items: center; justify-content: center; text-align: center;` to prevent flex compression clipping (`LIVE_DEM`, `WHITE_PAR`) and ensure 100% label visibility.
3. **Multi-Column Grid Breakpoint Dynamics & Card Interior Containment Verification (Ticket 003):** Verify mathematical containment across 4-column desktop layouts (~1250px–1400px), tablet breakpoints, and mobile screens (<768px down to 375px), confirming the longest label pair (`OBJ-01`: `LIVE_DEMO` + `WHITE_PAPER`) reflows cleanly without card boundary bleed.
4. **Cyberpunk Aesthetic Continuity, Typography Centering & Unified Hit-Target Integrity (Ticket 004):** Normalize typography centering and touch hit targets across `<button>` (modals) and `<a>` (external repositories) while preserving all cyberpunk design tokens, hover glow effects, and event triggers (`openMediaModal()`, `openPDFModal()`, `openTerminal()`, `openTerminal04()`).
5. **Deterministic Layout Oracles, Viewport Boundary Matrix & Verification Architecture (Ticket 005):** Formalize automated verification checks (`scrollWidth <= clientWidth`, full string length matching, bounding rect containment) across 6 standard viewport presets and 200% zoom.
6. **Integration Test Decision Mapping, Payload Admissibility Governance & Layout Oracle Verification Plan (Ticket 006):** Formalize authentic codebase schemas (`DOMElementLayoutPayload`, `BoundingClientRectPayload`, `ComputedStylePayload`, `ButtonContentPayload`, `ViewportDimensionPayload`, `ButtonInteractionPayload`), admissible observed payloads with zero mocks (`INV-PAYLOAD-01`), deterministic layout and string oracles (`INV-ASSERTION-01`), explicit failure modes (`{errors}`), and synthesize the Authoritative Integration Test Matrix (`test-matrix.md`).

---

## 2. Notes & Architectural Foundation

### 2.1 Codebase Structure & Target Call-Sites
- **Core Stylesheet:** [`css/styles.css`](../../css/styles.css)
  - Defines `.grid` (`L103`, `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;`).
  - Defines `.card` (`L110-L115`, `padding: 1.5rem; background: #0a0a0a;`).
  - Defines `.btn-group` (`L123-L130`, `display: flex; flex-wrap: wrap; gap: 0.6rem; width: 100%; position: relative; z-index: 10;`).
  - Defines `.btn` and `button.btn` (`L131-L159`, normalized padding `0.5rem 0.75rem`, `white-space: nowrap; min-width: max-content; box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; text-align: center; flex: 1 1 auto;`).
  - Defines responsive breakpoint `@media (max-width: 768px)` (`L172-L181`).
- **DOM Shell:** [`index.html`](../../index.html)
  - Mounts `#projects` (`L127-L311`).
  - OBJ-04 Card (`L133-L159`): `LIVE_DEMO` (`openTerminal04`) + `SRC_CODE` (Hugging Face).
  - OBJ-01 Card (`L161-L187`): `LIVE_DEMO` (`openMediaModal`) + `WHITE_PAPER` (`openPDFModal`).
  - OBJ-02 Card (`L189-L226`): `LIVE_DEMO` (`openTerminal`) + `SRC_CODE` (Hugging Face).
  - OBJ-03 Card (`L228-L308`): `LIVE_DEMO` (`openTerminal`) + `SRC_CODE` (GitHub).

### 2.2 Mathematical Horizontal Budget Dynamics
$$\text{Inner Card Width} = \text{Card Width} - 2 \times \text{Card Padding} = \text{Card Width} - 48\text{px}$$
- **Desktop 4-Column Minimum Width (~280px):** Inner width is $280\text{px} - 48\text{px} = 232\text{px}$.
- **Side-by-Side Footprint (`OBJ-01`):** `LIVE_DEMO` (~111px) + `gap` (9.6px) + `WHITE_PAPER` (~131px) = 251.6px.
- **Reflow Behavior:** Because $251.6\text{px} > 232\text{px}$, `flex-wrap: wrap` smoothly shifts `WHITE_PAPER` to row 2, expanding both buttons to fill 100% of their respective row width with zero clipping.

---

## 3. Decisions So Far & Ticket Registry

- **[Ticket 001: Button Group Flex Container Reflow & Adaptive Multi-Row Wrapping Architecture](./tickets/ticket-001.md)** — Resolved. Enabled `flex-wrap: wrap; gap: 0.6rem; width: 100%;` on `.btn-group`, eliminating single-row flex constraints and guaranteeing containment within `.card` padding.
- **[Ticket 002: Button Box Model, Padding Normalization & Text Truncation Elimination](./tickets/ticket-002.md)** — Resolved. Calibrated horizontal padding to `0.75rem`, added `white-space: nowrap; min-width: max-content; flex: 1 1 auto;`, and centered content via `display: inline-flex; align-items: center; justify-content: center;`, eliminating trailing character slicing (`LIVE_DEM`, `WHITE_PAR`).
- **[Ticket 003: Multi-Column Grid Breakpoint Dynamics & Card Interior Containment Verification](./tickets/ticket-003.md)** — Resolved. Proved mathematical containment and stability across 1920px down to 375px viewports and 200% zoom, verifying `.grid` and `.card` structure preservation.
- **[Ticket 004: Cyberpunk Aesthetic Continuity, Typography Centering & Unified Hit-Target Integrity](./tickets/ticket-004.md)** — Resolved. Unified visual styling, hover glow effects, and hit-target dimensions across `<button>` and `<a>` elements while maintaining 100% fidelity on all modal triggers and external links.
- **[Ticket 005: Deterministic Layout Oracles, Viewport Boundary Matrix & Verification Architecture](./tickets/ticket-005.md)** — Resolved. Locked 4 layout verification oracles (`scrollWidth <= clientWidth`, string equality, bounding box containment, scrollbar absence) across 6 standard viewport presets and interaction dispatch verification.
- **[Ticket 006: Integration Test Decision Mapping, Payload Admissibility Governance & Layout Oracle Verification Plan](./tickets/ticket-006.md)** — Resolved. Locked codebase schemas, admissible payloads without mocks (`INV-PAYLOAD-01`), layout/containment/string oracles (`INV-ASSERTION-01`), explicit failure modes, and synthesized the Authoritative Integration Test Matrix (`test-matrix.md`).

---

## 4. Not Yet Specified

*(All functional requirements, layout adaptability decisions, architectural implementation specifications, and integration test verification mappings for this run have been charted and fully resolved. Zero fog remains.)*

---

## 5. Out of Scope

- Modifying the underlying backend API services or Gradio demo server endpoints.
- Altering the PDF modal viewer or terminal emulation logic.
- Redesigning card preview canvas/animations (`viz-ssm`, `viz-gex`, `viz-cnn`, video preview).
- Modifying chatbox widget layering or z-index hierarchy.
- Authoring executable test code, runners, or test fixtures prior to explicit operator authorization (`INV-BOUNDARY-01`).
