---
id: ticket-003
type: wayfinder:task
status: resolved
claimed_by: agent
blocked_by:
  - ./ticket-001.md
  - ./ticket-002.md
specification: functional_specification_004.md
---

# Ticket 003: Diegetic Transparent Grid Styling, Responsive Breakpoint Proportions, and `{Stacking Context & Z-Index Layering}` Governance in `css/animations.css`, `css/modal.css`, and `css/styles.css`

**Claimed by:** `agent`  
**Status:** `resolved`  
**Blocked By:** [`ticket-001.md`](./ticket-001.md), [`ticket-002.md`](./ticket-002.md)  
**Governing Specification:** [`functional_specification_004.md`](../../functional_specification_004.md) (§ 2.1.3, § 2.3.1, § 2.3.2, § 3.2, § 4.1, § 4.3, § 4.4)  
**Governing Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)

---

## 1. Question

What exact CSS rules must be added to `css/animations.css`, `css/modal.css`, and `css/styles.css` so that `#bartending-showcase-unit` (`.gb-grid-showcase`):
1. Renders with zero background fill, zero border, and zero card chrome over `#050505` and `.bg-grid`;
2. Occupies a balanced spatial footprint aligned with neighboring `{Project Cards / OBJ Boxes}` (`OBJ-200`, `OBJ-04`, `OBJ-01`) across `1920px`, `1440px`, `1024px`, `768px`, `375px` viewports and `200%` browser zoom;
3. Strictly obeys `{Stacking Context & Z-Index Layering}` beneath the sticky `<header>` (`10005`), `{Chatbox / Chat Widget}` (`50000`), and active `.modal-overlay` (`100000`)?

---

## 2. Resolution & Locked Architectural Decisions

1. **Frameless Grid Slot & Stacking Context Isolation (`INV-STACKING-01`)**:
   - Define `.gb-grid-showcase`:
     ```css
     .gb-grid-showcase {
         position: relative;
         z-index: 1;
         isolation: isolate;
         width: 100%;
         height: 100%;
         min-height: 460px;
         background: transparent;
         border: none;
         box-shadow: none;
         padding: 0;
         margin: 0;
         display: flex;
         align-items: center;
         justify-content: center;
         overflow: visible;
     }
     ```
   - Because `.gb-grid-showcase` establishes an isolated stacking context at `z-index: 1`, all internal layers (`#bartending-gb-canvas` at `z-index: 1`, `#bartending-gb-screen` with `matrix3d` at `z-index: 3`, `#bartending-gb-controls` at `z-index: 4`) remain strictly beneath:
     - Sticky `<header>` (`z-index: 10005`)
     - `#chat-widget-container` (`PLATODOOM`, `z-index: 50000`)
     - `#intro-layer` (`z-index: 99999`)
     - `.modal-overlay` (`#terminal-modal`, `#terminal-modal-04`, `#terminal-modal-200`, `z-index: 100000`)

2. **Responsive Breakpoint Proportions (`INV-RESPONSIVE-01`)**:
   - In multi-column desktop/laptop layouts (`> 768px`), `.gb-grid-showcase` matches the grid row height (`height: 100%; min-height: 460px;`).
   - On single-column tablet/mobile viewports (`@media (max-width: 768px)`), set `.gb-grid-showcase { min-height: 450px; height: clamp(450px, 65vh, 540px); }` so the handheld shell scales cleanly and proportionally without excessive vertical elongation or horizontal overflow down to `375px`.

3. **Synchronized Stylesheet Parity**:
   - Maintain identical `.gb-grid-showcase` and child visualization rules in both `css/animations.css` and `css/modal.css` (matching the existing `VIZ-01` and `VIZ-200` convention in this repository).
