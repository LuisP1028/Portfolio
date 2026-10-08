# Authoritative Integration Test Matrix: Project Card Action Button Text Rendering & Layout Preservation

**Governing Specification:** [`functional_specification_002.md`](../../functional_specification_002.md)  
**Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)  
**Run Identifier:** `20261008T171503-167-otk6`  
**Execution Node:** `wayfinder-test-plan`  
**Status:** Canonical Test Plan Locked; Zero Test Code Generated (`INV-BOUNDARY-01` Enforced)

---

## 1. Master Integration Test Matrix

| Component Path & Target Selector | Governing Ticket & Specification | Governing Codebase Schema | Admissible Input Payloads (`INV-PAYLOAD-01`) | Measurable Oracle / `{correct required outputs}` (`INV-ASSERTION-01`) | Explicit Failure States / `{errors}` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [`css/styles.css`](../../css/styles.css#L123-L130)<br>`.btn-group` | [Ticket 001](./tickets/ticket-001.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-002 § 2.2, § 5.2, § 5.3 | `ComputedStylePayload`:<br>- `display`<br>- `flexWrap`<br>- `gap`<br>- `width`<br>- `position`<br>- `zIndex` | Observed DOM container in `.card` across desktop (`1920x1080`), constrained laptop (`1280x800`), tablet (`1024x768`, `768x1024`), and mobile (`375x667`). | 1. `display === "flex"`<br>2. `flexWrap === "wrap"`<br>3. `gap === "9.6px"` (or `0.6rem`)<br>4. `width === "100%"` (fills inner card width)<br>5. `zIndex === "10"`<br>6. Wraps child buttons to multiple rows when horizontal space is constrained | 1. `flexWrap === "nowrap"` (forces horizontal squeeze)<br>2. `gap > 10px` (wastes horizontal space)<br>3. Width overflow beyond card inner padding |
| [`css/styles.css`](../../css/styles.css#L131-L153)<br>`.btn` | [Ticket 002](./tickets/ticket-002.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-002 § 2.1, § 2.3, § 5.1 | `DOMElementLayoutPayload`,<br>`ComputedStylePayload`:<br>- `scrollWidth`<br>- `clientWidth`<br>- `paddingTop/Right/Bottom/Left`<br>- `whiteSpace`<br>- `minWidth`<br>- `boxSizing`<br>- `display`<br>- `textAlign` | Observed `.btn` elements in `#projects`; all viewport presets. | 1. `scrollWidth <= clientWidth` on every `.btn`<br>2. `paddingLeft === "12px"` and `paddingRight === "12px"` (`0.75rem`)<br>3. `whiteSpace === "nowrap"`<br>4. `minWidth === "max-content"`<br>5. `boxSizing === "border-box"`<br>6. `display === "inline-flex"` with centered alignment | 1. `scrollWidth > clientWidth` (text clipping / overflow)<br>2. `paddingRight > 16px` (excessive padding)<br>3. `whiteSpace !== "nowrap"` (mid-word breaks) |
| [`css/styles.css`](../../css/styles.css#L154-L159)<br>`button.btn` | [Ticket 002](./tickets/ticket-002.md), [Ticket 004](./tickets/ticket-004.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-002 § 2.3, § 3.3 | `ComputedStylePayload`:<br>- `cursor`<br>- `fontFamily`<br>- `boxSizing` | Observed `<button class="btn">` modal triggers on `OBJ-01`, `OBJ-02`, `OBJ-03`, `OBJ-04`. | 1. `cursor === "pointer"`<br>2. `boxSizing === "border-box"`<br>3. Visual styles and dimensions match anchor buttons identically | 1. Box model mismatch between `<button>` and `<a>`<br>2. Default button margin or padding overriding normalized rules |
| [`index.html`](../../index.html#L183-L186)<br>`OBJ-01` Card Buttons (`LIVE_DEMO` + `WHITE_PAPER`) | [Ticket 001](./tickets/ticket-001.md), [Ticket 002](./tickets/ticket-002.md), [Ticket 003](./tickets/ticket-003.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-002 § 1, § 2.1, § 4.2, § 5.1 | `ButtonContentPayload`,<br>`DOMElementLayoutPayload`,<br>`BoundingClientRectPayload` | Observed card `OBJ-01`; longest label pair stress test (`WHITE_PAPER` = 11 chars, `LIVE_DEMO` = 9 chars). | 1. Button 1: text `"LIVE_DEMO"`, length 9, trailing `"O"` intact<br>2. Button 2: text `"WHITE_PAPER"`, length 11, trailing `"ER"` intact<br>3. On 1280px laptop (inner width 232px): `WHITE_PAPER` wraps to row 2 cleanly<br>4. Both buttons have `scrollWidth <= clientWidth`<br>5. Bounding rects contained strictly within `OBJ-01` card bounds | 1. Text rendered as `"LIVE_DEM"` or `"WHITE_PAR"`<br>2. Letters clipped by button border<br>3. Button bleeding outside card boundaries |
| [`index.html`](../../index.html#L220-L225)<br>`OBJ-02` Card Buttons (`LIVE_DEMO` + `SRC_CODE`) | [Ticket 002](./tickets/ticket-002.md), [Ticket 005](./tickets/ticket-005.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-002 § 2.1, § 5.1 | `ButtonContentPayload`,<br>`DOMElementLayoutPayload`,<br>`BoundingClientRectPayload` | Observed card `OBJ-02`; `LIVE_DEMO` (9 chars) + `SRC_CODE` (8 chars). | 1. Button 1: text `"LIVE_DEMO"`, length 9<br>2. Button 2: text `"SRC_CODE"`, length 8, comfortable margins<br>3. `scrollWidth <= clientWidth` on both buttons<br>4. Side-by-side on wide screens; wraps gracefully on narrow viewports | 1. Text rendered as `"LIVE_DEM"` or `"SRC_COD"`<br>2. `SRC_CODE` cramped against borders<br>3. Clipping at any breakpoint |
| [`index.html`](../../index.html#L302-L307)<br>`OBJ-03` Card Buttons (`LIVE_DEMO` + `SRC_CODE`) | [Ticket 002](./tickets/ticket-002.md), [Ticket 005](./tickets/ticket-005.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-002 § 2.1, § 5.1 | `ButtonContentPayload`,<br>`DOMElementLayoutPayload`,<br>`BoundingClientRectPayload` | Observed card `OBJ-03`; `LIVE_DEMO` (9 chars) + `SRC_CODE` (8 chars). | 1. Button 1: text `"LIVE_DEMO"`, length 9<br>2. Button 2: text `"SRC_CODE"`, length 8<br>3. `scrollWidth <= clientWidth` on both buttons<br>4. Strict containment inside `OBJ-03` card bounds | 1. Text clipping or character loss<br>2. Overflow beyond card boundary |
| [`index.html`](../../index.html#L153-L158)<br>`OBJ-04` Card Buttons (`LIVE_DEMO` + `SRC_CODE`) | [Ticket 002](./tickets/ticket-002.md), [Ticket 005](./tickets/ticket-005.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-002 § 2.1, § 5.1 | `ButtonContentPayload`,<br>`DOMElementLayoutPayload`,<br>`BoundingClientRectPayload` | Observed card `OBJ-04`; `LIVE_DEMO` (9 chars) + `SRC_CODE` (8 chars). | 1. Button 1: text `"LIVE_DEMO"`, length 9<br>2. Button 2: text `"SRC_CODE"`, length 8<br>3. `scrollWidth <= clientWidth` on both buttons<br>4. Strict containment inside `OBJ-04` card bounds | 1. Text clipping or character loss<br>2. Overflow beyond card boundary |
| [`css/styles.css`](../../css/styles.css#L103)<br>`.grid` | [Ticket 003](./tickets/ticket-003.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-002 § 3.2, § 4.1 | `ComputedStylePayload`,<br>`BoundingClientRectPayload` | Multi-column grid container; viewports 1920px down to 375px. | 1. 4 columns at 1920px/1440px/1280px<br>2. 3 columns at 1024px<br>3. 1 column at 768px/375px<br>4. `document.documentElement.scrollWidth <= window.innerWidth` across all viewports | 1. Grid structure collapse<br>2. Unwanted horizontal page scrolling (`scrollWidth > innerWidth`) |
| [`css/styles.css`](../../css/styles.css#L110-L115)<br>`.card` | [Ticket 003](./tickets/ticket-003.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-002 § 2.2.1, § 3.2, § 5.3 | `BoundingClientRectPayload`,<br>`ComputedStylePayload` | All 4 project cards; comparison with child `.btn-group` and `.btn` bounds. | 1. Card interior padding is 1.5rem (`24px`)<br>2. For every `.btn`: `rect(btn).left >= rect(card).left + 23px` and `rect(btn).right <= rect(card).right - 23px`<br>3. Corner hover pseudo-elements (`.card::before`, `.card::after`) remain functional | 1. Button overlapping card border<br>2. Button bleeding into neighboring card<br>3. Card layout or animation distortion |
| [`js/modal-logic.js`](../../js/modal-logic.js) & [`index.html`](../../index.html)<br>Interactive Handlers | [Ticket 004](./tickets/ticket-004.md), [Ticket 006](./tickets/ticket-006.md)<br>FS-002 § 3.3, § 5.4 | `ButtonInteractionPayload` | Dispatch `click` event on all 8 buttons. | 1. `OBJ-01 LIVE_DEMO`: triggers `openMediaModal()`<br>2. `OBJ-01 WHITE_PAPER`: triggers `openPDFModal()`<br>3. `OBJ-02 LIVE_DEMO`: triggers `openTerminal(url, true)`<br>4. `OBJ-02 SRC_CODE`: anchor has valid HuggingFace `href` + `target="_blank"`<br>5. `OBJ-03 LIVE_DEMO`: triggers `openTerminal(url, true)`<br>6. `OBJ-03 SRC_CODE`: anchor has valid GitHub `href` + `target="_blank"`<br>7. `OBJ-04 LIVE_DEMO`: triggers `openTerminal04(url, true)`<br>8. `OBJ-04 SRC_CODE`: anchor has valid HuggingFace `href` + `target="_blank"` | 1. Unhandled JS exceptions on click<br>2. Modal failing to open<br>3. Anchor missing `target="_blank"` |

---

## 2. Multi-Viewport Boundary Matrix & Reflow Checkpoints

| Preset Identifier | Viewport (WxH) | Target Grid Columns | Card Inner Width ($W_{\text{inner}}$) | Required Behavior for `OBJ-01` (`LIVE_DEMO` + `WHITE_PAPER`) | Required Behavior for `OBJ-02`–`04` (`LIVE_DEMO` + `SRC_CODE`) | Page Scroll Check |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **VP-01: Full HD Desktop** | 1920 x 1080 | 4 columns | ~280px–310px | $W_{\text{inner}} \ge 251.6\text{px} \implies$ side-by-side or cleanly wrapped; 0 glyphs clipped | $W_{\text{inner}} \ge 221.6\text{px} \implies$ side-by-side; 0 glyphs clipped | `scrollWidth <= 1920` |
| **VP-02: Standard Desktop** | 1440 x 900 | 4 columns | ~260px–285px | $W_{\text{inner}} \ge 251.6\text{px} \implies$ side-by-side; 0 glyphs clipped | Side-by-side; 0 glyphs clipped | `scrollWidth <= 1440` |
| **VP-03: Constrained Laptop** | 1280 x 800 | 4 columns | ~232px | $W_{\text{inner}} < 251.6\text{px} \implies$ `flex-wrap: wrap` wraps `WHITE_PAPER` to row 2; both buttons expand cleanly; 0 glyphs clipped | $W_{\text{inner}} \ge 221.6\text{px} \implies$ side-by-side; 0 glyphs clipped | `scrollWidth <= 1280` |
| **VP-04: Tablet Landscape** | 1024 x 768 | 3 columns | ~250px–280px | Side-by-side or clean wrap; 0 glyphs clipped | Side-by-side; 0 glyphs clipped | `scrollWidth <= 1024` |
| **VP-05: Tablet Portrait** | 768 x 1024 | 1 column | ~670px | Single column cards; side-by-side with generous margin; 0 glyphs clipped | Side-by-side with generous margin; 0 glyphs clipped | `scrollWidth <= 768` |
| **VP-06: Mobile Portrait** | 375 x 667 | 1 column | ~295px | $W_{\text{inner}} \ge 251.6\text{px} \implies$ side-by-side or wrapped; strictly contained; 0 glyphs clipped | Side-by-side or wrapped; 0 glyphs clipped | `scrollWidth <= 375` |
| **VP-07: 200% Zoom Check** | 1280 x 800 @ 200% | Reflow | Effective ~640px / 1 col | Stacked/wrapped rows; full text visibility; zero horizontal boundary bleed | Stacked/wrapped rows; full text visibility; zero bleed | No horizontal overflow |

---

## 3. Test Execution Architecture & Zero Mocks Protocol

### 3.1 Invariant Enforcement
1. **Zero Mocks Mandate (`INV-PAYLOAD-01`):**
   - No mock stylesheets, fake DOM objects, or synthetic JSON payloads.
   - All tests execute directly against authentic DOM elements mounted by [`index.html`](../../index.html) and styled by [`css/styles.css`](../../css/styles.css).
2. **Deterministic Layout Oracles (`INV-ASSERTION-01`):**
   - Text clipping is objectively evaluated via `scrollWidth <= clientWidth`.
   - String integrity is checked by exact character count and exact string equality against the functional specification.
   - Containment is evaluated using real bounding client rect coordinates.
3. **Fail-Fast Boundary (`INV-FAILFAST-01`):**
   - Any assertion failure surfaces the exact CSS selector, card identifier, expected schema property, and observed value immediately.
4. **Implementation Coding Gate (`INV-BOUNDARY-01`):**
   - Zero executable test code, fixtures, or runners are written in this session. Coding waits on an empty frontier and explicit operator authorization.

---

## 4. Downstream Handoff Guidance

This matrix provides the complete, authoritative specification for downstream integration testing. When authorized by the operator:
- Test implementations should be written against a headless browser engine (such as Playwright, Puppeteer, or Cypress) capable of computing layout styles, resizing viewports, and evaluating DOM bounding rects.
- No additional design decisions, schema inventions, or payload synthesis will be required.
