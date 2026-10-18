import test from 'node:test'
import assert from 'node:assert/strict'
import { scoreScenario, formatRupiah } from '../src/services/scoring.ts'

const scenario = {
  id: 's1', name: 'Path A', description: '', monthlyIncome: 5_000_000, monthlyCost: 1_000_000,
  hoursPerWeek: 20, growth: 70, risk: 30, assumptions: []
}

test('scores stay within the documented 0–100 range', () => {
  const score = scoreScenario(scenario)
  assert.ok(score.total >= 0 && score.total <= 100)
  for (const key of ['money', 'time', 'growth', 'risk']) assert.ok(score[key] >= 0 && score[key] <= 100)
})

test('custom weights are applied proportionally', () => {
  const allGrowth = scoreScenario(scenario, { money: 0, time: 0, growth: 1, risk: 0 })
  assert.equal(allGrowth.total, 70)
})

test('formats currency using Indonesian rupiah locale', () => {
  assert.match(formatRupiah(1000), /1\.000/)
})
