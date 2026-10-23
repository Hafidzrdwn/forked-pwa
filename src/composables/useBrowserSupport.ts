import { computed, onMounted, ref } from 'vue'

const DISMISSED_KEY = 'forked_inapp_notice_dismissed'

const isInApp = ref(false)
const isLegacyBrowser = ref(false)
const isDismissed = ref(false)

export function useBrowserSupport() {
  onMounted(() => {
    if (typeof window === 'undefined') return

    // 1. Check session dismissal
    if (typeof window.sessionStorage !== 'undefined') {
      try {
        if (window.sessionStorage.getItem(DISMISSED_KEY) === 'true') {
          isDismissed.value = true
        }
      } catch {
      }
    }

    // 2. Detect in-app webviews (Instagram, Facebook, TikTok, Line, etc.)
    const ua = (navigator.userAgent || navigator.vendor || (window as any).opera || '').toLowerCase()
    const inAppPattern = /instagram|fban|fbav|tiktok|musical_ly|bytelocale|line\/|twitter|micromessenger/i
    isInApp.value = inAppPattern.test(ua)

    // 3. Detect legacy / missing required modern APIs (IndexedDB, Storage, Promise)
    const hasIndexedDb = typeof window.indexedDB !== 'undefined' && window.indexedDB !== null
    const hasLocalStorage = typeof window.localStorage !== 'undefined'
    const hasCrypto = typeof window.crypto !== 'undefined'

    isLegacyBrowser.value = !hasIndexedDb || !hasLocalStorage || !hasCrypto
  })

  const needsNotice = computed(() => {
    return (isInApp.value || isLegacyBrowser.value) && !isDismissed.value
  })

  function dismissNotice() {
    isDismissed.value = true
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(DISMISSED_KEY, 'true')
      }
    } catch {
    }
  }

  return {
    isInApp,
    isLegacyBrowser,
    needsNotice,
    dismissNotice
  }
}
