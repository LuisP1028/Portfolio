# Required Edits: Modal Stacking Priority

## Target Files
1. `/Users/diesel/Portfolio/Portfolio/css/modal.css`

## Step-by-Step Edit Instructions

### 1. Elevate Modal Overlay Stacking Context
- **Locate**: The `.modal-overlay` class block in `css/modal.css` (around line 141).
- **Modification**: 
  - Change `z-index: 10000;` to `z-index: 100000;`. 
  - **Reasoning**: The `.hero-content` holds a `z-index` of `10001` and the newly updated sticky `header` holds a `z-index` of `10005`. By elevating `.modal-overlay` to `100000`, the modal system is guaranteed to command absolute supremacy in the viewport stacking context, forcing all background typography and navigation elements firmly behind the modal backdrop.

## Logical Outcome
With the modal z-index decisively anchored above all other overlapping systems, opening any modal interface will flawlessly blanket the screen. Scrolling while a modal is active will no longer allow the underlying typography to bleed through, fulfilling the `{functionality}` requirements specified.
