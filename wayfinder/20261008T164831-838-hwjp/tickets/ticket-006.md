---
ticket_id: "006"
title: "Integration Test Decision Mapping, Payload Admissibility Governance & Oracle Verification Plan"
type: task
status: resolved
claimed_by: "wayfinder-test-plan"
blocked_by:
  - "[Ticket 001: Global Viewport Stacking Context & Z-Index Architecture](./ticket-001.md)"
  - "[Ticket 002: Chat Container Opacity, Background Isolation & Graphic Bleed Prevention](./ticket-002.md)"
  - "[Ticket 003: Internal Stacking & Layout Dynamics for FAB, Follow Tray & Callout Prompt](./ticket-003.md)"
  - "[Ticket 004: Scrolling, Sticky Header Overlap & Viewport Persistence Invariants](./ticket-004.md)"
  - "[Ticket 005: Full-Screen Modal Overlay Precedence & Focus Governance](./ticket-005.md)"
governing_specification: "functional_specification_001.md"
---

# Ticket 006: Integration Test Decision Mapping, Payload Admissibility Governance & Oracle Verification Plan

## Question
How should integration testing for the chatbox visual layering and clipping prevention feature be structured, what authentic codebase schemas and admissible payloads govern its verification without mocks, what deterministic oracles define `{correct required outputs}`, and how are explicit `{errors}` detected without generating executable test code prior to authorization?

## Context & Specification Grounding
- **Governing Specification:** [`functional_specification_001.md`](../../functional_specification_001.md)
  - § 1 Overview & Problem Definition (Foreground Dominance, Bleed Prevention, Clipping Prevention)
  - § 2 Desired Functionality & Behavioral Requirements (Unobstructed Display, Resting/Active Invariants, Social Tray Dynamics, Scrolling & Sticky Header Dynamics, Modal Overlay Relationship)
  - § 3 Constraints & Boundary Conditions (Zero Mocks, Aesthetic Preservation, Interactivity Integrity)
  - § 4 Edge Cases & Exception Handling (Small Screens, 150%+ Zoom, Rapid Toggling, Simultaneous Modals)
  - § 5 Acceptance Criteria & `{correct required outputs}` (Visual Clarity, Asset Clearance, Scroll Persistence, Interaction)
- **Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)
  - Strict definitions of `{errors}`, `{correctness}`, `{functionality}`, `{correct required outputs}`, `{sufficient}`, and `{insufficient}`.
- **Governing Codebase Manifests:**
  - Upstream plan: [`handoff/20261008T164831-838-hwjp/wayfinder-read-and-plan.txt`](../../handoff/20261008T164831-838-hwjp/wayfinder-read-and-plan.txt)
  - Upstream implementer: [`handoff/20261008T164831-838-hwjp/implementer.txt`](../../handoff/20261008T164831-838-hwjp/implementer.txt) (`css/chatbox.css`)
  - Upstream reviewer: [`handoff/20261008T164831-838-hwjp/reviewer.txt`](../../handoff/20261008T164831-838-hwjp/reviewer.txt) (`css/chatbox.css`)
- **Target Components & Verification Call-Sites:**
  - [`css/chatbox.css`](../../css/chatbox.css): `#chat-widget-container` (L5–13), `.chat-fab` (L16–35), `.chat-container` (L50–77), `.chat-messages` (L106–118), `.chat-input-wrapper` (L168–205), `@media (max-width: 600px)` (L208–228), `#chat-callout` (L231–281), `.follow-module` (L288–316).
  - [`css/styles.css`](../../css/styles.css): `header` (L41–50, `z-index: 10005; isolation: isolate;`), `.hero-content` (L81–85, `z-index: 10001;`), `:root` variables (L7–18).
  - [`css/animations.css`](../../css/animations.css): `.crt-overlay` (L11–15, `z-index: 9999;`), `.hazard-tape-wrapper` (L131–158, `z-index: 10000;`).
  - [`css/modal.css`](../../css/modal.css): `#intro-layer` (L62–67, `z-index: 99999;`), `.modal-overlay` (L141–150, `z-index: 100000;`).
  - [`components/global/chat-widget.html`](../../components/global/chat-widget.html): Template DOM layout for `#doom-chat-container`, `#chat-callout`, `#chat-fab`.
  - [`index.html`](../../index.html): Document mounting `#chat-widget-container` (L354), `.modal-overlay` instances (L356–376), script loader tags (L380–385).
  - [`js/chat-widget.js`](../../js/chat-widget.js): Dynamic DOM injection of `#follow-module` (L23–44), event dispatchers for `.chat-fab` and `#chat-close-btn` (L53–77), transmit handler (L116–162).

