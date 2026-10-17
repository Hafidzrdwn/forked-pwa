<script setup lang="ts">
import { Globe } from 'lucide-vue-next'
import { useI18n } from '../../i18n'

const { locale, setLocale } = useI18n()
</script>

<template>
  <div class="lang-switcher" role="group" aria-label="Pilih Bahasa / Choose Language">
    <Globe :size="14" class="lang-globe-icon" />
    <button
      type="button"
      :class="['lang-btn', { active: locale === 'id' }]"
      :aria-pressed="locale === 'id'"
      aria-label="Bahasa Indonesia"
      @click="setLocale('id')"
    >
      ID
    </button>
    <span class="lang-sep">/</span>
    <button
      type="button"
      :class="['lang-btn', { active: locale === 'en' }]"
      :aria-pressed="locale === 'en'"
      aria-label="English"
      @click="setLocale('en')"
    >
      EN
    </button>
  </div>
</template>

<style scoped>
.lang-switcher {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 700;
  user-select: none;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.lang-globe-icon {
  color: var(--muted);
  margin-right: 2px;
}
.lang-sep {
  color: var(--line-hover);
  font-size: 11px;
}
.lang-btn {
  border: 0;
  background: transparent;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s ease;
}
.lang-btn:hover {
  color: var(--ink);
  background: var(--bg-hover);
}
.lang-btn.active {
  color: var(--green);
  font-weight: 800;
  background: var(--green-soft);
}
</style>
