import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SlidersHorizontal, MousePointer2 } from 'lucide-react';
import { scoreScenario, formatRupiah } from '../utils/scoring';

export const MainFeatureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 95 }
  });

  const cardsEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 90 }
  });

  const sliderEntrance = spring({
    frame: frame - 22,
    fps,
    config: { damping: 14, stiffness: 85 }
  });

  const matrixEntrance = spring({
    frame: frame - 34,
    fps,
    config: { damping: 14, stiffness: 85 }
  });

  const cameraScale = interpolate(
    frame,
    [0, 120, 200, 270],
    [0.98, 1.01, 1.01, 0.98],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const sliderProgress = interpolate(frame, [110, 195], [0, 0.40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const trackWidth = 850;
  const thumbLeft = (sliderProgress / 0.5) * trackWidth;

  const cursorX =
    frame < 110
      ? interpolate(frame, [80, 110], [750, 52 + thumbLeft], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        })
      : frame <= 195
      ? 52 + thumbLeft
      : interpolate(frame, [195, 225], [52 + thumbLeft, 700], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        });

  const cursorY =
    frame < 110
      ? interpolate(frame, [80, 110], [280, 136], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        })
      : frame <= 195
      ? 136
      : interpolate(frame, [195, 225], [136, 300], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        });

  const cursorOpacity = interpolate(frame, [80, 95, 215, 230], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const cursorScale = interpolate(frame, [105, 112, 194, 200], [1, 0.85, 0.85, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const pathA = {
    id: 'path-a',
    name: 'Jalur A: MT BUMN (Surabaya)',
    monthlyIncome: 12000000,
    monthlyCost: 6000000,
    hoursPerWeek: 45,
    growth: 75,
    risk: 25
  };

  const baseCostB = 5000000;
  const simulatedCostB = Math.round(baseCostB * (1 + sliderProgress));

  const pathB = {
    id: 'path-b',
    name: 'Jalur B: Remote Tech Startup',
    monthlyIncome: 16000000,
    monthlyCost: simulatedCostB,
    hoursPerWeek: 35,
    growth: 85,
    risk: 40
  };

  const scoreA = scoreScenario(pathA);
  const scoreB = scoreScenario(pathB);

  const exitOpacity = interpolate(frame, [285, 300], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const exitScale = interpolate(frame, [285, 300], [1, 0.95], {
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
        justifyContent: 'space-between',
        padding: '180px 60px 220px',
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
            'radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${Math.max(0, sceneEntrance)}) translateY(${interpolate(
            sceneEntrance,
            [0, 1],
            [30, 0]
          )}px)`,
          opacity: Math.max(0, sceneEntrance)
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 34px',
            borderRadius: 999,
            backgroundColor: '#eff6ff',
            border: '2px solid #bfdbfe',
            color: '#1d4ed8',
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginBottom: 16
          }}
        >
          SIMULASI DUA JALUR REALISTIS
        </div>

        <h2
          style={{
            fontSize: 58,
            lineHeight: 1.15,
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: '#0f172a',
            margin: 0,
            letterSpacing: -1.5,
            textAlign: 'center'
          }}
        >
          Bandingkan Angka, Bukan Firasat
        </h2>
      </div>

      <div
        style={{
          width: 960,
          display: 'flex',
          gap: 24,
          transform: `translateY(${interpolate(cardsEntrance, [0, 1], [30, 0])}px)`,
          opacity: Math.max(0, cardsEntrance)
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            borderRadius: 36,
            border: '2.5px solid #dbeafe',
            padding: '36px 32px',
            boxShadow: '0 20px 45px -10px rgba(37, 99, 235, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 18
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                padding: '8px 20px',
                borderRadius: 14,
                fontSize: 22,
                fontWeight: 800
              }}
            >
              JALUR A
            </span>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#64748b' }}>
              BUMN (Surabaya)
            </span>
          </div>

          <div style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: 14 }}>
            <div style={{ fontSize: 20, color: '#64748b', fontWeight: 600 }}>Gaji Pokok</div>
            <div style={{ fontSize: 38, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
              {formatRupiah(pathA.monthlyIncome)}
              <span style={{ fontSize: 20, color: '#94a3b8', fontWeight: 500 }}> / bulan</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 20, color: '#64748b', fontWeight: 600 }}>Biaya Hidup</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#334155', marginTop: 4 }}>
                {formatRupiah(pathA.monthlyCost)}
                <span style={{ fontSize: 18, color: '#94a3b8' }}> / bulan</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 20, color: '#64748b', fontWeight: 600 }}>Jam Kerja</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#334155', marginTop: 4 }}>
                45 jam per minggu
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#f8fafc',
              padding: '16px 20px',
              borderRadius: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 700, color: '#475569' }}>Tabungan Bersih:</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: '#059669' }}>
              {formatRupiah(pathA.monthlyIncome - pathA.monthlyCost)}
            </span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            borderRadius: 36,
            border: '2.5px solid #a7f3d0',
            padding: '36px 32px',
            boxShadow: '0 20px 45px -10px rgba(16, 185, 129, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: 18
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                backgroundColor: '#ecfdf5',
                color: '#047857',
                padding: '8px 20px',
                borderRadius: 14,
                fontSize: 22,
                fontWeight: 800
              }}
            >
              JALUR B
            </span>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#64748b' }}>
              Startup (Remote)
            </span>
          </div>

          <div style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: 14 }}>
            <div style={{ fontSize: 20, color: '#64748b', fontWeight: 600 }}>Gaji Pokok</div>
            <div style={{ fontSize: 38, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
              {formatRupiah(pathB.monthlyIncome)}
              <span style={{ fontSize: 20, color: '#94a3b8', fontWeight: 500 }}> / bulan</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 20, color: '#64748b', fontWeight: 600 }}>Biaya Hidup</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: sliderProgress > 0.05 ? '#dc2626' : '#0f172a', marginTop: 4 }}>
                {formatRupiah(pathB.monthlyCost)}
                <span style={{ fontSize: 18, color: '#94a3b8' }}> / bulan</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 20, color: '#64748b', fontWeight: 600 }}>Jam Kerja</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#334155', marginTop: 4 }}>
                35 jam per minggu
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ecfdf5',
              padding: '16px 20px',
              borderRadius: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 700, color: '#065f46' }}>Tabungan Bersih:</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: '#059669' }}>
              {formatRupiah(pathB.monthlyIncome - pathB.monthlyCost)}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          width: 960,
          backgroundColor: '#ffffff',
          borderRadius: 36,
          border: '2.5px solid #e2e8f0',
          padding: '38px 48px',
          boxShadow: '0 24px 50px -12px rgba(15, 23, 42, 0.1)',
          position: 'relative',
          transform: `translateY(${interpolate(sliderEntrance, [0, 1], [30, 0])}px)`,
          opacity: Math.max(0, sliderEntrance)
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                backgroundColor: '#eff6ff',
                padding: 12,
                borderRadius: 16,
                color: '#2563eb'
              }}
            >
              <SlidersHorizontal size={32} />
            </div>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#0f172a' }}>
                Simulasi Risiko What-If
              </div>
              <div style={{ fontSize: 22, color: '#64748b', marginTop: 2 }}>
                Uji ketahanan jika biaya hidup membengkak
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: sliderProgress > 0.1 ? '#fef2f2' : '#f8fafc',
              border: `2px solid ${sliderProgress > 0.1 ? '#fecaca' : '#e2e8f0'}`,
              padding: '10px 24px',
              borderRadius: 20,
              fontSize: 24,
              fontWeight: 800,
              color: sliderProgress > 0.1 ? '#dc2626' : '#64748b'
            }}
          >
            +{Math.round(sliderProgress * 100)}% Biaya Hidup
          </div>
        </div>

        <div style={{ position: 'relative', marginTop: 32, marginBottom: 18 }}>
          <div
            style={{
              width: '100%',
              height: 26,
              backgroundColor: '#e2e8f0',
              borderRadius: 999,
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${(sliderProgress / 0.5) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6 0%, #ef4444 100%)',
                borderRadius: 999
              }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              top: -15,
              left: `calc(${(sliderProgress / 0.5) * 100}% - 28px)`,
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '4px solid #2563eb',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, color: '#94a3b8', fontWeight: 600 }}>
          <span>Kondisi Normal (0%)</span>
          <span>Inflasi & Gaya Hidup (+50%)</span>
        </div>

        <div
          style={{
            position: 'absolute',
            left: cursorX,
            top: cursorY,
            opacity: cursorOpacity,
            transform: `scale(${cursorScale})`,
            pointerEvents: 'none',
            zIndex: 100,
            filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.35))'
          }}
        >
          <MousePointer2 size={48} color="#0f172a" fill="#2563eb" />
        </div>
      </div>

      <div
        style={{
          width: 960,
          backgroundColor: '#0f172a',
          borderRadius: 36,
          padding: '38px 44px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.4)',
          transform: `translateY(${interpolate(matrixEntrance, [0, 1], [30, 0])}px)`,
          opacity: Math.max(0, matrixEntrance)
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 20, color: '#94a3b8', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              LIVE DECISION SCORE
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 4 }}>
              Skor Kelayakan Trade-Off
            </div>
          </div>

          <div style={{ display: 'flex', gap: 28 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, color: '#93c5fd', fontWeight: 700 }}>SKOR JALUR A</div>
              <div style={{ fontSize: 46, fontWeight: 900, color: '#ffffff' }}>
                {scoreA.total}
                <span style={{ fontSize: 24, color: '#64748b', fontWeight: 500 }}>/100</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, color: '#6ee7b7', fontWeight: 700 }}>SKOR JALUR B</div>
              <div style={{ fontSize: 46, fontWeight: 900, color: scoreB.total >= scoreA.total ? '#10b981' : '#f59e0b' }}>
                {scoreB.total}
                <span style={{ fontSize: 24, color: '#64748b', fontWeight: 500 }}>/100</span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            padding: '20px 24px',
            borderRadius: 20,
            fontSize: 22,
            lineHeight: 1.45,
            color: '#cbd5e1',
            fontWeight: 600
          }}
        >
          <span style={{ color: '#38bdf8', fontWeight: 800 }}>Insight Forked: </span>
          {sliderProgress > 0.2
            ? 'Saat biaya hidup melonjak, stabilitas tabungan Jalur A mulai mengimbangi potensi gaji tinggi Jalur B.'
            : 'Jalur B unggul pada fleksibilitas waktu kerja dan pertumbuhan karir yang cepat.'}
        </div>
      </div>
    </div>
  );
};
