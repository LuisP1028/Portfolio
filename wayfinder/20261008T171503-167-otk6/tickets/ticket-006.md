---
ticket_id: "006"
title: "Integration Test Decision Mapping, Payload Admissibility Governance & Layout Oracle Verification Plan"
type: task
status: resolved
claimed_by: "wayfinder-test-plan"
blocked_by:
  - "[Ticket 001: Button Group Flex Container Reflow & Adaptive Multi-Row Wrapping Architecture](./ticket-001.md)"
  - "[Ticket 002: Button Box Model, Padding Normalization & Text Truncation Elimination](./ticket-002.md)"
  - "[Ticket 003: Multi-Column Grid Breakpoint Dynamics & Card Interior Containment Verification](./ticket-003.md)"
  - "[Ticket 004: Cyberpunk Aesthetic Continuity, Typography Centering & Unified Hit-Target Integrity](./ticket-004.md)"
  - "[Ticket 005: Deterministic Layout Oracles, Viewport Boundary Matrix & Verification Architecture](./ticket-005.md)"
governing_specification: "functional_specification_002.md"
---

# Ticket 006: Integration Test Decision Mapping, Payload Admissibility Governance & Layout Oracle Verification Plan

## Question
How should integration testing for project card action button text rendering, layout preservation, and responsive reflow be structured across `css/styles.css` and `index.html`? What authentic codebase schemas and admissible payloads govern its verification without mocks under Payload Law (`INV-PAYLOAD-01`)? What deterministic oracles define `{correct required outputs}` under Assertion Law (`INV-ASSERTION-01`)? How are explicit failure states (`{errors}`) surfaced without generating executable test code prior to authorization (`INV-BOUNDARY-01`)?

## Context & Specification Grounding
- **Governing Specification:** [`functional_specification_002.md`](../../functional_specification_002.md)
  - § 1 Overview & Problem Definition (`LIVE_DEMO` cut off at right edge as `LIVE_DEM`, `WHITE_PAPER` truncated as `WHITE_PAR`, `SRC_CODE` cramped against button borders).
  - § 2 Desired Functionality & Behavioral Requirements (§ 2.1 Complete Label Legibility & Text Integrity, § 2.2 Adaptive Button Group Layout, § 2.3 Visual Hierarchy & Aesthetic Preservation).
  - § 3 Constraints & Boundary Conditions (§ 3.1 Implementation Agnostic, § 3.2 Card Structure Preservation, § 3.3 Event Binding & Navigation Preservation).
  - § 4 Edge Cases & Exception Handling (§ 4.1 High Screen Resolutions / 4-Column Layouts, § 4.2 Longest Label Pair `OBJ-01`, § 4.3 Single-Column Mobile Viewports <600px, § 4.4 Browser Zoom up to 200%).
  - § 5 Acceptance Criteria & `{correct required outputs}` (Visual Text Inspection, Responsive Reflow Verification, Containment Verification, Functional Interaction Verification).
- **Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)
  - Strict definitions of `{errors}`, `{correctness}`, `{functionality}`, `{correct required outputs}`, `{sufficient}`, and `{insufficient}`.
  - Domain glossary: `{Project Cards / OBJ Boxes}`, `{Action Buttons / Button Groups}`, `{Label Truncation & Text Overflow}`.
- **Governing Upstream Manifests:**
  - Plan manifest: [`handoff/20261008T171503-167-otk6/wayfinder-read-and-plan.txt`](../../handoff/20261008T171503-167-otk6/wayfinder-read-and-plan.txt)
  - Implementer manifest: [`handoff/20261008T171503-167-otk6/implementer.txt`](../../handoff/20261008T171503-167-otk6/implementer.txt) (`css/styles.css`)
  - Reviewer manifest: [`handoff/20261008T171503-167-otk6/reviewer.txt`](../../handoff/20261008T171503-167-otk6/reviewer.txt) (`css/styles.css`)
