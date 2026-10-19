export interface ScenarioAssumption {
  id: string;
  label: string;
  valueText: string;
  metricValue: number;
  unit: string;
}

export interface DecisionScenario {
  id: string;
  name: string;
  tagline: string;
  probability: number;
  runwayMonths: number;
  riskLevel: 'Tinggi' | 'Sedang' | 'Rendah' | 'Optimal';
  colorBadge: string;
  badgeBg: string;
}

export const FORKED_DEMO_DATA = {
  hero: {
    hookLine1: 'Terlalu Banyak Opsi.',
    hookLine2: 'Minim Kepastian.',
    subtext: 'Bukan Spekulasi.',
    productCategory: 'ENGINE SIMULASI KEPUTUSAN'
  },
  reveal: {
    engineTitle: 'Simulasi Sebelum Eksekusi.',
    projectTitle: 'Strategi Ekspansi Q4',
    statusBadge: 'Cabang Aktif',
    initialProbability: 34
  },
  simulation: {
    assumptionSliderLabel: 'Alokasi Modal & Runway',
    initialValue: 34,
    targetValue: 89,
    initialLabel: 'Tinggi Risiko',
    targetLabel: 'Optimal',
    scenarios: {
      statusQuo: {
        id: 'scenario-a',
        name: 'Jalur A: Status Quo',
        tagline: 'Tanpa simulasi adaptif',
        probability: 34,
        runwayMonths: 4,
        riskLevel: 'Tinggi',
        colorBadge: '#b54739',
        badgeBg: 'rgba(181, 71, 57, 0.12)'
      } as DecisionScenario,
      forkedOptimized: {
        id: 'scenario-b',
        name: 'Jalur B: Simulasi Forked',
        tagline: 'Alokasi terarah dan runway terukur',
        probability: 89,
        runwayMonths: 14,
        riskLevel: 'Optimal',
        colorBadge: '#245d3e',
        badgeBg: 'rgba(36, 93, 62, 0.14)'
      } as DecisionScenario
    },
    punchline: 'Keputusan Jelas. Risiko Terukur.'
  },
  closing: {
    primaryTagline: 'Explore your options.',
    subtitle: 'Simulasi keputusan nyata sebelum melangkah.',
    actionUrl: 'forked.id',
    actionCta: 'Mulai Simulasi'
  }
} as const;
