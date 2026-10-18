<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { X, Check, RotateCcw, Scale, Info, Sparkles, AlertCircle } from 'lucide-vue-next'
import type { ScoringWeights } from '../../types'
import { DEFAULT_WEIGHTS, normalizeWeights } from '../../services/scoring'
import { useI18n } from '../../i18n'

const props = defineProps<{
  initialWeights?: ScoringWeights
  decisionTitle: string
}>()

const emit = defineEmits<{
  (e: 'save', weights: ScoringWeights): void
  (e: 'close'): void
}>()

const { t, interpolate } = useI18n()

const money = ref(Math.round((props.initialWeights?.money ?? DEFAULT_WEIGHTS.money) * 100))
const time = ref(Math.round((props.initialWeights?.time ?? DEFAULT_WEIGHTS.time) * 100))
const growth = ref(Math.round((props.initialWeights?.growth ?? DEFAULT_WEIGHTS.growth) * 100))
const risk = ref(Math.round((props.initialWeights?.risk ?? DEFAULT_WEIGHTS.risk) * 100))

const totalSum = computed(() => {
  const m = Number(money.value) || 0
  const tm = Number(time.value) || 0
  const g = Number(growth.value) || 0
  const r = Number(risk.value) || 0
  return m + tm + g + r
})

const normalized = computed(() => {
  return normalizeWeights({
    money: Number(money.value) || 0,
    time: Number(time.value) || 0,
    growth: Number(growth.value) || 0,
    risk: Number(risk.value) || 0
  })
})

function resetDefaults() {
  money.value = Math.round(DEFAULT_WEIGHTS.money * 100)
  time.value = Math.round(DEFAULT_WEIGHTS.time * 100)
  growth.value = Math.round(DEFAULT_WEIGHTS.growth * 100)
  risk.value = Math.round(DEFAULT_WEIGHTS.risk * 100)
}

function autoBalance() {
  const sum = totalSum.value
  if (sum === 0) {
    resetDefaults()
    return
  }
  const m = Math.round((Number(money.value) / sum) * 100)
  const tm = Math.round((Number(time.value) / sum) * 100)
  const g = Math.round((Number(growth.value) / sum) * 100)
  const r = 100 - (m + tm + g)
  money.value = Math.max(0, m)
  time.value = Math.max(0, tm)
  growth.value = Math.max(0, g)
  risk.value = Math.max(0, r)
}

