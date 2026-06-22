# Functional Specification: Modal Stacking Priority

## Overview
This specification details the functionality for resolving a z-index stacking conflict where background page elements (such as the main typography and sticky header) visually bleed through and render on top of the active `terminal-modal`.

## Expected Functionality

### Visual Presentation and Layout Constraints
- **Absolute Stacking Supremacy:** The modal overlay components must assume the absolute highest visual priority on the page when they are invoked.
- **Obscuring Background Content:** When a modal is active, all underlying page content—including elements with elevated z-indexes such as the `.hero-content` and the `header`—must remain strictly behind the modal's backdrop and content layers.
- **No Visual Intersections:** Scrolling the page while the modal is open must not cause any underlying text or elements to pierce through the modal's interface.

### Behavioral Constraints
- No changes to the JavaScript logic controlling the modal toggle state are required.
- The fundamental layout and design of the modal (borders, background filters, inner content) should remain visually identical, with modifications strictly limited to its structural layering priority within the viewport.
