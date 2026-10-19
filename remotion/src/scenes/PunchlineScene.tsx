import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { forkedPalette, forkedElevations, forkedRadius } from '../theme/forkedTheme';
import { HeadlineText, UILabelBadge } from '../components/TypographyComponents';
import { ComparisonBalanceGraphic, ReviewMarkerGraphic } from '../components/ForkedGraphics';
import { CameraRig } from '../components/CameraRig';
import { SceneTransition } from '../components/SceneTransition';
import { FORKED_DEMO_DATA } from '../theme/demoData';

export const PunchlineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraScale = interpolate(frame, [0, 120], [0.98, 1.02], {
    extrapolateRight: 'clamp'
  });

  const cardAEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 95 }
  });

  const cardBEntrance = spring({
    frame: Math.max(0, frame - 16),
    fps,
    config: { damping: 15, stiffness: 95 }
  });

  const reviewStamp = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { damping: 12, stiffness: 140 }
  });

  const isReviewed = frame >= 53;

  return (
    <SceneTransition type="fade" enterDuration={10} exitDuration={15} totalSceneDuration={120}>
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
              gap: 18,
              zIndex: 3,
              textAlign: 'center'
            }}
          >
            <UILabelBadge
              color={forkedPalette.primary.base}
              bg={forkedPalette.primary.soft}
              style={{ fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Komparasi Keputusan
            </UILabelBadge>

            <HeadlineText
              delayFrames={4}
              color={forkedPalette.text.primary}
              style={{ fontSize: 68, letterSpacing: -1.8, maxWidth: 880 }}
            >
              {FORKED_DEMO_DATA.simulation.punchline}
            </HeadlineText>

            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 30,
                color: forkedPalette.text.muted,
                maxWidth: 820
              }}
            >
              Bandingkan konsekuensi setiap pilihan secara berdampingan.
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 28,
              width: 936,
              zIndex: 2
            }}
          >
            <ComparisonBalanceGraphic
              size={120}
              color={forkedPalette.primary.base}
              tiltDegrees={10}
            />

            <div
              style={{
                width: '100%',
                backgroundColor: forkedPalette.surface.base,
                borderRadius: forkedRadius['2xl'],
                border: `1px solid ${forkedPalette.border.default}`,
                padding: '32px 36px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: forkedElevations.subtle,
                opacity: cardAEntrance,
                transform: `translate3d(0, ${interpolate(cardAEntrance, [0, 1], [30, 0])}px, 0)`
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 26,
                    fontWeight: 700,
                    color: forkedPalette.text.primary
                  }}
                >
                  {FORKED_DEMO_DATA.simulation.scenarios.statusQuo.name}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 18,
                    color: forkedPalette.text.muted
                  }}
                >
                  {FORKED_DEMO_DATA.simulation.scenarios.statusQuo.tagline}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: 40,
                      fontWeight: 800,
                      color: forkedPalette.danger.base
                    }}
                  >
                    34%
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 16,
                      color: forkedPalette.text.muted
                    }}
                  >
                    Runway 4 Bulan
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                width: '100%',
                backgroundColor: forkedPalette.surface.base,
                borderRadius: forkedRadius['2xl'],
                border: `2px solid ${forkedPalette.primary.base}`,
                padding: '36px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: forkedElevations.card,
                position: 'relative',
                opacity: cardBEntrance,
                transform: `translate3d(0, ${interpolate(cardBEntrance, [0, 1], [30, 0])}px, 0)`
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: 28,
                      fontWeight: 800,
                      color: forkedPalette.primary.base
                    }}
                  >
                    {FORKED_DEMO_DATA.simulation.scenarios.forkedOptimized.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color: forkedPalette.primary.base,
                      backgroundColor: forkedPalette.primary.soft,
                      padding: '4px 10px',
                      borderRadius: 9999,
                      textTransform: 'uppercase'
                    }}
                  >
                    Rekomendasi
                  </span>
                </div>

                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 18,
                    color: forkedPalette.text.muted
                  }}
                >
                  {FORKED_DEMO_DATA.simulation.scenarios.forkedOptimized.tagline}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: 48,
                      fontWeight: 800,
                      color: forkedPalette.primary.base
                    }}
                  >
                    89%
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 16,
                      fontWeight: 600,
                      color: forkedPalette.primary.base
                    }}
                  >
                    Runway 14 Bulan
                  </span>
                </div>

                {isReviewed && (
                  <div
                    style={{
                      transform: `scale(${reviewStamp})`,
                      transformOrigin: 'center'
                    }}
                  >
                    <ReviewMarkerGraphic size={54} color={forkedPalette.primary.base} animated={true} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              zIndex: 3
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 22,
                color: forkedPalette.text.muted,
                letterSpacing: '0.04em'
              }}
            >
              Keputusan terbaik selalu berawal dari skenario teruji.
            </span>
          </div>
        </div>
      </CameraRig>
    </SceneTransition>
  );
};