- **Target Components & Verification Call-Sites:**
  - [`css/styles.css`](../../css/styles.css):
    - `.grid` (`L103`): `display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;`
    - `.card` (`L110-L115`): `border: 1px solid var(--grid-line); background: #0a0a0a; position: relative; padding: 1.5rem;`
    - `.btn-group` (`L123-L130`): `display: flex; flex-wrap: wrap; gap: 0.6rem; width: 100%; position: relative; z-index: 10;`
    - `.btn` (`L131-L153`): `padding: 0.5rem 0.75rem; white-space: nowrap; display: inline-flex; align-items: center; justify-content: center; text-align: center; flex: 1 1 auto; min-width: max-content; box-sizing: border-box;`
    - `button.btn` (`L154-L159`): `box-sizing: border-box; cursor: pointer;`
  - [`index.html`](../../index.html):
    - OBJ-04 `.btn-group` (`L153-L158`): `<button onclick="openTerminal04(...)">LIVE_DEMO</button>` and `<a href="..." target="_blank">SRC_CODE</a>`
    - OBJ-01 `.btn-group` (`L183-L186`): `<button onclick="openMediaModal()">LIVE_DEMO</button>` and `<button onclick="openPDFModal()">WHITE_PAPER</button>`
    - OBJ-02 `.btn-group` (`L220-L225`): `<button onclick="openTerminal(...)">LIVE_DEMO</button>` and `<a href="..." target="_blank">SRC_CODE</a>`
    - OBJ-03 `.btn-group` (`L302-L307`): `<button onclick="openTerminal(...)">LIVE_DEMO</button>` and `<a href="..." target="_blank">SRC_CODE</a>`
  - [`js/modal-logic.js`](../../js/modal-logic.js):
    - `openMediaModal()`, `closeMediaModal()`
    - `openPDFModal()`, `closePDFModal()`
    - `openTerminal(url, isGradio)`, `openTerminal04(url, isGradio)`

---

## Architectural Decisions to Lock

### 1. Component Boundaries & Integration Surface
Integration testing must span the full DOM, CSS box model, responsive grid reflow, and interactive dispatch pipelines without isolation mocks:
1. **Button Box Model & Text Clipping Domain:** Verification of horizontal padding, `box-sizing: border-box`, `white-space: nowrap`, and `min-width: max-content` across all 8 buttons in `#projects`.
2. **Container Reflow & Multi-Row Wrapping Domain:** Verification of `.btn-group` flex wrapping (`flex-wrap: wrap`), symmetrical gap (`gap: 0.6rem`), and full card-interior width utilization (`width: 100%`).
3. **Card Interior Containment Domain:** Verification that every button bounding box is mathematically contained within the inner padded area of its parent `.card` across desktop, tablet, and mobile breakpoints.
4. **Multi-Column Grid Breakpoint Domain:** Verification across the 6 standard viewport dimensions (1920px down to 375px) and 200% browser zoom, particularly validating the longest label pair on `OBJ-01` (`LIVE_DEMO` + `WHITE_PAPER`).
5. **Interactive Dispatch & Event Binding Domain:** Verification that modal triggers (`openMediaModal`, `openPDFModal`, `openTerminal`, `openTerminal04`) and external navigation links (`target="_blank"`) operate identically on click/tap.

### 2. Codebase Schema Grounding (Zero Mocks Mandate)
Under Payload Law (`INV-PAYLOAD-01`), no synthetic JSON, dummy mock objects, or handwritten stand-in payloads are permitted. All tests execute against authentic codebase interfaces:

#### Schema 1: DOM Element Layout Schema (`DOMElementLayoutPayload`)
- `scrollWidth`: Non-negative floating-point number or integer representing internal scroll content width.
- `clientWidth`: Non-negative integer representing inner visible viewport width including padding.
- `scrollHeight`: Non-negative number representing internal scroll content height.
- `clientHeight`: Non-negative number representing inner visible height.
- `offsetWidth`: Non-negative number representing outer layout width including borders.
- `offsetHeight`: Non-negative number representing outer layout height.

#### Schema 2: DOM Bounding Client Rect Schema (`BoundingClientRectPayload`)
- `top`: Viewport Y-coordinate of element's top boundary.
- `bottom`: Viewport Y-coordinate of element's bottom boundary.
- `left`: Viewport X-coordinate of element's left boundary.
- `right`: Viewport X-coordinate of element's right boundary.
- `width`: Geometric width (`right - left`).
- `height`: Geometric height (`bottom - top`).
- `x`: Equal to `left`.
- `y`: Equal to `top`.

