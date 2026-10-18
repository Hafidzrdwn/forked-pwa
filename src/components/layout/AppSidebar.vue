<script setup lang="ts">
import { ref } from 'vue'
import {
  LayoutDashboard, GitBranch, BookOpen, ShieldAlert, Download, Copy, FileUp, X, Smartphone
} from 'lucide-vue-next'
import BrandLogo from '../common/BrandLogo.vue'
import { useI18n } from '../../i18n'
import { usePwa } from '../../composables/usePwa'

const { canInstall, isInstalled, promptInstall } = usePwa()

const props = withDefaults(
  defineProps<{
    currentNav: 'overview' | 'decisions' | 'journal'
    totalDecisions: number
    mobileOpen?: boolean
  }>(),
  {
    mobileOpen: false
  }
)

const emit = defineEmits<{
  (e: 'navigate', nav: 'overview' | 'decisions' | 'journal'): void
  (e: 'export'): void
  (e: 'copy-backup'): void
  (e: 'import-file', file: File): void
  (e: 'close-mobile-menu'): void
}>()

const { t } = useI18n()
const fileInput = ref<HTMLInputElement | null>(null)

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('import-file', file)
  }
  target.value = ''
}

function handleNav(nav: 'overview' | 'decisions' | 'journal') {
  emit('navigate', nav)
  emit('close-mobile-menu')
}
</script>

<template>
  <div
    v-if="props.mobileOpen"
    class="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 md:hidden"
    @click="emit('close-mobile-menu')"
  />

  <aside
    :class="[
      'fixed inset-y-0 left-0 w-[252px] p-5 bg-surface border-r border-border flex flex-col z-40 transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto overscroll-contain',
      props.mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
    ]"
    aria-label="Sidebar navigation"
  >
    <div class="flex items-center justify-between pb-6 px-1 shrink-0">
      <a class="flex items-center gap-2.5" href="#" @click.prevent="handleNav('overview')">
        <BrandLogo :size="36" :subtitle="t.nav.brandSubtitle" />
      </a>
      <button
        v-if="props.mobileOpen"
        type="button"
        class="w-9 h-9 rounded-xl border border-border bg-surface text-fg-muted hover:text-fg hover:bg-canvas-subtle grid place-items-center transition-colors"
        aria-label="Tutup menu"
        @click="emit('close-mobile-menu')"
      >
        <X :size="18" />
      </button>
    </div>

    <div class="px-3 pb-3 text-[11px] tracking-wider font-bold text-fg-subtle uppercase shrink-0">{{ t.nav.workspace }}</div>

    <nav class="grid gap-1.5 shrink-0">
      <button
        type="button"
        :class="[
          'h-11 rounded-xl px-3 flex items-center gap-3 text-left text-[13.5px] font-medium w-full transition-all duration-150',
          currentNav === 'overview'
            ? 'bg-primary-soft text-primary font-bold shadow-xs'
            : 'text-fg-muted hover:bg-canvas-subtle hover:text-fg'
        ]"
        :aria-current="currentNav === 'overview' ? 'page' : undefined"
        @click="handleNav('overview')"
      >
        <LayoutDashboard :size="18" /> {{ t.nav.overview }}
      </button>

      <button
        type="button"
        :class="[
          'h-11 rounded-xl px-3 flex items-center gap-3 text-left text-[13.5px] font-medium w-full transition-all duration-150',
          currentNav === 'decisions'
            ? 'bg-primary-soft text-primary font-bold shadow-xs'
            : 'text-fg-muted hover:bg-canvas-subtle hover:text-fg'
        ]"
        :aria-current="currentNav === 'decisions' ? 'page' : undefined"
        @click="handleNav('decisions')"
      >
        <GitBranch :size="18" /> {{ t.nav.myDecisions }}
        <span class="ml-auto bg-surface border border-border rounded-md px-2 py-0.5 text-xs text-fg-subtle font-normal">{{ totalDecisions }}</span>
      </button>

      <button
        type="button"
        :class="[
          'h-11 rounded-xl px-3 flex items-center gap-3 text-left text-[13.5px] font-medium w-full transition-all duration-150',
          currentNav === 'journal'
            ? 'bg-primary-soft text-primary font-bold shadow-xs'
            : 'text-fg-muted hover:bg-canvas-subtle hover:text-fg'
        ]"
        :aria-current="currentNav === 'journal' ? 'page' : undefined"
        @click="handleNav('journal')"
      >
        <BookOpen :size="18" /> {{ t.nav.journal }}
      </button>
    </nav>

    <div class="mt-auto pt-4 flex flex-col gap-1.5 shrink-0">
      <div class="flex gap-3 bg-canvas-subtle border border-border rounded-xl p-3.5 mb-2">
        <span class="w-8 h-8 rounded-lg bg-primary-soft text-primary grid place-items-center shrink-0">
          <ShieldAlert :size="17" />
        </span>
        <div>
          <strong class="text-xs font-bold block mb-1 text-fg">{{ t.nav.dataPrivacyTitle }}</strong>
          <p class="text-[11.5px] leading-relaxed text-fg-muted m-0">{{ t.nav.dataPrivacyDesc }}</p>
        </div>
      </div>

      <button
        v-if="canInstall && !isInstalled"
        type="button"
        class="h-10 rounded-xl px-3 flex items-center gap-3 text-left text-[13.5px] font-semibold text-primary bg-primary-soft hover:bg-primary/20 transition-colors cursor-pointer"
        @click="promptInstall"
      >
        <Smartphone :size="18" /> {{ t.pwa.installBtn }}
      </button>

      <button
        type="button"
        class="h-10 rounded-xl px-3 flex items-center gap-3 text-left text-[13.5px] font-medium text-fg-muted hover:bg-canvas-subtle hover:text-fg transition-colors cursor-pointer"
        @click="emit('export')"
      >
        <Download :size="18" /> {{ t.nav.exportBackup }}
      </button>

      <button
        type="button"
        class="h-10 rounded-xl px-3 flex items-center gap-3 text-left text-[13.5px] font-medium text-fg-muted hover:bg-canvas-subtle hover:text-fg transition-colors cursor-pointer"
        @click="emit('copy-backup')"
      >
        <Copy :size="18" /> {{ t.nav.copyBackup }}
      </button>

      <button
        type="button"
        class="h-10 rounded-xl px-3 flex items-center gap-3 text-left text-[13.5px] font-medium text-fg-muted hover:bg-canvas-subtle hover:text-fg transition-colors"
        @click="fileInput?.click()"
      >
        <FileUp :size="18" /> {{ t.nav.importBackup }}
      </button>

      <input
        ref="fileInput"
        class="sr-only"
        type="file"
        accept="application/json,.json"
        aria-label="Upload JSON backup"
        @change="handleFileChange"
      />

      <div class="text-[11px] tracking-wider text-fg-subtle px-2 pt-3 uppercase font-semibold">{{ t.nav.tagline }}</div>
    </div>
  </aside>
</template>
