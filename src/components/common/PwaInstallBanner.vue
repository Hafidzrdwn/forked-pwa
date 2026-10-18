<script setup lang="ts">
import { Download, X, Share2, Smartphone } from 'lucide-vue-next'
import { usePwa } from '../../composables/usePwa'
import { useI18n } from '../../i18n'

const {
  canInstall,
  isInstalled,
  showIosGuide,
  bannerDismissed,
  promptInstall,
  dismissBanner
} = usePwa()

const { t } = useI18n()
</script>

<template>
  <aside
    v-if="canInstall && !isInstalled && !bannerDismissed"
    class="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 bg-surface border border-border rounded-2xl p-4 shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
    role="region"
    aria-label="PWA install prompt"
  >
    <div class="flex items-start gap-3">
      <div class="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
        <Smartphone :size="20" />
      </div>

      <div class="flex-1 min-w-0 pr-6">
        <h4 class="font-display font-bold text-sm text-fg leading-tight">
          {{ t.pwa.installBannerTitle }}
        </h4>
        <p class="text-xs text-fg-muted mt-1 leading-normal">
          {{ t.pwa.installBannerDesc }}
        </p>

        <div class="flex items-center gap-2 mt-3">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-dark transition-colors cursor-pointer"
            @click="promptInstall"
          >
            <Download :size="14" />
            {{ t.pwa.installBtn }}
          </button>

          <button
            type="button"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold text-fg-muted hover:text-fg hover:bg-canvas-subtle transition-colors cursor-pointer"
            @click="dismissBanner"
          >
            {{ t.pwa.installDismiss }}
          </button>
        </div>
      </div>

      <button
        type="button"
        class="absolute top-3 right-3 p-1.5 rounded-lg text-fg-subtle hover:text-fg hover:bg-canvas-subtle transition-colors cursor-pointer"
        :aria-label="t.common.close"
        @click="dismissBanner"
      >
        <X :size="16" />
      </button>
    </div>
  </aside>

  <div
    v-if="showIosGuide"
    class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
    @click.self="showIosGuide = false"
  >
    <div
      class="bg-surface border border-border rounded-2xl max-w-sm w-full p-5 shadow-2xl flex flex-col gap-4 text-center animate-in zoom-in-95 duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div class="w-12 h-12 rounded-2xl bg-primary-soft text-primary mx-auto flex items-center justify-center">
        <Share2 :size="24" />
      </div>

      <div>
        <h3 class="font-display font-bold text-base text-fg">
          {{ t.pwa.iosTitle }}
        </h3>
        <p class="text-xs text-fg-muted mt-2 leading-relaxed">
          {{ t.pwa.iosInstruction }}
        </p>
      </div>

      <button
        type="button"
        class="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors cursor-pointer"
        @click="showIosGuide = false"
      >
        {{ t.common.close }}
      </button>
    </div>
  </div>
</template>
