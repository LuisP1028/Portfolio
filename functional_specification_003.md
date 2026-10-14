# Functional Specification: OBJ-200 Legislative-to-Administrative GraphRAG Policy Engine Showcase Card, 3D Halftone Graph Animation, and Dedicated Interactive Terminal View

## 1. Overview & Objective
The portfolio's deployed projects showcase requires a new `{Project Cards / OBJ Boxes}` entry—designated **`OBJ-200`**—to present the **Legislative-to-Administrative Graph (LAG) Policy Engine Showcase** project (`https://github.com/LuisP1028/lag-policy-engine-showcase`) and its live interactive web deployment (`https://luisp1028.github.io/lag-policy-engine-showcase/`).

This addition consists of three tightly integrated functional capabilities:
1. **A New `{Project Cards / OBJ Boxes}` Unit (`OBJ-200`)**: A project card within the deployed units grid presenting the `OBJ-200` identifier, an animated 3D graph preview, project title, descriptive summary of the 8-hop legislative-to-administrative GraphRAG policy engine, and `{Action Buttons / Button Groups}` (`LIVE_DEMO` and `SRC_CODE`).
2. **An Animated 3D Graph Preview with Halftone Shader Aesthetic**: A continuous, motion-driven 3D network graph animation rendered inside the `OBJ-200` card's preview viewport, visually depicting a multi-hop directed policy lineage graph processed through a stylized halftone shader effect that matches the portfolio's Industrial Cyberpunk color scheme and aesthetic.
3. **A Dedicated Interactive Terminal View (`TERMINAL_200`)**: An independent full-screen terminal modal overlay dedicated to `OBJ-200` that embeds the live interactive application (`https://luisp1028.github.io/lag-policy-engine-showcase/`) directly within the portfolio interface when triggered by the card's `LIVE_DEMO` control.

Every aspect of this addition must satisfy `{correctness}`, `{functionality}`, and `{correct required outputs}` while producing zero `{errors}` across all supported viewport dimensions and interaction states.

---

## 2. Desired `{functionality}` & Behavioral Requirements

### 2.1 `OBJ-200` `{Project Cards / OBJ Boxes}` Presentation & Content
1. **Grid Membership & Visual Parity**:
   - The `OBJ-200` card must appear as a first-class unit within the Deployed Units (`[PROJECTS]`) grid alongside the existing project cards (`OBJ-04`, `OBJ-01`, and `OBJ-02`).
   - The card must share identical structural proportions, framing, corner bracket animations on hover, border treatments, internal spacing, and typography hierarchy with the existing `{Project Cards / OBJ Boxes}`.
2. **Card Header & Identifier**:
   - The top header bar of the card must display the identifier badge `OBJ-200` on the left and the standard target reticle symbol (`✜`) on the right.
