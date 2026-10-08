---
ticket_id: "003"
title: "Integration Test Decision Mapping, Payload Admissibility Governance & Verification Architecture for README.md Smoke Test"
type: task
status: resolved
claimed_by: "wayfinder-test-plan"
blocked_by:
  - "[Ticket 001: Target File Creation and Content Transformation for README.md Smoke Test Comment](./ticket-001.md)"
  - "[Ticket 002: Deterministic Verification Oracles and File System Integrity Checks for README.md](./ticket-002.md)"
governing_specification: "wayfinder/1/spec.md"
---

# Ticket 003: Integration Test Decision Mapping, Payload Admissibility Governance & Verification Architecture for README.md Smoke Test

## Question
How should integration testing for the Sandcastle smoke test comment in `README.md` be structured across the repository? What authentic codebase schemas and admissible payloads govern its verification without mocks under Payload Law (`INV-PAYLOAD-01`)? What deterministic oracles define `{correct required outputs}` under Assertion Law (`INV-ASSERTION-01`)? How are explicit failure states (`{errors}`) surfaced without generating executable test code prior to explicit operator authorization (`INV-BOUNDARY-01`)?

## Context & Specification Grounding
- **Governing Specification:** [`wayfinder/1/spec.md`](../spec.md)
  - § 1 Problem Definition & Operational Context (Validating Sandcastle issues state machine pipeline: feature planning, static scanning, implementation, review, integration testing, merge, and closure).
  - § 2 Functional Requirements & Desired Behavior (§ 2.1 Target file `README.md`, § 2.2 Comment line insertion `// sandcastle smoke test`, § 2.3 File lifecycle & idempotency, § 2.4 UTF-8 encoding & LF termination).
  - § 3 Constraints & Boundary Conditions (Exact 24-character string identity, zero side effects on portfolio codebase, no visual assets).
  - § 4 Acceptance Criteria & `{correct required outputs}` (File existence, exact line match, trailing `\n`, zero application regressions).
- **Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)
  - Strict definitions of `{errors}`, `{correctness}`, `{functionality}`, `{correct required outputs}`, `{sufficient}`, and `{insufficient}`.
- **Governing Upstream Manifests:**
  - Feature Planning manifest: [`wayfinder/1/map.md`](../map.md), [`wayfinder/1/spec.md`](../spec.md), [`wayfinder/1/matrix.md`](../matrix.md), [`wayfinder/1/tickets/ticket-001.md`](./ticket-001.md), [`wayfinder/1/tickets/ticket-002.md`](./ticket-002.md)
  - Implementer manifest: `README.md`, `README.md CHANGED ticket-001`, `README.md CHANGED ticket-002`
  - Reviewer manifest: `README.md`
- **Target Component:**
  - `README.md` at repository root.

---

## Architectural Decisions to Lock

### 1. Component Boundaries & Integration Surface
Integration testing for this run verifies the physical filesystem manifestation of the smoke test comment and the state machine pipeline invariants without isolation mocks:
1. **File System & Descriptor Domain:** Physical presence of `README.md` at the repository root, verifying it is a regular file with non-zero byte size.
2. **Text Content & Verbatim Identity Domain:** Exhaustive character-by-character string verification ensuring the final line strictly matches `// sandcastle smoke test` with length exactly 24 characters.
3. **Encoding & Line Termination Domain:** Verification of pure UTF-8 encoding without Byte Order Mark (BOM) and UNIX newline (`\n` / LF) termination.
4. **Codebase Non-Regression Domain:** Verification that the working tree contains zero modifications or deletions to existing application portfolio assets (`index.html`, `css/styles.css`, `js/*`, `components/*`).
5. **State Machine Manifest Governance Domain:** Verification that upstream manifests (`wayfinder-read-and-plan`, `implementer`, `reviewer`) are non-empty, uncorrupted, and aligned with git commit history.

---

### 2. Codebase Schema Grounding (Zero Mocks Mandate)
Under Payload Law (`INV-PAYLOAD-01`), no synthetic JSON, dummy mock objects, or handwritten stand-in payloads are permitted. All tests execute against authentic codebase interfaces:

#### Schema 1: File Stat & Descriptor Schema (`FileStatPayload`)
- `isFile()`: Boolean function returning `true` for a regular file.
- `size`: Non-negative integer representing physical size in bytes (minimum 24 bytes).
- `mtimeMs`: Float representing timestamp of last modification.
- `mode`: Integer bitmask representing file mode and permissions.

