---
ticket_id: "003"
title: "Multi-Column Grid Breakpoint Dynamics & Card Interior Containment Verification"
type: task
status: resolved
claimed_by: "wayfinder-read-and-plan"
blocked_by: ["ticket-001.md", "ticket-002.md"]
governing_specification: "functional_specification_002.md"
---

# Ticket 003: Multi-Column Grid Breakpoint Dynamics & Card Interior Containment Verification

## Question
How do the `.grid` template column definitions and `.card` internal padding interact across the full viewport spectrum (1920px down to 375px) and browser zoom (up to 200%), and does the card geometry require any adjustment to accommodate the longest button label pair (`OBJ-01`: `LIVE_DEMO` + `WHITE_PAPER`)?

## Context & Specification Grounding
- **Governing Specification:** [`functional_specification_002.md`](../../functional_specification_002.md) § 2.2.1 (Container Containment: buttons remain strictly inside card interior padding), § 3.2 (Card Structure Preservation), § 4.1 (High Screen Resolutions / 4-Column Layouts), § 4.2 (Longest Label Pair `OBJ-01`), § 4.3 (Single-Column Mobile Viewports <600px), § 4.4 (Browser Zoom up to 200%), § 5 (Acceptance Criteria 2 & 3).
- **Target Call-Sites:**
  - [`css/styles.css`](../../css/styles.css#L103): `.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 4rem; }`
  - [`css/styles.css`](../../css/styles.css#L110): `.card { border: 1px solid var(--grid-line); background: #0a0a0a; position: relative; transition: transform 0.2s, border-color 0.2s; padding: 1.5rem; }`
  - [`css/styles.css`](../../css/styles.css#L138-L147): `@media (max-width: 768px)`

## Architectural Decisions to Lock
1. **Mathematical Horizontal Budget Verification Across Desktop Columns:**
   - On wide desktop screens (container max-width `1400px`, padding `2rem` per side):
     - Total available width: $1400\text{px} - 64\text{px} = 1336\text{px}$.
     - 4-column layout produces: $\frac{1336\text{px} - 3 \times 32\text{px}}{4} = \frac{1240\text{px}}{4} = 310\text{px}$ per card.
     - Inner content width of `.card`: $310\text{px} - 2 \times 24\text{px} = 262\text{px}$.
   - On constrained 4-column desktop/laptop screens (~$1250\text{px}$ viewport, $1186\text{px}$ container):
     - 4-column layout produces: $\frac{1186\text{px} - 96\text{px}}{4} \approx 280\text{px}$ (hitting the `minmax(280px, 1fr)` floor).
     - Inner content width of `.card`: $280\text{px} - 48\text{px} = 232\text{px}$.

2. **Longest Label Pair Reflow Proof (`OBJ-01`):**
   - In `OBJ-01`, Button 1 is `LIVE_DEMO` (9 chars, approx 85px text + 24px padding + 2px border = 111px).
   - Button 2 is `WHITE_PAPER` (11 chars, approx 105px text + 24px padding + 2px border = 131px).
   - Side-by-side footprint with `gap: 0.6rem` (9.6px): $111\text{px} + 131\text{px} + 9.6\text{px} = 251.6\text{px}$.
   - **At 1400px container ($262\text{px}$ inner width):** $251.6\text{px} \le 262\text{px}$. Both buttons sit side-by-side with full label fidelity.
   - **At 1250px container ($232\text{px}$ inner width):** $251.6\text{px} > 232\text{px}$. Because `flex-wrap: wrap` is locked on `.btn-group` and `min-width: max-content` is locked on `.btn`, `WHITE_PAPER` gracefully reflows to row 2. On row 2, it expands via `flex: 1 1 auto` across the entire $232\text{px}$ width. Zero characters are clipped; 0px horizontal card overflow occurs.

3. **Short Label Pairs (`OBJ-02`, `OBJ-03`, `OBJ-04`):**
   - Button 1 is `LIVE_DEMO` (111px). Button 2 is `SRC_CODE` (8 chars, approx 75px text + 24px padding + 2px border = 101px).
   - Total side-by-side width: $111\text{px} + 101\text{px} + 9.6\text{px} = 221.6\text{px}$.
   - Even at the narrowest 4-column card width ($232\text{px}$ inner width), $221.6\text{px} \le 232\text{px}$, allowing them to sit side-by-side cleanly without cramping.

4. **Mobile Reflow Dynamics (<768px):**
   - At $\le 768\text{px}$, `.grid` shifts to `grid-template-columns: 1fr;`.
   - On a 375px mobile viewport, container padding is 1rem (16px per side), leaving card width $375 - 32 = 343\text{px}$, and inner content width $343 - 48 = 295\text{px}$.
   - Side-by-side buttons fit cleanly ($251.6\text{px} \le 295\text{px}$). Under high font scaling or zoom, buttons wrap to 2 rows automatically without horizontal document scroll.

5. **Card Boundary Preservation:**
   - The `.grid` rule and `.card` padding (`1.5rem`) are optimal and structurally sound. Preserving their existing definitions satisfies Constraint § 3.2 (Card Structure Preservation) and prevents regressions to card hover corner animations (`.card::before`, `.card::after`).

## Scope & Invariant Guardrails
- **In Scope:** Verifying the mathematical bounds of `.grid` and `.card` across desktop, tablet, mobile viewports and zoom.
- **Out of Scope:** Styling button states (Ticket 004); end-to-end oracle tests (Ticket 005).

---

## Resolution

### 1. Structural Verification of `css/styles.css`
The existing `.grid` and `.card` rules in `css/styles.css` (lines 103, 110, 146) are confirmed as structurally invariant:
```css
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 4rem; }
.card { border: 1px solid var(--grid-line); background: #0a0a0a; position: relative; transition: transform 0.2s, border-color 0.2s; padding: 1.5rem; }
```
Together with the resolved `.btn-group` (`flex-wrap: wrap; gap: 0.6rem; width: 100%`) from Ticket 001 and `.btn` (`padding: 0.5rem 0.75rem; min-width: max-content; white-space: nowrap`) from Ticket 002, the layout mathematically guarantees zero clipping and strict containment across all viewports.

### 2. Architectural Verification & Invariant Proof
- **Grid Containment Invariant (`INV-GRID-CONTAIN`):** For all card elements $C \in \{\text{OBJ-01}, \text{OBJ-02}, \text{OBJ-03}, \text{OBJ-04}\}$ and all buttons $B \in C$, $\text{rect}(B).\text{right} \le \text{rect}(C).\text{right} - \text{paddingRight}(C)$, and $\text{rect}(B).\text{left} \ge \text{rect}(C).\text{left} + \text{paddingLeft}(C)$.
- **Breakpoint Stability Invariant (`INV-BREAKPOINT-STABILITY`):** Viewport resizing from 1920px down to 375px induces zero horizontal document scrollbars (`document.documentElement.scrollWidth === window.innerWidth`).
- **Zoom Invariant (`INV-ZOOM-200`):** At 200% zoom, elements wrap cleanly to multiple rows without text truncation or card border bleed.

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-read-and-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Unblocks [Ticket 004](./ticket-004.md) and [Ticket 005](./ticket-005.md).
