<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { X, Check, AlertCircle } from '../common/AppIcons'
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
  <div class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="journal-modal-title" @click.self="emit('close')">
    <form class="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-surface border border-border rounded-2xl p-6 shadow-2xl text-fg" @submit.prevent="handleSave">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 id="journal-modal-title" class="font-display font-extrabold text-2xl tracking-tight text-fg my-1">{{ t.journalModal.title }}</h2>
        </div>
        <button type="button" class="w-9 h-9 rounded-xl border border-border bg-surface text-fg-muted hover:text-fg hover:bg-canvas-subtle grid place-items-center transition-colors cursor-pointer" :aria-label="t.common.close" @click="emit('close')">
          <X :size="19" />
        </button>
      </div>

      <p class="text-xs text-fg-muted leading-relaxed my-3 mb-5">
        {{ interpolate(t.journalModal.intro, { title: decisionTitle }) }}
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
        <label class="block text-xs font-bold text-fg">
          {{ t.journalModal.stageLabel }}
          <select v-model="status" class="w-full mt-1.5 border border-border rounded-xl bg-surface text-fg px-3 py-2 text-xs outline-none focus:border-primary">
            <option value="exploring">{{ t.journalModal.stageExploring }}</option>
            <option value="decided">{{ t.journalModal.stageDecided }}</option>
            <option value="reviewed">{{ t.journalModal.stageReviewed }}</option>
          </select>
        </label>

        <label class="block text-xs font-bold text-fg">
          {{ t.journalModal.reviewDateLabel }}
          <input
            v-model="reviewDate"
            type="date"
            :class="[
              'w-full mt-1.5 border rounded-xl bg-surface text-fg px-3 py-2 text-xs outline-none transition-all',
              dateError ? 'border-danger ring-2 ring-danger/20' : 'border-border focus:border-primary'
            ]"
            required
            @blur="dateTouched = true"
          />
          <div v-if="dateError" class="flex items-center gap-1 text-danger text-xs font-semibold mt-1">
            <AlertCircle :size="14" />
            <span>{{ dateError }}</span>
          </div>
          <div class="flex gap-1.5 mt-2 flex-wrap">
            <button type="button" class="px-2 py-0.5 rounded-md border border-border bg-canvas-subtle text-fg-muted text-[11px] font-bold hover:bg-surface hover:text-primary hover:border-primary transition-colors cursor-pointer" @click="setPresetDate(7)">+7h</button>
            <button type="button" class="px-2 py-0.5 rounded-md border border-border bg-canvas-subtle text-fg-muted text-[11px] font-bold hover:bg-surface hover:text-primary hover:border-primary transition-colors cursor-pointer" @click="setPresetDate(14)">+14h</button>
            <button type="button" class="px-2 py-0.5 rounded-md border border-border bg-canvas-subtle text-fg-muted text-[11px] font-bold hover:bg-surface hover:text-primary hover:border-primary transition-colors cursor-pointer" @click="setPresetDate(30)">+30h</button>
            <button type="button" class="px-2 py-0.5 rounded-md border border-border bg-canvas-subtle text-fg-muted text-[11px] font-bold hover:bg-surface hover:text-primary hover:border-primary transition-colors cursor-pointer" @click="setPresetDate(90)">+90h</button>
            <button type="button" class="px-2 py-0.5 rounded-md border border-border bg-canvas-subtle text-fg-muted text-[11px] font-bold hover:bg-surface hover:text-primary hover:border-primary transition-colors cursor-pointer" @click="setPresetDate(180)">+6b</button>
          </div>
        </label>
      </div>

      <label class="block text-xs font-bold text-fg mb-3.5">
        {{ t.journalModal.whyLabel }}
        <textarea
          v-model="reason"
          rows="2"
          class="w-full mt-1.5 border border-border rounded-xl bg-surface text-fg p-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          :placeholder="t.journalModal.whyPlaceholder"
        />
      </label>

      <label class="block text-xs font-bold text-fg mb-3.5">
        {{ t.journalModal.expectedLabel }}
        <textarea
          v-model="expectedOutcome"
          rows="2"
          class="w-full mt-1.5 border border-border rounded-xl bg-surface text-fg p-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          :placeholder="t.journalModal.expectedPlaceholder"
        />
      </label>

      <label class="block text-xs font-bold text-fg mb-3.5">
        {{ t.journalModal.actualLabel }}
        <textarea
          v-model="actualOutcome"
          rows="2"
          class="w-full mt-1.5 border border-border rounded-xl bg-surface text-fg p-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          :placeholder="t.journalModal.actualPlaceholder"
        />
      </label>

      <label class="block text-xs font-bold text-fg mb-3.5">
        {{ t.journalModal.reflectionLabel }}
        <textarea
          v-model="reflection"
          rows="2"
          class="w-full mt-1.5 border border-border rounded-xl bg-surface text-fg p-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          :placeholder="t.journalModal.reflectionPlaceholder"
        />
      </label>

      <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
        <button type="button" class="px-4 py-2 text-xs font-bold text-fg-muted hover:text-fg cursor-pointer" @click="emit('close')">
          {{ t.common.cancel }}
        </button>
        <button class="inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer" type="submit">
          <Check :size="16" /> {{ t.journalModal.saveBtn }}
        </button>
      </div>
    </form>
  </div>
</template>
