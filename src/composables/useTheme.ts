import { useThemeStore, type Theme } from '../stores/theme.store'

export type { Theme }

export function useTheme() {
  const store = useThemeStore()
  return {
    theme: store.theme,
    toggleTheme: store.toggleTheme,
    setTheme: store.setTheme
  }
}
