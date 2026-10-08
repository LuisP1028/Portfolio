# Authoritative Integration Test Matrix: Remove CNN OBJ Section (GitHub Issue #2)

**Governing Specification:** [`wayfinder/2/spec.md`](./spec.md) (Remove CNN OBJ Section)  
**Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)  
**Run Identifier:** `2`  
**Execution Node:** `wayfinder-test-plan`  
**Status:** Canonical Test Plan Locked; Zero Test Code Generated (`INV-BOUNDARY-01` Enforced)

---

## 1. Master Integration Test Matrix

| Component Path & Target Selector | Governing Ticket & Specification | Governing Codebase Schema | Admissible Input Payloads (`INV-PAYLOAD-01`) | Measurable Oracle / `{correct required outputs}` (`INV-ASSERTION-01`) | Explicit Failure States / `{errors}` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `index.html`<br>(`#obj-03-card`) | [Ticket 001](./tickets/ticket-001.md), [Ticket 004](./tickets/ticket-004.md), [Ticket 005](./tickets/ticket-005.md)<br>Spec § 2.1, § 4.1 | `DOMTreePayload`:<br>- `rawHTML`<br>- `obj03ElementExists`<br>- `gridClosingTagPresent` | Observed live file buffer read via `fs.readFileSync("index.html", "utf8")`. Zero mock DOM trees. | 1. `!html.includes('id="obj-03-card"')`<br>2. `!html.includes('id="obj-03-content"')`<br>3. `!html.includes('OBJ-03')`<br>4. Closing `</div>` for `.grid` remains intact before `</section>` | 1. `ERR_DOM_ELEMENT_PRESENT`: Residual `#obj-03-card` DOM node found<br>2. Container tag corrupted or unclosed |
| `components/cards/card-cnn.html` | [Ticket 002](./tickets/ticket-002.md), [Ticket 004](./tickets/ticket-004.md), [Ticket 005](./tickets/ticket-005.md)<br>Spec § 2.2, § 4.3 | `FileStatPayload`:<br>- `filePath`<br>- `exists`<br>- `isFile` | Observed filesystem stat via `fs.existsSync` and `fs.statSync`. No virtual filesystem mocks. | 1. `!fs.existsSync("components/cards/card-cnn.html")`<br>2. `fs.existsSync("components/cards/card-ssm.html") === true`<br>3. `fs.existsSync("components/cards/card-gex.html") === true` | 1. `ERR_COMPONENT_FILE_EXISTS`: `card-cnn.html` exists on disk<br>2. `ERR_SIBLING_FILE_MISSING`: Sibling template file deleted or missing |
| `css/animations.css` & `css/modal.css` | [Ticket 003](./tickets/ticket-003.md), [Ticket 004](./tickets/ticket-004.md), [Ticket 005](./tickets/ticket-005.md)<br>Spec § 2.3, § 4.4 | `StylesheetContentPayload`:<br>- `rawContent`<br>- `forbiddenSelectorsFound`<br>- `isSyntaxBalanced` | Observed live stylesheet files read via `fs.readFileSync`. | 1. Zero occurrences of `.viz-cnn`, `.cnn-pixel`, `.cnn-scanner`, or `cnn-stride`<br>2. Sibling keyframes (`@keyframes gex-breathe`) intact<br>3. Balanced braces (`count("{") === count("}")`) in both files | 1. `ERR_CSS_RULE_LINGERING`: Unused CNN visualizer rules present<br>2. `ERR_CSS_SYNTAX_ERROR`: Unbalanced braces or syntax error |
| Application Content & Links (`index.html`, `css/*`) | [Ticket 004](./tickets/ticket-004.md), [Ticket 005](./tickets/ticket-005.md)<br>Spec § 4.2 | `ContentSearchPayload`:<br>- `targetFile`<br>- `forbiddenKeywords`<br>- `matches` | Full-text string search across authentic project files. No synthetic fixtures. | 1. `!content.includes("CONVOLUTIONAL NEURAL NETWORK FOR MALWARE DETECTION")`<br>2. `!content.includes("choppedcnnmalware")`<br>3. `!content.includes("CNN-Virus-Scanner")` | 1. `ERR_KEYWORD_FOUND`: Residual CNN Malware text or URL links detected |
| `index.html`<br>(`#projects .grid` remaining cards) | [Ticket 001](./tickets/ticket-001.md), [Ticket 004](./tickets/ticket-004.md), [Ticket 005](./tickets/ticket-005.md)<br>Spec § 2.4, § 4.5 | `DOMTreePayload`:<br>- `projectCardCount`<br>- `projectCardIds` | Observed live file buffer read via `fs.readFileSync("index.html", "utf8")`. | 1. Exactly 3 `.card` elements in `#projects .grid`<br>2. Card IDs strictly match `OBJ-04` (`#obj-04-card`), `OBJ-01`, and `OBJ-02`<br>3. All action button groups intact (`LIVE_DEMO`, `SRC_CODE`, `WHITE_PAPER`) | 1. `ERR_CARD_COUNT_MISMATCH`: Card count !== 3<br>2. `ERR_REMAINING_CARD_MUTATED`: Missing buttons, altered IDs, or renumbered cards |
| Working Tree Scope (Non-Regression) | [Ticket 004](./tickets/ticket-004.md), [Ticket 005](./tickets/ticket-005.md)<br>Spec § 3, § 4 | `GitWorkingTreePayload`:<br>- `statusOutput`<br>- `diffOutput`<br>- `touchedFiles` | Output of `git status --porcelain` and `git diff HEAD~1`. | 1. Touched application files strictly within authorized set: `{index.html, card-cnn.html, animations.css, modal.css}`<br>2. Zero modifications to JavaScript, chatbox, or main layout styles | 1. `ERR_CODEBASE_REGRESSION`: Unintended file modification outside authorized scope |
| Pipeline State Machine Integrity | [Ticket 005](./tickets/ticket-005.md)<br>`wayfinder-test-plan` Instruction 1 | `PipelineManifestPayload`:<br>- `upstreamPlanManifest`<br>- `upstreamImplementerManifest`<br>- `upstreamReviewerManifest` | Ingested GitHub Issue #2 comments bounded by `handoff` tags. | 1. `<!-- handoff:wayfinder-read-and-plan -->` present & non-empty<br>2. `<!-- handoff:implementer -->` present & non-empty<br>3. `<!-- handoff:reviewer -->` present & non-empty | 1. `ERR_UPSTREAM_MANIFEST_CORRUPT`: Missing or empty manifest block |

