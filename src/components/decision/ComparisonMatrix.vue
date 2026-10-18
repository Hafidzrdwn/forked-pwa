<script setup lang="ts">
import { computed } from 'vue'
import { Scale, Check, Award, ArrowRight, ShieldCheck, Zap, Clock, Coins } from 'lucide-vue-next'
import type { Scenario, ScoringWeights } from '../../types'
import { scoreScenario, formatRupiah } from '../../services/scoring'
import { useI18n } from '../../i18n'

const props = defineProps<{
  scenarios: Scenario[]
  weights?: ScoringWeights
  selectedScenarioId: string | null
}>()

const emit = defineEmits<{
  (e: 'choose-scenario', id: string): void
}>()

const { t } = useI18n()

interface MatrixRow {
  scenario: Scenario
  totalScore: number
  netIncome: number
  hours: number
  growth: number
  risk: number
  isTopNet: boolean
  isTopTime: boolean
  isTopGrowth: boolean
  isLowestRisk: boolean
  isTopOverall: boolean
}

const matrixRows = computed<MatrixRow[]>(() => {
  if (!props.scenarios.length) return []

  const scoredList = props.scenarios.map(s => {
    const breakdown = scoreScenario(s, props.weights)
    const net = s.monthlyIncome - s.monthlyCost
    return {
      scenario: s,
      totalScore: breakdown.total,
      netIncome: net,
      hours: s.hoursPerWeek,
      growth: s.growth,
      risk: s.risk
    }
  })

  const maxScore = Math.max(...scoredList.map(item => item.totalScore))
  const maxNet = Math.max(...scoredList.map(item => item.netIncome))
  const minHours = Math.min(...scoredList.map(item => item.hours))
  const maxGrowth = Math.max(...scoredList.map(item => item.growth))
  const minRisk = Math.min(...scoredList.map(item => item.risk))

  return scoredList.map(item => {
    return {
      ...item,
      isTopOverall: item.totalScore === maxScore && scoredList.length > 1,
      isTopNet: item.netIncome === maxNet && item.netIncome > 0,
      isTopTime: item.hours === minHours,
      isTopGrowth: item.growth === maxGrowth,
      isLowestRisk: item.risk === minRisk
    }
  })
})
</script>

<template>
  <section v-if="matrixRows.length >= 2" class="bg-surface border border-border rounded-2xl p-5 md:p-6 shadow-xs" aria-labelledby="matrix-heading">
    <div class="flex items-start justify-between gap-4 mb-4">
      <div>
        <div class="text-[11px] font-bold tracking-wider uppercase text-primary mb-1.5">{{ t.matrix.eyebrow }}</div>
        <h3 id="matrix-heading" class="font-display font-bold text-lg text-fg m-0">{{ t.matrix.title }}</h3>
        <p class="text-xs text-fg-muted mt-1 max-w-lg leading-relaxed">{{ t.matrix.desc }}</p>
      </div>
      <span class="w-9 h-9 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0">
        <Scale :size="19" />
      </span>
    </div>

    <div class="overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0">
      <table class="w-full text-left text-xs border-collapse min-w-[620px]">
        <thead>
          <tr class="border-b border-border text-[11px] font-bold uppercase tracking-wider text-fg-subtle">
            <th class="py-3 px-3">{{ t.matrix.colPath }}</th>
            <th class="py-3 px-3 text-center">{{ t.matrix.colFit }}</th>
            <th class="py-3 px-3 text-right">{{ t.matrix.colNet }}</th>
            <th class="py-3 px-3 text-center">{{ t.matrix.colTime }}</th>
            <th class="py-3 px-3 text-center">{{ t.matrix.colGrowth }}</th>
            <th class="py-3 px-3 text-center">{{ t.matrix.colRisk }}</th>
            <th class="py-3 px-3">{{ t.matrix.colHighlight }}</th>
            <th class="py-3 px-3 text-right">{{ t.matrix.colAction }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr
            v-for="(row, idx) in matrixRows"
            :key="row.scenario.id"
            :class="[
              'transition-colors',
              selectedScenarioId === row.scenario.id ? 'bg-primary-soft/30 font-medium' : 'hover:bg-canvas-subtle'
            ]"
          >
            <td class="py-3.5 px-3">
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'w-5 h-5 rounded-md grid place-items-center text-[10px] font-bold shrink-0',
                    selectedScenarioId === row.scenario.id ? 'bg-primary text-white' : 'bg-canvas-subtle text-fg-muted border border-border'
                  ]"
                >
                  {{ String.fromCharCode(65 + idx) }}
                </span>
                <span class="font-bold text-fg text-xs leading-snug break-words min-w-[140px] max-w-[240px]">{{ row.scenario.name }}</span>
              </div>
            </td>

            <td class="py-3.5 px-3 text-center">
              <span
                :class="[
                  'inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-black tracking-tight',
                  row.totalScore >= 75 ? 'bg-primary-soft text-primary' : row.totalScore >= 50 ? 'bg-amber-soft text-amber' : 'bg-canvas-subtle text-fg-muted'
                ]"
              >
                {{ row.totalScore }}
              </span>
            </td>

            <td class="py-3.5 px-3 text-right font-bold" :class="row.netIncome < 0 ? 'text-danger' : 'text-fg'">
              {{ formatRupiah(row.netIncome) }}
            </td>

            <td class="py-3.5 px-3 text-center text-fg">
              {{ row.hours }} {{ t.common.hrs }}
            </td>

            <td class="py-3.5 px-3 text-center">
              <span class="font-bold text-fg">{{ row.growth }}</span>
              <span class="text-[10px] text-fg-subtle">/100</span>
            </td>

            <td class="py-3.5 px-3 text-center">
              <span class="font-bold" :class="row.risk > 60 ? 'text-danger' : 'text-fg'">{{ row.risk }}</span>
              <span class="text-[10px] text-fg-subtle">/100</span>
            </td>

            <td class="py-3.5 px-3">
              <div class="flex flex-wrap gap-1">
                <span
                  v-if="row.isTopOverall"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-primary-soft text-primary"
                >
                  <Award :size="11" /> {{ t.matrix.badgeTopOverall }}
                </span>
                <span
                  v-else-if="row.isTopNet"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-500/10 text-emerald-500"
                >
                  <Coins :size="11" /> {{ t.matrix.badgeTopNet }}
                </span>
                <span
                  v-else-if="row.isTopGrowth"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-blue-500/10 text-blue-500"
                >
                  <Zap :size="11" /> {{ t.matrix.badgeTopGrowth }}
                </span>
                <span
                  v-else-if="row.isLowestRisk"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-purple-500/10 text-purple-500"
                >
                  <ShieldCheck :size="11" /> {{ t.matrix.badgeLowestRisk }}
                </span>
                <span
                  v-else-if="row.isTopTime"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-amber-500/10 text-amber-500"
                >
                  <Clock :size="11" /> {{ t.matrix.badgeTopTime }}
                </span>
              </div>
            </td>

            <td class="py-3.5 px-3 text-right">
              <span
                v-if="selectedScenarioId === row.scenario.id"
                class="inline-flex items-center gap-1 text-[11px] font-bold text-primary px-2.5 py-1 rounded-lg bg-primary-soft"
              >
                <Check :size="13" /> {{ t.matrix.selectedBadge }}
              </span>
              <button
                v-else
                type="button"
                class="inline-flex items-center gap-1 text-[11px] font-bold text-fg-muted hover:text-fg hover:bg-canvas-subtle border border-border px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                @click="emit('choose-scenario', row.scenario.id)"
              >
                {{ t.matrix.selectAction }} <ArrowRight :size="11" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
