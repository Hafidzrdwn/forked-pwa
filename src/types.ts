export type AssumptionKind = 'assumption' | 'fact' | 'estimate'
export type AssumptionStatus = 'untested' | 'confirmed' | 'falsified'

export interface Assumption {
  id: string
  text: string
  confidence: number
  checked: boolean
  kind?: AssumptionKind
  status?: AssumptionStatus
  notes?: string
}

export interface Scenario {
  id: string
  name: string
  description: string
  monthlyIncome: number
  monthlyCost: number
  hoursPerWeek: number
  growth: number
  risk: number
  assumptions: Assumption[]
}

export interface ScoringWeights {
  money: number
  time: number
  growth: number
  risk: number
}

export interface DecisionJournal {
  reason: string
  expectedOutcome: string
  actualOutcome: string
  reflection: string
  lastReviewedAt?: string
}

export type DecisionStatus = 'exploring' | 'decided' | 'reviewed'

export interface Decision {
  id: string
  title: string
  context: string
  createdAt: string
  reviewDate: string
  status: DecisionStatus
  selectedScenarioId: string | null
  weights?: ScoringWeights
  scenarios: Scenario[]
  journal: DecisionJournal
}
