import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandLogo } from '../components/BrandLogo';
import { forkedPalette, forkedElevations, forkedRadius } from '../theme/forkedTheme';
import { HeadlineText, SupportingText, UILabelBadge } from '../components/TypographyComponents';
import { BranchingPathGraphic, ScenarioIndicatorGraphic } from '../components/ForkedGraphics';
import { MascotCharacter } from '../components/MascotCharacter';
import { CameraRig } from '../components/CameraRig';
import { SceneTransition } from '../components/SceneTransition';
import { FORKED_DEMO_DATA } from '../theme/demoData';

export const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraScale = interpolate(frame, [0, 150], [0.97, 1.02], {
    extrapolateRight: 'clamp'
  });

  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 95 }
  });

  const cardSpring = spring({
    frame: Math.max(0, frame - 16),
    fps,
    config: { damping: 16, stiffness: 85 }
  });

  const cardTranslateY = interpolate(cardSpring, [0, 1], [60, 0]);
  const cardOpacity = interpolate(cardSpring, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <SceneTransition type="fade" enterDuration={12} exitDuration={15} totalSceneDuration={150}>
      <CameraRig scale={cameraScale} style={{ backgroundColor: forkedPalette.canvas.base }}>
        <div
          style={{
            width: 1080,
            height: 1920,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '200px 72px 230px',
            boxSizing: 'border-box',
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 22,
              zIndex: 3
            }}
          >
            <div
              style={{
                transform: `scale(${logoSpring})`,
                opacity: logoSpring
              }}
            >
              <BrandLogo size={68} />
            </div>

            <UILabelBadge
              color={forkedPalette.primary.base}
              bg={forkedPalette.primary.soft}
              style={{ fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              The Forked Engine
            </UILabelBadge>

            <HeadlineText
              delayFrames={14}
              color={forkedPalette.text.primary}
              style={{ fontSize: 68, letterSpacing: -1.6, textAlign: 'center' }}
            >
              {FORKED_DEMO_DATA.reveal.engineTitle}
            </HeadlineText>

            <SupportingText
              delayFrames={30}
              animated={true}
              color={forkedPalette.text.muted}
              style={{ fontSize: 32, textAlign: 'center', maxWidth: 840 }}
            >
              Bangun pohon keputusan dan uji konsekuensi sebelum mengalokasikan sumber daya.
            </SupportingText>
          </div>

          <div
            style={{
              width: 936,
              backgroundColor: forkedPalette.surface.base,
              borderRadius: forkedRadius['3xl'],
              boxShadow: forkedElevations.card,
              border: `1px solid ${forkedPalette.border.default}`,
              padding: '44px 48px',
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
              transform: `translate3d(0, ${cardTranslateY}px, 0)`,
              opacity: cardOpacity,
              zIndex: 2,
              position: 'relative'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${forkedPalette.border.default}`,
                paddingBottom: 24
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <ScenarioIndicatorGraphic size={36} scenario="B" />
                <span
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: forkedPalette.text.primary
                  }}
                >
                  {FORKED_DEMO_DATA.reveal.projectTitle}
                </span>
              </div>

              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: forkedPalette.primary.base,
                  backgroundColor: forkedPalette.primary.soft,
                  padding: '6px 16px',
                  borderRadius: 9999
                }}
              >
                {FORKED_DEMO_DATA.reveal.statusBadge}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: forkedPalette.canvas.subtle,
                borderRadius: forkedRadius.xl,
                padding: '28px 32px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 18,
                    color: forkedPalette.text.muted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}
                >
                  Probabilitas Awal
                </span>
                <span
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 54,
                    fontWeight: 800,
                    color: forkedPalette.danger.base,
                    lineHeight: 1
                  }}
                >
                  34%
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: forkedPalette.danger.base,
                    backgroundColor: forkedPalette.danger.soft,
                    padding: '8px 20px',
                    borderRadius: 9999
                  }}
                >
                  Belum Teruji
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: 12
              }}
            >
              <BranchingPathGraphic
                size={220}
                color={forkedPalette.primary.base}
                animated={true}
              />
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 190,
              right: 64,
              zIndex: 4
            }}
          >
            <MascotCharacter
              pose="overthinking"
              action="look-branch"
              size={260}
              flipX={true}
              actionStartFrame={30}
            />
          </div>
        </div>
      </CameraRig>
    </SceneTransition>
  );
};
