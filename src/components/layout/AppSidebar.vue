<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  LayoutDashboard, GitBranch, BookOpen, ShieldAlert, Download, Copy, FileUp, X, Smartphone, Database, ArrowRight
} from '../common/AppIcons'
import BrandLogo from '../common/BrandLogo.vue'
import { useI18n } from '../../i18n'
import { usePwa } from '../../composables/usePwa'
import type { NavigationTab } from '../../types'

const { canInstall, isInstalled, promptInstall } = usePwa()

const props = withDefaults(
  defineProps<{
    currentNav: NavigationTab
    totalDecisions: number
    mobileOpen?: boolean
  }>(),
  {
    mobileOpen: false
  }
)

const emit = defineEmits<{
  (e: 'navigate', nav: NavigationTab): void
  (e: 'export'): void
  (e: 'copy-backup'): void
  (e: 'import-file', file: File): void
  (e: 'close-mobile-menu'): void
}>()

const { t, locale } = useI18n()
const fileInput = ref<HTMLInputElement | null>(null)
const backupState = ref<'idle' | 'hovered' | 'expanded' | 'closing'>('idle')
const lastOpenMode = ref<'hovered' | 'expanded'>('hovered')
const backupContainerRef = ref<HTMLElement | null>(null)
const isSuppressed = ref(false)
let hoverTimer: ReturnType<typeof setTimeout> | null = null
let closingTimer: ReturnType<typeof setTimeout> | null = null

function clearTimers() {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
  if (closingTimer) {
    clearTimeout(closingTimer)
    closingTimer = null
  }
}

function onButtonMouseEnter() {
  if (isSuppressed.value) return
  clearTimers()
  if (backupState.value === 'idle') {
    lastOpenMode.value = 'hovered'
    backupState.value = 'hovered'
  }
}

function onPopupMouseEnter() {
  clearTimers()
}

function onBackupMouseLeave() {
  // Reset suppression once user truly leaves the button/container area
  isSuppressed.value = false
  if (backupState.value === 'hovered') {
    clearTimers()
    hoverTimer = setTimeout(() => {
      closeBackup()
      hoverTimer = null
    }, 180)
  }
}

function toggleBackup() {
  clearTimers()
  if (backupState.value === 'expanded') {
    closeBackup()
  } else {
    isSuppressed.value = false
    lastOpenMode.value = 'expanded'
    backupState.value = 'expanded'
  }
}

function closeBackup() {
  clearTimers()
  // Suppress hover so resting cursor on button does not reopen it!
  isSuppressed.value = true
  backupState.value = 'closing'
  closingTimer = setTimeout(() => {
    backupState.value = 'idle'
    closingTimer = null
  }, 250)
}

function handleOutsideClick(e: MouseEvent) {
  if (
    (backupState.value === 'expanded' || backupState.value === 'hovered') &&
    backupContainerRef.value &&
    !backupContainerRef.value.contains(e.target as Node)
  ) {
    closeBackup()
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && backupState.value === 'expanded') {
    closeBackup()
  }
}

