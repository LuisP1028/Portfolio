---
name: system-glossary-evaluation-parameters
hostname: local-workspace
description: A comprehensive glossary defining the strict evaluation parameters used for assessing code errors, correctness, functionality, and documentation sufficiency within the system, alongside portfolio UI and card/button component taxonomy.
---

# Evaluation Parameters

## {errors}
- Explicit failure states surfaced during the execution or rendering of a component.
- **Qualifiers:** Browser console errors, unhandled JavaScript exceptions, network request failures (e.g. 404/500/CORS), CSS syntax errors, non-zero build/process exit codes, or fatal runtime crashes that halt execution.

## {correctness}
- The precise, local execution and visual/behavioral integrity of a specific component, verifying that it performs its designated presentation and interaction without layout defects or logical flaws, even if no explicit `{errors}` are thrown.
- **Qualifiers:** Complete and unclipped text rendering, proper element containment, accurate event handler binding, valid responsive layout scaling, and mathematically sound CSS box-model transformations.

## {functionality}
- The broader, global objective or business logic the component is meant to achieve within the larger application.
- **Qualifiers:** Do all action controls and labels render legibly, reliably, and accessibly across all display formats? Does the interface present complete information without truncation, awkward line breaks, or obscured affordances?

## {correct required outputs}
- The exact, literal expected visual and behavioral state after a component renders or executes. This must be objectively measurable.
- **Qualifiers:** All button labels (`LIVE_DEMO`, `SRC_CODE`, `WHITE_PAPER`) render with 100% of their glyphs intact and fully readable across all card column widths; buttons do not overflow card boundaries; interactive hover and click states remain fully functional.

## {sufficient}
- The state of documentation where absolutely no ambiguity remains, and the coding assistant can proceed to implementation without guessing or hallucinating context.
- **Qualifiers:** Exhaustive specifications of desired visual hierarchy, layout behavior, label preservation rules, responsive constraints, and clear criteria for success without prescribing code implementations.

## {insufficient}
- The state of documentation where critical context is missing, ambiguous, or contradictory, requiring the assistant to make assumptions to write code.
- **Qualifiers:** Vague instructions (e.g., "fix the buttons", "make text fit"), undefined layout behavior on narrow viewports, or lack of objective verification criteria.

# UI Stacking, Card & Button Domain Glossary

## {Project Cards / OBJ Boxes}
- The individual container components (`.card`, `#obj-01-card`, `#obj-02`, `#obj-03-card`, `#obj-04-card`) in the projects grid displaying project identifier, interactive preview/media, headline, description, and action button group.

## {Action Buttons / Button Groups}
- The interactive controls (`.btn-group`, `.btn`, `button.btn`, `.btn-fill`) positioned at the base of each project card providing triggers for modal launches (`LIVE_DEMO`, `WHITE_PAPER`) and external repository links (`SRC_CODE`).

## {Label Truncation & Text Overflow}
- The defect state where glyphs at the boundaries of button labels are cut off, clipped, or hidden due to horizontal boundary constraints, excessive internal padding, or lack of wrap/responsive sizing.

## {Chatbox / Chat Widget}
- The interactive floating dialog interface (`#chat-widget-container`, `#doom-chat-container`) allowing operators to converse with the PLATODOOM system, including its toggle FAB, message log, input bar, and social link tray.

## {Stacking Context & Z-Index Layering}
- The CSS rendering order determining foreground-to-background visual precedence across fixed, sticky, and positioned elements.