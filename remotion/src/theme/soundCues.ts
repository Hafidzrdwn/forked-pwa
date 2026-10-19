export interface SoundCueItem {
  id: string;
  file: string;
  startFrame: number;
  durationInFrames: number;
  volume: number;
  visualEvent: string;
}

export const SOUND_CUES: readonly SoundCueItem[] = [
  {
    id: 'hook-whoosh',
    file: 'sfx/whoosh_subtle.wav',
    startFrame: 15,
    durationInFrames: 13,
    volume: 0.35,
    visualEvent: 'Branching dilemma geometry emerges and hook headline animates in'
  },
  {
    id: 'slider-click',
    file: 'sfx/click_subtle.wav',
    startFrame: 315,
    durationInFrames: 2,
    volume: 0.30,
    visualEvent: 'Tactile slider handle engagement initiating assumption adjustment'
  },
  {
    id: 'simulation-confirm',
    file: 'sfx/confirm_chime.wav',
    startFrame: 375,
    durationInFrames: 21,
    volume: 0.28,
    visualEvent: 'Simulation metric settles at 89 percent and status shifts to green Optimal badge'
  },
  {
    id: 'closing-reveal',
    file: 'sfx/reveal_soft.wav',
    startFrame: 602,
    durationInFrames: 17,
    volume: 0.32,
    visualEvent: 'Final scene transition revealing Forked brand mark and closing tagline'
  }
] as const;
