# Map 20261008T164831-838-hwjp: Chatbox Visual Layering & Clipping Prevention Architectural Plan

**Governing Specification:**
- [`functional_specification_001.md`](../../functional_specification_001.md) (Chatbox Visual Layering & Clipping Prevention)

**Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)  
**Run Identifier:** `20261008T164831-838-hwjp`  
**Execution Node:** `wayfinder-read-and-plan` & `wayfinder-test-plan`  
**Status:** Canonical Plan & Integration Test Architecture Locked; Zero Ambiguity (Tickets 001–006 Resolved, Master Edit & Test Matrices Synthesized)

---

## 1. Destination

Establish a complete, deterministic, and verified decision set detailing every architectural, visual layering, code edit, and integration test requirement across the codebase to implement and verify the foreground dominance and clipping prevention functionality specified in [`functional_specification_001.md`](../../functional_specification_001.md) without invention:
1. **Global Stacking Context & Z-Index Architecture (Ticket 001):** Establish a 5-tier global stacking hierarchy that places `#chat-widget-container` in Tier 3 (`z-index: 50000; isolation: isolate;`), dominating sticky navigation (`z-index: 10005`) and hero headlines (`z-index: 10001`), while subordinating to full-screen modals (`z-index: 100000`).
2. **Surface Opacity & Graphic Bleed Prevention (Ticket 002):** Convert `.chat-container` and `.follow-module` backgrounds from translucent `rgba(5, 5, 5, 0.98)` to 100% opaque `#050505` (`var(--bg-color)`), ensuring zero bleed-through from underlying typography, hazard tape ribbons, or particle canvas.
3. **Internal Component Layering & Interaction Integrity (Ticket 003):** Establish normalized internal z-index ordering inside `#chat-widget-container` (`.chat-container` at 10, `.follow-module` at 15, `.chat-fab` at 20, `#chat-callout` at 25) with pointer-event partitioning (`pointer-events: none` on container, `pointer-events: auto` on interactive elements) eliminating click dead zones.
4. **Scrolling & Sticky Header Overlap Dynamics (Ticket 004):** Lock fixed viewport coordinates, smooth vertical scrolling persistence, sticky header overlay precedence, and mobile responsive boundaries (`@media (max-width: 600px)`).
5. **Full-Screen Modal Hierarchy & Focus Governance (Ticket 005):** Validate that full-screen modals (`.modal-overlay` at `z-index: 100000`) cleanly supersede the chatbox on demand, capturing full pointer focus and returning cleanly on dismissal.
6. **Integration Test Decision Mapping & Verification Architecture (Ticket 006):** Define comprehensive integration verification across 6 test suites grounded exclusively in real codebase schemas (`ComputedStylePayload`, `DOMElementState`, `CoordinateHitTestPayload`, `ChatMessagePayload`), locking deterministic hit-testing and computed style oracles without synthetic mocks or dummy data.

---

## 2. Notes & Architectural Foundation

### 2.1 Codebase Structure & Target Call-Sites
- **Core Stylesheet:** [`css/styles.css`](../../css/styles.css) establishes the Industrial Cyberpunk theme (`--bg-color: #050505`, `--accent: #ff3c00`). Defines sticky `header` (`L41-L50`, `z-index: 10005; isolation: isolate;`) and `.hero-content` (`L81-L85`, `z-index: 10001;`).
- **Chatbox Stylesheet:** [`css/chatbox.css`](../../css/chatbox.css) styles `#chat-widget-container` (`L5-L11`), `.chat-fab` (`L14-L32`), `.chat-container` (`L47-L74`), `#chat-callout` (`L209-L225`), and `.follow-module` (`L266-L295`).
- **Animation Stylesheet:** [`css/animations.css`](../../css/animations.css) defines `.hazard-tape-wrapper` (`L131-L158`, `z-index: 10000;`) and `.crt-overlay` (`L11-L15`, `z-index: 9999;`).
- **Modal Stylesheet:** [`css/modal.css`](../../css/modal.css) defines `#intro-layer` (`L62-L67`, `z-index: 99999;`) and `.modal-overlay` (`L141-L150`, `z-index: 100000;`).
- **DOM Shell:** [`index.html`](../../index.html) mounts `#chat-widget-container` (`L354`) before the modal declarations (`L356-L376`).
- **Chat Logic:** [`js/chat-widget.js`](../../js/chat-widget.js) dynamically injects `#follow-module` and binds toggle handlers to `.chat-fab` and `#chat-close-btn`.

