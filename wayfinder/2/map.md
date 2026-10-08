# Map 2: Remove CNN OBJ Section

**Governing Specification:**
- [`wayfinder/2/spec.md`](./spec.md) (Remove CNN OBJ Section)
- Upstream: GitHub Issue #2 (`Remove the CNN OBJ section entirely.`)

**Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)  
**Run Identifier:** `2`  
**Execution Node:** `wayfinder-test-plan`  
**Status:** Canonical Plan & Integration Test Plan Locked; Zero Architectural Ambiguity (Tickets 001–005 Resolved, Master Matrix & Test Matrix Synthesized)

---

## 1. Destination

Establish a complete, deterministic, and verified decision set detailing every file lifecycle, transformation, and verification requirement across the codebase to implement and verify the complete removal of the CNN OBJ section specified in GitHub Issue #2:
1. **DOM Element Removal for CNN OBJ-03 Card in `index.html` (Ticket 001):** Completely delete `<article class="card" id="obj-03-card">...</article>` (lines 228–308) from `<section id="projects"><div class="grid">`, leaving the remaining 3 cards (`OBJ-04`, `OBJ-01`, `OBJ-02`) and grid container tags intact.
2. **Modular Component File Lifecycle and Deletion of `card-cnn.html` (Ticket 002):** Delete the standalone component template `components/cards/card-cnn.html` from the repository filesystem (`git rm`), ensuring no dead component files remain.
3. **Pruning Dedicated VIZ-03 Kernel Scanner CSS Rules from Stylesheets (Ticket 003):** Prune the dedicated `/* VIZ-03: CNN KERNEL SCANNER */` CSS rules and `@keyframes cnn-stride` from `css/animations.css` and `css/modal.css` without disrupting adjacent styles or animations.
4. **Deterministic Verification Oracles and System Integrity Checks for CNN OBJ Removal (Ticket 004):** Formalize deterministic assertions checking DOM absence, component template deletion, keyword eradication, preservation of the 3 remaining cards, stylesheet pruning, and repository non-regression.
5. **Integration Test Decision Mapping, Payload Admissibility Governance & Verification Architecture for CNN OBJ Removal (Ticket 005):** Formalize authentic codebase schemas (`DOMTreePayload`, `FileStatPayload`, `StylesheetContentPayload`, `ContentSearchPayload`, `GitWorkingTreePayload`, `PipelineManifestPayload`), admissible observed payloads under Payload Law with zero mocks (`INV-PAYLOAD-01`), deterministic verification oracles (`INV-ASSERTION-01`), explicit failure modes (`{errors}`), and synthesize the Authoritative Integration Test Matrix (`test-matrix.md`).

---

## 2. Notes & Architectural Foundation

### 2.1 Codebase Analysis & Workspace State
- **Target Call-Sites:**
  - `index.html` (lines 228–308): Live DOM container `#obj-03-card`.
  - `components/cards/card-cnn.html`: Modular component file.
  - `css/animations.css` (lines 50–59): Dedicated `.viz-cnn` and `@keyframes cnn-stride` rules.
  - `css/modal.css` (lines 50–59): Duplicate `.viz-cnn` and `@keyframes cnn-stride` rules.
- **Current Workspace State:**
  - The CNN OBJ section has been completely excised across `index.html`, `components/cards/card-cnn.html`, `css/animations.css`, and `css/modal.css`.
  - The projects grid hosts strictly 3 cards: `OBJ-04`, `OBJ-01`, and `OBJ-02`.
  - The responsive CSS grid layout rule `.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 4rem; }` automatically balances the 3 remaining cards.
- **Pipeline Integration:**
  - Subsequent pipeline nodes (`scanners`, `implementer`, `reviewer`, `tester`, `merger`) discover planned tickets, maps, and target components via the bounded manifest comment on GitHub Issue #2.

### 2.2 Invariant Guarantees
- **`INV-DOM-REMOVAL`:** Complete excision of `#obj-03-card` DOM element and child nodes from `index.html`.
- **`INV-FILE-DELETE`:** Complete deletion of `components/cards/card-cnn.html` from the repository.
- **`INV-CSS-PRUNE`:** Clean removal of `.viz-cnn`, `.cnn-pixel`, `.cnn-scanner`, and `@keyframes cnn-stride` from `css/animations.css` and `css/modal.css`.
- **`INV-PRESERVE-REMAINING`:** Preservation of identifiers, markup, and functionality for `OBJ-04`, `OBJ-01`, and `OBJ-02`.
- **`INV-GRID-INTEGRITY`:** Preservation of valid `.grid` container closing tags.
- **`INV-ZERO-REGRESSION`:** Codebase modifications are strictly bounded to the authorized target files.
- **`INV-PAYLOAD-01`:** Only authentic codebase schemas and live telemetry are admissible. Zero mocks.
- **`INV-ASSERTION-01`:** All assertions evaluate deterministically against specification oracles.
- **`INV-BOUNDARY-01`:** Strict "DO NOT CODE YET" gate enforced prior to authorization.

---

## 3. Decisions So Far & Ticket Registry

- **[Ticket 001: DOM Element Removal for CNN OBJ-03 Card in index.html](./tickets/ticket-001.md)** — Resolved. Locked deletion of `<article class="card" id="obj-03-card">...</article>` (lines 228–308) from `index.html`, preserving container tags and preceding cards.
- **[Ticket 002: Modular Component File Lifecycle and Deletion of card-cnn.html](./tickets/ticket-002.md)** — Resolved. Locked permanent deletion of `components/cards/card-cnn.html` from repository filesystem.
- **[Ticket 003: Pruning Dedicated VIZ-03 Kernel Scanner CSS Rules from Stylesheets](./tickets/ticket-003.md)** — Resolved. Locked pruning of `/* VIZ-03: CNN KERNEL SCANNER */` block (lines 50–59) from both `css/animations.css` and `css/modal.css`.
- **[Ticket 004: Deterministic Verification Oracles and System Integrity Checks for CNN OBJ Removal](./tickets/ticket-004.md)** — Resolved. Locked 6 deterministic verification oracles (DOM absence, file deletion, keyword eradication, card count strictly 3, CSS dead-code pruning, repo non-regression).
- **[Ticket 005: Integration Test Decision Mapping, Payload Admissibility Governance & Verification Architecture for CNN OBJ Removal](./tickets/ticket-005.md)** — Resolved. Locked authentic codebase schemas, admissible observed payloads without mocks (`INV-PAYLOAD-01`), deterministic verification oracles (`INV-ASSERTION-01`), explicit failure modes (`{errors}`), and synthesized the Authoritative Integration Test Matrix (`test-matrix.md`).

---

## 4. Not Yet Specified

*(All functional requirements, file transformation specifications, verification oracles, and integration test decision mappings for this run have been charted and fully resolved. Zero fog remains.)*

---

## 5. Out of Scope

- Renumbering or altering the identifiers of remaining project cards (`OBJ-04`, `OBJ-01`, `OBJ-02`).
- Modifying interactive modal handlers, chatbox widget scripts, or Three.js hero animations.
- Modifying Sandcastle pipeline scripts or workflow configurations under `.sandcastle/`.
- Authoring executable test code, test fixtures, parsers, or mock files prior to explicit operator authorization (`INV-BOUNDARY-01`).
