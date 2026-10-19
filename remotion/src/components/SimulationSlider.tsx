import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { SliderHandleGraphic } from './ForkedGraphics';
import { forkedPalette } from '../theme/forkedTheme';
import { typography } from '../theme/typography';

export interface SimulationSliderProps {
  label?: string;
  startProgress?: number;
  endProgress?: number;
  dragStartFrame?: number;
  dragDuration?: number;
  width?: number;
  leftLabel?: string;
  rightLabel?: string;
  currentValueText?: string | ((progress: number) => string);
  style?: React.CSSProperties;
}

export const SimulationSlider: React.FC<SimulationSliderProps> = ({
  label = 'Alokasi Modal & Runway',
  startProgress = 0.25,
  endProgress = 0.82,
  dragStartFrame = 15,
  dragDuration = 55,
  width = 640,
  leftLabel = 'Runway 3 Bln',
  rightLabel = 'Runway 18 Bln',
  currentValueText,
  style
}) => {
  const frame = useCurrentFrame();

  const dragInterpolation = interpolate(
    frame,
    [dragStartFrame, dragStartFrame + dragDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 1, 0.35, 1)
    }
  );

  const currentProgress = interpolate(
    dragInterpolation,
    [0, 1],
    [startProgress, endProgress]
  );

  const handleWidth = 44;
  const availableTrackWidth = width - handleWidth;
  const handleX = currentProgress * availableTrackWidth;

  const valueDisplay = typeof currentValueText === 'function'
    ? currentValueText(currentProgress)
    : currentValueText || `${Math.round(currentProgress * 100)}%`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width,
        gap: 14,
        ...style
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ ...typography.uiLabels, color: forkedPalette.text.primary, fontSize: 18 }}>
          {label}
        </span>
        <span
          style={{
            ...typography.uiLabels,
            color: forkedPalette.primary.base,
            backgroundColor: forkedPalette.primary.soft,
            padding: '4px 12px',
            borderRadius: 9999,
            fontSize: 16
          }}
        >
          {valueDisplay}
        </span>
      </div>

      <div
        style={{
          position: 'relative',
          width,
          height: 48,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: 10,
            borderRadius: 5,
            backgroundColor: 'rgba(30, 38, 31, 0.1)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${currentProgress * 100}%`,
              height: '100%',
              backgroundColor: forkedPalette.primary.base,
              borderRadius: 5
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            transform: `translate3d(${handleX}px, 0, 0)`,
            willChange: 'transform',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <SliderHandleGraphic
            size={handleWidth}
            color={forkedPalette.primary.base}
            active={frame >= dragStartFrame && frame <= dragStartFrame + dragDuration}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ ...typography.uiLabels, color: forkedPalette.text.muted, fontSize: 14 }}>
          {leftLabel}
        </span>
        <span style={{ ...typography.uiLabels, color: forkedPalette.text.muted, fontSize: 14 }}>
          {rightLabel}
        </span>
      </div>
    </div>
  );
};
