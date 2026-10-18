import { computed, ref } from 'vue'
import { id } from './id'
import { en } from './en'

export type Locale = 'id' | 'en'

const STORAGE_KEY = 'forked_locale'

function getInitialLocale(): Locale {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'id') return saved
  }
  return 'id'
}

const currentLocale = ref<Locale>(getInitialLocale())

export function setLocale(locale: Locale) {
  currentLocale.value = locale
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEY, locale)
  }
}

export function useI18n() {
  const messages = computed(() => {
    return currentLocale.value === 'en' ? en : id
  })

  function interpolate(template: string, params: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => {
      return params[key] !== undefined ? String(params[key]) : `{${key}}`
    })
  }

  return {
    locale: currentLocale,
    t: messages,
    setLocale,
    interpolate
  }
}
