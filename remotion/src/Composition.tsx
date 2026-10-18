import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { HookScene } from './scenes/HookScene';
import { RevealScene } from './scenes/RevealScene';
import { MainFeatureScene } from './scenes/MainFeatureScene';
import { PunchlineScene } from './scenes/PunchlineScene';
import { ClosingScene } from './scenes/ClosingScene';

export const ForkedStoryPromo: React.FC = () => {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: '#fbfbf9',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Audio src={staticFile('soundtrack.wav')} />

      <Sequence from={0} durationInFrames={120} name="Hook">
        <HookScene />
      </Sequence>

      <Sequence from={120} durationInFrames={120} name="Reveal">
        <RevealScene />
      </Sequence>

      <Sequence from={240} durationInFrames={300} name="MainFeature">
        <MainFeatureScene />
      </Sequence>

      <Sequence from={540} durationInFrames={120} name="Punchline">
        <PunchlineScene />
      </Sequence>

      <Sequence from={660} durationInFrames={90} name="Closing">
        <ClosingScene />
      </Sequence>
    </div>
  );
};
