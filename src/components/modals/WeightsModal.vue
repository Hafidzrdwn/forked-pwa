<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { X, Check, RotateCcw, Scale, Info } from 'lucide-vue-next'
import type { ScoringWeights } from '../../types'
import { DEFAULT_WEIGHTS, normalizeWeights } from '../../scoring'
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

const normalized = computed(() => {
  return normalizeWeights({
    money: money.value,
    time: time.value,
    growth: growth.value,
    risk: risk.value
  })
})

function resetDefaults() {
  money.value = Math.round(DEFAULT_WEIGHTS.money * 100)
  time.value = Math.round(DEFAULT_WEIGHTS.time * 100)
  growth.value = Math.round(DEFAULT_WEIGHTS.growth * 100)
  risk.value = Math.round(DEFAULT_WEIGHTS.risk * 100)
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
  <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="weights-modal-title" @click.self="emit('close')">
    <div class="modal-card" style="width: min(100%, 580px);">
      <div class="modal-head">
        <div>
          <div class="eyebrow"><Scale :size="14" /> {{ t.weightsModal.eyebrow }}</div>
          <h2 id="weights-modal-title">{{ t.weightsModal.title }}</h2>
        </div>
        <button type="button" class="icon-button" :aria-label="t.common.close" @click="emit('close')">
          <X :size="19" />
        </button>
      </div>

      <p class="modal-intro">
        {{ interpolate(t.weightsModal.intro, { title: decisionTitle }) }}
      </p>

      <div class="weights-grid">
        <div class="weight-card">
          <div class="weight-card-head">
            <span>{{ t.weightsModal.money }}</span>
            <strong style="color: var(--green);">{{ Math.round(normalized.money * 100) }}%</strong>
          </div>
          <input
            v-model.number="money"
            type="range"
            min="0"
            max="100"
            step="5"
            style="width: 100%; accent-color: var(--green);"
          />
        </div>

        <div class="weight-card">
          <div class="weight-card-head">
            <span>{{ t.weightsModal.time }}</span>
            <strong style="color: var(--green);">{{ Math.round(normalized.time * 100) }}%</strong>
          </div>
          <input
            v-model.number="time"
            type="range"
            min="0"
            max="100"
            step="5"
            style="width: 100%; accent-color: var(--green);"
          />
        </div>

        <div class="weight-card">
          <div class="weight-card-head">
            <span>{{ t.weightsModal.growth }}</span>
            <strong style="color: var(--green);">{{ Math.round(normalized.growth * 100) }}%</strong>
          </div>
          <input
            v-model.number="growth"
            type="range"
            min="0"
            max="100"
            step="5"
            style="width: 100%; accent-color: var(--green);"
          />
        </div>

        <div class="weight-card">
          <div class="weight-card-head">
            <span>{{ t.weightsModal.safety }}</span>
            <strong style="color: var(--green);">{{ Math.round(normalized.risk * 100) }}%</strong>
          </div>
          <input
            v-model.number="risk"
            type="range"
            min="0"
            max="100"
            step="5"
            style="width: 100%; accent-color: var(--green);"
          />
        </div>
      </div>

      <div class="formula-box">
        <strong><Info :size="13" style="display: inline; vertical-align: middle; margin-right: 4px;" /> {{ t.weightsModal.howFormulaWorks }}</strong>
        <code class="formula-code">
          {{ interpolate(t.weightsModal.formulaExplanation, {
            m: Math.round(normalized.money * 100),
            t: Math.round(normalized.time * 100),
            g: Math.round(normalized.growth * 100),
            r: Math.round(normalized.risk * 100)
          }) }}
        </code>
        <span>{{ t.weightsModal.formulaNote }}</span>
      </div>

      <div class="form-actions" style="justify-content: space-between;">
        <button type="button" class="button button-ghost" @click="resetDefaults">
          <RotateCcw :size="15" /> {{ t.weightsModal.reset }}
        </button>
        <div style="display: flex; gap: 8px;">
          <button type="button" class="button button-secondary" @click="emit('close')">
            {{ t.common.cancel }}
          </button>
          <button type="button" class="button button-primary" @click="handleSave">
            {{ t.weightsModal.apply }} <Check :size="15" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
