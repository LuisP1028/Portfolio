# Required Edits: Forcing Iframe Rendering for Gradio Spaces

## Target File: `/Users/diesel/Portfolio/Portfolio/index.html`

### Edit 1: Update the Modal Trigger for OBJ-02 (ChoppedGreeks)
**Location:** Inside `<section id="projects">`, locate the `article` representing `OBJ-02`. Find the `<div class="btn-group">` near the bottom of this article.
**Required Modifications:**
1.  Locate the button currently defined as:
    `<button onclick="openTerminal('https://choppedcheese-choppedgreeks.hf.space')" class="btn">LIVE_DEMO</button>`
2.  **Action:** Replace the entire line with the following explicit command, passing `true` as the second argument to force the `openTerminal` logic to render the space inside an `<iframe>` rather than the `<gradio-app>` web component:
    `<button onclick="openTerminal('https://choppedcheese-choppedgreeks.hf.space', true)" class="btn">LIVE_DEMO</button>`

### Edit 2: Update the Modal Trigger for OBJ-03 (ChoppedCNNMalware)
**Location:** Inside `<section id="projects">`, locate the `article` representing `OBJ-03`. Find the `<div class="btn-group">` near the bottom of this article.
**Required Modifications:**
1.  Locate the button currently defined as:
    `<button onclick="openTerminal('https://choppedcheese-choppedcnnmalware.hf.space')" class="btn">LIVE_DEMO</button>`
2.  **Action:** Replace the entire line with the following explicit command, passing `true` as the second argument to force the `openTerminal` logic to render the space inside an `<iframe>` rather than the `<gradio-app>` web component:
    `<button onclick="openTerminal('https://choppedcheese-choppedcnnmalware.hf.space', true)" class="btn">LIVE_DEMO</button>`
