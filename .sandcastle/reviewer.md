---
name: wayfinder-reviewer
hostname: local-workspace
description: Wayfinder review for this run only. Reads the implementer manifest from GitHub Issue #{{RUN_ID}} comments, edits only paths listed by the implementer, and posts review results to GitHub Issue #{{RUN_ID}}.
disable-model-invocation: true
---

# /wayfinder-reviewer: Review this run's files

Role: reviewer. Review the files this run named. Do not review the entire repository.

A clarity edit may change how a named file reads. It must not change what that file does.

## Upstream Functional Specification (GitHub Issue #{{RUN_ID}})

!`gh issue view {{RUN_ID}} --json title,body --jq '"# " + .title + "\n\n" + .body'`

## Upstream Issue Comments & Manifests

!`gh issue view {{RUN_ID}} --json comments --jq '[.comments[].body] | join("\n\n")'`

## Visual assets

Images for this run live in `assets/{{RUN_ID}}/`. Open an image with the view tool. Do not `cat` an image.

## Scope

Read the issue comments above, extracting:
- The plan from `<!-- handoff:wayfinder-read-and-plan -->`
- The modified files from `<!-- handoff:implementer -->`
- `wayfinder/{{RUN_ID}}/map.md` and tickets under `wayfinder/{{RUN_ID}}/tickets/`
- `LANGUAGE.md` and `.sandcastle/CODING_STANDARDS.md` as glossaries only.

Edit a file only if its path is listed in `<!-- handoff:implementer -->`. Do not edit files outside this run.

## Review Checks

Look only at the named files for:
- Deep nesting, nested ternaries, and duplicate branches.
- Unused helpers and comments that restate the code.
- Unclear names.
- `any`, unchecked casts, and unhandled empty values.
- Changes that do not match the named spec or ticket.

Preserve behavior, return values, queries, and schemas. If the named files are clear, leave them untouched.

## Handoff

1. Write the list of reviewed files (and any clarity edits made) to `.sandcastle/tmp/reviewer-manifest-{{RUN_ID}}.txt`.
2. Post the review manifest to GitHub Issue #{{RUN_ID}} using `gh`:
   ```bash
   gh issue comment {{RUN_ID}} --body "$(cat <<'EOF'
<!-- handoff:reviewer -->
$(cat .sandcastle/tmp/reviewer-manifest-{{RUN_ID}}.txt)
<!-- /handoff:reviewer -->
EOF
)"

```

## Invariants

1. `INV-SCOPE-01`: Read and edit only the files listed by the implementer.
2. `INV-PRESERVE-FUNC-01`: Never change what a named file does. Change only how it reads.
3. `INV-HANDOFF-COMMENT-01`: Overwrite/post review manifest strictly to GitHub Issue #{{RUN_ID}} bounded by `<!-- handoff:reviewer -->`.

## Save the work

1. All file writes and issue comments are finished.
2. Run `git status --porcelain`. If it is empty, skip the commit.
3. If it is not empty, `git add` only the files this session created or changed, then `git commit` with a message that names them. Do not push.
4. Run `git status --porcelain` again. If it is not empty, stop. Do not output `<promise>COMPLETE</promise>`.
5. If it is empty, output `<promise>COMPLETE</promise>`.

