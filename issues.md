Here are the complete, production-ready files in full for your coding assistant.

---

### File 1: `.sandcastle/plan-skill-implement-review-test-merge.mts`

```typescript
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { run } from "@ai-hero/sandcastle";
import type { AgentProvider } from "@ai-hero/sandcastle";
import { noSandbox } from "@ai-hero/sandcastle/sandboxes/no-sandbox";

// Ultra path: agy runs on the host so the macOS keychain session is used.
// Do not set GEMINI_API_KEY or modelProvider=gemini. That switches off Ultra.
// Run with: npx tsx .sandcastle/plan-skill-implement-review-test-merge.mts
//
// GitHub Issues State Machine:
// Each open issue labeled 'sandcastle:queued' is an isolated seed run sequentially.
// Issue Number serves as {{RUN_ID}}.
// Start this script from main. The merger runs in that folder.
// Model slugs come from `agy models`. A display name fails the run.
// Within one seed, the planner and both scanners stay parallel.
// A ~/.gitconfig lock is retried, not treated as failure.
// Each run waits 25 minutes of silence before Sandcastle's idle timeout fires.

const IDLE_TIMEOUT_SECONDS = 25 * 60;
const QUEUED_LABEL = "sandcastle:queued";
const COMPLETED_LABEL = "sandcastle:completed";

function shellQuote(value: string): string {
    return `'${value.replace(/'/g, `'\\''`)}'`;
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorText(error: unknown): string {
    if (error instanceof Error) {
        return `${error.message}\n${error.cause instanceof Error ? error.cause.message : String(error.cause ?? "")}`;
    }
    return String(error);
}

function isGitConfigLock(error: unknown) {
    return errorText(error).includes("could not lock config file");
}

type StreamEvent =
    | { type: "text"; text: string }
    | { type: "result"; result: string }
    | { type: "tool_call"; name: string; args: string };

function antigravity(model: string): AgentProvider {
    const streamedSteps = new Set<number>();
    return {
        name: "antigravity",
        env: {},
        captureSessions: false,
        buildPrintCommand({ prompt }) {
            return {
                command: [
                    "agy",
                    "-p",
                    shellQuote(prompt),
                    "--model",
                    shellQuote(model),
                    "--output-format",
                    "stream-json",
                    "--dangerously-skip-permissions",
                ].join(" "),
            };
        },
        parseStreamLine(line) {
            try {
                const ev = JSON.parse(line) as {
                    event?: string;
                    step_update?: {
                        step_index?: number;
                        state?: string;
                        step_type?: string;
                        tool_name?: string;
                        text_delta?: string;
                        thought?: string;
                        thinking?: string;
                        reasoning?: string;
                        tool_info?: unknown;
                    };
                    result?: { response?: string; error?: string };
                };
                if (ev.event === "result") {
                    const response = ev.result?.response;
                    const error = ev.result?.error;
                    const resultText =
                        typeof response === "string" && response.length > 0
                            ? response
                            : (error ?? "");
                    return [
                        {
                            type: "result",
                            result: resultText,
                        },
                    ];
                }
                if (ev.event !== "step_update" || !ev.step_update) return [];

                const step = ev.step_update;
                const events: StreamEvent[] = [];
                const thought = [step.thought, step.thinking, step.reasoning].find(
                    (value) => typeof value === "string" && value.length > 0,
                );
                if (thought) {
                    events.push({ type: "text", text: `[thought] ${thought}` });
                }
                if (
                    step.step_type === "agent_response" &&
                    typeof step.text_delta === "string" &&
                    step.text_delta.length > 0
                ) {
                    const index = step.step_index ?? -1;
                    const alreadyStreamed = streamedSteps.has(index);
                    if (step.state === "ACTIVE") {
                        streamedSteps.add(index);
                        events.push({ type: "text", text: step.text_delta });
                    } else if (!alreadyStreamed) {
                        events.push({ type: "text", text: step.text_delta });
                    }
                }
                if (step.step_type === "tool") {
                    events.push({
                        type: "tool_call",
                        name: step.tool_name ?? "tool",
                        args: JSON.stringify(step.tool_info ?? {}),
                    });
                }
                return events;
            } catch {
                // Non-JSON log lines are ignored. verbose still keeps the raw line.
            }
            return [];
        },
    };
}

