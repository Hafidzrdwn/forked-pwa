<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { AlertTriangle, AlertCircle, X } from './AppIcons'
import { useConfirm } from '../../composables/useConfirm'

const { state, handleConfirm, handleCancel } = useConfirm()

function onKeydown(e: KeyboardEvent) {
  if (!state.value.isOpen) return
  if (e.key === 'Escape') {
    handleCancel()
  } else if (e.key === 'Enter') {
    handleConfirm()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Transition name="confirm-fade">
    <div
      v-if="state.isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      :aria-labelledby="'confirm-title'"
      :aria-describedby="'confirm-desc'"
      @click.self="handleCancel"
    >
      <div class="max-w-md w-full rounded-2xl bg-surface border border-border p-6 shadow-2xl flex flex-col gap-4 text-fg">
        <div class="flex items-center justify-between">
          <div :class="['w-10 h-10 rounded-xl grid place-items-center', state.danger ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary']">
            <AlertTriangle v-if="state.danger" :size="20" />
            <AlertCircle v-else :size="20" />
          </div>
          <button
            type="button"
            class="w-8 h-8 rounded-xl border border-border bg-surface text-fg-muted hover:text-fg hover:bg-canvas-subtle grid place-items-center transition-colors cursor-pointer"
            aria-label="Tutup"
            @click="handleCancel"
          >
            <X :size="16" />
          </button>
        </div>

        <div class="flex flex-col gap-1.5">
          <h3 id="confirm-title" class="font-display text-lg font-extrabold tracking-tight text-fg m-0">{{ state.title }}</h3>
          <p id="confirm-desc" class="text-xs leading-relaxed text-fg-muted m-0">{{ state.message }}</p>
        </div>

        <div class="flex justify-end gap-2.5 mt-2 pt-3 border-t border-border">
          <button
            type="button"
            class="px-4 py-2 text-xs font-bold text-fg-muted hover:text-fg cursor-pointer"
            @click="handleCancel"
          >
            {{ state.cancelText }}
          </button>
          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs',
              state.danger ? 'bg-danger hover:bg-danger/90' : 'bg-primary hover:bg-primary-dark'
            ]"
            @click="handleConfirm"
          >
            {{ state.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 0.2s ease;
}
.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}
</style>
