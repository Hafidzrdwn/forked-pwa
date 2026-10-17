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
  <article :class="['bg-surface border rounded-2xl p-5 relative transition-all duration-200 flex flex-col shadow-xs', isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-border-hover']">
    <div class="flex items-center justify-between mb-3">
      <span class="inline-flex items-center gap-1.5 text-xs font-bold text-fg-muted">
        <span :class="['w-2.5 h-2.5 rounded-full', ['bg-emerald-600', 'bg-amber-600', 'bg-sky-600', 'bg-purple-600'][index % 4]]" />
        {{ t.scenario.pathLabel }} {{ String.fromCharCode(65 + index) }}
      </span>
      <button
        type="button"
        class="w-7 h-7 rounded-lg border border-border bg-surface text-fg-muted hover:text-danger hover:bg-danger-soft grid place-items-center transition-colors cursor-pointer"
        :aria-label="t.scenario.removePathAria + ' ' + scenario.name"
        @click="emit('remove', scenario.id)"
      >
        <X :size="15" />
      </button>
    </div>

    <input
      v-model="scenario.name"
      class="w-full border-0 bg-transparent outline-none pb-1 font-display font-bold text-base text-fg border-b border-transparent focus:border-primary transition-colors"
      :aria-label="t.scenario.pathLabel + ' ' + String.fromCharCode(65 + index)"
      @change="onFieldChange"
    />

    <div class="flex items-baseline gap-1 mt-2.5">
      <span class="font-display font-extrabold text-3xl tracking-tight text-fg tabular-nums">{{ breakdown.total }}</span>
      <span class="text-xs text-fg-muted">/100</span>
      <span class="ml-auto text-[11px] font-bold tracking-wider uppercase text-fg-subtle">{{ t.scenario.fitScore }}</span>
    </div>

    <div class="h-1.5 rounded-full bg-border my-2.5 overflow-hidden" role="progressbar" :aria-valuenow="breakdown.total" aria-valuemin="0" aria-valuemax="100">
      <span class="block h-full rounded-full bg-primary transition-all duration-200" :style="{ width: breakdown.total + '%' }" />
    </div>

    <div class="grid gap-2.5 border-b border-border pb-4">
      <div class="flex items-center justify-between gap-2 text-xs">
        <span class="flex items-center gap-1.5 text-fg-muted"><Wallet :size="14" /> {{ t.scenario.netPerMonth }}</span>
        <strong :class="['font-bold text-sm', net < 0 ? 'text-danger' : 'text-fg']">{{ formatRupiah(net) }}</strong>
      </div>
      <div class="flex items-center justify-between gap-2 text-xs">
        <span class="flex items-center gap-1.5 text-fg-muted"><Clock3 :size="14" /> {{ t.scenario.timePerWeek }}</span>
        <strong class="font-bold text-sm text-fg">{{ scenario.hoursPerWeek }} {{ t.common.hrs }}</strong>
      </div>
      <div class="flex items-center justify-between gap-2 text-xs">
        <span class="flex items-center gap-1.5 text-fg-muted"><TrendingUp :size="14" /> {{ t.scenario.growth }}</span>
        <strong class="font-bold text-sm text-fg">{{ scenario.growth }}<small class="text-fg-subtle font-normal">/100</small></strong>
      </div>
      <div class="flex items-center justify-between gap-2 text-xs">
        <span class="flex items-center gap-1.5 text-fg-muted"><ShieldAlert :size="14" /> {{ t.scenario.risk }}</span>
        <strong class="font-bold text-sm text-fg">{{ scenario.risk }}<small class="text-fg-subtle font-normal">/100</small></strong>
      </div>
    </div>

    <div class="grid gap-3 py-4">
      <label class="grid grid-cols-[1fr_auto] gap-x-2 gap-y-1 text-xs text-fg-muted font-medium">
        {{ t.scenario.monthlyIncome }}
        <span class="font-bold text-fg text-right">{{ formatRupiah(scenario.monthlyIncome) }}</span>
        <input
          v-model.number="scenario.monthlyIncome"
          class="col-span-2"
          type="range"
          min="0"
          max="20000000"
          step="100000"
          @change="onFieldChange"
        />
      </label>

      <label class="grid grid-cols-[1fr_auto] gap-x-2 gap-y-1 text-xs text-fg-muted font-medium">
        {{ t.scenario.monthlyCost }}
        <span class="font-bold text-fg text-right">{{ formatRupiah(scenario.monthlyCost) }}</span>
        <input
          v-model.number="scenario.monthlyCost"
          class="col-span-2"
          type="range"
          min="0"
          max="10000000"
          step="100000"
          @change="onFieldChange"
        />
      </label>

      <label class="grid grid-cols-[1fr_auto] gap-x-2 gap-y-1 text-xs text-fg-muted font-medium">
        {{ t.scenario.hoursPerWeek }}
        <span class="font-bold text-fg text-right">{{ scenario.hoursPerWeek }} {{ t.common.hrs }}</span>
        <input
          v-model.number="scenario.hoursPerWeek"
          class="col-span-2"
          type="range"
          min="0"
          max="70"
          step="1"
          @change="onFieldChange"
        />
      </label>

      <label class="grid grid-cols-[1fr_auto] gap-x-2 gap-y-1 text-xs text-fg-muted font-medium">
        {{ t.scenario.growthPotential }}
        <span class="font-bold text-fg text-right">{{ scenario.growth }}/100</span>
        <input
          v-model.number="scenario.growth"
          class="col-span-2"
          type="range"
          min="0"
          max="100"
          step="5"
          @change="onFieldChange"
        />
      </label>

      <label class="grid grid-cols-[1fr_auto] gap-x-2 gap-y-1 text-xs text-fg-muted font-medium">
        {{ t.scenario.riskLevel }}
        <span class="font-bold text-fg text-right">{{ scenario.risk }}/100</span>
        <input
          v-model.number="scenario.risk"
          class="col-span-2"
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
      :class="[
        'w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all mt-auto flex items-center justify-center gap-2 cursor-pointer shadow-xs',
        isSelected ? 'bg-primary-soft text-primary border border-primary' : 'bg-surface border border-border text-fg hover:bg-canvas-subtle hover:border-border-hover'
      ]"
      @click="emit('choose', scenario.id)"
    >
      <Check v-if="isSelected" :size="16" />
      <Target v-else :size="16" />
      {{ isSelected ? t.scenario.chosenPath : t.scenario.chooseThisPath }}
    </button>
  </article>
</template>
