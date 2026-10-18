import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandLogo } from '../components/BrandLogo';
import { Sparkles, ShieldCheck, Sliders, LineChart } from 'lucide-react';

export const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoEntrance = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 100 }
  });

  const textEntrance = spring({
    frame: frame - 12,
    fps,
    config: { damping: 13, stiffness: 95 }
  });

  const taglineEntrance = spring({
    frame: frame - 22,
    fps,
    config: { damping: 14, stiffness: 90 }
  });

  const cardsEntrance = spring({
    frame: frame - 32,
    fps,
    config: { damping: 14, stiffness: 85 }
  });

  const cameraScale = interpolate(frame, [0, 110], [1, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const exitOpacity = interpolate(frame, [106, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const exitScale = interpolate(frame, [106, 120], [1, 0.95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: '#fbfbf9',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '190px 60px 220px',
        opacity: exitOpacity,
        transform: `scale(${exitScale * cameraScale})`,
        transformOrigin: 'center center',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.08) 1px, transparent 0)',
          backgroundSize: '44px 44px',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '25%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          transform: `scale(${Math.max(0, logoEntrance)}) translateY(${interpolate(
            logoEntrance,
            [0, 1],
            [40, 0]
          )}px)`,
          opacity: Math.max(0, logoEntrance),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 28
        }}
      >
        <BrandLogo size={240} animated={true} />
      </div>

      <div
        style={{
          textAlign: 'center',
          transform: `translateY(${interpolate(textEntrance, [0, 1], [30, 0])}px)`,
          opacity: Math.max(0, textEntrance),
          marginBottom: 20
        }}
      >
        <div
          style={{
            fontSize: 114,
            lineHeight: 1,
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            letterSpacing: -3,
            color: '#0f172a'
          }}
        >
          forked<span style={{ color: '#10b981' }}>.</span>
        </div>
      </div>

      <div
        style={{
          transform: `scale(${Math.max(0, taglineEntrance)})`,
          opacity: Math.max(0, taglineEntrance),
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 42px',
          borderRadius: 999,
          backgroundColor: '#ecfdf5',
          border: '2.5px solid #a7f3d0',
          color: '#065f46',
          fontSize: 38,
          fontWeight: 800,
          letterSpacing: 0.5,
          marginBottom: 52,
          boxShadow: '0 16px 36px -8px rgba(16, 185, 129, 0.22)'
        }}
      >
        <Sparkles size={36} color="#059669" />
        Explore your options.
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 940,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          transform: `translateY(${interpolate(cardsEntrance, [0, 1], [40, 0])}px)`,
          opacity: Math.max(0, cardsEntrance)
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 36,
            border: '2.5px solid #e2e8f0',
            padding: '38px 44px',
            boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 28
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 24,
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Sliders size={40} color="#2563eb" />
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a' }}>
              Simulasi Multi Skenario
            </div>
            <div style={{ fontSize: 24, color: '#64748b', marginTop: 6, fontWeight: 500 }}>
              Bandingkan gaji, biaya hidup, dan waktu kerja dalam satu canvas
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 36,
            border: '2.5px solid #e2e8f0',
            padding: '38px 44px',
            boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 28
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 24,
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <LineChart size={40} color="#059669" />
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a' }}>
              Uji Risiko What-If
            </div>
            <div style={{ fontSize: 24, color: '#64748b', marginTop: 6, fontWeight: 500 }}>
              Ketahui ketahanan tabungan saat inflasi atau kebutuhan membengkak
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 36,
            border: '2.5px solid #e2e8f0',
            padding: '38px 44px',
            boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 28
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 24,
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={40} color="#d97706" />
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a' }}>
              100% Privat di Browser
            </div>
            <div style={{ fontSize: 24, color: '#64748b', marginTop: 6, fontWeight: 500 }}>
              Data finansial tidak pernah dikirim ke server mana pun
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
