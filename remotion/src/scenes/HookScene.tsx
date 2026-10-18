import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sparkles, HelpCircle, ShieldAlert, Coffee, Flame } from 'lucide-react';

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 100 }
  });

  const subtitleSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 14, stiffness: 90 }
  });

  const diagramSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 14, stiffness: 85 }
  });

  const isFrozen = frame >= 65 && frame <= 108;
  const freezeProgress = spring({
    frame: frame - 65,
    fps,
    config: { damping: 10, stiffness: 160 }
  });

  const exitOpacity = interpolate(frame, [108, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const exitScale = interpolate(frame, [108, 120], [1, 0.94], {
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
        padding: '210px 72px 250px',
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
          padding: '12px 28px',
          borderRadius: 999,
          backgroundColor: '#fef2f2',
          border: '1.5px solid #fecaca',
          color: '#dc2626',
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          marginBottom: 32
        }}
      >
        <Flame size={26} color="#dc2626" />
        DILEMA MASA DEPAN
      </div>

      <div
        style={{
          textAlign: 'center',
          maxWidth: 920,
          transform: `translateY(${interpolate(subtitleSpring, [0, 1], [40, 0])}px)`,
          opacity: Math.max(0, subtitleSpring),
          marginBottom: 60
        }}
      >
        <h1
          style={{
            fontSize: 78,
            lineHeight: 1.12,
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: '#0f172a',
            margin: 0,
            letterSpacing: -1.5
          }}
        >
          Overthinking
          <br />
          <span style={{ color: '#059669' }}>masa depan lagi?</span>
        </h1>
        <p
          style={{
            fontSize: 28,
            color: '#64748b',
            marginTop: 20,
            lineHeight: 1.45,
            fontWeight: 500
          }}
        >
          Saat kepala penuh pertimbangan tapi takut salah langkah.
        </p>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 920,
          height: 820,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          transform: `scale(${Math.max(0, diagramSpring)})`,
          opacity: Math.max(0, diagramSpring)
        }}
      >
        <svg
          width="860"
          height="620"
          viewBox="0 0 860 620"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', bottom: 120, left: 30, overflow: 'visible' }}
        >
          <path
            d="M430 540 V360 C430 220 180 200 180 60"
            stroke="#94a3b8"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="18 14"
          />
          <path
            d="M430 360 C430 220 680 200 680 60"
            stroke="#10b981"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <circle cx="430" cy="540" r="18" fill="#0f172a" />
          <circle cx="430" cy="360" r="22" fill="#059669" />
          <circle cx="430" cy="360" r="10" fill="#ffffff" />
          <circle cx="180" cy="60" r="22" fill="#64748b" />
          <circle cx="680" cy="60" r="26" fill="#10b981" />
        </svg>

        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 0,
            width: 360,
            padding: '28px 30px',
            backgroundColor: '#ffffff',
            borderRadius: 28,
            border: '2px solid #e2e8f0',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)'
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#64748b',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              marginBottom: 8
            }}
          >
            PILIHAN A
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#1e293b',
              lineHeight: 1.25
            }}
          >
            Ikut kata orang
          </div>
          <div style={{ fontSize: 20, color: '#94a3b8', marginTop: 8 }}>
            Aman tapi bikin jenuh
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 0,
            width: 370,
            padding: '28px 30px',
            backgroundColor: '#ffffff',
            borderRadius: 28,
            border: '2.5px solid #10b981',
            boxShadow: '0 24px 44px -10px rgba(16, 185, 129, 0.22)'
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#059669',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Sparkles size={18} /> PILIHAN B
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#064e3b',
              lineHeight: 1.25
            }}
          >
            Nekat idealis
          </div>
          <div style={{ fontSize: 20, color: '#059669', marginTop: 8, fontWeight: 600 }}>
            Seru tapi cemas berlebih
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 20,
            zIndex: 10
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 16px 32px rgba(15,23,42,0.25)',
              border: '4px solid #ffffff'
            }}
          >
            <HelpCircle size={50} color="#ffffff" />
          </div>
          <span
            style={{
              marginTop: 14,
              fontSize: 20,
              fontWeight: 800,
              color: '#0f172a',
              backgroundColor: '#e2e8f0',
              padding: '8px 24px',
              borderRadius: 999,
              letterSpacing: 0.5
            }}
          >
            KAMU DI SINI
          </span>
        </div>

        {isFrozen && (
          <div
            style={{
              position: 'absolute',
              inset: -10,
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderRadius: 36,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 48,
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
              transform: `scale(${Math.max(0.7, freezeProgress)})`,
              backdropFilter: 'blur(10px)',
              zIndex: 40
            }}
          >
            <div
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                padding: '12px 28px',
                borderRadius: 999,
                fontWeight: 900,
                fontSize: 22,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 26,
                boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)'
              }}
            >
              FREEZE FRAME
            </div>

            <div
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: 1.25,
                fontFamily: 'var(--font-display)',
                marginBottom: 36
              }}
            >
              Kepala mendadak nge-hang.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}>
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 20,
                  padding: '20px 26px',
                  color: '#f8fafc',
                  fontSize: 24,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18
                }}
              >
                <Coffee size={30} color="#fbbf24" />
                <span>Gaji gede tapi tipes tiap bulan?</span>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 20,
                  padding: '20px 26px',
                  color: '#f8fafc',
                  fontSize: 24,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18
                }}
              >
                <ShieldAlert size={30} color="#f87171" />
                <span>Kejar passion tapi saldo tinggal dua puluh ribu?</span>
              </div>
            </div>

            <div
              style={{
                marginTop: 36,
                color: '#94a3b8',
                fontSize: 20,
                fontStyle: 'italic',
                fontWeight: 500
              }}
            >
              (Kondisi darurat overthinking sebelum tidur)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
