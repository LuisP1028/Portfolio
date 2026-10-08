---
ticket_id: "001"
title: "Global Viewport Stacking Context & Z-Index Architecture"
type: task
status: resolved
claimed_by: "wayfinder-read-and-plan"
blocked_by: []
governing_specification: "functional_specification_001.md"
---

# Ticket 001: Global Viewport Stacking Context & Z-Index Architecture

## Question
How should the global viewport stacking context and z-index tier hierarchy be structured so that `#chat-widget-container` achieves absolute visual dominance over page typography and assets, while maintaining correct subordination to full-screen modals and intro overlays?

## Context & Specification Grounding
- **Governing Specification:** [`functional_specification_001.md`](../../functional_specification_001.md) § 1, § 2.1 (Absolute Visual Dominance, Zero Text Occlusion, Zero Graphic Asset Bleed), § 2.3 (Scrolling & Viewport Dynamics), § 5 (Acceptance Criteria).
- **Target Files:**
  - [`css/chatbox.css`](../../css/chatbox.css#L5-L11): Current `#chat-widget-container` has `z-index: 10000;`.
  - [`css/styles.css`](../../css/styles.css#L41-L50): `header` has `z-index: 10005; isolation: isolate;`.
  - [`css/styles.css`](../../css/styles.css#L81-L85): `.hero-content` has `z-index: 10001;`.
  - [`css/animations.css`](../../css/animations.css#L131-L158): `.hazard-tape-wrapper` has `z-index: 10000;` and 3D transform `translate3d(-50%, -50%, 0) rotate(-38deg)`.
  - [`css/modal.css`](../../css/modal.css#L141-L150): `.modal-overlay` has `z-index: 100000;`.
  - [`css/modal.css`](../../css/modal.css#L62-L67): `#intro-layer` has `z-index: 99999;`.

## Architectural Decisions to Lock
1. **Canonical 5-Tier Viewport Stacking Hierarchy:**
   - **Tier 0 (-1 to 10):** Background Grid (`.bg-grid` at `-1`), Canvas Particles (`#hero-particles` at `1`), Card Interactions (`.btn-group` at `10`).
   - **Tier 1 (9999 to 10000):** Ambient Atmosphere & Decorative Assets (`.crt-overlay` at `9999`, `.hazard-tape-wrapper` at `10000`).
   - **Tier 2 (10001 to 10005):** In-Flow Document Content & Navigation (`.hero-content` at `10001`, `header` sticky navigation at `10005`).
   - **Tier 3 (50000):** Floating Interactive Overlays (`#chat-widget-container` at `50000`).
   - **Tier 4 (99999 to 100000):** Full-Screen System Modals & Terminal Viewers (`#intro-layer` at `99999`, `.modal-overlay` at `100000`).

2. **Container Elevation & Stacking Context Isolation:**
   - Set `#chat-widget-container` in `css/chatbox.css` to `z-index: 50000;`.
   - Add `isolation: isolate;` to `#chat-widget-container` to guarantee an independent stacking context where internal z-index values do not leak into or conflict with page-level stacking indices.

## Scope & Invariant Guardrails
- **In Scope:** Defining the global z-index tier scale and updating `#chat-widget-container` root stacking configuration in `css/chatbox.css`.
- **Out of Scope:** Internal widget component styling (handled in Ticket 002 and Ticket 003); modal logic event binding (handled in Ticket 005).

---

## Resolution

### 1. Concrete Transformation Specification for `css/chatbox.css`
In `css/chatbox.css`, modify the `#chat-widget-container` rule block (lines 5-11):

```css
#chat-widget-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 50000;
    isolation: isolate;
    pointer-events: none;
    font-family: var(--font-mono, monospace);
}
```

### 2. Architectural Verification & Invariant Proof
- With `z-index: 50000`, `#chat-widget-container` evaluates strictly above:
  - `header` (`z-index: 10005`) by +39,995 levels.
  - `.hero-content` (`z-index: 10001`) by +39,999 levels.
  - `.hazard-tape-wrapper` (`z-index: 10000`) by +40,000 levels.
  - `.crt-overlay` (`z-index: 9999`) by +40,001 levels.
- `#chat-widget-container` remains strictly beneath:
  - `#intro-layer` (`z-index: 99999`) by -49,999 levels.
  - `.modal-overlay` (`z-index: 100000`) by -50,000 levels.
- The `isolation: isolate;` property ensures all children within `#chat-widget-container` are flattened into Tier 3 relative to external document elements.

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-read-and-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Unblocks [Ticket 002](./ticket-002.md), [Ticket 003](./ticket-003.md), [Ticket 004](./ticket-004.md), [Ticket 005](./ticket-005.md).
