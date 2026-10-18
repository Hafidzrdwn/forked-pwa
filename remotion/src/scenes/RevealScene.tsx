import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandLogo } from '../components/BrandLogo';
import { Sparkles, ShieldCheck, Cpu } from 'lucide-react';

export const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoEntrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 110 }
  });

  const textEntrance = spring({
    frame: frame - 16,
    fps,
    config: { damping: 13, stiffness: 100 }
  });

  const taglineEntrance = spring({
    frame: frame - 28,
    fps,
    config: { damping: 14, stiffness: 90 }
  });

  const cardEntrance = spring({
    frame: frame - 42,
    fps,
    config: { damping: 14, stiffness: 85 }
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
            'radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.06) 1px, transparent 0)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '32%',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          transform: `scale(${Math.max(0, logoEntrance)}) translateY(${interpolate(
            logoEntrance,
            [0, 1],
            [50, 0]
          )}px)`,
          opacity: Math.max(0, logoEntrance),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 44
        }}
      >
        <BrandLogo size={190} animated={true} />
      </div>

      <div
        style={{
          textAlign: 'center',
          transform: `translateY(${interpolate(textEntrance, [0, 1], [40, 0])}px)`,
          opacity: Math.max(0, textEntrance),
          marginBottom: 24
        }}
      >
        <div
          style={{
            fontSize: 92,
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
          transform: `scale(${Math.max(0, taglineEntrance)})`,
          opacity: Math.max(0, taglineEntrance),
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 34px',
          borderRadius: 999,
          backgroundColor: '#ecfdf5',
          border: '2px solid #a7f3d0',
          color: '#065f46',
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 0.5,
          marginBottom: 64,
          boxShadow: '0 12px 28px -6px rgba(16, 185, 129, 0.2)'
        }}
      >
        <Sparkles size={30} color="#059669" />
        Explore your options.
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 820,
          transform: `translateY(${interpolate(cardEntrance, [0, 1], [40, 0])}px)`,
          opacity: Math.max(0, cardEntrance),
          backgroundColor: '#ffffff',
          borderRadius: 32,
          border: '2px solid #e2e8f0',
          padding: '40px 48px',
          boxShadow: '0 24px 48px -12px rgba(15, 23, 42, 0.08)',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#059669',
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 14
          }}
        >
          PERSONAL DECISION STUDIO
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#1e293b',
            lineHeight: 1.35
          }}
        >
          Bukan sekadar mengira-ngira.
          <br />
          <span style={{ color: '#64748b', fontWeight: 500 }}>
            Timbang risiko dan untung rugi secara transparan.
          </span>
        </div>

        <div
          style={{
            marginTop: 32,
            display: 'flex',
            justifyContent: 'center',
            gap: 28,
            fontSize: 18,
            fontWeight: 700,
            color: '#475569'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={20} color="#10b981" /> 100% Local-First
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Cpu size={20} color="#10b981" /> Simulasi Reaktif
          </span>
        </div>
      </div>
    </div>
  );
};
