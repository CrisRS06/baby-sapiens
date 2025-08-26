/**
 * Utilidades para integración de Botpress con Clerk
 * Proporciona funciones para construir URLs dinámicas y manejar configuración de webchat
 */

import type { UserResource } from '@clerk/types'

// Tipos de datos para la integración
export interface BotpressUserMetadata {
  id: string
  name?: string
  email?: string
  stage?: 'pregnancy' | 'newborn' | 'infant' | 'toddler' | 'unknown'
  childAge?: string
  feedingMethod?: 'breast' | 'formula' | 'mixed' | 'solids' | 'unknown'
  language?: 'es' | 'en'
  preferences?: {
    theme?: 'light' | 'dark'
    notifications?: boolean
    expertMode?: boolean
  }
  source: 'clerk'
  timestamp: string
}

export interface BotpressUrlParams {
  configUrl?: string
  userId?: string
  userName?: string
  userEmail?: string
  stage?: string
  childAge?: string
  feedingMethod?: string
  language?: string
  theme?: 'light' | 'dark'
  autoOpen?: 'true' | 'false'
  botName?: string
  color?: string
  variant?: 'solid' | 'soft'
  source?: string
}

export interface BotpressConfiguration {
  baseUrl?: string
  configUrl?: string
  clientId?: string
  defaultTheme?: 'light' | 'dark'
  defaultLanguage?: 'es' | 'en'
  autoOpen?: boolean
  debug?: boolean
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Error personalizado para utilidades de Botpress
export class BotpressUtilsError extends Error {
  public code: string
  public details?: any

