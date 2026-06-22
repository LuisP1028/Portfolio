**Technical Integration Documentation**  
**Interactive Particle Waves – Hero Background Version**  
**Source:** https://codepen.io/VoXelo/pen/ZYzRMmg  
**Target Environment:** Static GitHub Pages (vanilla HTML/CSS/JS, no bundler)  
**Use Case:** Full-screen hero section interactive background  
**Date:** June 22, 2026

---

### 1. Executive Summary (Updated)

This is a **high-density Three.js particle wave effect** intended to run as an **interactive background** behind hero section text and UI elements on a static GitHub Pages portfolio.

**Major simplifications required based on your requirements:**
- Remove `lil-gui` entirely (no controls visible to visitors)
- Remove `OrbitControls` entirely (camera must be fixed)
- Optimize for **balanced beauty + mobile friendliness + performance**
- Designed to work in a **vanilla HTML/CSS/JS** static site (no npm, no bundler)

**Core Reality Check:**  
The original CodePen uses modern ES modules + import maps. While we can still avoid `npm install`, integration into a classic static site requires either an **import map** or a **refactored non-module version**. A pure “drop-in vanilla script” is not possible without modification.

---

### 2. Final Dependency Inventory (After Requirements)

| Library                  | Version   | Needed?     | Loading Method                  | Reason for Decision |
|--------------------------|-----------|-------------|---------------------------------|---------------------|
| **Three.js**             | r162.0    | Yes         | CDN via Import Map or refactored | Core 3D + Points rendering |
| **EffectComposer**       | r162      | Yes         | CDN via Import Map              | Required for bloom |
| **RenderPass**           | r162      | Yes         | CDN via Import Map              | Base rendering pass |
| **UnrealBloomPass**      | r162      | Recommended | CDN via Import Map              | Ethereal glow (can be tuned down or removed for performance) |
| **OrbitControls**        | r162      | **No**      | —                               | Camera must be fixed |
| **lil-gui**              | 0.19.1    | **No**      | —                               | GUI removed entirely per requirement |
| **Any other libs**       | —         | No          | —                               | None required |

**Final simplified stack:** Three.js core + three addons for post-processing only.

---

### 3. Updated Architecture (Hero Background Version)

**Removed features:**
- `lil-gui` control panel
- `OrbitControls` (no user camera rotation/zoom)
- Any debug or parameter UI

**Retained & Adapted features:**
- 3D particle field with layered sine/cosine wave animation
- Mouse/hover interactivity (particles react to cursor with lift + color shift)
- `EffectComposer` + `UnrealBloomPass` for glow (with performance tuning options)
- Fixed camera (static position + look-at)
- High particle count (will be tuned downward for balance)

**Rendering target:** One `<canvas>` element positioned as a full hero background layer.

---

### 4. Integration Challenges Specific to Your Setup

| Challenge | Severity | Details | Impact on Static GitHub Pages Portfolio |
|---------|----------|-------|-----------------------------------------|
| ES Modules + Import Map | High | Original code uses `import` statements | Cannot paste directly into classic `<script>` files |
| Canvas as full hero background | High | Must sit behind text, receive mouse input selectively, not block clicks | Requires careful CSS (`position: absolute`, `z-index`, `pointer-events`) |
| Performance balance | High | 150k particles + bloom can be heavy on mobile | Must reduce particle count and offer quality settings |
| No bundler available | Medium | GitHub Pages is plain static hosting | All dependencies must come from CDN |
| Fixed camera requirement | Low | Simplifies code (good) | Removes need to import OrbitControls |
| No visible GUI | Low | Simplifies code (good) | Removes need to import lil-gui |
| Mobile friendliness | Medium-High | Hero backgrounds are very visible on mobile | Needs responsive sizing + possible reduced quality mode |

---

### 5. Recommended Integration Strategy for Static GitHub Pages

**Best Path: Import Map + ES Module (Cleanest & Most Maintainable)**

**Why this path?**
- Closest to the original high-quality code
- Still requires zero `npm install`
- Works on GitHub Pages
- Easier to maintain long-term

**Alternative Path (if you strongly prefer classic scripts):** Refactor into an IIFE + use older Three.js global build. This is more work and slightly less clean.

**Recommended Approach Summary:**
1. Add an **import map** in your `index.html` `<head>`
2. Create a dedicated file (e.g. `js/hero-particles.js`) loaded with `<script type="module">`
3. Position a `<canvas id="hero-particles">` absolutely behind your hero content
4. Handle z-index and pointer-events so text remains clickable while mouse still drives the particle interaction
5. Implement performance guards (reduce particles on mobile, pause when hero is out of view)

---

### 6. Performance & Mobile Recommendations (Balanced Approach)

To achieve your requested balance of **beauty + mobile friendliness + performance**:

- **Particle count:** Start at **60,000 – 80,000** (instead of 150k). This is still very dense visually.
- **Bloom quality:** Make `UnrealBloomPass` parameters adjustable via code constants (can lower strength or disable on mobile).
- **Device detection:** Simple check for mobile / low-performance devices → automatically reduce particle count and/or disable bloom.
- **Animation pausing:** Pause the animation loop when the hero section is not in viewport (saves GPU).
- **Canvas sizing:** Use `devicePixelRatio` aware sizing but cap it on mobile.
- **Mouse influence radius:** Slightly larger on desktop, more forgiving on touch devices.

These changes can be implemented with a few configuration constants at the top of the file.

---

### 7. Hero Background Specific Technical Considerations

- The canvas should be placed **inside** the hero section (or as a direct child) with:
  - `position: absolute`
  - `top: 0; left: 0; width: 100%; height: 100%`
  - `z-index: 1` (or lower than text but higher than any decorative background)
  - `pointer-events: auto` (so mouse interaction works)
- Hero text and buttons need `position: relative` + higher `z-index` so they sit on top and remain clickable.
- The mouse interaction should feel natural even when the cursor is over text (this usually requires the canvas to span the full hero area).

---

### 8. Refined Dependency Loading Strategy (No npm)

**Option 1 – Import Map (Recommended)**
- Define import map pointing to `unpkg.com/three@0.162.0`
- Load Three.js addons via the `/examples/jsm/` path
- Load your visualization script with `type="module"`

**Option 2 – Classic Script Fallback**
- Use Three.js r162 global build + manually expose needed classes (more fragile, not recommended unless you have strong reasons)

---

### 9. Next Steps (When Ready)

Once you confirm this refined documentation is accurate, we can proceed to:

1. Finalize exact particle count target + performance tiers
2. Decide on bloom quality strategy (always on / conditional / off)
3. Create the integration plan with precise file structure recommendations
4. Begin implementation (HTML structure + CSS positioning + JavaScript module)

---

**This is now the authoritative, requirement-aligned documentation.**

Please review it and let me know if anything needs adjustment. When you’re ready, reply with something like **“Now proceed to implementation plan”** or **“Now code it”**, and I’ll move to the next phase.