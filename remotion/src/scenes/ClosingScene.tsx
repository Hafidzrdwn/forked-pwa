import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandLogo } from '../components/BrandLogo';
import { forkedPalette, forkedElevations, forkedRadius } from '../theme/forkedTheme';
import { TaglineText, SupportingText, UILabelBadge } from '../components/TypographyComponents';
import { ArrowNavGraphic, ScenarioIndicatorGraphic } from '../components/ForkedGraphics';
import { MascotCharacter } from '../components/MascotCharacter';
import { CameraRig } from '../components/CameraRig';
import { SceneTransition } from '../components/SceneTransition';
import { FORKED_DEMO_DATA } from '../theme/demoData';

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraScale = interpolate(frame, [0, 150], [0.98, 1.01], {
    extrapolateRight: 'clamp'
  });

  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 95 }
  });

  const productSpring = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 16, stiffness: 90 }
  });

  const ctaSpring = spring({
    frame: Math.max(0, frame - 28),
    fps,
    config: { damping: 14, stiffness: 105 }
  });

  const pulse = Math.sin((frame / fps) * Math.PI * 2) * 0.015;

  return (
    <SceneTransition type="fade" enterDuration={10} exitDuration={20} totalSceneDuration={150}>
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
              gap: 20,
              zIndex: 3,
              textAlign: 'center'
            }}
          >
            <div
              style={{
                transform: `scale(${logoSpring})`,
                opacity: logoSpring
              }}
            >
              <BrandLogo size={64} />
            </div>

            <UILabelBadge
              color={forkedPalette.primary.base}
              bg={forkedPalette.primary.soft}
              style={{ fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Keputusan Nyata
            </UILabelBadge>

            <TaglineText
              delayFrames={8}
              color={forkedPalette.text.primary}
              style={{ fontSize: 76, letterSpacing: -2.0, maxWidth: 900 }}
            >
              {FORKED_DEMO_DATA.closing.primaryTagline}
            </TaglineText>

            <SupportingText
              delayFrames={20}
              animated={true}
              color={forkedPalette.text.muted}
              style={{ fontSize: 32, maxWidth: 840 }}
            >
              {FORKED_DEMO_DATA.closing.subtitle}
            </SupportingText>
          </div>

          <div
            style={{
              width: 936,
              backgroundColor: forkedPalette.surface.base,
              borderRadius: forkedRadius['3xl'],
              boxShadow: forkedElevations.card,
              border: `1px solid ${forkedPalette.border.default}`,
              padding: '40px 48px',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              transform: `translate3d(0, ${interpolate(productSpring, [0, 1], [40, 0])}px, 0)`,
              opacity: productSpring,
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
                paddingBottom: 20
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <ScenarioIndicatorGraphic size={32} scenario="B" />
                <span
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 24,
                    fontWeight: 700,
                    color: forkedPalette.text.primary
                  }}
                >
                  Peta Simulasi Skenario
                </span>
              </div>

              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: forkedPalette.primary.base,
                  backgroundColor: forkedPalette.primary.soft,
                  padding: '4px 14px',
                  borderRadius: 9999
                }}
              >
                Keputusan Terbimbing
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: forkedPalette.canvas.subtle,
                borderRadius: forkedRadius.xl,
                padding: '24px 30px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 16,
                    color: forkedPalette.text.muted,
                    textTransform: 'uppercase'
                  }}
                >
                  Hasil Simulasi Akhir
                </span>
                <span
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 48,
                    fontWeight: 800,
                    color: forkedPalette.primary.base
                  }}
                >
                  89% Probabilitas
                </span>
              </div>

              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: forkedPalette.primary.base
                }}
              >
                Risiko Terkendali
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              zIndex: 3
            }}
          >
            <div
              style={{
                transform: `scale(${ctaSpring + pulse})`,
                opacity: ctaSpring
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  backgroundColor: forkedPalette.primary.base,
                  padding: '22px 56px',
                  borderRadius: 9999,
                  boxShadow: forkedElevations.floating
                }}
              >
                <span
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 32,
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '-0.5px'
                  }}
                >
                  {FORKED_DEMO_DATA.closing.actionUrl}
                </span>
                <ArrowNavGraphic size={28} color="#ffffff" />
              </div>
            </div>

            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 20,
                color: forkedPalette.text.subtle
              }}
            >
              Mulai simulasi keputusan pertama Anda secara gratis
            </span>
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
              pose="confident"
              action="enter"
              size={260}
              flipX={true}
              actionStartFrame={10}
            />
          </div>
        </div>
      </CameraRig>
    </SceneTransition>
  );
};
