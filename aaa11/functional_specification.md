# Functional Specification: Hero Background Z-Axis Stacking Fix

## Overview
This document specifies the exact functional behavior required to resolve a layout bug where the Three.js canvas incorrectly renders within the standard document flow, pushing down the hero text content rather than resting behind it as a true background.

## Desired Functionality
1. **Absolute Background Positioning**: The particle wave visualization (`#hero-particles`) must function strictly as a non-obstructive background element to the `.hero` section. It must be completely removed from the flexbox document flow.
2. **Z-Axis Hierarchy**: The canvas must be correctly positioned in the Z-axis (via CSS stacking contexts) to guarantee it rests entirely behind `.hero-content` and the `.hazard-tape-wrapper`. 
3. **Unobstructed Interactivity**: The hero text and "INITIATE_VIEW" buttons (which possess `z-index: 10001`) must sit cleanly above the canvas and remain fully clickable, without the canvas stealing pointer events.
4. **Cache-Busting Integration**: To guarantee that returning browsers (or the current session) instantly respect the updated CSS positioning rules, the CSS stylesheet linkage must implement a cache-busting query parameter (e.g., `?v=1.1`). This prevents aggressive browser caching from ignoring the newly added absolute positioning rules that take the canvas out of the layout flow.
