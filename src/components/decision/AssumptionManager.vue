<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, CircleHelp, Trash2, AlertCircle } from '../common/AppIcons'
import type { AssumptionKind, Scenario } from '../../types'
import { useI18n } from '../../i18n'

const props = defineProps<{
  scenarios: Scenario[]
  selectedScenarioId: string | null
}>()

const emit = defineEmits<{
  (e: 'add-assumption', payload: { scenarioId: string; text: string; confidence: number; kind: AssumptionKind }): void
  (e: 'toggle-assumption', payload: { scenarioId: string; assumptionId: string }): void
  (e: 'remove-assumption', payload: { scenarioId: string; assumptionId: string }): void
}>()

const { t, interpolate } = useI18n()

const activeTabScenarioId = ref<string>(props.selectedScenarioId || props.scenarios[0]?.id || '')

if (props.selectedScenarioId && props.scenarios.some(s => s.id === props.selectedScenarioId)) {
  activeTabScenarioId.value = props.selectedScenarioId
}

import { AddAssumptionInputSchema } from '../../schemas/decision.schema'

const currentScenario = computed(() => {
  return props.scenarios.find(s => s.id === activeTabScenarioId.value) ?? props.scenarios[0] ?? null
})

const showForm = ref(false)
const text = ref('')
const confidence = ref(70)
const kind = ref<AssumptionKind>('assumption')
const textTouched = ref(false)

const assumptionValidation = computed(() => {
  return AddAssumptionInputSchema.safeParse({
    text: text.value,
    confidence: Number(confidence.value),
    kind: kind.value
  })
})

const textError = computed(() => {
  if (!textTouched.value || assumptionValidation.value.success) return ''
  const err = assumptionValidation.value.error.format().text
  return err?._errors[0] ?? ''
})

function submitAssumption() {
  textTouched.value = true
  if (!currentScenario.value || !assumptionValidation.value.success) return

  const data = assumptionValidation.value.data
  emit('add-assumption', {
    scenarioId: currentScenario.value.id,
    text: data.text,
    confidence: data.confidence,
    kind: data.kind
  })
  text.value = ''
  textTouched.value = false
  confidence.value = 70
  kind.value = 'assumption'
  showForm.value = false
}
</script>

