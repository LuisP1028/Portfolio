---
ticket_id: "005"
title: "Integration Test Decision Mapping, Payload Admissibility Governance & Verification Architecture for CNN OBJ Removal"
type: task
status: resolved
claimed_by: "wayfinder-test-plan"
blocked_by:
  - "[Ticket 001: DOM Element Removal for CNN OBJ-03 Card in index.html](./ticket-001.md)"
  - "[Ticket 002: Modular Component File Lifecycle and Deletion of card-cnn.html](./ticket-002.md)"
  - "[Ticket 003: Pruning Dedicated VIZ-03 Kernel Scanner CSS Rules from Stylesheets](./ticket-003.md)"
  - "[Ticket 004: Deterministic Verification Oracles and System Integrity Checks for CNN OBJ Removal](./ticket-004.md)"
governing_specification: "wayfinder/2/spec.md"
---

# Ticket 005: Integration Test Decision Mapping, Payload Admissibility Governance & Verification Architecture for CNN OBJ Removal

## Question
How should integration testing for the complete removal of the CNN OBJ section across `index.html`, `components/cards/card-cnn.html`, `css/animations.css`, and `css/modal.css` be structured across the repository? What authentic codebase schemas and admissible payloads govern its verification without mocks under Payload Law (`INV-PAYLOAD-01`)? What deterministic oracles define `{correct required outputs}` under Assertion Law (`INV-ASSERTION-01`)? How are explicit failure states (`{errors}`) surfaced without generating executable test code prior to explicit operator authorization (`INV-BOUNDARY-01`)?

## Context & Specification Grounding
- **Governing Specification:** [`wayfinder/2/spec.md`](../spec.md)
  - § 1 Problem Definition & Operational Context (Complete eradication of CNN OBJ section from deployed units grid without dead code or regressions).
  - § 2 Functional Requirements & Desired Behavior (§ 2.1 DOM element removal in `index.html`, § 2.2 Component file lifecycle & deletion of `components/cards/card-cnn.html`, § 2.3 Dedicated stylesheet pruning in `css/animations.css` and `css/modal.css`, § 2.4 Preservation of remaining project cards `OBJ-04`, `OBJ-01`, `OBJ-02` and responsive layout).
  - § 3 Constraints & Boundary Conditions (Zero renumbering of remaining cards, strict scope boundaries, physical architectural removal over CSS hiding, visual assets no-op).
  - § 4 Acceptance Criteria & `{correct required outputs}` (DOM absence, content absence, filesystem absence, CSS pruning, non-regression).
- **Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)
  - Strict definitions of `{errors}`, `{correctness}`, `{functionality}`, `{correct required outputs}`, `{sufficient}`, and `{insufficient}`.
  - Domain glossary: `{Project Cards / OBJ Boxes}`, `{Action Buttons / Button Groups}`, `{Label Truncation & Text Overflow}`.
- **Governing Upstream Manifests:**
  - Feature Planning manifest: [`wayfinder/2/spec.md`](../spec.md), [`wayfinder/2/tickets/ticket-001.md`](./ticket-001.md), [`wayfinder/2/tickets/ticket-002.md`](./ticket-002.md), [`wayfinder/2/tickets/ticket-003.md`](./ticket-003.md), [`wayfinder/2/tickets/ticket-004.md`](./ticket-004.md), [`wayfinder/2/matrix.md`](../matrix.md), [`wayfinder/2/map.md`](../map.md)
  - Implementer manifest: `components/cards/card-cnn.html`, `css/animations.css`, `css/modal.css`, `index.html` (with tickets 001, 002, 003, 004 marked CHANGED)
  - Reviewer manifest: `components/cards/card-cnn.html`, `css/animations.css`, `css/modal.css`, `index.html`
- **Target Components:**
  - `index.html`
  - `components/cards/card-cnn.html`
  - `css/animations.css`
  - `css/modal.css`

---

## Architectural Decisions to Lock

