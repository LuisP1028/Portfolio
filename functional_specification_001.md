# Functional Specification: Chatbox Visual Layering & Clipping Prevention

## 1. Overview & Problem Definition
When the interactive chatbox widget (PLATODOOM) is opened by the operator, its window and messaging interface render behind header text, hero headlines, and page assets instead of appearing unobstructed in the foreground. 

Specifically, large typographical headlines ("Architecting Digital Superiority"), subtitle copy ("GENERATIVE PIPELINES / DATA SCIENCE / MACHINE LEARNING"), and surrounding visual elements intersect, bleed through, and visually occlude the chat window, chat messages, input field, and companion controls.

This defect compromises `{correctness}` and violates `{functionality}`, creating severe legibility defects and visual interference. This document specifies the exact behavioral requirements, visual hierarchy outcomes, and measurable success criteria to ensure the chatbox operates with full foreground integrity across all states.

---

## 2. Desired Functionality & Behavioral Requirements

### 2.1 Unobstructed Foreground Display
1. **Absolute Visual Dominance**: When the chatbox is opened into its active state, the entire chat container (including header, message stream, input wrapper, and transmit controls) must render completely in front of all standard page content.
2. **Zero Text Occlusion / Clipping**: No page text—including but not limited to the sticky header bar, brand text, UTC status clock, hero section headlines, sub-headlines, badge labels, and card descriptions—may render on top of or clip through any part of the chat interface.
3. **Zero Graphic Asset Bleed**: Decorative page assets—such as animated hazard tape ribbons, background grids, canvas particles, and visual card frames—must remain visually beneath the chat window whenever they share screen coordinates.

### 2.2 Component State Invariants
1. **Collapsed / Resting State**:
   - The floating action button (FAB) and the floating callout prompt must remain fully visible and clickable without being partially hidden or sliced by underlying page elements or borders.
2. **Active / Expanded State**:
   - Opening the chatbox must present a clear, legible surface that completely blocks visual interference from elements positioned underneath it.
   - Text within the chat container (system messages, user inputs, automated responses, and timestamps) must remain 100% legible without background text shining or cutting through.
3. **Companion Social Module (Follow Tray)**:
   - When the companion social link tray slides out horizontally next to the FAB, it must maintain the same foreground precedence as the chatbox and FAB, ensuring that its links and icons are never occluded by hero text or hazard tape.

### 2.3 Scrolling & Viewport Dynamics
1. **Viewport Persistence**: The chatbox and its controls are anchored relative to the viewport. As the user scrolls vertically through the page (from the initial hero section down to projects and footer), the chatbox must remain continuously unobstructed in the foreground at every scroll offset.
2. **Sticky Header Relationship**: If the chatbox or its controls overlap the vertical area occupied by the sticky header (e.g. on compact screens, high zoom levels, or upward expansion), the chatbox interface must cleanly precede the header without clipping or tucking underneath the header bar.
3. **Modal Overlay Relationship**: When full-screen modal overlays (e.g. project demo terminals, white paper viewers) are opened, the system must maintain an unambiguous hierarchy where modal layers and the chatbox do not produce broken visual clipping or unclickable dead zones.

---

## 3. Constraints & Boundary Conditions
1. **Implementation Agnostic**: This specification dictates *what* visual behavior must occur, not *how* CSS or DOM properties are configured.
2. **Aesthetic Preservation**: The project's "Industrial Cyberpunk" aesthetic—including high-contrast borders, custom scrollbars, subtle background grid lines, and glowing accent colors—must remain intact.
3. **Interactivity Integrity**: All interactive elements within the chatbox (the text input field, transmit button, close button, social links, and FAB) must receive mouse, pointer, and keyboard events cleanly without pointer-event traps or dead spots caused by overlapping page elements.
4. **No Disruption to Page Flow**: Standard layout elements on the page (hero typography, grid sections, canvas animations) must continue to function normally and must not be hidden or disabled when the chatbox is closed.

---

## 4. Edge Cases & Exception Handling
1. **Small Screen & High Zoom**:
   - When viewed on small viewports (mobile or tablet) or when browser zoom is set to 150%+, the chat container occupies a larger percentage of the screen and directly overlaps major text blocks and the sticky header. The chatbox must remain entirely legible and fully forward in the stacking order.
2. **Rapid Toggling & Transitions**:
   - Repeatedly opening and closing the chatbox or social tray must never result in an intermediate frame where text or assets pop in front of the chatbox during animation.
3. **Simultaneous Modal Triggers**:
   - If a user opens a project live demo or white paper modal while the chatbox is already open, the active modal must take proper user focus without awkward clipping against the chatbox.

---

## 5. Acceptance Criteria & `{correct required outputs}`
The implementation will be deemed `{sufficient}` and `{correct}` only when all of the following criteria are objectively verified:

1. **Visual Clarity Verification**:
   - Opening the chatbox on the home page reveals the PLATODOOM chat dialog with zero bleed-through from the hero title ("Architecting Digital Superiority") or sub-text.
   - The headline text never appears drawn across, within, or above the chat dialog surface.
2. **Asset Clearance Verification**:
   - The animated hazard tape and particle canvas remain strictly behind the chatbox, FAB, and companion tray.
3. **Scroll Test**:
   - Scrolling smoothly through the entire page from top to bottom with the chatbox open exhibits no flicker, clipping, or z-order inversions.
4. **Interaction Test**:
   - Clicking into the query input field, typing a message, and clicking the transmit button succeeds immediately with full pointer precision and focus.
