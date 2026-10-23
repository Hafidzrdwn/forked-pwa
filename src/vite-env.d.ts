/// <reference types="vite/client" />

import type { DefineComponent } from 'vue'

declare module '*.vue' {
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@vue/runtime-dom' {
  interface HTMLAttributes {
    ariaLabel?: string
    ariaModal?: string | boolean
    [key: string]: any
  }
  interface ButtonHTMLAttributes {
    ariaLabel?: string
    ariaModal?: string | boolean
    [key: string]: any
  }
}

declare module 'vue' {
  interface HTMLAttributes {
    ariaLabel?: string
    ariaModal?: string | boolean
    [key: string]: any
  }
  interface ButtonHTMLAttributes {
    ariaLabel?: string
    ariaModal?: string | boolean
    [key: string]: any
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}

export {}