---

## Architectural Decisions to Lock

### 1. Component Boundaries & Integration Surface
Integration testing must span the complete visual, structural, and behavioral interaction between the modified chatbox subsystem and the host page environment:
1. **Viewport Stacking Domain:** Relationship between `#chat-widget-container` (Tier 3: `50000`), `header` (Tier 2: `10005`), `.hero-content` (Tier 2: `10001`), `.hazard-tape-wrapper` (Tier 1: `10000`), `.crt-overlay` (Tier 1: `9999`), and `.modal-overlay` (Tier 4: `100000`).
2. **Surface Opacity Domain:** Real computed color and alpha channel of `.chat-container` and `.follow-module` (`rgb(5, 5, 5)` / solid `#050505`).
3. **Pointer-Event & Hit-Testing Domain:** Coordinate hit-testing via `document.elementFromPoint(x, y)` across resting, expanded, and modal states.
4. **Scroll & Dynamic Offset Domain:** Viewport persistence across vertical scroll offsets (`scrollY = 0`, `scrollY = 150`, `scrollY = 1000`).
5. **Responsive Bounds Domain:** Viewport width boundaries at desktop (`1920x1080`) and mobile breakpoint (`375x667`, matching `@media (max-width: 600px)`).

### 2. Codebase Schema Grounding (Zero Mocks Mandate)
Under Payload Law (`INV-PAYLOAD-01`), no dummy JSON, synthetic mocks, or simulated interfaces are permitted. All payloads must adhere to authentic codebase interfaces:

#### Schema A: CSS Computed Style Schema (`ComputedStylePayload`)
- `position`: String enum (`"fixed"` | `"absolute"` | `"relative"` | `"static"`)
- `z-index`: String representation of integer or `"auto"` (`"50000"`, `"20"`, `"15"`, `"10"`, `"25"`, `"10005"`, `"10001"`, `"10000"`, `"100000"`)
- `isolation`: String enum (`"isolate"` | `"auto"`)
- `pointer-events`: String enum (`"none"` | `"auto"`)
- `background-color`: String RGB/RGBA representation (`"rgb(5, 5, 5)"` required; alpha must evaluate to 1.0)
- `opacity`: String numeric (`"0"` | `"1"`)
- `display`: String enum (`"none"` | `"flex"` | `"block"`)
- `max-height`: Dimension string (`"70vh"`, `"calc(100vh - 110px)"`)

#### Schema B: DOM Element State Schema (`DOMElementState`)
- `id`: String identifier (`"chat-widget-container"`, `"doom-chat-container"`, `"chat-fab"`, `"chat-callout"`, `"follow-module"`, `"chat-close-btn"`, `"chat-input"`, `"chat-transmit-btn"`, `"chat-messages"`, `"terminal-modal"`)
- `classList`: Array of strings (`["chat-container"]`, `["chat-container", "active"]`, `["follow-module"]`, `["follow-module", "revealed"]`, `["hidden"]`, `["glass-active"]`)
- `activeElement`: Reference to currently focused `Element` (e.g. `HTMLInputElement`)

#### Schema C: Viewport Coordinate & Hit-Test Schema (`CoordinateHitTestPayload`)
- `x`: Integer client X coordinate
- `y`: Integer client Y coordinate
- `targetSelector`: Selector of innermost or container element expected at `(x, y)`
- `forbiddenSelectors`: List of selectors that must NOT be returned by `document.elementFromPoint(x, y)` when target is active

