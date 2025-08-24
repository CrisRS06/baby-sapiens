declare global {
  interface Window {
    botpress?: {
      init: (config: any) => void
      open: () => void
      close: () => void
      destroy?: () => void
      on: (event: string, callback: (data?: any) => void) => void
      off: (event: string, callback?: (data?: any) => void) => void
    }
  }
}

export {}