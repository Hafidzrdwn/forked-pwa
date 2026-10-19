import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { forkedPalette, forkedShadows } from '../theme/forkedTheme';
import { MainHookText, SupportingText, UILabelBadge } from '../components/TypographyComponents';
import { BranchingPathGraphic, DecisionNodeGraphic } from '../components/ForkedGraphics';
import { CameraRig } from '../components/CameraRig';
import { SceneTransition } from '../components/SceneTransition';

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraScale = interpolate(frame, [0, 150], [1.0, 1.04], {
    extrapolateRight: 'clamp'
  });

  const branchEntrance = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 15, stiffness: 85 }
  });

  const branchScale = interpolate(branchEntrance, [0, 1], [0.85, 1]);
  const branchOpacity = interpolate(branchEntrance, [0, 0.4], [0, 1], {
    extrapolateRight: 'clamp'
  });

  const nodeAEntrance = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 14, stiffness: 100 }
  });

  const nodeBEntrance = spring({
    frame: Math.max(0, frame - 55),
    fps,
    config: { damping: 14, stiffness: 100 }
  });

  const tensionPulse = Math.sin((frame / fps) * Math.PI * 4) * 0.04;

  return (
    <SceneTransition type="fade" enterDuration={10} exitDuration={15} totalSceneDuration={150}>
      <CameraRig scale={cameraScale} style={{ backgroundColor: forkedPalette.canvas.base }}>
        <div
          style={{
            width: 1080,
            height: 1920,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '210px 72px 250px',
            boxSizing: 'border-box',
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 20,
              zIndex: 3
            }}
          >
            <UILabelBadge
              color={forkedPalette.danger.base}
              bg={forkedPalette.danger.soft}
              borderColor={forkedPalette.border.default}
              style={{ fontSize: 18, letterSpacing: '0.12em', textTransform: 'uppercase' }}
            >
              Dilema Keputusan
            </UILabelBadge>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <MainHookText
                delayFrames={6}
                color={forkedPalette.text.primary}
                style={{ fontSize: 86, letterSpacing: -2.2 }}
              >
                Terlalu Banyak Opsi.
              </MainHookText>

              <MainHookText
                delayFrames={35}
                color={forkedPalette.danger.base}
                style={{ fontSize: 80, letterSpacing: -2.0 }}
              >
                Minim Kepastian.
              </MainHookText>
            </div>

            <SupportingText
              delayFrames={55}
              animated={true}
              color={forkedPalette.text.muted}
              style={{ fontSize: 34, maxWidth: 820, textAlign: 'center', marginTop: 12 }}
            >
              Memilih tanpa simulasi adalah spekulasi berisiko tinggi.
            </SupportingText>
          </div>

          <div
            style={{
              position: 'relative',
              width: 760,
              height: 640,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${branchScale + (frame > 70 ? tensionPulse : 0)})`,
              opacity: branchOpacity,
              zIndex: 2
            }}
          >
            <BranchingPathGraphic
              size={540}
              color={forkedPalette.primary.base}
              animated={true}
            />

            <div
              style={{
                position: 'absolute',
                top: 60,
                left: 60,
                transform: `scale(${nodeAEntrance})`,
                opacity: nodeAEntrance,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8
              }}
            >
              <DecisionNodeGraphic size={56} color={forkedPalette.danger.base} pulse={true} />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 20,
                  fontWeight: 600,
                  color: forkedPalette.danger.base,
                  backgroundColor: forkedPalette.surface.base,
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: `1px solid ${forkedPalette.border.default}`,
                  boxShadow: forkedShadows.subtle
                }}
              >
                Jalur Ragu (34%)
              </span>
            </div>

            <div
              style={{
                position: 'absolute',
                top: 60,
                right: 60,
                transform: `scale(${nodeBEntrance})`,
                opacity: nodeBEntrance,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8
              }}
            >
              <DecisionNodeGraphic size={56} color={forkedPalette.amber.base} pulse={true} />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 20,
                  fontWeight: 600,
                  color: forkedPalette.amber.base,
                  backgroundColor: forkedPalette.surface.base,
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: `1px solid ${forkedPalette.border.default}`,
                  boxShadow: forkedShadows.subtle
                }}
              >
                Alternatif B (?)
              </span>
            </div>
          </div>

          <div style={{ height: 40 }} />
        </div>
      </CameraRig>
    </SceneTransition>
  );
};
