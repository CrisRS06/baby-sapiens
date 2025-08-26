/**
 * Analytics utility for Baby Sapiens Alpha - Privacy-First Implementation
 * Senior PM/Analyst + Implementer instrumentación para validar valor real
 */

// Tipos para eventos definidos en spec
export interface AnalyticsEvent {
  event_name: string
  parameters?: Record<string, string | number | boolean>
}

export interface LandingViewParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  page_location?: string
}

export interface OpenWebchatParams {
  source: 'landing' | 'chat_page'
  utm_source?: string
  utm_medium?: string
}

export interface CTAClickParams {
  cta: 'webchat' | 'whatsapp247' | 'plan_sueno' | 'checklist' | 'sign_in'
  location: 'hero' | 'features' | 'footer' | 'nav'
  utm_source?: string
  utm_medium?: string
}

export interface SignInParams {
  source: 'clerk'
  method?: 'google' | 'github' | 'microsoft' | 'apple' | 'email'
  utm_source?: string
  utm_medium?: string
}

// Chat Events (Fase 2)
export interface ChatResolvedParams {
  first_answer_ms: number
  ttr_ms: number
  topic: 'sueño' | 'fiebre' | 'lactancia' | 'alimentación' | 'otro'
  risk: 0 | 1
  conversation_id: string // anonymous hash
}

export interface ChatCSATParams {
  csat: 1 | 2 | 3 | 4 | 5
  conversation_id: string
}

export interface PricingIntentParams {
  bucket: 'A' | 'B' | 'C' | 'day'
  action: 'view' | 'click' | 'reserve' | 'paid'
  conversation_id: string
}

/**
 * Utilidad principal de analítica - Privacy-compliant
 * NO envía PII, emails, teléfonos, nombres o texto libre sensible
 */
class BabySapiensAnalytics {
  private isEnabled: boolean
  private debugMode: boolean

  constructor() {
    this.isEnabled = typeof window !== 'undefined' && typeof window.gtag !== 'undefined'
    this.debugMode = process.env.NODE_ENV === 'development'
    
    if (this.debugMode) {
      console.log('🔍 Baby Sapiens Analytics initialized', { 
        enabled: this.isEnabled,
        environment: process.env.NODE_ENV 
      })
    }
  }

  /**
   * Envía evento a GA4 con validación de privacidad
   */
  private track(eventName: string, parameters: Record<string, any> = {}) {
    if (!this.isEnabled) {
      if (this.debugMode) {
        console.log('📊 Analytics (disabled):', eventName, parameters)
      }
      return
    }

    // Validación de privacidad: no PII ni texto libre
    const sanitizedParams = this.sanitizeParameters(parameters)
    
    if (this.debugMode) {
      console.log('📊 Analytics:', eventName, sanitizedParams)
    }

    try {
      window.gtag('event', eventName, sanitizedParams)
    } catch (error) {
      console.error('❌ Analytics error:', error)
    }
  }

  /**
   * Sanitiza parámetros para remover PII y limitar texto libre
   */
  private sanitizeParameters(params: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {}
    
    for (const [key, value] of Object.entries(params)) {
      // Solo permitir valores simples y seguros
      if (typeof value === 'string') {
        // Limitar longitud de strings y verificar que no sean sensibles
        if (value.length <= 50 && !this.containsPII(value)) {
          sanitized[key] = value
        }
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value
      }
    }
    
    // Agregar timestamp para análisis temporal
    sanitized.timestamp = Date.now()
    
    return sanitized
  }

  /**
   * Detecta potencial PII en strings
   */
  private containsPII(text: string): boolean {
    // Patterns básicos para detectar PII
    const piiPatterns = [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // emails
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // teléfonos US
      /\b\d{2,3}[-\s]?\d{3,4}[-\s]?\d{4}\b/, // teléfonos LATAM
      /\b[A-Z][a-z]+ [A-Z][a-z]+\b/ // nombres completos
    ]
    
    return piiPatterns.some(pattern => pattern.test(text))
  }

  /**
   * Obtiene UTM parameters del URL actual de forma segura
   */
  private getUTMParameters(): { utm_source?: string; utm_medium?: string; utm_campaign?: string } {
    if (typeof window === 'undefined') return {}
    
    try {
      const urlParams = new URLSearchParams(window.location.search)
      return {
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_campaign: urlParams.get('utm_campaign') || undefined,
      }
    } catch {
      return {}
    }
  }