<template>
  <section class="bg-surface border border-border rounded-2xl p-4 md:p-6 mt-5 shadow-xs" aria-labelledby="assumptions-heading">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
      <div>
        <h3 id="assumptions-heading" class="font-display font-bold text-base md:text-lg text-fg m-0">{{ t.assumptions.heading }}</h3>
        <p class="text-xs text-fg-muted mt-1">{{ t.assumptions.desc }}</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-fg hover:bg-canvas-subtle transition-colors cursor-pointer shadow-xs disabled:opacity-50 self-start sm:self-auto shrink-0"
        :disabled="!currentScenario"
        @click="showForm = !showForm"
      >
        <Plus :size="15" /> {{ t.assumptions.addBtn }}
      </button>
    </div>

    <div v-if="scenarios.length > 1" class="flex gap-2 flex-wrap mb-3.5" role="tablist">
      <button
        v-for="s in scenarios"
        :key="s.id"
        type="button"
        role="tab"
        :aria-selected="currentScenario?.id === s.id"
        :class="[
          'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs',
          currentScenario?.id === s.id
            ? 'bg-primary-soft text-primary border-primary font-bold'
            : 'bg-surface text-fg-muted border-border hover:bg-canvas-subtle hover:text-fg'
        ]"
        @click="activeTabScenarioId = s.id"
      >
        {{ s.name }}
        <span v-if="selectedScenarioId === s.id" class="text-[11px] opacity-85 ml-1">
          ({{ t.scenario.chosenPath }})
        </span>
      </button>
    </div>

    <div v-if="currentScenario" class="flex items-center gap-2.5 flex-wrap p-3 bg-canvas-subtle rounded-xl my-3 border border-border text-xs">
      <span class="text-[11px] font-bold uppercase tracking-wider text-fg-subtle">{{ t.assumptions.pathTab }}</span>
      <strong class="font-bold text-fg wrap-break-word">{{ currentScenario.name }}</strong>
      <span class="text-fg-subtle ml-auto">
        {{ interpolate(t.assumptions.itemsCount, { n: currentScenario.assumptions.length }) }}
      </span>
    </div>

    <form v-if="showForm && currentScenario" class="bg-canvas-subtle border border-border rounded-2xl p-4 my-3 shadow-xs" @submit.prevent="submitAssumption">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block text-xs font-bold text-fg">
          {{ t.assumptions.statementLabel }}
          <textarea
            v-model="text"
            rows="3"
            :class="[
              'w-full mt-1.5 border rounded-xl bg-surface text-fg p-3 text-xs outline-none transition-all',
              textError ? 'border-danger ring-2 ring-danger/20' : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
            ]"
            :placeholder="t.assumptions.statementPlaceholder"
            @blur="textTouched = true"
          />
          <div v-if="textError" class="flex items-center gap-1 text-danger text-xs font-semibold mt-1">
            <AlertCircle :size="14" />
            <span>{{ textError }}</span>
          </div>
        </label>

        <div class="flex flex-col gap-3">
          <label class="block text-xs font-bold text-fg">
            {{ t.assumptions.typeLabel }}
            <select v-model="kind" class="w-full mt-1.5 border border-border rounded-xl bg-surface text-fg px-3 py-2 text-xs outline-none focus:border-primary">
              <option value="assumption">{{ t.assumptions.typeAssumption }}</option>
              <option value="estimate">{{ t.assumptions.typeEstimate }}</option>
              <option value="fact">{{ t.assumptions.typeFact }}</option>
            </select>
          </label>

          <label class="block text-xs font-bold text-fg">
            <div class="flex justify-between items-center mb-1.5">
              <span>{{ t.assumptions.confidenceLabel.split(':')[0] }}</span>
              <div class="flex items-center gap-1 shrink-0">
                <input
                  v-model.number="confidence"
                  type="number"
                  min="0"
                  max="100"
                  class="w-12 h-6 text-center text-xs font-bold border border-border rounded-md bg-surface text-fg outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span class="text-[11px] text-fg-muted font-bold">%</span>
              </div>
            </div>
            <input v-model.number="confidence" type="range" min="0" max="100" step="1" class="w-full" />
          </label>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 pt-3">
        <button type="button" class="px-4 py-2 text-xs font-bold text-fg-muted hover:text-fg cursor-pointer" @click="showForm = false">
          {{ t.common.cancel }}
        </button>
        <button type="submit" class="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50" :disabled="text.trim().length < 3">
          {{ t.assumptions.save }}
        </button>
      </div>
    </form>

    <div v-if="currentScenario?.assumptions.length" class="divide-y divide-border">
      <div
        v-for="item in currentScenario.assumptions"
        :key="item.id"
        class="flex items-start gap-3 py-3 text-xs"
      >
        <input
          type="checkbox"
          :checked="item.checked"
          class="w-4 h-4 rounded mt-0.5 accent-primary cursor-pointer shrink-0"
          aria-label="Tandai terbukti"
          @change="emit('toggle-assumption', { scenarioId: currentScenario.id, assumptionId: item.id })"
        />

        <div :class="['flex-1 min-w-0', item.checked ? 'line-through text-fg-muted opacity-70' : 'text-fg']">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span
              :class="[
                'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md inline-block',
                item.kind === 'fact' ? 'bg-blue-soft text-blue' : item.kind === 'estimate' ? 'bg-amber-soft text-amber' : 'bg-canvas-subtle text-fg-muted border border-border'
              ]"
            >
              {{ item.kind || 'assumption' }}
            </span>
            <span class="font-semibold text-fg wrap-break-word">{{ item.text }}</span>
          </div>
          <small class="text-fg-subtle text-[11px] block">
            {{ item.checked ? t.assumptions.statusVerified : interpolate(t.assumptions.confidenceLabel, { n: item.confidence }) }}
          </small>
        </div>

        <span
          :class="[
            'text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0 tabular-nums',
            item.confidence < 50 ? 'bg-danger-soft text-danger' : item.confidence < 75 ? 'bg-amber-soft text-amber' : 'bg-primary-soft text-primary'
          ]"
        >
          {{ item.confidence }}%
        </span>

        <button
          type="button"
          class="w-6 h-6 rounded-lg text-fg-subtle hover:text-danger hover:bg-danger-soft grid place-items-center transition-colors cursor-pointer shrink-0"
          :aria-label="t.common.delete"
          @click="emit('remove-assumption', { scenarioId: currentScenario.id, assumptionId: item.id })"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>

    <div v-else class="flex gap-2.5 items-start text-fg-muted text-xs leading-relaxed py-4">
      <CircleHelp :size="18" class="text-primary shrink-0 mt-0.5" />
      <span>{{ t.assumptions.emptyDesc }}</span>
    </div>
  </section>
</template>