#### Schema 3: CSS Computed Style Schema (`ComputedStylePayload`)
- `display`: String enum (`"inline-flex"` | `"flex"` | `"grid"` | `"block"` | `"none"`).
- `flexWrap`: String enum (`"wrap"` | `"nowrap"` | `"wrap-reverse"`).
- `whiteSpace`: String enum (`"nowrap"` | `"normal"` | `"pre"`).
- `minWidth`: String representation (`"max-content"` | `"auto"` | `"0px"`).
- `flexGrow`: String representation of unitless scalar (`"1"` | `"0"`).
- `flexShrink`: String representation of unitless scalar (`"1"` | `"0"`).
- `flexBasis`: String representation (`"auto"` | `"0px"`).
- `paddingTop`: String representation with pixel or rem units (`"8px"` / `"0.5rem"`).
- `paddingRight`: String representation with pixel or rem units (`"12px"` / `"0.75rem"`).
- `paddingBottom`: String representation with pixel or rem units (`"8px"` / `"0.5rem"`).
- `paddingLeft`: String representation with pixel or rem units (`"12px"` / `"0.75rem"`).
- `boxSizing`: String enum (`"border-box"` | `"content-box"`).
- `alignItems`: String enum (`"center"` | `"flex-start"` | `"stretch"`).
- `justifyContent`: String enum (`"center"` | `"flex-start"` | `"space-between"`).
- `textAlign`: String enum (`"center"` | `"left"` | `"right"`).
- `gap`: String representation (`"0.6rem"` | `"9.6px"`).
- `position`: String enum (`"relative"` | `"static"` | `"absolute"`).
- `zIndex`: String representation of integer (`"10"`).

#### Schema 4: Button Label Text & Content Schema (`ButtonContentPayload`)
- `textContent`: Exact trimmed string (`"LIVE_DEMO"` | `"WHITE_PAPER"` | `"SRC_CODE"`).
- `length`: Exact character count (9 for `"LIVE_DEMO"`, 11 for `"WHITE_PAPER"`, 8 for `"SRC_CODE"`).
- `tagName`: String enum (`"BUTTON"` | `"A"`).
- `href`: String URL or null for `<button>`.
- `target`: String attribute (`"_blank"` for `<a>`) or null.
- `onclick`: String attribute or function handler reference.

#### Schema 5: Responsive Viewport Dimension Schema (`ViewportDimensionPayload`)
- `width`: Viewport horizontal dimension in CSS pixels (1920, 1440, 1280, 1024, 768, 375).
- `height`: Viewport vertical dimension in CSS pixels (1080, 900, 800, 768, 1024, 667).
- `zoom`: Numerical zoom scalar (1.0, 2.0).

#### Schema 6: Button Interaction Event Schema (`ButtonInteractionPayload`)
- `type`: String event identifier (`"click"`).
- `target`: Target DOM element node (`HTMLButtonElement` | `HTMLAnchorElement`).
- `bubbles`: Boolean (`true`).
- `cancelable`: Boolean (`true`).

---

### 3. Admissible Payloads Under Payload Law (`INV-PAYLOAD-01`)
1. **Authentic DOM Ingestion:** Payloads ingested by integration test routines consist strictly of real DOM nodes selected from `document.querySelectorAll('#projects .card')` and `card.querySelectorAll('.btn')` loaded directly from [`index.html`](../../index.html).
2. **Authentic Stylesheet Parsing:** Styles evaluated are parsed directly from the live stylesheet cascade in [`css/styles.css`](../../css/styles.css).
3. **Sparse & Optional Packing:** Any sparse or optional properties (such as inline style attributes or optional event parameters) are left unfilled. No synthetic fields (`mockId`, `isDummy`, `stubValue`) may be injected.
4. **Observed Coordinate Metrics:** Hit-testing and bounding boxes use real layout coordinates calculated by the browser layout engine.

---

### 4. Deterministic Integration Test Oracles (`INV-ASSERTION-01`)

Under Assertion Law, oracles evaluate `{correct required outputs}` strictly against the functional specification and ticket decisions:

