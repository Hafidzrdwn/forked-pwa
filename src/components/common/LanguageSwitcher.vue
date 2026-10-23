<script setup lang="ts">
import { Globe } from './AppIcons'
import { useI18n } from '../../i18n'

const { locale, setLocale } = useI18n()
</script>

<template>
  <div class="inline-flex items-center gap-1.5 bg-surface border border-border rounded-full px-3 py-1.5 text-xs font-bold select-none transition-colors shadow-2xs" role="group" aria-label="Pilih Bahasa / Choose Language">
    <Globe :size="15" class="text-fg-muted shrink-0" stroke-width="2.3" />
    <button
      type="button"
      :class="[
        'px-2 py-0.5 rounded-md text-xs cursor-pointer transition-colors',
        locale === 'id' ? 'bg-primary-soft text-primary font-extrabold shadow-2xs' : 'text-fg-muted hover:text-fg hover:bg-canvas-subtle font-semibold'
      ]"
      :aria-pressed="locale === 'id'"
      aria-label="Bahasa Indonesia"
      @click="setLocale('id')"
    >
      ID
    </button>
    <span class="text-fg-muted/60 text-xs font-semibold">/</span>
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