function ignoreMissing(command: string[], cwd?: string) {
    try {
        execFileSync(command[0], command.slice(1), { cwd, stdio: "inherit" });
    } catch {
        // The temporary merge folder is already gone.
    }
}

function worktreeDir(branch: string) {
    return `.sandcastle/worktrees/${branch.replaceAll("/", "-")}`;
}

function commitLeftovers(dir: string, branch: string) {
    const status = execFileSync("git", ["status", "--porcelain"], {
        cwd: dir,
        encoding: "utf8",
    });
    if (status.trim().length === 0) return;
    execFileSync("git", ["add", "-A"], { cwd: dir, stdio: "inherit" });
    execFileSync(
        "git",
        ["commit", "-m", `chore: keep uncommitted plan files on ${branch}`],
        { cwd: dir, stdio: "inherit" },
    );
}

function mergeInto(branch: string, fromBranch: string) {
    const existing = worktreeDir(branch);
    if (existsSync(existing)) {
        commitLeftovers(existing, branch);
        execFileSync("git", ["merge", "--no-ff", "--no-edit", fromBranch], {
            cwd: existing,
            stdio: "inherit",
        });
        return;
    }

    const dir = `.sandcastle/worktrees/merge-${branch.replaceAll("/", "-")}`;
    ignoreMissing(["git", "worktree", "remove", "--force", dir]);
    execFileSync("git", ["worktree", "add", dir, branch], { stdio: "inherit" });
    try {
        execFileSync("git", ["merge", "--no-ff", "--no-edit", fromBranch], {
            cwd: dir,
            stdio: "inherit",
        });
    } finally {
        ignoreMissing(["git", "worktree", "remove", "--force", dir]);
    }
}

interface GitHubIssue {
    number: number;
    title: string;
    body: string;
}

function fetchQueuedIssues(): GitHubIssue[] {
    const raw = execFileSync(
        "gh",
        ["issue", "list", "--state", "open", "--label", QUEUED_LABEL, "--json", "number,title,body"],
        { encoding: "utf8" },
    );
    const parsed = JSON.parse(raw) as GitHubIssue[];
    if (parsed.length === 0) {
        throw new Error(`No open issues found with label '${QUEUED_LABEL}'. No run starts.`);
    }
    return parsed;
}

function assertClean(planBranch: string) {
    const status = execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" });
    if (status.trim().length > 0) {
        throw new Error(`open project dirty after joining ${planBranch}`);
    }
}

async function runWithLockRetry(
    name: string,
    branch: string,
    launch: () => Promise<{ commits: unknown[] }>,
) {
    for (let attempt = 1; attempt <= 6; attempt++) {
        try {
            const result = await launch();
            console.log(`${name} (${branch}) commits: ${result.commits.length}`);
            return result;
        } catch (error) {
            if (!isGitConfigLock(error) || attempt === 6) throw error;
            console.log(`${name} hit ~/.gitconfig lock, retry ${attempt}/5`);
            await sleep(500 * attempt);
        }
    }
    throw new Error(`${name} (${branch}) failed after git config retries`);
}

const issues = fetchQueuedIssues();
mkdirSync(".sandcastle/logs", { recursive: true });
mkdirSync(".sandcastle/issues", { recursive: true });
mkdirSync(".sandcastle/tmp", { recursive: true });

