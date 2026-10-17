<script setup lang="ts">
import { computed } from 'vue'
import { Menu } from 'lucide-vue-next'
import LanguageSwitcher from '../common/LanguageSwitcher.vue'
import ThemeToggle from '../common/ThemeToggle.vue'
import VisualAvatar from '../common/VisualAvatar.vue'
import { useI18n } from '../../i18n'

const props = defineProps<{
  currentNav: 'overview' | 'decisions' | 'journal'
}>()

const emit = defineEmits<{
  (e: 'toggle-mobile-menu'): void
}>()

const { t } = useI18n()

const pageTitle = computed(() => {
  if (props.currentNav === 'overview') return t.value.nav.overview
  if (props.currentNav === 'journal') return t.value.nav.journal
  return t.value.studio.title
})
</script>

<template>
  <header class="topbar">
    <div style="display: flex; align-items: center; gap: 12px;">
      <button
        type="button"
        class="mobile-nav-toggle"
        aria-label="Buka menu navigasi"
        @click="emit('toggle-mobile-menu')"
      >
        <Menu :size="20" />
      </button>

      <div class="breadcrumb">
        <span>{{ t.nav.workspace }}</span>
        <span class="crumb-slash">/</span>
        <strong>{{ pageTitle }}</strong>
      </div>
    </div>

    <div class="top-actions">
      <!-- Dark/Light Theme Toggle -->
      <ThemeToggle />

      <!-- Language Switcher -->
      <LanguageSwitcher />

      <!-- Data Privacy Status Pill -->
      <span class="privacy-pill">
        <span class="status-dot"></span>
        {{ t.nav.localBadge }}
      </span>

      <!-- 3D Fun Avatar -->
      <VisualAvatar :size="32" name="Decision Maker" />
    </div>
  </header>
</template>
