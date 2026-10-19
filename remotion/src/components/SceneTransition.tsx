import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';

export type TransitionType = 'fade' | 'slide-up' | 'editorial-wipe' | 'zoom-dissolve';

export interface SceneTransitionProps {
  children: React.ReactNode;
  type?: TransitionType;
  enterDuration?: number;
  exitDuration?: number;
  totalSceneDuration: number;
  style?: React.CSSProperties;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  children,
  type = 'fade',
  enterDuration = 15,
  exitDuration = 15,
  totalSceneDuration,
  style
}) => {
  const frame = useCurrentFrame();

  const enterProgress = interpolate(
    frame,
    [0, enterDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 1, 0.35, 1)
    }
  );

  const exitStartFrame = totalSceneDuration - exitDuration;
  const exitProgress = interpolate(
    frame,
    [exitStartFrame, totalSceneDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.65, 0, 0.35, 1)
    }
  );

  let opacity = 1;
  let translateY = 0;
  let scale = 1;

  if (type === 'fade') {
    opacity = interpolate(enterProgress, [0, 1], [0, 1]) * (1 - exitProgress);
  } else if (type === 'slide-up') {
    opacity = interpolate(enterProgress, [0, 0.6], [0, 1], { extrapolateRight: 'clamp' }) * (1 - exitProgress);
    translateY = interpolate(enterProgress, [0, 1], [40, 0]) + interpolate(exitProgress, [0, 1], [0, -30]);
  } else if (type === 'zoom-dissolve') {
    opacity = interpolate(enterProgress, [0, 0.8], [0, 1], { extrapolateRight: 'clamp' }) * (1 - exitProgress);
    scale = interpolate(enterProgress, [0, 1], [0.96, 1.0]) * interpolate(exitProgress, [0, 1], [1.0, 1.04]);
  } else if (type === 'editorial-wipe') {
    opacity = interpolate(enterProgress, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }) * (1 - exitProgress);
    translateY = interpolate(enterProgress, [0, 1], [24, 0]);
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        opacity,
        transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
        willChange: 'opacity, transform',
        ...style
      }}
    >
      {children}
    </div>
  );
};