  // =============================================================================
  // FASE 1: WEB EVENTS (Key Events)
  // =============================================================================

  /**
   * 1. landing_view - Al cargar la landing
   */
  trackLandingView(additionalParams: Partial<LandingViewParams> = {}) {
    const params: LandingViewParams = {
      ...this.getUTMParameters(),
      page_location: window.location.href,
      ...additionalParams
    }
    
    this.track('landing_view', params)
  }

  /**
   * 2. open_webchat - Al abrir el webchat (KEY EVENT)
   */
  trackOpenWebchat(params: OpenWebchatParams) {
    const trackingParams = {
      ...params,
      ...this.getUTMParameters()
    }
    
    this.track('open_webchat', trackingParams)
  }

  /**
   * 3. cta_click - Al hacer clic en CTAs (KEY EVENT)
   */
  trackCTAClick(params: CTAClickParams) {
    const trackingParams = {
      ...params,
      ...this.getUTMParameters()
    }
    
    this.track('cta_click', trackingParams)
  }

  /**
   * 4. sign_in - Después de iniciar sesión correctamente (KEY EVENT)
   */
  trackSignIn(params: SignInParams) {
    const trackingParams = {
      ...params,
      ...this.getUTMParameters()
    }
    
    this.track('sign_in', trackingParams)
  }

  // =============================================================================
  // FASE 2: CHAT EVENTS (al cerrar conversación)
  // =============================================================================

  /**
   * chat_resolved - Métricas de resolución de chat
   */
  trackChatResolved(params: ChatResolvedParams) {
    this.track('chat_resolved', params)
  }

  /**
   * chat_csat - Satisfacción del usuario
   */
  trackChatCSAT(params: ChatCSATParams) {
    this.track('chat_csat', params)
  }

  /**
   * pricing_intent - Intención de pago
   */
  trackPricingIntent(params: PricingIntentParams) {
    this.track('pricing_intent', params)
  }

  // =============================================================================
  // UTILIDADES DE ANÁLISIS
  // =============================================================================

  /**
   * Genera hash anónimo para conversation_id (privacy-compliant)
   */
  generateConversationId(userId?: string, timestamp: number = Date.now()): string {
    const data = `${userId || 'anonymous'}_${timestamp}_${Math.random()}`
    // Simple hash for anonymization
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return `conv_${Math.abs(hash).toString(36)}`
  }

  /**
   * Inicia cronómetro para medir tiempos de respuesta
   */
  startTimer(timerName: string): void {
    if (typeof window !== 'undefined') {
      (window as any).__babysSapiensTimers = (window as any).__babysSapiensTimers || {}
      ;(window as any).__babysSapiensTimers[timerName] = Date.now()
    }
  }

  /**
   * Termina cronómetro y retorna tiempo transcurrido en ms
   */
  endTimer(timerName: string): number {
    if (typeof window === 'undefined') return 0
    
    const timers = (window as any).__babysSapiensTimers || {}
    const startTime = timers[timerName]
    
    if (!startTime) return 0
    
    const duration = Date.now() - startTime
    delete timers[timerName]
    
    return duration
  }
}

// Singleton instance
export const analytics = new BabySapiensAnalytics()

// =============================================================================
// QUICK ACCESS FUNCTIONS (para usar en componentes)
// =============================================================================

export const trackLandingView = (params?: Partial<LandingViewParams>) => 
  analytics.trackLandingView(params)

export const trackOpenWebchat = (source: 'landing' | 'chat_page') => 
  analytics.trackOpenWebchat({ source })

export const trackCTAClick = (cta: CTAClickParams['cta'], location: CTAClickParams['location']) => 
  analytics.trackCTAClick({ cta, location })

export const trackSignIn = (method?: SignInParams['method']) => 
  analytics.trackSignIn({ source: 'clerk', method })

export const trackChatResolved = (params: ChatResolvedParams) => 
  analytics.trackChatResolved(params)

export const trackChatCSAT = (csat: 1 | 2 | 3 | 4 | 5, conversationId: string) => 
  analytics.trackChatCSAT({ csat, conversation_id: conversationId })

export const trackPricingIntent = (params: PricingIntentParams) => 
  analytics.trackPricingIntent(params)

// Utilities exports
export const generateConversationId = (userId?: string) => 
  analytics.generateConversationId(userId)

export const startTimer = (timerName: string) => 
  analytics.startTimer(timerName)

export const endTimer = (timerName: string) => 
  analytics.endTimer(timerName)