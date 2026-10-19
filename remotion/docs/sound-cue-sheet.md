# Forked Instagram Story: Sound Design Cue Sheet

## Creative Direction and Sound Principles
- **Atmosphere:** Minimalist tactile UI sound design with intentional silence.
- **Philosophy:** Audio serves as a restrained physical feedback layer for meaningful visual state changes. No background music loop, no cartoon sound effects, no loud impacts.
- **Sound-Off Principle:** The video is engineered to remain completely understandable and engaging with audio muted.
- **Timing Standard:** 30 frames per second. Total composition duration is 750 frames (25.0 seconds).

---

## Master Cue Sheet

| Sound ID | Audio Asset File | Start Frame | Timestamp | Duration (Frames) | Duration (Seconds) | Playback Volume | Associated Visual Event |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `hook-whoosh` | `public/sfx/whoosh_subtle.wav` | Frame 15 | 00:00.50 | 13 frames | 0.42s | 0.35 | Branching dilemma geometry emerges and primary hook headline slides into position |
| `slider-click` | `public/sfx/click_subtle.wav` | Frame 315 | 00:10.50 | 2 frames | 0.06s | 0.30 | Tactile slider handle engagement initiating real-time capital allocation adjustment |
| `simulation-confirm` | `public/sfx/confirm_chime.wav` | Frame 375 | 00:12.50 | 21 frames | 0.70s | 0.28 | Simulation metric settles at 89 percent and status badge shifts to green Optimal badge |
| `closing-reveal` | `public/sfx/reveal_soft.wav` | Frame 602 | 00:20.06 | 17 frames | 0.55s | 0.32 | Final scene transition revealing Forked brand emblem and closing tagline |

---

## Detailed Cue Breakdown

### 1. `hook-whoosh` (Frame 15)
- **File:** `whoosh_subtle.wav` (44.1 kHz, 16-bit PCM Mono).
- **Acoustic Characteristics:** Soft band-pass swept breath envelope peaking at 380 Hz with no sub-bass resonance.
- **Visual Trigger:** Frame 15 corresponds to the moment the branch tree stem splits into multiple uncertainty paths while the headline "Terlalu Banyak Opsi." locks into view.
- **Silence Context:** Preceded by 15 frames of silence; followed by 287 frames (approx. 9.5 seconds) of pure silence as the user reads the premise and watches the engine card reveal.

### 2. `slider-click` (Frame 315)
- **File:** `click_subtle.wav` (44.1 kHz, 16-bit PCM Mono).
- **Acoustic Characteristics:** Crisp micro-transient with resonant decay at 1280 Hz and fast damping (35ms).
- **Visual Trigger:** Frame 315 marks the exact frame where the user interaction simulation begins, dragging the capital allocation slider from 25 percent toward 82 percent.
- **Silence Context:** Gives physical tactile weight to the UI interaction without repetitive slider tick sounds.

### 3. `simulation-confirm` (Frame 375)
- **File:** `confirm_chime.wav` (44.1 kHz, 16-bit PCM Mono).
- **Acoustic Characteristics:** Pure dual-harmonic chime (E6 at 1318.5 Hz and B6 at 1975.5 Hz) with gentle acoustic exponential dissipation.
- **Visual Trigger:** Frame 375 marks the numerical climax where the counter transitions from red 34 percent to emerald 89 percent and the status tag transitions to "Optimal".
- **Silence Context:** Followed by 206 frames (nearly 7 seconds) of silence spanning the scenario comparison table and mascot reaction.

### 4. `closing-reveal` (Frame 602)
- **File:** `reveal_soft.wav` (44.1 kHz, 16-bit PCM Mono).
- **Acoustic Characteristics:** Warm rising harmonic swell (A4 to E5) fading in smoothly over 180ms with soft exponential release.
- **Visual Trigger:** Frame 602 marks the entrance of the final CTA card, presenting the official Forked wordmark and "Explore your options." tagline.
- **Silence Context:** Sustained decay fades gracefully into 131 frames of intentional silence to close the video cleanly without abrupt cuts.
