---
ticket_id: "004"
title: "Cyberpunk Aesthetic Continuity, Typography Centering & Unified Hit-Target Integrity"
type: task
status: resolved
claimed_by: "wayfinder-read-and-plan"
blocked_by: ["ticket-001.md", "ticket-002.md"]
governing_specification: "functional_specification_002.md"
---

# Ticket 004: Cyberpunk Aesthetic Continuity, Typography Centering & Unified Hit-Target Integrity

## Question
How will the cyberpunk visual styling, geometric borders, typography centering, and interactive hit targets across both `<button>` and `<a>` elements be preserved and unified without altering underlying event bindings?

## Context & Specification Grounding
- **Governing Specification:** [`functional_specification_002.md`](../../functional_specification_002.md) § 2.3 (Visual Hierarchy & Aesthetic Preservation: Cyberpunk Industrial Aesthetic, Text Centering & Balance, Interactive Target Integrity), § 3.3 (Event Binding & Navigation Preservation), § 5 (Acceptance Criteria 4).
- **Target Call-Sites:**
  - [`css/styles.css`](../../css/styles.css#L124-L132): `.btn`, `.btn:hover`, `button.btn`, `.btn-fill`, `.btn-locked`
  - [`index.html`](../../index.html#L153-L158): OBJ-04 `<button onclick="openTerminal04(...)">` and `<a href="..." target="_blank">`
  - [`index.html`](../../index.html#L183-L186): OBJ-01 `<button onclick="openMediaModal()">` and `<button onclick="openPDFModal()">`
  - [`index.html`](../../index.html#L220-L225): OBJ-02 `<button onclick="openTerminal(...)">` and `<a href="..." target="_blank">`
  - [`index.html`](../../index.html#L302-L307): OBJ-03 `<button onclick="openTerminal(...)">` and `<a href="..." target="_blank">`

## Architectural Decisions to Lock
1. **Preserve Cyberpunk Design Tokens & Visual Language:**
   - Maintain strict visual continuity with the Industrial Cyberpunk theme:
     - Typography: `font-family: var(--font-display)` (`'Chakra Petch', 'Arial Black', sans-serif`), `font-weight: 700`, uppercase presentation.
     - Geometric Borders: `border: 1px solid var(--text-main)` (`#e0e0e0`).
     - Neon Accent Highlighting: `.btn:hover` triggers `background: var(--accent); border-color: var(--accent); color: #000; box-shadow: 0 0 15px var(--accent);`.
     - Smooth State Transition: `transition: 0.2s` for immediate, fluid tactile feedback.

2. **Normalize Presentation Across `<button>` and `<a>` Tags:**
   - In `index.html`, project cards mix `<button class="btn">` for modal triggers and `<a class="btn">` for external repositories.
   - User-agent defaults introduce discrepancies between `<button>` (which includes native OS margins, paddings, and alignment quirks) and `<a>` (which defaults to inline presentation).
   - Locking `display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box;` on `.btn` ensures identical bounding boxes, equalized internal text margins, and vertically centered text regardless of the underlying HTML tag.

3. **Hit-Target Geometry & Pointer Accuracy:**
   - With `display: inline-flex`, `padding: 0.5rem 0.75rem`, font size `0.9rem` (14.4px), and line height 1.5, each button renders with a computed height of $\ge 36\text{px}$, satisfying touch and pointer hit-target standards.
   - The entire visual surface of the button is clickable (`cursor: pointer`), and the `0.6rem` (9.6px) gap prevents accidental target mis-clicks.

4. **Zero Mutation to Event Handlers and Navigation Links:**
   - Preserves all inline event triggers and navigation links in `index.html`:
     - `openMediaModal()` on OBJ-01
     - `openPDFModal()` on OBJ-01
     - `openTerminal('https://choppedcheese-choppedgreeks.hf.space', true)` on OBJ-02
     - `openTerminal('https://choppedcheese-choppedcnnmalware.hf.space', true)` on OBJ-03
     - `openTerminal04('https://choppedcheese-digitaltwin.hf.space', true)` on OBJ-04
     - `target="_blank"` anchor navigation on OBJ-02, OBJ-03, OBJ-04
   - The transformation is purely localized to `css/styles.css`, requiring zero DOM alterations in `index.html`.

## Scope & Invariant Guardrails
- **In Scope:** Normalizing `.btn` typography centering, box-sizing, and hit targets in `css/styles.css`.
- **Out of Scope:** Altering modal scripts or PDF viewer implementations; changing button color variables.

---

## Resolution

### 1. Concrete Transformation Specification for `css/styles.css`
In `css/styles.css`, ensure `.btn` and `button.btn` rules (lines 124–126) lock unified layout and styling properties:

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
- **Aesthetic Continuity Invariant (`INV-AESTHETIC-CYBER`):** Hovering over any action button across all four project cards triggers the identical neon amber/orange glow (`box-shadow: 0 0 15px var(--accent)`) and high-contrast color inversion (`background: var(--accent); color: #000`).
- **Interactive Integrity Invariant (`INV-INTERACTIVE-INTEGRITY`):** Clicks on any point of the button's rendered surface dispatch the bound event handler without dead zones.
- **Navigation Invariant (`INV-NAV-PRESERVE`):** All 4 modal triggers and 3 external repo links maintain 100% operational fidelity with no broken references.

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-read-and-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Unblocks [Ticket 005](./ticket-005.md).
