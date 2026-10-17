import type { Scenario, ScoringWeights } from './types'
import { clamp, scoreScenario, type ScoreBreakdown } from './scoring'

export interface WhatIfParams {
  incomePercent: number
  costPercent: number
  hoursDelta: number
  growthDelta: number
  riskDelta: number
}

export const DEFAULT_WHAT_IF_PARAMS: WhatIfParams = {
  incomePercent: 100,
  costPercent: 100,
  hoursDelta: 0,
  growthDelta: 0,
  riskDelta: 0
}

export interface SimulatedScenarioResult {
  scenarioId: string
  scenarioName: string
  originalNet: number
  simulatedNet: number
  netDelta: number
  simulatedIncome: number
  simulatedCost: number
  simulatedHours: number
  simulatedGrowth: number
  simulatedRisk: number
  originalScore: number
  simulatedScore: number
  scoreDelta: number
  simulatedBreakdown: ScoreBreakdown
}

/**
 * Pure simulation function. Does not mutate the original scenario object.
 */
export function simulateScenario(
  scenario: Scenario,
  params: Partial<WhatIfParams> = {},
  weights?: Partial<ScoringWeights> | null
): SimulatedScenarioResult {
  const p: WhatIfParams = { ...DEFAULT_WHAT_IF_PARAMS, ...params }

  const originalScore = scoreScenario(scenario, weights).total
  const originalNet = scenario.monthlyIncome - scenario.monthlyCost

  const simulatedIncome = Math.max(0, Math.round(scenario.monthlyIncome * (p.incomePercent / 100)))
  const simulatedCost = Math.max(0, Math.round(scenario.monthlyCost * (p.costPercent / 100)))
  const simulatedHours = clamp(scenario.hoursPerWeek + p.hoursDelta, 0, 168)
  const simulatedGrowth = clamp(scenario.growth + p.growthDelta, 0, 100)
  const simulatedRisk = clamp(scenario.risk + p.riskDelta, 0, 100)
  const simulatedNet = simulatedIncome - simulatedCost

  const simulatedScenario: Scenario = {
    ...scenario,
    monthlyIncome: simulatedIncome,
    monthlyCost: simulatedCost,
    hoursPerWeek: simulatedHours,
    growth: simulatedGrowth,
    risk: simulatedRisk
  }

  const simulatedBreakdown = scoreScenario(simulatedScenario, weights)
  const simulatedScore = simulatedBreakdown.total

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    originalNet,
    simulatedNet,
    netDelta: simulatedNet - originalNet,
    simulatedIncome,
    simulatedCost,
    simulatedHours,
    simulatedGrowth,
    simulatedRisk,
    originalScore,
    simulatedScore,
    scoreDelta: simulatedScore - originalScore,
    simulatedBreakdown
  }
}

/**
 * Simulates all scenarios for a decision reactively under the stress test parameters.
 */
export function simulateAllScenarios(
  scenarios: Scenario[],
  params: Partial<WhatIfParams> = {},
  weights?: Partial<ScoringWeights> | null
): SimulatedScenarioResult[] {
  return scenarios.map(s => simulateScenario(s, params, weights))
}
