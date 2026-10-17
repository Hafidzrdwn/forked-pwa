<script setup lang="ts">
import { Globe } from 'lucide-vue-next'
import { useI18n } from '../../i18n'

const { locale, setLocale } = useI18n()
</script>

<template>
  <div class="lang-switcher" role="group" aria-label="Pilih Bahasa / Choose Language">
    <Globe :size="13" class="lang-globe-icon" />
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
  gap: 5px;
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  user-select: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}
.lang-globe-icon {
  color: #727a6f;
  margin-right: 1px;
}
.lang-sep {
  color: #ccd2ca;
  font-size: 10px;
}
.lang-btn {
  border: 0;
  background: transparent;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #838b81;
  cursor: pointer;
  transition: all 0.15s ease;
}
.lang-btn:hover {
  color: var(--ink);
}
.lang-btn.active {
  color: var(--green-dark);
  font-weight: 800;
  background: #edf4ed;
}
</style>