onMounted(() => {
  window.addEventListener('pointerdown', handleOutsideClick)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('pointerdown', handleOutsideClick)
  window.removeEventListener('keydown', handleKeydown)
  clearTimers()
})

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
      'fixed inset-y-0 left-0 w-63 p-5 bg-surface border-r border-border flex flex-col z-40 transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto overscroll-contain',
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
        class="w-9 h-9 rounded-xl border border-border bg-surface text-fg-muted hover:text-fg hover:bg-canvas-subtle grid place-items-center transition-colors cursor-pointer"
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
          'h-11 rounded-xl px-3 flex items-center gap-3 text-left text-[13.5px] font-medium w-full transition-all duration-150 cursor-pointer',
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
          'h-11 rounded-xl px-3 flex items-center gap-3 text-left text-[13.5px] font-medium w-full transition-all duration-150 cursor-pointer',
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
          'h-11 rounded-xl px-3 flex items-center gap-3 text-left text-[13.5px] font-medium w-full transition-all duration-150 cursor-pointer',
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

      <!-- Unified Morphing Backup Interaction -->
      <div
        ref="backupContainerRef"
        class="relative group/backup"
        @mouseleave="onBackupMouseLeave"
      >
        <!-- Floating Morph Container Shell (handles appear/disappear) -->
        <div
          v-if="backupState !== 'idle'"
          class="absolute bottom-[calc(100%+10px)] left-0 right-0 z-40 flex justify-center pointer-events-none"
        >
          <!-- Hitbox bridge for safe mouse travel between button and container -->
          <div
            class="absolute -bottom-4 left-0 right-0 h-5 z-10"
            :class="backupState === 'hovered' || backupState === 'expanded' ? 'pointer-events-auto' : 'pointer-events-none'"
            @mouseenter="onPopupMouseEnter"
          ></div>

          <!-- Shape-Morphing Inner Container -->
          <div
            :class="[
              'bg-surface/98 backdrop-blur-md border overflow-hidden relative',
              backupState === 'hovered' || backupState === 'expanded' ? 'pointer-events-auto' : 'pointer-events-none',
              backupState === 'closing' ? 'morph-closing' : ''
            ]"
            :style="{
              width: backupState === 'expanded' || (backupState === 'closing' && lastOpenMode === 'expanded') ? '100%' : '160px',
              borderRadius: backupState === 'expanded' || (backupState === 'closing' && lastOpenMode === 'expanded') ? '16px' : '999px',
              padding: backupState === 'expanded' || (backupState === 'closing' && lastOpenMode === 'expanded') ? '10px' : '8px 12px',
              boxShadow: backupState === 'expanded' || (backupState === 'closing' && lastOpenMode === 'expanded')
                ? '0 25px 50px -12px rgba(0,0,0,0.25)'
                : '0 10px 15px -3px rgba(0,0,0,0.1)',
              borderColor: backupState === 'expanded' || (backupState === 'closing' && lastOpenMode === 'expanded')
                ? 'var(--color-border)'
                : 'color-mix(in srgb, var(--color-border) 90%, transparent)',
              transition: backupState === 'closing'
                ? 'none'
                : 'width 380ms cubic-bezier(0.16, 1, 0.3, 1), border-radius 380ms cubic-bezier(0.16, 1, 0.3, 1), padding 300ms ease, box-shadow 380ms cubic-bezier(0.16, 1, 0.3, 1), border-color 300ms ease'
            }"
            @mouseenter="onPopupMouseEnter"
            @mouseleave="onBackupMouseLeave"
          >
            <!-- STATE: HOVERED - 3 Circle Speed-Dial Buttons -->
            <div
              v-if="backupState === 'hovered' || (backupState === 'closing' && lastOpenMode === 'hovered')"
              class="flex items-center gap-2.5 justify-center"
            >
              <button
                type="button"
                class="morph-circle-1 w-9 h-9 rounded-full bg-primary-soft text-primary border border-primary/30 shadow-xs grid place-items-center cursor-pointer transition-all duration-200 hover:scale-115 hover:-translate-y-0.5 hover:bg-primary hover:text-white active:scale-95"
                :title="t.nav.exportBackup"
                :aria-label="t.nav.exportBackup"
                @click.stop="emit('export'); closeBackup()"
              >
                <Download :size="16" stroke-width="2.4" />
              </button>
              <button
                type="button"
                class="morph-circle-2 w-9 h-9 rounded-full bg-blue-soft text-blue border border-blue/30 shadow-xs grid place-items-center cursor-pointer transition-all duration-200 hover:scale-115 hover:-translate-y-0.5 hover:bg-blue hover:text-white active:scale-95"
                :title="t.nav.copyBackup"
                :aria-label="t.nav.copyBackup"
                @click.stop="emit('copy-backup')"
              >
                <Copy :size="16" stroke-width="2.4" />
              </button>
              <button
                type="button"
                class="morph-circle-3 w-9 h-9 rounded-full bg-amber-soft text-amber border border-amber/30 shadow-xs grid place-items-center cursor-pointer transition-all duration-200 hover:scale-115 hover:-translate-y-0.5 hover:bg-amber hover:text-white active:scale-95"
                :title="t.nav.importBackup"
                :aria-label="t.nav.importBackup"
                @click.stop="fileInput?.click(); closeBackup()"
              >
                <FileUp :size="16" stroke-width="2.4" />
              </button>
            </div>

            <!-- STATE: EXPANDED - Full Dropdown Menu -->
            <div
              v-if="backupState === 'expanded' || (backupState === 'closing' && lastOpenMode === 'expanded')"
              class="flex flex-col gap-1.5"
            >
              <!-- Header -->
              <div class="morph-row-0 flex items-center justify-between px-1 pb-2 border-b border-border/60">
                <div class="min-w-0 pr-1">
                  <h4 class="font-display font-bold text-xs text-fg tracking-tight m-0">
                    {{ locale === 'id' ? 'Cadangan Data' : 'Data Backup' }}
                  </h4>
                  <p class="text-[10px] text-fg-muted m-0 mt-0.5 leading-tight">
                    {{ locale === 'id' ? 'Pilih aksi format .json' : 'Select .json action' }}
                  </p>
                </div>
                <button
                  type="button"
                  class="w-6.5 h-6.5 rounded-lg border border-border bg-canvas-subtle hover:bg-surface hover:text-fg text-fg-muted grid place-items-center transition-colors cursor-pointer shrink-0"
                  :aria-label="t.common.close"
                  @click="closeBackup"
                >
                  <X :size="13" stroke-width="2.4" />
                </button>
              </div>

              <!-- Action 1: Download -->
              <button
                type="button"
                class="morph-row-1 w-full flex items-center gap-2.5 p-2 rounded-xl bg-surface hover:bg-canvas-subtle border border-border/70 hover:border-primary/50 text-left transition-all duration-150 cursor-pointer group shadow-2xs active:scale-[0.98]"
                @click="emit('export'); closeBackup()"
              >
                <span class="w-8 h-8 rounded-lg bg-primary-soft text-primary border border-primary/25 grid place-items-center shrink-0 transition-transform group-hover:scale-105">
                  <Download :size="15" stroke-width="2.4" />
                </span>
                <div class="min-w-0 flex-1">
                  <strong class="block text-xs font-bold text-fg leading-tight">
                    {{ locale === 'id' ? 'Unduh File JSON' : 'Download JSON' }}
                  </strong>
                  <span class="block text-[10px] text-fg-muted leading-tight mt-0.5">
                    {{ locale === 'id' ? 'Simpan ke perangkat' : 'Save to your device' }}
                  </span>
                </div>
                <ArrowRight :size="12" stroke-width="2.4" class="text-fg-subtle group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              <!-- Action 2: Copy -->
              <button
                type="button"
                class="morph-row-2 w-full flex items-center gap-2.5 p-2 rounded-xl bg-surface hover:bg-canvas-subtle border border-border/70 hover:border-blue/50 text-left transition-all duration-150 cursor-pointer group shadow-2xs active:scale-[0.98]"
                @click="emit('copy-backup')"
              >
                <span class="w-8 h-8 rounded-lg bg-blue-soft text-blue border border-blue/25 grid place-items-center shrink-0 transition-transform group-hover:scale-105">
                  <Copy :size="15" stroke-width="2.4" />
                </span>
                <div class="min-w-0 flex-1">
                  <strong class="block text-xs font-bold text-fg leading-tight">
                    {{ locale === 'id' ? 'Salin Teks JSON' : 'Copy JSON Text' }}
                  </strong>
                  <span class="block text-[10px] text-fg-muted leading-tight mt-0.5">
                    {{ locale === 'id' ? 'Salin ke clipboard' : 'Copy to clipboard' }}
                  </span>
                </div>
                <ArrowRight :size="12" stroke-width="2.4" class="text-fg-subtle group-hover:text-blue group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              <!-- Action 3: Import -->
              <button
                type="button"
                class="morph-row-3 w-full flex items-center gap-2.5 p-2 rounded-xl bg-surface hover:bg-canvas-subtle border border-border/70 hover:border-amber/50 text-left transition-all duration-150 cursor-pointer group shadow-2xs active:scale-[0.98]"
                @click="fileInput?.click(); closeBackup()"
              >
                <span class="w-8 h-8 rounded-lg bg-amber-soft text-amber border border-amber/25 grid place-items-center shrink-0 transition-transform group-hover:scale-105">
                  <FileUp :size="15" stroke-width="2.4" />
                </span>
                <div class="min-w-0 flex-1">
                  <strong class="block text-xs font-bold text-fg leading-tight">
                    {{ locale === 'id' ? 'Buka File JSON' : 'Open JSON File' }}
                  </strong>
                  <span class="block text-[10px] text-fg-muted leading-tight mt-0.5">
                    {{ locale === 'id' ? 'Pulihkan data cadangan' : 'Restore from backup' }}
                  </span>
                </div>
                <ArrowRight :size="12" stroke-width="2.4" class="text-fg-subtle group-hover:text-amber group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            </div>
          </div>

          <!-- Arrow pointer (always rendered, opacity controlled by state) -->
          <span
            :class="[
              'absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface border-r border-b border-border rotate-45 pointer-events-none transition-opacity duration-300',
              backupState === 'expanded' || backupState === 'hovered' ? 'opacity-100' : 'opacity-0'
            ]"
          ></span>
        </div>

        <!-- Main Trigger Button -->
        <button
          id="manage-backup-btn"
          type="button"
          :class="[
            'h-11 w-full rounded-xl px-3 flex items-center justify-between text-[13.5px] font-medium border transition-all duration-200 cursor-pointer shadow-2xs',
            backupState === 'expanded'
              ? 'bg-primary-soft text-primary border-primary shadow-xs font-bold'
              : 'text-fg-muted bg-surface hover:bg-canvas-subtle hover:text-fg border-border group-hover/backup:border-primary/50 group-hover/backup:text-fg'
          ]"
          :aria-expanded="backupState === 'expanded'"
          @mouseenter="onButtonMouseEnter"
          @click="toggleBackup"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <Database :size="18" stroke-width="2.3" class="text-primary shrink-0 transition-transform duration-300 group-hover/backup:scale-110 group-hover/backup:rotate-6" />
            <span class="truncate">{{ t.nav.backupAction }}</span>
          </div>

          <span
            :class="[
              'text-xs px-2 py-0.5 rounded-full border transition-colors',
              backupState === 'expanded'
                ? 'bg-primary text-white border-primary font-bold'
                : 'bg-canvas-subtle border-border text-fg-subtle group-hover/backup:bg-primary-soft group-hover/backup:text-primary group-hover/backup:border-primary/25'
            ]"
          >
            JSON
          </span>
        </button>
      </div>

      <input
        ref="fileInput"
        class="sr-only"
        type="file"
        accept="application/json,.json"
        aria-label="Upload JSON backup"
        @change="handleFileChange"
      />

      <!-- Legal Links -->
      <div class="flex items-center gap-2 px-2 pt-2.5 text-[11px] text-fg-subtle">
        <button
          type="button"
          :class="[
            'hover:text-fg transition-colors cursor-pointer underline-offset-2',
            currentNav === 'privacy' ? 'text-primary font-bold underline' : ''
          ]"
          @click="emit('navigate', 'privacy'); emit('close-mobile-menu')"
        >
          {{ t.nav.privacyPolicy }}
        </button>
        <span>·</span>
        <button
          type="button"
          :class="[
            'hover:text-fg transition-colors cursor-pointer underline-offset-2',
            currentNav === 'terms' ? 'text-primary font-bold underline' : ''
          ]"
          @click="emit('navigate', 'terms'); emit('close-mobile-menu')"
        >
          {{ t.nav.termsOfUse }}
        </button>
      </div>

      <div class="text-[11px] tracking-wider text-fg-subtle px-2 pt-2 uppercase font-semibold">{{ t.nav.tagline }}</div>
    </div>
  </aside>
