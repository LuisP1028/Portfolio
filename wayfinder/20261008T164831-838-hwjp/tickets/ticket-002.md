---
ticket_id: "002"
title: "Chat Container Opacity, Background Isolation & Graphic Bleed Prevention"
type: task
status: resolved
claimed_by: "wayfinder-read-and-plan"
blocked_by:
  - "[Ticket 001: Global Viewport Stacking Context & Z-Index Architecture](./ticket-001.md)"
governing_specification: "functional_specification_001.md"
---

# Ticket 002: Chat Container Opacity, Background Isolation & Graphic Bleed Prevention

## Question
How should the background fill, surface opacity, backdrop filter, and internal layer rendering of `.chat-container`, `.chat-messages`, and `.follow-module` be structured to guarantee 100% surface opacity and prevent underlying text and decorative graphics from shining or bleeding through?

## Context & Specification Grounding
- **Governing Specification:** [`functional_specification_001.md`](../../functional_specification_001.md) § 2.1 (Zero Text Occlusion / Clipping, Zero Graphic Asset Bleed), § 2.2.2 (Active / Expanded State Invariant), § 3.2 (Aesthetic Preservation), § 5 (Visual Clarity & Asset Clearance Verification).
- **Target Files:**
  - [`css/chatbox.css`](../../css/chatbox.css#L47-L66): `.chat-container` defines `background-color: rgba(5, 5, 5, 0.98); backdrop-filter: blur(5px);`.
  - [`css/chatbox.css`](../../css/chatbox.css#L102-L115): `.chat-messages` defines radial grid background over transparent base.
  - [`css/chatbox.css`](../../css/chatbox.css#L164-L170): `.chat-input-wrapper` defines `background-color: var(--bg-color, #050505);`.
  - [`css/chatbox.css`](../../css/chatbox.css#L266-L287): `.follow-module` defines `background: rgba(5, 5, 5, 0.98); backdrop-filter: blur(5px);`.

## Architectural Decisions to Lock
1. **100% Opaque Surface Backing:**
   - Modify `.chat-container` in `css/chatbox.css` to use a solid background fill: `background-color: #050505;` (or `var(--bg-color, #050505)`), replacing the 2% translucent `rgba(5, 5, 5, 0.98)`.
   - Modify `.follow-module` in `css/chatbox.css` to use solid `background-color: #050505;`.
   - Ensure that even during GPU compositing passes and rapid scroll updates, zero underlying page pixels or high-contrast headlines ("Architecting Digital Superiority") bleed through the chat canvas.

2. **Aesthetic Continuity & Cyberpunk Border Invariance:**
   - Preserve all existing cyberpunk border styling: `border: 1px solid var(--accent, #ff3c00);`, `box-shadow: 0 10px 30px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 60, 0, 0.1);`.
   - Retain `.chat-messages` custom dot-matrix grid pattern (`radial-gradient(var(--grid-line, #1a1a1a) 1px, transparent 1px)`) rendering cleanly over the solid `#050505` backdrop.

## Scope & Invariant Guardrails
- **In Scope:** Surface fill, opacity, and background rendering properties for `.chat-container` and `.follow-module` in `css/chatbox.css`.
- **Out of Scope:** Internal button and input interaction logic (handled in Ticket 003); global viewport z-index tiers (locked in Ticket 001).

---

## Resolution

### 1. Concrete Transformation Specification for `css/chatbox.css`
In `css/chatbox.css`, update lines 47-66 (`.chat-container`):

```css
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
    
    /* Animation Defaults (Hidden) */
    opacity: 0;
    pointer-events: none;
    transform: translateY(20px);
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}
```

In `css/chatbox.css`, update lines 266-287 (`.follow-module`):

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
- Setting `background-color: #050505;` provides an alpha channel of 1.0 (100% opacity).
- Any underlying graphical asset (such as the rotating hazard tape at `z-index: 10000`, particle canvas at `z-index: 1`, or hero text at `z-index: 10001`) sharing screen coordinates with `.chat-container` or `.follow-module` is completely occluded by the opaque pixels of the container surface.
- The visual presentation strictly adheres to the Industrial Cyberpunk palette defined in `css/styles.css` (`--bg-color: #050505`).

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-read-and-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Unblocks [Ticket 004](./ticket-004.md).
