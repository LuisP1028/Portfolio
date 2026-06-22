# Required Edits: Inserting HuggingFace Space

## Target File: `/Users/diesel/Portfolio/Portfolio/index.html`

### Edit 1: Update the Modal Trigger for the HuggingFace Space
**Location:** Inside `<section id="projects">`, locate the newly inserted `obj-04-card` `article`. Find the `<div class="btn-group">` near the bottom of this article.
**Required Modifications:**
1.  Locate the button currently defined as:
    `<button onclick="openTerminal04('https://huggingface.co/spaces/example')" class="btn">LIVE_DEMO</button>`
2.  **Action:** Replace the entire line with the following explicit command, utilizing the direct-embed `.hf.space` domain to bypass security blocks, and the second argument `true` to force iframe rendering for the Docker space:
    `<button onclick="openTerminal04('https://choppedcheese-digitaltwin.hf.space', true)" class="btn">LIVE_DEMO</button>`

### Edit 2: Update Card Metadata to Reflect the New Project
**Location:** Still inside the `obj-04-card` `article` in `index.html`.
**Required Modifications:**
1.  **Card Title:** Locate the `<h3>NEW COMPONENT TITLE</h3>` tag and update its inner text to match the name of the HuggingFace space project.
2.  **Card Description:** Locate the `<p>` tag immediately following the title. Replace the placeholder description with a concise summary of what the HuggingFace space does and its architectural relevance.
3.  **Source Code Link:** Locate the `<a href="#" class="btn">SRC_CODE</a>` anchor tag. Replace `#` with the link to the project's repository or the specific files tab of the HuggingFace space (e.g., `https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME/tree/main`).
4.  **Header Label (Optional):** If `OBJ-04` needs to be renamed to fit a specific naming convention (e.g., `OBJ-05`), update the `<span class="card-id">OBJ-04</span>` tag.

*Note: The core functionality to render the space inside `terminal-modal-04` is already completely hooked up in `js/modal-logic.js`. The only required code edit is passing the correct URL and boolean flag via the `onclick` attribute.*
