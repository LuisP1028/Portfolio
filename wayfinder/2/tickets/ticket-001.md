---
ticket_id: "001"
title: "DOM Element Removal for CNN OBJ-03 Card in index.html"
type: task
status: resolved
claimed_by: "wayfinder-read-and-plan"
blocked_by: []
governing_specification: "wayfinder/2/spec.md"
---

# Ticket 001: DOM Element Removal for CNN OBJ-03 Card in index.html

## Question
How should the live DOM markup in `index.html` be transformed to remove the CNN OBJ-03 card entirely while preserving the surrounding card hierarchy, container integrity, and layout flow of the projects grid?

## Context & Specification Grounding
- **Governing Specification:** [`wayfinder/2/spec.md`](../spec.md) § 1 (Problem Definition), § 2 (Functional Requirements), § 3 (Constraints), § 4 (Acceptance Criteria).
- **Target Call-Sites:**
  - `index.html` lines 228–308 (`<article class="card" id="obj-03-card">...</article>`).
- **Current Workspace State:**
  - `index.html` contains 4 cards inside `<section id="projects"><div class="grid">`:
    1. `#obj-04-card` (EVIL DIGITAL TWIN)
    2. `.card` with `<span class="card-id">OBJ-01</span>` (STATE SPACE MODEL WITH BAYESIAN INFERENCE)
    3. `.card` with `<span class="card-id">OBJ-02</span>` (OPTIONS DEALER POSITIONING)
    4. `#obj-03-card` (CONVOLUTIONAL NEURAL NETWORK FOR MALWARE DETECTION)

## Architectural Decisions to Lock
1. **Physical DOM Deletion vs. CSS Masking:**
   - The `<article class="card" id="obj-03-card">` element and all its descendant nodes (lines 228–308) are completely deleted from `index.html`.
   - CSS hiding (`display: none`, `visibility: hidden`) is rejected under `INV-FAILFAST-01`.
2. **Container Boundary Preservation:**
   - The preceding closing tag `</article>` of OBJ-02 (line 226) remains intact.
   - The closing tags `</div>` (closing `<div class="grid">`) and `</section>` (closing `<section id="projects">`) at lines 310–311 remain intact.
3. **Identifier Stability:**
   - The remaining cards retain their existing DOM IDs and classes:
     - `#obj-04-card` remains `OBJ-04`
     - Second card remains `OBJ-01`
     - Third card remains `OBJ-02`
   - No card renumbering or renaming is performed.

## Scope & Invariant Guardrails
- **In Scope:** Deletion of `<article class="card" id="obj-03-card">` from `index.html`.
- **Out of Scope:** Component template deletion (Ticket 002), CSS pruning (Ticket 003), verification assertions (Ticket 004).

---

## Resolution

### 1. Concrete Transformation Specification for `index.html`
- **Target File Path:** `index.html` (relative to repository root).
- **Target Range:** Lines 228 to 308 (inclusive).
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
- **Replacement:** The entire element block is excised, leaving valid whitespace between the preceding `</article>` and the closing `</div>` of `.grid`.

### 2. Architectural Verification & Invariant Proof
- **DOM Removal Invariant (`INV-DOM-REMOVAL`):** No node with ID `obj-03-card` or class `viz-cnn` remains in the DOM tree of `index.html`.
- **Card Hierarchy Invariant (`INV-PRESERVE-REMAINING`):** All 3 remaining cards (`OBJ-04`, `OBJ-01`, `OBJ-02`) retain 100% of their markup, attributes, content, and interactive button handlers.
- **Grid Structure Invariant (`INV-GRID-INTEGRITY`):** `<div class="grid">` remains well-formed with valid opening and closing tags.

### 3. Status & Downstream Unblocking
- **Claimed by:** `wayfinder-read-and-plan`
- **Resolution Status:** `resolved`
- **Downstream Unblocking:** Unblocks [Ticket 002](./ticket-002.md), [Ticket 003](./ticket-003.md), and [Ticket 004](./ticket-004.md).
