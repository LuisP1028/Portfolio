# Master Component-to-Edit Matrix: Project Card Action Button Text Rendering & Layout Preservation

**Governing Specification:**
- [`functional_specification_002.md`](../../functional_specification_002.md) (Project Card Action Button Text Rendering & Layout Preservation)

**Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)  
**Run Identifier:** `20261008T171503-167-otk6`  
**Execution Node:** `wayfinder-read-and-plan`  
**Status:** Canonical Plan Locked; Zero Architectural Ambiguity

---

## 1. Master Component-to-Edit Matrix

| Component Path | Target Lines / Symbols | Governing Ticket | Nature of Transformation | Invariants & Contracts Locked |
| :--- | :--- | :--- | :--- | :--- |
| [`css/styles.css`](../../css/styles.css#L123) | `.btn-group` (Line 123) | [Ticket 001](./tickets/ticket-001.md) | Add `flex-wrap: wrap;`, adjust gap to `0.6rem`, add `width: 100%;`. | `INV-FLEX-WRAP`: Enables graceful wrapping to multiple lines when space is constrained; prevents flex item compression against card bounds. |
| [`css/styles.css`](../../css/styles.css#L124-L126) | `.btn`, `button.btn` (Lines 124–126) | [Ticket 002](./tickets/ticket-002.md), [Ticket 004](./tickets/ticket-004.md) | Adjust padding to `0.5rem 0.75rem`; add `white-space: nowrap; min-width: max-content; flex: 1 1 auto; box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; text-align: center;`. | `INV-ZERO-TRUNC`: Eliminates trailing character clipping (`LIVE_DEM`, `WHITE_PAR`); centers text cleanly within button surface; unifies `<button>` and `<a>` styling. |
| [`css/styles.css`](../../css/styles.css#L103) | `.grid` (Line 103) | [Ticket 003](./tickets/ticket-003.md) | Audit target: verify `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;`. | `INV-GRID-CONTAIN`: Preserves responsive 4-column desktop grid down to single-column mobile. |
| [`css/styles.css`](../../css/styles.css#L110-L115) | `.card` (Lines 110–115) | [Ticket 003](./tickets/ticket-003.md) | Audit target: verify `padding: 1.5rem;` and corner hover pseudo-elements (`.card::before`, `.card::after`). | `INV-CARD-CONTAIN`: Preserves card boundaries, proportions, and hover corner animations without alteration. |
| [`index.html`](../../index.html#L153-L158) | OBJ-04 `.btn-group` (Lines 153–158) | [Ticket 004](./tickets/ticket-004.md), [Ticket 005](./tickets/ticket-005.md) | Audit target: verify `LIVE_DEMO` (`openTerminal04`) and `SRC_CODE` anchor link. | `INV-NAV-PRESERVE`: Preserves terminal execution and Hugging Face repository navigation. |
| [`index.html`](../../index.html#L183-L186) | OBJ-01 `.btn-group` (Lines 183–186) | [Ticket 004](./tickets/ticket-004.md), [Ticket 005](./tickets/ticket-005.md) | Audit target: verify `LIVE_DEMO` (`openMediaModal`) and `WHITE_PAPER` (`openPDFModal`). | `INV-NAV-PRESERVE`: Preserves media modal and PDF modal viewer invocations. |
| [`index.html`](../../index.html#L220-L225) | OBJ-02 `.btn-group` (Lines 220–225) | [Ticket 004](./tickets/ticket-004.md), [Ticket 005](./tickets/ticket-005.md) | Audit target: verify `LIVE_DEMO` (`openTerminal`) and `SRC_CODE` anchor link. | `INV-NAV-PRESERVE`: Preserves terminal invocation and Hugging Face repository navigation. |
| [`index.html`](../../index.html#L302-L307) | OBJ-03 `.btn-group` (Lines 302–307) | [Ticket 004](./tickets/ticket-004.md), [Ticket 005](./tickets/ticket-005.md) | Audit target: verify `LIVE_DEMO` (`openTerminal`) and `SRC_CODE` anchor link. | `INV-NAV-PRESERVE`: Preserves terminal invocation and GitHub repository navigation. |

---

## 2. Detailed Component Transformation Specifications

### 2.1 File: `css/styles.css`

#### Edit 1: Button Group Flex Container Reflow
- **Target Line Range:** Line 123
- **Existing Code:**
  ```css
  .btn-group { display: flex; gap: 1rem; position: relative; z-index: 10; }
  ```
- **Replacement Code:**
  ```css
  .btn-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      width: 100%;
      position: relative;
      z-index: 10;
  }
  ```
- **Rationale & Invariants:**
  - `flex-wrap: wrap;` prevents child buttons from being forcefully compressed into a single line when card width is narrow.
  - `gap: 0.6rem;` equalizes row and column spacing, saving horizontal space while maintaining visual rhythm.
  - `width: 100%;` constrains the group strictly within `.card` interior padding.

#### Edit 2: Button Box Model, Padding Normalization & Centering
- **Target Line Range:** Lines 124–126
- **Existing Code:**
  ```css
  .btn { background: transparent; border: 1px solid var(--text-main); color: var(--text-main); padding: 0.5rem 1.5rem; font-family: var(--font-display); font-weight: 700; text-decoration: none; position: relative; overflow: hidden; transition: 0.2s; font-size: 0.9rem; cursor: pointer; }
  .btn:hover { background: var(--accent); border-color: var(--accent); color: #000; box-shadow: 0 0 15px var(--accent); }
  button.btn { cursor: pointer; font-family: var(--font-display); font-size: 0.9rem; }
  ```
- **Replacement Code:**
  ```css
  .btn {
      background: transparent;
      border: 1px solid var(--text-main);
      color: var(--text-main);
      padding: 0.5rem 0.75rem;
      font-family: var(--font-display);
      font-weight: 700;
      text-decoration: none;
      position: relative;
      overflow: hidden;
      transition: 0.2s;
      font-size: 0.9rem;
      cursor: pointer;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      flex: 1 1 auto;
      min-width: max-content;
      box-sizing: border-box;
  }
  .btn:hover { background: var(--accent); border-color: var(--accent); color: #000; box-shadow: 0 0 15px var(--accent); }
  button.btn {
      cursor: pointer;
      font-family: var(--font-display);
      font-size: 0.9rem;
      box-sizing: border-box;
  }
  ```
- **Rationale & Invariants:**
  - `padding: 0.5rem 0.75rem;` halves horizontal padding overhead from 48px to 24px per button, leaving ample space for all text glyphs.
  - `white-space: nowrap;` guarantees labels never break or wrap mid-word.
  - `min-width: max-content;` ensures flexbox cannot compress the button narrower than its text content.
  - `flex: 1 1 auto;` causes wrapped buttons to stretch symmetrically across the available row width.
  - `display: inline-flex; align-items: center; justify-content: center; text-align: center;` unifies presentation across `<button>` and `<a>` tags.

---

## 3. Mathematical Box Model & Reflow Proof

1. **Card Inner Content Width ($W_{\text{inner}}$):**
   $$W_{\text{inner}} = W_{\text{card}} - 2 \times 24\text{px} = W_{\text{card}} - 48\text{px}$$
2. **Button Natural Widths ($W_{\text{btn}}$):**
   - $W(\text{LIVE\_DEMO}) \approx 85\text{px} (\text{text}) + 24\text{px} (\text{padding}) + 2\text{px} (\text{border}) = 111\text{px}$
   - $W(\text{WHITE\_PAPER}) \approx 105\text{px} (\text{text}) + 24\text{px} (\text{padding}) + 2\text{px} (\text{border}) = 131\text{px}$
   - $W(\text{SRC\_CODE}) \approx 75\text{px} (\text{text}) + 24\text{px} (\text{padding}) + 2\text{px} (\text{border}) = 101\text{px}$
3. **Side-by-Side Required Widths ($W_{\text{required}}$):**
   - OBJ-01: $111\text{px} + 131\text{px} + 9.6\text{px} (\text{gap}) = 251.6\text{px}$
   - OBJ-02, OBJ-03, OBJ-04: $111\text{px} + 101\text{px} + 9.6\text{px} (\text{gap}) = 221.6\text{px}$
4. **Behavior on Constrained Desktop Viewport ($W_{\text{card}} = 280\text{px}, W_{\text{inner}} = 232\text{px}$):**
   - For OBJ-01: $251.6\text{px} > 232\text{px} \implies$ `flex-wrap: wrap` activates.
     - Row 1: `LIVE_DEMO` renders at width $232\text{px}$ (centered).
     - Row 2: `WHITE_PAPER` renders at width $232\text{px}$ (centered).
     - Result: 0 characters clipped, 100% label visibility.
   - For OBJ-02, OBJ-03, OBJ-04: $221.6\text{px} \le 232\text{px} \implies$ buttons sit side-by-side cleanly within container.
5. **Behavior on Mobile Viewport ($W_{\text{card}} = 343\text{px}, W_{\text{inner}} = 295\text{px}$):**
   - For all cards: $W_{\text{required}} \le 295\text{px} \implies$ buttons sit side-by-side or wrap gracefully under user zoom without horizontal overflow.

---

## 4. Verification & Testing Oracles Table

| Oracle ID | Verification Target | Deterministic Assertion | Pass Condition |
| :--- | :--- | :--- | :--- |
| **ORACLE-01** | Zero Text Clipping | `btn.scrollWidth <= btn.clientWidth` on every `.btn` | True for all 8 buttons across all 4 cards |
| **ORACLE-02** | Exact String Fidelity | `LIVE_DEMO` (9 chars), `WHITE_PAPER` (11 chars), `SRC_CODE` (8 chars) | All glyphs present; trailing letters intact |
| **ORACLE-03** | Card Interior Containment | `rect(btn).left >= rect(card).left && rect(btn).right <= rect(card).right` | All buttons strictly within parent card bounds |
| **ORACLE-04** | Responsive Viewports | Test at 1920px, 1440px, 1280px, 1024px, 768px, 375px | Zero text clipping and zero horizontal page scroll |
| **ORACLE-05** | Functional Interaction | Click dispatch on `LIVE_DEMO`, `WHITE_PAPER`, `SRC_CODE` | Modals open; external repos open in new tabs |
