# Functional Specification: OBJ-04 Card Video Asset

## Overview
This specification details the functionality for updating the `OBJ-04` card component to display a continuously playing video asset within its designated "NEW COMPONENT ASSET" bounding box.

## Expected Functionality

### Asset Integration
The component identified as `OBJ-04` will contain a video element replacing the existing placeholder content inside the "NEW COMPONENT ASSET" container.
- **Media Source:** The video to be displayed is located at: `https://storage.googleapis.com/doom-tagging/platodoom_tagging.mp4`.

### Playback Behavior
The video player must adhere to the following behavioral requirements:
- **Automatic Playback:** The video must play automatically when the page loads or when it enters the viewport (depending on standard inline media behaviors).
- **Looping:** The video must play on a continuous, uninterrupted loop without reaching a stopped state at the end of the file.
- **Silent/Muted:** The video must play entirely without audio.

### Visual Presentation and Layout Constraints
- **Orientation Handling:** The provided video asset has a vertical aspect ratio (portrait mode). The designated bounding box for the "NEW COMPONENT ASSET" within `OBJ-04` is oriented horizontally (landscape mode).
- **Cropping & Scaling:** The video must completely fill the horizontal dimensions of the bounding box. The aspect ratio of the video must be preserved to prevent distortion or stretching. Consequently, the video must visually cover the entire container, resulting in the top and bottom portions of the vertical video overflowing and being cleanly cropped/hidden from view.
- **Containment:** No visual artifacts or video elements should bleed outside of the "NEW COMPONENT ASSET" bounding box.
