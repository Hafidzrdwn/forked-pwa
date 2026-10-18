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
  <header class="h-[68px] border-b border-border flex items-center justify-between px-4 md:px-8 bg-surface sticky top-0 z-20 transition-colors">
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="md:hidden p-2 rounded-lg text-fg hover:bg-canvas-subtle transition-colors cursor-pointer"
        aria-label="Buka menu navigasi"
        @click="emit('toggle-mobile-menu')"
      >
        <Menu :size="20" />
      </button>

      <div class="flex items-center gap-2 text-[13px] text-fg-muted font-medium">
        <span>{{ t.nav.workspace }}</span>
        <span class="text-fg-subtle">/</span>
        <strong class="font-bold text-fg">{{ pageTitle }}</strong>
      </div>
    </div>

    <div class="flex items-center gap-2.5">
      <ThemeToggle />
      <LanguageSwitcher />
      <span class="hidden sm:flex items-center gap-1.5 bg-surface border border-border rounded-full px-3 py-1.5 text-xs font-semibold text-fg-muted shadow-2xs">
        <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
        {{ t.nav.localBadge }}
      </span>
      <VisualAvatar :size="32" name="Decision Maker" />
    </div>
  </header>
</template>
