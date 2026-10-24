<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Compass, GitBranch, LayoutDashboard } from '../common/AppIcons'
import BrandLogo from '../common/BrandLogo.vue'
import ThemeToggle from '../common/ThemeToggle.vue'
import LanguageSwitcher from '../common/LanguageSwitcher.vue'
import { useI18n } from '../../i18n'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen w-full flex flex-col justify-between bg-canvas text-fg transition-colors duration-200">
    <!-- Standalone Header -->
    <header class="h-16 md:h-18 px-4 md:px-8 border-b border-border/70 flex items-center justify-between bg-surface/80 backdrop-blur-md sticky top-0 z-10">
      <RouterLink to="/" class="flex items-center gap-2.5 transition-opacity hover:opacity-90" aria-label="Forked Home">
        <BrandLogo :size="32" :subtitle="t.nav.brandSubtitle" />
      </RouterLink>

      <div class="flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </header>

    <!-- Main Standalone Centered 404 Hero -->
    <main class="flex-1 flex items-center justify-center px-4 py-12 md:py-16">
      <div class="max-w-md w-full text-center">
        <div class="relative inline-flex items-center justify-center mb-6">
          <div class="w-20 h-20 rounded-3xl bg-primary-soft text-primary border border-primary/25 flex items-center justify-center shadow-lg shadow-primary/10 transition-transform duration-300 hover:scale-105">
            <Compass :size="38" stroke-width="2" class="animate-pulse" />
          </div>
          <span class="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-surface border border-border text-fg-subtle shadow-xs">
            404
          </span>
        </div>

        <h1 class="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight mb-3">
          {{ t.notFound?.title || 'Halaman Tidak Ditemukan' }}
        </h1>

        <p class="text-sm sm:text-base text-fg-muted leading-relaxed mb-8">
          {{ t.notFound?.desc || 'Tautan yang kamu tuju mungkin telah dipindahkan, dihapus, atau belum pernah dibuat di Forked.' }}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <RouterLink
            to="/"
            class="w-full sm:w-auto h-11 px-5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <LayoutDashboard :size="16" />
            {{ t.notFound?.backOverview || 'Kembali ke Ringkasan' }}
          </RouterLink>

          <RouterLink
            to="/decisions"
            class="w-full sm:w-auto h-11 px-5 rounded-xl border border-border bg-surface text-fg font-semibold text-sm hover:border-primary/50 hover:bg-canvas-subtle transition-all duration-150 flex items-center justify-center gap-2"
          >
            <GitBranch :size="16" class="text-primary" />
            {{ t.notFound?.backStudio || 'Buka Studio Keputusan' }}
          </RouterLink>
        </div>
      </div>
    </main>

    <!-- Minimalist Footer -->
    <footer class="py-5 px-4 text-center text-xs text-fg-subtle border-t border-border/50">
      <span>Forked — Personal Decision Simulator</span>
    </footer>
  </div>
</template>
