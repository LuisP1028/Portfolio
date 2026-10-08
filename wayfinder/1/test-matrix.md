# Authoritative Integration Test Matrix: Sandcastle Smoke Test (GitHub Issue #1)

**Governing Specification:** [`wayfinder/1/spec.md`](./spec.md) (Sandcastle Issues State Machine Smoke Test)  
**Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)  
**Run Identifier:** `1`  
**Execution Node:** `wayfinder-test-plan`  
**Status:** Canonical Test Plan Locked; Zero Test Code Generated (`INV-BOUNDARY-01` Enforced)

---

## 1. Master Integration Test Matrix

| Component Path & Target Selector | Governing Ticket & Specification | Governing Codebase Schema | Admissible Input Payloads (`INV-PAYLOAD-01`) | Measurable Oracle / `{correct required outputs}` (`INV-ASSERTION-01`) | Explicit Failure States / `{errors}` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `README.md` (Repository Root) | [Ticket 001](./tickets/ticket-001.md), [Ticket 002](./tickets/ticket-002.md), [Ticket 003](./tickets/ticket-003.md)<br>Spec § 2.1, § 4.1 | `FileStatPayload`:<br>- `isFile()`<br>- `size`<br>- `mode` | Observed file system entry on `./README.md` via `fs.statSync`. Zero virtual/mock filesystems. | 1. `stat.isFile() === true`<br>2. `stat.size >= 24` bytes<br>3. File accessible with standard read permissions | 1. `ERR_FILE_NOT_FOUND`: `README.md` does not exist<br>2. Target is a directory, not a file<br>3. File is empty (0 bytes) |
| `README.md` (Final Line Content) | [Ticket 001](./tickets/ticket-001.md), [Ticket 002](./tickets/ticket-002.md), [Ticket 003](./tickets/ticket-003.md)<br>Spec § 2.2, § 3, § 4.2 | `FileContentPayload`,<br>`SmokeTestCommentPayload`:<br>- `rawContent`<br>- `lines`<br>- `finalNonEmptyLine`<br>- `literalString`<br>- `characterCount` | Observed live file buffer read via `fs.readFileSync("README.md", "utf8")`. No synthetic stubs. | 1. `lines[lines.length - 1] === "// sandcastle smoke test"`<br>2. Exact string length is 24 characters<br>3. Exact ASCII bytes match: `// sandcastle smoke test`<br>4. 100% glyph integrity intact | 1. `ERR_CONTENT_MISMATCH`: Line text altered or misspelled<br>2. `ERR_CHAR_COUNT_MISMATCH`: Character count !== 24<br>3. Missing comment slashes or spaces |
| `README.md` (Encoding & Formatting) | [Ticket 001](./tickets/ticket-001.md), [Ticket 003](./tickets/ticket-003.md)<br>Spec § 2.4, § 4.3 | `FileContentPayload`:<br>- `encoding`<br>- `terminalChar`<br>- `byteLength` | Raw binary buffer and UTF-8 decoded string from `./README.md`. | 1. `content.endsWith("\n") === true`<br>2. `content.includes("\r") === false`<br>3. Pure UTF-8 without BOM (`buffer[0..2] !== [0xEF, 0xBB, 0xBF]`) | 1. `ERR_INVALID_TERMINATOR`: Missing trailing LF<br>2. CRLF Windows carriage return present<br>3. `ERR_BOM_PRESENT`: BOM detected |
| Working Tree Scope (Non-Regression) | [Ticket 002](./tickets/ticket-002.md), [Ticket 003](./tickets/ticket-003.md)<br>Spec § 3, § 4.4 | `GitWorkingTreePayload`:<br>- `statusOutput`<br>- `diffOutput`<br>- `touchedFiles` | Output of `git status --porcelain` and `git diff HEAD~1`. | 1. Only `README.md` modified in application scope<br>2. Zero modifications to portfolio HTML, CSS, JS, or images<br>3. Git working tree clean after commit | 1. `ERR_CODEBASE_REGRESSION`: Unintended changes in `index.html`, `css/styles.css`, or other application files |
| Pipeline State Machine Integrity | [Ticket 003](./tickets/ticket-003.md)<br>`wayfinder-test-plan` Instruction 1 | `PipelineManifestPayload`:<br>- `upstreamPlanManifest`<br>- `upstreamImplementerManifest`<br>- `upstreamReviewerManifest` | Ingested GitHub Issue #1 comments bounded by `handoff` tags. | 1. `<!-- handoff:wayfinder-read-and-plan -->` present & non-empty<br>2. `<!-- handoff:implementer -->` present & non-empty<br>3. `<!-- handoff:reviewer -->` present & non-empty | 1. `ERR_UPSTREAM_MANIFEST_CORRUPT`: Missing or empty manifest block |

---

## 2. Test Execution Architecture & Zero Mocks Protocol

### 2.1 Invariant Enforcement
1. **Zero Mocks Mandate (`INV-PAYLOAD-01`):**
   - No mock filesystems (`mock-fs`), fake file descriptors, or synthetic string fixtures.
   - All tests execute directly against the authentic file system mounted at `./README.md` and the authentic Git repository state.
2. **Deterministic Verification Oracles (`INV-ASSERTION-01`):**
   - Content equality is objectively evaluated using exact string comparison (`===`), exact character count (`length === 24`), and byte code verification.
   - Line ending is objectively evaluated via `.endsWith("\n")` and absence of `\r`.
   - File existence is objectively evaluated via `fs.existsSync` and `fs.statSync`.
3. **Fail-Fast Boundary (`INV-FAILFAST-01`):**
   - Any assertion failure surfaces the exact failing oracle ID, expected schema value, and observed value immediately.
4. **Implementation Coding Gate (`INV-BOUNDARY-01`):**
   - Zero executable test code, fixtures, or runners are written in this session. Coding waits on an empty frontier and explicit operator authorization.

---

## 3. Downstream Handoff Guidance

This matrix provides the complete, authoritative specification for downstream integration testing. When authorized by the operator:
- Test implementations should be written as deterministic Node.js assertions checking the actual repository filesystem.
- No additional design decisions, schema inventions, or payload synthesis will be required.
