import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface BrandLogoProps {
  size?: number;
  progress?: number;
  animated?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 120,
  progress = 1,
  animated = false
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

  const nodeScale = animated
    ? spring({
        frame: frame - 10,
        fps,
        config: { damping: 12, stiffness: 120 }
      })
    : 1;

  const leftBranchLen = 42;
  const rightBranchLen = 32;

  const leftOffset = interpolate(drawProgress, [0, 1], [leftBranchLen, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const rightOffset = interpolate(drawProgress, [0.2, 1], [rightBranchLen, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="forkGradRemotion" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id="accentGlowRemotion" x1="14" y1="8" x2="34" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#a7f3d0" />
          </linearGradient>
          <filter id="subtleShadowRemotion" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#047857" floodOpacity="0.35" />
          </filter>
        </defs>

        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="14"
          fill="url(#forkGradRemotion)"
          filter="url(#subtleShadowRemotion)"
        />

        <path
          d="M24 38V25C24 20 15 19 15 13V9"
          stroke="#FFFFFF"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={leftBranchLen}
          strokeDashoffset={leftOffset}
        />

        <path
          d="M24 27C24 20 33 19 33 13V9"
          stroke="#A7F3D0"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={rightBranchLen}
          strokeDashoffset={rightOffset}
        />

        <g style={{ transform: `scale(${Math.max(0, nodeScale)})`, transformOrigin: '24px 38px' }}>
          <circle cx="24" cy="38" r="2.4" fill="#A7F3D0" />
        </g>

        <g style={{ transform: `scale(${Math.max(0, nodeScale)})`, transformOrigin: '24px 27px' }}>
          <circle cx="24" cy="27" r="3.4" fill="#FFFFFF" />
          <circle cx="24" cy="27" r="1.5" fill="#065f46" />
        </g>

        <g style={{ transform: `scale(${Math.max(0, nodeScale)})`, transformOrigin: '15px 9px' }}>
          <circle cx="15" cy="9" r="3.2" fill="#FFFFFF" />
          <circle cx="15" cy="9" r="1.4" fill="#047857" />
        </g>

        <g style={{ transform: `scale(${Math.max(0, nodeScale)})`, transformOrigin: '33px 9px' }}>
          <circle cx="33" cy="9" r="3.4" fill="#A7F3D0" />
          <circle cx="33" cy="9" r="1.5" fill="#064e3b" />
        </g>
      </svg>
    </div>
  );
};
