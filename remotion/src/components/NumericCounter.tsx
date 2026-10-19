import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { typography } from '../theme/typography';
import { forkedPalette } from '../theme/forkedTheme';

export interface NumericCounterProps {
  startValue: number;
  endValue: number;
  startFrame: number;
  durationFrames?: number;
  formatter?: (val: number) => string;
  colorProgression?: boolean;
  style?: React.CSSProperties;
}

export const NumericCounter: React.FC<NumericCounterProps> = ({
  startValue,
  endValue,
  startFrame,
  durationFrames = 55,
  formatter = (val) => `${Math.round(val)}%`,
  colorProgression = true,
  style
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.22, 1, 0.36, 1)
    }
  );

  const currentValue = interpolate(
    progress,
    [0, 1],
    [startValue, endValue]
  );

  let textColor: string = forkedPalette.text.primary;
  if (colorProgression) {
    if (progress < 0.45) {
      textColor = forkedPalette.danger.base;
    } else if (progress < 0.75) {
      textColor = '#b27a32';
    } else {
      textColor = forkedPalette.primary.base;
    }
  }

  return (
    <div
      style={{
        ...typography.largeSimulationNumber,
        color: textColor,
        margin: 0,
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        willChange: 'contents',
        ...style
      }}
    >
      {formatter(currentValue)}
    </div>
  );
};
