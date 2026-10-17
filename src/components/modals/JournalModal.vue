<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { X, Check, BookOpen, AlertCircle } from 'lucide-vue-next'
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
const dateTouched = ref(false)

const dateError = computed(() => {
  if (!dateTouched.value) return ''
  if (!reviewDate.value) return 'Tanggal evaluasi wajib diisi.'
  return ''
})

function setPresetDate(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  reviewDate.value = d.toISOString().slice(0, 10)
  dateTouched.value = false
}

function handleSave() {
  dateTouched.value = true
  if (!reviewDate.value) return

  let targetStatus = status.value
  if (actualOutcome.value.trim() || reflection.value.trim()) {
    targetStatus = 'reviewed'
  }
  emit('save', {
    journal: {
      reason: reason.value.trim(),
      expectedOutcome: expectedOutcome.value.trim(),
      actualOutcome: actualOutcome.value.trim(),
      reflection: reflection.value.trim()
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

      <div class="form-grid two" style="margin-bottom: 14px;">
        <label>
          {{ t.journalModal.stageLabel }}
          <select v-model="status">
            <option value="exploring">{{ t.journalModal.stageExploring }}</option>
            <option value="decided">{{ t.journalModal.stageDecided }}</option>
            <option value="reviewed">{{ t.journalModal.stageReviewed }}</option>
          </select>
        </label>

        <label>
          {{ t.journalModal.reviewDateLabel }}
          <input
            v-model="reviewDate"
            type="date"
            :class="{ 'input-error': !!dateError }"
            required
            @blur="dateTouched = true"
          />
          <div v-if="dateError" class="field-error-msg">
            <AlertCircle :size="14" />
            <span>{{ dateError }}</span>
          </div>
          <div class="quick-dates">
            <button type="button" class="quick-date-btn" @click="setPresetDate(7)">+7h</button>
            <button type="button" class="quick-date-btn" @click="setPresetDate(14)">+14h</button>
            <button type="button" class="quick-date-btn" @click="setPresetDate(30)">+30h</button>
            <button type="button" class="quick-date-btn" @click="setPresetDate(90)">+90h</button>
            <button type="button" class="quick-date-btn" @click="setPresetDate(180)">+6b</button>
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
          <Check :size="16" /> {{ t.journalModal.saveBtn }}
        </button>
      </div>
    </form>
  </div>
</template>
