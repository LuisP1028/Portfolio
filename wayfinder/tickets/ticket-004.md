---
id: ticket-004
type: wayfinder:task
status: resolved
claimed_by: agent
blocked_by:
  - ./ticket-001.md
  - ./ticket-002.md
  - ./ticket-003.md
specification: functional_specification_004.md
---

# Ticket 004: Sibling `{Project Cards / OBJ Boxes}` Non-Regression & Zero `{Label Truncation & Text Overflow}` Verification across All Viewports

**Claimed by:** `agent`  
**Status:** `resolved`  
**Blocked By:** [`ticket-001.md`](./ticket-001.md), [`ticket-002.md`](./ticket-002.md), [`ticket-003.md`](./ticket-003.md)  
**Governing Specification:** [`functional_specification_004.md`](../../functional_specification_004.md) (§ 2.3.1, § 3.3, § 4.1, § 5.4)  
**Governing Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)

---

## 1. Question

How do we deterministically verify that adding the 4th grid unit (`#bartending-showcase-unit`) preserves 100% of the layout, visual presentation, animations, modal triggers, and `{Action Buttons / Button Groups}` glyph visibility (`LIVE_DEMO`, `SRC_CODE`, `WHITE_PAPER`) on neighboring `{Project Cards / OBJ Boxes}` (`OBJ-200`, `OBJ-04`, `OBJ-01`) across all viewports (`1920px`, `1440px`, `1024px`, `768px`, `375px`, and `200%` zoom)?

---

## 2. Resolution & Locked Architectural Decisions

1. **Grid Column & Card Width Compatibility**:
   - `.grid` uses `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;`.
   - With 4 units in `.grid` (`#bartending-showcase-unit`, `#obj-200-card`, `#obj-04-card`, and `OBJ-01`):
     - At `1920px` and `1440px` (`.container` inner width `1336px`), 4 columns render at `310px` each (`>= 280px`).
     - At `1024px` (`.container` inner width `960px`), 3 columns render in row 1 (`298.67px` each) and 1 column in row 2.
     - At `768px` and `375px`, 1 column renders (`736px` and `343px` wide respectively).
   - Because `.gb-grid-showcase` has `min-width: 0; width: 100%;`, it never forces grid blowout or compresses sibling `.card` columns below `280px`.

2. **Button Label Non-Truncation Invariant (`INV-BTN-GLYPHS-01`)**:
   - Across `1920px`, `1440px`, `1024px`, `768px`, `375px`, and `200%` zoom, every button in `.card .btn-group .btn` (`LIVE_DEMO`, `SRC_CODE` on `OBJ-200`; `LIVE_DEMO`, `SRC_CODE` on `OBJ-04`; `LIVE_DEMO`, `WHITE_PAPER` on `OBJ-01`) must satisfy:
     - `btn.scrollWidth <= btn.clientWidth + 1`
     - `btnRect.left >= cardRect.left` and `btnRect.right <= cardRect.right`
     - Exact text equality (`LIVE_DEMO`, `SRC_CODE`, `WHITE_PAPER`).

3. **Sibling Modal & Feature Preservation (`INV-SIBLING-MODALS-01`)**:
   - `openTerminal200`, `openTerminal04`, `openMediaModal`, `openPDFModal`, and `#chat-widget-container` (`PLATODOOM`) remain 100% functional and render cleanly in front of `#bartending-showcase-unit` when active.
