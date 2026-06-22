# Functional Specification: OBJ-04 Video Crop Adjustment

## Overview
This specification details the functionality for updating the vertical alignment of the video asset within the `OBJ-04` card to ensure the subject's face remains fully visible.

## Expected Functionality

### Visual Presentation and Layout Constraints
- **Orientation Handling:** The video asset within the "NEW COMPONENT ASSET" bounding box is vertically oriented, while the container is horizontal. It is correctly scaled to cover the container width.
- **Focal Point Adjustment:** Currently, the video's default cropping behavior centers it vertically, cutting off the top of the video (the model's face).
- **Target Adjustment:** The vertical alignment of the video must be shifted upwards. The visual cropping focus must prioritize the top edge of the video so that the model's head and upper torso are fully visible within the bounding box, forcing the clipped/overflowing area entirely to the bottom of the video frame.

### Behavioral Constraints
- No changes to the `src`, `autoplay`, `loop`, `muted`, or `playsinline` behavior are required.
- The width and height must continue to fill 100% of the bounding box.
