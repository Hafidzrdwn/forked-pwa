import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { forkedPalette } from '../theme/forkedTheme';

interface GraphicBaseProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const BranchingPathGraphic: React.FC<GraphicBaseProps & { progress?: number; animated?: boolean }> = ({
  size = 48,
  color = forkedPalette.primary.base,
  progress = 1,
  animated = false,
  style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drawProgress = animated
    ? spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 90 }
      })
    : progress;

  const leftLength = 48;
  const rightLength = 42;

  const leftOffset = interpolate(drawProgress, [0, 1], [leftLength, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const rightOffset = interpolate(drawProgress, [0.15, 1], [rightLength, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', ...style }}
    >
      <path
        d="M24 44V26C24 20 14 18 14 10V4"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={leftLength}
        strokeDashoffset={leftOffset}
      />
      <path
        d="M24 28C24 20 34 18 34 10V4"
        stroke={forkedPalette.brandGradient.accentBranch}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={rightLength}
        strokeDashoffset={rightOffset}
      />
      <circle cx="24" cy="44" r="3" fill={color} />
      <circle cx="24" cy="28" r="3.5" fill="#ffffff" stroke={color} strokeWidth="2.5" />
      <circle cx="14" cy="4" r="3" fill={color} />
      <circle cx="34" cy="4" r="3" fill={forkedPalette.brandGradient.accentBranch} />
    </svg>
  );
};

export const DecisionNodeGraphic: React.FC<GraphicBaseProps & { pulse?: boolean }> = ({
  size = 36,
  color = forkedPalette.primary.base,
  pulse = false,
  style
}) => {
  const frame = useCurrentFrame();
  const haloScale = pulse ? 1 + Math.sin(frame * 0.12) * 0.15 : 1;
  const haloOpacity = pulse ? 0.35 + Math.sin(frame * 0.12) * 0.15 : 0.25;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', ...style }}
    >
      <circle
        cx="18"
        cy="18"
        r="14"
        fill={forkedPalette.primary.soft}
        opacity={haloOpacity}
        style={{ transform: `scale(${haloScale})`, transformOrigin: '18px 18px' }}
      />
      <circle cx="18" cy="18" r="9" fill="#ffffff" stroke={color} strokeWidth="2.5" />
      <circle cx="18" cy="18" r="4" fill={color} />
    </svg>
  );
};

export const ScenarioIndicatorGraphic: React.FC<GraphicBaseProps & { scenario: 'A' | 'B' }> = ({
  size = 40,
  scenario = 'A',
  style
}) => {
  const isA = scenario === 'A';
  const strokeColor = isA ? forkedPalette.secondary.petrol : forkedPalette.primary.base;
  const fillColor = isA ? forkedPalette.secondary.petrolSoft : forkedPalette.primary.soft;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', ...style }}
    >
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="12"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2"
      />
      {isA ? (
        <path
          d="M14 28L20 12L26 28M16 23H24"
          stroke={strokeColor}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M15 12H22C24.2 12 26 13.8 26 16C26 18.2 24.2 20 22 20H15M15 20H23C25.2 20 27 21.8 27 24C27 26.2 25.2 28 23 28H15V12"
          stroke={strokeColor}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

export const ComparisonBalanceGraphic: React.FC<GraphicBaseProps & { tiltDegrees?: number }> = ({
  size = 44,
  color = forkedPalette.text.primary,
  tiltDegrees = 0,
  style
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', ...style }}
    >
      <path d="M24 6V42" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M12 42H36" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <g style={{ transform: `rotate(${tiltDegrees}deg)`, transformOrigin: '24px 14px' }}>
        <path d="M8 14H40" stroke={forkedPalette.primary.base} strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="24" cy="14" r="3.5" fill="#ffffff" stroke={color} strokeWidth="2.5" />
        <path d="M10 14L6 26H18L14 14" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        <path d="M38 14L34 26H46L42 14" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const SliderHandleGraphic: React.FC<GraphicBaseProps & { active?: boolean }> = ({
  size = 56,
  active = false,
  style
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', ...style }}
    >
      <circle
        cx="28"
        cy="28"
        r="26"
        fill={active ? forkedPalette.primary.soft : 'transparent'}
        stroke={active ? forkedPalette.primary.glowEnd : 'transparent'}
        strokeWidth="2"
      />
      <circle
        cx="28"
        cy="28"
        r="20"
        fill={forkedPalette.primary.base}
        stroke="#ffffff"
        strokeWidth="3.5"
      />
      <circle cx="28" cy="28" r="6" fill="#ffffff" />
    </svg>
  );
};

export const ReviewMarkerGraphic: React.FC<GraphicBaseProps & { animated?: boolean; strokeWidth?: number }> = ({
  size = 32,
  color = forkedPalette.primary.base,
  animated = false,
  strokeWidth = 3.2,
  style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = animated
    ? spring({
        frame,
        fps,
        config: { damping: 13, stiffness: 120 }
      })
    : 1;

  const pathLength = 26;
  const strokeOffset = interpolate(progress, [0, 1], [pathLength, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', ...style }}
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        fill={forkedPalette.primary.soft}
        stroke={forkedPalette.primary.glowEnd}
        strokeWidth="1.8"
      />
      <path
        d="M9 16.5L14 21.5L23 11.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={strokeOffset}
      />
    </svg>
  );
};

export const ArrowNavGraphic: React.FC<GraphicBaseProps> = ({
  size = 28,
  color = '#ffffff',
  style
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', ...style }}
    >
      <path
        d="M5 14H23M23 14L15 6M23 14L15 22"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
