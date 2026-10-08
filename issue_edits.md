Here is the exact, unambiguous architectural runbook detailing the complete removal of the local `.sandcastle/issues/issue-<ID>.md` seed file dependency. Hand this directly to your coding assistant.

---

# MIGRATION RUNBOOK PART 2: Eradicating Local File Seed Handoffs

**Context:** The previous migration successfully moved downstream agent handoffs to GitHub comments but left a critical flaw: it introduced a local staging file (`.sandcastle/issues/issue-<ID>.md`) to feed the `cat {{SEED_PATH}}` prompt block. Sandcastle’s strict git worktree isolation caused `cat` to crash because the newly created local file was not committed to the repository, and thus was invisible inside the isolated agent worktrees.

**Objective:** Completely eliminate local seed files. The orchestrator must not write `.sandcastle/issues/*.md` locally. Instead, the prompt preprocessors must fetch the initial seed specification natively from GitHub via the `gh` CLI from inside their worktrees.

---

## 1. Orchestrator Script Edits (`.sandcastle/issues_sandcastle.mts`)

The orchestrator script must stop attempting to write the issue body to disk as a go-between.

**Step 1A: Delete Issue Folder Creation**
Locate and delete the following line:

```typescript
mkdirSync(".sandcastle/issues", { recursive: true });

```

**Step 1B: Delete the Local Seed Writer**
Inside the `for (const issue of issues)` loop, locate and **delete** this entire block:

```typescript
// DELETE THIS BLOCK ENTIRELY:
const seedPath = `.sandcastle/issues/issue-${runId}.md`;
writeFileSync(
    seedPath,
    `# Issue #${runId}: ${issue.title}\n\n${issue.body || "No specification body provided."}\n`,
    "utf8",
);

```

**Step 1C: Purge `SEED_PATH` from Prompt Arguments**
In the `parallel.map(...)` array and the `sequence` loop, locate the `promptArgs` object being passed to `run()`.

* **Change from:** `promptArgs: { BRANCH: agent.branch, RUN_ID: runId, SEED_PATH: seedPath }`
* **Change to:** `promptArgs: { BRANCH: agent.branch, RUN_ID: runId }`
*(Apply this exact removal for `BRANCH: planBranch` in the sequence block as well).*

---

## 2. Agent Prompt Meta-Edits (`.md` files)

The agent prompts must stop expecting a `{{SEED_PATH}}` variable and stop trying to `cat` a local file. They will instead query the GitHub CLI directly.

### A. Edit `plan.md`

**1. Replace the Header Block:**
Find and delete:

```markdown
## Upstream Functional Specification Seed

{{SEED_PATH}}

## Upstream Functional Specification Contents

!`cat {{SEED_PATH}}`

```

**Replace entirely with:**

```markdown
## Upstream Functional Specification (GitHub Issue #{{RUN_ID}})

!`gh issue view {{RUN_ID}} --json title,body --jq '"# " + .title + "\n\n" + .body'`

```

**2. Scrub Internal Text References:**

* **Find:** `consumes exclusively the single specification path provided in {{SEED_PATH}} (interpolated from GitHub Issue #{{RUN_ID}}).`
**Replace with:** `consumes exclusively the specification fetched directly from GitHub Issue #{{RUN_ID}}.`
* **Find:** `If {{SEED_PATH}} is missing, empty, or un-substituted, or if {{RUN_ID}} was not substituted, fail fast immediately.`
**Replace with:** `If {{RUN_ID}} is missing, empty, or un-substituted, fail fast immediately.`
* **Find:** `- {{SEED_PATH}} (and any refined spec authored during this run under {{RUN_ID}})`
**Replace with:** `- Any refined spec authored during this run under {{RUN_ID}}`
* **Find:** `The specification file ingested from {{SEED_PATH}} constitutes...`
**Replace with:** `The specification fetched from GitHub Issue #{{RUN_ID}} constitutes...`
* **Find (under `{errors}`):** `Missing, empty, or un-substituted {{SEED_PATH}} or {{RUN_ID}}.`
**Replace with:** `Missing, empty, or un-substituted {{RUN_ID}}.`

---

### B. Edit `plan-scan-1.md` and `plan-scan-2.md`

**1. Replace the Header Block (in both files):**
Execute the exact same replacement from Step A1 (replace the `Seed` and `Contents` headings, `{{SEED_PATH}}`, and `!cat` with the `!gh issue view` block).

**2. Scrub Internal Text References (in both files):**

* **Find:** `binds strictly to the single specification at {{SEED_PATH}} (GitHub Issue #{{RUN_ID}}). Open and read that path directly.`
**Replace with:** `binds strictly to the specification fetched from GitHub Issue #{{RUN_ID}}.`
* **Find:** `If {{SEED_PATH}} is missing, empty, or un-substituted, or if {{RUN_ID}} was not substituted, fail fast immediately.`
**Replace with:** `If {{RUN_ID}} is missing, empty, or un-substituted, fail fast immediately.`
* **Find:** `The single specification in scope at {{SEED_PATH}}:`
**Replace with:** `The single specification in scope from GitHub Issue #{{RUN_ID}}:`
* **Find (under `{errors}`):** `Missing, empty, or un-substituted {{SEED_PATH}} or {{RUN_ID}}.`
**Replace with:** `Missing, empty, or un-substituted {{RUN_ID}}.`

---

### C. Edit `reviewer.md`

**1. Replace the Header Block:**
Execute the exact same replacement from Step A1 (replace the `Seed` and `Contents` headings, `{{SEED_PATH}}`, and `!cat` with the `!gh issue view` block).

---

### D. Edit `tester.md`

**1. Replace the Header Block:**
Find and delete:

```markdown
## Upstream Seed Specification Path

{{SEED_PATH}}

```

*(Note: the tester prompt was previously missing the `!cat` block entirely. This adds the specification content context back in).*
**Replace entirely with:**

```markdown
## Upstream Functional Specification (GitHub Issue #{{RUN_ID}})

!`gh issue view {{RUN_ID}} --json title,body --jq '"# " + .title + "\n\n" + .body'`

```

*(Note: `implementer.md` and `merger.md` do not contain `{{SEED_PATH}}` and do not require edits for this step).*

---

### 3. Verification

Once the assistant applies these changes, execute `npx tsx .sandcastle/issues_sandcastle.mts`. The Sandcastle preprocessor will now inject the issue directly from GitHub's API into the isolated worktree contexts, bypassing the local filesystem completely.