</template>

<style scoped>
@keyframes morphPop1 {
  0% {
    opacity: 0;
    transform: scale(0.25) translateY(12px);
  }
  65% {
    opacity: 1;
    transform: scale(1.18) translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes morphPop2 {
  0% {
    opacity: 0;
    transform: scale(0.25) translateY(12px);
  }
  65% {
    opacity: 1;
    transform: scale(1.18) translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes morphPop3 {
  0% {
    opacity: 0;
    transform: scale(0.25) translateY(12px);
  }
  65% {
    opacity: 1;
    transform: scale(1.18) translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.morph-circle-1 {
  animation: morphPop1 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) 0.02s both;
}
.morph-circle-2 {
  animation: morphPop2 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) 0.08s both;
}
.morph-circle-3 {
  animation: morphPop3 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) 0.14s both;
}

@keyframes rowEntrance {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.morph-row-0 {
  animation: rowEntrance 0.28s cubic-bezier(0.16, 1, 0.3, 1) 0.03s both;
}
.morph-row-1 {
  animation: rowEntrance 0.28s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both;
}
.morph-row-2 {
  animation: rowEntrance 0.28s cubic-bezier(0.16, 1, 0.3, 1) 0.13s both;
}
.morph-row-3 {
  animation: rowEntrance 0.28s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
}

@keyframes suckInAnim {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0px);
  }
  30% {
    opacity: 0.9;
    transform: scale(0.92, 0.85) translateY(4px);
  }
  100% {
    opacity: 0;
    transform: scale(0.35, 0.08) translateY(24px);
    filter: blur(2px);
  }
}

.morph-closing {
  animation: suckInAnim 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
  pointer-events: none !important;
}
</style>
