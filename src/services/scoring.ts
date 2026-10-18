import type { Scenario, ScoringWeights } from '../types'

export const DEFAULT_WEIGHTS: ScoringWeights = {
  money: 0.35,
  time: 0.20,
  growth: 0.30,
  risk: 0.15
}

export interface ScoreBreakdown {
  total: number
  money: number
  time: number
  growth: number
  risk: number
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

export function normalizeWeights(weights?: Partial<ScoringWeights> | null): ScoringWeights {
  const w = {
    money: Math.max(0, Number(weights?.money ?? DEFAULT_WEIGHTS.money)),
    time: Math.max(0, Number(weights?.time ?? DEFAULT_WEIGHTS.time)),
    growth: Math.max(0, Number(weights?.growth ?? DEFAULT_WEIGHTS.growth)),
    risk: Math.max(0, Number(weights?.risk ?? DEFAULT_WEIGHTS.risk))
  }
  const sum = w.money + w.time + w.growth + w.risk
  if (sum <= 0) return { ...DEFAULT_WEIGHTS }
  return {
    money: w.money / sum,
    time: w.time / sum,
    growth: w.growth / sum,
    risk: w.risk / sum
  }
}

export function scoreScenario(
  scenario: Scenario,
  rawWeights?: Partial<ScoringWeights> | null
): ScoreBreakdown {
  const weights = rawWeights ? normalizeWeights(rawWeights) : DEFAULT_WEIGHTS
  const net = scenario.monthlyIncome - scenario.monthlyCost
  const money = clamp(((net + 2_000_000) / 7_000_000) * 100, 0, 100)
  const time = clamp(((60 - scenario.hoursPerWeek) / 60) * 100, 0, 100)
  const growth = clamp(scenario.growth, 0, 100)
  const risk = 100 - clamp(scenario.risk, 0, 100)

  return {
    total: Math.round(
      money * weights.money +
      time * weights.time +
      growth * weights.growth +
      risk * weights.risk
    ),
    money: Math.round(money),
    time: Math.round(time),
    growth: Math.round(growth),
    risk: Math.round(risk)
  }
}

export function formatRupiah(value: number): string {
  if (Number.isNaN(value)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function formatRupiahInput(value: number | string): string {
  if (value === '' || value === null || value === undefined) return ''
  const num = typeof value === 'string' ? parseInt(value.replace(/\D/g, ''), 10) : value
  if (Number.isNaN(num) || num === 0) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

export function parseRupiahInput(str: string): number {
  if (!str) return 0
  const cleaned = str.replace(/\D/g, '')
  if (!cleaned) return 0
  const parsed = parseInt(cleaned, 10)
  return Number.isNaN(parsed) ? 0 : parsed
}
