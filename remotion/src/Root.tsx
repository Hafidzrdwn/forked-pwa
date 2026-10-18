import React from 'react';
import { Composition } from 'remotion';
import './index.css';
import { ForkedStoryPromo } from './Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ForkedStoryPromo"
        component={ForkedStoryPromo}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
