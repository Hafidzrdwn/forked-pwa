import type { Decision } from './types'

const MAX_BACKUP_BYTES = 10 * 1024 * 1024
const MAX_DECISIONS = 5000
const MAX_SCENARIOS_PER_DECISION = 50
const MAX_ASSUMPTIONS_PER_SCENARIO = 200
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const isText = (value: unknown, max = 20_000): value is string =>
  typeof value === 'string' && value.length <= max
const isFiniteInRange = (value: unknown, min: number, max: number): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max
const isDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function isValidDecision(value: unknown): value is Decision {
  if (!isRecord(value)) return false
  const d = value
  if (
    !isText(d.id, 200) || !d.id.trim() || !isText(d.title, 300) || !d.title.trim() ||
    !isText(d.context) || !isDate(d.createdAt) || !isDate(d.reviewDate) ||
    !['exploring', 'decided', 'reviewed'].includes(String(d.status)) ||
    !Array.isArray(d.scenarios) || d.scenarios.length < 2 || d.scenarios.length > MAX_SCENARIOS_PER_DECISION ||
    !(d.selectedScenarioId === null || isText(d.selectedScenarioId, 200)) || !isRecord(d.journal)
  ) return false

  const scenarioIds = new Set<string>()
  for (const item of d.scenarios) {
    if (!isRecord(item)) return false
    const s = item
    if (
      !isText(s.id, 200) || !s.id.trim() || scenarioIds.has(s.id) ||
      !isText(s.name, 300) || !s.name.trim() || !isText(s.description, 5000) ||
      !isFiniteInRange(s.monthlyIncome, 0, 1_000_000_000_000) ||
      !isFiniteInRange(s.monthlyCost, 0, 1_000_000_000_000) ||
      !isFiniteInRange(s.hoursPerWeek, 0, 168) || !isFiniteInRange(s.growth, 0, 100) ||
      !isFiniteInRange(s.risk, 0, 100) || !Array.isArray(s.assumptions) ||
      s.assumptions.length > MAX_ASSUMPTIONS_PER_SCENARIO
    ) return false
    scenarioIds.add(s.id)

    const assumptionIds = new Set<string>()
    for (const rawAssumption of s.assumptions) {
      if (!isRecord(rawAssumption)) return false
      const a = rawAssumption
      if (
        !isText(a.id, 200) || !a.id.trim() || assumptionIds.has(a.id) ||
        !isText(a.text, 5000) || !a.text.trim() || !isFiniteInRange(a.confidence, 0, 100) ||
        typeof a.checked !== 'boolean'
      ) return false
      assumptionIds.add(a.id)
    }
  }
  if (d.selectedScenarioId !== null && !scenarioIds.has(String(d.selectedScenarioId))) return false

  const journal = d.journal
  return ['reason', 'expectedOutcome', 'actualOutcome', 'reflection'].every(key => isText(journal[key], 20_000))
}

export function parseBackupText(text: string): Decision[] {
  if (new TextEncoder().encode(text).byteLength > MAX_BACKUP_BYTES) {
    throw new Error('Backup is larger than 10 MB.')
  }
  const parsed: unknown = JSON.parse(text)
  const rawDecisions = Array.isArray(parsed) ? parsed : isRecord(parsed) ? parsed.decisions : null
  if (!Array.isArray(rawDecisions) || rawDecisions.length > MAX_DECISIONS || !rawDecisions.every(isValidDecision)) {
    throw new Error('Backup structure is invalid.')
  }
  const ids = new Set<string>()
  for (const decision of rawDecisions) {
    if (ids.has(decision.id)) throw new Error('Backup contains duplicate decision IDs.')
    ids.add(decision.id)
  }
  return rawDecisions
}
