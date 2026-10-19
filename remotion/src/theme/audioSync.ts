export const AUDIO_GRID = {
  fps: 30,
  bpm: 96,
  framesPerBeat: 18.75,
  framesPerBar: 75,
  totalFrames: 750,
  totalDurationSeconds: 25.0
} as const;

export const AUDIO_CUES = {
  hookStrike: 9,
  hookSupport: 46,
  suspenseKick: 121,
  grooveDrop: 150,
  percussionBuild: 225,
  highAccentChord: 271,
  interactionDownbeat: 300,
  sliderClimax: 375,
  sliderSettle: 435,
  harmonicResolution: 483,
  reviewConfirmation: 533,
  outroAnticipation: 571,
  outroDownbeat: 602,
  secondaryAccent: 646,
  finalCadence: 674,
  fadeStart: 705,
  completeSilence: 745
} as const;

export const SCENE_TIMINGS = {
  hook: {
    from: 0,
    durationInFrames: 150
  },
  reveal: {
    from: 150,
    durationInFrames: 150
  },
  simulation: {
    from: 300,
    durationInFrames: 300
  },
  mainFeature: {
    from: 300,
    durationInFrames: 180
  },
  punchline: {
    from: 480,
    durationInFrames: 120
  },
  closing: {
    from: 600,
    durationInFrames: 150
  }
} as const;

export const getAudioVolume = (frame: number): number => {
  if (frame <= AUDIO_CUES.fadeStart) {
    return 1.0;
  }
  if (frame >= AUDIO_CUES.completeSilence) {
    return 0.0;
  }
  const fadeProgress = (frame - AUDIO_CUES.fadeStart) / (AUDIO_CUES.completeSilence - AUDIO_CUES.fadeStart);
  return Math.max(0, Math.min(1, Math.cos((fadeProgress * Math.PI) / 2)));
};
