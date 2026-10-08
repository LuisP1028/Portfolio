import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
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
mkdirSync(".sandcastle/tmp", { recursive: true });

for (const issue of issues) {
    const runId = String(issue.number);

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
                    promptArgs: { BRANCH: agent.branch, RUN_ID: runId },
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
                promptArgs: { BRANCH: planBranch, RUN_ID: runId },
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