### 1. Component Boundaries & Integration Surface
Integration testing for this run verifies the complete, multi-layer physical eradication of the CNN OBJ component and the structural non-regression of the remaining portfolio assets without isolation mocks:
1. **DOM Tree & HTML Structure Domain:** Verification of `index.html`, confirming that `<article class="card" id="obj-03-card">` and its child container `#obj-03-content` are entirely absent from `<section id="projects"><div class="grid">`, while the container closing tags `</div>` and `</section>` remain structurally balanced.
2. **File System & Component Template Domain:** Verification of `components/cards/`, confirming that `card-cnn.html` does not exist on disk, while sibling templates `card-ssm.html` and `card-gex.html` remain present and intact.
3. **Stylesheet & Keyframe Animation Domain:** Verification of `css/animations.css` and `css/modal.css`, confirming that dedicated selectors (`.viz-cnn`, `.cnn-pixel`, `.cnn-scanner`) and keyframe rules (`@keyframes cnn-stride`) are completely excised while surrounding rules and CSS syntax remain valid.
4. **Content & Keyword Eradication Domain:** Verification that literal keyword strings associated with CNN Malware detection (`"CONVOLUTIONAL NEURAL NETWORK FOR MALWARE DETECTION"`, `"choppedcnnmalware"`, `"CNN-Virus-Scanner"`, `"obj-03"`) do not occur anywhere in `index.html` or active component files.
5. **Remaining Card Preservation Domain:** Verification that the 3 remaining project cards (`#obj-04-card`, `OBJ-01`, `OBJ-02`) retain their full identifiers, titles, descriptions, and interactive button groups (`LIVE_DEMO`, `SRC_CODE`, `WHITE_PAPER`) with zero mutation or artificial renumbering.
6. **Codebase Non-Regression Domain:** Verification that the working tree contains zero modifications outside the 4 authorized target files.
7. **State Machine Manifest Governance Domain:** Verification that upstream manifests (`wayfinder-read-and-plan`, `implementer`, `reviewer`) are non-empty, uncorrupted, and aligned with git commit history.

---

### 2. Codebase Schema Grounding (Zero Mocks Mandate)
Under Payload Law (`INV-PAYLOAD-01`), no synthetic JSON, dummy mock objects, or handwritten stand-in payloads are permitted. All tests execute against authentic codebase interfaces:

#### Schema 1: DOM Document Structure Schema (`DOMTreePayload`)
- `rawHTML`: String representing the full file content of `index.html`.
- `obj03ElementExists`: Boolean flag indicating whether `#obj-03-card` or `#obj-03-content` exists in the DOM.
- `projectCardCount`: Non-negative integer representing the total count of `.card` elements within `#projects .grid`.
- `projectCardIds`: Array of string identifiers present in `.card` elements (expected: `["obj-04-card", "OBJ-01", "OBJ-02"]`).
- `gridClosingTagPresent`: Boolean flag indicating whether `<div class="grid">` has a valid closing `</div>`.
- `sectionClosingTagPresent`: Boolean flag indicating whether `<section id="projects">` has a valid closing `</section>`.

#### Schema 2: Component File Stat & Presence Schema (`FileStatPayload`)
- `filePath`: String representing the repository-relative file path.
- `exists`: Boolean flag indicating whether the path exists on disk (`fs.existsSync(filePath)`).
- `isFile`: Boolean flag indicating whether the path is a regular file (`fs.statSync(filePath).isFile()`).
- `size`: Non-negative integer representing physical size in bytes.

#### Schema 3: Stylesheet Rule & Syntax Schema (`StylesheetContentPayload`)
- `filePath`: String literal (`"css/animations.css"` | `"css/modal.css"`).
- `rawContent`: String representing full textual content read directly from disk.
- `forbiddenSelectorsFound`: Array of matched forbidden strings (`[".viz-cnn", ".cnn-pixel", ".cnn-scanner", "cnn-stride"]`).
- `openBraceCount`: Non-negative integer count of `{` characters.
- `closeBraceCount`: Non-negative integer count of `}` characters.
- `isSyntaxBalanced`: Boolean flag indicating `openBraceCount === closeBraceCount`.

