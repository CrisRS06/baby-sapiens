/**
 * Botpress Analytics Integration - FASE 2
 * Chat Analytics para medir valor real de conversaciones
 */

import { 
  trackChatResolved, 
  trackChatCSAT, 
  trackPricingIntent, 
  generateConversationId,
  startTimer,
  endTimer 
} from './analytics'

// Tipos para variables de Botpress
export interface BotpressVariables {
  country?: string
  lang?: string
  baby_age_months?: number
  pregnancy_weeks?: number
  primary_topic?: 'sueño' | 'fiebre' | 'lactancia' | 'alimentación' | 'otro'
  risk_flag?: boolean
  escalated_reason?: 'risk' | 'kb_gap' | 'bug' | 'ambiguous'
  first_answer_ms?: number
  ttr_ms?: number
  resolved?: boolean
  csat?: 1 | 2 | 3 | 4 | 5
  ces?: 1 | 2 | 3 | 4 | 5
  pricing_bucket?: 'A' | 'B' | 'C' | 'day'
  pricing_intent?: 'view' | 'click' | 'reserve' | 'paid'
}

export interface ConversationSummary {
  conversation_id: string
  ts_start: number
  ts_end: number
  country: string
  lang: string
  baby_age_months?: number
  pregnancy_weeks?: number
  primary_topic: string
  risk_flag: boolean
  escalated_reason?: string
  first_answer_ms: number
  ttr_ms: number
  resolved: boolean
  csat?: number
  ces?: number
  pricing_bucket?: string
  pricing_intent?: string
}

/**
 * Clase para manejar analytics de chat de Botpress
 */
class BotpressChatAnalytics {
  private conversationId: string | null = null
  private startTime: number | null = null
  private firstAnswerTime: number | null = null
  private variables: BotpressVariables = {}

  /**
   * Inicia una nueva conversación y tracking
   */
  startConversation(userId?: string): string {
    this.conversationId = generateConversationId(userId)
    this.startTime = Date.now()
    this.firstAnswerTime = null
    this.variables = {}
    
    // Iniciar timer para first_answer
    startTimer('first_answer')
    startTimer('total_conversation')
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Chat Analytics: Conversation started', this.conversationId)
    }
    
    return this.conversationId
  }

  /**
   * Marca cuando se recibe la primera respuesta del bot
   */
  markFirstAnswer(): void {
    if (!this.firstAnswerTime) {
      this.firstAnswerTime = Date.now()
      const firstAnswerMs = endTimer('first_answer')
      this.variables.first_answer_ms = firstAnswerMs
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Chat Analytics: First answer in', firstAnswerMs, 'ms')
      }
    }
  }

  /**
   * Actualiza variables de la conversación
   */
  updateVariables(newVariables: Partial<BotpressVariables>): void {
    this.variables = { ...this.variables, ...newVariables }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Chat Analytics: Variables updated', newVariables)
    }
  }

  /**
   * Termina la conversación y envía analytics
   */
  endConversation(finalVariables: Partial<BotpressVariables> = {}): void {
    if (!this.conversationId || !this.startTime) {
      console.warn('📊 Chat Analytics: Cannot end conversation - not started')
      return
    }

    // Actualizar variables finales
    this.updateVariables(finalVariables)

    const ttrMs = endTimer('total_conversation')
    const endTime = Date.now()

    // Asegurar que tenemos first_answer_ms
    if (!this.variables.first_answer_ms && this.firstAnswerTime) {
      this.variables.first_answer_ms = this.firstAnswerTime - this.startTime
    }

    // Preparar datos para analytics
    const chatResolvedData = {
      first_answer_ms: this.variables.first_answer_ms || 0,
      ttr_ms: ttrMs,
      topic: this.variables.primary_topic || 'otro',
      risk: this.variables.risk_flag ? 1 : 0,
      conversation_id: this.conversationId
    }

    // Enviar evento chat_resolved
    trackChatResolved(chatResolvedData as any)

    // Enviar CSAT si existe
    if (this.variables.csat) {
      trackChatCSAT(this.variables.csat, this.conversationId)
    }

    // Enviar pricing intent si existe
    if (this.variables.pricing_intent && this.variables.pricing_bucket) {
      trackPricingIntent({
        bucket: this.variables.pricing_bucket as any,
        action: this.variables.pricing_intent as any,
        conversation_id: this.conversationId
      })
    }

    // Guardar en repositorio de feedback (Fase 3)
    this.saveToRepository()

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Chat Analytics: Conversation ended', {
        id: this.conversationId,
        duration_ms: ttrMs,
        first_answer_ms: this.variables.first_answer_ms,
        topic: this.variables.primary_topic,
        risk: this.variables.risk_flag,
        csat: this.variables.csat
      })
    }

    // Reset
    this.conversationId = null
    this.startTime = null
    this.firstAnswerTime = null
    this.variables = {}
  }

  /**
   * FASE 3: Guarda resumen en repositorio local
   */
  private saveToRepository(): void {
    if (!this.conversationId || !this.startTime) return

    const summary: ConversationSummary = {
      conversation_id: this.conversationId,
      ts_start: this.startTime,
      ts_end: Date.now(),
      country: this.variables.country || 'unknown',
      lang: this.variables.lang || 'es',
      baby_age_months: this.variables.baby_age_months,
      pregnancy_weeks: this.variables.pregnancy_weeks,
      primary_topic: this.variables.primary_topic || 'otro',
      risk_flag: this.variables.risk_flag || false,
      escalated_reason: this.variables.escalated_reason,
      first_answer_ms: this.variables.first_answer_ms || 0,
      ttr_ms: this.variables.ttr_ms || 0,
      resolved: this.variables.resolved || true,
      csat: this.variables.csat,
      ces: this.variables.ces,
      pricing_bucket: this.variables.pricing_bucket,
      pricing_intent: this.variables.pricing_intent
    }

    // Guardar en localStorage para repositorio simple
    try {
      const existingData = localStorage.getItem('baby_sapiens_conversations') || '[]'
      const conversations = JSON.parse(existingData)
      conversations.push(summary)
      
      // Mantener solo últimas 100 conversaciones
      if (conversations.length > 100) {
        conversations.splice(0, conversations.length - 100)
      }
      
      localStorage.setItem('baby_sapiens_conversations', JSON.stringify(conversations))
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Chat Analytics: Saved to repository', summary)
      }
    } catch (error) {
      console.error('📊 Chat Analytics: Failed to save to repository', error)
    }
  }

  /**
   * Obtiene el ID de conversación actual
   */
  getCurrentConversationId(): string | null {
    return this.conversationId
  }

  /**
   * Obtiene variables actuales
   */
  getCurrentVariables(): BotpressVariables {
    return { ...this.variables }
  }
}

