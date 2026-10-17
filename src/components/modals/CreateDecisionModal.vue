<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { X, ArrowRight, Lightbulb, AlertCircle } from 'lucide-vue-next'
import { useI18n } from '../../i18n'

const emit = defineEmits<{
  (e: 'create', payload: { title: string; context: string }): void
  (e: 'close'): void
}>()

const { t } = useI18n()

const title = ref('')
const context = ref('')
const touched = ref(false)

const titleError = computed(() => {
  if (!touched.value) return ''
  const trimmed = title.value.trim()
  if (!trimmed) {
    return 'Judul keputusan wajib diisi.'
  }
  if (trimmed.length < 3) {
    return 'Judul terlalu pendek, minimal 3 karakter.'
  }
  if (trimmed.length > 120) {
    return 'Judul maksimal 120 karakter.'
  }
  return ''
})

const isValid = computed(() => {
  const trimmed = title.value.trim()
  return trimmed.length >= 3 && trimmed.length <= 120 && context.value.length <= 500
})

function handleSubmit() {
  touched.value = true
  if (!isValid.value) return
  emit('create', {
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
  <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="create-modal-title" @click.self="emit('close')">
    <form class="modal-card" @submit.prevent="handleSubmit">
      <div class="modal-head">
        <div>
          <div class="eyebrow">{{ t.createModal.eyebrow }}</div>
          <h2 id="create-modal-title">{{ t.createModal.title }}</h2>
        </div>
        <button type="button" class="icon-button" :aria-label="t.common.close" @click="emit('close')">
          <X :size="19" />
        </button>
      </div>

      <p class="modal-intro">{{ t.createModal.intro }}</p>

      <label>
        {{ t.createModal.titleLabel }}
        <input
          v-model="title"
          autofocus
          :class="{ 'input-error': !!titleError }"
          :placeholder="t.createModal.titlePlaceholder"
          @blur="touched = true"
        />
        <div v-if="titleError" class="field-error-msg">
          <AlertCircle :size="14" />
          <span>{{ titleError }}</span>
        </div>
      </label>

      <label>
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span>{{ t.createModal.contextLabel }}</span>
          <small :style="{ color: context.length > 500 ? 'var(--danger)' : 'var(--submuted)', fontSize: '11.5px' }">
            {{ context.length }}/500
          </small>
        </div>
        <textarea
          v-model="context"
          rows="3"
          maxlength="500"
          :placeholder="t.createModal.contextPlaceholder"
        />
      </label>

      <div class="modal-tip">
        <Lightbulb :size="18" style="flex-shrink: 0;" />
        <span>{{ t.createModal.tip }}</span>
      </div>

      <div class="form-actions">
        <button type="button" class="button button-ghost" @click="emit('close')">
          {{ t.common.cancel }}
        </button>
        <button class="button button-primary" type="submit" :disabled="!isValid">
          {{ t.createModal.submit }} <ArrowRight :size="16" />
        </button>
      </div>
    </form>
  </div>
</template>