#### Schema 4: String Keyword Search Schema (`ContentSearchPayload`)
- `targetFile`: String representing the inspected file path.
- `forbiddenKeywords`: Array of strings (`["CONVOLUTIONAL NEURAL NETWORK FOR MALWARE DETECTION", "choppedcnnmalware", "CNN-Virus-Scanner"]`).
- `matches`: Array of objects detailing matched keyword, line number, and character offset.

#### Schema 5: Git Working Tree Status Schema (`GitWorkingTreePayload`)
- `statusOutput`: String output from `git status --porcelain`.
- `diffOutput`: String output from `git diff --stat HEAD~1` or between `origin/main` and `HEAD`.
- `touchedFiles`: Array of repository-relative file paths detected by Git.
- `authorizedFiles`: Array of allowable modified paths (`["components/cards/card-cnn.html", "css/animations.css", "css/modal.css", "index.html"]`).
- `appRegressionDetected`: Boolean flag indicating whether any file outside `authorizedFiles` was altered.

#### Schema 6: Pipeline State Transition & Manifest Schema (`PipelineManifestPayload`)
- `runId`: String identifier (`"2"`).
- `upstreamPlanManifest`: Array of paths (`["wayfinder/2/spec.md", "wayfinder/2/tickets/ticket-001.md", "wayfinder/2/tickets/ticket-002.md", "wayfinder/2/tickets/ticket-003.md", "wayfinder/2/tickets/ticket-004.md", "wayfinder/2/matrix.md", "wayfinder/2/map.md"]`).
- `upstreamImplementerManifest`: Array of lines (`["components/cards/card-cnn.html", "css/animations.css", "css/modal.css", "index.html", "components/cards/card-cnn.html CHANGED ticket-002", "components/cards/card-cnn.html CHANGED ticket-004", "css/animations.css CHANGED ticket-003", "css/animations.css CHANGED ticket-004", "css/modal.css CHANGED ticket-003", "css/modal.css CHANGED ticket-004", "index.html CHANGED ticket-001", "index.html CHANGED ticket-004"]`).
- `upstreamReviewerManifest`: Array of lines (`["components/cards/card-cnn.html", "css/animations.css", "css/modal.css", "index.html"]`).
- `testPlanManifest`: Array of paths (`["wayfinder/2/tickets/ticket-005.md"]`).

---

### 3. Admissible Payloads Under Payload Law (`INV-PAYLOAD-01`)
1. **Authentic File System Reads:** Payloads ingested by integration test routines must be read directly from the physical disk via Node.js `fs.readFileSync`, `fs.existsSync`, or `fs.statSync` against the repository working tree.
2. **Authentic DOM Parsing:** DOM queries must parse the authentic string read from `./index.html` without mocking DOM nodes or substituting synthetic HTML fixtures.
3. **Authentic Git Status Telemetry:** Working tree status must be queried directly from `git status --porcelain` and `git diff` against the actual repository tree.
4. **No Mock File Systems:** The use of `mock-fs`, virtual in-memory maps, or synthesized directory trees is strictly forbidden.
5. **No Synthesized Objects:** No synthetic dummy comments, fake manifests, or placeholder payloads may be passed into assertion routines.
6. **Sparse Property Preservation:** Unfilled optional properties must remain undefined; no artificial defaults may be injected.

---

### 4. Deterministic Integration Test Oracles (`INV-ASSERTION-01`)

Under Assertion Law, oracles evaluate `{correct required outputs}` strictly against the functional specification and ticket decisions:

#### Oracle 1: DOM Element & Identifier Excision (`ORACLE-DOM-EXCISION`)
Let $html = fs.readFileSync("index.html", "utf8")$.
$$html.includes("id=\"obj-03-card\"") = \text{false} \land html.includes("id=\"obj-03-content\"") = \text{false} \land html.includes("OBJ-03") = \text{false}$$
- **Pass Condition:** `index.html` contains zero occurrences of `id="obj-03-card"`, `id="obj-03-content"`, or `OBJ-03`.
- **Specification Source:** `wayfinder/2/spec.md` § 2.1, § 4.1; Ticket 001, Ticket 004.

