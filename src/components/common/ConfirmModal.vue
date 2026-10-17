<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { AlertTriangle, AlertCircle, X } from 'lucide-vue-next'
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
      class="modal-backdrop confirm-backdrop"
      role="alertdialog"
      aria-modal="true"
      :aria-labelledby="'confirm-title'"
      :aria-describedby="'confirm-desc'"
      @click.self="handleCancel"
    >
      <div class="modal-card confirm-card">
        <div class="confirm-head">
          <div :class="['confirm-icon-box', state.danger ? 'danger' : 'info']">
            <AlertTriangle v-if="state.danger" :size="20" />
            <AlertCircle v-else :size="20" />
          </div>
          <button type="button" class="icon-button" aria-label="Tutup" @click="handleCancel">
            <X :size="18" />
          </button>
        </div>

        <div class="confirm-body">
          <h3 id="confirm-title" class="confirm-title">{{ state.title }}</h3>
          <p id="confirm-desc" class="confirm-desc">{{ state.message }}</p>
        </div>

        <div class="confirm-actions">
          <button
            type="button"
            class="button button-ghost"
            @click="handleCancel"
          >
            {{ state.cancelText }}
          </button>
          <button
            type="button"
            :class="['button', state.danger ? 'button-danger' : 'button-primary']"
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
.confirm-backdrop {
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(12, 16, 13, 0.65);
  backdrop-filter: blur(4px);
}
.confirm-card {
  max-width: 440px;
  width: 100%;
  border-radius: 16px;
  background: var(--paper, #ffffff);
  border: 1px solid var(--line);
  padding: 24px;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.confirm-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.confirm-icon-box {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
}
.confirm-icon-box.danger {
  background: var(--danger-soft, #fdedeb);
  color: var(--danger, #b14c3f);
}
.confirm-icon-box.info {
  background: var(--green-soft, #eaf2ec);
  color: var(--green, #286548);
}
.confirm-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.confirm-title {
  font-family: 'Manrope', sans-serif;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.4px;
  margin: 0;
  color: var(--ink);
}
.confirm-desc {
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--muted);
  margin: 0;
}
.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}
.button-danger {
  background: var(--danger, #b14c3f);
  color: #ffffff;
  border: 1px solid transparent;
}
.button-danger:hover {
  background: #98382c;
  transform: translateY(-1px);
}

/* Transitions */
.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 0.2s ease;
}
.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}
</style>
