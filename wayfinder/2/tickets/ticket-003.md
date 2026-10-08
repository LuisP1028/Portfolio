---
ticket_id: "003"
title: "Pruning Dedicated VIZ-03 Kernel Scanner CSS Rules from Stylesheets"
type: task
status: resolved
claimed_by: "wayfinder-read-and-plan"
blocked_by: ["ticket-001.md"]
governing_specification: "wayfinder/2/spec.md"
---

# Ticket 003: Pruning Dedicated VIZ-03 Kernel Scanner CSS Rules from Stylesheets

## Question
How should the dedicated VIZ-03 CNN kernel scanner CSS rules and keyframe animations in `css/animations.css` and `css/modal.css` be pruned to prevent dead code and orphaned keyframe declarations without affecting other visualizers or layout styles?

## Context & Specification Grounding
- **Governing Specification:** [`wayfinder/2/spec.md`](../spec.md) § 1 (Problem Definition), § 2 (Functional Requirements), § 3 (Constraints), § 4 (Acceptance Criteria).
- **Target Call-Sites:**
  - `css/animations.css` lines 50–59.
  - `css/modal.css` lines 50–59.
- **Current Workspace State:**
  - Both stylesheets duplicate the exact same 10-line block:
    ```css
    /* VIZ-03: CNN KERNEL SCANNER */
    .viz-cnn { container-type: inline-size; width: 100%; height: 100%; background: #050505; display: grid; grid-template-columns: repeat(10, 1fr); grid-template-rows: repeat(5, 1fr); gap: 1px; position: relative; overflow: hidden; padding: 1px; }
    .cnn-pixel { background: #111; transition: background 0.2s; }
    .cnn-pixel:nth-child(odd) { background: #161616; }
    .cnn-pixel:nth-child(3n) { background: #1a1a1a; }
    .cnn-pixel:nth-child(7n) { background: #202020; }
    .cnn-pixel:nth-child(5n):hover { background: #444; }
    .cnn-scanner { position: absolute; z-index: 10; pointer-events: none; width: 30%; height: 60%; border: 2px solid #ff0033; box-shadow: 0 0 15px #ff0033, inset 0 0 20px rgba(255, 0, 50, 0.1); background: rgba(255, 0, 50, 0.05); animation: cnn-stride 4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
    .cnn-scanner::after { content: "KERNEL_3x3"; position: absolute; bottom: clamp(-18px, -5cqi, -12px); left: 0; font-size: clamp(6px, 2.5cqi, 9px); color: #ff0033; font-family: var(--font-mono); white-space: nowrap; letter-spacing: 1px; text-shadow: 0 0 4px #ff0033; }
    @keyframes cnn-stride { 0% { left: 0%; top: 0%; border-color: #ff0033; } 20% { left: 70%; top: 0%; } 40% { left: 70%; top: 40%; border-color: #fff; } 50% { border-color: #ff0033; } 60% { left: 0%; top: 40%; } 80% { left: 0%; top: 0%; border-color: #fff; } 100% { left: 0%; top: 0%; border-color: #ff0033; } }
    ```
  - These selectors (`.viz-cnn`, `.cnn-pixel`, `.cnn-scanner`, `@keyframes cnn-stride`) are exclusively scoped to the CNN OBJ section.
  - Sibling visualizer rules (`.gex-bar`, `@keyframes gex-breathe` at lines 45–48) precede this block.
  - Startup sequence rules (`/* STARTUP SEQUENCE */`, `#intro-layer` at lines 61+) succeed this block.

## Architectural Decisions to Lock
1. **Complete Pruning from Both Stylesheets:**
   - Lines 50–59 in `css/animations.css` and lines 50–59 in `css/modal.css` must be excised entirely.
   - Leaving unused selectors or orphaned keyframes violates cleanliness and leads to dead code creep.
2. **Boundary Preservation:**
   - Preceding rules for GEX (`.gex-bar`, `@keyframes gex-breathe`) must remain intact.
   - Succeeding rules for `#intro-layer` and `#frame-grid` must remain intact.
   - CSS syntax validity must be maintained without orphaned brackets or broken comments.

## Scope & Invariant Guardrails
- **In Scope:** Pruning lines 50–59 from `css/animations.css` and `css/modal.css`.
- **Out of Scope:** `index.html` edits (Ticket 001), component file deletion (Ticket 002), verification (Ticket 004).

---

## Resolution

### 1. Concrete Transformation Specification for Stylesheets
- **Target File 1:** `css/animations.css`
  - **Target Range:** Lines 50 to 59.
  - **Action:** Delete the `/* VIZ-03: CNN KERNEL SCANNER */` comment, `.viz-cnn`, `.cnn-pixel`, `.cnn-scanner`, and `@keyframes cnn-stride` rules.
- **Target File 2:** `css/modal.css`
  - **Target Range:** Lines 50 to 59.
  - **Action:** Delete the `/* VIZ-03: CNN KERNEL SCANNER */` comment, `.viz-cnn`, `.cnn-pixel`, `.cnn-scanner`, and `@keyframes cnn-stride` rules.

### 2. Architectural Verification & Invariant Proof
- **CSS Pruning Invariant (`INV-CSS-PRUNE`):** Neither `css/animations.css` nor `css/modal.css` contains any reference to `viz-cnn`, `cnn-pixel`, `cnn-scanner`, or `cnn-stride`.
- **Syntax Integrity Invariant (`INV-CSS-SYNTAX`):** Both stylesheets remain syntactically valid with zero unbalanced braces or broken comment blocks.

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-read-and-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Unblocks [Ticket 004](./ticket-004.md).