for (const issue of issues) {
    const runId = String(issue.number);
    const seedPath = `.sandcastle/issues/issue-${runId}.md`;
    writeFileSync(
        seedPath,
        `# Issue #${runId}: ${issue.title}\n\n${issue.body || "No specification body provided."}\n`,
        "utf8",
    );

    const planBranch = `agent/plan-${runId}`;
    const scanBranch1 = `agent/plan-scan-1-${runId}`;
    const scanBranch2 = `agent/plan-scan-2-${runId}`;
    const base = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    console.log(`Starting run for Issue #${runId} (${issue.title}) from base commit ${base}`);

    function fileLog(name: string) {
        return {
            type: "file" as const,
            verbose: true,
            path: `.sandcastle/logs/${runId}-${name}.log`,
        };
    }

    const parallel = [
        {
            name: "plan",
            branch: planBranch,
            promptFile: "./.sandcastle/plan.md",
            model: "gemini-3.8-flash-high",
        },
        {
            name: "plan-scan-1",
            branch: scanBranch1,
            promptFile: "./.sandcastle/plan-scan-1.md",
            model: "gemini-3.8-flash-high",
        },
        {
            name: "plan-scan-2",
            branch: scanBranch2,
            promptFile: "./.sandcastle/plan-scan-2.md",
            model: "gemini-3.8-flash-high",
        },
    ];

    const settled = await Promise.allSettled(
        parallel.map((agent) =>
            runWithLockRetry(agent.name, agent.branch, () =>
                run({
                    name: agent.name,
                    agent: antigravity(agent.model),
                    sandbox: noSandbox(),
                    promptFile: agent.promptFile,
                    promptArgs: { BRANCH: agent.branch, RUN_ID: runId, SEED_PATH: seedPath },
                    branchStrategy: { type: "branch", branch: agent.branch },
                    logging: fileLog(agent.name),
                    idleTimeoutSeconds: IDLE_TIMEOUT_SECONDS,
                }),
            ),
        ),
    );

    for (const [index, result] of settled.entries()) {
        const agent = parallel[index];
        if (result.status === "rejected") {
            throw new Error(`${agent.name} (${agent.branch}) failed for Issue #${runId}. Later issues do not start.`, {
                cause: result.reason,
            });
        }
    }

    mergeInto(planBranch, scanBranch1);
    mergeInto(planBranch, scanBranch2);

    const sequence = [
        {
            name: "implement",
            promptFile: "./.sandcastle/implementer.md",
            model: "gemini-3.8-flash-high",
        },
        {
            name: "review",
            promptFile: "./.sandcastle/reviewer.md",
            model: "gemini-3.8-flash-high",
        },
        {
            name: "tester",
            promptFile: "./.sandcastle/tester.md",
            model: "gemini-3.8-flash-high",
        },
    ];

    for (const step of sequence) {
        await runWithLockRetry(step.name, planBranch, () =>
            run({
                name: step.name,
                agent: antigravity(step.model),
                sandbox: noSandbox(),
                promptFile: step.promptFile,
                promptArgs: { BRANCH: planBranch, RUN_ID: runId, SEED_PATH: seedPath },
                branchStrategy: { type: "branch", branch: planBranch },
                logging: fileLog(step.name),
                idleTimeoutSeconds: IDLE_TIMEOUT_SECONDS,
            }),
        );
    }

    const merger = await runWithLockRetry("merger", "main", () =>
        run({
            name: "merger",
            agent: antigravity("gemini-3.8-flash-high"),
            sandbox: noSandbox(),
            promptFile: "./.sandcastle/merger.md",
            promptArgs: { PLAN_BRANCH: planBranch, RUN_ID: runId },
            branchStrategy: { type: "head" },
            logging: fileLog("merger"),
            idleTimeoutSeconds: IDLE_TIMEOUT_SECONDS,
        }),
    );
    console.log(`merger (${planBranch}) commits: ${merger.commits.length}`);
    assertClean(planBranch);
    console.log(`Joined ${planBranch} for Issue #${runId}`);

    // Update Issue state
    execFileSync("gh", [
        "issue",
        "edit",
        runId,
        "--remove-label",
        QUEUED_LABEL,
        "--add-label",
        COMPLETED_LABEL,
    ]);
    execFileSync("gh", [
        "issue",
        "close",
        runId,
        "--comment",
        `Resolved and merged via Sandcastle pipeline on branch ${planBranch}.`,
    ]);
    console.log(`Closed and transitioned Issue #${runId}`);
}

console.log(`Completed ${issues.length} issue(s)`);

