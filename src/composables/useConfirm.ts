import { ref } from 'vue'

export interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean
  resolve?: (value: boolean) => void
}

const state = ref<ConfirmState>({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Lanjut',
  cancelText: 'Batal',
  danger: false
})

export function useConfirm() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      state.value = {
        isOpen: true,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText ?? 'Lanjut',
        cancelText: options.cancelText ?? 'Batal',
        danger: options.danger ?? false,
        resolve
      }
    })
  }

  function handleConfirm() {
    if (state.value.resolve) {
      state.value.resolve(true)
    }
    state.value.isOpen = false
  }

  function handleCancel() {
    if (state.value.resolve) {
      state.value.resolve(false)
    }
    state.value.isOpen = false
  }

  return {
    state,
    confirm,
    handleConfirm,
    handleCancel
  }
}
