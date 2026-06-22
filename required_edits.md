# Required Edits: Hero Background Aesthetic Unification

This document provides granular, step-by-step edit instructions to replace the default rainbow color spectrum with the project's signature "Industrial Cyberpunk" orange-red palette.

## 1. Modifying `js/hero-particles.js`
**Target File**: `/Users/diesel/Portfolio/Portfolio/js/hero-particles.js`

**A. Initial Geometry Color Setup**
- **Location**: Inside the initial particle setup loop (around lines 53-56).
- **Action**: Replace the static rainbow hue assignment with a baseline red-orange hue.
- **Change**:
  ```diff
  - const hue = (distance * 0.1) % 1;
  - color.setHSL(hue, 0.8, 0.6);
  + const hue = 0.02 + (Math.random() * 0.04); // Base red/orange variance
  + color.setHSL(hue, 0.8, 0.4); // Darker, highly saturated resting state
  ```

**B. Dynamic Animation Loop Colors**
- **Location**: Inside the `animate` function, within the vertex color update loop (around lines 96-99).
- **Action**: Modify the dynamic HSL math so the resting state stays near the `#ff3c00` aesthetic (hue ~0.04), while `mouseInfluence` mathematically pushes the hue toward a hazard-tape yellow (hue ~0.12) and spikes the lightness to trigger the bloom effect.
- **Change**:
  ```diff
  - const hue = (distance * 0.1 + time * 0.1 + mouseInfluence * 0.2) % 1;
  - const saturation = 0.8 + mouseInfluence * 0.2;
  - const lightness = 0.5 + Math.sin(time + distance * 0.5) * 0.2 + mouseInfluence * 0.3;
  + // Shift hue from base red/orange (0.02) towards hot yellow (0.12) based on mouse proximity
  + const hue = 0.02 + (mouseInfluence * 0.1); 
  + const saturation = 0.8 + (mouseInfluence * 0.2);
  + // Resting lightness varies softly; mouse proximity creates a bright flash for bloom
  + const lightness = 0.3 + (Math.sin(time + distance * 0.5) * 0.15) + (mouseInfluence * 0.5);
  ```
