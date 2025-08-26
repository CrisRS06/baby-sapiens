/**
 * Global type declarations for Baby Sapiens analytics
 */

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: {
        [key: string]: any
      }
    ) => void
    dataLayer: any[]
    __babysSapiensTimers?: Record<string, number>
  }
}

export {}