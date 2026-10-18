import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Check } from 'lucide-react';

export const PunchlineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const firstLineEntrance = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120 }
  });

  const disclaimerEntrance = spring({
    frame: frame - 18,
    fps,
    config: { damping: 14, stiffness: 100 }
  });

  const punchlineEntrance = spring({
    frame: frame - 60,
    fps,
    config: { damping: 12, stiffness: 110 }
  });

  const benefitsEntrance = spring({
    frame: frame - 75,
    fps,
    config: { damping: 14, stiffness: 90 }
  });

  const exitOpacity = interpolate(frame, [108, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const exitScale = interpolate(frame, [108, 120], [1, 0.95], {
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
        justifyContent: 'center',
        padding: '200px 72px 260px',
        opacity: exitOpacity,
        transform: `scale(${exitScale})`,
        transformOrigin: 'center center',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.05) 1px, transparent 0)',
          backgroundSize: '44px 44px',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          textAlign: 'center',
          transform: `translateY(${interpolate(firstLineEntrance, [0, 1], [30, 0])}px)`,
          opacity: Math.max(0, firstLineEntrance),
          marginBottom: 28
        }}
      >
        <div
          style={{
            fontSize: 66,
            fontWeight: 800,
            color: '#64748b',
            fontFamily: 'var(--font-display)',
            letterSpacing: -1,
            lineHeight: 1.2
          }}
        >
          Bukan peramal masa depan.
        </div>
      </div>

      <div
        style={{
          transform: `scale(${Math.max(0, disclaimerEntrance)})`,
          opacity: Math.max(0, disclaimerEntrance),
          backgroundColor: '#f1f5f9',
          color: '#64748b',
          fontSize: 20,
          fontWeight: 700,
          padding: '8px 24px',
          borderRadius: 999,
          marginBottom: 72
        }}
      >
        (Tidak bisa menebak jodoh atau angka keberuntungan)
      </div>

      <div
        style={{
          textAlign: 'center',
          transform: `scale(${Math.max(0, punchlineEntrance)}) translateY(${interpolate(
            punchlineEntrance,
            [0, 1],
            [40, 0]
          )}px)`,
          opacity: Math.max(0, punchlineEntrance),
          marginBottom: 64
        }}
      >
        <h2
          style={{
            fontSize: 78,
            fontWeight: 900,
            color: '#0f172a',
            fontFamily: 'var(--font-display)',
            letterSpacing: -1.5,
            lineHeight: 1.18,
            margin: 0
          }}
        >
          Cuma cara lebih{' '}
          <span
            style={{
              color: '#059669',
              textDecoration: 'underline',
              textDecorationColor: '#a7f3d0',
              textUnderlineOffset: 12
            }}
          >
            waras
          </span>
          <br />
          buat memilih.
        </h2>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 820,
          backgroundColor: '#ffffff',
          borderRadius: 32,
          border: '2px solid #e2e8f0',
          padding: '40px 44px',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
          transform: `translateY(${interpolate(benefitsEntrance, [0, 1], [30, 0])}px)`,
          opacity: Math.max(0, benefitsEntrance),
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 24, fontWeight: 700, color: '#1e293b' }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={26} color="#059669" />
          </div>
          <span>Bandingkan trade-off secara rasional</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 24, fontWeight: 700, color: '#1e293b' }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={26} color="#059669" />
          </div>
          <span>Uji asumsi sebelum terlanjur melangkah</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 24, fontWeight: 700, color: '#1e293b' }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={26} color="#059669" />
          </div>
          <span>Tidur tenang tanpa beban penyesalan</span>
        </div>
      </div>
    </div>
  );
};
