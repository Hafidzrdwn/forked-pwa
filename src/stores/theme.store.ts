import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'forked_theme'

function getInitialTheme(): Theme {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = window.localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') return saved
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
  }
  return 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(getInitialTheme())

  function applyTheme(newTheme: Theme) {
    theme.value = newTheme
    if (typeof window !== 'undefined') {
      if (window.localStorage) {
        window.localStorage.setItem(THEME_KEY, newTheme)
      }
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) {
        meta.setAttribute('content', newTheme === 'dark' ? '#111612' : '#f8f8f5')
      }
    }
  }

  function toggleTheme() {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  // Initial apply
  if (typeof window !== 'undefined') {
    applyTheme(theme.value)
  }

  return {
    theme,
    toggleTheme,
    setTheme: applyTheme
  }
})
