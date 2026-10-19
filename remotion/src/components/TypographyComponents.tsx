import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { typography } from '../theme/typography';
import { forkedPalette } from '../theme/forkedTheme';

interface BaseTextProps {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

interface AnimatedTextProps extends BaseTextProps {
  delayFrames?: number;
  animated?: boolean;
}

export const MainHookText: React.FC<AnimatedTextProps> = ({
  children,
  color = forkedPalette.canvas.base,
  delayFrames = 0,
  animated = true,
  style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - delayFrames);

  const entrance = animated
    ? spring({
        frame: relFrame,
        fps,
        config: { damping: 16, stiffness: 95 }
      })
    : 1;

  const translateY = interpolate(entrance, [0, 1], [32, 0]);
  const opacity = interpolate(entrance, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <h1
      style={{
        ...typography.mainHook,
        color,
        transform: `translate3d(0, ${translateY}px, 0)`,
        opacity,
        margin: 0,
        ...style
      }}
    >
      {children}
    </h1>
  );
};

export const HeadlineText: React.FC<AnimatedTextProps> = ({
  children,
  color = forkedPalette.text.primary,
  delayFrames = 0,
  animated = true,
  style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - delayFrames);

  const entrance = animated
    ? spring({
        frame: relFrame,
        fps,
        config: { damping: 16, stiffness: 90 }
      })
    : 1;

  const translateY = interpolate(entrance, [0, 1], [24, 0]);
  const opacity = interpolate(entrance, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <h2
      style={{
        ...typography.sceneHeadline,
        color,
        transform: `translate3d(0, ${translateY}px, 0)`,
        opacity,
        margin: 0,
        ...style
      }}
    >
      {children}
    </h2>
  );
};

export const LargeMetricText: React.FC<BaseTextProps> = ({
  children,
  color = forkedPalette.primary.base,
  style
}) => {
  return (
    <div
      style={{
        ...typography.largeSimulationNumber,
        color,
        margin: 0,
        lineHeight: 1,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export const SupportingText: React.FC<AnimatedTextProps> = ({
  children,
  color = forkedPalette.text.muted,
  delayFrames = 0,
  animated = false,
  style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - delayFrames);

  const entrance = animated
    ? spring({
        frame: relFrame,
        fps,
        config: { damping: 16, stiffness: 85 }
      })
    : 1;

  const translateY = interpolate(entrance, [0, 1], [16, 0]);
  const opacity = interpolate(entrance, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <p
      style={{
        ...typography.supportingExplanation,
        color,
        transform: animated ? `translate3d(0, ${translateY}px, 0)` : undefined,
        opacity: animated ? opacity : 1,
        margin: 0,
        ...style
      }}
    >
      {children}
    </p>
  );
};

export const UILabelBadge: React.FC<BaseTextProps & { bg?: string; borderColor?: string }> = ({
  children,
  color = forkedPalette.text.muted,
  bg = 'transparent',
  borderColor,
  style
}) => {
  return (
    <span
      style={{
        ...typography.uiLabels,
        color,
        backgroundColor: bg,
        border: borderColor ? `1px solid ${borderColor}` : undefined,
        padding: bg !== 'transparent' ? '6px 14px' : undefined,
        borderRadius: bg !== 'transparent' ? 9999 : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {children}
    </span>
  );
};

export const TaglineText: React.FC<AnimatedTextProps> = ({
  children,
  color = forkedPalette.text.primary,
  delayFrames = 0,
  animated = true,
  style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - delayFrames);

  const entrance = animated
    ? spring({
        frame: relFrame,
        fps,
        config: { damping: 15, stiffness: 85 }
      })
    : 1;

  const translateY = interpolate(entrance, [0, 1], [24, 0]);
  const opacity = interpolate(entrance, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <h3
      style={{
        ...typography.finalTaglinePunchline,
        color,
        transform: `translate3d(0, ${translateY}px, 0)`,
        opacity,
        margin: 0,
        ...style
      }}
    >
      {children}
    </h3>
  );
};
