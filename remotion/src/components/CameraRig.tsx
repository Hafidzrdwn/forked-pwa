import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CameraRigProps {
  children: React.ReactNode;
  scale?: number | ((frame: number) => number);
  x?: number | ((frame: number) => number);
  y?: number | ((frame: number) => number);
  rotation?: number | ((frame: number) => number);
  originX?: string | number;
  originY?: string | number;
  style?: React.CSSProperties;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  children,
  scale = 1,
  x = 0,
  y = 0,
  rotation = 0,
  originX = '50%',
  originY = '50%',
  style
}) => {
  const frame = useCurrentFrame();

  const currentScale = typeof scale === 'function' ? scale(frame) : scale;
  const currentX = typeof x === 'function' ? x(frame) : x;
  const currentY = typeof y === 'function' ? y(frame) : y;
  const currentRotation = typeof rotation === 'function' ? rotation(frame) : rotation;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        ...style
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: `${originX} ${originY}`,
          transform: `translate3d(${currentX}px, ${currentY}px, 0) scale(${currentScale}) rotate(${currentRotation}deg)`,
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
};