#### Schema 2: File Buffer & Text Content Schema (`FileContentPayload`)
- `encoding`: String literal `"utf8"`.
- `rawContent`: String representing full textual content read directly from disk.
- `byteLength`: Integer byte length of file content buffer.
- `lines`: Array of strings resulting from LF splitting (`rawContent.split(/\r?\n/)`).
- `finalNonEmptyLine`: String representing the last line where `line.length > 0`.
- `terminalChar`: String representing the final character of `rawContent` (`"\n"`).

#### Schema 3: Git Working Tree Status Schema (`GitWorkingTreePayload`)
- `statusOutput`: String output from `git status --porcelain`.
- `diffOutput`: String output from `git diff --stat HEAD~1`.
- `touchedFiles`: Array of repository-relative file paths detected by Git status/diff.
- `appRegressionDetected`: Boolean flag indicating whether any file outside `README.md` was altered.

#### Schema 4: Smoke Test Comment Syntax Schema (`SmokeTestCommentPayload`)
- `literalString`: String constant `"// sandcastle smoke test"`.
- `characterCount`: Integer constant `24`.
- `byteSequence`: Array of ASCII byte codes: `[47, 47, 32, 115, 97, 110, 100, 99, 97, 115, 116, 108, 101, 32, 115, 109, 111, 107, 101, 32, 116, 101, 115, 116]`.
- `prefix`: String `"// "`.
- `identifier`: String `"sandcastle smoke test"`.
- `terminator`: String `"\n"`.

#### Schema 5: Pipeline State Transition & Manifest Schema (`PipelineManifestPayload`)
- `runId`: String identifier (`"1"`).
- `upstreamPlanManifest`: Array of paths (`["wayfinder/1/spec.md", "wayfinder/1/tickets/ticket-001.md", "wayfinder/1/tickets/ticket-002.md", "wayfinder/1/map.md", "wayfinder/1/matrix.md"]`).
- `upstreamImplementerManifest`: Array of lines (`["README.md", "README.md CHANGED ticket-001", "README.md CHANGED ticket-002"]`).
- `upstreamReviewerManifest`: Array of lines (`["README.md"]`).
- `testPlanManifest`: Array of paths (`["wayfinder/1/tickets/ticket-003.md"]`).

---

### 3. Admissible Payloads Under Payload Law (`INV-PAYLOAD-01`)
1. **Authentic File System Reads:** Payloads ingested by integration test routines must be read directly from `./README.md` on the physical disk via Node.js `fs.readFileSync` or `fs.statSync`.
2. **Authentic Git Status Telemetry:** Working tree status must be queried directly from `git status --porcelain` and `git diff` against the actual repository tree.
3. **No Mock File Systems:** The use of `mock-fs`, virtual in-memory maps, or synthesized directory trees is strictly forbidden.
4. **No Synthesized Objects:** No synthetic dummy comments, fake manifests, or placeholder payloads may be passed into assertion routines.
5. **Sparse Property Preservation:** Unfilled optional properties must remain undefined; no artificial defaults may be injected.

---

### 4. Deterministic Integration Test Oracles (`INV-ASSERTION-01`)

Under Assertion Law, oracles evaluate `{correct required outputs}` strictly against the functional specification and ticket decisions:

#### Oracle 1: Target File Existence & Descriptor (`ORACLE-FILE-EXISTS`)
$$fs.existsSync("README.md") = \text{true} \land fs.statSync("README.md").isFile() = \text{true}$$
- **Pass Condition:** `README.md` exists as a regular file at the repository root with `size >= 24` bytes.
- **Specification Source:** `wayfinder/1/spec.md` § 4.1.

#### Oracle 2: Verbatim Comment Identity & Glyph Exactness (`ORACLE-CONTENT-IDENTITY`)
Let $lines = content.split(/\r?\n/).filter(line \implies line.length > 0)$.
$$lines[lines.length - 1] = \text{"// sandcastle smoke test"} \land lines[lines.length - 1].length = 24$$
- **Pass Condition:** The final non-empty line of `README.md` equals `"// sandcastle smoke test"` with 100% glyph integrity and exact character count 24.
- **Specification Source:** `wayfinder/1/spec.md` § 2.2, § 3, § 4.2.

#### Oracle 3: UNIX Line Termination & UTF-8 Encoding Integrity (`ORACLE-ENCODING-TERMINATION`)
$$content.endsWith("\n") = \text{true} \land content.includes("\r") = \text{false} \land content.charCodeAt(0) \ne 0xFEFF$$
- **Pass Condition:** The file terminates with standard LF (`\n`), contains zero CRLF (`\r\n`) characters, and contains no UTF-8 Byte Order Mark (BOM).
- **Specification Source:** `wayfinder/1/spec.md` § 2.4, § 4.3.