#### Oracle 1: Zero Text Clipping (`ORACLE-TEXT-CLIPPING`)
$$\forall \text{btn} \in \text{document.querySelectorAll}('#projects .btn') : \text{btn.scrollWidth} \le \text{btn.clientWidth}$$
- **Pass Condition:** `btn.scrollWidth <= btn.clientWidth` evaluates strictly to `true` for all 8 buttons across all 4 project cards (`OBJ-01`, `OBJ-02`, `OBJ-03`, `OBJ-04`).
- **Rationale:** If `scrollWidth > clientWidth`, text glyphs have overflowed the box model boundary and suffered truncation or clipping.

#### Oracle 2: Exact String & Glyph Fidelity (`ORACLE-STRING-FIDELITY`)
For each project card, inspect button text content and character counts:
- `OBJ-01`:
  - Button 1: `btn[0].textContent.trim() === "LIVE_DEMO"` and `btn[0].textContent.trim().length === 9`.
  - Button 2: `btn[1].textContent.trim() === "WHITE_PAPER"` and `btn[1].textContent.trim().length === 11`.
- `OBJ-02`:
  - Button 1: `btn[0].textContent.trim() === "LIVE_DEMO"` and `btn[0].textContent.trim().length === 9`.
  - Button 2: `btn[1].textContent.trim() === "SRC_CODE"` and `btn[1].textContent.trim().length === 8`.
- `OBJ-03`:
  - Button 1: `btn[0].textContent.trim() === "LIVE_DEMO"` and `btn[0].textContent.trim().length === 9`.
  - Button 2: `btn[1].textContent.trim() === "SRC_CODE"` and `btn[1].textContent.trim().length === 8`.
- `OBJ-04`:
  - Button 1: `btn[0].textContent.trim() === "LIVE_DEMO"` and `btn[0].textContent.trim().length === 9`.
  - Button 2: `btn[1].textContent.trim() === "SRC_CODE"` and `btn[1].textContent.trim().length === 8`.
- **Pass Condition:** 100% of characters are present. Trailing glyphs (`O` in `LIVE_DEMO`, `ER` in `WHITE_PAPER`) are intact. Zero mid-word hyphenation.

#### Oracle 3: Card Interior Containment (`ORACLE-CARD-CONTAINMENT`)
$$\forall \text{card} \in \text{document.querySelectorAll}('#projects .card'), \forall \text{btn} \in \text{card.querySelectorAll}('.btn'):$$
$$\text{rect}(\text{btn}).\text{left} \ge \text{rect}(\text{card}).\text{left} \land \text{rect}(\text{btn}).\text{right} \le \text{rect}(\text{card}).\text{right}$$
- **Pass Condition:** Every button bounding rect resides strictly within its parent `.card` bounding rect with non-negative margin clearance.
- **Inner Content Check:** Additionally, $\text{rect}(\text{btn}).\text{left} \ge \text{rect}(\text{card}).\text{left} + 24\text{px} - 1\text{px}$ and $\text{rect}(\text{btn}).\text{right} \le \text{rect}(\text{card}).\text{right} - 24\text{px} + 1\text{px}$, respecting the card's 1.5rem (`24px`) padding.

#### Oracle 4: Viewport & Breakpoint Persistence (`ORACLE-VIEWPORT-STABILITY`)
$$\text{document.documentElement.scrollWidth} \le \text{window.innerWidth}$$
- **Pass Condition:** At all standard viewport presets (1920x1080, 1440x900, 1280x800, 1024x768, 768x1024, 375x667) and under 200% browser zoom, the document exhibits zero horizontal scrolling (`scrollWidth <= innerWidth`), and no button bleeds into adjacent grid cells.

#### Oracle 5: Box Model & Computed Style Conformance (`ORACLE-STYLE-CONFORMANCE`)
For every `.btn` element:
- `getComputedStyle(btn).whiteSpace === "nowrap"`
- `getComputedStyle(btn).boxSizing === "border-box"`
- `getComputedStyle(btn).display === "inline-flex"`
- `getComputedStyle(btn).minWidth === "max-content"`
- `getComputedStyle(btn).paddingLeft === "12px"` (or `0.75rem`)
- `getComputedStyle(btn).paddingRight === "12px"` (or `0.75rem`)
For every `.btn-group` element:
- `getComputedStyle(group).display === "flex"`
- `getComputedStyle(group).flexWrap === "wrap"`
- `getComputedStyle(group).width === "100%"` (or matches parent inner client width)

