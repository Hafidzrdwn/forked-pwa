<script setup lang="ts">
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { Check, Target, Wallet, Clock3, TrendingUp, ShieldAlert, X, Pencil } from 'lucide-vue-next'
import type { Scenario, ScoringWeights } from '../../types'
import { scoreScenario, formatRupiah, formatRupiahInput, parseRupiahInput } from '../../services/scoring'
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

const titleInputRef = ref<HTMLTextAreaElement | null>(null)

const breakdown = computed(() => scoreScenario(props.scenario, props.weights))
const net = computed(() => (Number(props.scenario.monthlyIncome) || 0) - (Number(props.scenario.monthlyCost) || 0))

function adjustTextareaHeight() {
  if (!titleInputRef.value) return
  titleInputRef.value.style.height = 'auto'
  titleInputRef.value.style.height = `${titleInputRef.value.scrollHeight}px`
}

onMounted(() => {
  nextTick(adjustTextareaHeight)
})

watch(() => props.scenario.name, () => {
  nextTick(adjustTextareaHeight)
})

function onFieldChange() {
  emit('update', props.scenario)
}

function focusTitleInput() {
  if (!titleInputRef.value) return
  titleInputRef.value.focus()
  titleInputRef.value.select()
}

function onIncomeInput(e: Event) {
  const target = e.target as HTMLInputElement
  const raw = parseRupiahInput(target.value)
  props.scenario.monthlyIncome = raw
  target.value = formatRupiahInput(raw)
  onFieldChange()
}

function onCostInput(e: Event) {
  const target = e.target as HTMLInputElement
  const raw = parseRupiahInput(target.value)
  props.scenario.monthlyCost = raw
  target.value = formatRupiahInput(raw)
  onFieldChange()
}

function onHoursInput(e: Event) {
  const target = e.target as HTMLInputElement
  const raw = Math.max(0, Math.min(168, Number(target.value) || 0))
  props.scenario.hoursPerWeek = raw
  onFieldChange()
}

function onGrowthInput(e: Event) {
  const target = e.target as HTMLInputElement
  const raw = Math.max(0, Math.min(100, Number(target.value) || 0))
  props.scenario.growth = raw
  onFieldChange()
}

function onRiskInput(e: Event) {
  const target = e.target as HTMLInputElement
  const raw = Math.max(0, Math.min(100, Number(target.value) || 0))
  props.scenario.risk = raw
  onFieldChange()
}
</script>