// Singleton instance
export const botpressChatAnalytics = new BotpressChatAnalytics()

// =============================================================================
// INTEGRATION FUNCTIONS para usar desde Botpress
// =============================================================================

/**
 * Listener de mensajes de Botpress para integrar analytics
 */
export function setupBotpressAnalyticsListener(): void {
  if (typeof window === 'undefined') return

  window.addEventListener('message', (event) => {
    // Solo procesar mensajes de Botpress
    if (!event.origin.includes('botpress.cloud') && !event.origin.includes('cdn.botpress.cloud')) {
      return
    }

    try {
      const data = event.data
      
      if (data && typeof data === 'object') {
        handleBotpressMessage(data)
      }
    } catch (error) {
      console.error('📊 Chat Analytics: Error processing Botpress message', error)
    }
  })

  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Chat Analytics: Botpress listener setup completed')
  }
}

/**
 * Maneja mensajes específicos de Botpress
 */
function handleBotpressMessage(data: any): void {
  const { type, payload } = data

  switch (type) {
    case 'webchat.opened':
    case 'conversation.started':
      botpressChatAnalytics.startConversation(payload?.userId)
      break

    case 'message.received':
      // Primera respuesta del bot
      if (payload?.from === 'bot') {
        botpressChatAnalytics.markFirstAnswer()
      }
      break

    case 'webchat.closed':
    case 'conversation.ended':
      botpressChatAnalytics.endConversation()
      break

    case 'variable.updated':
      if (payload?.variables) {
        botpressChatAnalytics.updateVariables(payload.variables)
      }
      break

    case 'feedback.submitted':
      if (payload?.csat) {
        botpressChatAnalytics.updateVariables({ csat: payload.csat })
      }
      break

    case 'pricing.interaction':
      botpressChatAnalytics.updateVariables({
        pricing_bucket: payload?.bucket,
        pricing_intent: payload?.action
      })
      break

    default:
      // Ignorar otros tipos de mensaje
      break
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Obtiene resumen de conversaciones del repositorio local
 */
export function getConversationsSummary(): {
  total: number
  avgFirstAnswerMs: number
  avgTtrMs: number
  csatAverage: number
  topicDistribution: Record<string, number>
  riskFlagRate: number
} {
  try {
    const data = localStorage.getItem('baby_sapiens_conversations') || '[]'
    const conversations: ConversationSummary[] = JSON.parse(data)

    if (conversations.length === 0) {
      return {
        total: 0,
        avgFirstAnswerMs: 0,
        avgTtrMs: 0,
        csatAverage: 0,
        topicDistribution: {},
        riskFlagRate: 0
      }
    }

    const total = conversations.length
    const avgFirstAnswerMs = conversations.reduce((sum, c) => sum + c.first_answer_ms, 0) / total
    const avgTtrMs = conversations.reduce((sum, c) => sum + c.ttr_ms, 0) / total
    
    const csatResponses = conversations.filter(c => c.csat).map(c => c.csat!)
    const csatAverage = csatResponses.length > 0 
      ? csatResponses.reduce((sum, csat) => sum + csat, 0) / csatResponses.length 
      : 0

    const topicDistribution = conversations.reduce((acc, c) => {
      acc[c.primary_topic] = (acc[c.primary_topic] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const riskFlagRate = conversations.filter(c => c.risk_flag).length / total

    return {
      total,
      avgFirstAnswerMs: Math.round(avgFirstAnswerMs),
      avgTtrMs: Math.round(avgTtrMs),
      csatAverage: Math.round(csatAverage * 100) / 100,
      topicDistribution,
      riskFlagRate: Math.round(riskFlagRate * 100) / 100
    }
  } catch (error) {
    console.error('📊 Chat Analytics: Failed to get conversations summary', error)
    return {
      total: 0,
      avgFirstAnswerMs: 0,
      avgTtrMs: 0,
      csatAverage: 0,
      topicDistribution: {},
      riskFlagRate: 0
    }
  }
}

/**
 * Exporta conversaciones para análisis externo
 */
export function exportConversationsData(): ConversationSummary[] {
  try {
    const data = localStorage.getItem('baby_sapiens_conversations') || '[]'
    return JSON.parse(data)
  } catch (error) {
    console.error('📊 Chat Analytics: Failed to export conversations data', error)
    return []
  }
}