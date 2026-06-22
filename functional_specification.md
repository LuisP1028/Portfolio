# Functional Specification: Hero Background Full-Bleed Framing Fix

## Overview
This document specifies the exact functional behavior required to resolve a visual framing issue where a large, empty black void appears between the sticky header and the particle waves inside the hero section.

## Desired Functionality
1. **Full-Bleed Visual Coverage**: The interactive particle wave visualization must visually span the entire vertical height of the `.hero` section canvas. There must be no awkward empty "sky" space at the top of the section.
2. **Immersive Camera Framing**: The 3D camera within the Three.js scene must be repositioned and re-angled to frame the particle grid continuously from top to bottom.
3. **Preservation of Existing Logic**: The camera adjustment must not break or alter the core underlying math for particle positions, wave speeds, bloom physics, or the mouse interaction tracking relative to the canvas.
