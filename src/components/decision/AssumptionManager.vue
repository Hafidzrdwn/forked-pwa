<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, CircleHelp, Trash2, AlertCircle } from 'lucide-vue-next'
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

const currentScenario = computed(() => {
  return props.scenarios.find(s => s.id === activeTabScenarioId.value) ?? props.scenarios[0] ?? null
})

const showForm = ref(false)
const text = ref('')
const confidence = ref(70)
const kind = ref<AssumptionKind>('assumption')
const textTouched = ref(false)

const textError = computed(() => {
  if (!textTouched.value) return ''
  const trimmed = text.value.trim()
  if (!trimmed) return 'Pernyataan perkiraan wajib diisi.'
  if (trimmed.length < 3) return 'Minimal 3 karakter.'
  return ''
})

function submitAssumption() {
  textTouched.value = true
  if (!currentScenario.value || text.value.trim().length < 3) return

  emit('add-assumption', {
    scenarioId: currentScenario.value.id,
    text: text.value.trim(),
    confidence: confidence.value,
    kind: kind.value
  })
  text.value = ''
  textTouched.value = false
  confidence.value = 70
  kind.value = 'assumption'
  showForm.value = false
}
</script>

<template>
  <section class="analysis-card" aria-labelledby="assumptions-heading">
    <div class="subsection-title">
      <div>
        <h3 id="assumptions-heading">{{ t.assumptions.heading }}</h3>
        <p>{{ t.assumptions.desc }}</p>
      </div>
      <button
        type="button"
        class="button button-secondary button-sm"
        :disabled="!currentScenario"
        @click="showForm = !showForm"
      >
        <Plus :size="15" /> {{ t.assumptions.addBtn }}
      </button>
    </div>

    <!-- Tabs Navigation -->
    <div v-if="scenarios.length > 1" class="tabs-nav" role="tablist" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
      <button
        v-for="s in scenarios"
        :key="s.id"
        type="button"
        role="tab"
        :aria-selected="currentScenario?.id === s.id"
        :class="['tab-pill', { active: currentScenario?.id === s.id }]"
        @click="activeTabScenarioId = s.id"
      >
        {{ s.name }}
        <span v-if="selectedScenarioId === s.id" style="font-size: 11px; opacity: 0.85; margin-left: 4px;">
          ({{ t.scenario.chosenPath }})
        </span>
      </button>
    </div>

    <!-- Banner -->
    <div v-if="currentScenario" class="assumption-path">
      <span class="assumption-current">{{ t.assumptions.pathTab }}</span>
      <strong>{{ currentScenario.name }}</strong>
      <span style="font-size: 12px; color: var(--submuted); margin-left: auto;">
        {{ interpolate(t.assumptions.itemsCount, { n: currentScenario.assumptions.length }) }}
      </span>
    </div>

    <!-- Form -->
    <form v-if="showForm && currentScenario" class="inline-form assumption-new" @submit.prevent="submitAssumption">
      <div class="form-grid two">
        <label>
          {{ t.assumptions.statementLabel }}
          <textarea
            v-model="text"
            rows="3"
            :class="{ 'input-error': !!textError }"
            :placeholder="t.assumptions.statementPlaceholder"
            @blur="textTouched = true"
          />
          <div v-if="textError" class="field-error-msg">
            <AlertCircle :size="14" />
            <span>{{ textError }}</span>
          </div>
        </label>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <label>
            {{ t.assumptions.typeLabel }}
            <select v-model="kind">
              <option value="assumption">{{ t.assumptions.typeAssumption }}</option>
              <option value="estimate">{{ t.assumptions.typeEstimate }}</option>
              <option value="fact">{{ t.assumptions.typeFact }}</option>
            </select>
          </label>

          <label>
            <div style="display: flex; justify-content: space-between;">
              <span>{{ interpolate(t.assumptions.confidenceLabel, { n: confidence }) }}</span>
            </div>
            <input v-model.number="confidence" type="range" min="0" max="100" />
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="button button-ghost" @click="showForm = false">
          {{ t.common.cancel }}
        </button>
        <button type="submit" class="button button-primary" :disabled="text.trim().length < 3">
          {{ t.assumptions.save }}
        </button>
      </div>
    </form>

    <!-- Assumption List -->
    <div v-if="currentScenario?.assumptions.length" class="assumption-list">
      <div
        v-for="item in currentScenario.assumptions"
        :key="item.id"
        class="assumption-row"
      >
        <input
          type="checkbox"
          :checked="item.checked"
          :aria-label="'Tandai terbukti'"
          @change="emit('toggle-assumption', { scenarioId: currentScenario.id, assumptionId: item.id })"
        />

        <div class="assumption-text" :class="{ crossed: item.checked }">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 3px; flex-wrap: wrap;">
            <span :class="['kind-badge', item.kind || 'assumption']">
              {{ item.kind || 'assumption' }}
            </span>
            <span style="font-weight: 600;">{{ item.text }}</span>
          </div>
          <small>
            {{ item.checked ? t.assumptions.statusVerified : interpolate(t.assumptions.confidenceLabel, { n: item.confidence }) }}
          </small>
        </div>

        <span :class="['confidence-tag', item.confidence < 50 ? 'low' : item.confidence < 75 ? 'medium' : 'high']">
          {{ item.confidence }}%
        </span>

        <button
          type="button"
          class="icon-button tiny danger-hover"
          :aria-label="t.common.delete"
          @click="emit('remove-assumption', { scenarioId: currentScenario.id, assumptionId: item.id })"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="assumption-empty">
      <CircleHelp :size="18" />
      <span>{{ t.assumptions.emptyDesc }}</span>
    </div>
  </section>
</template>
