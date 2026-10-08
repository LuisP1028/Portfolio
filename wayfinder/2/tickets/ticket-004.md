---
ticket_id: "004"
title: "Deterministic Verification Oracles and System Integrity Checks for CNN OBJ Removal"
type: task
status: resolved
claimed_by: "wayfinder-read-and-plan"
blocked_by: ["ticket-001.md", "ticket-002.md", "ticket-003.md"]
governing_specification: "wayfinder/2/spec.md"
---

# Ticket 004: Deterministic Verification Oracles and System Integrity Checks for CNN OBJ Removal

## Question
What deterministic verification assertions, file system oracles, DOM queries, and failure conditions certify that the CNN OBJ section is completely removed from the application without regression to remaining components?

## Context & Specification Grounding
- **Governing Specification:** [`wayfinder/2/spec.md`](../spec.md) § 4 (Acceptance Criteria & `{correct required outputs}`).
- **Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md) definitions of `{errors}`, `{correctness}`, `{functionality}`, `{correct required outputs}`.
- **Target Call-Sites:**
  - `index.html`
  - `components/cards/card-cnn.html`
  - `css/animations.css`
  - `css/modal.css`

## Architectural Decisions to Lock
1. **Deterministic Verification Oracles:**
   - **Oracle 1 (DOM Node Absence):**
     In `index.html`, parsing or querying `#obj-03-card` must evaluate to `null` / absence.
     `document.getElementById("obj-03-card") === null`
   - **Oracle 2 (Modular Component File Absence):**
     `fs.existsSync("components/cards/card-cnn.html") === false`
   - **Oracle 3 (Content & Keyword Eradication):**
     The verbatim strings:
     - `"CONVOLUTIONAL NEURAL NETWORK FOR MALWARE DETECTION"`
     - `"choppedcnnmalware"`
     - `"CNN-Virus-Scanner"`
     must not appear anywhere in `index.html` or `components/`.
   - **Oracle 4 (Preservation of Remaining Project Cards):**
     The DOM elements:
     - `#obj-04-card` (EVIL DIGITAL TWIN)
     - `OBJ-01` (STATE SPACE MODEL WITH BAYESIAN INFERENCE)
     - `OBJ-02` (OPTIONS DEALER POSITIONING)
     must be present in `index.html` with valid button triggers (`LIVE_DEMO`, `SRC_CODE`, `WHITE_PAPER`).
     `document.querySelectorAll("#projects .card").length === 3`
   - **Oracle 5 (Stylesheet Dead-Rule Absence):**
     The selectors `.viz-cnn`, `.cnn-scanner`, and keyframe `cnn-stride` must not appear in `css/animations.css` or `css/modal.css`.
   - **Oracle 6 (Repository Non-Regression):**
     `git status --porcelain` in application scope touches exclusively the authorized target files (`index.html`, `components/cards/card-cnn.html`, `css/animations.css`, `css/modal.css`).

2. **Explicit Failure Conditions ({errors}):**
   - Lingering `#obj-03-card` node in `index.html`.
   - Residual `components/cards/card-cnn.html` file on disk.
   - Broken HTML structure (unclosed `<div class="grid">` or `<section id="projects">`).
   - Mutation or deletion of remaining cards (`OBJ-04`, `OBJ-01`, `OBJ-02`).
   - Syntax errors in `css/animations.css` or `css/modal.css`.

## Scope & Invariant Guardrails
- **In Scope:** Formalizing verification oracles, pass conditions, and explicit failure modes.
- **Out of Scope:** Implementation edits (handled in Tickets 001–003).

---

## Resolution

### 1. Concrete Verification Specification Table
| Oracle ID | Verification Target | Deterministic Assertion | Pass Condition |
| :--- | :--- | :--- | :--- |
| **ORACLE-01** | `index.html` DOM | `!html.includes('id="obj-03-card"')` | Evaluates to `true` |
| **ORACLE-02** | File System | `!fs.existsSync("components/cards/card-cnn.html")` | Evaluates to `true` |
| **ORACLE-03** | Keyword Eradication | `!html.includes("choppedcnnmalware") && !html.includes("CNN-Virus-Scanner")` | Evaluates to `true` |
| **ORACLE-04** | Remaining Cards Count | Card count in `#projects .grid` strictly equals 3 | Exactly 3 cards present (`OBJ-04`, `OBJ-01`, `OBJ-02`) |
| **ORACLE-05** | CSS Dead-Code Pruning | Neither `css/animations.css` nor `css/modal.css` contains `viz-cnn` or `cnn-stride` | Evaluates to `true` |
| **ORACLE-06** | Repo Non-Regression | `git diff --stat` touches exclusively specified components | Zero unintended modifications |

### 2. Architectural Verification & Invariant Proof
- **Verification Oracle Invariant (`INV-VERIFY-ORACLE`):** Any failure across ORACLE-01 through ORACLE-06 immediately flags an `{errors}` state.
- **Completeness Invariant (`INV-COMPLETE-REMOVAL`):** Passing all 6 oracles proves that the CNN OBJ section is entirely removed and the system state is `{correct}` and `{sufficient}`.

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-read-and-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Completes the decision ticket set for run `2`.