#### Oracle 6: Interaction & Navigation Integrity (`ORACLE-INTERACTION-INTEGRITY`)
- **`OBJ-01 LIVE_DEMO`:** Dispatching `click` invokes `openMediaModal()`, rendering `#media-modal` or media viewer layer with `display !== 'none'`.
- **`OBJ-01 WHITE_PAPER`:** Dispatching `click` invokes `openPDFModal()`, rendering `#pdf-modal` with `display !== 'none'`.
- **`OBJ-02 LIVE_DEMO`:** Dispatching `click` invokes `openTerminal('https://choppedcheese-choppedgreeks.hf.space', true)`.
- **`OBJ-02 SRC_CODE`:** Inspecting `a.btn` attributes verifies `href === "https://huggingface.co/spaces/ChoppedCheese/ChoppedGreeks/tree/main"` and `target === "_blank"`.
- **`OBJ-03 LIVE_DEMO`:** Dispatching `click` invokes `openTerminal('https://choppedcheese-choppedcnnmalware.hf.space', true)`.
- **`OBJ-03 SRC_CODE`:** Inspecting `a.btn` attributes verifies `href === "https://github.com/LuisP1028/CNN-Virus-Scanner"` and `target === "_blank"`.
- **`OBJ-04 LIVE_DEMO`:** Dispatching `click` invokes `openTerminal04('https://choppedcheese-digitaltwin.hf.space', true)`.
- **`OBJ-04 SRC_CODE`:** Inspecting `a.btn` attributes verifies `href === "https://huggingface.co/spaces/ChoppedCheese/DigitalTwin/tree/main"` and `target === "_blank"`.

---

### 5. Explicit Failure States / `{errors}`
The integration test harness must immediately surface a fatal `{error}` upon detecting any of the following failure modes:
1. **`ERR_TEXT_CLIPPED`:** Any `.btn` where `scrollWidth > clientWidth`.
2. **`ERR_LABEL_TRUNCATED`:** Any button label missing expected characters (e.g. `LIVE_DEM`, `WHITE_PAR`, `SRC_COD`).
3. **`ERR_MID_WORD_BREAK`:** Text within a button broken across multiple lines or hyphenated.
4. **`ERR_CARD_BLEED`:** Any button where `rect(btn).right > rect(card).right` or `rect(btn).left < rect(card).left`.
5. **`ERR_PAGE_OVERFLOW`:** Page-level `document.documentElement.scrollWidth > window.innerWidth`.
6. **`ERR_FLEX_COMPRESSION`:** `.btn-group` computed `flex-wrap !== "wrap"`, forcing single-row compression.
7. **`ERR_PADDING_EXCESS`:** `.btn` computed horizontal padding exceeding `12px` (`0.75rem`), violating the padding normalization invariant.
8. **`ERR_INTERACTION_FAULT`:** Click handlers throwing runtime errors, failing to open designated modals, or anchor tags missing `target="_blank"`.

---

## Resolution

### 1. Verification Test Suites Specification

#### Test Suite 1: Button Label Text Integrity & Character Fidelity (FS-002 § 2.1, § 5.1)
- **Target:** All `.card .btn` elements across `OBJ-01`, `OBJ-02`, `OBJ-03`, `OBJ-04`.
- **Preconditions:** DOM loaded from `index.html`.
- **Actions:**
  1. Query all 4 project cards by order in `#projects`.
  2. Read `.btn` child text contents, strip outer whitespace.
  3. Validate exact string match:
     - `OBJ-01`: `["LIVE_DEMO", "WHITE_PAPER"]`
     - `OBJ-02`: `["LIVE_DEMO", "SRC_CODE"]`
     - `OBJ-03`: `["LIVE_DEMO", "SRC_CODE"]`
     - `OBJ-04`: `["LIVE_DEMO", "SRC_CODE"]`
  4. Assert length of `LIVE_DEMO` is exactly 9 characters.
  5. Assert length of `WHITE_PAPER` is exactly 11 characters.
  6. Assert length of `SRC_CODE` is exactly 8 characters.
