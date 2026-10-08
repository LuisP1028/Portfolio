# Master Component-to-Edit Matrix: Sandcastle Issues State Machine Smoke Test

**Governing Specification:**
- [`wayfinder/1/spec.md`](./spec.md) (Sandcastle Issues State Machine Smoke Test)
- Upstream: GitHub Issue #1 (`Smoke Test: verify sandcastle issues state machine`)

**Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)  
**Run Identifier:** `1`  
**Execution Node:** `wayfinder-read-and-plan`  
**Status:** Canonical Plan Locked; Zero Architectural Ambiguity

---

## 1. Master Component-to-Edit Matrix

| Component Path | Target Lines / Symbols | Governing Ticket | Nature of Transformation | Invariants & Contracts Locked |
| :--- | :--- | :--- | :--- | :--- |
| `README.md` | Line 1 / EOF | [Ticket 001](./tickets/ticket-001.md), [Ticket 002](./tickets/ticket-002.md) | Create file (if absent) or append (if present) single comment line `// sandcastle smoke test\n` at bottom of file. | `INV-SMOKE-CONTENT`: Exact verbatim string `// sandcastle smoke test\n`; `INV-FILE-LIFECYCLE`: Safe idempotent file creation/append; `INV-ENCODING-UTF8`: UTF-8 encoding with LF line termination. |

---

## 2. Detailed Component Transformation Specifications

### 2.1 File: `README.md`

#### Edit 1: Smoke Test Comment Line Placement
- **Target Position:** End of file (`README.md`). If the file does not exist, create it.
- **Transformation Content:**
  ```markdown
  // sandcastle smoke test
  ```
- **Rationale & Invariants:**
  - `INV-SMOKE-CONTENT`: Preserves the exact 24-character string `// sandcastle smoke test`.
  - `INV-FILE-LIFECYCLE`: Guards against file not found errors by supporting creation of `README.md` when absent.
  - `INV-ENCODING-UTF8`: Ensures standard LF newline termination without BOM.

---

## 3. Verification & Testing Oracles Table

| Oracle ID | Verification Target | Deterministic Assertion | Pass Condition |
| :--- | :--- | :--- | :--- |
| **ORACLE-01** | Target File Existence | `fs.existsSync("README.md")` | Evaluates to `true` |
| **ORACLE-02** | Exact Comment Identity | `lines[lines.length - 1] === "// sandcastle smoke test"` | Exact 24-character match on final non-empty line |
| **ORACLE-03** | Terminal Newline Format | `content.endsWith("\n")` | Evaluates to `true` with standard LF |
| **ORACLE-04** | Repository Non-Regression | `git status --porcelain` in app scope | No files other than `README.md` modified |
