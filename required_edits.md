# Required Edits: Hero Background Particle Waves

This document provides extremely detailed, step-by-step edit instructions to implement the Three.js interactive particle waves into the `index.html` hero section, adapting the provided `rawwaves.js` logic.

## 1. Modifying `index.html`
**Target File**: `/Users/diesel/Portfolio/Portfolio/index.html`

**A. Import Map Integration**
- **Location**: Inside the `<head>` tag, ideally below the CSS links.
- **Action**: Add the `<script type="importmap">` definition from `rawwaves.js`, but omit the `lil-gui` dependency since GUI is to be removed.
- **Code Addition**:
  ```html
  <script type="importmap">
  {
      "imports": {
          "three": "https://unpkg.com/three@0.162.0/build/three.module.js",
          "three/addons/": "https://unpkg.com/three@0.162.0/examples/jsm/"
      }
  }
  </script>
  ```

**B. Canvas Injection**
- **Location**: Inside `<section class="hero">`, as the very first child before `<div class="hero-content">`.
- **Action**: Inject the canvas element.
- **Code Addition**:
  ```html
  <canvas id="hero-particles"></canvas>
  ```

**C. Module Script Inclusion**
- **Location**: Right before the closing `</body>` tag.
- **Action**: Include the new logic script as a module.
- **Code Addition**:
  ```html
  <script type="module" src="js/hero-particles.js"></script>
  ```

## 2. Modifying `css/styles.css`
**Target File**: `/Users/diesel/Portfolio/Portfolio/css/styles.css`

**A. Canvas Positioning**
- **Location**: Below the `.hero-content` CSS rules.
- **Action**: Add absolute positioning to strictly bind the canvas to the `.hero` container and layer it behind the text.
- **Code Addition**:
  ```css
  #hero-particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1; /* Sits behind hero-content which is z-index: 10001 */
      pointer-events: none; /* Let the global window listener handle mouse events */
  }
  ```
*(Note: `.hero` is already correctly set to `position: relative` and `overflow: hidden` in the existing stylesheet.)*

## 3. Creating `js/hero-particles.js`
**Target File**: `/Users/diesel/Portfolio/Portfolio/js/hero-particles.js`

**A. Initialization & Imports**
- Create a new file.
- Import `THREE`, `EffectComposer`, `RenderPass`, and `UnrealBloomPass`. 
- **DO NOT** import `OrbitControls` or `lil-gui`.

**B. Three.js Setup**
- Fetch the canvas: `const canvas = document.getElementById('hero-particles');`
- Fetch the container: `const heroSection = document.querySelector('.hero');`
- Track container dimensions: `let width = heroSection.clientWidth; let height = heroSection.clientHeight;`
- Instantiate the scene and camera using `width` and `height`.
- Set camera position to `camera.position.set(15, 10, 15);` and call `camera.lookAt(0, 0, 0);` to replace OrbitControls.
- Instantiate the WebGLRenderer targeting the canvas, with `alpha: true`. Use `setSize(width, height)`.
- Configure the EffectComposer and BloomPass using the new container dimensions.

**C. Parameters & Interactivity**
- Hardcode the parameters previously controlled by the GUI:
  ```javascript
  const params = {
      waveSpeed: 1.0,
      waveHeight: 1.2,
      particleSize: 0.05,
      bloomIntensity: 1.5,
      bloomRadius: 0.4,
      mouseInfluence: 0.5
  };
  ```
- Map the global `window.addEventListener('mousemove', ...)` to calculate `mouse.x` and `mouse.y` accurately within the canvas bounds using `canvas.getBoundingClientRect()`.

**D. Particle System Logic**
- Reduce the `particleCount` from 150000 to **80000** for better mobile/static site performance.
- Copy the geometry, positions, colors, and initialPositions buffering logic identically from `rawwaves.js`.
- Copy the `PointsMaterial` and the `scene.add(points)` implementation.

**E. Animation Loop & Resizing**
- Copy the `animate` function, removing `controls.update()`.
- Add a resize listener on the `window` that recalculates `width` and `height` from `heroSection`, updating the camera aspect ratio, projection matrix, renderer size, and composer size.
