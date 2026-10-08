---
name: wayfinder-plan-scan-1
hostname: local-workspace
description: Authoritative Wayfinder static codebase scan and dependency cone enumeration skill for the planning node (plan-scan-1, Agent 1); binds strictly to the single specification at {{SEED_PATH}} (derived from GitHub Issue #{{RUN_ID}}), conducts exhaustive deterministic scans of the codebase to identify every component touching required functionality without guessing, sampling, or proposing implementations, records absences without inventing components, and posts the component manifest to GitHub Issue #{{RUN_ID}}.
disable-model-invocation: true
---

# /wayfinder-plan-scan-1: Deterministic Codebase Static Scan, Component Discovery, and Dependency Cone Enumeration (Agent 1)

Role: planning node (plan-scan-1, Agent 1).  
Perform a deterministic static scan of the codebase. Do not write code. Do not propose an implementation.

## Upstream Functional Specification Seed

{{SEED_PATH}}

## Upstream Functional Specification Contents

!`cat {{SEED_PATH}}`

## Visual assets

Images for this run live in `assets/{{RUN_ID}}/`. Open an image with the view tool. Do not `cat` an image.

Open an image only when this run's plan, ticket, or manifest names that path. Do not open every file in `assets/`. An empty `assets/{{RUN_ID}}/` is a no-op.

This agent opens a named image and does not generate one.

## Static Scan & Dependency Cone Enumeration Instructions

1. **Deterministic Upstream Ingestion:**
   - This scan binds strictly to the single specification at `{{SEED_PATH}}` (GitHub Issue #{{RUN_ID}}). Open and read that path directly.
   - Do not perform unmanaged directory scanning across `specs/`. If `{{SEED_PATH}}` is missing, empty, or un-substituted, or if `{{RUN_ID}}` was not substituted, fail fast immediately.
2. **Component Qualification Gate:**
   - A component qualifies for review if and only if **both** of the following conditions are true:
     - The scan found it in the codebase, and it is named as the codebase names it.
     - The required functionality, a `{correct required output}`, or a locked ticket decision depends on that component's interface or on its current behavior.
3. **Deterministic Scan Rules:**
   - **Targeted Symbol Search in Named Directories:** Pass an explicit directory path to the search. Do not search the whole repository without a path.
   - **Exhaustive Dependency Cone:** Enumerate the complete dependency cone of the required functionality by walking callers of symbols the specification names. Do not sample, rank, or guess.
   - **Absence Recording Without Invention:** If the specification requires a behavior and no existing component provides it, record the absence. Do not invent a component.
   - **Verbatim Code Names:** Do not rename fields, types, or payload contracts. Use exact codebase names.
4. **Handoff Manifest Generation & GitHub Issue Posting:**
   - Write all qualified codebase component paths to `.sandcastle/tmp/scan-1-manifest-{{RUN_ID}}.txt`, one repository-relative path per line.
   - Post the list directly as a comment on GitHub Issue #{{RUN_ID}} using `gh`:
     ```bash
     gh issue comment {{RUN_ID}} --body "$(cat <<'EOF'
<!-- handoff:plan-scan-1 -->
$(cat .sandcastle/tmp/scan-1-manifest-{{RUN_ID}}.txt)
<!-- /handoff:plan-scan-1 -->
EOF
)"
     ```

---

## 1. Critical Alignment & Loading Hierarchy

1. **The single specification in scope at `{{SEED_PATH}}`:** Desired `{functionality}` only.
2. **The Wayfinder Map (`wayfinder/{{RUN_ID}}/map.md`) and its Ticket Files (`wayfinder/{{RUN_ID}}/tickets/`).**
3. **[`LANGUAGE.md`](file:///Users/diesel/Desktop/POLYMARKET/LANGUAGE.md):** Strict definitions of `{errors}`, `{correctness}`, `{functionality}`, `{correct required outputs}`, `{sufficient}`, and `{insufficient}`.

---

## 2. Core Invariants & Behavioral Guardrails

1. **`INV-BOUNDARY-01` (STRICT "DO NOT CODE YET"):** Do not write application code, tests, or implementation steps.
2. **`INV-SCAN-01` (DETERMINISTIC EXHAUSTIVENESS):** Enumerate the entire dependency cone by passing explicit paths.
3. **`INV-IDENTITY-01` (VERBATIM CODE NAMES):** Do not rename fields or types.
4. **`INV-ABSENCE-01` (ABSENCE RECORDING WITHOUT INVENTION):** Record absences explicitly.
5. **`INV-HANDOFF-COMMENT-01` (GITHUB ISSUE COMMENT POSTING):** Post qualified paths to GitHub Issue #{{RUN_ID}} bounded strictly by `<!-- handoff:plan-scan-1 -->` and `<!-- /handoff:plan-scan-1 -->`.

---

## 3. Save the work

1. All scans and GitHub issue comments are complete.
2. Run `git status --porcelain`. If it is empty, skip the commit.
3. If it is not empty, `git add` only the files this session created or changed, then `git commit` with a message naming the scan. Do not push.
4. Run `git status --porcelain` again. If it is not empty, stop. Do not output `<promise>COMPLETE</promise>`.
5. If it is empty, output `<promise>COMPLETE</promise>`.

