import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, staticFile, Img } from 'remotion';
import { BrandLogo } from '../components/BrandLogo';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Zap } from 'lucide-react';

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoEntrance = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 100 }
  });

  const mascotEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 95 }
  });

  const ctaEntrance = spring({
    frame: frame - 22,
    fps,
    config: { damping: 12, stiffness: 105 }
  });

  const badgeEntrance = spring({
    frame: frame - 32,
    fps,
    config: { damping: 14, stiffness: 90 }
  });

  const pulse = Math.sin(frame * 0.12) * 0.02;

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
        justifyContent: 'space-between',
        padding: '180px 60px 220px',
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
          top: '35%',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${Math.max(0, logoEntrance)}) translateY(${interpolate(
            logoEntrance,
            [0, 1],
            [30, 0]
          )}px)`,
          opacity: Math.max(0, logoEntrance)
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
          <BrandLogo size={140} animated={true} />
          <div
            style={{
              fontSize: 100,
              lineHeight: 1,
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: -2,
              color: '#0f172a'
            }}
          >
            forked<span style={{ color: '#10b981' }}>.</span>
          </div>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 32px',
            borderRadius: 999,
            backgroundColor: '#ecfdf5',
            border: '2px solid #a7f3d0',
            color: '#065f46',
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 0.5,
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15)'
          }}
        >
          <Sparkles size={28} color="#059669" />
          Explore your options.
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${Math.max(0, mascotEntrance)})`,
          opacity: Math.max(0, mascotEntrance)
        }}
      >
        <div
          style={{
            width: 480,
            height: 480,
            borderRadius: 56,
            overflow: 'hidden',
            boxShadow: '0 30px 60px -10px rgba(15, 23, 42, 0.2), 0 0 0 3px rgba(16, 185, 129, 0.3)',
            backgroundColor: '#ffffff',
            position: 'relative'
          }}
        >
          <Img
            src={staticFile('assets/mascot_confident.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div
          style={{
            marginTop: 24,
            backgroundColor: '#ffffff',
            padding: '14px 32px',
            borderRadius: 20,
            border: '2px solid #e2e8f0',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08)',
            fontSize: 26,
            fontWeight: 800,
            color: '#0f172a'
          }}
        >
          Keputusan Mantap. Pikiran Tenang.
        </div>
      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            transform: `scale(${Math.max(0, ctaEntrance) * (1 + pulse)}) translateY(${interpolate(
              ctaEntrance,
              [0, 1],
              [30, 0]
            )}px)`,
            opacity: Math.max(0, ctaEntrance),
            width: '100%',
            maxWidth: 940,
            marginBottom: 32
          }}
        >
          <div
            style={{
              width: '100%',
              backgroundColor: '#10b981',
              borderRadius: 36,
              padding: '32px 48px',
              boxShadow: '0 25px 60px -10px rgba(16, 185, 129, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#060a12',
              boxSizing: 'border-box'
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 46,
                  fontWeight: 900,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: -0.5
                }}
              >
                forked.hafidzrdwn.dev
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#064e3b',
                  marginTop: 6
                }}
              >
                Buka langsung di browser, tanpa daftar akun
              </div>
            </div>

            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: '#060a12',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ArrowRight size={38} color="#10b981" />
            </div>
          </div>
        </div>

        <div
          style={{
            transform: `translateY(${interpolate(badgeEntrance, [0, 1], [20, 0])}px)`,
            opacity: Math.max(0, badgeEntrance),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            fontSize: 24,
            fontWeight: 700,
            color: '#475569',
            backgroundColor: '#ffffff',
            border: '2px solid #e2e8f0',
            padding: '20px 38px',
            borderRadius: 999,
            boxShadow: '0 12px 28px rgba(0,0,0,0.06)'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Lock size={24} color="#10b981" /> 100% Client-Side
          </span>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={24} color="#10b981" /> Tanpa Akun
          </span>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={24} color="#10b981" /> Data Milikmu
          </span>
        </div>
      </div>
    </div>
  );
};
