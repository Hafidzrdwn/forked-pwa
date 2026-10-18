import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Wallet,
  Clock,
  SlidersHorizontal,
  MousePointer2,
  CheckCircle2,
  Award,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
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
    frame: frame - 12,
    fps,
    config: { damping: 14, stiffness: 85 }
  });

  const sliderEntrance = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 90 }
  });

  const matrixEntrance = spring({
    frame: frame - 40,
    fps,
    config: { damping: 14, stiffness: 85 }
  });

  const sliderProgress = interpolate(frame, [70, 180], [0, 0.45], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const thumbX = 92 + (sliderProgress / 0.5) * 896;

  const cursorX =
    frame < 70
      ? interpolate(frame, [45, 70], [580, 96], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        })
      : frame <= 180
      ? thumbX + 4
      : interpolate(frame, [180, 215], [thumbX + 4, 750], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        });

  const cursorY =
    frame < 70
      ? interpolate(frame, [45, 70], [1250, 912], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        })
      : frame <= 180
      ? 912
      : interpolate(frame, [180, 215], [912, 1160], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        });

  const cursorOpacity = interpolate(frame, [40, 52, 205, 220], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const cursorScale = interpolate(frame, [66, 72, 180, 186], [1, 0.85, 0.85, 1], {
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

  const baseIncomeB = 16000000;
  const baseCostB = 5000000;
  const simulatedCostB = Math.round(baseCostB * (1 + sliderProgress));

  const pathB = {
    id: 'path-b',
    name: 'Jalur B: Remote Tech Startup',
    monthlyIncome: baseIncomeB,
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
        padding: '190px 60px 250px',
        opacity: exitOpacity,
        transform: `scale(${exitScale})`,
        transformOrigin: 'center center',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          transform: `translateY(${interpolate(sceneEntrance, [0, 1], [30, 0])}px)`,
          opacity: Math.max(0, sceneEntrance),
          marginBottom: 32
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 24px',
            borderRadius: 999,
            backgroundColor: '#ecfdf5',
            border: '1.5px solid #a7f3d0',
            color: '#065f46',
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 16
          }}
        >
          <SlidersHorizontal size={22} color="#059669" />
          SIMULASI WHAT-IF INTERAKTIF
        </div>

        <h2
          style={{
            fontSize: 54,
            fontWeight: 800,
            color: '#0f172a',
            margin: 0,
            lineHeight: 1.2,
            fontFamily: 'var(--font-display)',
            letterSpacing: -1
          }}
        >
          Change the numbers.
          <br />
          <span style={{ color: '#059669' }}>Compare the paths.</span>
        </h2>
      </div>

      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          transform: `translateY(${interpolate(cardsEntrance, [0, 1], [40, 0])}px)`,
          opacity: Math.max(0, cardsEntrance),
          marginBottom: 26
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 28,
            border: '2px solid #e2e8f0',
            padding: '26px 24px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: '#64748b',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 6
            }}
          >
            PILIHAN 1
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#1e293b',
              lineHeight: 1.3,
              marginBottom: 18
            }}
          >
            MT BUMN Surabaya
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              padding: '14px 20px',
              backgroundColor: '#f8fafc',
              borderRadius: 20,
              marginBottom: 20
            }}
          >
            <span
              style={{
                fontSize: 46,
                fontWeight: 900,
                color: '#1e293b',
                fontFamily: 'var(--font-display)',
                lineHeight: 1
              }}
            >
              {scoreA.total}
            </span>
            <span style={{ fontSize: 16, color: '#64748b', fontWeight: 700 }}>/100 Skor</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
              <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Wallet size={16} /> Pemasukan
              </span>
              <strong style={{ color: '#0f172a' }}>{formatRupiah(pathA.monthlyIncome)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
              <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Wallet size={16} /> Pengeluaran
              </span>
              <strong style={{ color: '#ef4444' }}>{formatRupiah(pathA.monthlyCost)}</strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 16,
                paddingTop: 10,
                borderTop: '1px solid #f1f5f9'
              }}
            >
              <span style={{ color: '#065f46', fontWeight: 700 }}>Sisa Bersih</span>
              <strong style={{ color: '#065f46', fontWeight: 800 }}>
                {formatRupiah(scoreA.net)}/bulan
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
              <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={16} /> Waktu
              </span>
              <strong style={{ color: '#0f172a' }}>{pathA.hoursPerWeek} jam/minggu</strong>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 28,
            border: '2.5px solid #10b981',
            padding: '26px 24px',
            boxShadow: '0 16px 36px rgba(16,185,129,0.14)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -14,
              right: 20,
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 800,
              padding: '4px 14px',
              borderRadius: 999,
              letterSpacing: 0.8
            }}
          >
            TERPILIH
          </div>

          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: '#059669',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 6
            }}
          >
            PILIHAN 2
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#064e3b',
              lineHeight: 1.3,
              marginBottom: 18
            }}
          >
            Remote Tech Startup
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              padding: '14px 20px',
              backgroundColor: '#ecfdf5',
              borderRadius: 20,
              marginBottom: 20
            }}
          >
            <span
              style={{
                fontSize: 46,
                fontWeight: 900,
                color: '#059669',
                fontFamily: 'var(--font-display)',
                lineHeight: 1
              }}
            >
              {scoreB.total}
            </span>
            <span style={{ fontSize: 16, color: '#059669', fontWeight: 700 }}>/100 Skor</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
              <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Wallet size={16} /> Pemasukan
              </span>
              <strong style={{ color: '#0f172a' }}>{formatRupiah(pathB.monthlyIncome)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
              <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Wallet size={16} /> Pengeluaran
              </span>
              <strong
                style={{
                  color: simulatedCostB > baseCostB ? '#b91c1c' : '#ef4444',
                  transition: 'color 0.2s'
                }}
              >
                {formatRupiah(pathB.monthlyCost)}
              </strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 16,
                paddingTop: 10,
                borderTop: '1px solid #f1f5f9'
              }}
            >
              <span style={{ color: '#065f46', fontWeight: 700 }}>Sisa Bersih</span>
              <strong style={{ color: '#065f46', fontWeight: 800 }}>
                {formatRupiah(scoreB.net)}/bulan
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
              <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={16} /> Waktu
              </span>
              <strong style={{ color: '#0f172a' }}>{pathB.hoursPerWeek} jam/minggu</strong>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: 28,
          border: '2px solid #e2e8f0',
          padding: '26px 30px',
          boxShadow: '0 16px 36px rgba(15,23,42,0.06)',
          transform: `translateY(${interpolate(sliderEntrance, [0, 1], [40, 0])}px)`,
          opacity: Math.max(0, sliderEntrance),
          marginBottom: 24
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
            Uji Asumsi: Kenaikan Biaya Hidup (What-If)
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#059669',
              backgroundColor: '#ecfdf5',
              padding: '4px 14px',
              borderRadius: 999
            }}
          >
            +{Math.round(sliderProgress * 100)}%
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 16,
            backgroundColor: '#e2e8f0',
            borderRadius: 8,
            marginBottom: 16
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${(sliderProgress / 0.5) * 100}%`,
              backgroundColor: '#10b981',
              borderRadius: 8
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${(sliderProgress / 0.5) * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '4px solid #10b981',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            fontSize: 15,
            color: '#475569',
            fontWeight: 600
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={18} color="#10b981" /> Rumus transparan
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={18} color="#10b981" /> Reaktif tanpa ubah data asli
          </span>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: 28,
          border: '2px solid #e2e8f0',
          padding: '24px 28px',
          boxShadow: '0 14px 30px rgba(15,23,42,0.05)',
          transform: `translateY(${interpolate(matrixEntrance, [0, 1], [30, 0])}px)`,
          opacity: Math.max(0, matrixEntrance)
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: '#059669',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginBottom: 14,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>KOMPARASI HEAD-TO-HEAD</span>
          <span style={{ color: '#64748b', fontSize: 13, fontWeight: 700 }}>2 Opsi Aktif</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              backgroundColor: '#f8fafc',
              borderRadius: 16,
              fontSize: 15
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, color: '#1e293b' }}>
              <span style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#e2e8f0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                A
              </span>
              MT BUMN
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#64748b' }}>45 jam/minggu</span>
              <span style={{ padding: '3px 10px', borderRadius: 6, backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={14} color="#64748b" /> Risiko Terendah
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              backgroundColor: '#ecfdf5',
              borderRadius: 16,
              fontSize: 15
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, color: '#064e3b' }}>
              <span style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#10b981', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                B
              </span>
              Remote Startup
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#059669', fontWeight: 700 }}>35 jam/minggu</span>
              <span style={{ padding: '3px 10px', borderRadius: 6, backgroundColor: '#10b981', color: '#ffffff', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Award size={14} color="#ffffff" /> Rekomendasi Tertinggi
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: cursorX,
          top: cursorY,
          opacity: cursorOpacity,
          transform: `scale(${cursorScale})`,
          pointerEvents: 'none',
          zIndex: 50,
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))'
        }}
      >
        <MousePointer2 size={46} color="#0f172a" fill="#ffffff" />
      </div>
    </div>
  );
};
