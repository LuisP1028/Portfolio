# Functional Specification

## 1. Objective
The goal is to implement a new "card" component and an associated "terminal-modal" window within the project. These components must be functionally, structurally, and visually identical to the existing deployed unit cards (e.g., `OBJ-01`, `OBJ-02`, `OBJ-03`) and the current `terminal-modal` implementation.

## 2. Desired Functionality: Card Component (`card-id`)

### Structure and Presentation
*   **Grid Placement**: The new component must be rendered as the very **first** item within the `.grid` container, visually preceding the existing `OBJ-01` card and effectively shifting all subsequent items to the right.
*   **Container**: The new item must be housed within an `article` element carrying the `card` class, ensuring it inherits the established layout and styling (padding, borders, background, hover states) of the existing grid items.
*   **Header Area**: The top section must include a `card-header` `div` that prominently displays a unique identifier (e.g., `OBJ-04`) utilizing the `card-id` class. It should also include the standard decorative crosshair/target symbol (`✜`) found in existing cards.
*   **Visual Asset Area**: A dedicated `card-img` section must be present to house project-specific visualizations, animations, or images (e.g., mimicking the CRT overlays, specific waveform SVGs, or pixel grids seen in other objects).
*   **Content Area**: Below the visual asset, the card must feature an `<h3>` heading for the project title and a `<p>` tag for the project description.
*   **Action Buttons**: At the bottom of the card, a `btn-group` container must be provided. This will house interaction points (buttons or anchor links with the `btn` class) that trigger further actions, such as opening a live demo or viewing source code.

### Interactivity
*   The action buttons within the card must be capable of invoking JavaScript functions (similar to existing `onclick="openTerminal(...)"` or `onclick="openMediaModal()"` events) to trigger modal windows or route users to external resources.
*   Specifically, the "LIVE_DEMO" button must trigger the modal and pass the explicit target URL: `https://huggingface.co/spaces/ChoppedCheese/DigitalTwin`.
*   Because the target HuggingFace space is a Docker container (not a native Gradio app), the logic must strictly enforce rendering the external content within an HTML `<iframe>` rather than the default `<gradio-app>` web component.

## 3. Desired Functionality: Terminal Modal (`terminal-modal`)

### Structure and Presentation
*   **Overlay Container**: The new modal must use a full-screen `div` container with the `modal-overlay` class, ensuring it dims the background and sits above all other content.
*   **Content Window**: Inside the overlay, a `modal-content` `div` must be structured to hold the specific modal information.
*   **Header Bar**: The top of the modal window must feature a `modal-header` `div`. This header must include a system-style status message (e.g., `>> REMOTE_LINK_ESTABLISHED // TERMINAL_XX`) and a close button (e.g., `[TERMINATE_SESSION]`).
*   **Body Area**: A `modal-body` container must be present below the header to dynamically load or house the specific content triggered by the card's action buttons (such as an iframe or detailed text).

### Interactivity
*   **Trigger Mechanism**: The modal must be hidden by default and only revealed when specific functions (invoked by the new card's action buttons) are called.
*   **Dismissal Mechanisms**: The modal must be capable of being closed (hidden) via two primary methods:
    1.  Clicking the explicit close button within the modal header.
    2.  Clicking anywhere on the dark overlay background outside of the modal content area (e.g., using an `onclick="if(event.target === this) closeTerminal()"` pattern).

## 4. Constraints
*   **Absolute Parity**: The resulting HTML structure and CSS classes must perfectly mirror the existing patterns established in `index.html`. No novel structural paradigms should be introduced.
*   **No Code Generation**: This document strictly defines the *what*. It deliberately omits any specific HTML snippets, CSS rules, or JavaScript logic required to achieve these outcomes.