#### Oracle 4: Codebase & Working Tree Non-Regression (`ORACLE-NON-REGRESSION`)
$$\forall file \in TouchedApplicationFiles: file = \text{"README.md"}$$
- **Pass Condition:** `git status --porcelain` or `git diff HEAD~1` touches strictly `README.md` within application scope. Zero modifications to portfolio HTML, CSS, JavaScript, or media components.
- **Specification Source:** `wayfinder/1/spec.md` § 3, § 4.4.

#### Oracle 5: Pipeline State Transition & Manifest Alignment (`ORACLE-MANIFEST-ALIGNMENT`)
$$|Manifest_{plan}| > 0 \land |Manifest_{implementer}| > 0 \land |Manifest_{reviewer}| > 0$$
- **Pass Condition:** Upstream handoff manifests are non-empty and every modified file reported in upstream manifests matches the actual repository state.
- **Specification Source:** `wayfinder-test-plan` Instruction 1.

---

### 5. Explicit Failure States / `{errors}`
The integration test harness must immediately surface a fatal `{error}` upon detecting any of the following failure modes:
1. **`ERR_FILE_NOT_FOUND`:** `README.md` does not exist at repository root.
2. **`ERR_CONTENT_MISMATCH`:** The final non-empty line of `README.md` does not equal `"// sandcastle smoke test"`.
3. **`ERR_CHAR_COUNT_MISMATCH`:** The final line character count is not 24 (e.g. truncated glyphs, extra whitespace, altered punctuation).
4. **`ERR_INVALID_TERMINATOR`:** `README.md` does not end with `\n` or contains Windows-style CRLF line endings.
5. **`ERR_BOM_PRESENT`:** `README.md` begins with UTF-8 BOM bytes (`0xEF, 0xBB, 0xBF` / `\uFEFF`).
6. **`ERR_CODEBASE_REGRESSION`:** Any application component outside `README.md` has been modified, staged, or deleted.
7. **`ERR_UPSTREAM_MANIFEST_CORRUPT`:** An upstream manifest block (`wayfinder-read-and-plan`, `implementer`, `reviewer`) is absent or empty.

---

## Resolution

### 1. Verification Test Suites Specification

#### Test Suite 1: File Existence & Inode Descriptor Verification
- **Target:** `README.md` at repository root.
- **Preconditions:** Clean repository checkout on branch `agent/plan-1`.
- **Actions:**
  1. Check existence via `fs.existsSync("README.md")`.
  2. Inspect stats via `stat = fs.statSync("README.md")`.
  3. Assert `stat.isFile() === true`.
  4. Assert `stat.size >= 24`.
- **Oracle Assertion (`{correct required outputs}`):** `ORACLE-FILE-EXISTS` evaluates strictly to `true`.

#### Test Suite 2: Verbatim Text Matching & Character Count Verification
- **Target:** Textual content of `README.md`.
- **Preconditions:** `README.md` loaded into memory via `fs.readFileSync("README.md", "utf8")`.
- **Actions:**
  1. Read full string content.
  2. Split by LF line breaks into array of lines.
  3. Filter out empty trailing lines to isolate final line.
  4. Compare final line against `"// sandcastle smoke test"`.
  5. Assert exact string equality: `finalLine === "// sandcastle smoke test"`.
  6. Assert exact character count: `finalLine.length === 24`.
  7. Compare ASCII byte values against `[47, 47, 32, 115, 97, 110, 100, 99, 97, 115, 116, 108, 101, 32, 115, 109, 111, 107, 101, 32, 116, 101, 115, 116]`.
- **Oracle Assertion (`{correct required outputs}`):** `ORACLE-CONTENT-IDENTITY` evaluates strictly to `true`.

#### Test Suite 3: Line Termination & Byte Encoding Verification
- **Target:** Raw buffer of `README.md`.
- **Preconditions:** `README.md` read as binary buffer and UTF-8 string.
- **Actions:**
  1. Inspect last character of string: `content.endsWith("\n")`.
  2. Verify absence of carriage return: `content.includes("\r") === false`.
  3. Verify byte 0-2 are not BOM: `buffer[0] !== 0xEF || buffer[1] !== 0xBB || buffer[2] !== 0xBF`.
- **Oracle Assertion (`{correct required outputs}`):** `ORACLE-ENCODING-TERMINATION` evaluates strictly to `true`.

