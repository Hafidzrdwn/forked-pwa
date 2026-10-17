<script setup lang="ts">
import { ref } from 'vue'
import {
  LayoutDashboard, GitBranch, BookOpen, ShieldAlert, Download, FileUp
} from 'lucide-vue-next'
import BrandLogo from '../common/BrandLogo.vue'
import { useI18n } from '../../i18n'

const props = defineProps<{
  currentNav: 'overview' | 'decisions' | 'journal'
  totalDecisions: number
}>()

const emit = defineEmits<{
  (e: 'navigate', nav: 'overview' | 'decisions' | 'journal'): void
  (e: 'export'): void
  (e: 'import-file', file: File): void
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
</script>

<template>
  <aside class="sidebar" aria-label="Sidebar navigation">
    <a class="brand" href="#" @click.prevent="emit('navigate', 'overview')">
      <BrandLogo :size="36" :subtitle="t.nav.brandSubtitle" />
    </a>

    <div class="workspace-label">{{ t.nav.workspace }}</div>

    <nav class="nav-list">
      <button
        type="button"
        :class="['nav-item', { active: currentNav === 'overview' }]"
        :aria-current="currentNav === 'overview' ? 'page' : undefined"
        @click="emit('navigate', 'overview')"
      >
        <LayoutDashboard :size="18" /> {{ t.nav.overview }}
      </button>

      <button
        type="button"
        :class="['nav-item', { active: currentNav === 'decisions' }]"
        :aria-current="currentNav === 'decisions' ? 'page' : undefined"
        @click="emit('navigate', 'decisions')"
      >
        <GitBranch :size="18" /> {{ t.nav.myDecisions }}
        <span class="nav-count">{{ totalDecisions }}</span>
      </button>

      <button
        type="button"
        :class="['nav-item', { active: currentNav === 'journal' }]"
        :aria-current="currentNav === 'journal' ? 'page' : undefined"
        @click="emit('navigate', 'journal')"
      >
        <BookOpen :size="18" /> {{ t.nav.journal }}
      </button>
    </nav>

    <div class="sidebar-bottom">
      <div class="local-card">
        <span class="local-icon"><ShieldAlert :size="17" /></span>
        <div>
          <strong>{{ t.nav.dataPrivacyTitle }}</strong>
          <p>{{ t.nav.dataPrivacyDesc }}</p>
        </div>
      </div>

      <button type="button" class="nav-item" @click="emit('export')">
        <Download :size="18" /> {{ t.nav.exportBackup }}
      </button>

      <button type="button" class="nav-item" @click="fileInput?.click()">
        <FileUp :size="18" /> {{ t.nav.importBackup }}
      </button>

      <input
        ref="fileInput"
        class="visually-hidden"
        type="file"
        accept="application/json,.json"
        aria-label="Upload JSON backup"
        @change="handleFileChange"
      />

      <div class="sidebar-foot">{{ t.nav.tagline }}</div>
    </div>
  </aside>
</template>
