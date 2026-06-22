# Required Edits: Terminal Modal Header Overlap Fix

## 1. Target File: `css/modal.css`

**Objective**: Resolve stacking context conflict (specifically Safari composite layer inversion bugs) that allows the `header` to dominate the `.modal-overlay` despite a lower `z-index`.

**Specific Edit Instructions**:
1. Locate the `.modal-overlay` class definition (around line 141).
2. The current definition is:
   ```css
   .modal-overlay {
       position: fixed; top: 0; left: 0; width: 100%; height: 100%;
       background: rgba(5, 5, 5, 0.95); z-index: 100000; display: flex;
       justify-content: center; align-items: center; backdrop-filter: blur(8px);
       opacity: 0; pointer-events: none; transition: opacity 0.2s;
   }
   ```
3. Update this block to include `-webkit-backdrop-filter` for better cross-browser support, and importantly, add `transform: translateZ(999px);` and `-webkit-transform: translateZ(999px);` to force the modal overlay into the topmost hardware-accelerated composite layer. This prevents `header.glass-active` (which uses `-webkit-backdrop-filter`) from rendering above it.

   **Updated CSS**:
   ```css
   .modal-overlay {
       position: fixed; top: 0; left: 0; width: 100%; height: 100%;
       background: rgba(5, 5, 5, 0.95); z-index: 100000; display: flex;
       justify-content: center; align-items: center; 
       backdrop-filter: blur(8px);
       -webkit-backdrop-filter: blur(8px);
       transform: translateZ(999px);
       -webkit-transform: translateZ(999px);
       opacity: 0; pointer-events: none; transition: opacity 0.2s;
   }
   ```

## 2. Target File: `css/styles.css`
**Objective**: Ensure the `header` doesn't use `z-index` higher than it needs to, and correctly isolates its own stacking context.

**Specific Edit Instructions**:
1. Locate the `header` block (around line 41).
2. The current `z-index` is `10005`. This is fine, but to be completely safe against stacking context bleed, we will add `isolation: isolate;` to the header.
3. Update the header block:
   ```css
   header {
       border-bottom: 1px solid transparent; 
       padding: 1.5rem 0;
       position: sticky; 
       top: 0; 
       background: var(--bg-color);
       z-index: 10005; 
       isolation: isolate;
       transition: all 0.3s ease;
   }
   ```