#### Test Suite 4: Repository Non-Regression & Working Tree Cleanliness
- **Target:** Git working tree.
- **Preconditions:** Git repository initialized and working tree queried.
- **Actions:**
  1. Run `git status --porcelain`.
  2. Inspect modified/staged files.
  3. Ensure no portfolio components (`index.html`, `css/styles.css`, `js/*`, `components/*`) have modifications.
- **Oracle Assertion (`{correct required outputs}`):** `ORACLE-NON-REGRESSION` evaluates strictly to `true`.

#### Test Suite 5: Pipeline State Machine Manifest Alignment
- **Target:** Upstream manifests from GitHub Issue #1.
- **Preconditions:** Upstream comments ingested.
- **Actions:**
  1. Validate `wayfinder-read-and-plan` block contains `spec.md`, `ticket-001.md`, `ticket-002.md`, `map.md`, `matrix.md`.
  2. Validate `implementer` block contains `README.md`.
  3. Validate `reviewer` block contains `README.md`.
- **Oracle Assertion (`{correct required outputs}`):** `ORACLE-MANIFEST-ALIGNMENT` evaluates strictly to `true`.

---

### 2. Authoritative Integration Test Matrix

| Test Suite ID | Target Component | Governing Schema | Admissible Input (`INV-PAYLOAD-01`) | Deterministic Oracle / `{correct required outputs}` (`INV-ASSERTION-01`) | Explicit Failure State / `{errors}` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-01: File Existence** | `README.md` | `FileStatPayload` | Physical file stat on `./README.md` | `stat.isFile() === true && stat.size >= 24` | `ERR_FILE_NOT_FOUND`: File absent or directory |
| **TS-02: Content Identity** | `README.md` | `SmokeTestCommentPayload`, `FileContentPayload` | Live UTF-8 file content | `finalLine === "// sandcastle smoke test" && finalLine.length === 24` | `ERR_CONTENT_MISMATCH` / `ERR_CHAR_COUNT_MISMATCH` |
| **TS-03: Line Termination** | `README.md` | `FileContentPayload` | Raw file buffer / string | `content.endsWith("\n") && !content.includes("\r")` | `ERR_INVALID_TERMINATOR`: Missing LF or CRLF present |
| **TS-04: BOM Absence** | `README.md` | `FileContentPayload` | Binary buffer | `buffer[0] !== 0xEF \|\| buffer[1] !== 0xBB \|\| buffer[2] !== 0xBF` | `ERR_BOM_PRESENT`: Byte Order Mark detected |
| **TS-05: Non-Regression** | Working Tree | `GitWorkingTreePayload` | Live `git status --porcelain` | Zero modified files in application scope other than `README.md` | `ERR_CODEBASE_REGRESSION`: Unintended file modification |
| **TS-06: Manifest Integrity** | State Machine | `PipelineManifestPayload` | Ingested GitHub Issue #1 comments | All 3 upstream blocks present and non-empty | `ERR_UPSTREAM_MANIFEST_CORRUPT`: Missing upstream manifest |

---

### 3. Invariant Proofs & Contract Affirmation
1. **`INV-PAYLOAD-01` (Payload Law):** All test inputs are derived strictly from authentic filesystem schemas and live Git telemetry. Zero mocks, dummy objects, or synthetic JSON payloads are used.
2. **`INV-ASSERTION-01` (Assertion Law):** All oracles assert exact `{correct required outputs}` strictly derived from `wayfinder/1/spec.md` and locked tickets. No handwritten arbitrary blobs.
3. **`INV-BOUNDARY-01` (Strict "DO NOT CODE YET"):** Zero executable test code, fixtures, parsers, or mock files are generated during this session.
4. **`INV-TICKET-01` (Disciplined Frontier Execution):** Exactly one non-research ticket (Ticket 003) is claimed and resolved in this session.
5. **`INV-HANDOFF-COMMENT-01` (GitHub Issue Comment Manifest):** The manifest is written to `.sandcastle/tmp/test-plan-manifest-1.txt` and posted to GitHub Issue #1 bounded strictly by `<!-- handoff:test-plan -->`.

---

### 4. Downstream Test Implementation Contract
When authorized by the operator in a subsequent coding session:
- The test runner will execute deterministic Node.js assertions directly against the real filesystem without mocks.
- The test will execute in <100ms.
- Any defect will fail fast and surface the exact failing oracle, schema field, and byte/character mismatch.

---

### 5. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-test-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Completes integration test planning for Run `1`. Prepares handoff for final branch merge and issue closure (`merger`).