#### Oracle 2: Modular Component File Absence & Sibling Preservation (`ORACLE-FILE-ABSENCE`)
$$fs.existsSync("components/cards/card-cnn.html") = \text{false} \land fs.existsSync("components/cards/card-ssm.html") = \text{true} \land fs.existsSync("components/cards/card-gex.html") = \text{true}$$
- **Pass Condition:** `components/cards/card-cnn.html` does not exist on disk, while sibling templates `card-ssm.html` and `card-gex.html` exist as regular files with `size > 0`.
- **Specification Source:** `wayfinder/2/spec.md` § 2.2, § 4.3; Ticket 002, Ticket 004.

#### Oracle 3: Stylesheet Rule Pruning & Syntax Integrity (`ORACLE-STYLESHEET-PRUNING`)
For each $file \in ["css/animations.css", "css/modal.css"]$:
Let $css = fs.readFileSync(file, "utf8")$.
$$css.includes(".viz-cnn") = \text{false} \land css.includes(".cnn-pixel") = \text{false} \land css.includes(".cnn-scanner") = \text{false} \land css.includes("cnn-stride") = \text{false}$$
$$\text{count}(css, "\{") = \text{count}(css, "\}")$$
- **Pass Condition:** Neither stylesheet contains any CNN visualizer selector or keyframe animation, and brace counts are exactly balanced.
- **Specification Source:** `wayfinder/2/spec.md` § 2.3, § 4.4; Ticket 003, Ticket 004.

#### Oracle 4: Keyword & External Resource Eradication (`ORACLE-KEYWORD-ERADICATION`)
For each $file \in ["index.html", "css/animations.css", "css/modal.css"]$:
Let $content = fs.readFileSync(file, "utf8")$.
$$content.includes("CONVOLUTIONAL NEURAL NETWORK FOR MALWARE DETECTION") = \text{false}$$
$$content.includes("choppedcnnmalware") = \text{false} \land content.includes("CNN-Virus-Scanner") = \text{false}$$
- **Pass Condition:** Zero occurrences of CNN Malware titles, Gradio HuggingFace URLs, or GitHub repository URLs across application files.
- **Specification Source:** `wayfinder/2/spec.md` § 4.2; Ticket 004.

#### Oracle 5: Remaining Project Cards Preservation & Count (`ORACLE-REMAINING-CARDS`)
In `index.html`:
Let $cards = \text{extractCards}(html, "\#projects .grid")$.
$$|cards| = 3$$
$$\text{hasCard}(cards, "obj-04-card") = \text{true} \land \text{hasCard}(cards, "OBJ-01") = \text{true} \land \text{hasCard}(cards, "OBJ-02") = \text{true}$$
- **Pass Condition:** The projects grid contains strictly 3 cards: `OBJ-04` (Digital Twin Platodoom), `OBJ-01` (State Space Model), and `OBJ-02` (Options Dealer Positioning), each retaining full titles and action buttons (`LIVE_DEMO`, `SRC_CODE`, `WHITE_PAPER`).
- **Specification Source:** `wayfinder/2/spec.md` § 2.4, § 3, § 4.5; Ticket 001, Ticket 004.

#### Oracle 6: Codebase & Working Tree Non-Regression (`ORACLE-NON-REGRESSION`)
$$\forall file \in TouchedApplicationFiles: file \in \{\text{"index.html"}, \text{"components/cards/card-cnn.html"}, \text{"css/animations.css"}, \text{"css/modal.css"}\}$$
- **Pass Condition:** Git status and diff touch exclusively the 4 authorized target files. Zero unintended modifications to JavaScript files (`js/*`), chatbox widget (`chatbox.html`), main styles (`css/styles.css`), or white paper assets.
- **Specification Source:** `wayfinder/2/spec.md` § 3, § 4 Acceptance Criteria; Ticket 004.

#### Oracle 7: Pipeline State Transition & Manifest Alignment (`ORACLE-MANIFEST-ALIGNMENT`)
$$|Manifest_{plan}| > 0 \land |Manifest_{implementer}| > 0 \land |Manifest_{reviewer}| > 0$$
- **Pass Condition:** Upstream handoff manifests (`wayfinder-read-and-plan`, `implementer`, `reviewer`) are non-empty and every modified file reported matches the actual repository state.
- **Specification Source:** `wayfinder-test-plan` Instruction 1.

