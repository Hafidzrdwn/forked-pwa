<script setup lang="ts">
import { computed } from 'vue'
import { Check, Target, Wallet, Clock3, TrendingUp, ShieldAlert, X } from 'lucide-vue-next'
import type { Scenario, ScoringWeights } from '../../types'
import { scoreScenario, formatRupiah } from '../../scoring'
import { useI18n } from '../../i18n'

const props = defineProps<{
  scenario: Scenario
  index: number
  isSelected: boolean
  weights?: ScoringWeights
}>()

const emit = defineEmits<{
  (e: 'update', scenario: Scenario): void
  (e: 'choose', id: string): void
  (e: 'remove', id: string): void
}>()

const { t } = useI18n()

const breakdown = computed(() => scoreScenario(props.scenario, props.weights))
const net = computed(() => props.scenario.monthlyIncome - props.scenario.monthlyCost)

function onFieldChange() {
  emit('update', props.scenario)
}
</script>

<template>
  <article :class="['scenario-card', { 'scenario-selected': isSelected }]">
    <div class="scenario-top">
      <span class="path-label">
        <span class="path-dot" :class="'path-' + (index % 4)" />
        {{ t.scenario.pathLabel }} {{ String.fromCharCode(65 + index) }}
      </span>
      <button
        type="button"
        class="icon-button tiny danger-hover"
        :aria-label="t.scenario.removePathAria + ' ' + scenario.name"
        @click="emit('remove', scenario.id)"
      >
        <X :size="15" />
      </button>
    </div>

    <input
      v-model="scenario.name"
      class="scenario-title-input"
      :aria-label="t.scenario.pathLabel + ' ' + String.fromCharCode(65 + index)"
      @change="onFieldChange"
    />

    <div class="score-line">
      <span class="score-number">{{ breakdown.total }}</span>
      <span class="score-denom">/100</span>
      <span class="score-label">{{ t.scenario.fitScore }}</span>
    </div>

    <div class="score-track" role="progressbar" :aria-valuenow="breakdown.total" aria-valuemin="0" aria-valuemax="100">
      <span :style="{ width: breakdown.total + '%' }" />
    </div>

    <div class="metric-list">
      <div class="metric-row">
        <span><Wallet :size="14" /> {{ t.scenario.netPerMonth }}</span>
        <strong :class="{ negative: net < 0 }">{{ formatRupiah(net) }}</strong>
      </div>
      <div class="metric-row">
        <span><Clock3 :size="14" /> {{ t.scenario.timePerWeek }}</span>
        <strong>{{ scenario.hoursPerWeek }} {{ t.common.hrs }}</strong>
      </div>
      <div class="metric-row">
        <span><TrendingUp :size="14" /> {{ t.scenario.growth }}</span>
        <strong>{{ scenario.growth }}<small>/100</small></strong>
      </div>
      <div class="metric-row">
        <span><ShieldAlert :size="14" /> {{ t.scenario.risk }}</span>
        <strong>{{ scenario.risk }}<small>/100</small></strong>
      </div>
    </div>

    <div class="scenario-inputs">
      <label>
        {{ t.scenario.monthlyIncome }}
        <span>{{ formatRupiah(scenario.monthlyIncome) }}</span>
        <input
          v-model.number="scenario.monthlyIncome"
          type="range"
          min="0"
          max="20000000"
          step="100000"
          @change="onFieldChange"
        />
      </label>

      <label>
        {{ t.scenario.monthlyCost }}
        <span>{{ formatRupiah(scenario.monthlyCost) }}</span>
        <input
          v-model.number="scenario.monthlyCost"
          type="range"
          min="0"
          max="10000000"
          step="100000"
          @change="onFieldChange"
        />
      </label>

      <label>
        {{ t.scenario.hoursPerWeek }}
        <span>{{ scenario.hoursPerWeek }} {{ t.common.hrs }}</span>
        <input
          v-model.number="scenario.hoursPerWeek"
          type="range"
          min="0"
          max="70"
          step="1"
          @change="onFieldChange"
        />
      </label>

      <label>
        {{ t.scenario.growthPotential }}
        <span>{{ scenario.growth }}/100</span>
        <input
          v-model.number="scenario.growth"
          type="range"
          min="0"
          max="100"
          step="5"
          @change="onFieldChange"
        />
      </label>

      <label>
        {{ t.scenario.riskLevel }}
        <span>{{ scenario.risk }}/100</span>
        <input
          v-model.number="scenario.risk"
          type="range"
          min="0"
          max="100"
          step="5"
          @change="onFieldChange"
        />
      </label>
    </div>

    <button
      type="button"
      :class="['button', 'choose-button', isSelected ? 'button-chosen' : 'button-secondary']"
      @click="emit('choose', scenario.id)"
    >
      <Check v-if="isSelected" :size="16" />
      <Target v-else :size="16" />
      {{ isSelected ? t.scenario.chosenPath : t.scenario.chooseThisPath }}
    </button>
  </article>
</template>