```

---

### File 2: `.sandcastle/plan.md`

```markdown
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

```

---

### File 3: `.sandcastle/plan-scan-1.md`

```markdown
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

```

---

### File 4: `.sandcastle/plan-scan-2.md`

```markdown
---
name: wayfinder-plan-scan-2
hostname: local-workspace
description: Authoritative Wayfinder static codebase scan and dependency cone enumeration skill for the planning node (plan-scan-2, Agent 2); binds strictly to the single specification at {{SEED_PATH}} (derived from GitHub Issue #{{RUN_ID}}), conducts exhaustive deterministic scans of the codebase to identify every component touching required functionality without guessing, sampling, or proposing implementations, records absences without inventing components, and posts the component manifest to GitHub Issue #{{RUN_ID}}.
disable-model-invocation: true
---

# /wayfinder-plan-scan-2: Deterministic Codebase Static Scan, Component Discovery, and Dependency Cone Enumeration (Agent 2)

Role: planning node (plan-scan-2, Agent 2).  
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
   - Write all qualified codebase component paths to `.sandcastle/tmp/scan-2-manifest-{{RUN_ID}}.txt`, one repository-relative path per line.
   - Post the list directly as a comment on GitHub Issue #{{RUN_ID}} using `gh`:
     ```bash
     gh issue comment {{RUN_ID}} --body "$(cat <<'EOF'
<!-- handoff:plan-scan-2 -->
$(cat .sandcastle/tmp/scan-2-manifest-{{RUN_ID}}.txt)
<!-- /handoff:plan-scan-2 -->
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
5. **`INV-HANDOFF-COMMENT-01` (GITHUB ISSUE COMMENT POSTING):** Post qualified paths to GitHub Issue #{{RUN_ID}} bounded strictly by `<!-- handoff:plan-scan-2 -->` and `<!-- /handoff:plan-scan-2 -->`.

---

## 3. Save the work

1. All scans and GitHub issue comments are complete.
2. Run `git status --porcelain`. If it is empty, skip the commit.
3. If it is not empty, `git add` only the files this session created or changed, then `git commit` with a message naming the scan. Do not push.
4. Run `git status --porcelain` again. If it is not empty, stop. Do not output `<promise>COMPLETE</promise>`.
5. If it is empty, output `<promise>COMPLETE</promise>`.

```

---

### File 5: `.sandcastle/implementer.md`

```markdown
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

```

---

### File 6: `.sandcastle/reviewer.md`

```markdown
---
name: wayfinder-reviewer
hostname: local-workspace
description: Wayfinder review for this run only. Reads the implementer manifest from GitHub Issue #{{RUN_ID}} comments, edits only paths listed by the implementer, and posts review results to GitHub Issue #{{RUN_ID}}.
disable-model-invocation: true
---

# /wayfinder-reviewer: Review this run's files

Role: reviewer. Review the files this run named. Do not review the entire repository.

A clarity edit may change how a named file reads. It must not change what that file does.

## Upstream Functional Specification Seed

{{SEED_PATH}}

## Upstream Functional Specification Contents

!`cat {{SEED_PATH}}`

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

```

---

### File 7: `.sandcastle/tester.md`

```markdown
---
name: wayfinder-test-plan
hostname: local-workspace
description: Authoritative Wayfinder test-planning meta-prompt for the test-planning node; ingests upstream plan, implementer, and reviewer manifests from GitHub Issue #{{RUN_ID}} comments, enforces strict payload and assertion laws against actual codebase schemas with zero mocks, charts deterministic integration test decision tickets, and posts the test plan to GitHub Issue #{{RUN_ID}} without writing test code until explicitly authorized.
disable-model-invocation: true
---

# /wayfinder-test-plan: Integration Test Decision Mapping, Payload Admissibility Governance, and Verification Planning

Role: test-plan meta prompt (tester planning node).  
This invocation is strictly **`read-and-plan`**. Do not write tests in this session.

## Upstream Seed Specification Path

{{SEED_PATH}}

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

```

---

### File 8: `.sandcastle/merger.md`

```markdown
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

```