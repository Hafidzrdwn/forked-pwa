import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandLogo } from '../components/BrandLogo';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Zap } from 'lucide-react';

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoEntrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 }
  });

  const textEntrance = spring({
    frame: frame - 12,
    fps,
    config: { damping: 13, stiffness: 95 }
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
          width: 640,
          height: 640,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)',
          filter: 'blur(50px)',
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
          marginBottom: 36
        }}
      >
        <BrandLogo size={210} animated={true} />
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
            fontSize: 98,
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
          transform: `scale(${Math.max(0, textEntrance)})`,
          opacity: Math.max(0, textEntrance),
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 30px',
          borderRadius: 999,
          backgroundColor: '#ecfdf5',
          border: '1.5px solid #a7f3d0',
          color: '#065f46',
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: 0.5,
          marginBottom: 64
        }}
      >
        <Sparkles size={26} color="#059669" />
        Explore your options.
      </div>

      <div
        style={{
          transform: `scale(${Math.max(0, ctaEntrance)}) translateY(${interpolate(
            ctaEntrance,
            [0, 1],
            [40, 0]
          )}px)`,
          opacity: Math.max(0, ctaEntrance),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 780,
          marginBottom: 60
        }}
      >
        <div
          style={{
            width: '100%',
            backgroundColor: '#10b981',
            borderRadius: 32,
            padding: '28px 44px',
            boxShadow: '0 24px 50px -10px rgba(16, 185, 129, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            color: '#060a12',
            textDecoration: 'none'
          }}
        >
          <span
            style={{
              fontSize: 38,
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              letterSpacing: -0.5
            }}
          >
            forked.hafidzrdwn.dev
          </span>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: '#060a12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowRight size={30} color="#10b981" />
          </div>
        </div>
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(badgeEntrance, [0, 1], [30, 0])}px)`,
          opacity: Math.max(0, badgeEntrance),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          fontSize: 18,
          fontWeight: 700,
          color: '#64748b',
          backgroundColor: '#ffffff',
          border: '1.5px solid #e2e8f0',
          padding: '16px 32px',
          borderRadius: 999,
          boxShadow: '0 8px 20px rgba(0,0,0,0.04)'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Lock size={18} color="#10b981" /> 100% Client-Side
        </span>
        <span style={{ color: '#cbd5e1' }}>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={18} color="#10b981" /> Tanpa Akun
        </span>
        <span style={{ color: '#cbd5e1' }}>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={18} color="#10b981" /> Data Milikmu
        </span>
      </div>
    </div>
  );
};
