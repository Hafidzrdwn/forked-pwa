import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export type MascotPose = 'overthinking' | 'confident';
export type MascotAction = 'enter' | 'look-branch' | 'react-slider' | 'point-metric' | 'settle' | 'exit' | 'idle';

export interface MascotCharacterProps {
  pose?: MascotPose;
  action?: MascotAction;
  size?: number;
  flipX?: boolean;
  style?: React.CSSProperties;
  showShadow?: boolean;
  actionStartFrame?: number;
}

export const MascotCharacter: React.FC<MascotCharacterProps> = ({
  pose = 'confident',
  action = 'settle',
  size = 320,
  flipX = false,
  style,
  showShadow = true,
  actionStartFrame = 0
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - actionStartFrame);

  const enterSpring = spring({
    frame: relFrame,
    fps,
    config: { damping: 15, stiffness: 85, mass: 0.9 }
  });

  const exitSpring = spring({
    frame: relFrame,
    fps,
    config: { damping: 18, stiffness: 80 }
  });

  let translateY = 0;
  let translateX = 0;
  let rotationDeg = 0;
  let scaleX = 1;
  let scaleY = 1;
  let opacity = 1;
  let shadowScale = 1;
  let shadowOpacity = 0.28;

  if (action === 'enter') {
    translateY = interpolate(enterSpring, [0, 1], [90, 0]);
    opacity = interpolate(enterSpring, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    scaleX = interpolate(enterSpring, [0, 0.7, 1], [0.92, 1.03, 1.0]);
    scaleY = interpolate(enterSpring, [0, 0.7, 1], [1.08, 0.98, 1.0]);
    shadowScale = interpolate(enterSpring, [0, 1], [0.4, 1.0]);
    shadowOpacity = interpolate(enterSpring, [0, 1], [0.05, 0.28]);
  } else if (action === 'look-branch') {
    const tiltSpring = spring({
      frame: relFrame,
      fps,
      config: { damping: 16, stiffness: 90 }
    });
    rotationDeg = interpolate(tiltSpring, [0, 1], [0, flipX ? 4.5 : -4.5]);
    translateX = interpolate(tiltSpring, [0, 1], [0, flipX ? 14 : -14]);
    translateY = interpolate(tiltSpring, [0, 1], [0, -6]);
    scaleX = 1.0;
    scaleY = 1.0;
    shadowScale = 0.96;
  } else if (action === 'react-slider') {
    const anticipation = interpolate(relFrame, [0, 6], [0, 1], { extrapolateRight: 'clamp' });
    const isHopPhase = relFrame >= 6;

    if (!isHopPhase) {
      translateY = interpolate(anticipation, [0, 1], [0, 8]);
      scaleX = interpolate(anticipation, [0, 1], [1, 1.05]);
      scaleY = interpolate(anticipation, [0, 1], [1, 0.95]);
      shadowScale = 1.1;
      shadowOpacity = 0.35;
    } else {
      const hopFrame = relFrame - 6;
      const hopSpring = spring({
        frame: hopFrame,
        fps,
        config: { damping: 11, stiffness: 120, mass: 0.7 }
      });
      translateY = interpolate(hopSpring, [0, 0.4, 1], [8, -18, 0]);
      scaleX = interpolate(hopSpring, [0, 0.4, 0.7, 1], [1.05, 0.96, 1.02, 1.0]);
      scaleY = interpolate(hopSpring, [0, 0.4, 0.7, 1], [0.95, 1.06, 0.98, 1.0]);
      rotationDeg = interpolate(hopSpring, [0, 0.4, 1], [0, flipX ? -2.5 : 2.5, 0]);
      shadowScale = interpolate(hopSpring, [0, 0.4, 1], [1.1, 0.78, 1.0]);
      shadowOpacity = interpolate(hopSpring, [0, 0.4, 1], [0.35, 0.16, 0.28]);
    }
  } else if (action === 'point-metric') {
    const pointSpring = spring({
      frame: relFrame,
      fps,
      config: { damping: 15, stiffness: 85 }
    });
    translateX = interpolate(pointSpring, [0, 1], [0, flipX ? -16 : 16]);
    translateY = interpolate(pointSpring, [0, 1], [0, -10]);
    rotationDeg = interpolate(pointSpring, [0, 1], [0, flipX ? -3 : 3]);
    scaleX = interpolate(pointSpring, [0, 1], [1, 1.02]);
    scaleY = interpolate(pointSpring, [0, 1], [1, 1.02]);
    shadowScale = 0.92;
  } else if (action === 'settle') {
    const breathCycle = Math.sin((relFrame / fps) * Math.PI * 1.3);
    translateY = breathCycle * -2.5;
    scaleY = 1 + breathCycle * 0.012;
    scaleX = 1 - breathCycle * 0.008;
    shadowScale = 1 + breathCycle * 0.03;
    shadowOpacity = 0.28 - breathCycle * 0.03;
  } else if (action === 'exit') {
    translateY = interpolate(exitSpring, [0, 1], [0, 110]);
    opacity = interpolate(exitSpring, [0.4, 1], [1, 0], { extrapolateLeft: 'clamp' });
    scaleX = interpolate(exitSpring, [0, 0.2, 1], [1, 1.04, 0.92]);
    scaleY = interpolate(exitSpring, [0, 0.2, 1], [1, 0.95, 1.06]);
    shadowScale = interpolate(exitSpring, [0, 1], [1, 0.3]);
    shadowOpacity = interpolate(exitSpring, [0, 1], [0.28, 0]);
  }

  const assetSrc = pose === 'overthinking'
    ? staticFile('assets/mascot_overthinking.png')
    : staticFile('assets/mascot_confident.png');

  const baseDirection = flipX ? -1 : 1;
  const finalScaleX = scaleX * baseDirection;

  const shadowWidth = size * 0.58;
  const shadowHeight = size * 0.11;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: size,
        height: size * 1.08,
        pointerEvents: 'none',
        ...style
      }}
    >
      {showShadow && (
        <div
          style={{
            position: 'absolute',
            bottom: size * 0.02,
            left: '50%',
            transform: `translateX(-50%) scale(${shadowScale})`,
            width: shadowWidth,
            height: shadowHeight,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, rgba(30, 38, 31, ${shadowOpacity}) 0%, rgba(30, 38, 31, ${shadowOpacity * 0.4}) 45%, rgba(30, 38, 31, 0) 75%)`,
            zIndex: 1
          }}
        />
      )}

      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotationDeg}deg) scale(${finalScaleX}, ${scaleY})`,
          opacity,
          transformOrigin: '50% 90%',
          zIndex: 2
        }}
      >
        <Img
          src={assetSrc}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
    </div>
  );
};
