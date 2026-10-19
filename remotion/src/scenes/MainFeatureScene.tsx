import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { forkedPalette, forkedElevations, forkedRadius } from '../theme/forkedTheme';
import { HeadlineText, UILabelBadge } from '../components/TypographyComponents';
import { SimulationSlider } from '../components/SimulationSlider';
import { NumericCounter } from '../components/NumericCounter';
import { MascotCharacter } from '../components/MascotCharacter';
import { CameraRig } from '../components/CameraRig';
import { SceneTransition } from '../components/SceneTransition';
import { FORKED_DEMO_DATA } from '../theme/demoData';

export const MainFeatureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraScale = interpolate(frame, [0, 80, 180], [0.98, 1.02, 1.0], {
    extrapolateRight: 'clamp'
  });

  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 90 }
  });

  const cardTranslateY = interpolate(cardSpring, [0, 1], [40, 0]);

  const metricPulse = interpolate(frame, [72, 78, 86], [1, 1.06, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const isOptimal = frame >= 75;

  return (
    <SceneTransition type="fade" enterDuration={10} exitDuration={15} totalSceneDuration={180}>
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
              gap: 16,
              zIndex: 3,
              textAlign: 'center'
            }}
          >
            <UILabelBadge
              color={forkedPalette.primary.base}
              bg={forkedPalette.primary.soft}
              style={{ fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Simulasi Interaktif
            </UILabelBadge>

            <HeadlineText
              delayFrames={5}
              color={forkedPalette.text.primary}
              style={{ fontSize: 66, letterSpacing: -1.6 }}
            >
              Uji Asumsi. Lihat Hasil.
            </HeadlineText>

            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 30,
                color: forkedPalette.text.muted,
                maxWidth: 820
              }}
            >
              Ubah alokasi modal dan lihat kalkulasi kepastian keputusan secara langsung.
            </span>
          </div>

          <div
            style={{
              width: 936,
              backgroundColor: forkedPalette.surface.base,
              borderRadius: forkedRadius['3xl'],
              boxShadow: forkedElevations.card,
              border: `1px solid ${forkedPalette.border.default}`,
              padding: '48px 52px',
              display: 'flex',
              flexDirection: 'column',
              gap: 36,
              transform: `translate3d(0, ${cardTranslateY}px, 0)`,
              zIndex: 2,
              position: 'relative'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: isOptimal ? forkedPalette.primary.soft : forkedPalette.danger.soft,
                borderRadius: forkedRadius.xl,
                padding: '32px 36px',
                border: `1px solid ${isOptimal ? 'rgba(36, 93, 62, 0.2)' : 'rgba(181, 71, 57, 0.2)'}`,
                transform: `scale(${metricPulse})`,
                willChange: 'transform'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 20,
                    color: forkedPalette.text.muted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}
                >
                  Probabilitas Keberhasilan
                </span>

                <NumericCounter
                  startValue={FORKED_DEMO_DATA.simulation.initialValue}
                  endValue={FORKED_DEMO_DATA.simulation.targetValue}
                  startFrame={15}
                  durationFrames={60}
                  style={{ fontSize: 96, fontWeight: 800 }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: isOptimal ? forkedPalette.primary.base : forkedPalette.danger.base,
                    backgroundColor: isOptimal ? 'rgba(36, 93, 62, 0.16)' : 'rgba(181, 71, 57, 0.16)',
                    padding: '8px 20px',
                    borderRadius: 9999
                  }}
                >
                  {isOptimal ? FORKED_DEMO_DATA.simulation.targetLabel : FORKED_DEMO_DATA.simulation.initialLabel}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                paddingTop: 8
              }}
            >
              <SimulationSlider
                label="Alokasi Modal"
                startProgress={0.25}
                endProgress={0.82}
                dragStartFrame={15}
                dragDuration={60}
                width={832}
                leftLabel="25%"
                rightLabel="100%"
                currentValueText={(p) => `Alokasi: ${Math.round(p * 100)}%`}
              />
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 110,
              right: 60,
              zIndex: 4
            }}
          >
            <MascotCharacter
              pose="confident"
              action="react-slider"
              size={270}
              flipX={true}
              actionStartFrame={68}
            />
          </div>
        </div>
      </CameraRig>
    </SceneTransition>
  );
};
