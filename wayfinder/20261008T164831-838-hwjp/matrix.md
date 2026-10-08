# Master Component-to-Edit Matrix: Chatbox Visual Layering & Clipping Prevention

**Governing Specification:**
- [`functional_specification_001.md`](../../functional_specification_001.md) (Chatbox Visual Layering & Clipping Prevention)

**Governing System Glossary:** [`LANGUAGE.md`](../../LANGUAGE.md)  
**Run Identifier:** `20261008T164831-838-hwjp`  
**Execution Node:** `wayfinder-read-and-plan`  
**Status:** Canonical Plan Locked; Zero Architectural Ambiguity

---

## 1. Master Component-to-Edit Matrix

| Component Path | Target Lines / Symbols | Governing Ticket | Nature of Transformation | Invariants & Contracts Locked |
| :--- | :--- | :--- | :--- | :--- |
| [`css/chatbox.css`](../../css/chatbox.css#L5-L11) | `#chat-widget-container` (Lines 5–11) | [Ticket 001](./tickets/ticket-001.md), [Ticket 003](./tickets/ticket-003.md) | Elevate z-index from `10000` to `50000`; apply `isolation: isolate;` and `pointer-events: none;`. | `INV-TIER-03`: Absolute visual dominance over header (`10005`) and hero text (`10001`); zero click dead zones. |
| [`css/chatbox.css`](../../css/chatbox.css#L14-L32) | `.chat-fab` (Lines 14–32) | [Ticket 003](./tickets/ticket-003.md) | Normalize internal z-index to `20`; add explicit `pointer-events: auto;`. | `INV-FAB-LAYER`: FAB mask icon sits above sliding follow tray; always clickable in resting and active states. |
| [`css/chatbox.css`](../../css/chatbox.css#L47-L74) | `.chat-container` (Lines 47–74) | [Ticket 002](./tickets/ticket-002.md), [Ticket 003](./tickets/ticket-003.md) | Convert background from translucent `rgba(5, 5, 5, 0.98)` to solid `#050505`; assign internal `z-index: 10;`. | `INV-SOLID-SURFACE`: 100% surface opacity; zero bleed-through from underlying hero typography or hazard tape. |
| [`css/chatbox.css`](../../css/chatbox.css#L203-L207) | `@media (max-width: 600px)` (Lines 203–207) | [Ticket 004](./tickets/ticket-004.md) | Expand responsive rules: define safe container margins, bounds (`max-height: calc(100vh - 110px)`), and hide `.follow-label` on narrow viewports. | `INV-MOBILE-BOUNDS`: Prevents horizontal overflow, preserves header visibility on small screens and 150%+ zoom. |
| [`css/chatbox.css`](../../css/chatbox.css#L209-L225) | `#chat-callout` (Lines 209–225) | [Ticket 003](./tickets/ticket-003.md) | Normalize internal z-index to `25`; maintain `pointer-events: none;`. | `INV-CALLOUT-LAYER`: Renders prominently above FAB in resting state; clicks pass through. |
| [`css/chatbox.css`](../../css/chatbox.css#L266-L295) | `.follow-module` (Lines 266–295) | [Ticket 002](./tickets/ticket-002.md), [Ticket 003](./tickets/ticket-003.md) | Convert background from `rgba(5, 5, 5, 0.98)` to `#050505`; normalize internal z-index to `15`. | `INV-TRAY-LAYER`: Follow tray slides behind FAB edge with 100% opaque backdrop; links receive pointer events when revealed. |
| [`css/styles.css`](../../css/styles.css#L41-L50) | `header` (Lines 41–50) | [Ticket 001](./tickets/ticket-001.md), [Ticket 004](./tickets/ticket-004.md) | Audit target: verify `z-index: 10005` (Tier 2 baseline). | `INV-STICKY-PRECEDENCE`: Chatbox (`50000`) cleanly precedes sticky header during vertical scroll collisions. |
| [`css/styles.css`](../../css/styles.css#L81-L85) | `.hero-content` (Lines 81–85) | [Ticket 001](./tickets/ticket-001.md) | Audit target: verify `z-index: 10001` (Tier 2 baseline). | `INV-HERO-OCCLUSION`: Hero headlines ("Architecting Digital Superiority") remain strictly behind active chat dialog. |
| [`css/animations.css`](../../css/animations.css#L131-L158) | `.hazard-tape-wrapper` (Lines 131–158) | [Ticket 001](./tickets/ticket-001.md), [Ticket 002](./tickets/ticket-002.md) | Audit target: verify `z-index: 10000` (Tier 1 baseline). | `INV-ASSET-CLEARANCE`: Hazard tape animation runs strictly beneath chatbox and FAB. |
| [`css/modal.css`](../../css/modal.css#L141-L150) | `.modal-overlay` (Lines 141–150) | [Ticket 005](./tickets/ticket-005.md) | Audit target: verify `z-index: 100000` (Tier 4 baseline). | `INV-MODAL-SUPREMACY`: Full-screen project terminals and document viewers take full focus over chatbox when opened. |

---

## 2. Detailed Component Transformation Specifications

### 2.1 File: `css/chatbox.css`

#### Edit 1: Root Container Elevation & Stacking Context Isolation
- **Target Line Range:** Lines 5–11
- **Existing Code:**
  ```css
  #chat-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      font-family: var(--font-mono, monospace);
  }
  ```
- **Replacement Code:**
  ```css
  #chat-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 50000;
      isolation: isolate;
      pointer-events: none;
      font-family: var(--font-mono, monospace);
  }
  ```

#### Edit 2: FAB Stacking & Pointer Events
- **Target Line Range:** Lines 14–32
- **Existing Code:**
  ```css
  .chat-fab {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 65px;
      height: 65px;
      border-radius: 8px; /* Subtle radius */
      background-color: var(--bg-color, #050505);
      border: 2px solid var(--accent, #ff3c00);
      box-shadow: 0 0 15px rgba(255, 60, 0, 0.4);
      cursor: pointer;
      overflow: hidden;
      transition: transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28), box-shadow 0.2s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      z-index: 9999; /* Ensures FAB sits above the slide-out tray */
  }
  ```
- **Replacement Code:**
  ```css
  .chat-fab {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 65px;
      height: 65px;
      border-radius: 8px; /* Subtle radius */
      background-color: var(--bg-color, #050505);
      border: 2px solid var(--accent, #ff3c00);
      box-shadow: 0 0 15px rgba(255, 60, 0, 0.4);
      cursor: pointer;
      overflow: hidden;
      transition: transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28), box-shadow 0.2s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      z-index: 20; /* Ensures FAB sits above the slide-out tray */
      pointer-events: auto;
  }
  ```

#### Edit 3: Chat Container Solid Backing & Internal Stacking
- **Target Line Range:** Lines 47–74
- **Existing Code:**
  ```css
  .chat-container {
      position: absolute;
      bottom: 85px; /* Sits directly above the FAB */
      right: 0;
      width: 360px;
      height: 500px;
      max-height: 70vh;
      background-color: rgba(5, 5, 5, 0.98);
      border: 1px solid var(--accent, #ff3c00);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 60, 0, 0.1);
      display: flex;
      flex-direction: column;
      backdrop-filter: blur(5px);
      
      /* Animation Defaults (Hidden) */
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px);
      transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  }
  ```
- **Replacement Code:**
  ```css
  .chat-container {
      position: absolute;
      bottom: 85px; /* Sits directly above the FAB */
      right: 0;
      width: 360px;
      height: 500px;
      max-height: 70vh;
      background-color: #050505;
      border: 1px solid var(--accent, #ff3c00);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.95), 0 0 15px rgba(255, 60, 0, 0.15);
      display: flex;
      flex-direction: column;
      backdrop-filter: blur(5px);
      z-index: 10;
      
      /* Animation Defaults (Hidden) */
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px);
      transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  }
  ```

#### Edit 4: Mobile Responsive Guard & Header Clearance
- **Target Line Range:** Lines 203–207
- **Existing Code:**
  ```css
  @media (max-width: 600px) {
      .chat-container { width: calc(100vw - 40px); right: -10px; }
  }
  ```
- **Replacement Code:**
  ```css
  @media (max-width: 600px) {
      #chat-widget-container {
          bottom: 15px;
          right: 15px;
      }
      .chat-container { 
          width: calc(100vw - 30px); 
          right: 0;
          bottom: 80px;
          max-height: calc(100vh - 110px);
      }
      .follow-module {
          right: 75px;
          max-width: calc(100vw - 100px);
          padding: 0 10px;
          gap: 10px;
      }
      .follow-label {
          display: none;
      }
  }
  ```

#### Edit 5: Chat Callout Tooltip Stacking
- **Target Line Range:** Lines 209–225
- **Existing Code:**
  ```css
  #chat-callout {
      position: absolute;
      bottom: 80px; 
      right: 10px;
      background-color: var(--bg-color, #050505);
      color: var(--text-main, #e0e0e0);
      border: 1px solid var(--accent, #ff3c00);
      font-family: var(--font-mono, monospace);
      font-size: 0.75rem;
      text-transform: uppercase;
      padding: 8px 12px;
      z-index: 10001;
      pointer-events: none; 
      
      animation: float-bob 2s ease-in-out infinite;
      transition: opacity 0.3s ease;
  }
  ```
- **Replacement Code:**
  ```css
  #chat-callout {
      position: absolute;
      bottom: 80px; 
      right: 10px;
      background-color: var(--bg-color, #050505);
      color: var(--text-main, #e0e0e0);
      border: 1px solid var(--accent, #ff3c00);
      font-family: var(--font-mono, monospace);
      font-size: 0.75rem;
      text-transform: uppercase;
      padding: 8px 12px;
      z-index: 25;
      pointer-events: none; 
      
      animation: float-bob 2s ease-in-out infinite;
      transition: opacity 0.3s ease;
  }
  ```

#### Edit 6: Follow Module Slide-Out Stacking & Backing
- **Target Line Range:** Lines 266–287
- **Existing Code:**
  ```css
  .follow-module {
      position: absolute;
      bottom: 0; 
      right: 80px; /* Anchors right next to the 65px FAB, plus 15px gap */
      height: 65px; /* Matches FAB height perfectly */
      background: rgba(5, 5, 5, 0.98);
      border: 1px solid var(--accent, #ff3c00);
      padding: 0 15px;
      display: flex;
      flex-direction: row; /* Forces horizontal layout */
      align-items: center;
      gap: 15px;
      backdrop-filter: blur(5px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.9);
      z-index: 9998;
      
      /* Animation: Hides slightly to the right behind the FAB */
      opacity: 0;
      transform: translateX(40px); 
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  }
  ```
- **Replacement Code:**
  ```css
  .follow-module {
      position: absolute;
      bottom: 0; 
      right: 80px; /* Anchors right next to the 65px FAB, plus 15px gap */
      height: 65px; /* Matches FAB height perfectly */
      background-color: #050505;
      border: 1px solid var(--accent, #ff3c00);
      padding: 0 15px;
      display: flex;
      flex-direction: row; /* Forces horizontal layout */
      align-items: center;
      gap: 15px;
      backdrop-filter: blur(5px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.95);
      z-index: 15;
      
      /* Animation: Hides slightly to the right behind the FAB */
      opacity: 0;
      transform: translateX(40px); 
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  }
  ```

---

## 3. Verification Protocol & Acceptance Criteria Alignment

1. **Visual Clarity Verification (FS-001 § 5.1):**
   - Click `.chat-fab` to toggle `.active`.
   - Verify that the chat dialog surface is drawn completely over `.hero-content` ("Architecting Digital Superiority" and subtitles).
   - Assert zero letters, bounding boxes, or text artifacts bleed through the `#050505` chat window canvas.

2. **Asset Clearance Verification (FS-001 § 5.2):**
   - Verify the rotating `.hazard-tape-wrapper` (`z-index: 10000`) and `#hero-particles` canvas (`z-index: 1`) render strictly behind `.chat-container`, `.chat-fab`, and `.follow-module`.

3. **Scroll Test (FS-001 § 5.3):**
   - Scroll from document top (`scrollY = 0`) through the Projects grid to the Footer with the chatbox open.
   - Verify that the chatbox remains persistently anchored at `bottom: 20px; right: 20px;` across all scroll offsets without clipping or flicker against `header.glass-active`.

4. **Interaction Test (FS-001 § 5.4):**
   - Click `#chat-input`, submit a query with `TX` or Enter, verify message renders in `#chat-messages`.
   - Click `.follow-link` icons to confirm pointer events dispatch cleanly.
   - Click outside the widget to confirm page clicks register without phantom dead zones.