- **Oracle Assertion (`{correct required outputs}`):**
  - Zero missing glyphs, trailing characters `O`, `R`, and `E` 100% visible.

#### Test Suite 2: Horizontal Box Model & Zero-Clipping Verification (FS-002 § 2.1.1, § 5.1)
- **Target:** All `.card .btn` elements.
- **Preconditions:** Computed layout stabilized.
- **Actions:**
  1. Iterate over every button element.
  2. Compare `btn.scrollWidth` against `btn.clientWidth`.
  3. Assert `btn.scrollWidth <= btn.clientWidth`.
  4. Inspect computed `whiteSpace`: assert `=== "nowrap"`.
  5. Inspect computed `minWidth`: assert `=== "max-content"`.
- **Oracle Assertion (`{correct required outputs}`):**
  - Zero text overflow. All glyphs fully contained inside button client width.

#### Test Suite 3: Card Interior Containment & Margin Clearance (FS-002 § 2.2.1, § 5.3)
- **Target:** `#projects .card` and `.btn-group .btn`.
- **Preconditions:** Desktop and mobile viewport states.
- **Actions:**
  1. For each `.card`, obtain `rect(card) = card.getBoundingClientRect()`.
  2. For each button inside that card, obtain `rect(btn) = btn.getBoundingClientRect()`.
  3. Assert `rect(btn).left >= rect(card).left`.
  4. Assert `rect(btn).right <= rect(card).right`.
  5. Assert `rect(btn).top >= rect(card).top`.
  6. Assert `rect(btn).bottom <= rect(card).bottom`.
- **Oracle Assertion (`{correct required outputs}`):**
  - Zero card boundary bleed. Buttons strictly contained within parent card bounds.

#### Test Suite 4: Multi-Viewport Responsive Reflow & 200% Zoom (FS-002 § 2.2.2, § 4.1–§ 4.4, § 5.2)
- **Target:** Viewport controller, `#projects`, `.btn-group`.
- **Preconditions:** Test environment capable of viewport resizing.
- **Actions:**
  1. Set viewport to Full HD Desktop (`1920x1080`):
     - Grid renders 4 columns. Cards are wide (~310px–350px).
     - Buttons sit side-by-side.
     - Assert `scrollWidth <= clientWidth` on all buttons.
     - Assert `document.documentElement.scrollWidth <= 1920`.
  2. Set viewport to Constrained Laptop (`1280x800`):
     - Grid renders 4 columns with cards at ~280px.
     - Inner card content width is ~232px.
     - On `OBJ-01`, total side-by-side requirement ($251.6\text{px}$) exceeds $232\text{px}$.
     - Assert `WHITE_PAPER` wraps to second row (`rect(btn[1]).top > rect(btn[0]).top`).
     - Assert both buttons expand to fill row width (`rect(btn).width >= 200`).
     - Assert `scrollWidth <= clientWidth` on both buttons.
  3. Set viewport to Tablet Landscape (`1024x768`):
     - Grid renders 3 columns. Reflow wraps cleanly without clipping.
  4. Set viewport to Tablet Portrait (`768x1024`):
     - Grid collapses to 1 column. Cards expand to full container width.
     - Buttons render with ample margin.
  5. Set viewport to Mobile Portrait (`375x667`):
     - Grid collapses to 1 column. Card width is ~343px.
     - Assert `document.documentElement.scrollWidth <= 375`.
     - Assert zero horizontal scrollbar.
  6. Apply 200% Zoom emulation (`1280x800` at 2.0 DPR / zoom):
     - Effective viewport width 640px.
     - Buttons wrap gracefully; zero text cut off.
- **Oracle Assertion (`{correct required outputs}`):**
  - All 8 buttons remain 100% legible and contained across all 6 viewport presets and 200% zoom.