3. **Project Headline & Summary Copy**:
   - **Headline**: Clearly identifies the system as the **Legislative-to-Administrative Graph (LAG) Policy Engine** (rendered in the portfolio's uppercase display typography).
   - **Description**: Concisely communicates the core domain capability of the project: an interactive 17-category, 18-edge, 8-hop Medicare legislative and regulatory lineage explorer featuring real-time GraphRAG path illumination and pre-computed policy runs.
4. **`{Action Buttons / Button Groups}`**:
   - Positioned at the base of the `OBJ-200` card, the button group must provide two primary operator actions:
     - **`LIVE_DEMO`**: Launches the dedicated `OBJ-200` interactive terminal modal view displaying the live application at `https://luisp1028.github.io/lag-policy-engine-showcase/`.
     - **`SRC_CODE`**: Opens the external source code repository (`https://github.com/LuisP1028/lag-policy-engine-showcase`) in a new browser tab without navigating away from or disrupting the current portfolio session.
   - All action button labels must adhere strictly to zero `{Label Truncation & Text Overflow}` requirements: 100% of glyphs in `LIVE_DEMO` and `SRC_CODE` (as well as all labels on neighboring cards in the grid) must remain completely visible, unclipped, and centered within their button boundaries across all viewport widths.

---

### 2.2 Animated 3D Graph Motion Preview with Halftone Shader
1. **3D Network Graph Motion & Topology**:
   - The media preview box at the top of the `OBJ-200` card must display a live, procedural 3D graph animation representing a multi-hop legislative-to-regulatory knowledge graph.
   - The 3D structure must feature distinct interconnected nodes and directed/linked edges arranged in three-dimensional space with perceptible depth, perspective, and continuous, smooth spatial motion (such as orbital rotation, subtle floating oscillation, and multi-hop path illumination pulses traveling across connected nodes and edges).
2. **Halftone Shader Visual Treatment**:
   - The rendered 3D graph scene must be stylized with a halftone shader effect—producing a dot-matrix / screen-tone dithering pattern across node surfaces, illumination gradients, and depth shading.
   - The halftone pattern must dynamically respond to the 3D motion and lighting/pulse intensity of the graph nodes and edges, reinforcing the tactile, high-contrast CRT/industrial terminal aesthetic of the portfolio.
3. **Color Scheme & Aesthetic Continuity**:
   - The animation must strictly adhere to the portfolio's established Industrial Cyberpunk palette:
     - Deep obsidian/void black background (`#050505` / `#0a0a0a`) with subtle structural contrast.
     - Primary cybernetic orange-red accent (`#ff3c00`) for active path illumination, highlighted nodes, and primary halftone highlights.
     - Complementary vector blue (`#0088ff`), alert crimson (`#ff0033`), or crisp monochrome tones (`#e0e0e0` / `#666666`) for secondary nodes, structural edges, and depth shading.
   - Any HUD overlay readout or telemetry label within the preview box (e.g., indicating 8-hop lineage or GraphRAG status) must use the portfolio's monospace/pixel telemetry styling without obscuring the 3D halftone graph motion.
4. **Viewport Containment & Responsive Scaling**:
   - The animation must remain strictly contained within the 200px-high card media preview boundary without bleeding outside the frame or distorting aspect ratios when the browser window is resized or zoomed.
   - The animation must run smoothly and continuously while visible without blocking page scrolling, pointer interactions, or hover states on the parent card.

---

### 2.3 Dedicated Interactive Terminal View (`TERMINAL_200`)
1. **Independent Terminal Modal Instance**:
   - Triggering `LIVE_DEMO` on `OBJ-200` must open `OBJ-200`'s own dedicated interactive terminal modal view rather than repurposing or overwriting incompatible static media templates.
   - The modal header must display an explicit connection status identifier corresponding to the unit (e.g., `>> REMOTE_LINK_ESTABLISHED // TERMINAL_200`) alongside the `[TERMINATE_SESSION]` dismissal control.
   - The modal frame must preserve the portfolio's terminal chrome, including the high-contrast accent header bar, glowing border frame, scanline/CRT backdrop treatment, and bottom status decals (`WARNING: LIVE ENVIRONMENT` and `SEC_PROTOCOLS: ACTIVE`).
2. **Embedded Interactive Application Execution**:
   - Upon activation, the terminal body must load and render the live interactive application hosted at `https://luisp1028.github.io/lag-policy-engine-showcase/` filling the interior viewport of the terminal body.
   - The operator must be able to interact directly with the embedded LAG Policy Engine Showcase (exploring the 8-hop graph, selecting pre-computed LTA/IVIG policy runs, inspecting node/edge lineage, scrolling, and clicking controls) seamlessly within the terminal window.
3. **Session Termination & Resource Cleanup**:
   - The operator must be able to close the dedicated `OBJ-200` terminal view via any of three standard dismissal actions:
     1. Clicking the `[TERMINATE_SESSION]` button in the terminal header.
     2. Clicking on the darkened backdrop overlay outside the terminal content frame.
     3. Pressing the `Escape` key on the keyboard.
   - Closing the terminal view must cleanly transition the modal out of view and unload/clear the embedded live session so no background network activity, audio, or detached rendering processes persist after termination.

---

## 3. Constraints & Boundary Conditions
1. **Implementation-Free Specification**: This document defines *what* visual, behavioral, and interactive outcomes are required, without prescribing specific code structures, third-party libraries, shader source code, or file organization.
2. **`{Stacking Context & Z-Index Layering}` Compliance**:
   - When the `OBJ-200` card is in its default grid state, its internal 3D canvas, overlays, and buttons must never bleed above the sticky site header, the `{Chatbox / Chat Widget}` (`PLATODOOM`), or active modals.
   - When the dedicated `OBJ-200` terminal modal is active, it must occupy the top-level modal foreground layer (`z-index` precedence above the sticky header, CRT overlay, hazard tape, and floating chat widget), ensuring zero visual occlusion or pointer-event dead zones.
3. **Preservation of Existing Units**:
   - Adding `OBJ-200` and its dedicated terminal view must not alter, degrade, or break the existing functionality, animations, or modal views of `OBJ-04` (Evil Digital Twin), `OBJ-01` (State Space Model media & PDF white paper modals), `OBJ-02` (Options Dealer Positioning terminal), the startup intro sequence, or the `PLATODOOM` `{Chatbox / Chat Widget}`.
4. **Fail-Fast & Zero Silent Degradation**:
   - All canvas initialization, shader rendering, and modal activation states must operate deterministically without silent exception suppression or broken fallback placeholders.

---

## 4. Edge Cases & Exception Handling
1. **Multi-Column Desktop Grid Reflow**:
   - With four `{Project Cards / OBJ Boxes}` (`OBJ-200`, `OBJ-04`, `OBJ-01`, `OBJ-02`) present in the responsive grid, wide viewports may arrange up to four cards in a single row. At every viewport width (from ultra-wide desktop down to 375px mobile), neither the 3D halftone preview nor the `{Action Buttons / Button Groups}` (`LIVE_DEMO`, `SRC_CODE`) may clip, overflow the card borders, or truncate button text.
2. **Rapid Modal Toggling**:
   - Repeatedly opening and closing the `OBJ-200` terminal modal (or switching between `OBJ-200`, `OBJ-04`, `OBJ-01`, and `OBJ-02` modals) must never leave duplicate embedded frames, stuck overlay states, or unresponsive close controls.
3. **Viewport Resizing & Device Pixel Ratio Changes**:
   - Resizing the browser window or changing zoom levels (up to 200%) while viewing the `OBJ-200` card must dynamically adapt the 3D halftone graph viewport dimensions and resolution so the halftone pattern and 3D projection never appear stretched, clipped, or pixelated beyond the intended halftone dot grid.
4. **Simultaneous `{Chatbox / Chat Widget}` State**:
   - If the `PLATODOOM` chat widget is open when the operator clicks `LIVE_DEMO` on `OBJ-200`, the terminal modal must cleanly take foreground visual and interactive precedence without visual bleed-through from the chat window.

---

## 5. Acceptance Criteria & `{correct required outputs}`
The implementation will be verified as `{sufficient}` and `{correct}` when all of the following measurable criteria are met with zero `{errors}`:

1. **Card Presence & Content Verification**:
   - `OBJ-200` renders inside the `#projects` grid with badge `OBJ-200`, reticle `✜`, project headline, accurate description of the 8-hop Legislative-to-Administrative GraphRAG Policy Engine, and action buttons `LIVE_DEMO` and `SRC_CODE`.
2. **3D Halftone Graph Animation Verification**:
   - Inside `OBJ-200`'s preview viewport, a live JavaScript-driven 3D network graph animation renders continuously with visible 3D depth/motion, multi-hop node-and-edge structure, and a distinct halftone shader effect styled in the portfolio's `#050505` / `#ff3c00` / `#0088ff` Industrial Cyberpunk palette.
   - The animation remains strictly inside the card's preview box boundaries across all viewport sizes.
3. **Action Button & `{Label Truncation & Text Overflow}` Verification**:
   - On `OBJ-200` and all sibling project cards, 100% of characters in `LIVE_DEMO`, `SRC_CODE`, and `WHITE_PAPER` are fully legible and unclipped across 1920px, 1440px, 1024px, 768px, and 375px viewports.
   - Clicking `SRC_CODE` opens `https://github.com/LuisP1028/lag-policy-engine-showcase` in a new tab.
4. **Dedicated Interactive Terminal Verification**:
   - Clicking `LIVE_DEMO` on `OBJ-200` opens its dedicated terminal modal overlay displaying `https://luisp1028.github.io/lag-policy-engine-showcase/` as an interactive embedded session.
   - Clicking `[TERMINATE_SESSION]`, clicking the modal backdrop, or pressing `Escape` immediately dismisses the modal and unmounts the embedded session cleanly.
5. **Zero `{errors}` Verification**:
   - Browser console and network logs record zero unhandled JavaScript exceptions, zero WebGL/shader compilation errors, and zero broken resource requests during page load, card hover, resize, and modal open/close cycles.