---

### 5. Explicit Failure States / `{errors}`
The integration test harness must immediately surface a fatal `{error}` upon detecting any of the following failure modes:
1. **`ERR_DOM_ELEMENT_PRESENT`:** `#obj-03-card`, `#obj-03-content`, or `OBJ-03` found in `index.html`.
2. **`ERR_COMPONENT_FILE_EXISTS`:** `components/cards/card-cnn.html` exists on disk.
3. **`ERR_SIBLING_FILE_MISSING`:** `components/cards/card-ssm.html` or `components/cards/card-gex.html` is absent or 0 bytes.
4. **`ERR_CSS_RULE_LINGERING`:** Any of `.viz-cnn`, `.cnn-pixel`, `.cnn-scanner`, or `@keyframes cnn-stride` detected in `css/animations.css` or `css/modal.css`.
5. **`ERR_CSS_SYNTAX_ERROR`:** Unbalanced braces or malformed stylesheet structure in `css/animations.css` or `css/modal.css`.
6. **`ERR_KEYWORD_FOUND`:** CNN Malware text strings or URLs found in application source files.
7. **`ERR_CARD_COUNT_MISMATCH`:** Number of `.card` elements in `#projects .grid` is not strictly 3.
8. **`ERR_REMAINING_CARD_MUTATED`:** An identifier, title, description, or action button on `OBJ-04`, `OBJ-01`, or `OBJ-02` was altered, deleted, or renumbered.
9. **`ERR_CODEBASE_REGRESSION`:** Any application component outside the 4 authorized target files has uncommitted changes or unexpected diffs.
10. **`ERR_UPSTREAM_MANIFEST_CORRUPT`:** An upstream manifest block (`wayfinder-read-and-plan`, `implementer`, `reviewer`) is absent or empty.

---

## Resolution

### 1. Verification Test Suites Specification

#### Test Suite 1: DOM Node Excision & Grid Container Integrity Verification
- **Target:** `index.html` at repository root.
- **Preconditions:** Clean repository checkout on branch `agent/plan-2`.
- **Actions:**
  1. Read `index.html` via `fs.readFileSync("index.html", "utf8")`.
  2. Query string for `id="obj-03-card"`, `id="obj-03-content"`, and `class="viz-cnn"`.
  3. Assert all query occurrences evaluate to `false`.
  4. Verify container closing tags: `<div class="grid">` properly closed before `</section>`.
- **Oracle Assertion (`{correct required outputs}`):** `ORACLE-DOM-EXCISION` evaluates strictly to `true`.

#### Test Suite 2: Modular Component Deletion & Sibling Template Preservation Verification
- **Target:** `components/cards/` directory.
- **Preconditions:** Filesystem inspected.
- **Actions:**
  1. Check existence of `components/cards/card-cnn.html` via `fs.existsSync`.
  2. Assert `fs.existsSync("components/cards/card-cnn.html") === false`.
  3. Check existence of `components/cards/card-ssm.html` and `components/cards/card-gex.html`.
  4. Assert both sibling files exist with `size > 0`.
- **Oracle Assertion (`{correct required outputs}`):** `ORACLE-FILE-ABSENCE` evaluates strictly to `true`.

#### Test Suite 3: Stylesheet Rule Pruning & CSS Syntax Verification
- **Target:** `css/animations.css` and `css/modal.css`.
- **Preconditions:** Both files read via `fs.readFileSync`.
- **Actions:**
  1. Search for `.viz-cnn`, `.cnn-pixel`, `.cnn-scanner`, and `cnn-stride`.
  2. Assert zero occurrences in both files.
  3. Count opening `{` and closing `}` braces in each file.
  4. Assert brace counts are identical.
- **Oracle Assertion (`{correct required outputs}`):** `ORACLE-STYLESHEET-PRUNING` evaluates strictly to `true`.

