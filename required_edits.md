# Required Edits: OBJ-04 Video Crop Adjustment

This document outlines the step-by-step edits necessary to adjust the visual cropping of the OBJ-04 video element, conforming to the `functional_specification.md`.

## 1. File to Modify: `/Users/diesel/Portfolio/Portfolio/css/styles.css`
**Action:** Update the CSS class `.obj-04-video` to adjust the vertical object position.

*   **Location:** Find the `.obj-04-video` class definition at the bottom of the file.
*   **Addition:** Add the `object-position: top;` property to force the cropping logic to prioritize the top of the video (the model's face), rather than the default center vertical alignment.

*The updated class should look exactly like this:*
```css
.obj-04-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top; /* Adjusts focal point to the top edge */
    border: 1px solid var(--term-alert);
    box-sizing: border-box;
}
```

## Readiness Check
These granular instructions directly implement the `functional_specification.md` requirements. The singular addition of the `object-position` property fulfills the layout constraints without affecting other video attributes.
