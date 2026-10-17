<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '../../composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="theme-toggle-btn"
    :title="theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'"
    :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleTheme"
  >
    <Sun v-if="theme === 'dark'" :size="16" class="sun-icon" />
    <Moon v-else :size="16" class="moon-icon" />
  </button>
</template>

<style scoped>
.theme-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--ink);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.theme-toggle-btn:hover {
  background: var(--bg-hover);
  border-color: var(--line-hover);
  transform: translateY(-1px);
}
.sun-icon {
  color: #e5a43b;
}
.moon-icon {
  color: #4b6b55;
}
</style>
