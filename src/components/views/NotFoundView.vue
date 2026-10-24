<script setup lang="ts">
import { Compass, GitBranch, LayoutDashboard } from '../common/AppIcons'
import { useI18n } from '../../i18n'

const emit = defineEmits<{
  (e: 'navigate', tab: 'overview' | 'decisions'): void
}>()

const { t } = useI18n()
</script>

<template>
  <section class="max-w-240 mx-auto px-4 md:px-8 py-16 md:py-24 text-center" aria-label="Page Not Found">
    <div class="relative inline-flex items-center justify-center mb-6">
      <div class="w-20 h-20 rounded-3xl bg-primary-soft text-primary border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10 transition-transform duration-300 hover:scale-105">
        <Compass :size="40" stroke-width="2" class="animate-pulse" />
      </div>
      <span class="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-surface border border-border text-fg-subtle shadow-xs">
        404
      </span>
    </div>

    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-canvas-subtle border border-border text-fg-muted mb-4">
      <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
      {{ t.notFound?.badge || 'Galat 404' }}
    </div>

    <h1 class="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight mb-3">
      {{ t.notFound?.title || 'Halaman Tidak Ditemukan' }}
    </h1>

    <p class="max-w-md mx-auto text-sm sm:text-base text-fg-muted leading-relaxed mb-8">
      {{ t.notFound?.desc || 'Tautan yang kamu tuju mungkin telah dipindahkan, dihapus, atau belum pernah dibuat di Forked.' }}
    </p>

    <div class="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        class="h-11 px-5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
        @click="emit('navigate', 'overview')"
      >
        <LayoutDashboard :size="16" />
        {{ t.notFound?.backOverview || 'Kembali ke Ringkasan' }}
      </button>

      <button
        type="button"
        class="h-11 px-5 rounded-xl border border-border bg-surface text-fg font-semibold text-sm hover:border-primary/50 hover:bg-canvas-subtle transition-all duration-150 cursor-pointer flex items-center gap-2"
        @click="emit('navigate', 'decisions')"
      >
        <GitBranch :size="16" class="text-primary" />
        {{ t.notFound?.backStudio || 'Buka Studio Keputusan' }}
      </button>
    </div>
  </section>
</template>