<template>
  <article :class="['bg-surface border rounded-2xl p-4 sm:p-5 relative transition-all duration-200 flex flex-col shadow-xs', isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-border-hover']">
    <div class="flex items-center justify-between mb-2">
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

    <div class="flex items-start gap-1.5 group/title relative my-1">
      <textarea
        ref="titleInputRef"
        v-model="scenario.name"
        rows="1"
        class="flex-1 min-w-0 bg-transparent outline-none font-display font-bold text-base text-fg rounded-lg px-2 py-1 -ml-2 border border-transparent hover:border-border focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all resize-none leading-snug overflow-hidden"
        :aria-label="t.scenario.pathLabel + ' ' + String.fromCharCode(65 + index)"
        :title="t.scenario.editingTitleHint"
        @input="adjustTextareaHeight"
        @change="onFieldChange"
        @keydown.enter.prevent="($event.target as HTMLTextAreaElement).blur()"
      />
      <button
        type="button"
        class="w-7 h-7 rounded-lg text-fg-muted hover:text-primary hover:bg-primary-soft grid place-items-center transition-colors shrink-0 cursor-pointer mt-0.5"
        :title="t.scenario.editTitle"
        :aria-label="t.scenario.editTitle"
        @click="focusTitleInput"
      >
        <Pencil :size="14" />
      </button>
    </div>

    <div class="flex items-baseline gap-1 mt-2">
      <span class="font-display font-extrabold text-3xl tracking-tight text-fg tabular-nums">{{ breakdown.total }}</span>
      <span class="text-xs text-fg-muted">/100</span>
      <span class="ml-auto text-[11px] font-bold tracking-wider uppercase text-fg-subtle">{{ t.scenario.fitScore }}</span>
    </div>

    <div class="h-1.5 rounded-full bg-border my-2.5 overflow-hidden" role="progressbar" :aria-valuenow="breakdown.total" aria-valuemin="0" aria-valuemax="100">
      <span class="block h-full rounded-full bg-primary transition-all duration-200" :style="{ width: breakdown.total + '%' }" />
    </div>

    <div class="grid gap-2.5 border-b border-border pb-4">
      <div class="flex items-center justify-between gap-2 text-xs">
        <span class="flex items-center gap-1.5 text-fg-muted min-w-0"><Wallet :size="14" class="shrink-0" /> <span class="truncate">{{ t.scenario.netPerMonth }}</span></span>
        <strong :class="['font-bold text-sm shrink-0 tabular-nums', net < 0 ? 'text-danger' : 'text-fg']">{{ formatRupiah(net) }}</strong>
      </div>
      <div class="flex items-center justify-between gap-2 text-xs">
        <span class="flex items-center gap-1.5 text-fg-muted min-w-0"><Clock3 :size="14" class="shrink-0" /> <span class="truncate">{{ t.scenario.timePerWeek }}</span></span>
        <strong class="font-bold text-sm text-fg shrink-0 tabular-nums">{{ scenario.hoursPerWeek }} {{ t.common.hrs }}</strong>
      </div>
      <div class="flex items-center justify-between gap-2 text-xs">
        <span class="flex items-center gap-1.5 text-fg-muted min-w-0"><TrendingUp :size="14" class="shrink-0" /> <span class="truncate">{{ t.scenario.growth }}</span></span>
        <strong class="font-bold text-sm text-fg shrink-0 tabular-nums">{{ scenario.growth }}<small class="text-fg-subtle font-normal">/100</small></strong>
      </div>
      <div class="flex items-center justify-between gap-2 text-xs">
        <span class="flex items-center gap-1.5 text-fg-muted min-w-0"><ShieldAlert :size="14" class="shrink-0" /> <span class="truncate">{{ t.scenario.risk }}</span></span>
        <strong class="font-bold text-sm text-fg shrink-0 tabular-nums">{{ scenario.risk }}<small class="text-fg-subtle font-normal">/100</small></strong>
      </div>
    </div>

    <div class="grid gap-3.5 py-4">
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between gap-2 text-xs text-fg-muted font-medium">
          <span class="truncate">{{ t.scenario.monthlyIncome }}</span>
          <div class="flex items-center gap-1 bg-surface border border-border rounded-lg px-2 py-0.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shrink-0">
            <span class="text-xs text-fg-muted font-bold">Rp</span>
            <input
              class="w-28 text-right text-xs font-bold bg-transparent outline-none text-fg"
              :value="formatRupiahInput(scenario.monthlyIncome)"
              @input="onIncomeInput"
              @change="onFieldChange"
            />
          </div>
        </div>
        <input
          v-model.number="scenario.monthlyIncome"
          class="w-full"
          type="range"
          min="0"
          max="30000000"
          step="100000"
          @change="onFieldChange"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between gap-2 text-xs text-fg-muted font-medium">
          <span class="truncate">{{ t.scenario.monthlyCost }}</span>
          <div class="flex items-center gap-1 bg-surface border border-border rounded-lg px-2 py-0.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shrink-0">
            <span class="text-xs text-fg-muted font-bold">Rp</span>
            <input
              class="w-28 text-right text-xs font-bold bg-transparent outline-none text-fg"
              :value="formatRupiahInput(scenario.monthlyCost)"
              @input="onCostInput"
              @change="onFieldChange"
            />
          </div>
        </div>
        <input
          v-model.number="scenario.monthlyCost"
          class="w-full"
          type="range"
          min="0"
          max="20000000"
          step="100000"
          @change="onFieldChange"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between gap-2 text-xs text-fg-muted font-medium">
          <span class="truncate">{{ t.scenario.hoursPerWeek }}</span>
          <div class="flex items-center gap-1 bg-surface border border-border rounded-lg px-2 py-0.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shrink-0">
            <input
              type="number"
              min="0"
              max="168"
              class="w-12 text-right text-xs font-bold bg-transparent outline-none text-fg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              :value="scenario.hoursPerWeek"
              @input="onHoursInput"
              @change="onFieldChange"
            />
            <span class="text-xs text-fg-muted font-medium">{{ t.common.hrs }}</span>
          </div>
        </div>
        <input
          v-model.number="scenario.hoursPerWeek"
          class="w-full"
          type="range"
          min="0"
          max="80"
          step="1"
          @change="onFieldChange"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between gap-2 text-xs text-fg-muted font-medium">
          <span class="truncate">{{ t.scenario.growthPotential }}</span>
          <div class="flex items-center gap-1 bg-surface border border-border rounded-lg px-2 py-0.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shrink-0">
            <input
              type="number"
              min="0"
              max="100"
              class="w-12 text-right text-xs font-bold bg-transparent outline-none text-fg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              :value="scenario.growth"
              @input="onGrowthInput"
              @change="onFieldChange"
            />
            <span class="text-xs text-fg-muted font-medium">/100</span>
          </div>
        </div>
        <input
          v-model.number="scenario.growth"
          class="w-full"
          type="range"
          min="0"
          max="100"
          step="1"
          @change="onFieldChange"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between gap-2 text-xs text-fg-muted font-medium">
          <span class="truncate">{{ t.scenario.riskLevel }}</span>
          <div class="flex items-center gap-1 bg-surface border border-border rounded-lg px-2 py-0.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shrink-0">
            <input
              type="number"
              min="0"
              max="100"
              class="w-12 text-right text-xs font-bold bg-transparent outline-none text-fg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              :value="scenario.risk"
              @input="onRiskInput"
              @change="onFieldChange"
            />
            <span class="text-xs text-fg-muted font-medium">/100</span>
          </div>
        </div>
        <input
          v-model.number="scenario.risk"
          class="w-full"
          type="range"
          min="0"
          max="100"
          step="1"
          @change="onFieldChange"
        />
      </div>
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
