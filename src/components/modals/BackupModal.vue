<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import {
  Database, Download, Copy, FileUp, X, ShieldAlert
} from '../common/AppIcons'
import { useI18n } from '../../i18n'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'export'): void
  (e: 'copy-backup'): void
  (e: 'import-file', file: File): void
}>()

const { t } = useI18n()
const fileInput = ref<HTMLInputElement | null>(null)

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('import-file', file)
    emit('close')
  }
  target.value = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      :aria-label="t.backupModal.title"
      @click.self="emit('close')"
    >
    <div class="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-200">
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0">
            <Database :size="20" />
          </div>
          <div>
            <h3 class="font-display font-extrabold text-base md:text-lg text-fg tracking-tight">
              {{ t.backupModal.title }}
            </h3>
            <p class="text-xs text-fg-muted mt-0.5 leading-relaxed">
              {{ t.backupModal.subtitle }}
            </p>
          </div>
        </div>

        <button
          type="button"
          class="p-2 rounded-xl text-fg-muted hover:text-fg hover:bg-canvas-subtle transition-colors cursor-pointer shrink-0"
          :aria-label="t.common.close"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-canvas-subtle border border-border text-fg-subtle text-xs">
        <ShieldAlert :size="15" class="text-primary shrink-0" />
        <span class="leading-normal">{{ t.nav.dataPrivacyDesc }}</span>
      </div>

      <div class="grid gap-3">
        <!-- 1. Download file -->
        <div class="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-surface hover:border-primary/50 transition-colors">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-lg bg-primary-soft text-primary grid place-items-center shrink-0">
              <Download :size="17" />
            </div>
            <div class="min-w-0">
              <strong class="text-xs md:text-sm font-bold text-fg block truncate">
                {{ t.backupModal.exportTitle }}
              </strong>
              <p class="text-[11.5px] text-fg-muted m-0 truncate">
                {{ t.backupModal.exportDesc }}
              </p>
            </div>
          </div>
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all cursor-pointer whitespace-nowrap shadow-2xs shrink-0"
            @click="emit('export'); emit('close')"
          >
            {{ t.backupModal.exportBtn }}
          </button>
        </div>

        <!-- 2. Copy to clipboard -->
        <div class="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-surface hover:border-primary/50 transition-colors">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-lg bg-canvas-subtle text-fg grid place-items-center shrink-0">
              <Copy :size="17" />
            </div>
            <div class="min-w-0">
              <strong class="text-xs md:text-sm font-bold text-fg block truncate">
                {{ t.backupModal.copyTitle }}
              </strong>
              <p class="text-[11.5px] text-fg-muted m-0 truncate">
                {{ t.backupModal.copyDesc }}
              </p>
            </div>
          </div>
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-xl border border-border bg-canvas-subtle hover:bg-surface hover:border-primary text-fg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs shrink-0"
            @click="emit('copy-backup'); emit('close')"
          >
            {{ t.backupModal.copyBtn }}
          </button>
        </div>

        <!-- 3. Restore file -->
        <div class="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-surface hover:border-primary/50 transition-colors">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-lg bg-canvas-subtle text-fg grid place-items-center shrink-0">
              <FileUp :size="17" />
            </div>
            <div class="min-w-0">
              <strong class="text-xs md:text-sm font-bold text-fg block truncate">
                {{ t.backupModal.importTitle }}
              </strong>
              <p class="text-[11.5px] text-fg-muted m-0 truncate">
                {{ t.backupModal.importDesc }}
              </p>
            </div>
          </div>
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-xl border border-border bg-canvas-subtle hover:bg-surface hover:border-primary text-fg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs shrink-0"
            @click="fileInput?.click()"
          >
            {{ t.backupModal.importBtn }}
          </button>
        </div>
      </div>

      <input
        ref="fileInput"
        class="sr-only"
        type="file"
        accept="application/json,.json"
        aria-label="Upload JSON backup"
        @change="handleFileChange"
      />

      <div class="flex justify-end pt-2 border-t border-border/40">
        <button
          type="button"
          class="px-4 py-2 rounded-xl text-xs font-semibold text-fg-muted hover:text-fg hover:bg-canvas-subtle transition-colors cursor-pointer"
          @click="emit('close')"
        >
          {{ t.common.close }}
        </button>
      </div>
    </div>
  </div>
</Teleport>
</template>