#### Test Suite 4: Keyword & External Resource Eradication Verification
- **Target:** `index.html`, `css/animations.css`, `css/modal.css`.
- **Preconditions:** All target files loaded into memory.
- **Actions:**
  1. Scan each file for `"CONVOLUTIONAL NEURAL NETWORK FOR MALWARE DETECTION"`.
  2. Scan each file for `"choppedcnnmalware"`.
  3. Scan each file for `"CNN-Virus-Scanner"`.
  4. Assert zero occurrences across all files.
- **Oracle Assertion (`{correct required outputs}`):** `ORACLE-KEYWORD-ERADICATION` evaluates strictly to `true`.

#### Test Suite 5: Remaining Project Cards Preservation & Action Button Verification
- **Target:** `#projects .grid` inside `index.html`.
- **Preconditions:** `index.html` loaded into memory.
- **Actions:**
  1. Count `.card` elements in `#projects .grid`.
  2. Assert count strictly equals 3.
  3. Verify presence of `OBJ-04` card (`#obj-04-card`) with buttons `LIVE_DEMO` (`openTerminal04`) and `SRC_CODE`.
  4. Verify presence of `OBJ-01` card with buttons `LIVE_DEMO` (`openMediaModal`) and `WHITE_PAPER` (`openPDFModal`).
  5. Verify presence of `OBJ-02` card with buttons `LIVE_DEMO` (`openTerminal`) and `SRC_CODE`.
- **Oracle Assertion (`{correct required outputs}`):** `ORACLE-REMAINING-CARDS` evaluates strictly to `true`.

#### Test Suite 6: Repository Scope & Non-Regression Verification
- **Target:** Git working tree.
- **Preconditions:** Git repository initialized and working tree queried.
- **Actions:**
  1. Query `git diff --stat HEAD~1` or commit history for Run 2.
  2. Verify touched application files are strictly a subset of `{"index.html", "components/cards/card-cnn.html", "css/animations.css", "css/modal.css"}`.
  3. Ensure no modifications to JavaScript logic (`js/*`), chatbox widget (`chatbox.html`), or main layout styles (`css/styles.css`).
- **Oracle Assertion (`{correct required outputs}`):** `ORACLE-NON-REGRESSION` evaluates strictly to `true`.

#### Test Suite 7: Pipeline State Machine Manifest Alignment Verification
- **Target:** Upstream manifests from GitHub Issue #2.
- **Preconditions:** Upstream comments ingested.
- **Actions:**
  1. Validate `wayfinder-read-and-plan` block contains `spec.md`, `ticket-001.md`, `ticket-002.md`, `ticket-003.md`, `ticket-004.md`, `map.md`, `matrix.md`.
  2. Validate `implementer` block contains 4 files and 8 ticket transition entries.
  3. Validate `reviewer` block contains 4 files.
- **Oracle Assertion (`{correct required outputs}`):** `ORACLE-MANIFEST-ALIGNMENT` evaluates strictly to `true`.

---

### 2. Authoritative Integration Test Matrix

