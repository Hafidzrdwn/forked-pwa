import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, staticFile, Img } from 'remotion';

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 }
  });

  const subtitleSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 85 }
  });

  const mascotSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 12, stiffness: 80 }
  });

  const isFrozen = frame >= 65;
  const freezeSpring = spring({
    frame: frame - 65,
    fps,
    config: { damping: 11, stiffness: 140 }
  });

  const slowZoom = interpolate(frame, [0, 65], [1, 1.06], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const cameraScale = isFrozen ? 1.08 + Math.sin((frame - 65) * 0.1) * 0.01 : slowZoom;

  const exitOpacity = interpolate(frame, [110, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const exitScale = interpolate(frame, [110, 120], [1, 0.94], {
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
            'radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.06) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          transform: `scale(${Math.max(0, titleSpring)}) translateY(${interpolate(
            titleSpring,
            [0, 1],
            [30, 0]
          )}px)`,
          opacity: Math.max(0, titleSpring),
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 32px',
          borderRadius: 999,
          backgroundColor: '#fef2f2',
          border: '2px solid #fecaca',
          color: '#dc2626',
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          marginBottom: 28
        }}
      >
        DILEMA PILIHAN HIDUP
      </div>

      <div
        style={{
          textAlign: 'center',
          maxWidth: 960,
          transform: `translateY(${interpolate(subtitleSpring, [0, 1], [35, 0])}px)`,
          opacity: Math.max(0, subtitleSpring),
          marginBottom: 44
        }}
      >
        <h1
          style={{
            fontSize: 82,
            lineHeight: 1.14,
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: '#0f172a',
            margin: 0,
            letterSpacing: -1.5
          }}
        >
          Bingung Pilih
          <br />
          <span style={{ color: '#2563eb' }}>Jalur Masa Depan?</span>
        </h1>
        <p
          style={{
            fontSize: 32,
            color: '#64748b',
            marginTop: 18,
            lineHeight: 1.4,
            fontWeight: 500
          }}
        >
          Saat kepala penuh pertimbangan tapi takut salah langkah.
        </p>
      </div>

      <div
        style={{
          width: 860,
          height: 980,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${Math.max(0, mascotSpring) * cameraScale})`,
          opacity: Math.max(0, mascotSpring)
        }}
      >
        <div
          style={{
            width: 780,
            height: 780,
            borderRadius: 48,
            overflow: 'hidden',
            boxShadow: '0 30px 70px -15px rgba(15, 23, 42, 0.18), 0 0 0 2px rgba(15, 23, 42, 0.05)',
            backgroundColor: '#ffffff',
            position: 'relative'
          }}
        >
          <Img
            src={staticFile(isFrozen ? 'assets/mascot_overthinking.jpg' : 'assets/mascot_crossroads.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isFrozen ? `scale(${1 + freezeSpring * 0.04})` : 'scale(1)',
              transition: 'transform 0.1s ease-out'
            }}
          />

          {!isFrozen && (
            <>
              <div
                style={{
                  position: 'absolute',
                  top: 36,
                  left: 36,
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(12px)',
                  padding: '14px 26px',
                  borderRadius: 20,
                  border: '1.5px solid rgba(37, 99, 235, 0.25)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  Jalur A
                </span>
                <span style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>
                  Korporat Stabil
                </span>
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: 36,
                  right: 36,
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(12px)',
                  padding: '14px 26px',
                  borderRadius: 20,
                  border: '1.5px solid rgba(5, 150, 105, 0.25)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  Jalur B
                </span>
                <span style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>
                  Startup & WFH
                </span>
              </div>
            </>
          )}

          {isFrozen && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 40
              }}
            >
              <div
                style={{
                  transform: `scale(${Math.max(0, freezeSpring)}) rotate(${interpolate(
                    freezeSpring,
                    [0, 1],
                    [-6, -2]
                  )}deg)`,
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  padding: '18px 36px',
                  borderRadius: 24,
                  fontSize: 34,
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  boxShadow: '0 20px 40px rgba(239, 68, 68, 0.45)',
                  textAlign: 'center',
                  marginBottom: 16
                }}
              >
                STATUS: OVERTHINKING AKUT
              </div>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  padding: '12px 28px',
                  borderRadius: 16,
                  fontSize: 24,
                  fontWeight: 700,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                }}
              >
                Tab browser: 48 | Jam tidur: berkurang
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
