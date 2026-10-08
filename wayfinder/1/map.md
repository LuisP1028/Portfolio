# Map 1: Sandcastle Issues State Machine Smoke Test

**Governing Specification:**
- [`wayfinder/1/spec.md`](./spec.md) (Sandcastle Issues State Machine Smoke Test)
- Upstream: GitHub Issue #1 (`Smoke Test: verify sandcastle issues state machine`)

**Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)  
**Run Identifier:** `1`  
**Execution Node:** `wayfinder-read-and-plan`  
**Status:** Canonical Plan Locked; Zero Architectural Ambiguity (Tickets 001–002 Resolved, Master Matrix Synthesized)

---

## 1. Destination

Establish a complete, deterministic, and verified decision set detailing every file lifecycle, transformation, and verification requirement across the codebase to implement and verify the Sandcastle smoke test specified in GitHub Issue #1:
1. **Target File Creation and Content Transformation for `README.md` Smoke Test Comment (Ticket 001):** Ensure `README.md` is created if absent, or appended to if present, ensuring the exact comment line `// sandcastle smoke test\n` terminates the file with standard UTF-8 encoding and LF line ending.
2. **Deterministic Verification Oracles and File System Integrity Checks for `README.md` (Ticket 002):** Formalize deterministic assertions checking file existence, exact verbatim string matching (length 24), trailing newline presence, and zero unintended side-effects across the repository.

---

## 2. Notes & Architectural Foundation

### 2.1 Codebase Analysis & Workspace State
- **Target File:** `README.md` (repository root).
- **Initial Workspace State:** `README.md` is currently absent from the workspace root.
- **Pipeline Integration:** In the Sandcastle issues state machine, subsequent nodes (`plan-scan-1`, `plan-scan-2`, `wayfinder-implementer`, `reviewer`, `tester`, `merger`) rely on the bounded manifest comment on GitHub Issue #1 to discover planned tickets, maps, and target components.

### 2.2 Invariant Guarantees
- **`INV-SMOKE-CONTENT`:** The comment line is verbatim `// sandcastle smoke test` with trailing LF (`\n`).
- **`INV-FILE-LIFECYCLE`:** File creation and append handling are fully defined to avoid runtime exceptions on file absence.
- **`INV-ZERO-REGRESSION`:** Codebase modifications are strictly bounded to `README.md`.

---

## 3. Decisions So Far & Ticket Registry

- **[Ticket 001: Target File Creation and Content Transformation for README.md Smoke Test Comment](./tickets/ticket-001.md)** — Resolved. Locked file lifecycle (create if absent, append if present), exact comment line syntax (`// sandcastle smoke test`), and UTF-8 / LF encoding.
- **[Ticket 002: Deterministic Verification Oracles and File System Integrity Checks for README.md](./tickets/ticket-002.md)** — Resolved. Locked 4 deterministic verification oracles (file existence, exact 24-character string match, newline termination, codebase non-regression).

---

## 4. Not Yet Specified

*(All functional requirements, file transformation specifications, and verification oracles for this run have been charted and fully resolved. Zero fog remains.)*

---

## 5. Out of Scope

- Modifying existing portfolio HTML, CSS, JavaScript, or image assets.
- Modifying Sandcastle pipeline scripts or workflow configurations under `.sandcastle/`.
- Executing test runners or modifying git state outside the designated planning artifacts.
