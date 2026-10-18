# Forked: 25-Second Instagram Story Motion Promo

A high-fidelity, vertical motion design promo for **Forked** built with React, TypeScript, and Remotion.

## Video Specifications

- Duration: exactly 25 seconds (750 frames at 30 fps)
- Resolution: 1080 × 1920 (9:16 vertical ratio)
- Codec: H.264 MP4 with AAC stereo audio
- Output File: `remotion/out/forked-story.mp4`
- Safe Area: generous top (180px), bottom (260px), and horizontal (60px) safe zones calibrated for Instagram Stories

## Narrative Timeline

1. **0 to 4 Seconds (Frames 0 to 120): The Hook**
   - Question: "Overthinking masa depan lagi?"
   - Visual: Interactive branching dilemma showing Path A vs Path B with character at the crossroad.
   - Comedic Beat: Dramatic freeze-frame with tape-stop SFX and humorous thought dilemmas.

2. **4 to 8 Seconds (Frames 120 to 240): Product Reveal**
   - Visual: Branching lines morph into the authentic Forked SVG branching logo.
   - Typography: "forked." with tagline "Explore your options."
   - Subtitle: "Personal Decision Studio. Local-first. Tanpa tebak-tebakan."

3. **8 to 18 Seconds (Frames 240 to 540): Main Feature and Simulation**
   - Headline: "Change the numbers. Compare the paths."
   - Visual: Side-by-side comparison of Path 1 (MT BUMN Surabaya) and Path 2 (Remote Tech Startup).
   - Interactive Cursor: Smoothly drags the What-If slider from 0% to +45% cost increase.
   - Reactive Math: Net income and fit score recalculate in real-time using Forked's exact deterministic formula.
   - Head-to-Head Matrix: Compact trade-off comparison table with relative advantage chips.

4. **18 to 22 Seconds (Frames 540 to 660): The Punchline**
   - Setup: "Bukan peramal masa depan."
   - Pause: Brief cinematic silence.
   - Punchline: "Cuma cara lebih waras buat memilih."
   - Benefit points: Rational trade-off comparison, assumption testing, and peace of mind.

5. **22 to 25 Seconds (Frames 660 to 750): Closing and Call to Action**
   - Visual: Forked logo with radiant animated branches.
   - Tagline: "Explore your options."
   - Primary Call to Action: `forked.hafidzrdwn.dev`
   - Privacy Badges: 100% Client-Side, Tanpa Akun, Data Milikmu.

## Project Structure

```text
remotion/
├── out/
│   └── forked-story.mp4          # Final rendered video
├── public/
│   └── soundtrack.wav            # Bespoke royalty-free procedural soundtrack and SFX
├── scripts/
│   └── generate_soundtrack.mjs   # Procedural Web Audio/WAV generator
├── src/
│   ├── components/
│   │   └── BrandLogo.tsx         # Authentic SVG animated Forked brand mark
│   ├── scenes/
│   │   ├── HookScene.tsx         # Frames 0 to 120
│   │   ├── RevealScene.tsx       # Frames 120 to 240
│   │   ├── MainFeatureScene.tsx  # Frames 240 to 540
│   │   ├── PunchlineScene.tsx    # Frames 540 to 660
│   │   └── ClosingScene.tsx      # Frames 660 to 750
│   ├── utils/
│   │   └── scoring.ts            # Accurate deterministic scoring formula from Forked
│   ├── Composition.tsx           # Sequence timeline and audio integration
│   ├── Root.tsx                  # Remotion composition registration
│   ├── index.css                 # Base styling and Google Fonts import
│   └── index.ts                  # Remotion entry point
├── remotion.config.ts            # Remotion CLI configuration
├── tsconfig.json                 # Strict TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## Running the Remotion Studio Preview

To preview the animation interactively in your browser:

```bash
cd remotion
npm run dev
```

Open the local preview URL displayed in the terminal (usually `http://localhost:3000`) to scrub through frames, inspect safe margins, and hear audio playback.

## Rendering the Final MP4 Video

To render the full 1080 × 1920 MP4 video:

```bash
cd remotion
npx remotion render ForkedStoryPromo out/forked-story.mp4
```

To render a specific still frame:

```bash
cd remotion
npx remotion still ForkedStoryPromo --frame=360 out/frame-360.png
```

## Audio Design

The soundtrack (`remotion/public/soundtrack.wav`) was procedurally synthesized using additive synthesis and FM modeling in Node.js. It features a cheerful electronic rhythm, warm chords, pentatonic synth plucks, a tape-stop effect at 2.5s, UI click SFX at 11s, and an outro flourish at 22s. It is 100% royalty-free and contains no external copyrighted samples.
