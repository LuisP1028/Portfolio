# Functional Specification: Hero Background Particle Waves

## Overview
This document specifies the desired behavior and presentation of an interactive 3D particle wave visualization, which will serve as the background for the hero section of the portfolio.

## Desired Functionality
1. **Interactive Background**: A high-density 3D particle wave effect must render continuously behind the text and interactive elements of the hero section.
2. **Animation Dynamics**: The particles must animate autonomously, forming layered sine and cosine waves. 
3. **Cursor Reactivity**: The particle field must dynamically react to the user's cursor position. Specifically, particles in proximity to the cursor should elevate ("lift") and shift color, creating a trailing wake effect behind the cursor movement.
4. **Fixed Viewpoint**: The camera perspective of the 3D scene must remain fixed at all times. Users must not be able to zoom, pan, or rotate the scene.
5. **Ethereal Glow**: The visualization must incorporate a bloom effect to give the particles an ethereal, glowing appearance.
6. **Non-Obstructive Layering**: The visualization must be positioned entirely behind the hero text, hazard tape, and interactive buttons. It must allow mouse movements to be detected for its interaction logic but must not block clicks or hover states for the HTML elements layered above it.
7. **Responsive & Performant**: The visualization must dynamically resize its canvas to match the dimensions of the hero section. Additionally, the system should allow for graceful performance degradation (e.g., lower particle count or disabled bloom on less capable devices) to preserve overall site responsiveness. No interactive controls or GUI panels should be visible to the user.
