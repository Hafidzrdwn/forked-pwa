<script setup lang="ts">
import { computed, ref } from 'vue'
import { SlidersHorizontal, RotateCcw, Info, ArrowUpRight, ArrowDownRight, Minus } from '../common/AppIcons'
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
  <section class="bg-surface border border-border rounded-2xl p-4 md:p-6 mt-5 shadow-xs overflow-hidden" aria-labelledby="stress-test-heading">
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
      <div>
        <h3 id="stress-test-heading" class="font-display font-bold text-base md:text-lg text-fg m-0">{{ t.whatIf.title }}</h3>
        <p class="text-xs text-fg-muted mt-1 max-w-lg leading-relaxed">{{ t.whatIf.desc }}</p>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto shrink-0">
        <button
          v-if="isDirty"
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-fg-muted hover:text-fg hover:bg-canvas-subtle transition-colors cursor-pointer"
          aria-label="Reset simulation"
          @click="resetSimulation"
        >
          <RotateCcw :size="13" /> {{ t.whatIf.reset }}
        </button>
        <span class="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0">
          <SlidersHorizontal :size="17" />
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 p-3.5 md:p-4 bg-canvas-subtle rounded-xl border border-border my-4">
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between text-xs font-medium">
          <label for="sim-income" class="text-fg-muted">{{ t.whatIf.incomeLabel }}</label>
          <div class="flex items-center gap-1 shrink-0">
            <input
              v-model.number="incomePercent"
              type="number"
              min="0"
              max="150"
              class="w-14 h-6 text-center text-xs font-bold border border-border rounded-md bg-surface text-fg outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              class="w-14 h-6 text-center text-xs font-bold border border-border rounded-md bg-surface text-fg outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              class="w-12 h-6 text-center text-xs font-bold border border-border rounded-md bg-surface text-fg outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              class="w-12 h-6 text-center text-xs font-bold border border-border rounded-md bg-surface text-fg outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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

    <!-- Responsive List: Vertically stacked cards on mobile, 4-col table row on desktop -->
    <div class="grid gap-2.5 mt-4 min-w-0">
      <div
        v-for="item in simulatedList"
        :key="item.scenarioId"
        class="flex flex-col sm:grid sm:grid-cols-[minmax(120px,1.2fr)_minmax(80px,1fr)_auto_auto] sm:items-center gap-2 sm:gap-3 p-3 sm:p-2.5 rounded-xl bg-canvas-subtle sm:bg-transparent hover:bg-canvas-subtle transition-colors text-xs min-w-0"
      >
        <div class="flex items-start justify-between gap-2 min-w-0">
          <div class="min-w-0 flex-1">
            <strong class="font-bold text-fg block wrap-break-word line-clamp-1 text-xs md:text-sm">{{ item.scenarioName }}</strong>
            <small class="block text-[10.5px] text-fg-subtle truncate">
              {{ interpolate(t.whatIf.baseNet, { amount: formatRupiah(item.originalNet) }) }}
            </small>
          </div>

          <!-- Mobile Score Badge -->
          <div class="flex items-center gap-1.5 shrink-0 sm:hidden">
            <span class="text-xs font-bold text-fg tabular-nums">{{ item.simulatedScore }}</span>
            <span
              :class="[
                'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10.5px] font-bold tabular-nums',
                item.scoreDelta > 0 ? 'bg-primary-soft text-primary' : item.scoreDelta < 0 ? 'bg-danger-soft text-danger' : 'bg-surface text-fg-muted'
              ]"
            >
              <ArrowUpRight v-if="item.scoreDelta > 0" :size="11" />
              <ArrowDownRight v-else-if="item.scoreDelta < 0" :size="11" />
              <Minus v-else :size="11" />
              {{ item.scoreDelta > 0 ? '+' + item.scoreDelta : item.scoreDelta }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full sm:contents">
          <div class="h-2 bg-border rounded-full overflow-hidden flex-1 sm:w-auto">
            <i
              class="h-full block rounded-full bg-primary transition-all duration-150"
              :style="{ width: Math.min(100, Math.max(0, (item.simulatedNet + 2000000) / 10000000 * 100)) + '%' }"
            />
          </div>

          <strong :class="['text-right font-bold tabular-nums shrink-0 text-xs md:text-sm', item.simulatedNet < 0 ? 'text-danger' : 'text-fg']">
            {{ formatRupiah(item.simulatedNet) }}
          </strong>
        </div>

        <!-- Desktop Score Column -->
        <div class="hidden sm:flex items-center gap-1.5 shrink-0">
          <span class="text-xs font-bold text-fg tabular-nums">{{ item.simulatedScore }}</span>
          <span
            :class="[
              'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold tabular-nums',
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
