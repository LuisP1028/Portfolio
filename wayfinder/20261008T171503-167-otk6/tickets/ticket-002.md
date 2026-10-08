---
ticket_id: "002"
title: "Button Box Model, Padding Normalization & Text Truncation Elimination"
type: task
status: resolved
claimed_by: "wayfinder-read-and-plan"
blocked_by: ["ticket-001.md"]
governing_specification: "functional_specification_002.md"
---

# Ticket 002: Button Box Model, Padding Normalization & Text Truncation Elimination

## Question
What box-model properties, padding adjustments, and overflow/flex rules must be applied to `.btn` and `button.btn` to eliminate character clipping (`LIVE_DEM`, `WHITE_PAR`), guarantee 100% label visibility across all cards, and ensure centered, balanced typography?

## Context & Specification Grounding
- **Governing Specification:** [`functional_specification_002.md`](../../functional_specification_002.md) § 1 (Defect Definition: `LIVE_DEMO` cut off at right edge, `WHITE_PAPER` truncated as `WHITE_PAR`, `SRC_CODE` cramped), § 2.1 (Complete Label Legibility & Text Integrity: Zero Text Truncation, Exact Label Fidelity, No Mid-Word Breaks), § 2.3 (Visual Hierarchy: Text Centering & Balance, Interactive Target Integrity), § 5 (Acceptance Criteria 1).
- **Target Call-Sites:**
  - [`css/styles.css`](../../css/styles.css#L124-L126):
    ```css
    .btn { background: transparent; border: 1px solid var(--text-main); color: var(--text-main); padding: 0.5rem 1.5rem; font-family: var(--font-display); font-weight: 700; text-decoration: none; position: relative; overflow: hidden; transition: 0.2s; font-size: 0.9rem; cursor: pointer; }
    .btn:hover { background: var(--accent); border-color: var(--accent); color: #000; box-shadow: 0 0 15px var(--accent); }
    button.btn { cursor: pointer; font-family: var(--font-display); font-size: 0.9rem; }
    ```

## Architectural Decisions to Lock
1. **Calibrate Horizontal Padding (`padding: 0.5rem 0.75rem`):**
   - The existing `padding: 0.5rem 1.5rem` allocates 48px of horizontal padding to each button (96px across a two-button group). In a 232px inner card container, 96px of padding leaves only 136px of space for both text labels, mathematically forcing truncation of `WHITE_PAPER` (~105px text width) and `LIVE_DEMO` (~85px text width).
   - Normalizing horizontal padding to `0.75rem` (12px per side, 24px total per button) reduces padding overhead by 50%, providing ample breathing room while preserving comfortable touch target boundaries.

2. **Strict Text Integrity & No Mid-Word Breaks (`white-space: nowrap`):**
   - Apply `white-space: nowrap;` to `.btn`. This enforces requirement § 2.1.3: multi-word or underscored labels (`LIVE_DEMO`, `WHITE_PAPER`, `SRC_CODE`) never hyphenate, break, or wrap across lines within a button.

3. **Protection Against Flex Compression (`min-width: max-content`):**
   - In standard CSS flexbox, elements with `overflow: hidden` receive an implicit `min-width: 0`, enabling flex shrink logic to compress the button boundary below its textual content width.
   - Setting `min-width: max-content;` and `flex: 1 1 auto;` guarantees that a button can never shrink narrower than its full text label plus padding. If the row cannot accommodate two `max-content` widths plus gap, flexbox reflows the second button to the subsequent row via `flex-wrap: wrap` (locked in Ticket 001).

4. **Centered Typography & Surface Normalization (`display: inline-flex`):**
   - In `index.html`, project action buttons comprise both `<button>` elements (modals) and `<a>` elements (external links).
   - Configure `.btn` with `display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box;`. This normalizes line-height, vertical alignment, and text centering identically across both DOM element types.
   - When wrapped onto individual rows, `flex: 1 1 auto;` stretches each button to fill 100% of the row width, producing balanced, symmetrical cyberpunk buttons.

## Scope & Invariant Guardrails
- **In Scope:** Modifying `.btn` and `button.btn` rules in `css/styles.css` to govern padding, flex sizing, white-space, and display alignment.
- **Out of Scope:** Overall grid column sizing (Ticket 003); hover color schemes and event handlers (Ticket 004); testing verification suites (Ticket 005).

---

## Resolution

### 1. Concrete Transformation Specification for `css/styles.css`
In `css/styles.css`, replace lines 124–126 with the following normalized rule blocks:

```css
.btn {
    background: transparent;
    border: 1px solid var(--text-main);
    color: var(--text-main);
    padding: 0.5rem 0.75rem;
    font-family: var(--font-display);
    font-weight: 700;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: 0.2s;
    font-size: 0.9rem;
    cursor: pointer;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex: 1 1 auto;
    min-width: max-content;
    box-sizing: border-box;
}
.btn:hover { background: var(--accent); border-color: var(--accent); color: #000; box-shadow: 0 0 15px var(--accent); }
button.btn {
    cursor: pointer;
    font-family: var(--font-display);
    font-size: 0.9rem;
    box-sizing: border-box;
}
```

### 2. Architectural Verification & Invariant Proof
- **Zero Truncation Invariant (`INV-ZERO-TRUNC`):** Because `min-width: max-content;` is enforced, the computed width of `.btn` is strictly $\ge \text{textWidth} + 24\text{px}$. The button can never compress below the exact bounding box of its text label, eliminating character slicing at the trailing edge.
- **Label Fidelity Invariant (`INV-LABEL-FIDELITY`):**
  - `LIVE_DEMO`: 9 glyphs fully visible; 0 characters clipped.
  - `WHITE_PAPER`: 11 glyphs fully visible; 0 characters clipped.
  - `SRC_CODE`: 8 glyphs cleanly visible with 12px horizontal padding on both sides.
- **No Mid-Word Break Invariant (`INV-NOWRAP`):** `white-space: nowrap;` guarantees all characters in each label remain on a single unbroken horizontal line.

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-read-and-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Unblocks [Ticket 003](./ticket-003.md) and [Ticket 004](./ticket-004.md).
