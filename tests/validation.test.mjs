import test from 'node:test'
import assert from 'node:assert/strict'
import { parseBackupText } from '../src/validation.ts'

const validDecision = () => ({
  id: 'd1', title: 'Choose a path', context: '', createdAt: '2026-10-17', reviewDate: '2026-11-16',
  status: 'exploring', selectedScenarioId: null,
  scenarios: [
    { id: 's1', name: 'A', description: '', monthlyIncome: 100, monthlyCost: 20, hoursPerWeek: 20, growth: 70, risk: 30, assumptions: [] },
    { id: 's2', name: 'B', description: '', monthlyIncome: 200, monthlyCost: 50, hoursPerWeek: 30, growth: 80, risk: 40, assumptions: [] }
  ],
  journal: { reason: '', expectedOutcome: '', actualOutcome: '', reflection: '' }
})

test('accepts a valid versioned-style backup envelope', () => {
  const result = parseBackupText(JSON.stringify({ app: 'Forked', version: 1, decisions: [validDecision()] }))
  assert.equal(result.length, 1)
  assert.equal(result[0].title, 'Choose a path')
})

test('accepts a legacy array backup', () => {
  assert.equal(parseBackupText(JSON.stringify([validDecision()])).length, 1)
})

test('rejects a decision with fewer than two scenarios', () => {
  const decision = validDecision()
  decision.scenarios.pop()
  assert.throws(() => parseBackupText(JSON.stringify([decision])))
})

test('rejects a selected scenario ID that does not exist', () => {
  const decision = validDecision()
  decision.selectedScenarioId = 'missing'
  assert.throws(() => parseBackupText(JSON.stringify([decision])))
})

test('rejects duplicate decision IDs', () => {
  const decision = validDecision()
  assert.throws(() => parseBackupText(JSON.stringify([decision, { ...decision }])))
})

test('rejects malformed JSON', () => {
  assert.throws(() => parseBackupText('{broken json'))
})

test('rejects impossible calendar dates', () => {
  const decision = validDecision()
  decision.reviewDate = '2026-02-31'
  assert.throws(() => parseBackupText(JSON.stringify([decision])))
})

test('rejects an oversized backup before parsing', () => {
  assert.throws(() => parseBackupText(' '.repeat(10 * 1024 * 1024 + 1)))
})
