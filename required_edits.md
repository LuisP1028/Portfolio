# Required Edits

## Target File: `/Users/diesel/Portfolio/Portfolio/index.html`

### Edit 1: Insert New Card (OBJ-04)
**Location:** Inside `<section id="projects">`, specifically within the `<div class="grid">`. The new card should be inserted immediately before the `OBJ-01` card (around line 124), making it the first item in the grid and pushing the rest to the right.
**Required Additions:**
1.  Add a new `<article class="card" id="obj-04-card">`.
2.  Inside the article, add a `<div class="card-header">`.
    *   Inside the header, add `<span class="card-id">OBJ-04</span>`.
    *   Next to it, add `<div style="font-size:1.5rem;">✜</div>`.
3.  Below the header, add a `<div class="card-img">`.
    *   Inside this div, create a new visualization container (e.g., `<div class="viz-custom">` or reuse an existing visualization class). If keeping it identical structurally, provide the placeholder markup for the visualization.
4.  Below the image container, add an `<h3>NEW COMPONENT TITLE</h3>`.
5.  Below the title, add a `<p>Description of the new component functionality...</p>`.
6.  At the bottom of the article, add a `<div class="btn-group">`.
    *   Add a button to trigger the new modal: `<button onclick="openTerminalCustom('terminal-modal-04')" class="btn">LIVE_DEMO</button>`. Note: A unique trigger mechanism or ID is required so it does not overwrite the existing modal.
    *   Add a secondary link/button: `<a href="#" class="btn">SRC_CODE</a>`.

### Edit 2: Insert New Terminal Modal (TERMINAL_04)
**Location:** Near the bottom of the file, right after the existing `<div id="terminal-modal" ...>` (around line 328).
**Required Additions:**
1.  Add a new modal overlay container: `<div id="terminal-modal-04" class="modal-overlay" onclick="if(event.target === this) document.getElementById('terminal-modal-04').style.display='none'">`. (Alternatively, if extending `closeTerminal()` function to handle specific IDs, use that method, but currently `closeTerminal()` in `modal-logic.js` might be hardcoded to `terminal-modal`. For now, use inline style or ensure `js/modal-logic.js` is updated).
2.  Inside the overlay, add `<div class="modal-content">`.
3.  Inside the content, add `<div class="modal-header">`.
    *   Inside the header, add the status text: `<span>>> REMOTE_LINK_ESTABLISHED // TERMINAL_04</span>`.
    *   Add the close button: `<button class="close-btn" onclick="document.getElementById('terminal-modal-04').style.display='none'">[TERMINATE_SESSION]</button>`.
4.  Below the header, add `<div class="modal-body" id="terminal-body-04"></div>`.

## Target File: `/Users/diesel/Portfolio/Portfolio/js/modal-logic.js` (Optional/Recommended depending on scale)

### Edit 1: Expand Modal Control Logic
**Location:** Inside `js/modal-logic.js`
**Required Additions:**
1.  If the existing `openTerminal` and `closeTerminal` functions are hardcoded to ID `terminal-modal`, we need to refactor them or add `openTerminal04()` and `closeTerminal04()` to handle the specific ID `terminal-modal-04`.
2.  *Alternative Refactor*: Update `openTerminal(url, modalId = 'terminal-modal')` so it can accept the ID of the modal to open, keeping the code DRY.

*Note: As per instructions, NO CODE is generated yet. These are strictly the structural steps required for the coding assistant to execute.*
