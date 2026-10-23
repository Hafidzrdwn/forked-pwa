<script setup lang="ts">
import { Sun, Moon } from './AppIcons'
import { useTheme } from '../../composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    id="theme-toggle-btn"
    type="button"
    class="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-border bg-surface text-fg hover:bg-canvas-subtle hover:border-border-hover transition-all cursor-pointer shadow-2xs"
    :title="theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'"
    :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="(e) => toggleTheme(e)"
  >
    <Sun v-if="theme === 'dark'" :size="16" class="text-amber" />
    <Moon v-else :size="16" class="text-primary" />
  </button>
</template>
