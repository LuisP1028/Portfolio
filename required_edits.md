# Required Edits: Hero Background Full-Bleed Framing Fix

This document outlines the granular code changes needed to reframe the Three.js camera to fill the top of the hero section.

## 1. Modifying `js/hero-particles.js`
**Target File**: `/Users/diesel/Portfolio/Portfolio/js/hero-particles.js`

**A. Camera Repositioning**
- **Location**: Near line 23, where the camera's position and lookAt vectors are hardcoded.
- **Action**: Lower the camera's `y` position to create a shallower viewing angle (pushing the horizon up), and center it on the X-axis for a more symmetrical sweep. Tilt the camera slightly downwards by targeting a negative `y` to visually push the particle plane up into the black void.
- **Change**:
  ```diff
  - camera.position.set(15, 10, 15);
  - camera.lookAt(0, 0, 0);
  + camera.position.set(0, 5, 22);
  + camera.lookAt(0, -3, 0);
  ```
