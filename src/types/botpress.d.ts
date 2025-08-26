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

/**
 * Botpress Webchat component props interface
 */
export interface WebchatProps {
  clientId: string
  configuration?: BotpressWebchatConfig
  className?: string
  style?: React.CSSProperties
}

/**
 * Botpress Webchat configuration interface
 */
export interface BotpressWebchatConfig {
  botName?: string
  botAvatar?: string
  botDescription?: string
  composerPlaceholder?: string
  color?: string
  variant?: 'solid' | 'outline' | 'ghost'
  themeMode?: 'light' | 'dark' | 'auto'
  fontFamily?: string
  showPoweredBy?: boolean
  footer?: string
  width?: string | number
  height?: string | number
  autoOpen?: boolean
  customCSS?: string
}

/**
 * Botpress event types
 */
export type BotpressEventType = 
  | 'webchat:opened'
  | 'webchat:closed'
  | 'message:sent'
  | 'message:received'
  | 'conversation:started'
  | 'conversation:ended'

/**
 * Botpress event data interface
 */
export interface BotpressEventData {
  type: BotpressEventType
  payload?: {
    message?: string
    userId?: string
    conversationId?: string
    timestamp?: string
    [key: string]: unknown
  }
}

export {}