function handleSave() {
  emit('save', normalized.value)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="weights-modal-title" @click.self="emit('close')">
    <div class="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-surface border border-border rounded-2xl p-6 shadow-2xl text-fg">
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-primary mb-1">
            <Scale :size="14" /> {{ t.weightsModal.eyebrow }}
          </div>
          <h2 id="weights-modal-title" class="font-display font-extrabold text-2xl tracking-tight text-fg my-1">{{ t.weightsModal.title }}</h2>
        </div>
        <button type="button" class="w-9 h-9 rounded-xl border border-border bg-surface text-fg-muted hover:text-fg hover:bg-canvas-subtle grid place-items-center transition-colors cursor-pointer" :aria-label="t.common.close" @click="emit('close')">
          <X :size="19" />
        </button>
      </div>

      <p class="text-xs text-fg-muted leading-relaxed my-3 mb-5">
        {{ interpolate(t.weightsModal.intro, { title: decisionTitle }) }}
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
        <div class="bg-canvas-subtle border border-border rounded-xl p-3.5 flex flex-col justify-between">
          <div class="flex justify-between items-start gap-2 mb-2">
            <div>
              <span class="block text-xs font-bold text-fg">{{ t.weightsModal.money }}</span>
              <small class="block text-[11px] text-fg-muted leading-tight mt-0.5">{{ t.weightsModal.moneyDesc }}</small>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <input
                v-model.number="money"
                type="number"
                min="0"
                max="100"
                class="w-14 h-7 text-center text-xs font-bold border border-border rounded-lg bg-surface text-fg outline-none focus:border-primary focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span class="text-xs text-fg-muted font-bold">%</span>
            </div>
          </div>
          <input
            v-model.number="money"
            type="range"
            min="0"
            max="100"
            step="1"
            class="w-full mt-2"
          />
        </div>

        <div class="bg-canvas-subtle border border-border rounded-xl p-3.5 flex flex-col justify-between">
          <div class="flex justify-between items-start gap-2 mb-2">
            <div>
              <span class="block text-xs font-bold text-fg">{{ t.weightsModal.time }}</span>
              <small class="block text-[11px] text-fg-muted leading-tight mt-0.5">{{ t.weightsModal.timeDesc }}</small>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <input
                v-model.number="time"
                type="number"
                min="0"
                max="100"
                class="w-14 h-7 text-center text-xs font-bold border border-border rounded-lg bg-surface text-fg outline-none focus:border-primary focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span class="text-xs text-fg-muted font-bold">%</span>
            </div>
          </div>
          <input
            v-model.number="time"
            type="range"
            min="0"
            max="100"
            step="1"
            class="w-full mt-2"
          />
        </div>

        <div class="bg-canvas-subtle border border-border rounded-xl p-3.5 flex flex-col justify-between">
          <div class="flex justify-between items-start gap-2 mb-2">
            <div>
              <span class="block text-xs font-bold text-fg">{{ t.weightsModal.growth }}</span>
              <small class="block text-[11px] text-fg-muted leading-tight mt-0.5">{{ t.weightsModal.growthDesc }}</small>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <input
                v-model.number="growth"
                type="number"
                min="0"
                max="100"
                class="w-14 h-7 text-center text-xs font-bold border border-border rounded-lg bg-surface text-fg outline-none focus:border-primary focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span class="text-xs text-fg-muted font-bold">%</span>
            </div>
          </div>
          <input
            v-model.number="growth"
            type="range"
            min="0"
            max="100"
            step="1"
            class="w-full mt-2"
          />
        </div>

        <div class="bg-canvas-subtle border border-border rounded-xl p-3.5 flex flex-col justify-between">
          <div class="flex justify-between items-start gap-2 mb-2">
            <div>
              <span class="block text-xs font-bold text-fg">{{ t.weightsModal.safety }}</span>
              <small class="block text-[11px] text-fg-muted leading-tight mt-0.5">{{ t.weightsModal.safetyDesc }}</small>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <input
                v-model.number="risk"
                type="number"
                min="0"
                max="100"
                class="w-14 h-7 text-center text-xs font-bold border border-border rounded-lg bg-surface text-fg outline-none focus:border-primary focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span class="text-xs text-fg-muted font-bold">%</span>
            </div>
          </div>
          <input
            v-model.number="risk"
            type="range"
            min="0"
            max="100"
            step="1"
            class="w-full mt-2"
          />
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-canvas-subtle rounded-xl border border-border my-4">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-fg">{{ t.weightsModal.totalLabel }}:</span>
          <span
            :class="[
              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold',
              totalSum === 100
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : totalSum < 100
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-danger/10 text-danger'
            ]"
          >
            <Check v-if="totalSum === 100" :size="13" />
            <AlertCircle v-else :size="13" />
            {{ totalSum }}%
            <span class="font-medium text-[11px]">
              ({{ totalSum === 100 ? t.weightsModal.exactTotal : totalSum < 100 ? interpolate(t.weightsModal.remainingTotal, { n: 100 - totalSum }) : interpolate(t.weightsModal.overTotal, { n: totalSum - 100 }) }})
            </span>
          </span>
        </div>

        <button
          v-if="totalSum !== 100"
          type="button"
          class="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-primary-soft text-primary hover:bg-primary/20 transition-colors cursor-pointer"
          @click="autoBalance"
        >
          <Sparkles :size="13" /> {{ t.weightsModal.autoBalance }}
        </button>
      </div>

      <div class="p-3.5 bg-canvas-subtle rounded-xl border border-border text-xs text-fg-muted my-4 space-y-2">
        <strong class="flex items-center gap-1.5 text-fg font-bold">
          <Info :size="14" class="text-primary" /> {{ t.weightsModal.howFormulaWorks }}
        </strong>
        <code class="block p-2 bg-surface rounded-lg border border-border text-[11px] text-fg font-mono overflow-x-auto">
          {{ interpolate(t.weightsModal.formulaExplanation, {
            m: Math.round(normalized.money * 100),
            t: Math.round(normalized.time * 100),
            g: Math.round(normalized.growth * 100),
            r: Math.round(normalized.risk * 100)
          }) }}
        </code>
        <span class="block text-[11px] text-fg-subtle">{{ t.weightsModal.formulaNote }}</span>
      </div>

      <div class="flex items-center justify-between gap-3 pt-3 border-t border-border">
        <button type="button" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-fg-muted hover:text-fg cursor-pointer" @click="resetDefaults">
          <RotateCcw :size="15" /> {{ t.weightsModal.reset }}
        </button>
        <div class="flex gap-2">
          <button type="button" class="px-4 py-2 text-xs font-bold text-fg-muted hover:text-fg cursor-pointer" @click="emit('close')">
            {{ t.common.cancel }}
          </button>
          <button type="button" class="inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer" @click="handleSave">
            {{ t.weightsModal.apply }} <Check :size="15" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
