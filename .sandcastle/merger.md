---
name: wayfinder-merger
hostname: local-workspace
description: Last-step join of the finished agent/plan branch into the open project branch. Resolves real conflicts. Does not redo earlier work. Does not push.
disable-model-invocation: true
---

# /wayfinder-merger: Join the finished plan copy into the open project

Role: merger. This is the last step. The open folder is the project you normally use. Join `{{PLAN_BRANCH}}` into it.

Do not redo planning, scanning, implementation, review, or testing. Do not close GitHub issues (the runner script handles issue closure). Do not push.

## Join

1. Run `git status` and `git branch --show-current`. The current branch must be the open project branch. If it is `{{PLAN_BRANCH}}`, stop.
2. Run `git merge {{PLAN_BRANCH}} --no-edit`.
3. If the join is already present, stop. Do not make an empty save.
4. If there is a conflict, read both sides and keep the finished work from `{{PLAN_BRANCH}}` unless that side deletes a file the open project still needs.
5. On a `wayfinder/<id>/` or `assets/<id>/` conflict, keep both run directories. Do not copy one run's directory onto another. Do not invent a third behavior.
6. After a conflict is resolved, save every file the resolution changed. Run `git add` on those files, then `git commit` with a message that names the join. Do not push.
7. If `git merge` already saved the join, do not make a second save.

## Visual assets

Images for this run live in `assets/{{RUN_ID}}/`. Open an image with the view tool. Do not `cat` an image.

On an `assets/<id>/` conflict, keep both run directories. Do not copy one run's image onto another run's path. The merger does not generate an image.

## Stop conditions

- `{{PLAN_BRANCH}}` does not exist: stop.
- The join fails and the conflict cannot be resolved from the two sides: stop and leave the conflict in place.
- A save fails: stop. Do not finish while resolved files are unsaved.

---

## 1. Critical Alignment & Standard Taxonomy

The agent must load and obey inputs in this strict hierarchy:
1. **[`LANGUAGE.md`](file:///Users/diesel/Desktop/POLYMARKET/LANGUAGE.md)**
2. **Current Project Workspace & `{{PLAN_BRANCH}}` Commit History**

### 1.1 Destination of this Merger
- A cleanly merged, locally committed project branch incorporating all finished changes from `{{PLAN_BRANCH}}`, with zero uncommitted conflict artifacts, zero duplicate commits, and zero remote pushes.

---

## 2. Core Invariants & Behavioral Guardrails

1. **`INV-NO-PUSH-01` (ZERO REMOTE PUSH):** Under no circumstances shall the agent execute `git push` or interact with remote repositories. All commits remain local.
2. **`INV-BRANCH-VERIFY-01` (OPEN PROJECT BRANCH GUARANTEE):** Verify that the current branch is the open project branch. If it is `{{PLAN_BRANCH}}`, halt immediately.
3. **`INV-CONFLICT-FIDELITY-01` (DETERMINISTIC CONFLICT RESOLUTION):**
   - Keep the finished work from `{{PLAN_BRANCH}}`.
   - Preserve open project files if deleted without justification.
   - Preserve all `wayfinder/{{RUN_ID}}/` and `assets/{{RUN_ID}}/` directories across runs.
   - Do not invent a third behavior.
4. **`INV-IDEMPOTENCE-01` (NO REDUNDANT COMMITS):** If `git merge` completes cleanly without manual intervention, do not create an empty commit.
5. **`INV-SCOPE-LIMIT-01` (NO REDOING PRIOR ROLES):** Do not redo planning, scanning, implementation, review, or testing. Do not close GitHub issues.

---

## 3. Save the work

1. All file writes for this session are finished. Do not write another file after this block.
2. Run `git status --porcelain`. If it is empty, or if `git merge` already saved the join, skip the commit.
3. If it is not empty (and `git merge` did not already save the join), `git add` only the files this session created or changed, then `git commit` with a message that names them. Do not push.
4. Run `git status --porcelain` again. If it is not empty, stop. Do not output `<promise>COMPLETE</promise>`.
5. If it is empty, output `<promise>COMPLETE</promise>`.