| Test Suite ID | Target Component | Governing Schema | Admissible Input (`INV-PAYLOAD-01`) | Deterministic Oracle / `{correct required outputs}` (`INV-ASSERTION-01`) | Explicit Failure State / `{errors}` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-01: DOM Excision** | `index.html` (`#projects .grid`) | `DOMTreePayload` | Live UTF-8 file content of `index.html` via `fs.readFileSync` | `!html.includes('id="obj-03-card"') && !html.includes('id="obj-03-content"')` | `ERR_DOM_ELEMENT_PRESENT`: Residual DOM node found |
| **TS-02: File Absence** | `components/cards/card-cnn.html` | `FileStatPayload` | Physical filesystem stat on `./components/cards/card-cnn.html` | `!fs.existsSync("components/cards/card-cnn.html")` | `ERR_COMPONENT_FILE_EXISTS`: File still on disk |
| **TS-03: Sibling Preservation** | `components/cards/` | `FileStatPayload` | Physical filesystem stat on `card-ssm.html` and `card-gex.html` | Both sibling templates exist as regular files with `size > 0` | `ERR_SIBLING_FILE_MISSING`: Sibling template deleted or empty |
| **TS-04: Stylesheet Pruning** | `css/animations.css`, `css/modal.css` | `StylesheetContentPayload` | Live file content from stylesheets | Zero occurrences of `.viz-cnn`, `.cnn-pixel`, `.cnn-scanner`, or `cnn-stride` in either stylesheet | `ERR_CSS_RULE_LINGERING`: Unused CSS rules remaining |
| **TS-05: CSS Syntax Integrity** | `css/animations.css`, `css/modal.css` | `StylesheetContentPayload` | Live file content from stylesheets | `count(css, "{") === count(css, "}")` in both files | `ERR_CSS_SYNTAX_ERROR`: Unbalanced braces or syntax defect |
| **TS-06: Keyword Eradication** | `index.html`, `css/*` | `ContentSearchPayload` | Live file contents across target files | Zero occurrences of `"CONVOLUTIONAL NEURAL NETWORK FOR MALWARE DETECTION"`, `"choppedcnnmalware"`, or `"CNN-Virus-Scanner"` | `ERR_KEYWORD_FOUND`: Residual text or URLs detected |
| **TS-07: Remaining Cards Count** | `index.html` (`#projects .grid`) | `DOMTreePayload` | Live DOM structure in `index.html` | Count of `.card` elements strictly equals 3 (`OBJ-04`, `OBJ-01`, `OBJ-02`) | `ERR_CARD_COUNT_MISMATCH`: Card count !== 3 |
| **TS-08: Action Buttons Preserved** | `index.html` (`.btn-group`) | `DOMTreePayload` | Live DOM structure in `index.html` | `OBJ-04` has `LIVE_DEMO` + `SRC_CODE`; `OBJ-01` has `LIVE_DEMO` + `WHITE_PAPER`; `OBJ-02` has `LIVE_DEMO` + `SRC_CODE` | `ERR_REMAINING_CARD_MUTATED`: Button handler or label missing |
| **TS-09: Scope Non-Regression** | Working Tree Scope | `GitWorkingTreePayload` | Live `git status --porcelain` and `git diff` | Touched files strictly within `{index.html, card-cnn.html, animations.css, modal.css}` | `ERR_CODEBASE_REGRESSION`: Unintended file modification |
| **TS-10: Manifest Alignment** | Pipeline State Machine | `PipelineManifestPayload` | Ingested GitHub Issue #2 comments | All 3 upstream blocks (`plan`, `implementer`, `reviewer`) present and non-empty | `ERR_UPSTREAM_MANIFEST_CORRUPT`: Missing upstream manifest |

---

### 3. Invariant Proofs & Contract Affirmation
1. **`INV-PAYLOAD-01` (Payload Law):** All test inputs are derived strictly from authentic filesystem schemas, authentic live DOM structure, and live Git telemetry. Zero mocks, dummy objects, or synthetic JSON payloads are used.
2. **`INV-ASSERTION-01` (Assertion Law):** All oracles assert exact `{correct required outputs}` strictly derived from `wayfinder/2/spec.md` and locked tickets. No handwritten arbitrary blobs.
3. **`INV-BOUNDARY-01` (Strict "DO NOT CODE YET"):** Zero executable test code, fixtures, parsers, or mock files are generated during this session.
4. **`INV-TICKET-01` (Disciplined Frontier Execution):** Exactly one non-research ticket (Ticket 005) is claimed and resolved in this session.
5. **`INV-HANDOFF-COMMENT-01` (GitHub Issue Comment Manifest):** The manifest is written to `.sandcastle/tmp/test-plan-manifest-2.txt` and posted to GitHub Issue #2 bounded strictly by `<!-- handoff:test-plan -->`.

---

### 4. Downstream Test Implementation Contract
When authorized by the operator in a subsequent coding session:
- The test runner will execute deterministic Node.js assertions directly against the real filesystem without mocks.
- The test will execute in <100ms.
- Any defect will fail fast and surface the exact failing oracle, schema field, and file mismatch.

---

### 5. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-test-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Completes integration test planning for Run `2`. Prepares handoff for final branch merge and issue closure (`merger`).
