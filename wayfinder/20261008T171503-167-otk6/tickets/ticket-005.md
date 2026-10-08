---
ticket_id: "005"
title: "Deterministic Layout Oracles, Viewport Boundary Matrix & Verification Architecture"
type: task
status: resolved
claimed_by: "wayfinder-read-and-plan"
blocked_by: ["ticket-001.md", "ticket-002.md", "ticket-003.md", "ticket-004.md"]
governing_specification: "functional_specification_002.md"
---

# Ticket 005: Deterministic Layout Oracles, Viewport Boundary Matrix & Verification Architecture

## Question
What concrete DOM and layout evaluation criteria, computed style assertions, and viewport test matrices certify compliance with all acceptance criteria in `functional_specification_002.md`?

## Context & Specification Grounding
- **Governing Specification:** [`functional_specification_002.md`](../../functional_specification_002.md) § 5 (Acceptance Criteria & `{correct required outputs}`: Visual Text Inspection, Responsive Reflow Verification, Containment Verification, Functional Interaction Verification).
- **Target Call-Sites:**
  - [`css/styles.css`](../../css/styles.css#L123-L126): `.btn-group`, `.btn`, `button.btn`
  - [`index.html`](../../index.html#L131-L310): `#projects .grid .card`

## Architectural Decisions to Lock
1. **Deterministic Layout Oracles:**
   - **Oracle 1 (Zero Text Clipping / Truncation):**
     $$\forall \text{btn} \in \text{document.querySelectorAll}('.card .btn') : \text{btn.scrollWidth} \le \text{btn.clientWidth}$$
     If `scrollWidth > clientWidth`, text has overflowed the button boundary and suffered clipping. Evaluates strictly to `true`.
   - **Oracle 2 (String Fidelity):**
     Verify full string match and character count across each card:
     - `OBJ-01`: Button 1 `=== 'LIVE_DEMO'` (length 9); Button 2 `=== 'WHITE_PAPER'` (length 11).
     - `OBJ-02`: Button 1 `=== 'LIVE_DEMO'` (length 9); Button 2 `=== 'SRC_CODE'` (length 8).
     - `OBJ-03`: Button 1 `=== 'LIVE_DEMO'` (length 9); Button 2 `=== 'SRC_CODE'` (length 8).
     - `OBJ-04`: Button 1 `=== 'LIVE_DEMO'` (length 9); Button 2 `=== 'SRC_CODE'` (length 8).
   - **Oracle 3 (Card Interior Containment):**
     $$\forall \text{card} \in \text{document.querySelectorAll}('.card'), \forall \text{btn} \in \text{card.querySelectorAll}('.btn'):$$
     $$\text{rect}(\text{btn}).\text{left} \ge \text{rect}(\text{card}).\text{left} \land \text{rect}(\text{btn}).\text{right} \le \text{rect}(\text{card}).\text{right}$$
   - **Oracle 4 (No Horizontal Page Scroll):**
     $$\text{document.documentElement.scrollWidth} \le \text{window.innerWidth}$$
     Ensures that button reflow or card sizing never induces unwanted horizontal viewport scrolling.

2. **Multi-Viewport Test Matrix:**
   - Define deterministic verification checkpoints across 6 standard viewport dimensions:
     | Viewport Preset | Dimensions (WxH) | Layout State | Expected Button Behavior |
     | :--- | :--- | :--- | :--- |
     | Full HD Desktop | 1920 x 1080 | 4 columns | Wide cards; buttons sit side-by-side with 0.6rem gap. |
     | Standard Desktop | 1440 x 900 | 4 columns | Cards ~310px; buttons sit side-by-side without truncation. |
     | Constrained Laptop | 1280 x 800 | 4 columns | Card inner width ~232px; `OBJ-01` wraps `WHITE_PAPER` to row 2 cleanly; zero clipping. |
     | Tablet Landscape | 1024 x 768 | 3 columns | Cards ~298px; buttons sit side-by-side or wrap gracefully. |
     | Tablet Portrait | 768 x 1024 | 1 column | Full-width single-column cards; side-by-side rendering with ample margin. |
     | Mobile Portrait | 375 x 667 | 1 column | Full-width card (~343px); buttons render cleanly with 0% overflow. |
     | 200% Zoom Check | 1280 x 800 @ 200% | Reflow | Effective width 640px; buttons reflow to stacked rows with full label visibility. |

3. **Interaction & Navigation Verification Matrix:**
   - **OBJ-01 `LIVE_DEMO`:** Fires `openMediaModal()`; mounts media overlay without errors.
   - **OBJ-01 `WHITE_PAPER`:** Fires `openPDFModal()`; mounts PDF modal overlay without errors.
   - **OBJ-02 `LIVE_DEMO`:** Fires `openTerminal('https://choppedcheese-choppedgreeks.hf.space', true)`.
   - **OBJ-02 `SRC_CODE`:** Navigates to `https://huggingface.co/spaces/ChoppedCheese/ChoppedGreeks/tree/main` with `target="_blank"`.
   - **OBJ-03 `LIVE_DEMO`:** Fires `openTerminal('https://choppedcheese-choppedcnnmalware.hf.space', true)`.
   - **OBJ-03 `SRC_CODE`:** Navigates to `https://github.com/LuisP1028/CNN-Virus-Scanner` with `target="_blank"`.
   - **OBJ-04 `LIVE_DEMO`:** Fires `openTerminal04('https://choppedcheese-digitaltwin.hf.space', true)`.
   - **OBJ-04 `SRC_CODE`:** Navigates to `https://huggingface.co/spaces/ChoppedCheese/DigitalTwin/tree/main` with `target="_blank"`.

## Scope & Invariant Guardrails
- **In Scope:** Formalizing test oracles, viewport matrices, and interaction acceptance criteria.
- **Out of Scope:** Implementation of application stylesheets (handled in Ticket 001 and Ticket 002).

---

## Resolution

### 1. Verification Specification
The verification architecture defines automated evaluation routines that check:
1. `btn.scrollWidth <= btn.clientWidth` across all cards.
2. Label integrity matching `LIVE_DEMO`, `WHITE_PAPER`, and `SRC_CODE`.
3. Bounding box containment within parent `.card`.
4. Visual inspection of hover states and click interaction dispatch.

### 2. Architectural Verification & Invariant Proof
- **Verification Oracle Invariant (`INV-VERIFY-ORACLE`):** Any computed bounding box or scroll dimension where `scrollWidth > clientWidth` raises an immediate failure signal `{errors}`.
- **Acceptance Invariant (`INV-ACCEPT-COMPLETE`):** When all 4 oracles pass across all 6 viewport presets, the implementation is certified as `{sufficient}` and `{correct}`.

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-read-and-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Completes planning ticket set for run `20261008T171503-167-otk6`.
