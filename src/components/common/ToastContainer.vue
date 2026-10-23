<script setup lang="ts">
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from './AppIcons'
import { useToast } from '../../composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 pointer-events-none max-w-sm w-[calc(100vw-48px)]" aria-live="polite" aria-atomic="true">
    <TransitionGroup name="toast-anim" tag="div" class="flex flex-col gap-2.5">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 p-3.5 px-4 rounded-xl bg-surface-elevated border border-border shadow-lg text-fg"
        role="alert"
      >
        <div class="shrink-0 mt-0.5">
          <CheckCircle2 v-if="toast.type === 'success'" class="text-primary" :size="18" />
          <AlertCircle v-else-if="toast.type === 'error'" class="text-danger" :size="18" />
          <AlertTriangle v-else-if="toast.type === 'warning'" class="text-amber" :size="18" />
          <Info v-else class="text-blue" :size="18" />
        </div>

        <div class="flex flex-col gap-0.5 flex-1 min-w-0">
          <strong v-if="toast.title" class="text-xs font-bold text-fg">{{ toast.title }}</strong>
          <span class="text-xs text-fg-muted wrap-break-word leading-relaxed">{{ toast.message }}</span>
        </div>

        <button
          type="button"
          class="text-fg-subtle hover:text-fg p-1 rounded-md cursor-pointer transition-colors shrink-0"
          aria-label="Tutup notifikasi"
          @click="dismiss(toast.id)"
        >
          <X :size="15" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-anim-enter-active,
.toast-anim-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-anim-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
.toast-anim-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}
</style>
