# Master Component-to-Edit Matrix: Remove CNN OBJ Section

**Governing Specification:**
- [`wayfinder/2/spec.md`](./spec.md) (Remove CNN OBJ Section)
- Upstream: GitHub Issue #2 (`Remove the CNN OBJ section entirely.`)

**Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)  
**Run Identifier:** `2`  
**Execution Node:** `wayfinder-read-and-plan`  
**Status:** Canonical Plan Locked; Zero Architectural Ambiguity

---

## 1. Master Component-to-Edit Matrix

| Component Path | Target Lines / Symbols | Governing Ticket | Nature of Transformation | Invariants & Contracts Locked |
| :--- | :--- | :--- | :--- | :--- |
| `index.html` | Lines 228–308 (`#obj-03-card`) | [Ticket 001](./tickets/ticket-001.md), [Ticket 004](./tickets/ticket-004.md) | Delete entire `<article class="card" id="obj-03-card">...</article>` DOM node and its children from `.grid`. | `INV-DOM-REMOVAL`: Completely removes OBJ-03 card from DOM; `INV-PRESERVE-REMAINING`: Keeps OBJ-04, OBJ-01, OBJ-02 100% intact; `INV-GRID-INTEGRITY`: Retains valid `.grid` container closing tags. |
| `components/cards/card-cnn.html` | Entire File (Lines 1–37) | [Ticket 002](./tickets/ticket-002.md), [Ticket 004](./tickets/ticket-004.md) | Permanently delete file from repository filesystem (`git rm` / `unlink`). | `INV-FILE-DELETE`: Eliminates orphaned modular component template; `INV-SIBLING-PRESERVE`: Preserves `card-ssm.html` and `card-gex.html`. |
| `css/animations.css` | Lines 50–59 (`/* VIZ-03: CNN KERNEL SCANNER */`) | [Ticket 003](./tickets/ticket-003.md), [Ticket 004](./tickets/ticket-004.md) | Delete `/* VIZ-03: CNN KERNEL SCANNER */`, `.viz-cnn`, `.cnn-pixel`, `.cnn-scanner`, and `@keyframes cnn-stride`. | `INV-CSS-PRUNE`: Removes dead scanner CSS and animation rules; `INV-CSS-SYNTAX`: Preserves valid stylesheet syntax. |
| `css/modal.css` | Lines 50–59 (`/* VIZ-03: CNN KERNEL SCANNER */`) | [Ticket 003](./tickets/ticket-003.md), [Ticket 004](./tickets/ticket-004.md) | Delete `/* VIZ-03: CNN KERNEL SCANNER */`, `.viz-cnn`, `.cnn-pixel`, `.cnn-scanner`, and `@keyframes cnn-stride`. | `INV-CSS-PRUNE`: Removes dead scanner CSS and animation rules; `INV-CSS-SYNTAX`: Preserves valid stylesheet syntax. |

---

## 2. Detailed Component Transformation Specifications

### 2.1 File: `index.html`

#### Edit 1: DOM Node Removal for OBJ-03 Card
- **Target Position:** Lines 228 to 308 (within `<section id="projects"><div class="grid">`).
- **Target Content to Remove:**
  ```html
                <article class="card" id="obj-03-card">
                    <div class="card-header">
                        <span class="card-id">OBJ-03</span>
                        <div style="font-size:1.5rem;">✜</div>
                    </div>

                    <div id="obj-03-content">
                        <div class="card-img">
                            <div class="viz-cnn">
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>
                                <div class="cnn-pixel"></div>

                                <div class="cnn-scanner"></div>

                                <div
                                    style="position:absolute; bottom: 5px; left: 5px; font-size: 0.6rem; color: var(--term-alert); background: rgba(0,0,0,0.8); padding: 2px;">
                                    >> THREAT_DETECTED
                                </div>
                            </div>
                        </div>

                        <h3>CONVOLUTIONAL NEURAL NETWORK FOR MALWARE DETECTION</h3>
                        <p>CNN malware scanner: converts binaries to grayscale images, extracts statistical features,
                            classifies with deep learning. Proof-of-concept.</p>
                    </div>

                    <div class="btn-group">
                        <button onclick="openTerminal('https://choppedcheese-choppedcnnmalware.hf.space', true)"
                            class="btn">LIVE_DEMO</button>
                        <a href="https://github.com/LuisP1028/CNN-Virus-Scanner" target="_blank"
                            class="btn">SRC_CODE</a>
                    </div>
                </article>
  ```
