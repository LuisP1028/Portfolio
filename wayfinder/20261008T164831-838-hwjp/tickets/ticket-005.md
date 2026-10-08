---
ticket_id: "005"
title: "Full-Screen Modal Overlay Precedence & Focus Governance"
type: task
status: resolved
claimed_by: "wayfinder-read-and-plan"
blocked_by:
  - "[Ticket 001: Global Viewport Stacking Context & Z-Index Architecture](./ticket-001.md)"
  - "[Ticket 004: Scrolling, Sticky Header Overlap & Viewport Persistence Invariants](./ticket-004.md)"
governing_specification: "functional_specification_001.md"
---

# Ticket 005: Full-Screen Modal Overlay Precedence & Focus Governance

## Question
How should the stacking hierarchy, focus trapping, and modal interaction lifecycle between full-screen modals (`.modal-overlay` in `css/modal.css` and `js/modal-logic.js`) and `#chat-widget-container` be architected to eliminate visual clipping, prevent unclickable dead zones, and ensure active modals gain clean focus when triggered while the chatbox is open?

## Context & Specification Grounding
- **Governing Specification:** [`functional_specification_001.md`](../../functional_specification_001.md) § 2.3.3 (Modal Overlay Relationship), § 3.3 (Interactivity Integrity), § 4.3 (Simultaneous Modal Triggers), § 5 (Acceptance Criteria).
- **Target Files:**
  - [`css/modal.css`](../../css/modal.css#L141-L158): `.modal-overlay` has `z-index: 100000; position: fixed; top: 0; left: 0; width: 100%; height: 100%;`.
  - [`js/modal-logic.js`](../../js/modal-logic.js#L1-L52, #L112-L180): `openTerminal`, `openTerminal04`, `openMediaModal`, `openPDFModal`, and `closeTerminal` toggle `.modal-overlay.active`.
  - [`css/chatbox.css`](../../css/chatbox.css#L5-L11): `#chat-widget-container` at `z-index: 50000;`.

## Architectural Decisions to Lock
1. **Unambiguous Stacking Hierarchy (Tier 4 Supremacy):**
   - Full-screen modal overlays (`.modal-overlay`) remain anchored at `z-index: 100000;` (Tier 4).
   - Because `#chat-widget-container` is locked at `z-index: 50000;` (Tier 3), opening any modal (Terminal 01, Terminal 04, Whitepaper PDF viewer, or Media Showcase) elevates the modal layer cleanly above the chatbox by +50,000 levels.
   - When a modal opens while the chatbox is expanded, the modal's semi-opaque backdrop (`background: rgba(5, 5, 5, 0.95); backdrop-filter: blur(8px);`) visually precedes and occludes the chatbox without awkward edge clipping, z-fighting, or border tearing.

2. **Pointer Focus and Event Trapping Invariants:**
   - In dormant state, `.modal-overlay` has `opacity: 0; pointer-events: none;`, ensuring zero interference with the chatbox or page elements.
   - When `.active` is added, `.modal-overlay` applies `opacity: 1; pointer-events: all;`. Because it covers 100vw $\times$ 100vh at `z-index: 100000;`, all pointer events are captured by the modal overlay, preventing unintended clicks from falling through to the chatbox or underlying cards.
   - Closing the modal (via `[TERMINATE_SESSION]` button, background click `if(event.target === this)`, or ESC key) removes `.active`, instantly restoring interactive focus to `#chat-widget-container` (`z-index: 50000;`) in its previous state.

3. **Zero Mod-Bleed & Clean Coexistence:**
   - No JavaScript hacks or forced DOM mutations are required on modal trigger. The CSS stacking context alone maintains deterministic visual and behavioral isolation between Tier 3 and Tier 4.

## Scope & Invariant Guardrails
- **In Scope:** Stacking relationship, pointer event isolation, and lifecycle interaction between `.modal-overlay` and `#chat-widget-container`.
- **Out of Scope:** Internal modal content rendering (PDF.js, YouTube iframe, Gradio app embeds).

---

## Resolution

### 1. Architectural Contract & Invariant Proof
- In `css/modal.css`:
  ```css
  .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(5, 5, 5, 0.95); z-index: 100000; display: flex;
      justify-content: center; align-items: center; 
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transform: translateZ(999px);
      -webkit-transform: translateZ(999px);
      opacity: 0; pointer-events: none; transition: opacity 0.2s;
  }
  .modal-overlay.active { opacity: 1; pointer-events: all; }
  ```
- Because `.modal-overlay` has `z-index: 100000` and `#chat-widget-container` has `z-index: 50000`:
  $$\text{Z}_{\text{modal}} (100000) > \text{Z}_{\text{chatbox}} (50000) > \text{Z}_{\text{header}} (10005) > \text{Z}_{\text{hero}} (10001) > \text{Z}_{\text{hazard}} (10000)$$
- This hierarchy strictly satisfies FS-001 § 2.3.3 and § 4.3: when an operator opens a project terminal or white paper, the modal takes dominant foreground focus without clipping or dead spots.
- On modal closure, the transition cleanly fades the modal overlay away, leaving the chatbox and FAB fully visible and operational.

### 2. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-read-and-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** All decision tickets in run `20261008T164831-838-hwjp` are fully resolved.
