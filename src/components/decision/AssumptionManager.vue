<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, CircleHelp, Trash2 } from 'lucide-vue-next'
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

function submitAssumption() {
  if (!currentScenario.value || !text.value.trim()) return
  emit('add-assumption', {
    scenarioId: currentScenario.value.id,
    text: text.value.trim(),
    confidence: confidence.value,
    kind: kind.value
  })
  text.value = ''
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
        class="button button-secondary button-small"
        :disabled="!currentScenario"
        @click="showForm = !showForm"
      >
        <Plus :size="15" /> {{ t.assumptions.addBtn }}
      </button>
    </div>

    <!-- Tabs Navigation -->
    <div v-if="scenarios.length > 1" class="tabs-nav" role="tablist">
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
        <span v-if="selectedScenarioId === s.id" style="font-size: 9px; opacity: 0.8;">
          ({{ t.scenario.chosenPath }})
        </span>
      </button>
    </div>

    <!-- Banner -->
    <div v-if="currentScenario" class="assumption-path">
      <span class="assumption-current">{{ t.assumptions.pathTab }}</span>
      <strong>{{ currentScenario.name }}</strong>
      <span style="font-size: 10px; color: #8e958a; margin-left: auto;">
        {{ interpolate(t.assumptions.itemsCount, { n: currentScenario.assumptions.length }) }}
      </span>
    </div>

    <!-- Form -->
    <form v-if="showForm && currentScenario" class="inline-form assumption-new" @submit.prevent="submitAssumption">
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px;">
        <label>
          {{ t.assumptions.statementLabel }}
          <textarea
            v-model="text"
            rows="2"
            required
            :placeholder="t.assumptions.statementPlaceholder"
          />
        </label>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <label>
            {{ t.assumptions.typeLabel }}
            <select v-model="kind" style="width: 100%; border: 1px solid #e0e5dc; border-radius: 8px; background: #fff; padding: 7px; font-size: 11px;">
              <option value="assumption">{{ t.assumptions.typeAssumption }}</option>
              <option value="estimate">{{ t.assumptions.typeEstimate }}</option>
              <option value="fact">{{ t.assumptions.typeFact }}</option>
            </select>
          </label>

          <label>
            {{ interpolate(t.assumptions.confidenceLabel, { n: confidence }) }}
            <input v-model.number="confidence" type="range" min="0" max="100" />
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="button button-ghost" @click="showForm = false">
          {{ t.common.cancel }}
        </button>
        <button type="submit" class="button button-primary" :disabled="!text.trim()">
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
          :aria-label="'Mark as verified'"
          @change="emit('toggle-assumption', { scenarioId: currentScenario.id, assumptionId: item.id })"
        />

        <div class="assumption-text" :class="{ crossed: item.checked }">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
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
          <Trash2 :size="13" />
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
