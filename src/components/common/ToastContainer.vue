<script setup lang="ts">
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-vue-next'
import { useToast } from '../../composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="toast-viewport" aria-live="polite" aria-atomic="true">
    <TransitionGroup name="toast-anim" tag="div" class="toast-list">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast-bubble', `toast-${toast.type}`]"
        role="alert"
      >
        <div class="toast-icon">
          <CheckCircle2 v-if="toast.type === 'success'" :size="18" />
          <AlertCircle v-else-if="toast.type === 'error'" :size="18" />
          <AlertTriangle v-else-if="toast.type === 'warning'" :size="18" />
          <Info v-else :size="18" />
        </div>

        <div class="toast-content">
          <strong v-if="toast.title" class="toast-title">{{ toast.title }}</strong>
          <span class="toast-desc">{{ toast.message }}</span>
        </div>

        <button
          type="button"
          class="toast-close"
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
.toast-viewport {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  pointer-events: none;
  max-width: 420px;
  width: calc(100vw - 48px);
}
.toast-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.toast-bubble {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--paper-elevated, #ffffff);
  border: 1px solid var(--line);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08);
  color: var(--ink);
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.toast-icon {
  flex-shrink: 0;
  margin-top: 1px;
}
.toast-success .toast-icon {
  color: #2e7a4e;
}
.toast-error .toast-icon {
  color: #d94f3d;
}
.toast-warning .toast-icon {
  color: #d48a1c;
}
.toast-info .toast-icon {
  color: #3b82a6;
}
.toast-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}
.toast-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
}
.toast-desc {
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--muted);
  word-break: break-word;
}
.toast-close {
  background: transparent;
  border: 0;
  color: var(--submuted);
  padding: 2px;
  border-radius: 6px;
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: color 0.15s ease, background 0.15s ease;
}
.toast-close:hover {
  color: var(--ink);
  background: var(--bg-hover);
}

/* Animations */
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
@media (max-width: 640px) {
  .toast-viewport {
    bottom: 16px;
    right: 16px;
    left: 16px;
    width: auto;
  }
}
</style>
