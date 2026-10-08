---
ticket_id: "002"
title: "Modular Component File Lifecycle and Deletion of card-cnn.html"
type: task
status: resolved
claimed_by: "wayfinder-read-and-plan"
blocked_by: ["ticket-001.md"]
governing_specification: "wayfinder/2/spec.md"
---

# Ticket 002: Modular Component File Lifecycle and Deletion of card-cnn.html

## Question
How should the standalone modular component file `components/cards/card-cnn.html` be handled to ensure complete removal from the repository filesystem without leaving orphaned template artifacts or broken build dependencies?

## Context & Specification Grounding
- **Governing Specification:** [`wayfinder/2/spec.md`](../spec.md) § 1 (Problem Definition), § 2 (Functional Requirements), § 3 (Constraints), § 4 (Acceptance Criteria).
- **Target Call-Sites:**
  - `components/cards/card-cnn.html` (37 lines, 2746 bytes).
- **Current Workspace State:**
  - `components/cards/` holds modular card component files:
    - `card-ssm.html` (OBJ-01)
    - `card-gex.html` (OBJ-02)
    - `card-cnn.html` (OBJ-03)
  - `card-cnn.html` contains the isolated template markup for the CNN malware scanner card, including `<article class="card" id="obj-03-card">`, `.viz-cnn`, and button handlers.

## Architectural Decisions to Lock
1. **Physical Deletion vs. Deprecation:**
   - `components/cards/card-cnn.html` must be permanently deleted from the repository.
   - Retaining empty or deprecated files is rejected under `INV-FAILFAST-01`.
2. **Sibling Component Isolation:**
   - `components/cards/card-ssm.html` and `components/cards/card-gex.html` remain untouched.
   - Sibling templates must not be renamed or reorganized.

## Scope & Invariant Guardrails
- **In Scope:** Deletion of `components/cards/card-cnn.html`.
- **Out of Scope:** `index.html` edits (Ticket 001), CSS pruning (Ticket 003), verification assertions (Ticket 004).

---

## Resolution

### 1. Concrete Lifecycle Transformation Specification
- **Target File Path:** `components/cards/card-cnn.html` (relative to repository root).
- **Lifecycle Action:** File Deletion (`unlink` / `git rm`).
- **Post-State:** `fs.existsSync("components/cards/card-cnn.html") === false`.

### 2. Architectural Verification & Invariant Proof
- **File Deletion Invariant (`INV-FILE-DELETE`):** `components/cards/card-cnn.html` ceases to exist on the filesystem. No orphaned templates or unused asset references remain.
- **Sibling Preservation Invariant (`INV-SIBLING-PRESERVE`):** `components/cards/card-ssm.html` and `components/cards/card-gex.html` exist intact with zero modifications.

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-read-and-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Unblocks [Ticket 004](./ticket-004.md).
