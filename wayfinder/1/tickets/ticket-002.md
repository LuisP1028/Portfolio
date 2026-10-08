---
ticket_id: "002"
title: "Deterministic Verification Oracles and File System Integrity Checks for README.md"
type: task
status: resolved
claimed_by: "wayfinder-read-and-plan"
blocked_by: ["ticket-001.md"]
governing_specification: "wayfinder/1/spec.md"
---

# Ticket 002: Deterministic Verification Oracles and File System Integrity Checks for README.md

## Question
What deterministic verification assertions, file system oracles, and failure conditions certify that `README.md` strictly satisfies the smoke test requirement specified in `wayfinder/1/spec.md`?

## Context & Specification Grounding
- **Governing Specification:** [`wayfinder/1/spec.md`](../spec.md) § 4 (Acceptance Criteria & `{correct required outputs}`).
- **Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md) definitions of `{errors}`, `{correctness}`, `{functionality}`, `{correct required outputs}`.
- **Target Call-Sites:**
  - `README.md` (repository root).

## Architectural Decisions to Lock
1. **Deterministic Verification Oracles:**
   - **Oracle 1 (File Existence):**
     `fs.existsSync("README.md") === true`
     Certifies that `README.md` exists at repository root.
   - **Oracle 2 (Final Line Content Match):**
     Let `lines = fs.readFileSync("README.md", "utf8").split(/\r?\n/).filter(line => line.length > 0)`.
     The final non-empty line must strictly satisfy:
     `lines[lines.length - 1] === "// sandcastle smoke test"`
     Length must be exactly 24 characters.
   - **Oracle 3 (Trailing Newline Verification):**
     `fs.readFileSync("README.md", "utf8").endsWith("\n") === true`
     Certifies proper UNIX file termination.
   - **Oracle 4 (Non-Regression of Codebase):**
     `git diff --stat` touches exclusively `README.md` (no modifications to other codebase files).

2. **Explicit Failure Conditions ({errors}):**
   - Missing `README.md` file after implementation.
   - Final line does not exactly equal `// sandcastle smoke test` (e.g. wrong casing, altered whitespace, missing slashes).
   - Unintended edits to existing repository components.

## Scope & Invariant Guardrails
- **In Scope:** Formalizing verification oracles, pass conditions, and explicit failure modes for `README.md`.
- **Out of Scope:** Implementation of application files (handled in Ticket 001).

---

## Resolution

### 1. Verification Specification
The verification architecture defines deterministic checks:
1. Confirm `README.md` is present on disk.
2. Confirm the last line of `README.md` contains verbatim `// sandcastle smoke test`.
3. Confirm file ends with standard newline.
4. Confirm git status shows only `README.md` modified/added in application space.

### 2. Architectural Verification & Invariant Proof
- **Verification Oracle Invariant (`INV-VERIFY-ORACLE`):** Any discrepancy in file presence, string length, or character content immediately surfaces an `{errors}` failure state.
- **Acceptance Invariant (`INV-ACCEPT-COMPLETE`):** When Oracles 1–4 evaluate to true, the smoke test is certified `{sufficient}` and `{correct}`.

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-read-and-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Completes planning ticket set for run `1`.
