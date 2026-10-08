---
name: wayfinder-test-plan
hostname: local-workspace
description: Authoritative Wayfinder test-planning meta-prompt for the test-planning node; ingests upstream plan, implementer, and reviewer manifests from GitHub Issue #{{RUN_ID}} comments, enforces strict payload and assertion laws against actual codebase schemas with zero mocks, charts deterministic integration test decision tickets, and posts the test plan to GitHub Issue #{{RUN_ID}} without writing test code until explicitly authorized.
disable-model-invocation: true
---

# /wayfinder-test-plan: Integration Test Decision Mapping, Payload Admissibility Governance, and Verification Planning

Role: test-plan meta prompt (tester planning node).  
This invocation is strictly **`read-and-plan`**. Do not write tests in this session.

## Upstream Functional Specification (GitHub Issue #{{RUN_ID}})

!`gh issue view {{RUN_ID}} --json title,body --jq '"# " + .title + "\n\n" + .body'`

## Upstream Issue Comments & Manifests

!`gh issue view {{RUN_ID}} --json comments --jq '[.comments[].body] | join("\n\n")'`

## Visual assets

Images for this run live in `assets/{{RUN_ID}}/`. Open an image with the view tool. Do not `cat` an image.

## Test Planning & Handoff Manifest Instructions

1. **Deterministic Upstream Manifest Consumption:**
   - Ingest upstream manifests from the output above, reading between:
     - `<!-- handoff:wayfinder-read-and-plan -->`
     - `<!-- handoff:implementer -->`
     - `<!-- handoff:reviewer -->`
   - If any block is missing or empty, fail fast immediately.
2. **Decision Ticket Charting for Integration Testing:**
   - Chart discrete decision tickets in `wayfinder/{{RUN_ID}}/tickets/` (e.g., `ticket-NNNN.md`) required to define integration tests for the modified components.
   - Tickets must resolve payload admissibility, schema grounding, oracle definitions, and component boundaries without containing executable test code.
3. **Handoff Manifest Generation & GitHub Issue Posting:**
   - Write all created or updated test decision ticket paths to `.sandcastle/tmp/test-plan-manifest-{{RUN_ID}}.txt`.
   - Post the test plan manifest to GitHub Issue #{{RUN_ID}} using `gh`:
     ```bash
     gh issue comment {{RUN_ID}} --body "$(cat <<'EOF'
<!-- handoff:test-plan -->
$(cat .sandcastle/tmp/test-plan-manifest-{{RUN_ID}}.txt)
<!-- /handoff:test-plan -->
EOF
)"
     ```

---

## 1. Critical Alignment & Loading Hierarchy

1. **[`LANGUAGE.md`](file:///Users/diesel/Desktop/POLYMARKET/LANGUAGE.md):** Strict definitions of `{errors}`, `{correctness}`, `{functionality}`, `{correct required outputs}`, `{sufficient}`, and `{insufficient}`.
2. **Every `functional_specification_*.md` in scope:** Desired `{functionality}` only.
3. **The Wayfinder Map (`wayfinder/{{RUN_ID}}/map.md`) and Ticket Files (`wayfinder/{{RUN_ID}}/tickets/`).**

### 1.1 Destination of this Plan
- **The Destination:** A decision set that lets a later, authorized coding session write deterministic integration tests for the components named in those specifications, without inventing a payload, a field, or an oracle.
- **The Invariant:** The destination is the decision set. The tests are **not** the destination of this session.

---

## 2. Core Invariants & Verification Laws

### 2.1 Payload Law (`INV-PAYLOAD-01`)
- **Schema Admissibility:** The only admissible payload is one whose field names, types, and optionality are the component's actual payload schema.
- **Observed Payloads:** An observed payload from a real producer may be frozen. Freezing does not authorize synthesis. Do not fill optional fields.
- **Synthesized Payloads Forbidden:** Synthetic dummy objects, placeholder JSON, or renamed fields are strictly forbidden. A test with synthesized inputs is `{insufficient}`, even if green.

### 2.2 Assertion Law (`INV-ASSERTION-01`)
- **Specification Oracles:** Assert `{correct required outputs}` strictly against the functional specification and locked ticket resolutions. Never assert against handwritten expected blobs.

### 2.3 Operational Invariants
1. **`INV-BOUNDARY-01` (STRICT "DO NOT CODE YET"):** Do not write test code, fixtures, parsers, or expected-output files.
2. **`INV-TICKET-01` (DISCIPLINED FRONTIER EXECUTION):** Claim and resolve at most one non-research ticket per session.
3. **`INV-HANDOFF-COMMENT-01` (GITHUB ISSUE COMMENT MANIFEST):** Output file list bounded strictly by `<!-- handoff:test-plan -->` on GitHub Issue #{{RUN_ID}}.

---

## 3. Save the work

1. All file writes and issue comments are finished. Do not write another file after this block.
2. Run `git status --porcelain`. If it is empty, skip the commit.
3. If it is not empty, `git add` only the files this session created or changed, then `git commit` with a message that names them. Do not push.
4. Run `git status --porcelain` again. If it is not empty, stop. Do not output `<promise>COMPLETE</promise>`.
5. If it is empty, output `<promise>COMPLETE</promise>`.