#### Schema D: Chat Message Transmission Schema (`ChatMessagePayload`)
- `message`: Non-empty String (input query)
- `history`: Array of objects matching `{ role: "user" | "assistant", content: string }`
- `response`: String received from API endpoint (`https://choppedcheese-platodoomcave.hf.space/chat`)

### 3. Payload Admissibility Governance (`INV-PAYLOAD-01`)
- **Admissible Input States:**
  - Real browser DOM instances loaded from [`index.html`](../../index.html) with [`css/chatbox.css`](../../css/chatbox.css) and scripts attached.
  - Authentic user interaction events (`PointerEvent("click")`, `KeyboardEvent("keydown", { key: "Enter" })`, `InputEvent("input")`).
  - Observed real query string: `"HELLO DOOM"` (authentic string input matching UI expectations).
  - Observed scroll offsets: `scrollY = 0`, `scrollY = 150`, `scrollY = 1000`.
- **Forbidden Payloads:**
  - Any simulated DOM stub, synthetic shadow DOM, or mock stylesheet object.
  - Any handwritten JSON fixture with renamed fields or added debug properties.
  - Any mock API interceptor injecting synthetic schemas not returned by the FastAPI server.

### 4. Specification Oracles & `{correct required outputs}` (`INV-ASSERTION-01`)
The integration test suite must assert `{correct required outputs}` strictly against [`functional_specification_001.md`](../../functional_specification_001.md) and locked ticket resolutions:
1. **Visual Dominance Oracle:**
   - At coordinates `(x, y)` intersecting `#doom-chat-container.active` and `.hero-content`, `document.elementFromPoint(x, y)` resolves to `#doom-chat-container` or its child, NEVER `.hero-content` or its children.
2. **Surface Opacity Oracle:**
   - `getComputedStyle(doomChatContainer).backgroundColor === "rgb(5, 5, 5)"` with zero transparency.
3. **Asset Clearance Oracle:**
   - At coordinates `(x, y)` intersecting `#doom-chat-container.active` and `.hazard-tape-wrapper`, `document.elementFromPoint(x, y)` resolves strictly to chatbox components, NEVER `.hazard-tape-wrapper`.
4. **Scroll & Sticky Header Overlap Oracle:**
   - When scrolled to `scrollY = 150` with chatbox open, `getComputedStyle(chatWidgetContainer).position === "fixed"`, and `getComputedStyle(chatWidgetContainer).zIndex` (`50000`) > `getComputedStyle(header).zIndex` (`10005`).
5. **Internal Stacking & Pointer Events Oracle:**
   - Container: `pointer-events === "none"`.
   - Resting state: clicking at viewport coordinates outside `#chat-fab` dispatches to underlying page content without dead zone blocking.
   - Active state: `#chat-fab` has `pointer-events === "auto"` and `z-index === "20"`; `#follow-module` has `pointer-events === "auto"` and `z-index === "15"`; `#doom-chat-container` has `pointer-events === "auto"` and `z-index === "10"`.
6. **Full-Screen Modal Supremacy Oracle:**
   - When `#terminal-modal` has class `active` (or is displayed), `getComputedStyle(modalOverlay).zIndex` (`100000`) > `getComputedStyle(chatWidgetContainer).zIndex` (`50000`). At overlapping coordinates, `document.elementFromPoint(x, y)` resolves to `.modal-overlay` or its children.

### 5. Explicit `{errors}` & Failure States
The integration tests must immediately fail fast on:
- Any computed `z-index` of `#chat-widget-container` less than `50000`.
- Any background color containing alpha < 1.0 (e.g. `rgba(5, 5, 5, 0.98)`).
- Any occurrence of `header`, `.hero-content`, or `.hazard-tape-wrapper` returned by `document.elementFromPoint(x, y)` within the bounding rectangle of the expanded `.chat-container`.
- Any pointer event failure where clicking into `#chat-input` does not set `document.activeElement`.
- Any modal conflict where the chatbox appears in front of `.modal-overlay`.

---

