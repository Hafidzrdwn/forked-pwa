<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Check, ExternalLink } from './AppIcons'
import { useI18n } from '../../i18n'
import { useBrowserSupport } from '../../composables/useBrowserSupport'

const { t } = useI18n()
const { needsNotice, dismissNotice } = useBrowserSupport()
const copied = ref(false)

async function copyUrl() {
  try {
    const url = window.location.href
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url)
    } else {
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch {
    copied.value = true
  }
}
</script>

<template>
  <div
    v-if="needsNotice"
    class="fixed inset-0 z-50 bg-canvas flex items-center justify-center p-5 overflow-y-auto"
    role="alertdialog"
    aria-modal="true"
    :aria-label="t.unsupportedBrowser.title"
  >
    <div class="max-w-md w-full my-auto flex flex-col items-center text-center py-8 px-6 bg-surface border border-border rounded-3xl shadow-xl animate-in zoom-in-95 duration-200">
      <!-- Bespoke Handcrafted SVG Illustration -->
      <div class="w-24 h-24 mb-6 relative grid place-items-center">
        <svg
          class="w-24 h-24 text-primary"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <!-- Smartphone / in-app container -->
          <rect x="18" y="14" width="34" height="64" rx="7" class="text-border fill-surface" stroke="currentColor" />
          <line x1="30" y1="20" x2="40" y2="20" class="text-fg-subtle" />
          <circle cx="35" cy="71" r="2" class="text-fg-subtle" />
          
          <!-- In-app webview symbol inside phone -->
          <rect x="23" y="27" width="24" height="36" rx="3.5" class="fill-primary-soft/50 stroke-primary/30" />
          <line x1="27" y1="34" x2="39" y2="34" class="stroke-primary" />
          <line x1="27" y1="41" x2="43" y2="41" class="stroke-primary/60" />
          <line x1="27" y1="48" x2="35" y2="48" class="stroke-primary/40" />

          <!-- Dynamic branching curved arrow to external browser -->
          <path d="M42 45 C54 45, 58 35, 66 35" stroke="currentColor" stroke-dasharray="2 3" class="text-fg-subtle" />
          <polyline points="63 31 68 35 63 39" class="stroke-primary fill-none" />

          <!-- External browser window floating -->
          <rect x="52" y="24" width="36" height="28" rx="4.5" class="fill-surface stroke-primary" />
          <line x1="52" y1="32" x2="88" y2="32" class="stroke-border" />
          <circle cx="58" cy="28" r="1.2" class="fill-current text-primary" />
          <circle cx="63" cy="28" r="1.2" class="fill-current text-fg-subtle" />
          <circle cx="68" cy="28" r="1.2" class="fill-current text-fg-subtle" />
          <line x1="59" y1="40" x2="81" y2="40" class="stroke-fg-muted" stroke-width="1.5" />
          <line x1="59" y1="45" x2="74" y2="45" class="stroke-fg-subtle" stroke-width="1.5" />
        </svg>
      </div>

      <!-- Text Headings & Explanations -->
      <h2 class="font-display font-extrabold text-lg md:text-xl text-fg tracking-tight mb-2">
        {{ t.unsupportedBrowser.title }}
      </h2>
      <p class="text-xs md:text-sm text-fg-muted leading-relaxed mb-3">
        {{ t.unsupportedBrowser.subtitle }}
      </p>

      <div class="p-3 bg-canvas-subtle border border-border rounded-xl text-xs text-fg-muted leading-relaxed mb-6 w-full text-left">
        <p class="font-semibold text-fg mb-1">
          💡 {{ t.unsupportedBrowser.recommendation }}
        </p>
        <p class="text-[11.5px] text-fg-subtle m-0">
          {{ t.unsupportedBrowser.stepGuide }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-2.5 w-full">
        <button
          type="button"
          class="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white text-xs md:text-sm font-bold shadow-md hover:bg-primary-dark transition-all cursor-pointer"
          @click="copyUrl"
        >
          <Check v-if="copied" :size="16" />
          <Copy v-else :size="16" />
          <span>{{ copied ? t.unsupportedBrowser.copied : t.unsupportedBrowser.copyLink }}</span>
        </button>

        <button
          type="button"
          class="w-full py-2.5 text-xs text-fg-subtle hover:text-fg font-medium transition-colors cursor-pointer"
          @click="dismissNotice"
        >
          {{ t.unsupportedBrowser.continueAnyway }}
        </button>
      </div>
    </div>
  </div>
</template>