  constructor(message: string, code: string = 'BOTPRESS_UTILS_ERROR', details?: any) {
    super(message)
    this.name = 'BotpressUtilsError'
    this.code = code
    this.details = details
  }
}

/**
 * Configuración por defecto de Botpress
 */
const DEFAULT_CONFIG: Required<BotpressConfiguration> = {
  baseUrl: process.env.NEXT_PUBLIC_BOTPRESS_BASE_URL || 'https://cdn.botpress.cloud/webchat/v3.2/shareable.html',
  configUrl: process.env.NEXT_PUBLIC_BOTPRESS_CONFIG_URL || 'https://files.bpcontent.cloud/2025/08/23/00/20250823001639-J61VAXD4.json',
  clientId: process.env.NEXT_PUBLIC_BOTPRESS_CLIENT_ID || 'f657ad35-3575-4861-92bd-e52dac005765',
  defaultTheme: 'light',
  defaultLanguage: 'es',
  autoOpen: true,
  debug: process.env.NODE_ENV === 'development'
}

/**
 * Extrae metadata relevante del usuario de Clerk
 */
export function extractUserMetadata(user: UserResource | null): BotpressUserMetadata | null {
  if (!user) return null

  try {
    const publicMetadata = user.publicMetadata as any || {}
    // UserResource no tiene privateMetadata, solo publicMetadata y unsafeMetadata
    const privateMetadata = user.unsafeMetadata as any || {}

    return {
      id: user.id,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username || undefined,
      email: user.emailAddresses[0]?.emailAddress,
      stage: publicMetadata.parentingStage || publicMetadata.stage || 'unknown',
      childAge: publicMetadata.childAge || privateMetadata.childAge,
      feedingMethod: publicMetadata.feedingMethod || 'unknown',
      language: publicMetadata.language || 'es',
      preferences: {
        theme: publicMetadata.theme || 'light',
        notifications: publicMetadata.notifications !== false,
        expertMode: publicMetadata.expertMode === true
      },
      source: 'clerk',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.warn('Error extracting user metadata:', error)
    return {
      id: user.id,
      name: user.firstName || user.username || undefined,
      email: user.emailAddresses[0]?.emailAddress,
      source: 'clerk',
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Valida los parámetros antes de construir la URL de Botpress
 */
export function validateBotpressParams(params: BotpressUrlParams): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Validaciones obligatorias
  if (params.configUrl && !isValidUrl(params.configUrl)) {
    errors.push('configUrl must be a valid URL')
  }

  if (params.userId && typeof params.userId !== 'string') {
    errors.push('userId must be a string')
  }

  if (params.userEmail && !isValidEmail(params.userEmail)) {
    warnings.push('userEmail appears to be invalid')
  }

  // Validaciones de valores permitidos
  if (params.theme && !['light', 'dark'].includes(params.theme)) {
    warnings.push('theme should be either "light" or "dark"')
  }

  if (params.language && !['es', 'en'].includes(params.language)) {
    warnings.push('language should be either "es" or "en"')
  }

  if (params.stage && !['pregnancy', 'newborn', 'infant', 'toddler', 'unknown'].includes(params.stage)) {
    warnings.push('stage should be a valid parenting stage')
  }

  if (params.autoOpen && !['true', 'false'].includes(params.autoOpen)) {
    warnings.push('autoOpen should be either "true" or "false"')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Construye URL de Botpress con parámetros de usuario
 */
export function buildBotpressUrl(params: BotpressUrlParams, config: BotpressConfiguration = {}): string {
  try {
    const finalConfig = { ...DEFAULT_CONFIG, ...config }
    
    // Validar parámetros
    const validation = validateBotpressParams(params)
    if (!validation.isValid) {
      throw new BotpressUtilsError(
        `Invalid parameters: ${validation.errors.join(', ')}`,
        'VALIDATION_ERROR',
        { errors: validation.errors, warnings: validation.warnings }
      )
    }

    // Log warnings if in debug mode
    if (finalConfig.debug && validation.warnings.length > 0) {
      console.warn('Botpress URL warnings:', validation.warnings)
    }

    // Usar configUrl de parámetros o configuración
    const configUrl = params.configUrl || finalConfig.configUrl

    // Construir URL base
    const baseUrl = finalConfig.baseUrl
    const url = new URL(baseUrl)

    // Agregar configUrl como parámetro obligatorio
    url.searchParams.set('configUrl', configUrl)

    // Agregar parámetros de usuario si están presentes
    if (params.userId) {
      url.searchParams.set('userId', params.userId)
    }

    if (params.userName) {
      url.searchParams.set('userName', params.userName)
    }

    if (params.userEmail) {
      url.searchParams.set('userEmail', params.userEmail)
    }

    if (params.stage) {
      url.searchParams.set('stage', params.stage)
    }

    if (params.childAge) {
      url.searchParams.set('childAge', params.childAge)
    }

    if (params.feedingMethod) {
      url.searchParams.set('feedingMethod', params.feedingMethod)
    }

    if (params.language) {
      url.searchParams.set('language', params.language)
    }

    if (params.theme) {
      url.searchParams.set('theme', params.theme)
    }

    if (params.autoOpen !== undefined) {
      url.searchParams.set('autoOpen', params.autoOpen)
    }

    if (params.botName) {
      url.searchParams.set('botName', params.botName)
    }

    if (params.color) {
      url.searchParams.set('color', params.color)
    }

    if (params.variant) {
      url.searchParams.set('variant', params.variant)
    }

    if (params.source) {
      url.searchParams.set('source', params.source)
    }

    // Agregar timestamp para evitar caché
    url.searchParams.set('t', Date.now().toString())

    return url.toString()
  } catch (error) {
    if (error instanceof BotpressUtilsError) {
      throw error
    }
    
    throw new BotpressUtilsError(
      'Failed to build Botpress URL',
      'BUILD_ERROR',
      { originalError: error, params }
    )
  }
}

/**
 * Crea URL de Botpress específica para un usuario de Clerk
 */
export function createBotpressUrlForUser(
  user: UserResource | null,
  configOverrides: BotpressConfiguration = {},
  paramOverrides: Partial<BotpressUrlParams> = {}
): string {
  if (!user) {
    // Usuario anónimo - URL básica sin personalización
    return buildBotpressUrl({
      autoOpen: 'true',
      theme: configOverrides.defaultTheme || 'light',
      language: configOverrides.defaultLanguage || 'es',
      source: 'anonymous',
      ...paramOverrides
    }, configOverrides)
  }

  try {
    // Extraer metadata del usuario
    const metadata = extractUserMetadata(user)
    
    if (!metadata) {
      throw new BotpressUtilsError('Failed to extract user metadata', 'METADATA_ERROR')
    }

    // Construir parámetros basados en metadata
    const userParams: BotpressUrlParams = {
      userId: metadata.id,
      userName: metadata.name,
      userEmail: metadata.email,
      stage: metadata.stage,
      childAge: metadata.childAge,
      feedingMethod: metadata.feedingMethod,
      language: metadata.language,
      theme: metadata.preferences?.theme || configOverrides.defaultTheme || 'light',
      autoOpen: (configOverrides.autoOpen !== false) ? 'true' : 'false',
      source: 'clerk',
      ...paramOverrides
    }

    return buildBotpressUrl(userParams, configOverrides)
  } catch (error) {
    console.error('Error creating Botpress URL for user:', error)
    
    // Fallback a URL básica con información mínima del usuario
    return buildBotpressUrl({
      userId: user.id,
      userName: user.firstName || user.username || undefined,
      userEmail: user.emailAddresses[0]?.emailAddress,
      autoOpen: 'true',
      theme: 'light',
      language: 'es',
      source: 'clerk-fallback',
      ...paramOverrides
    }, configOverrides)
  }
}

/**
 * Obtiene la configuración por defecto de Botpress
 */
export function getDefaultBotpressConfiguration(): Required<BotpressConfiguration> {
  return { ...DEFAULT_CONFIG }
}

/**
 * Valida que las variables de entorno de Botpress estén configuradas
 */
export function validateBotpressEnvironment(): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!process.env.NEXT_PUBLIC_BOTPRESS_CLIENT_ID) {
    warnings.push('NEXT_PUBLIC_BOTPRESS_CLIENT_ID not set, using default')
  }

  if (!process.env.NEXT_PUBLIC_BOTPRESS_CONFIG_URL) {
    warnings.push('NEXT_PUBLIC_BOTPRESS_CONFIG_URL not set, using default')
  }

  if (!process.env.NEXT_PUBLIC_BOTPRESS_BASE_URL) {
    warnings.push('NEXT_PUBLIC_BOTPRESS_BASE_URL not set, using default')
  }

  // Verificar que las URLs sean válidas si están definidas
  if (process.env.NEXT_PUBLIC_BOTPRESS_CONFIG_URL && !isValidUrl(process.env.NEXT_PUBLIC_BOTPRESS_CONFIG_URL)) {
    errors.push('NEXT_PUBLIC_BOTPRESS_CONFIG_URL is not a valid URL')
  }

  if (process.env.NEXT_PUBLIC_BOTPRESS_BASE_URL && !isValidUrl(process.env.NEXT_PUBLIC_BOTPRESS_BASE_URL)) {
    errors.push('NEXT_PUBLIC_BOTPRESS_BASE_URL is not a valid URL')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Ejecuta una operación de Botpress de forma segura con manejo de errores
 */
export async function safeBotpressOperation<T>(
  operation: () => T | Promise<T>,
  operationName: string = 'unknown'
): Promise<T | null> {
  try {
    const result = await operation()
    
    if (DEFAULT_CONFIG.debug) {
      console.log(`✅ Botpress operation "${operationName}" completed successfully`)
    }
    
    return result
  } catch (error) {
    console.error(`❌ Botpress operation "${operationName}" failed:`, error)
    
    if (error instanceof BotpressUtilsError) {
      console.error('Error details:', error.details)
    }
    
    return null
  }
}

// Utilidades auxiliares
function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Exportar tipos y configuración por defecto
export type { UserResource }
export { DEFAULT_CONFIG }