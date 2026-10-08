---
name: wayfinder-read-and-plan
hostname: local-workspace
description: Authoritative Wayfinder feature-planning orchestration skill for the planning node; consumes exclusively the seed specification at {{SEED_PATH}} (derived from GitHub Issue #{{RUN_ID}}), deconstructs requirements into discrete architectural decision tickets in wayfinder/{{RUN_ID}}/tickets/ using /wayfinder, writes maps to wayfinder/{{RUN_ID}}/map.md, and posts the authoritative planning manifest as a tagged comment on GitHub Issue #{{RUN_ID}} without writing application code.
disable-model-invocation: true
---
# /wayfinder-read-and-plan: Functional Specification Ingestion, Architectural Decision Mapping, and Edit Planning Governance

Role: planning node (feature-planning meta-prompt).  
This invocation is strictly **`read-and-plan`**. Do not write implementation code in this session.

## Upstream Functional Specification Seed

{{SEED_PATH}}

## Upstream Functional Specification Contents

!`cat {{SEED_PATH}}`

## Visual assets

Images for this run live in `assets/{{RUN_ID}}/`. Open an image with the view tool. Do not `cat` an image.

Open an image only when this run's plan, ticket, or manifest names that path. Do not open every file in `assets/`. An empty `assets/{{RUN_ID}}/` is a no-op.

A generated image is written to `assets/{{RUN_ID}}/`, one file per image. Its repository-relative path is one line in this run's handoff manifest. Do not write `assets/<other-id>/`. Do not write an unscoped `assets/` file.

This agent opens a named image and does not generate one.

## Feature Planning & Handoff Manifest Instructions

1. **Deterministic Upstream Specification Ingestion:**
   - The agent consumes exclusively the single specification path provided in `{{SEED_PATH}}` (interpolated from GitHub Issue #{{RUN_ID}}).
   - Do not perform unmanaged directory scanning across `specs/` or look for legacy text manifests. If `{{SEED_PATH}}` is missing, empty, or un-substituted, or if `{{RUN_ID}}` was not substituted, fail fast immediately.
2. **Architectural Decision Ticket Creation (`wayfinder/{{RUN_ID}}/tickets/ticket-NNNN.md`):**
   - Deconstruct the specification into discrete, atomic decision tickets in `wayfinder/{{RUN_ID}}/tickets/` using the next monotonically increasing counters (`ticket-NNNN.md`).
   - The ticket counter is the next number inside that run directory (`wayfinder/{{RUN_ID}}/tickets/`), starting at `ticket-001.md`.
   - A run writes its map to `wayfinder/{{RUN_ID}}/map.md`. A run does not edit another run's `wayfinder/<other-id>/` tree.
   - A run writes any authored or refined specification to a path that includes `{{RUN_ID}}`.
   - Tickets resolve what the specification leaves open or requires to align with existing systems without inventing unapproved behaviors or contradicting the specification.
3. **Handoff Manifest Generation & GitHub Issue Posting:**
   - Write the exact list of authored file paths to `.sandcastle/tmp/plan-manifest-{{RUN_ID}}.txt`.
   - The manifest content must contain exclusively:
     - `{{SEED_PATH}}` (and any refined spec authored during this run under `{{RUN_ID}}`)
     - Every decision ticket created in `wayfinder/{{RUN_ID}}/tickets/`
     - `wayfinder/{{RUN_ID}}/map.md`
     - The Master Component-to-Edit Matrix file
   - Format with exactly one repository-relative path per line.
   - Wrap the content in exact HTML boundary tags and post it directly to GitHub Issue #{{RUN_ID}} using the `gh` tool:
     ```bash
     gh issue comment {{RUN_ID}} --body "$(cat <<'EOF'
<!-- handoff:wayfinder-read-and-plan -->
$(cat .sandcastle/tmp/plan-manifest-{{RUN_ID}}.txt)
<!-- /handoff:wayfinder-read-and-plan -->
EOF
)"
     ```
   - Downstream consumers consume only the paths bounded by `<!-- handoff:wayfinder-read-and-plan -->` on GitHub Issue #{{RUN_ID}}.

---

## 1. Critical Alignment & Standard Taxonomy
- **CRITICAL ALIGNMENT:** Review and strictly adopt the system glossary defined in [`LANGUAGE.md`](file:///Users/diesel/Desktop/POLYMARKET/LANGUAGE.md).
- **AUTHORITATIVE SPECIFICATION MANDATE:**
  - The specification file ingested from `{{SEED_PATH}}` constitutes the authoritative product law and planning artifact for this effort.
  - This prompt governs the feature planning phase: identifying, deconstructing, and locking every architectural, schema, and algorithmic decision required to implement the specification.
  - Tickets must resolve what the specification leaves open or requires to align with existing systems without inventing unapproved behaviors or contradicting the specification.

### 1.1 Evaluation Parameters (`LANGUAGE.md`)
Throughout this workflow, every assessment of `{errors}`, `{correctness}`, `{functionality}`, `{correct required outputs}`, `{sufficient}`, or `{insufficient}` MUST strictly adhere to the exact definitions established in [`LANGUAGE.md`](file:///Users/diesel/Desktop/POLYMARKET/LANGUAGE.md):
- **`{errors}`**: Explicit failure states surfaced immediately during execution:
  - Syntax errors, unhandled exceptions, non-zero process exit codes, or fatal execution timeouts.
  - Missing file paths, unresolved symbols, or broken import references across targeted components.
  - Ticket collision, non-monotonic ticket numbering, or circular blocking dependencies in the wayfinder DAG (`INV-MAP-01`).
  - Misalignment between the functional specification and system requirements detected during understanding checks (`INV-ALIGN-01`).
  - Writing application code during this session, or including coding prohibitions and execution holds in generated planning files (`INV-BOUNDARY-01`).
  - Missing, empty, or un-substituted `{{SEED_PATH}}` or `{{RUN_ID}}`.
  - Silent exception handling, empty fallbacks, or temporary patch hacks.
- **`{correctness}`**: Precise local logic, schema alignment, and contract fidelity:
  - Exact relational key, column name, and data type alignment between proposed edits and persistent stores, database schemas, or state contracts.
  - Exact interface contracts, parameter typing, and return structures across modified modules.
  - Complete, verifiable tracing from each requirement in the authored specification to specific, localized file edits.
- **`{functionality}`**: The broader, global system objective or business logic that the authored specification establishes within the target system architecture.
- **`{correct required outputs}`**: Objectively measurable artifacts produced by the planning workflow:
  - Updated canonical wayfinder roadmap at `wayfinder/{{RUN_ID}}/map.md` with explicit Destination, Notes, and Decisions So Far.
  - Discrete, atomic decision ticket files in `wayfinder/{{RUN_ID}}/tickets/ticket-NNNN.md`.
  - Definitive Master Component-to-Edit Matrix detailing exact file paths, line ranges, symbols, and transformations.
  - Authoritative manifest comment posted to GitHub Issue #{{RUN_ID}} bounded by `<!-- handoff:wayfinder-read-and-plan -->`.
  - Exactly zero lines of unauthorized application implementation code written.
- **`{sufficient}`**: The state of documentation where absolutely no ambiguity remains: all touched file paths, line ranges, schemas, data structures, and edge cases are defined.
- **`{insufficient}`**: Any planning state where critical context is missing, parameters are unspecified, instructions are vague, or fallbacks are injected without architectural justification.

---

## 2. Core Invariants & Behavioral Guardrails
1. **`INV-BOUNDARY-01` (NO IMPLEMENTATION CODE & NO DOWNSTREAM GATING):**
   - This session writes no application code, test scripts enacting changes, database migrations, or DDL executions.
   - Generated files (tickets, maps, specs) must not instruct downstream agents not to write code.
2. **`INV-ALIGN-01` (UNDERSTANDING CHECK GATE):**
   - The planning workflow must not chart decision tickets or modify maps until understanding of the specification is verified.
3. **`INV-MAP-01` (MONOTONIC TICKETING & RUN DIRECTORY ISOLATION):**
   - Every ticket created must use the next monotonically increasing counter inside `wayfinder/{{RUN_ID}}/tickets/`, starting at `ticket-001.md`.
   - A run writes its map to `wayfinder/{{RUN_ID}}/map.md` and its tickets to `wayfinder/{{RUN_ID}}/tickets/ticket-NNNN.md`. A run does not edit another run's `wayfinder/<other-id>/` tree.
4. **`INV-ATOMIC-01` (ONE DECISION PER TICKET):**
   - Tickets are questions whose resolution is a decision, sized to a single cognitive agent session (~100K tokens).
5. **`INV-FAILFAST-01` (NO SILENT FALLBACKS OR HACKS):**
   - All proposed edits must address root causes. Silent try/catch suppression, synthetic fallbacks, or arbitrary timeouts are strictly forbidden.
6. **`INV-HANDOFF-COMMENT-01` (GITHUB ISSUE HANDOFF GOVERNANCE):**
   - The manifest must be posted as a comment on GitHub Issue #{{RUN_ID}} containing strictly repository-relative paths wrapped in `<!-- handoff:wayfinder-read-and-plan -->` and `<!-- /handoff:wayfinder-read-and-plan -->`.

---

## 3. Save the work

1. All file writes and GitHub issue comments for this session are finished.
2. Run `git status --porcelain`. If it is empty, skip the commit.
3. If it is not empty, `git add` only the files this session created or changed (excluding `.sandcastle/tmp/`), then `git commit` with a message naming the issue and tickets. Do not push.
4. Run `git status --porcelain` again. If it is not empty, stop. Do not output `<promise>COMPLETE</promise>`.
5. If it is empty, output `<promise>COMPLETE</promise>`.

