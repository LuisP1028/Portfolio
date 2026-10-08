# Functional Specification: Project Card Action Button Text Rendering & Layout Preservation

## 1. Overview & Problem Definition
In the deployed projects grid (`#projects`), each project card (`OBJ-01`, `OBJ-02`, `OBJ-03`, `OBJ-04`) features a group of interactive action buttons providing navigation to live applications, source repositories, or documentation.

When rendered in multi-column desktop and laptop viewports, the text labels inside these buttons are clipped, truncated, or visually cut off by the button boundaries. Specifically:
- `LIVE_DEMO` is cut off at the right edge, rendering as `LIVE_DEM`.
- `WHITE_PAPER` is truncated, rendering as `WHITE_PAR`.
- `SRC_CODE` is cramped against the button borders.

This defect violates `{correctness}` and directly impairs `{functionality}` by obscuring key interaction labels and diminishing the professional quality of the user interface. This specification defines the exact behavioral requirements, layout adaptability, and measurable success criteria to ensure all action buttons across all project cards render with complete label visibility and robust responsive alignment.

---

## 2. Desired Functionality & Behavioral Requirements

### 2.1 Complete Label Legibility & Text Integrity
1. **Zero Text Truncation / Clipping**: Every action button within every project card must display its full label with 100% of characters clearly visible. Under no viewport dimension or card column width may text be cut off, partially masked, or truncated.
2. **Exact Label Fidelity**:
   - The label `LIVE_DEMO` must always show all 9 characters without the trailing `O` being sliced off.
   - The label `WHITE_PAPER` must always show all 11 characters without trailing letters being cut off.
   - The label `SRC_CODE` must always show all 8 characters cleanly contained with comfortable breathing room.
3. **No Mid-Word Breaks**: Multi-word or underscored action labels must never break or hyphenate mid-word inside an action button.

### 2.2 Adaptive Button Group Layout
1. **Container Containment**: All buttons and their parent group must remain strictly inside the interior padding of their respective project card. No button may overflow beyond card borders or bleed into neighboring cards.
2. **Dynamic Reflow & Flexible Sizing**:
   - When the project card column width provides sufficient horizontal space, buttons should sit side-by-side with consistent spacing between them.
   - When horizontal card width is constrained (such as in 4-column desktop layouts or narrower viewports), the button layout must gracefully adapt—allowing buttons to wrap cleanly to multiple lines, scale their internal spacing proportionally, or stretch evenly to fill available row width—ensuring no button label is squeezed beyond its legibility threshold.
3. **Consistent Vertical Alignment**: When buttons wrap onto multiple rows within a card, spacing between rows must remain clean, predictable, and visually balanced.

### 2.3 Visual Hierarchy & Aesthetic Preservation
1. **Cyberpunk Industrial Aesthetic**: The styling of action buttons must maintain full continuity with the site's design language:
   - High-contrast typography and uppercase presentation.
   - Sharp, geometric borders with cybernetic accent colors.
   - Immediate visual feedback on hover and focus (color inversion, glow, or accent highlighting).
2. **Text Centering & Balance**: Button text must appear centered and balanced within its bounding frame, with equalized margins and internal breathing room around the text label.
3. **Interactive Target Integrity**:
   - The entire visual surface of the button must act as the click/tap hit area.
   - Spacing between adjacent buttons must be sufficient to prevent accidental clicks on touch or pointer devices.

---

## 3. Constraints & Boundary Conditions
1. **Implementation Agnostic**: This specification details the required visual behavior, responsive reflow, and label integrity, without mandating specific CSS rules, class names, or DOM restructuring.
2. **Card Structure Preservation**: The layout changes must not break the overall card proportions, media preview areas, project titles, or card hover animations (`.card::before`, `.card::after`).
3. **Event Binding & Navigation Preservation**: All underlying click handlers, modal invocations (`openMediaModal()`, `openPDFModal()`, `openTerminal()`, `openTerminal04()`), and external source repository links must remain fully operable.

---

## 4. Edge Cases & Exception Handling
1. **High Screen Resolutions (4-Column Layouts)**:
   - On wide desktop screens where the grid arranges all 4 cards side by side in a single row, the horizontal card width is at its narrowest desktop state. Buttons must render with full label visibility without overflow or letter loss.
2. **Longest Label Pair (`OBJ-01`)**:
   - Card `OBJ-01` contains the pair `LIVE_DEMO` and `WHITE_PAPER`. Because `WHITE_PAPER` is the longest label in the card set, this card represents the primary stress test for horizontal layout space. The layout must handle this pair cleanly without clipping either label.
3. **Single-Column Mobile Viewports (<600px)**:
   - On mobile screens where each card expands to full viewport width, buttons must scale or wrap cleanly without awkward stretching or excessive whitespace.
4. **Browser Zoom (Up to 200%)**:
   - When the user zooms the browser display, buttons must reflow naturally without clipping text against card edges.

---

## 5. Acceptance Criteria & `{correct required outputs}`
The implementation will be verified as `{sufficient}` and `{correct}` when all of the following measurable criteria are met:

1. **Visual Text Inspection**:
   - On `OBJ-01`: Both `LIVE_DEMO` and `WHITE_PAPER` display every single character in full. No letters are cut off at the right or left edge.
   - On `OBJ-02`: Both `LIVE_DEMO` and `SRC_CODE` display in full without clipping.
   - On `OBJ-03`: Both `LIVE_DEMO` and `SRC_CODE` display in full without clipping.
   - On `OBJ-04`: Both `LIVE_DEMO` and `SRC_CODE` display in full without clipping.
2. **Responsive Reflow Verification**:
   - When resizing the browser window from 1920px down to 375px, the buttons on all cards maintain complete label visibility at every breakpoint without horizontal scrollbars or card boundary bleed.
3. **Containment Verification**:
   - Every button resides completely within the bounding box of its parent card.
4. **Functional Interaction Verification**:
   - Clicking `LIVE_DEMO` on each card launches the appropriate modal or demo link.
   - Clicking `WHITE_PAPER` on `OBJ-01` opens the PDF viewer modal.
   - Clicking `SRC_CODE` on `OBJ-02`, `OBJ-03`, and `OBJ-04` opens the external GitHub/HuggingFace links in new tabs.