#### Test Suite 5: CSS Computed Style & Property Contract Verification (FS-002 § 2.2, § 2.3)
- **Target:** `.btn-group`, `.btn`, `button.btn`.
- **Preconditions:** Loaded styles from `css/styles.css`.
- **Actions:**
  1. Query `.btn-group`:
     - Assert `getComputedStyle(group).display === "flex"`.
     - Assert `getComputedStyle(group).flexWrap === "wrap"`.
     - Assert `getComputedStyle(group).gap === "9.6px"` (or `0.6rem`).
     - Assert `getComputedStyle(group).position === "relative"`.
     - Assert `getComputedStyle(group).zIndex === "10"`.
  2. Query `.btn`:
     - Assert `getComputedStyle(btn).paddingTop === "8px"` (or `0.5rem`).
     - Assert `getComputedStyle(btn).paddingRight === "12px"` (or `0.75rem`).
     - Assert `getComputedStyle(btn).paddingBottom === "8px"` (or `0.5rem`).
     - Assert `getComputedStyle(btn).paddingLeft === "12px"` (or `0.75rem`).
     - Assert `getComputedStyle(btn).boxSizing === "border-box"`.
     - Assert `getComputedStyle(btn).display === "inline-flex"`.
     - Assert `getComputedStyle(btn).alignItems === "center"`.
     - Assert `getComputedStyle(btn).justifyContent === "center"`.
     - Assert `getComputedStyle(btn).textAlign === "center"`.
     - Assert `getComputedStyle(btn).whiteSpace === "nowrap"`.
     - Assert `getComputedStyle(btn).minWidth === "max-content"`.
  3. Query `button.btn`:
     - Assert `getComputedStyle(btn).cursor === "pointer"`.
     - Assert `getComputedStyle(btn).boxSizing === "border-box"`.
- **Oracle Assertion (`{correct required outputs}`):**
  - Exact property values matched. No regression to `padding: 0.5rem 1.5rem` or `flex-wrap: nowrap`.

#### Test Suite 6: Functional Interaction, Modal Invocations & Anchor Target Verification (FS-002 § 3.3, § 5.4)
- **Target:** Button click dispatchers and external links.
- **Preconditions:** Global window functions defined in `js/modal-logic.js`.
- **Actions:**
  1. `OBJ-01`:
     - Click `LIVE_DEMO` button. Assert `openMediaModal` executes and `#media-modal` or media viewer is visible.
     - Click `WHITE_PAPER` button. Assert `openPDFModal` executes and `#pdf-modal` is visible.
  2. `OBJ-02`:
     - Click `LIVE_DEMO` button. Assert `openTerminal` executes with URL `https://choppedcheese-choppedgreeks.hf.space`.
     - Inspect `SRC_CODE` anchor. Assert `href === "https://huggingface.co/spaces/ChoppedCheese/ChoppedGreeks/tree/main"` and `target === "_blank"`.
  3. `OBJ-03`:
     - Click `LIVE_DEMO` button. Assert `openTerminal` executes with URL `https://choppedcheese-choppedcnnmalware.hf.space`.
     - Inspect `SRC_CODE` anchor. Assert `href === "https://github.com/LuisP1028/CNN-Virus-Scanner"` and `target === "_blank"`.
  4. `OBJ-04`:
     - Click `LIVE_DEMO` button. Assert `openTerminal04` executes with URL `https://choppedcheese-digitaltwin.hf.space`.
     - Inspect `SRC_CODE` anchor. Assert `href === "https://huggingface.co/spaces/ChoppedCheese/DigitalTwin/tree/main"` and `target === "_blank"`.
- **Oracle Assertion (`{correct required outputs}`):**
  - Zero broken event handlers. All modals launch properly, and external links preserve navigation attributes.

---

### 2. Architectural Verification & Invariant Proof
- **Zero Mocks Certification:** All planned tests execute directly against authentic DOM nodes loaded from `index.html` and styled by `css/styles.css`. No simulated geometry, dummy schemas, or fake JSON payloads exist.
- **Payload Admissibility Law (`INV-PAYLOAD-01`):** Admissible inputs consist exclusively of authentic DOM elements, computed CSS styles, and real viewport metrics.
- **Assertion Law (`INV-ASSERTION-01`):** Every oracle tests `{correct required outputs}` strictly mandated by [`functional_specification_002.md`](../../functional_specification_002.md) and locked ticket decisions.
- **Boundary Law (`INV-BOUNDARY-01`):** Exactly zero lines of test execution code, test runners, or fixture files have been generated during this read-and-plan session. Implementation coding waits on explicit operator authorization.

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-test-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Fully unblocks downstream test authoring session upon operator authorization, backed by the authoritative integration test matrix.
