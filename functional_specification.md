# Functional Specification: Hero Background Aesthetic Unification

## Overview
This document specifies the exact functional behavior required to replace the default rainbow spectrum of the Three.js particle waves with a color palette that strictly adheres to the project's "Industrial Cyberpunk" aesthetic.

## Desired Functionality
1. **Core Aesthetic Palette**: The particle waves must entirely abandon the full-spectrum HSL cycle. Instead, they must be mathematically constrained to variations of the project's primary accent color (`#ff3c00`, a bright orange-red).
2. **Resting State**: When not directly influenced by the mouse, the particles should emit a subtle, dimmer "ember" glow—utilizing a darker red/orange hue with reduced lightness to create a moody, high-contrast atmospheric background that does not distract from the hero text.
3. **Interactive Reactivity**: When the mouse hovers near particles, the system's `mouseInfluence` mathematics must dynamically shift the affected particles into a highly saturated, extremely bright hot-orange or yellow-orange (simulating the color of the hazard tape or a sudden flare of energy).
4. **Bloom Synergy**: The updated HSL values must synergize with the existing `UnrealBloomPass`, ensuring the brightest interactive spots bloom aggressively while the resting state remains softly glowing.
