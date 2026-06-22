# Functional Specification

## Overview
This document specifies the desired behavior and visual presentation of the terminal modal interface in relation to the global sticky header.

## Desired Functionality
1. **Unobstructed Modal Viewing**: When any terminal modal is activated, it must be presented as the absolute topmost visual layer of the application.
2. **Overlay Dominance**: The modal's background overlay and content window must completely obscure all background elements, including the global sticky header (`header`), the CRT effect overlay, and the background grid.
3. **Prevention of Visual Overlap**: At no point during the modal's active state should the header or any of its components (such as the navigation items, clock, or status indicator) be visible or interactable above or behind the modal content.
4. **Unchanged Default Behavior**: When the modal is closed, the sticky header must retain its default functionality, remaining fixed at the top of the viewport during page scrolling and continuing to apply its active state styles.