---

## 2. Test Execution Architecture & Zero Mocks Protocol

### 2.1 Invariant Enforcement
1. **Zero Mocks Mandate (`INV-PAYLOAD-01`):**
   - No mock DOM objects, virtual filesystems (`mock-fs`), or synthetic string fixtures.
   - All tests execute directly against authentic codebase files on disk (`index.html`, `components/cards/`, `css/animations.css`, `css/modal.css`) and authentic Git telemetry.
2. **Deterministic Verification Oracles (`INV-ASSERTION-01`):**
   - File absence is objectively evaluated via `fs.existsSync(...) === false`.
   - String excision is objectively evaluated via `includes(...) === false`.
   - Card preservation is objectively evaluated via exact card count (`=== 3`) and identifier matching.
   - Stylesheet pruning is objectively evaluated via selector absence and brace balance counts.
3. **Fail-Fast Boundary (`INV-FAILFAST-01`):**
   - Any assertion failure surfaces the exact failing oracle ID, expected schema value, and observed value immediately.
4. **Implementation Coding Gate (`INV-BOUNDARY-01`):**
   - Zero executable test code, fixtures, or runners are written in this session. Coding waits on an empty frontier and explicit operator authorization.

---

## 3. Downstream Handoff Guidance

This matrix provides the complete, authoritative specification for downstream integration testing. When authorized by the operator:
- Test implementations should be written as deterministic Node.js assertions checking the actual repository filesystem and DOM state.
- No additional design decisions, schema inventions, or payload synthesis will be required.
