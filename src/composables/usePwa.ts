import { ref, onMounted } from 'vue'

const deferredPrompt = ref<any>(null)
const canInstall = ref(false)
const isInstalled = ref(false)
const isIos = ref(false)
const showIosGuide = ref(false)
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

    if (isIos.value) {
      canInstall.value = true
    }

    if (window.localStorage.getItem(DISMISS_KEY)) {
      bannerDismissed.value = true
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
    if (isIos.value) {
      showIosGuide.value = true
      return
    }

    if (!deferredPrompt.value) return

    try {
      deferredPrompt.value.prompt()
      const choice = await deferredPrompt.value.userChoice
      if (choice && choice.outcome === 'accepted') {
        isInstalled.value = true
        canInstall.value = false
      }
    } catch {
    } finally {
      deferredPrompt.value = null
    }
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
    showIosGuide,
    bannerDismissed,
    promptInstall,
    dismissBanner
  }
}
