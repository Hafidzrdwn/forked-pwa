<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { X, Check, AlertCircle } from '../common/AppIcons'
import { useI18n } from '../../i18n'
import type { Decision } from '../../types'

const props = defineProps<{
  decision: Decision
}>()

const emit = defineEmits<{
  (e: 'save', payload: { title: string; context: string }): void
  (e: 'close'): void
}>()

const { t } = useI18n()

const title = ref(props.decision.title)
const context = ref(props.decision.context || '')
const touched = ref(false)

const titleError = computed(() => {
  if (!touched.value) return ''
  const trimmed = title.value.trim()
  if (!trimmed) {
    return 'Judul keputusan wajib diisi'
  }
  if (trimmed.length < 3) {
    return 'Judul minimal 3 karakter'
  }
  return ''
})

const isValid = computed(() => {
  const trimmed = title.value.trim()
  return trimmed.length >= 3 && context.value.length <= 500
})

function handleSubmit() {
  touched.value = true
  if (!isValid.value) return
  emit('save', {
    title: title.value.trim(),
    context: context.value.trim()
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
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="edit-modal-title"
    @click.self="emit('close')"
  >
    <form
      class="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface border border-border rounded-2xl p-5 md:p-6 shadow-2xl text-fg"
      @submit.prevent="handleSubmit"
    >
      <div class="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 id="edit-modal-title" class="font-display font-extrabold text-xl md:text-2xl tracking-tight text-fg my-0.5">
            {{ t.studio.editDecisionModalTitle }}
          </h2>
          <p class="text-xs text-fg-muted mt-1">
            {{ t.studio.editDecision }}
          </p>
        </div>
        <button
          type="button"
          class="w-8 h-8 md:w-9 md:h-9 rounded-xl border border-border bg-surface text-fg-muted hover:text-fg hover:bg-canvas-subtle grid place-items-center transition-colors cursor-pointer shrink-0"
          :aria-label="t.common.close"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <label class="block text-xs font-bold text-fg mb-4">
        {{ t.studio.editTitleLabel }}
        <input
          v-model="title"
          autofocus
          :class="[
            'w-full mt-1.5 border rounded-xl bg-surface text-fg px-3.5 py-2.5 text-sm outline-none transition-all',
            titleError
              ? 'border-danger ring-2 ring-danger/20'
              : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
          ]"
          :placeholder="t.createModal.titlePlaceholder"
          @blur="touched = true"
        />
        <div v-if="titleError" class="flex items-center gap-1 text-danger text-xs font-semibold mt-1.5">
          <AlertCircle :size="14" />
          <span>{{ titleError }}</span>
        </div>
      </label>

      <label class="block text-xs font-bold text-fg mb-5">
        <div class="flex justify-between items-baseline mb-1.5">
          <span>{{ t.studio.editContextLabel }}</span>
          <small :class="['text-[11px]', context.length > 500 ? 'text-danger font-bold' : 'text-fg-subtle']">
            {{ context.length }}/500
          </small>
        </div>
        <textarea
          v-model="context"
          rows="4"
          maxlength="500"
          class="w-full border border-border rounded-xl bg-surface text-fg p-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all leading-relaxed"
          :placeholder="t.createModal.contextPlaceholder"
        />
      </label>

      <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
        <button
          type="button"
          class="px-4 py-2 text-xs font-bold text-fg-muted hover:text-fg cursor-pointer transition-colors"
          @click="emit('close')"
        >
          {{ t.common.cancel }}
        </button>
        <button
          class="inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
          type="submit"
          :disabled="!isValid"
        >
          <Check :size="15" /> {{ t.studio.saveEditBtn }}
        </button>
      </div>
    </form>
  </div>
</template>
