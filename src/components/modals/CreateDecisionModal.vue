<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { X, ArrowRight, Sparkles } from 'lucide-vue-next'
import { useI18n } from '../../i18n'

const emit = defineEmits<{
  (e: 'create', payload: { title: string; context: string }): void
  (e: 'close'): void
}>()

const { t } = useI18n()

const title = ref('')
const context = ref('')

function handleSubmit() {
  if (!title.value.trim()) return
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
          required
          autofocus
          :placeholder="t.createModal.titlePlaceholder"
        />
      </label>

      <label>
        {{ t.createModal.contextLabel }}
        <textarea
          v-model="context"
          rows="3"
          :placeholder="t.createModal.contextPlaceholder"
        />
      </label>

      <div class="modal-tip">
        <Sparkles :size="16" />
        <span>{{ t.createModal.tip }}</span>
      </div>

      <div class="form-actions">
        <button type="button" class="button button-ghost" @click="emit('close')">
          {{ t.common.cancel }}
        </button>
        <button class="button button-primary" type="submit" :disabled="!title.trim()">
          {{ t.createModal.submit }} <ArrowRight :size="16" />
        </button>
      </div>
    </form>
  </div>
</template>