### 2.2 Global Stacking Tiers
$$\text{Tier 0 (Canvas/Grid: -1 to 10)} < \text{Tier 1 (Atmosphere: 9999 to 10000)} < \text{Tier 2 (Page Content/Header: 10001 to 10005)} < \text{Tier 3 (Chat Widget: 50000)} < \text{Tier 4 (Modals/Intro: 99999 to 100000)}$$

---

## 3. Decisions So Far & Ticket Registry

- **[Ticket 001: Global Viewport Stacking Context & Z-Index Architecture](./tickets/ticket-001.md)** — Resolved. Established the 5-tier global stacking hierarchy, locked `#chat-widget-container` to `z-index: 50000; isolation: isolate;`, ensuring absolute foreground dominance over `header` (10005), `.hero-content` (10001), and `.hazard-tape-wrapper` (10000).
- **[Ticket 002: Chat Container Opacity, Background Isolation & Graphic Bleed Prevention](./tickets/ticket-002.md)** — Resolved. Replaced translucent `rgba(5, 5, 5, 0.98)` with 100% opaque `#050505` (`var(--bg-color)`) on `.chat-container` and `.follow-module`, completely eliminating background typography and particle shine-through while preserving border aesthetics.
- **[Ticket 003: Internal Stacking & Layout Dynamics for FAB, Follow Tray & Callout Prompt](./tickets/ticket-003.md)** — Resolved. Normalized internal z-index hierarchy (`.chat-container`: 10, `.follow-module`: 15, `.chat-fab`: 20, `#chat-callout`: 25) and locked pointer-event partitioning (`pointer-events: none` on container, `pointer-events: auto` on interactive controls) to guarantee zero click dead zones.
- **[Ticket 004: Scrolling, Sticky Header Overlap & Viewport Persistence Invariants](./tickets/ticket-004.md)** — Resolved. Locked fixed viewport persistence across all vertical scroll offsets, clean precedence over the sticky header during 150%+ zoom, and mobile responsive boundaries (`@media (max-width: 600px)`).
- **[Ticket 005: Full-Screen Modal Overlay Precedence & Focus Governance](./tickets/ticket-005.md)** — Resolved. Locked Tier 4 modal supremacy (`.modal-overlay` at `z-index: 100000`), guaranteeing active terminals and white paper viewers take complete visual and focus precedence over the chatbox without visual clipping or event leakage.
- **[Ticket 006: Integration Test Decision Mapping, Payload Admissibility Governance & Oracle Verification Plan](./tickets/ticket-006.md)** — Resolved. Mapped integration test architecture across 6 test suites with 100% schema fidelity against active codebase interfaces (`ComputedStylePayload`, `DOMElementState`, `CoordinateHitTestPayload`, `ChatMessagePayload`), defined deterministic hit-testing and computed style oracles, established explicit failure states (`{errors}`), and enforced strict "DO NOT CODE YET" gate (`INV-BOUNDARY-01`) with zero mocks.

---

## 4. Not Yet Specified

*(All functional requirements, architectural implementation decisions, and integration test specifications for this run have been charted and fully resolved. Zero fog remains.)*

---

## 5. Out of Scope

- Writing executable test code, mock servers, synthetic fixtures, or runner scripts prior to explicit operator authorization (`INV-BOUNDARY-01`).
- Modifying the underlying backend API endpoint (`https://choppedcheese-platodoomcave.hf.space/chat`) or alteration of the Pydantic chat message schema.
- Redesigning the hero typography font families (`Chakra Petch`, `JetBrains Mono`) or altering hero layout proportions.
- Refactoring independent project modal implementations (Gradio iframe loading, PDF.js rendering pipeline).
