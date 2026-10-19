import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandLogo } from '../components/BrandLogo';
import { forkedPalette, forkedElevations } from '../theme/forkedTheme';
import { TaglineText, SupportingText, UILabelBadge } from '../components/TypographyComponents';
import { ArrowNavGraphic } from '../components/ForkedGraphics';
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

  const ctaSpring = spring({
    frame: Math.max(0, frame - 16),
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
            justifyContent: 'center',
            gap: 72,
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
              gap: 24,
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
              <BrandLogo size={76} />
            </div>

            <UILabelBadge
              color={forkedPalette.primary.base}
              bg={forkedPalette.primary.soft}
              style={{ fontSize: 18, letterSpacing: '0.12em', textTransform: 'uppercase' }}
            >
              Keputusan Nyata
            </UILabelBadge>

            <TaglineText
              delayFrames={8}
              color={forkedPalette.text.primary}
              style={{ fontSize: 84, letterSpacing: -2.2, maxWidth: 900 }}
            >
              {FORKED_DEMO_DATA.closing.primaryTagline}
            </TaglineText>

            <SupportingText
              delayFrames={20}
              animated={true}
              color={forkedPalette.text.muted}
              style={{ fontSize: 34, maxWidth: 840, lineHeight: 1.4 }}
            >
              {FORKED_DEMO_DATA.closing.subtitle}
            </SupportingText>
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
