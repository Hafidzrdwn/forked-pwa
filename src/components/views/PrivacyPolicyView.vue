<script setup lang="ts">
import { ArrowLeft, Download } from '../common/AppIcons'
import { useI18n } from '../../i18n'
import PolicyShieldIllustration from '../common/PolicyShieldIllustration.vue'

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'export'): void
}>()

const { t } = useI18n()
</script>

<template>
  <section class="max-w-310 mx-auto px-4 md:px-8 py-7 md:py-10" aria-label="Privacy policy view">
    <!-- Top Action Bar: Clean Back Button -->
    <div class="mb-7">
      <button
        type="button"
        class="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-fg-muted hover:text-fg bg-surface hover:bg-canvas-subtle border border-border px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs group active:scale-95"
        @click="emit('back')"
      >
        <ArrowLeft :size="16" class="transition-transform group-hover:-translate-x-1" />
        {{ t.privacy.backBtn }}
      </button>
    </div>

    <!-- Hero Header: Clean Editorial Style -->
    <div class="relative bg-surface rounded-3xl border border-border p-6 md:p-10 mb-8 overflow-hidden shadow-2xs">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="max-w-2xl">
          <h1 class="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight text-fg mb-3">
            {{ t.privacy.title }}<span class="text-primary">.</span>
          </h1>

          <p class="text-sm md:text-base lg:text-lg text-fg-muted leading-relaxed">
            {{ t.privacy.subtitle }}
          </p>

          <p class="text-xs text-fg-subtle font-mono mt-3">
            {{ t.privacy.updatedAt }}
          </p>
        </div>

        <!-- Clean Thematic SVG Illustration -->
        <div class="shrink-0 self-center lg:self-auto w-40 sm:w-48 md:w-56">
          <PolicyShieldIllustration variant="privacy" />
        </div>
      </div>
    </div>

    <!-- Editorial Policy Document Content -->
    <div class="bg-surface rounded-3xl border border-border p-6 md:p-10 mb-8 shadow-2xs divide-y divide-border/60">
      <article
        v-for="(section, idx) in t.privacy.sections"
        :key="section.id"
        class="py-6 first:pt-0 last:pb-0"
      >
        <div class="flex items-baseline gap-3 mb-2">
          <span class="text-xs font-mono font-bold text-primary shrink-0">
            {{ String(idx + 1).padStart(2, '0') }}
          </span>
          <h2 class="font-display font-bold text-base md:text-lg text-fg">
            {{ section.title.replace(/^\d+\.\s*/, '') }}
          </h2>
        </div>
        <p class="text-sm md:text-[15px] leading-relaxed text-fg-muted pl-7 m-0">
          {{ section.content }}
        </p>
      </article>
    </div>

    <!-- Bottom Action Card with Buttons Below Text & SVG Watermark -->
    <div class="relative bg-surface rounded-3xl border border-border p-6 md:p-9 overflow-hidden shadow-2xs">
      <div class="relative z-10 max-w-xl">
        <h3 class="font-display font-bold text-lg md:text-xl text-fg m-0">
          {{ t.nav.dataPrivacyTitle }}
        </h3>
        <p class="text-sm md:text-[14.5px] text-fg-muted leading-relaxed mt-2 mb-6">
          {{ t.nav.dataPrivacyDesc }}
        </p>

        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary-dark transition-all cursor-pointer shadow-sm active:scale-95"
            @click="emit('export')"
          >
            <Download :size="16" />
            {{ t.nav.exportBackup }}
          </button>

          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs md:text-sm font-medium bg-canvas-subtle hover:bg-surface text-fg-muted hover:text-fg border border-border transition-all cursor-pointer active:scale-95"
            @click="emit('back')"
          >
            {{ t.privacy.backBtn }}
          </button>
        </div>
      </div>

      <!-- Watermark SVG illustration filling the empty right space -->
      <div class="absolute right-0 -bottom-8 w-60 sm:w-72 md:w-80 pointer-events-none opacity-20 dark:opacity-15 select-none hidden sm:block" aria-hidden="true">
        <PolicyShieldIllustration variant="privacy" />
      </div>
    </div>
  </section>
</template>
