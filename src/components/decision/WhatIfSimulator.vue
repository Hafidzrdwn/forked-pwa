<script setup lang="ts">
import { computed, ref } from 'vue'
import { SlidersHorizontal, RotateCcw, Info, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-vue-next'
import type { Scenario, ScoringWeights } from '../../types'
import { simulateAllScenarios } from '../../simulation'
import { formatRupiah } from '../../scoring'
import { useI18n } from '../../i18n'

const props = defineProps<{
  scenarios: Scenario[]
  weights?: ScoringWeights
}>()

const { t, interpolate } = useI18n()

const incomePercent = ref(100)
const costPercent = ref(100)
const hoursDelta = ref(0)
const riskDelta = ref(0)

const isDirty = computed(() => {
  return incomePercent.value !== 100 ||
    costPercent.value !== 100 ||
    hoursDelta.value !== 0 ||
    riskDelta.value !== 0
})

function resetSimulation() {
  incomePercent.value = 100
  costPercent.value = 100
  hoursDelta.value = 0
  riskDelta.value = 0
}

const simulatedList = computed(() => {
  return simulateAllScenarios(
    props.scenarios,
    {
      incomePercent: incomePercent.value,
      costPercent: costPercent.value,
      hoursDelta: hoursDelta.value,
      riskDelta: riskDelta.value
    },
    props.weights
  )
})
</script>

<template>
  <section class="analysis-card" aria-labelledby="stress-test-heading">
    <div class="analysis-heading">
      <div>
        <div class="eyebrow">{{ t.whatIf.eyebrow }}</div>
        <h3 id="stress-test-heading">{{ t.whatIf.title }}</h3>
        <p>{{ t.whatIf.desc }}</p>
      </div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <button
          v-if="isDirty"
          type="button"
          class="button button-ghost button-small"
          aria-label="Reset simulation"
          @click="resetSimulation"
        >
          <RotateCcw :size="13" /> {{ t.whatIf.reset }}
        </button>
        <span class="analysis-icon"><SlidersHorizontal :size="19" /></span>
      </div>
    </div>

    <!-- Sliders Grid -->
    <div class="sim-controls-grid">
      <div class="sim-control-item">
        <div class="sim-control-header">
          <label for="sim-income">{{ t.whatIf.incomeLabel }}</label>
          <strong style="color: var(--green);">{{ incomePercent }}%</strong>
        </div>
        <input
          id="sim-income"
          v-model.number="incomePercent"
          class="full-range"
          type="range"
          min="0"
          max="150"
          step="5"
        />
      </div>

      <div class="sim-control-item">
        <div class="sim-control-header">
          <label for="sim-cost">{{ t.whatIf.costLabel }}</label>
          <strong :style="{ color: costPercent > 100 ? '#b14c3f' : 'var(--ink)' }">
            {{ costPercent }}%
          </strong>
        </div>
        <input
          id="sim-cost"
          v-model.number="costPercent"
          class="full-range"
          type="range"
          min="60"
          max="180"
          step="5"
        />
      </div>

      <div class="sim-control-item">
        <div class="sim-control-header">
          <label for="sim-hours">{{ t.whatIf.hoursLabel }}</label>
          <strong>{{ hoursDelta > 0 ? '+' + hoursDelta : hoursDelta }} {{ t.common.hrs }}</strong>
        </div>
        <input
          id="sim-hours"
          v-model.number="hoursDelta"
          class="full-range"
          type="range"
          min="-15"
          max="25"
          step="1"
        />
      </div>

      <div class="sim-control-item">
        <div class="sim-control-header">
          <label for="sim-risk">{{ t.whatIf.riskLabel }}</label>
          <strong :style="{ color: riskDelta > 0 ? '#b14c3f' : 'var(--green)' }">
            {{ riskDelta > 0 ? '+' + riskDelta : riskDelta }} {{ t.common.pts }}
          </strong>
        </div>
        <input
          id="sim-risk"
          v-model.number="riskDelta"
          class="full-range"
          type="range"
          min="-30"
          max="30"
          step="5"
        />
      </div>
    </div>

    <!-- Simulated Results List -->
    <div class="whatif-results" style="margin-top: 18px;">
      <div
        v-for="item in simulatedList"
        :key="item.scenarioId"
        class="whatif-row"
        style="grid-template-columns: minmax(100px, 1.2fr) minmax(80px, 1fr) auto auto;"
      >
        <span>
          <strong>{{ item.scenarioName }}</strong>
          <small style="display: block; font-size: 9px; color: #8e958a;">
            {{ interpolate(t.whatIf.baseNet, { amount: formatRupiah(item.originalNet) }) }}
          </small>
        </span>

        <div class="whatif-bar">
          <i :style="{ width: Math.min(100, Math.max(0, (item.simulatedNet + 2000000) / 10000000 * 100)) + '%' }" />
        </div>

        <strong :class="{ negative: item.simulatedNet < 0 }" style="min-width: 90px;">
          {{ formatRupiah(item.simulatedNet) }}
        </strong>

        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 11px; font-weight: 700;">{{ item.simulatedScore }}</span>
          <span
            :class="['delta-badge', item.scoreDelta > 0 ? 'positive' : item.scoreDelta < 0 ? 'negative' : 'neutral']"
          >
            <ArrowUpRight v-if="item.scoreDelta > 0" :size="11" />
            <ArrowDownRight v-else-if="item.scoreDelta < 0" :size="11" />
            <Minus v-else :size="11" />
            {{ item.scoreDelta > 0 ? '+' + item.scoreDelta : item.scoreDelta }}
          </span>
        </div>
      </div>
    </div>

    <p class="micro-note">
      <Info :size="13" />
      {{ t.whatIf.microNote }}
    </p>
  </section>
</template>
