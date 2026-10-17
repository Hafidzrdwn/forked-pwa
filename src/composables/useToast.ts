import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
  title?: string
  duration?: number
}

const toasts = ref<ToastItem[]>([])

export function useToast() {
  function show(toast: Omit<ToastItem, 'id'>) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const duration = toast.duration ?? 4000
    const newItem: ToastItem = { ...toast, id }
    
    toasts.value.push(newItem)

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }

    return id
  }

  function success(message: string, title?: string) {
    return show({ type: 'success', message, title })
  }

  function error(message: string, title?: string) {
    return show({ type: 'error', message, title, duration: 5500 })
  }

  function info(message: string, title?: string) {
    return show({ type: 'info', message, title })
  }

  function warning(message: string, title?: string) {
    return show({ type: 'warning', message, title })
  }

  function dismiss(id: string) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      toasts.value.splice(idx, 1)
    }
  }

  function clear() {
    toasts.value = []
  }

  return {
    toasts,
    show,
    success,
    error,
    info,
    warning,
    dismiss,
    clear
  }
}
