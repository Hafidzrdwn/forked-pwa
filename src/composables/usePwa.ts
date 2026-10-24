import { ref, onMounted } from 'vue'

const deferredPrompt = ref<any>(null)
const canInstall = ref(false)
const isInstalled = ref(false)
const isIos = ref(false)
const isMobile = ref(false)
const showGuide = ref(false)
const bannerDismissed = ref(false)

const DISMISS_KEY = 'forked_pwa_dismissed'

export function usePwa() {
  onMounted(() => {
    if (typeof window === 'undefined') return

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    if (isStandalone) {
      isInstalled.value = true
      canInstall.value = false
      return
    }

    const ua = window.navigator.userAgent.toLowerCase()
    isIos.value = /iphone|ipad|ipod/.test(ua) && !(window.navigator as any).standalone
    isMobile.value =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua) ||
      ('ontouchstart' in window && window.innerWidth <= 820)

    // Check if dismissed previously
    if (window.localStorage.getItem(DISMISS_KEY)) {
      bannerDismissed.value = true
    }

    // Always enable install action for mobile browsers (including Chrome Incognito, Safari iOS, etc.)
    if (isMobile.value || isIos.value) {
      canInstall.value = true
    }

    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e
      canInstall.value = true
    })

    window.addEventListener('appinstalled', () => {
      isInstalled.value = true
      canInstall.value = false
      deferredPrompt.value = null
    })
  })

  async function promptInstall() {
    if (deferredPrompt.value) {
      try {
        deferredPrompt.value.prompt()
        const choice = await deferredPrompt.value.userChoice
        if (choice && choice.outcome === 'accepted') {
          isInstalled.value = true
          canInstall.value = false
          deferredPrompt.value = null
          return
        }
      } catch {
        // Fallback to visual install guide if prompt execution errors
      }
    }

    // Show step-by-step install guide modal when native prompt is unavailable
    // (e.g. Chrome Incognito mode, iOS Safari, or browser restriction)
    showGuide.value = true
  }

  function dismissBanner() {
    bannerDismissed.value = true
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(DISMISS_KEY, 'true')
    }
  }

  return {
    canInstall,
    isInstalled,
    isIos,
    isMobile,
    showGuide,
    showIosGuide: showGuide, // backward compatibility
    bannerDismissed,
    promptInstall,
    dismissBanner
  }
}
