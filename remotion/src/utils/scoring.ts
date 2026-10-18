export interface ScenarioData {
  id: string;
  name: string;
  monthlyIncome: number;
  monthlyCost: number;
  hoursPerWeek: number;
  growth: number;
  risk: number;
}

export interface ScoreResult {
  total: number;
  money: number;
  time: number;
  growth: number;
  risk: number;
  net: number;
}

const clamp = (val: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, val));

export function scoreScenario(
  scenario: ScenarioData,
  weights = { money: 0.35, time: 0.2, growth: 0.3, risk: 0.15 }
): ScoreResult {
  const net = scenario.monthlyIncome - scenario.monthlyCost;
  const money = clamp(((net + 2000000) / 7000000) * 100, 0, 100);
  const time = clamp(((60 - scenario.hoursPerWeek) / 60) * 100, 0, 100);
  const growth = clamp(scenario.growth, 0, 100);
  const risk = 100 - clamp(scenario.risk, 0, 100);

  const total = Math.round(
    money * weights.money +
      time * weights.time +
      growth * weights.growth +
      risk * weights.risk
  );

  return {
    total,
    money: Math.round(money),
    time: Math.round(time),
    growth: Math.round(growth),
    risk: Math.round(risk),
    net
  };
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
}
