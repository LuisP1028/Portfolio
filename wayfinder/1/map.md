# Map 1: Sandcastle Issues State Machine Smoke Test

**Governing Specification:**
- [`wayfinder/1/spec.md`](./spec.md) (Sandcastle Issues State Machine Smoke Test)
- Upstream: GitHub Issue #1 (`Smoke Test: verify sandcastle issues state machine`)

**Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)  
**Run Identifier:** `1`  
**Execution Node:** `wayfinder-test-plan`  
**Status:** Canonical Plan & Integration Test Plan Locked; Zero Architectural Ambiguity (Tickets 001–003 Resolved, Master Matrix & Test Matrix Synthesized)

---

## 1. Destination

Establish a complete, deterministic, and verified decision set detailing every file lifecycle, transformation, and verification requirement across the codebase to implement and verify the Sandcastle smoke test specified in GitHub Issue #1:
1. **Target File Creation and Content Transformation for `README.md` Smoke Test Comment (Ticket 001):** Ensure `README.md` is created if absent, or appended to if present, ensuring the exact comment line `// sandcastle smoke test\n` terminates the file with standard UTF-8 encoding and LF line ending.
2. **Deterministic Verification Oracles and File System Integrity Checks for `README.md` (Ticket 002):** Formalize deterministic assertions checking file existence, exact verbatim string matching (length 24), trailing newline presence, and zero unintended side-effects across the repository.
3. **Integration Test Decision Mapping, Payload Admissibility Governance & Verification Architecture for `README.md` Smoke Test (Ticket 003):** Formalize authentic filesystem schemas (`FileStatPayload`, `FileContentPayload`, `GitWorkingTreePayload`, `SmokeTestCommentPayload`, `PipelineManifestPayload`), admissible observed payloads under Payload Law with zero mocks (`INV-PAYLOAD-01`), deterministic verification oracles (`INV-ASSERTION-01`), explicit failure modes (`{errors}`), and synthesize the Authoritative Integration Test Matrix (`test-matrix.md`).

---

## 2. Notes & Architectural Foundation

### 2.1 Codebase Analysis & Workspace State
- **Target File:** `README.md` (repository root).
- **Current Workspace State:** `README.md` is present on disk containing `// sandcastle smoke test\n` following implementation and review verification.
- **Pipeline Integration:** In the Sandcastle issues state machine, subsequent nodes (`tester`, `merger`) rely on the bounded manifest comment on GitHub Issue #1 to discover planned tickets, maps, and target components.

### 2.2 Invariant Guarantees
- **`INV-SMOKE-CONTENT`:** The comment line is verbatim `// sandcastle smoke test` with trailing LF (`\n`).
- **`INV-FILE-LIFECYCLE`:** File creation and append handling are fully defined to avoid runtime exceptions on file absence.
- **`INV-ZERO-REGRESSION`:** Codebase modifications are strictly bounded to `README.md`.
- **`INV-PAYLOAD-01`:** Only authentic filesystem schemas and live Git telemetry are admissible. Zero mocks.
- **`INV-ASSERTION-01`:** All assertions evaluate against specification oracles.
- **`INV-BOUNDARY-01`:** Strict "DO NOT CODE YET" gate enforced prior to authorization.

---

## 3. Decisions So Far & Ticket Registry

- **[Ticket 001: Target File Creation and Content Transformation for README.md Smoke Test Comment](./tickets/ticket-001.md)** — Resolved. Locked file lifecycle (create if absent, append if present), exact comment line syntax (`// sandcastle smoke test`), and UTF-8 / LF encoding.
- **[Ticket 002: Deterministic Verification Oracles and File System Integrity Checks for README.md](./tickets/ticket-002.md)** — Resolved. Locked 4 deterministic verification oracles (file existence, exact 24-character string match, newline termination, codebase non-regression).
- **[Ticket 003: Integration Test Decision Mapping, Payload Admissibility Governance & Verification Architecture for README.md Smoke Test](./tickets/ticket-003.md)** — Resolved. Locked authentic filesystem schemas, admissible observed payloads without mocks (`INV-PAYLOAD-01`), deterministic verification oracles (`INV-ASSERTION-01`), explicit failure modes (`{errors}`), and synthesized the Authoritative Integration Test Matrix (`test-matrix.md`).

---

## 4. Not Yet Specified

*(All functional requirements, file transformation specifications, verification oracles, and integration test decision mappings for this run have been charted and fully resolved. Zero fog remains.)*

---

## 5. Out of Scope

- Modifying existing portfolio HTML, CSS, JavaScript, or image assets.
- Modifying Sandcastle pipeline scripts or workflow configurations under `.sandcastle/`.
- Authoring executable test code, test fixtures, parsers, or mock files prior to explicit operator authorization (`INV-BOUNDARY-01`).
