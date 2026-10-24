<script setup lang="ts">
import { computed } from 'vue'
import { Menu } from '../common/AppIcons'
import LanguageSwitcher from '../common/LanguageSwitcher.vue'
import ThemeToggle from '../common/ThemeToggle.vue'
import { useI18n } from '../../i18n'
import type { NavigationTab } from '../../types'

const props = defineProps<{
  currentNav: NavigationTab
}>()

const emit = defineEmits<{
  (e: 'toggle-mobile-menu'): void
}>()

const { t } = useI18n()

const pageTitle = computed(() => {
  if (props.currentNav === 'overview') return t.value.nav.overview
  if (props.currentNav === 'journal') return t.value.nav.journal
  if (props.currentNav === 'privacy') return t.value.nav.privacyPolicy
  if (props.currentNav === 'terms') return t.value.nav.termsOfUse
  return t.value.studio.title
})
</script>

<template>
  <header class="h-15 md:h-17 border-b border-border flex items-center justify-between px-3 md:px-8 bg-surface sticky top-0 z-20 transition-colors">
    <div class="flex items-center gap-2.5 min-w-0">
      <button
        type="button"
        class="md:hidden p-2 rounded-xl text-fg hover:bg-canvas-subtle transition-colors cursor-pointer shrink-0"
        aria-label="Buka menu navigasi"
        @click="emit('toggle-mobile-menu')"
      >
        <Menu :size="19" />
      </button>

      <div class="flex items-center gap-2 text-xs md:text-[13px] text-fg-muted font-medium min-w-0">
        <span class="hidden sm:inline-block shrink-0">{{ t.nav.workspace }}</span>
        <span class="hidden sm:inline-block text-fg-subtle shrink-0">/</span>
        <strong class="font-bold text-fg truncate text-sm md:text-base">{{ pageTitle }}</strong>
      </div>
    </div>

    <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
      <ThemeToggle />
      <LanguageSwitcher />
    </div>
  </header>
</template>
