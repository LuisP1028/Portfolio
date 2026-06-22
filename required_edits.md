# Required Edits: Hero Background Z-Axis Stacking Fix

This document provides granular, step-by-step edit instructions to resolve the layout shift where the particle wave canvas pushes `.hero-content` down instead of layering behind it.

## Root Cause Analysis
The `<canvas id="hero-particles">` was successfully added to `index.html`, and `position: absolute` was added to `styles.css`. However, because browsers heavily cache CSS files, the old `styles.css` (without the absolute positioning rule) was likely loaded by the browser, while the new `index.html` (containing the canvas) was loaded. This forced the canvas to render as an inline/block element within the `.hero` flex container, physically pushing the text downward.

## 1. Modifying `index.html`
**Target File**: `/Users/diesel/Portfolio/Portfolio/index.html`

**A. CSS Cache Busting**
- **Location**: In the `<head>`, specifically the link tag for `styles.css`.
- **Action**: Append a version query string to force the browser to request the updated file.
- **Change**:
  ```diff
  - <link rel="stylesheet" href="css/styles.css">
  + <link rel="stylesheet" href="css/styles.css?v=1.1">
  ```

**B. Inline Absolute Positioning (Fail-safe)**
- **Location**: Inside `<section class="hero">`.
- **Action**: Apply inline CSS directly to the `<canvas>` tag to guarantee that absolute positioning is enforced even if stylesheet caching fails.
- **Change**:
  ```diff
  - <canvas id="hero-particles"></canvas>
  + <canvas id="hero-particles" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none;"></canvas>
  ```