## Scope & Invariant Guardrails
- **In Scope:** Charting the complete integration test architecture, schema bindings, admissible payloads, and verification oracles for the chatbox visual layering feature across all component boundaries.
- **Out of Scope:** Writing executable test scripts, test runner configurations, mock servers, or test fixture files (governed by `INV-BOUNDARY-01`).
- **Claimed by:** `wayfinder-test-plan`
- **Resolution Status:** `resolved`

---

## Resolution

### 1. Concrete Integration Test Specification Architecture

#### Test Suite 1: Global Viewport Stacking & Coordinate Occlusion (FS-001 § 2.1, § 5.1)
- **Target:** `#chat-widget-container`, `.hero-content`, `h1`, `header`
- **Preconditions:** DOM initialized via `app.js`, `loadChatWidget()` completed.
- **Actions:**
  1. Measure computed styles:
     - Assert `getComputedStyle(#chat-widget-container).zIndex === "50000"`
     - Assert `getComputedStyle(#chat-widget-container).isolation === "isolate"`
     - Assert `getComputedStyle(header).zIndex === "10005"`
     - Assert `getComputedStyle(.hero-content).zIndex === "10001"`
  2. Dispatch `click` event on `#chat-fab` to toggle `.chat-container.active`.
  3. Calculate intersecting bounding rect between `.chat-container` and `.hero-content`.
  4. Query `document.elementFromPoint(center.x, center.y)` at intersection center.
- **Oracle Assertion (`{correct required outputs}`):**
  - Returned element is `#doom-chat-container` or descendant (`.chat-messages`, `.chat-header`, `.chat-input-wrapper`).
  - Returned element is NOT `.hero-content`, `h1`, `.hero-subtitle`, or `header`.

#### Test Suite 2: Surface Opacity & Graphic Asset Clearance (FS-001 § 2.1.3, § 2.2.2, § 5.2)
- **Target:** `.chat-container`, `.follow-module`, `.hazard-tape-wrapper`, `#hero-particles`
- **Preconditions:** Chatbox active and follow tray revealed.
- **Actions:**
  1. Inspect computed background on `.chat-container` and `.follow-module`:
     - Assert `getComputedStyle(.chat-container).backgroundColor === "rgb(5, 5, 5)"`
     - Assert `getComputedStyle(.follow-module).backgroundColor === "rgb(5, 5, 5)"`
  2. Query bounding box of `.hazard-tape-wrapper` (`z-index: 10000`).
  3. Sample coordinates along hazard tape trajectory intersecting `.chat-container`.
  4. Query `document.elementFromPoint(x, y)`.
- **Oracle Assertion (`{correct required outputs}`):**
  - Background alpha is 1.0 (non-translucent).
  - Returned element is `.chat-container` or its child, confirming hazard tape is occluded underneath solid chatbox surface.

#### Test Suite 3: Viewport Persistence & Sticky Header Dynamic Overlap (FS-001 § 2.3, § 5.3)
- **Target:** `#chat-widget-container`, `header`, `window`
- **Preconditions:** Chatbox active.
- **Actions:**
  1. Evaluate at `window.scrollY = 0`:
     - Assert `getComputedStyle(#chat-widget-container).position === "fixed"`
  2. Simulate scroll: set `window.scrollY = 150`, trigger `scroll` event.
  3. Verify `header.classList.contains("glass-active") === true`.
  4. Evaluate viewport coordinates of `#chat-widget-container`:
     - Bounding client rect `bottom` and `right` match fixed CSS offsets (`bottom: 20px`, `right: 20px`).
     - Stacking order preserves `#chat-widget-container` (`50000`) over `header` (`10005`).
- **Oracle Assertion (`{correct required outputs}`):**
  - Zero displacement, zero jitter, zero z-order inversion against sticky header.

