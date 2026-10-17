<script setup lang="ts">
import { Globe } from 'lucide-vue-next'
import { useI18n } from '../../i18n'

const { locale, setLocale } = useI18n()
</script>

<template>
  <div class="inline-flex items-center gap-1 bg-surface border border-border rounded-full px-2.5 py-1 text-xs font-bold select-none transition-colors" role="group" aria-label="Pilih Bahasa / Choose Language">
    <Globe :size="13" class="text-fg-subtle mr-0.5" />
    <button
      type="button"
      :class="[
        'px-1.5 py-0.5 rounded-md text-xs font-semibold cursor-pointer transition-colors',
        locale === 'id' ? 'bg-primary-soft text-primary font-bold' : 'text-fg-muted hover:text-fg hover:bg-canvas-subtle'
      ]"
      :aria-pressed="locale === 'id'"
      aria-label="Bahasa Indonesia"
      @click="setLocale('id')"
    >
      ID
    </button>
    <span class="text-fg-subtle text-[11px]">/</span>
    <button
      type="button"
      :class="[
        'px-1.5 py-0.5 rounded-md text-xs font-semibold cursor-pointer transition-colors',
        locale === 'en' ? 'bg-primary-soft text-primary font-bold' : 'text-fg-muted hover:text-fg hover:bg-canvas-subtle'
      ]"
      :aria-pressed="locale === 'en'"
      aria-label="English"
      @click="setLocale('en')"
    >
      EN
    </button>
  </div>
</template>
