# Quality Control and Inspection Report

## Executive Summary
This document provides the exhaustive Quality Control (QC) verification of the 25-second Instagram Story video promo for Forked (1080x1920 @ 30 fps, 750 frames). All checks follow the technical and artistic requirements defined in Phase 11.

---

## 1. Frame Geometry and Safe Zones
- **Output Dimensions:** 1080 x 1920 pixels (9:16 vertical aspect ratio).
- **Safe Zone Rules:**
  - Top margin: 210px minimum padding (Instagram Story user profile and progress bar safe zone).
  - Bottom margin: 250px minimum padding (Instagram Story direct message reply bar and sticker safe zone).
  - Horizontal margins: 72px left and right borders.
- **Verification Result:** PASSED. All core headlines, badges, interactive cards, and CTA elements remain strictly inside the 936px content corridor. No clipping detected at any frame.

---

## 2. Mascot Compositing and Alpha Channel
- **Source Assets:**
  - `mascot_overthinking.png`: Isolated transparent character depicting decision anxiety.
  - `mascot_confident.png`: Isolated transparent character celebrating verified scenario clarity.
- **Background Integrity:**
  - Evaluated on both dark background (`#1e261f`) and light background (`#f8f8f5`).
  - No residual rectangular borders, edge halos, or matte fringe detected.
  - Dynamic contact shadow (`radial-gradient`) renders realistically beneath feet.
- **Verification Result:** PASSED.

---

## 3. Brand Identity and Color Palette
- **Canvas Colors:**
  - Dark Hook: `#1e261f` (Forked Forest Dark).
  - Product Canvas: `#f8f8f5` (Warm Alabaster Canvas).
- **Primary Brand Accents:**
  - Primary Emerald: `#245d3e`.
  - Soft Emerald Container: `#e6f0ea`.
  - Coral Danger / Risk: `#d96253`.
  - Amber Warning: `#d49a42`.
- **Consistency:** Exact 1:1 match with the authentic Forked web application theme tokens.
- **Verification Result:** PASSED.

---

## 4. Simulation Data Integrity
All simulated metrics in the animation match the real engine formulas in Forked:
- Initial Dilemma State: 34% probability of success under default assumptions.
- Slider Interaction: Alokasi modal shifted from baseline to 82% allocation.
- Simulated Outcome: Probability rises dynamically from 34% to 89% with green semantic progression.
- Runway Metric: Runway extends to 14 months (Model: Monte Carlo 10,000 iterations).
- Comparison Card: Status Quo (34%, 4 Months) vs Forked Simulation (89%, 14 Months).
- **Verification Result:** PASSED.

---

## 5. Audio and Visual Synchronization
The video is synchronized to `soundtrack.wav` (96 BPM, 1 Bar = 75 frames, 1 Beat = 18.75 frames):
- Frame 9 (Beat 1.5): Hook title strike ("Terlalu Banyak Opsi").
- Frame 46 (Beat 3.5): Secondary statement accent ("Minim Kepastian").
- Frame 150 (Bar 3, Beat 1): Groove drop and scene transition to Product Reveal.
- Frame 300 (Bar 5, Beat 1): Main feature simulation downbeat.
- Frame 375 (Bar 6, Beat 1): Slider reaches optimal threshold (82% / 89%).
- Frame 480 (Bar 7.4): Harmonic resolution and punchline comparison entrance.
- Frame 533 (Bar 8, Beat 1): Review confirmation green stamp hits on musical accent.
- Frame 602 (Bar 9, Beat 1): Outro downbeat reveals CTA card and tagline.
- Frame 674: Final musical cadence.
- Frame 705 to 745: Exponential audio fade-out to complete silence before frame 750.
- **Verification Result:** PASSED. No abrupt audio clipping or unnatural drift.

---

## 6. Review Stills Verification
- Frame 45 (`out/qc-frame-45.png`): Dilemma hook headline with branching paths. Verified.
- Frame 85 (`out/qc-frame-85.png`): Full hook scene composition with both node choices. Verified.
- Frame 180 (`out/qc-frame-180.png`): Brand reveal with overthinking mascot and initial card. Verified.
- Frame 375 (`out/qc-frame-375.png`): Active slider at 82% with 89% counter and confident mascot. Verified.
- Frame 530 (`out/qc-frame-530.png`): Tilted comparison balance scale and scenario cards. Verified.
- Frame 545 (`out/qc-frame-545.png`): Green review confirmation checkmark stamp pop. Verified.
- Frame 650 (`out/qc-frame-650.png`): Closing CTA card, "Explore your options." tagline, and forked.id button. Verified.

---

## 7. Final Deliverables
- Video File: `remotion/out/forked-story.mp4` (25.0s, 750 frames, 1080x1920, H.264/AAC).
- Source Code: Clean, modular TypeScript components in `remotion/src/`.
- Documentation:
  - `docs/creative-audit.md`
  - `docs/art-direction.md`
  - `docs/audio-cue-sheet.md`
  - `docs/storyboard-25s.md`
  - `docs/quality-checklist.md`
