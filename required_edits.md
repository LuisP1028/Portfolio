# Required Edits: OBJ-04 Video Integration

This document outlines the step-by-step edits necessary to implement the OBJ-04 video functionality, conforming to the `functional_specification.md`.

## 1. File to Modify: `/Users/diesel/Portfolio/Portfolio/index.html`
**Action:** Replace placeholder content in the OBJ-04 card with a `<video>` element.

*   **Location:** Find the `article.card#obj-04-card` element (around line 124).
*   **Target Block:** Inside its `<div class="card-img">`, locate the `<div class="viz-cnn" ...>` which contains the text `[ NEW COMPONENT ASSET ]`.
*   **Deletion:** Remove the entire `<div class="viz-cnn">...</div>` block within `div.card-img`.
*   **Addition:** In its place, insert a `<video>` element with the following configuration:
    *   `src="https://storage.googleapis.com/doom-tagging/platodoom_tagging.mp4"`
    *   Attributes: `autoplay`, `loop`, `muted`, `playsinline`
    *   Class: `class="obj-04-video"`

*The new structure should look like this:*
```html
<div class="card-img">
    <video class="obj-04-video" src="https://storage.googleapis.com/doom-tagging/platodoom_tagging.mp4" autoplay loop muted playsinline></video>
</div>
```

## 2. File to Modify: `/Users/diesel/Portfolio/Portfolio/css/styles.css`
**Action:** Add styling rules for the new video element to ensure proper orientation cropping.

*   **Target Block:** At an appropriate location (e.g., near card image or `.viz-cnn` styles).
*   **Addition:** Add the following CSS rule to force the vertical video to fill the horizontal bounding box by cropping the top and bottom:
```css
.obj-04-video {
    width: 100%;
    height: 100%;
    object-fit: cover; /* This performs the required crop */
    border: 1px solid var(--term-alert);
    box-sizing: border-box;
}
```

## Readiness Check
These granular instructions directly implement the `functional_specification.md` requirements and provide complete architectural context to the coding assistant.
