# Authoritative Integration Test Matrix: Chatbox Visual Layering & Clipping Prevention

**Governing Specification:** [`functional_specification_001.md`](../../functional_specification_001.md)  
**Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)  
**Run Identifier:** `20261008T164831-838-hwjp`  
**Execution Node:** `wayfinder-test-plan`  
**Status:** Canonical Test Plan Locked; Zero Test Code Generated (`INV-BOUNDARY-01` Enforced)

---

## 1. Master Integration Test Matrix

| Component Path & Target Selector | Governing Ticket & Specification | Governing Codebase Schema | Admissible Input Payloads (`INV-PAYLOAD-01`) | Measurable Oracle / `{correct required outputs}` (`INV-ASSERTION-01`) | Explicit Failure States / `{errors}` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [`css/chatbox.css`](../../css/chatbox.css#L5-L13)<br>`#chat-widget-container` | [Ticket 001](./tickets/ticket-001.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-001 § 2.1.1, § 2.3.1 | `ComputedStylePayload`:<br>- `position`<br>- `z-index`<br>- `isolation`<br>- `pointer-events` | Observed DOM mount at `index.html#L354`; desktop viewport (`1920x1080`); `scrollY = 0`. | 1. `position === "fixed"`<br>2. `z-index === "50000"`<br>3. `isolation === "isolate"`<br>4. `pointer-events === "none"` | 1. `z-index < 50000`<br>2. `isolation !== "isolate"`<br>3. `pointer-events !== "none"` (causes dead zone blocking) |
| [`css/chatbox.css`](../../css/chatbox.css#L16-L35)<br>`.chat-fab` | [Ticket 003](./tickets/ticket-003.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-001 § 2.2.1 | `DOMElementState`,<br>`ComputedStylePayload`:<br>- `z-index`<br>- `pointer-events`<br>- `background-color` | `PointerEvent("click")` dispatched to `.chat-fab` in resting state. | 1. `z-index === "20"`<br>2. `pointer-events === "auto"`<br>3. `backgroundColor === "rgb(5, 5, 5)"`<br>4. Toggles `#doom-chat-container.active`<br>5. Toggles `.follow-module.revealed`<br>6. Adds `#chat-callout.hidden` | 1. `pointer-events === "none"` (unclickable FAB)<br>2. `z-index <= 15` (occluded by tray)<br>3. Callout fails to hide |
| [`css/chatbox.css`](../../css/chatbox.css#L50-L77)<br>`.chat-container` | [Ticket 002](./tickets/ticket-002.md), [Ticket 003](./tickets/ticket-003.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-001 § 2.1.2, § 2.2.2 | `ComputedStylePayload`,<br>`CoordinateHitTestPayload`:<br>- `backgroundColor`<br>- `opacity`<br>- `pointer-events`<br>- `z-index` | Active state payload: element has class `active`; hit-test coordinates at center `(x, y)` intersecting hero headline. | 1. `backgroundColor === "rgb(5, 5, 5)"` (alpha = 1.0)<br>2. `opacity === "1"`<br>3. `pointer-events === "auto"`<br>4. `z-index === "10"`<br>5. `document.elementFromPoint(x, y)` yields chat container or child, NOT `h1` or `.hero-content` | 1. Translucent background (`rgba` with alpha < 1.0)<br>2. Bleed-through from hero headline<br>3. `elementFromPoint` yields `h1` |
| [`css/chatbox.css`](../../css/chatbox.css#L208-L228)<br>`@media (max-width: 600px)` | [Ticket 004](./tickets/ticket-004.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-001 § 4.1 | `ComputedStylePayload`,<br>`BoundingClientRect`:<br>- `width`<br>- `bottom`<br>- `right`<br>- `max-height` | Mobile viewport payload: screen width `375px`, height `667px`; chatbox active. | 1. `#chat-widget-container`: `bottom === "15px"`, `right === "15px"`<br>2. `.chat-container`: `width === "calc(100vw - 30px)"`<br>3. `max-height === "calc(100vh - 110px)"`<br>4. `rect.right <= 375` (zero horizontal overflow) | 1. Horizontal overflow beyond viewport width<br>2. Overlapping sticky header without safe clearance |
| [`css/chatbox.css`](../../css/chatbox.css#L231-L281)<br>`#chat-callout` | [Ticket 003](./tickets/ticket-003.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-001 § 2.2.1 | `DOMElementState`,<br>`ComputedStylePayload`:<br>- `z-index`<br>- `pointer-events`<br>- `opacity` | Resting state: initial page load. Interactive state: first click on `.chat-fab`. | 1. Initial: `opacity === "1"`, `pointer-events === "none"`, `z-index === "25"`<br>2. Post-click: `#chat-callout.classList.contains("hidden") === true`, `opacity === "0"` | 1. `pointer-events === "auto"` (steals clicks meant for FAB or page)<br>2. Callout remains visible after chatbox opened |
| [`css/chatbox.css`](../../css/chatbox.css#L288-L316)<br>`.follow-module` | [Ticket 002](./tickets/ticket-002.md), [Ticket 003](./tickets/ticket-003.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-001 § 2.2.3 | `DOMElementState`,<br>`ComputedStylePayload`:<br>- `backgroundColor`<br>- `z-index`<br>- `pointer-events`<br>- `opacity` | Active toggle: `.follow-module.revealed`; hit-test on `.follow-link` anchor elements. | 1. `backgroundColor === "rgb(5, 5, 5)"`<br>2. `z-index === "15"` (between container 10 and FAB 20)<br>3. `opacity === "1"`, `pointer-events === "auto"`<br>4. Clicks dispatch to social link anchors | 1. `z-index >= 20` (overlaps FAB)<br>2. Translucent background bleeding hazard tape<br>3. Links unclickable |
| [`css/styles.css`](../../css/styles.css#L41-L50)<br>`header` | [Ticket 001](./tickets/ticket-001.md), [Ticket 004](./tickets/ticket-004.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-001 § 2.3.2 | `ComputedStylePayload`,<br>`CoordinateHitTestPayload` | Dynamic scroll payload: `window.scrollY = 150`; header has class `glass-active`. | 1. Header `z-index === "10005"`<br>2. `#chat-widget-container` (`50000`) sits strictly in front of header<br>3. At collision coordinates, `elementFromPoint` resolves to chatbox | 1. Header clipping or overlapping chat container<br>2. Chatbox tucked underneath sticky header |
| [`css/animations.css`](../../css/animations.css#L131-L158)<br>`.hazard-tape-wrapper` | [Ticket 001](./tickets/ticket-001.md), [Ticket 002](./tickets/ticket-002.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-001 § 2.1.3, § 5.2 | `ComputedStylePayload`,<br>`CoordinateHitTestPayload` | Trajectory coordinates of animated hazard ribbon intersecting chat container. | 1. Hazard tape `z-index === "10000"`<br>2. Chatbox `z-index === "50000"`<br>3. Chat surface (`#050505`) completely blocks visual display of hazard tape | 1. Hazard tape ribbon rendering over or through chatbox<br>2. Graphic bleed through dialog window |
| [`css/modal.css`](../../css/modal.css#L141-L150)<br>`.modal-overlay` | [Ticket 005](./tickets/ticket-005.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-001 § 2.3.3, § 4.3 | `ComputedStylePayload`,<br>`CoordinateHitTestPayload` | Modal trigger payload: `#terminal-modal` opened while chatbox is active (`.chat-container.active`). | 1. Modal `z-index === "100000"`<br>2. Chatbox `z-index === "50000"`<br>3. At overlapping coordinates, `elementFromPoint` resolves to `.modal-overlay` or modal children | 1. Chatbox rendering over modal window<br>2. Chatbox stealing pointer events from active modal |
| [`js/chat-widget.js`](../../js/chat-widget.js#L116-L162)<br>`handleTransmit` | [Ticket 003](./tickets/ticket-003.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-001 § 5.4 | `ChatMessagePayload`:<br>- `message: string`<br>- `history: Array`<br>- `response: string` | Observed query payload: input value `"HELLO DOOM"`; click `#chat-transmit-btn`. | 1. Appends DOM node `.chat-msg.user` with prefix `"USR_> "` and text `"HELLO DOOM"`<br>2. Appends typing indicator `.typing-indicator`<br>3. Input cleared, focus maintained | 1. Input not cleared<br>2. Message not appended<br>3. Focus lost from `#chat-input` |

---

## 2. Test Execution Architecture & Zero Mocks Protocol

### 2.1 Invariant Enforcement
1. **Zero Mocks Mandate (`INV-PAYLOAD-01`):**
   - No mock stylesheets, fake DOM objects, or synthetic JSON payloads.
   - All tests execute against authentic DOM elements mounted by [`index.html`](../../index.html) and styled by [`css/chatbox.css`](../../css/chatbox.css).
2. **Deterministic Hit-Testing Oracles (`INV-ASSERTION-01`):**
   - Visual occlusion and clipping are tested via the real browser rendering pipeline using `document.elementFromPoint(x, y)`.
   - Stacking precedence is objectively verified without guessing or visual approximations.
3. **Fail-Fast Boundary (`INV-FAILFAST-01`):**
   - Any assertion failure surfaces the exact CSS selector, property name, expected schema value, and observed computed value immediately.

---

## 3. Downstream Handoff Guidance

This matrix provides the complete, authoritative specification for downstream integration testing. When authorized by the operator:
- Test implementations should be written against a headless browser engine (such as Playwright or Puppeteer) or real DOM test environment capable of computing layout styles and running `document.elementFromPoint`.
- No additional design decisions, schema inventions, or payload synthesis will be required.
