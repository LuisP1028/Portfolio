---
ticket_id: "003"
title: "Internal Stacking & Layout Dynamics for FAB, Follow Tray & Callout Prompt"
type: task
status: resolved
claimed_by: "wayfinder-read-and-plan"
blocked_by:
  - "[Ticket 001: Global Viewport Stacking Context & Z-Index Architecture](./ticket-001.md)"
governing_specification: "functional_specification_001.md"
---

# Ticket 003: Internal Stacking & Layout Dynamics for FAB, Follow Tray & Callout Prompt

## Question
How should the internal relative stacking, z-index properties, and pointer-event dispatching be structured across `#chat-widget-container`'s child elements (`.chat-fab`, `.chat-container`, `.follow-module`, `#chat-callout`) to ensure that all interactive controls are fully accessible, never clipped or sliced by siblings, and create zero click dead zones?

## Context & Specification Grounding
- **Governing Specification:** [`functional_specification_001.md`](../../functional_specification_001.md) § 2.2.1 (Collapsed / Resting State), § 2.2.3 (Companion Social Module / Follow Tray), § 3.3 (Interactivity Integrity), § 5 (Interaction Test).
- **Target Files:**
  - [`css/chatbox.css`](../../css/chatbox.css#L14-L32): `.chat-fab` has `z-index: 9999;`.
  - [`css/chatbox.css`](../../css/chatbox.css#L47-L74): `.chat-container` lacks explicit `z-index`.
  - [`css/chatbox.css`](../../css/chatbox.css#L209-L225): `#chat-callout` has `z-index: 10001; pointer-events: none;`.
  - [`css/chatbox.css`](../../css/chatbox.css#L266-L295): `.follow-module` has `z-index: 9998;`.
  - [`js/chat-widget.js`](../../js/chat-widget.js#L18-L44): Follow module DOM element dynamically injected into `#chat-widget-container`.

## Architectural Decisions to Lock
1. **Rationalized Internal Stacking Order:**
   Because `#chat-widget-container` creates its own stacking context via `isolation: isolate;` and `z-index: 50000;`, internal child z-indexes must be normalized to clean relative layers:
   - **Internal Level 10:** `.chat-container` (`z-index: 10;`) - Base dialog surface.
   - **Internal Level 15:** `.follow-module` (`z-index: 15;`) - Slides out horizontally alongside FAB.
   - **Internal Level 20:** `.chat-fab` (`z-index: 20;`) - Maintains top-layer precedence over the sliding follow tray so the FAB mask button is never clipped or occluded.
   - **Internal Level 25:** `#chat-callout` (`z-index: 25;`) - Floating terminal prompt tooltip positioned above resting FAB.

2. **Pointer-Event Partitioning (Zero Dead Zones):**
   - Root container `#chat-widget-container` is locked to `pointer-events: none;`.
   - `.chat-fab`: explicitly receives pointer events with `pointer-events: auto;`.
   - `.chat-container`: `pointer-events: none;` in dormant state, transitioning to `pointer-events: auto;` when `.active` is toggled.
   - `.follow-module`: `pointer-events: none;` in dormant state, transitioning to `pointer-events: auto;` when `.revealed` is toggled.
   - `#chat-callout`: strictly `pointer-events: none;` so clicks pass unobstructed to any element behind it.

## Scope & Invariant Guardrails
- **In Scope:** Internal z-index ordering and pointer-event dispatching rules for `.chat-fab`, `.chat-container`, `.follow-module`, and `#chat-callout` in `css/chatbox.css`.
- **Out of Scope:** Scroll tracking and sticky header overlap (handled in Ticket 004); modal hierarchy (handled in Ticket 005).

---

## Resolution

### 1. Concrete Transformation Specification for `css/chatbox.css`
In `css/chatbox.css`, update `.chat-fab` (lines 14-32):

```css
/* --- THE FAB --- */
.chat-fab {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 65px;
    height: 65px;
    border-radius: 8px; /* Subtle radius */
    background-color: var(--bg-color, #050505);
    border: 2px solid var(--accent, #ff3c00);
    box-shadow: 0 0 15px rgba(255, 60, 0, 0.4);
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28), box-shadow 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    z-index: 20; /* Ensures FAB sits above the slide-out tray */
    pointer-events: auto;
}
```

In `css/chatbox.css`, update `.chat-container` (lines 47-74):

```css
/* --- THE CHAT CONTAINER --- */
.chat-container {
    position: absolute;
    bottom: 85px; /* Sits directly above the FAB */
    right: 0;
    width: 360px;
    height: 500px;
    max-height: 70vh;
    background-color: #050505;
    border: 1px solid var(--accent, #ff3c00);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.95), 0 0 15px rgba(255, 60, 0, 0.15);
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(5px);
    z-index: 10;
    
    /* Animation Defaults (Hidden) */
    opacity: 0;
    pointer-events: none;
    transform: translateY(20px);
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

/* Active State */
.chat-container.active {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
}
```

In `css/chatbox.css`, update `#chat-callout` (lines 209-225):

```css
/* --- THE CALLOUT --- */
#chat-callout {
    position: absolute;
    bottom: 80px; 
    right: 10px;
    background-color: var(--bg-color, #050505);
    color: var(--text-main, #e0e0e0);
    border: 1px solid var(--accent, #ff3c00);
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
    text-transform: uppercase;
    padding: 8px 12px;
    z-index: 25;
    pointer-events: none; 
    
    animation: float-bob 2s ease-in-out infinite;
    transition: opacity 0.3s ease;
}
```

In `css/chatbox.css`, update `.follow-module` (lines 266-287):

```css
.follow-module {
    position: absolute;
    bottom: 0; 
    right: 80px; /* Anchors right next to the 65px FAB, plus 15px gap */
    height: 65px; /* Matches FAB height perfectly */
    background-color: #050505;
    border: 1px solid var(--accent, #ff3c00);
    padding: 0 15px;
    display: flex;
    flex-direction: row; /* Forces horizontal layout */
    align-items: center;
    gap: 15px;
    backdrop-filter: blur(5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.95);
    z-index: 15;
    
    /* Animation: Hides slightly to the right behind the FAB */
    opacity: 0;
    transform: translateX(40px); 
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}
```

### 2. Architectural Verification & Invariant Proof
- When closed, only `.chat-fab` accepts mouse clicks. The empty space around it passes clicks through cleanly because `#chat-widget-container` has `pointer-events: none;`.
- When opened, `.chat-container` and `.follow-module` activate `pointer-events: auto;`, allowing focus on `#chat-input`, click handling on `#chat-transmit-btn`, scrolling within `#chat-messages`, and external navigation on `.follow-link`.
- The FAB has `z-index: 20` over `.follow-module`'s `z-index: 15`, guaranteeing that during the horizontal slide animation, the trailing edge of `.follow-module` tucks seamlessly behind the FAB without visual clipping or visual jitter.

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-read-and-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Unblocks [Ticket 004](./ticket-004.md).
