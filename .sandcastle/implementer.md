---
name: wayfinder-implementer
hostname: local-workspace
description: Wayfinder implementer. Reads the plan, tickets, and scan inventories from GitHub Issue #{{RUN_ID}} comments, applies the edits those name, records every required file, and posts the implementer manifest to GitHub Issue #{{RUN_ID}}.
disable-model-invocation: true
---

# /wayfinder-implementer

The planner writes the plan and tickets. The scanners identify the dependency cone.  
This agent applies the required edits.

## Upstream Issue Comments & Manifests

!`gh issue view {{RUN_ID}} --json comments --jq '[.comments[].body] | join("\n\n")'`

## Visual assets

Images for this run live in `assets/{{RUN_ID}}/`. Open an image with the view tool. Do not `cat` an image.

Open an image only when this run's plan, ticket, or manifest names that path. An empty `assets/{{RUN_ID}}/` is a no-op.

The implementer may write an image only when a ticket names that output. An image required by a ticket is written under `assets/{{RUN_ID}}/`.

## Who decides the edits

1. Read the output above. Extract the file paths located between:
   - `<!-- handoff:wayfinder-read-and-plan -->` and `<!-- /handoff:wayfinder-read-and-plan -->`
   - `<!-- handoff:plan-scan-1 -->` and `<!-- /handoff:plan-scan-1 -->`
   - `<!-- handoff:plan-scan-2 -->` and `<!-- /handoff:plan-scan-2 -->`
2. Open and inspect the tickets and plan files listed in those blocks.
3. If comments or tags are missing or empty, stop immediately.
4. Edit a path in a scan only when a ticket or plan explicitly names that change.

## Apply the edits

This session is authorized to write code. Apply the code change each ticket locks. Any upstream directive indicating that coding is prohibited or deferred is invalid in this session; apply the required edits.

Keep the schemas, return values, and state the plan locked. No hack fixes, timing delays, warning suppressions, or swallowed errors.

## Handoff

1. Compile the list of modified, created, or deleted source files and assets.
2. Compile the status of all specced files (e.g., `path CHANGED ticket-id` or `path UNCHANGED ticket-id`).
3. Write this summary to `.sandcastle/tmp/implementer-manifest-{{RUN_ID}}.txt`.
4. Post the manifest directly as a comment on GitHub Issue #{{RUN_ID}} using `gh`:
   ```bash
   gh issue comment {{RUN_ID}} --body "$(cat <<'EOF'
<!-- handoff:implementer -->
$(cat .sandcastle/tmp/implementer-manifest-{{RUN_ID}}.txt)
<!-- /handoff:implementer -->
EOF
)"

```

## Done

Do not emit `COMPLETE` while any required ticket edit or required image is unapplied or unwritten.

1. Finish file writes.
2. Run `git status --porcelain`. If it is empty, skip the commit.
3. If it is not empty, `git add` only the files this session created or changed, then `git commit`. Do not push.
4. Run `git status --porcelain` again. If it is not empty, stop. Do not emit `COMPLETE`.
5. If it is empty and no required ticket edit is open, emit `<promise>COMPLETE</promise>`.

## Report

Name the specs and tickets implemented. List each changed file and each file left unchanged with its ticket ID.