#### Test Suite 4: Internal Stacking & Pointer-Event Partitioning (FS-001 § 2.2, § 3.3, § 5.4)
- **Target:** `#chat-widget-container`, `.chat-fab`, `.chat-container`, `.follow-module`, `#chat-callout`, `#chat-input`, `#chat-transmit-btn`
- **Preconditions:** DOM initialized.
- **Actions:**
  1. Resting State:
     - Assert `getComputedStyle(#chat-widget-container).pointerEvents === "none"`.
     - Assert `getComputedStyle(.chat-fab).pointerEvents === "auto"`.
     - Assert `getComputedStyle(#chat-callout).pointerEvents === "none"`.
     - Assert `getComputedStyle(#chat-callout).zIndex === "25"`.
     - Assert `getComputedStyle(.chat-fab).zIndex === "20"`.
     - Click point adjacent to `#chat-fab` inside `#chat-widget-container` bounding area; assert event passes through to underlying document element.
  2. Transition to Active State:
     - Click `#chat-fab`.
     - Assert `#chat-callout.classList.contains("hidden") === true`.
     - Assert `.chat-container.classList.contains("active") === true`.
     - Assert `.follow-module.classList.contains("revealed") === true`.
     - Assert `document.activeElement === document.getElementById("chat-input")`.
     - Assert `getComputedStyle(.chat-container).pointerEvents === "auto"`.
     - Assert `getComputedStyle(.follow-module).pointerEvents === "auto"`.
  3. Input Interaction:
     - Set `#chat-input.value = "HELLO DOOM"`.
     - Dispatch `click` on `#chat-transmit-btn`.
     - Assert DOM child created in `#chat-messages` containing class `chat-msg user` and text `"USR_> HELLO DOOM"`.
- **Oracle Assertion (`{correct required outputs}`):**
  - Zero pointer-event dead zones in resting state.
  - Complete focus and event dispatching in active state.

#### Test Suite 5: Full-Screen Modal Precedence & Focus Governance (FS-001 § 2.3.3, § 4.3)
- **Target:** `#chat-widget-container`, `.modal-overlay` (`#terminal-modal`)
- **Preconditions:** Chatbox active.
- **Actions:**
  1. Open `#terminal-modal` (dispatch click on terminal card trigger or invoke `terminalModal.style.display = 'flex'`).
  2. Inspect computed z-index:
     - Assert `getComputedStyle(.modal-overlay).zIndex === "100000"`.
     - Assert `getComputedStyle(#chat-widget-container).zIndex === "50000"`.
  3. Query `document.elementFromPoint(x, y)` at screen center where modal and chatbox overlap.
- **Oracle Assertion (`{correct required outputs}`):**
  - Returned element is `.modal-overlay` or `.modal-content`, confirming full modal visual dominance.

#### Test Suite 6: Mobile Responsiveness & Viewport Boundary Guard (FS-001 § 4.1)
- **Target:** `#chat-widget-container`, `.chat-container`, `.follow-module`, `.follow-label`
- **Preconditions:** Viewport resized to `375px` width (mobile breakpoint).
- **Actions:**
  1. Inspect computed styles under `@media (max-width: 600px)`:
     - `#chat-widget-container`: `bottom: 15px`, `right: 15px`.
     - `.chat-container`: `width: calc(100vw - 30px)`, `max-height: calc(100vh - 110px)`.
     - `.follow-module`: `max-width: calc(100vw - 100px)`.
     - `.follow-label`: `display: none`.
  2. Assert `.chat-container` bounding rect does not overflow viewport horizontally (`rect.right <= 375`).
- **Oracle Assertion (`{correct required outputs}`):**
  - Chatbox fits within mobile screen bounds without horizontal clipping or overflow.

---

### 2. Architectural Verification & Invariant Proof
- **Zero Mocks Certification:** All tests run directly against real DOM nodes, real computed CSS styles, and authentic browser hit-testing.
- **Payload Admissibility Law (`INV-PAYLOAD-01`):** Admissible payloads use only authentic DOM events, observed strings, and real viewport coordinates. Zero synthetic fixtures.
- **Assertion Law (`INV-ASSERTION-01`):** Oracles assert exact measurable outputs mandated by [`functional_specification_001.md`](../../functional_specification_001.md).
- **Boundary Law (`INV-BOUNDARY-01`):** Zero test execution code is written. All specifications provide deterministic instructions for downstream authoring once authorized.

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-test-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Unblocks downstream test authoring session (upon operator authorization) and integration test matrix synthesis.
