<script setup lang="ts">
import { computed, ref } from 'vue'
import { SlidersHorizontal, RotateCcw, Info, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-vue-next'
import type { Scenario, ScoringWeights } from '../../types'
import { simulateAllScenarios } from '../../services/simulation'
import { formatRupiah } from '../../services/scoring'
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
  <section class="bg-surface border border-border rounded-2xl p-5 md:p-6 mt-5 shadow-xs" aria-labelledby="stress-test-heading">
    <div class="flex items-start justify-between gap-4 mb-4">
      <div>
        <div class="text-[11px] font-bold tracking-wider uppercase text-primary mb-1.5">{{ t.whatIf.eyebrow }}</div>
        <h3 id="stress-test-heading" class="font-display font-bold text-lg text-fg m-0">{{ t.whatIf.title }}</h3>
        <p class="text-xs text-fg-muted mt-1 max-w-lg leading-relaxed">{{ t.whatIf.desc }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="isDirty"
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-fg-muted hover:text-fg hover:bg-canvas-subtle transition-colors cursor-pointer"
          aria-label="Reset simulation"
          @click="resetSimulation"
        >
          <RotateCcw :size="13" /> {{ t.whatIf.reset }}
        </button>
        <span class="w-9 h-9 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0">
          <SlidersHorizontal :size="19" />
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-canvas-subtle rounded-xl border border-border my-4">
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between text-xs font-medium">
          <label for="sim-income" class="text-fg-muted">{{ t.whatIf.incomeLabel }}</label>
          <div class="flex items-center gap-1 shrink-0">
            <input
              v-model.number="incomePercent"
              type="number"
              min="0"
              max="150"
              class="w-14 h-6 text-center text-xs font-bold border border-border rounded-md bg-surface text-fg outline-none focus:border-primary"
            />
            <span class="text-[11px] text-fg-muted font-bold">%</span>
          </div>
        </div>
        <input
          id="sim-income"
          v-model.number="incomePercent"
          type="range"
          min="0"
          max="150"
          step="1"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between text-xs font-medium">
          <label for="sim-cost" class="text-fg-muted">{{ t.whatIf.costLabel }}</label>
          <div class="flex items-center gap-1 shrink-0">
            <input
              v-model.number="costPercent"
              type="number"
              min="60"
              max="180"
              class="w-14 h-6 text-center text-xs font-bold border border-border rounded-md bg-surface text-fg outline-none focus:border-primary"
            />
            <span class="text-[11px] text-fg-muted font-bold">%</span>
          </div>
        </div>
        <input
          id="sim-cost"
          v-model.number="costPercent"
          type="range"
          min="60"
          max="180"
          step="1"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between text-xs font-medium">
          <label for="sim-hours" class="text-fg-muted">{{ t.whatIf.hoursLabel }}</label>
          <div class="flex items-center gap-1 shrink-0">
            <input
              v-model.number="hoursDelta"
              type="number"
              min="-15"
              max="25"
              class="w-12 h-6 text-center text-xs font-bold border border-border rounded-md bg-surface text-fg outline-none focus:border-primary"
            />
            <span class="text-[11px] text-fg-muted">{{ t.common.hrs }}</span>
          </div>
        </div>
        <input
          id="sim-hours"
          v-model.number="hoursDelta"
          type="range"
          min="-15"
          max="25"
          step="1"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between text-xs font-medium">
          <label for="sim-risk" class="text-fg-muted">{{ t.whatIf.riskLabel }}</label>
          <div class="flex items-center gap-1 shrink-0">
            <input
              v-model.number="riskDelta"
              type="number"
              min="-30"
              max="30"
              class="w-12 h-6 text-center text-xs font-bold border border-border rounded-md bg-surface text-fg outline-none focus:border-primary"
            />
            <span class="text-[11px] text-fg-muted">{{ t.common.pts }}</span>
          </div>
        </div>
        <input
          id="sim-risk"
          v-model.number="riskDelta"
          type="range"
          min="-30"
          max="30"
          step="1"
          class="w-full"
        />
      </div>
    </div>

    <div class="grid gap-3 mt-4">
      <div
        v-for="item in simulatedList"
        :key="item.scenarioId"
        class="grid grid-cols-[minmax(100px,1.2fr)_minmax(80px,1fr)_auto_auto] items-center gap-3 p-2.5 rounded-xl hover:bg-canvas-subtle transition-colors text-xs"
      >
        <span>
          <strong class="font-bold text-fg block">{{ item.scenarioName }}</strong>
          <small class="block text-[10px] text-fg-subtle">
            {{ interpolate(t.whatIf.baseNet, { amount: formatRupiah(item.originalNet) }) }}
          </small>
        </span>

        <div class="h-2 bg-border rounded-full overflow-hidden">
          <i
            class="h-full block rounded-full bg-primary transition-all duration-150"
            :style="{ width: Math.min(100, Math.max(0, (item.simulatedNet + 2000000) / 10000000 * 100)) + '%' }"
          />
        </div>

        <strong :class="['min-w-[90px] text-right font-bold', item.simulatedNet < 0 ? 'text-danger' : 'text-fg']">
          {{ formatRupiah(item.simulatedNet) }}
        </strong>

        <div class="flex items-center gap-1.5">
          <span class="text-xs font-bold text-fg">{{ item.simulatedScore }}</span>
          <span
            :class="[
              'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold',
              item.scoreDelta > 0 ? 'bg-primary-soft text-primary' : item.scoreDelta < 0 ? 'bg-danger-soft text-danger' : 'bg-canvas-subtle text-fg-muted'
            ]"
          >
            <ArrowUpRight v-if="item.scoreDelta > 0" :size="11" />
            <ArrowDownRight v-else-if="item.scoreDelta < 0" :size="11" />
            <Minus v-else :size="11" />
            {{ item.scoreDelta > 0 ? '+' + item.scoreDelta : item.scoreDelta }}
          </span>
        </div>
      </div>
    </div>

    <p class="flex items-center gap-1.5 text-fg-muted text-xs leading-relaxed mt-4 pt-3 border-t border-border">
      <Info :size="13" class="shrink-0 text-primary" />
      {{ t.whatIf.microNote }}
    </p>
  </section>
</template>
