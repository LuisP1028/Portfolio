# Functional Specification: Remove CNN OBJ Section (GitHub Issue #2)

**Governing Source:** GitHub Issue #2 (`Remove the CNN OBJ section entirely.`)  
**Run Identifier:** `2`  
**Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)  
**Status:** Canonical Authoritative Specification Locked  

---

## 1. Problem Definition & Operational Context

The portfolio deployed units grid (`#projects .grid`) currently displays project cards representing live systems and prototypes:
- `OBJ-04`: Digital Twin Platodoom (`#obj-04-card`)
- `OBJ-01`: State Space Model with Bayesian Inference (`.card`)
- `OBJ-02`: Options Dealer Positioning (`.card`)
- `OBJ-03`: Convolutional Neural Network for Malware Detection (`#obj-03-card`)

As specified in GitHub Issue #2, the system requirement is to **Remove the CNN OBJ section entirely**.

To achieve complete eradication without lingering dead code, layout regressions, or broken dependencies, the removal must encompass:
1. The DOM container element `#obj-03-card` within `index.html`.
2. The standalone component template file `components/cards/card-cnn.html`.
3. Dedicated CSS styling and animation rules for the CNN kernel scanner visualizer (`VIZ-03`) across `css/animations.css` and `css/modal.css`.
4. Verification that the remaining project cards (`OBJ-04`, `OBJ-01`, `OBJ-02`) and the portfolio grid continue to render and function cleanly.

---

## 2. Functional Requirements & Desired Behavior

1. **Complete DOM Element Removal (`index.html`):**
   - The `<article class="card" id="obj-03-card">...</article>` element (lines 228–308) must be completely excised from `<section id="projects"><div class="grid">`.
   - No remnant markup, empty placeholder nodes, or orphaned comments for OBJ-03 shall remain in `index.html`.
2. **Component File Lifecycle & Deletion (`components/cards/card-cnn.html`):**
   - The modular component file `components/cards/card-cnn.html` must be deleted from the repository.
   - Associated sibling component templates (`components/cards/card-ssm.html` and `components/cards/card-gex.html`) must remain intact and unmodified.
3. **Dedicated Stylesheet Pruning (`css/animations.css` & `css/modal.css`):**
   - The dedicated `/* VIZ-03: CNN KERNEL SCANNER */` CSS rules (`.viz-cnn`, `.cnn-pixel`, `.cnn-scanner`, and `@keyframes cnn-stride`) must be removed from both `css/animations.css` and `css/modal.css`.
   - Shared styles, keyframes for other components (`@keyframes gex-breathe`, etc.), and structural styles must remain unaltered.
4. **Preservation of Remaining Project Cards & Layout Integrity:**
   - The remaining project cards (`OBJ-04`, `OBJ-01`, `OBJ-02`) must preserve their full markup, identifiers, visual elements, and button triggers (`LIVE_DEMO`, `SRC_CODE`, `WHITE_PAPER`).
   - The responsive CSS grid layout (`.grid` with `repeat(auto-fit, minmax(280px, 1fr))`) must cleanly accommodate the 3 remaining cards without manual dimension overrides or synthetic wrappers.

---

## 3. Constraints & Boundary Conditions

- **No Renumbering or Identifier Mutation:** The remaining cards (`OBJ-04`, `OBJ-01`, `OBJ-02`) retain their existing identifiers, classes, and positions. No artificial renumbering (e.g. Renaming OBJ-04 to OBJ-03) is permitted.
- **Strict Scope Boundaries:** No modifications to un-scoped components, background scripts, chatbox widgets, navigation headers, or third-party libraries.
- **Fail-Fast & Zero Hack Fixes:** No CSS hiding via `display: none` or `visibility: hidden` to mask the element. The removal must be physical and architectural at the DOM, file, and stylesheet source levels.
- **Visual Assets:** Visual assets for run 2 live under `assets/2/`. Because this run specifies component removal without image generation or asset consumption, `assets/2/` is a no-op.

---

## 4. Acceptance Criteria & {correct required outputs}

1. **DOM Absence:** `document.getElementById('obj-03-card')` evaluates to `null` in `index.html`.
2. **Content Absence:** Zero occurrences of CNN Malware text or URLs (`CONVOLUTIONAL NEURAL NETWORK FOR MALWARE DETECTION`, `https://choppedcheese-choppedcnnmalware.hf.space`, `https://github.com/LuisP1028/CNN-Virus-Scanner`) in `index.html`.
3. **Filesystem Absence:** `components/cards/card-cnn.html` does not exist on disk.
4. **CSS Pruning:** Zero occurrences of `.viz-cnn`, `.cnn-scanner`, or `@keyframes cnn-stride` in `css/animations.css` and `css/modal.css`.
5. **Non-Regression:** All 3 remaining project cards (`#obj-04-card`, `OBJ-01`, `OBJ-02`) exist, render their titles and interactive buttons, and trigger expected modals/navigation.
