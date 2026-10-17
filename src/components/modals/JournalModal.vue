<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { X, Check, BookOpen } from 'lucide-vue-next'
import type { DecisionJournal, DecisionStatus } from '../../types'
import { useI18n } from '../../i18n'

const props = defineProps<{
  decisionTitle: string
  initialJournal: DecisionJournal
  initialReviewDate: string
  initialStatus: DecisionStatus
}>()

const emit = defineEmits<{
  (e: 'save', payload: { journal: DecisionJournal; reviewDate: string; status: DecisionStatus }): void
  (e: 'close'): void
}>()

const { t, interpolate } = useI18n()

const reason = ref(props.initialJournal.reason ?? '')
const expectedOutcome = ref(props.initialJournal.expectedOutcome ?? '')
const actualOutcome = ref(props.initialJournal.actualOutcome ?? '')
const reflection = ref(props.initialJournal.reflection ?? '')
const reviewDate = ref(props.initialReviewDate ?? '')
const status = ref<DecisionStatus>(props.initialStatus ?? 'exploring')

function setPresetDate(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  reviewDate.value = d.toISOString().slice(0, 10)
}

function handleSave() {
  let targetStatus = status.value
  if (actualOutcome.value.trim() || reflection.value.trim()) {
    targetStatus = 'reviewed'
  }
  emit('save', {
    journal: {
      reason: reason.value,
      expectedOutcome: expectedOutcome.value,
      actualOutcome: actualOutcome.value,
      reflection: reflection.value
    },
    reviewDate: reviewDate.value,
    status: targetStatus
  })
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
  <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="journal-modal-title" @click.self="emit('close')">
    <form class="modal-card journal-modal" @submit.prevent="handleSave">
      <div class="modal-head">
        <div>
          <div class="eyebrow"><BookOpen :size="14" /> {{ t.journalModal.eyebrow }}</div>
          <h2 id="journal-modal-title">{{ t.journalModal.title }}</h2>
        </div>
        <button type="button" class="icon-button" :aria-label="t.common.close" @click="emit('close')">
          <X :size="19" />
        </button>
      </div>

      <p class="modal-intro">
        {{ interpolate(t.journalModal.intro, { title: decisionTitle }) }}
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 12px;">
        <label>
          {{ t.journalModal.stageLabel }}
          <select v-model="status" style="width: 100%; border: 1px solid #e0e5dc; border-radius: 8px; background: #fff; padding: 9px; font-size: 11px;">
            <option value="exploring">{{ t.journalModal.stageExploring }}</option>
            <option value="decided">{{ t.journalModal.stageDecided }}</option>
            <option value="reviewed">{{ t.journalModal.stageReviewed }}</option>
          </select>
        </label>

        <label>
          {{ t.journalModal.reviewDateLabel }}
          <input v-model="reviewDate" type="date" required />
          <div class="quick-dates">
            <button type="button" class="quick-date-btn" @click="setPresetDate(7)">+7d</button>
            <button type="button" class="quick-date-btn" @click="setPresetDate(14)">+14d</button>
            <button type="button" class="quick-date-btn" @click="setPresetDate(30)">+30d</button>
            <button type="button" class="quick-date-btn" @click="setPresetDate(90)">+90d</button>
            <button type="button" class="quick-date-btn" @click="setPresetDate(180)">+6m</button>
          </div>
        </label>
      </div>

      <label>
        {{ t.journalModal.whyLabel }}
        <textarea
          v-model="reason"
          rows="2"
          :placeholder="t.journalModal.whyPlaceholder"
        />
      </label>

      <label>
        {{ t.journalModal.expectedLabel }}
        <textarea
          v-model="expectedOutcome"
          rows="2"
          :placeholder="t.journalModal.expectedPlaceholder"
        />
      </label>

      <label>
        {{ t.journalModal.actualLabel }}
        <textarea
          v-model="actualOutcome"
          rows="2"
          :placeholder="t.journalModal.actualPlaceholder"
        />
      </label>

      <label>
        {{ t.journalModal.reflectionLabel }}
        <textarea
          v-model="reflection"
          rows="2"
          :placeholder="t.journalModal.reflectionPlaceholder"
        />
      </label>

      <div class="form-actions">
        <button type="button" class="button button-ghost" @click="emit('close')">
          {{ t.common.cancel }}
        </button>
        <button class="button button-primary" type="submit">
          {{ t.journalModal.saveBtn }} <Check :size="16" />
        </button>
      </div>
    </form>
  </div>
</template>
