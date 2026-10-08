---
ticket_id: "004"
title: "Scrolling, Sticky Header Overlap & Viewport Persistence Invariants"
type: task
status: resolved
claimed_by: "wayfinder-read-and-plan"
blocked_by:
  - "[Ticket 001: Global Viewport Stacking Context & Z-Index Architecture](./ticket-001.md)"
  - "[Ticket 002: Chat Container Opacity, Background Isolation & Graphic Bleed Prevention](./ticket-002.md)"
  - "[Ticket 003: Internal Stacking & Layout Dynamics for FAB, Follow Tray & Callout Prompt](./ticket-003.md)"
governing_specification: "functional_specification_001.md"
---

# Ticket 004: Scrolling, Sticky Header Overlap & Viewport Persistence Invariants

## Question
How are viewport persistence, vertical scroll dynamics, sticky header overlap (`header.glass-active`), and small-screen/high-zoom constraints governed to ensure that the chatbox remains continuously unobstructed at every scroll offset without tucking under or clipping against page elements?

## Context & Specification Grounding
- **Governing Specification:** [`functional_specification_001.md`](../../functional_specification_001.md) § 2.3.1 (Viewport Persistence), § 2.3.2 (Sticky Header Relationship), § 4.1 (Small Screen & High Zoom), § 4.2 (Rapid Toggling & Transitions), § 5 (Scroll Test).
- **Target Files:**
  - [`css/styles.css`](../../css/styles.css#L41-L59): `header` is `position: sticky; top: 0; z-index: 10005; isolation: isolate;`. `header.glass-active` applies blur and background on scroll.
  - [`css/chatbox.css`](../../css/chatbox.css#L5-L11): `#chat-widget-container` anchored via `position: fixed; bottom: 20px; right: 20px;`.
  - [`css/chatbox.css`](../../css/chatbox.css#L203-L207): Mobile media query (`@media (max-width: 600px)`).

## Architectural Decisions to Lock
1. **Continuous Viewport Persistence Across Scroll Offsets:**
   - Root anchoring uses `position: fixed;` with locked coordinates (`bottom: 20px; right: 20px;`), decoupling the widget from the document flow.
   - Smooth vertical scrolling through all sections (Hero, Deployed Units, Luis Specs, Footer) leaves the chat window and FAB perfectly stationary in viewport space, exhibiting zero flicker, stutter, or z-order inversions.

2. **Clean Precedence Over Sticky Header:**
   - With `#chat-widget-container` locked at `z-index: 50000;`, any geometric collision with the sticky header (`z-index: 10005;`)—which occurs when `.chat-container` expands upward on short viewports or at high browser zoom levels (150%+)—is resolved deterministically: the chat interface renders cleanly over the header bar and status clock without tucking underneath or clipping.

3. **Responsive Bounds & Edge Collision Protection:**
   - On compact viewports (`@media (max-width: 600px)`), `.chat-container` is constrained to `width: calc(100vw - 40px); right: 0; max-height: calc(100vh - 120px);` to guarantee the header bar remains legible and within screen boundaries.
   - On compact viewports, ensure `.follow-module` does not produce negative x-axis overflow or break horizontal viewport boundaries when revealed.

4. **Frame-Perfect Transition Stability:**
   - CSS transitions (`opacity 0.3s ease, transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)`) execute entirely within the elevated Tier 3 stacking context. During opening and closing animations, intermediate opacity states never cause underlying page text or hazard tape to jump or pop in front of the chat dialog.

## Scope & Invariant Guardrails
- **In Scope:** Viewport positioning, scroll invariants, sticky header precedence, and mobile/zoom responsive styling in `css/chatbox.css`.
- **Out of Scope:** Modal overlay hierarchy and event handling (handled in Ticket 005).

---

## Resolution

### 1. Concrete Transformation Specification for `css/chatbox.css`
In `css/chatbox.css`, update the mobile responsive block (lines 203-207):

```css
/* Mobile Responsiveness & Viewport Boundary Guard */
@media (max-width: 600px) {
    #chat-widget-container {
        bottom: 15px;
        right: 15px;
    }
    .chat-container { 
        width: calc(100vw - 30px); 
        right: 0;
        bottom: 80px;
        max-height: calc(100vh - 110px);
    }
    .follow-module {
        right: 75px;
        max-width: calc(100vw - 100px);
        padding: 0 10px;
        gap: 10px;
    }
    .follow-label {
        display: none; /* Conserve horizontal real estate on narrow screens */
    }
}
```

### 2. Architectural Verification & Invariant Proof
- The fixed positioning (`position: fixed;`) guarantees complete decoupling from parent scroll offsets in `index.html`.
- Because `#chat-widget-container` has `z-index: 50000;`, it outranks `header` (`z-index: 10005;`) by 39,995 levels. Under 150%+ zoom, even if the top of `.chat-container` extends into the top 60px of the viewport, the chatbox header and close button render cleanly in front of `header.glass-active`.
- Hiding the text `.follow-label` on screens narrower than 600px prevents horizontal viewport overflow while keeping the social link icons ("X" and "LinkedIn") fully accessible and aligned next to the FAB.

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-read-and-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Unblocks [Ticket 005](./ticket-005.md).
