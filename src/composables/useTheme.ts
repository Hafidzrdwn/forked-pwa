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

const currentTheme = ref<Theme>(getInitialTheme())

export function applyTheme(theme: Theme) {
  currentTheme.value = theme
  if (typeof window !== 'undefined') {
    if (window.localStorage) {
      window.localStorage.setItem(THEME_KEY, theme)
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#121713' : '#f8f8f5')
    }
  }
}

// Initial application
if (typeof window !== 'undefined') {
  applyTheme(currentTheme.value)
}

export function useTheme() {
  function toggleTheme() {
    applyTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme: currentTheme,
    toggleTheme,
    setTheme: applyTheme
  }
}
