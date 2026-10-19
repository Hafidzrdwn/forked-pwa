import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { HookScene } from './scenes/HookScene';
import { RevealScene } from './scenes/RevealScene';
import { MainFeatureScene } from './scenes/MainFeatureScene';
import { PunchlineScene } from './scenes/PunchlineScene';
import { ClosingScene } from './scenes/ClosingScene';
import { SCENE_TIMINGS } from './theme/audioSync';
import { SOUND_CUES } from './theme/soundCues';

export const ForkedStoryPromo: React.FC = () => {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: '#f8f8f5',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {SOUND_CUES.map((cue) => (
        <Sequence
          key={cue.id}
          from={cue.startFrame}
          durationInFrames={cue.durationInFrames}
          name={cue.id}
        >
          <Audio src={staticFile(cue.file)} volume={cue.volume} />
        </Sequence>
      ))}

      <Sequence
        from={SCENE_TIMINGS.hook.from}
        durationInFrames={SCENE_TIMINGS.hook.durationInFrames}
        name="Hook"
      >
        <HookScene />
      </Sequence>

      <Sequence
        from={SCENE_TIMINGS.reveal.from}
        durationInFrames={SCENE_TIMINGS.reveal.durationInFrames}
        name="Reveal"
      >
        <RevealScene />
      </Sequence>

      <Sequence
        from={SCENE_TIMINGS.mainFeature.from}
        durationInFrames={SCENE_TIMINGS.mainFeature.durationInFrames}
        name="MainFeature"
      >
        <MainFeatureScene />
      </Sequence>

      <Sequence
        from={SCENE_TIMINGS.punchline.from}
        durationInFrames={SCENE_TIMINGS.punchline.durationInFrames}
        name="Punchline"
      >
        <PunchlineScene />
      </Sequence>

      <Sequence
        from={SCENE_TIMINGS.closing.from}
        durationInFrames={SCENE_TIMINGS.closing.durationInFrames}
        name="Closing"
      >
        <ClosingScene />
      </Sequence>
    </div>
  );
};

