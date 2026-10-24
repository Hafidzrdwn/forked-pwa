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
        document.documentElement.style.colorScheme = 'dark'
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.style.colorScheme = 'light'
      }
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) {
        meta.setAttribute('content', newTheme === 'dark' ? '#111612' : '#f8f8f5')
      }
    }
  }

  function toggleTheme(event?: MouseEvent) {
    const nextTheme: Theme = theme.value === 'dark' ? 'light' : 'dark'

    const doc = typeof document !== 'undefined' ? (document as any) : null
    const hasTransition = doc && typeof doc.startViewTransition === 'function'
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!hasTransition || prefersReducedMotion) {
      applyTheme(nextTheme)
      return
    }

    let x = window.innerWidth - 80
    let y = 34

    if (event) {
      const target = event.currentTarget as HTMLElement | null
      if (target && typeof target.getBoundingClientRect === 'function') {
        const rect = target.getBoundingClientRect()
        x = rect.left + rect.width / 2
        y = rect.top + rect.height / 2
      } else if (event.clientX || event.clientY) {
        x = event.clientX
        y = event.clientY
      }
    } else {
      const toggleBtn = doc.querySelector('button[aria-label*="mode"]')
      if (toggleBtn) {
        const rect = toggleBtn.getBoundingClientRect()
        x = rect.left + rect.width / 2
        y = rect.top + rect.height / 2
      }
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    doc.documentElement.style.setProperty('--ripple-x', `${x}px`)
    doc.documentElement.style.setProperty('--ripple-y', `${y}px`)
    doc.documentElement.style.setProperty('--ripple-radius', `${endRadius}px`)
    doc.documentElement.classList.add('theme-transitioning')

    const transition = doc.startViewTransition(() => {
      applyTheme(nextTheme)
    })

    transition.ready
      .then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ]

        doc.documentElement.animate(
          {
            clipPath
          },
          {
            duration: 520,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        )
      })
      .catch(() => {})

    transition.finished
      ?.catch(() => {})
      .finally(() => {
        doc.documentElement.classList.remove('theme-transitioning')
      })
  }

  if (typeof window !== 'undefined') {
    applyTheme(theme.value)
  }

  return {
    theme,
    toggleTheme,
    setTheme: applyTheme
  }
})