- **Rationale & Invariants:**
  - `INV-DOM-REMOVAL`: Completely removes the live DOM node and its descendants from the HTML document.
  - `INV-PRESERVE-REMAINING`: Preserves the preceding `#obj-04-card`, `OBJ-01`, and `OBJ-02` cards without renumbering or modification.
  - `INV-GRID-INTEGRITY`: Preserves the closing `</div>` of `.grid` and closing `</section>` of `#projects`.

---

### 2.2 File: `components/cards/card-cnn.html`

#### Edit 1: Modular Component File Removal
- **Target Position:** Entire file `components/cards/card-cnn.html`.
- **Transformation Action:** Delete file from disk (`git rm components/cards/card-cnn.html`).
- **Rationale & Invariants:**
  - `INV-FILE-DELETE`: Ensures no orphaned or dead component files linger in the repository.
  - `INV-SIBLING-PRESERVE`: Leaves `card-ssm.html` and `card-gex.html` untouched.

---

### 2.3 Files: `css/animations.css` & `css/modal.css`

#### Edit 1: Pruning Dedicated VIZ-03 Kernel Scanner Rules
- **Target Position:** Lines 50 to 59 in both files.
- **Target Content to Remove:**
  ```css
  /* VIZ-03: CNN KERNEL SCANNER */
  .viz-cnn { container-type: inline-size; width: 100%; height: 100%; background: #050505; display: grid; grid-template-columns: repeat(10, 1fr); grid-template-rows: repeat(5, 1fr); gap: 1px; position: relative; overflow: hidden; padding: 1px; }
  .cnn-pixel { background: #111; transition: background 0.2s; }
  .cnn-pixel:nth-child(odd) { background: #161616; }
  .cnn-pixel:nth-child(3n) { background: #1a1a1a; }
  .cnn-pixel:nth-child(7n) { background: #202020; }
  .cnn-pixel:nth-child(5n):hover { background: #444; }
  .cnn-scanner { position: absolute; z-index: 10; pointer-events: none; width: 30%; height: 60%; border: 2px solid #ff0033; box-shadow: 0 0 15px #ff0033, inset 0 0 20px rgba(255, 0, 50, 0.1); background: rgba(255, 0, 50, 0.05); animation: cnn-stride 4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
  .cnn-scanner::after { content: "KERNEL_3x3"; position: absolute; bottom: clamp(-18px, -5cqi, -12px); left: 0; font-size: clamp(6px, 2.5cqi, 9px); color: #ff0033; font-family: var(--font-mono); white-space: nowrap; letter-spacing: 1px; text-shadow: 0 0 4px #ff0033; }
  @keyframes cnn-stride { 0% { left: 0%; top: 0%; border-color: #ff0033; } 20% { left: 70%; top: 0%; } 40% { left: 70%; top: 40%; border-color: #fff; } 50% { border-color: #ff0033; } 60% { left: 0%; top: 40%; } 80% { left: 0%; top: 0%; border-color: #fff; } 100% { left: 0%; top: 0%; border-color: #ff0033; } }
  ```
- **Rationale & Invariants:**
  - `INV-CSS-PRUNE`: Prunes dead styles and unused keyframe animations from the stylesheet bundle.
  - `INV-CSS-SYNTAX`: Preserves valid stylesheet syntax across surrounding rules.

---

## 3. Verification & Testing Oracles Table

| Oracle ID | Verification Target | Deterministic Assertion | Pass Condition |
| :--- | :--- | :--- | :--- |
| **ORACLE-01** | `index.html` DOM | `!html.includes('id="obj-03-card"')` | Evaluates to `true` |
| **ORACLE-02** | File System | `!fs.existsSync("components/cards/card-cnn.html")` | Evaluates to `true` |
| **ORACLE-03** | Keyword Eradication | `!html.includes("choppedcnnmalware") && !html.includes("CNN-Virus-Scanner")` | Evaluates to `true` |
| **ORACLE-04** | Remaining Cards Count | Count of `.card` elements in `#projects .grid` strictly equals 3 | Exactly 3 cards present (`OBJ-04`, `OBJ-01`, `OBJ-02`) |
| **ORACLE-05** | CSS Dead-Code Pruning | Neither `css/animations.css` nor `css/modal.css` contains `viz-cnn` or `cnn-stride` | Evaluates to `true` |
| **ORACLE-06** | Repo Non-Regression | `git diff --stat` touches exclusively specified components | Zero unintended modifications |
