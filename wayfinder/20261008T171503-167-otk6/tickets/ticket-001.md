---
ticket_id: "001"
title: "Button Group Flex Container Reflow & Adaptive Multi-Row Wrapping Architecture"
type: task
status: resolved
claimed_by: "wayfinder-read-and-plan"
blocked_by: []
governing_specification: "functional_specification_002.md"
---

# Ticket 001: Button Group Flex Container Reflow & Adaptive Multi-Row Wrapping Architecture

## Question
How should the `.btn-group` flex container layout and spacing dynamics be structured to support both side-by-side button placement on wide card viewports and graceful multi-row wrapping on constrained viewports, preventing label clipping while maintaining container containment?

## Context & Specification Grounding
- **Governing Specification:** [`functional_specification_002.md`](../../functional_specification_002.md) § 1 (Problem Definition), § 2.2 (Adaptive Button Group Layout: Container Containment, Dynamic Reflow & Flexible Sizing, Consistent Vertical Alignment), § 3 (Constraints & Boundary Conditions), § 4 (Edge Cases & Exception Handling), § 5 (Acceptance Criteria).
- **Target Call-Sites:**
  - [`css/styles.css`](../../css/styles.css#L123): `.btn-group { display: flex; gap: 1rem; position: relative; z-index: 10; }`
  - [`index.html`](../../index.html#L153-L158): OBJ-04 `.btn-group`
  - [`index.html`](../../index.html#L183-L186): OBJ-01 `.btn-group`
  - [`index.html`](../../index.html#L220-L225): OBJ-02 `.btn-group`
  - [`index.html`](../../index.html#L302-L307): OBJ-03 `.btn-group`

## Architectural Decisions to Lock
1. **Enable Dynamic Multi-Row Wrapping (`flex-wrap: wrap`):**
   - The root architectural cause of text truncation is the default `flex-wrap: nowrap` on `.btn-group`. When project cards render in 4-column desktop viewports (card width ~280px–310px, interior content width ~232px–262px), two buttons with fixed text lengths and large padding cannot fit on a single line, causing flex shrinking that cuts off trailing characters.
   - Adding `flex-wrap: wrap;` permits buttons to automatically break onto two distinct rows when the combined button width exceeds the available container width.

2. **Calibrated Symmetrical Spacing (`gap: 0.6rem`):**
   - The current `gap: 1rem` (16px) consumes excessive horizontal real estate in constrained widths.
   - Setting `gap: 0.6rem;` (approx. 9.6px) ensures clean, consistent spacing between buttons when placed side-by-side and provides an identical, visually balanced vertical separation between rows when buttons wrap.

3. **Strict Card Padding Containment (`width: 100%`, `box-sizing: border-box`):**
   - Setting `width: 100%;` and `box-sizing: border-box;` guarantees that the button group fills exactly 100% of the card's inner content area, respecting the 1.5rem (`24px`) interior padding of `.card` without overflowing or bleeding into adjacent card boundaries.

4. **Preserve Interactive Stacking Context (`position: relative; z-index: 10`):**
   - Retain `position: relative; z-index: 10;` to ensure all action buttons maintain interactive pointer priority above card background gradients, CRT scanlines, and canvas particle layers.

## Scope & Invariant Guardrails
- **In Scope:** Defining the container-level layout rules for `.btn-group` in `css/styles.css`.
- **Out of Scope:** Individual button typography and padding properties (resolved in Ticket 002); grid layout structure (resolved in Ticket 003); modal click handlers and event listeners (resolved in Ticket 004).

---

## Resolution

### 1. Concrete Transformation Specification for `css/styles.css`
In `css/styles.css`, update the `.btn-group` rule block at line 123:

```css
.btn-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    width: 100%;
    position: relative;
    z-index: 10;
}
```

### 2. Architectural Verification & Invariant Proof
- **Wrapping Invariant (`INV-FLEX-WRAP`):** With `flex-wrap: wrap;`, whenever the available width of `.card` content is less than the natural width of the two buttons plus gap, the second button wraps cleanly to the next line rather than forcing sibling elements to compress and clip their text.
- **Containment Invariant (`INV-CARD-CONTAIN`):** The button group is bounded by `width: 100%` inside `.card`, which has `box-sizing: border-box` and `padding: 1.5rem`. The total width of `.btn-group` matches the inner card box exactly, preventing any overflow beyond card borders.
- **Vertical Spacing Invariant (`INV-ROW-GAP`):** The `gap: 0.6rem` applies equally across rows and columns, creating a harmonious 9.6px rhythm when stacked.

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-read-and-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Unblocks [Ticket 002](./ticket-002.md) and [Ticket 003](./ticket-003.md).
