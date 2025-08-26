/**
 * BOTPRESS UTILITIES - USAGE EXAMPLES
 * 
 * This file contains practical examples of how to use the Botpress utilities
 * with Clerk authentication and user context.
 */

import { currentUser } from '@clerk/nextjs/server'
import type { UserResource } from '@clerk/types'
import { 
  buildBotpressUrl,
  createBotpressUrlForUser,
  extractUserMetadata,
  validateBotpressParams,
  getDefaultBotpressConfiguration,
  safeBotpressOperation,
  validateBotpressEnvironment,
  type BotpressUrlParams,
  type BotpressUserMetadata,
  type BotpressConfiguration
} from './botpress-utils'

/**
 * EXAMPLE 1: Basic URL Construction
 * Create a simple Botpress URL with minimal parameters
 */
export async function basicUrlExample() {
  const params: BotpressUrlParams = {
    theme: 'light',
    language: 'es'
  }

  try {
    const url = buildBotpressUrl(params)
    console.log('Basic URL:', url)
    return url
  } catch (error) {
    console.error('Failed to create basic URL:', error)
    return null
  }
}

/**
 * EXAMPLE 2: URL with User Context
 * Create a Botpress URL with complete user metadata
 */
export async function userContextUrlExample() {
  const params: BotpressUrlParams = {
    userId: 'user_12345',
    userName: 'María González',
    userEmail: 'maria@example.com',
    theme: 'light',
    language: 'es',
    stage: 'newborn',
    childAge: '2',
    feedingMethod: 'mixed'
  }

  try {
    const url = buildBotpressUrl(params)
    console.log('User context URL:', url)
    return url
  } catch (error) {
    console.error('Failed to create user context URL:', error)
    return null
  }
}

/**
 * EXAMPLE 3: Server-Side Clerk Integration
 * Use with Next.js server components or API routes
 */
export async function serverSideClerkExample() {
  try {
    // Get current user from Clerk (server-side)
    const user = await currentUser()
    
    if (!user) {
      console.log('No authenticated user')
      return null
    }

    // Create URL with automatic user context extraction
    // Note: currentUser() returns User type, but we need UserResource
    // In real usage, use useUser() hook which returns UserResource
    const url = createBotpressUrlForUser(user as unknown as UserResource, {
      defaultTheme: 'light',
      defaultLanguage: 'es',
      debug: true
    })

    console.log('Server-side Clerk URL:', url)
    return url
  } catch (error) {
    console.error('Server-side Clerk integration failed:', error)
    return null
  }
}

/**
 * EXAMPLE 4: Parameter Validation
 * Validate parameters before URL construction
 */
export function validationExample() {
  const params: BotpressUrlParams = {
    userEmail: 'not-an-email', // This will trigger a warning
    theme: 'dark',
    language: 'es'
  }

  // Validate before using
  const validation = validateBotpressParams(params)
  
  console.log('Validation result:', {
    isValid: validation.isValid,
    errors: validation.errors,
    warnings: validation.warnings
  })

  if (!validation.isValid) {
    console.log('❌ Parameters are invalid, cannot create URL')
    return null
  }

  if (validation.warnings.length > 0) {
    console.log('⚠️ Parameters have warnings but are still usable')
  }

  return buildBotpressUrl(params)
}

/**
 * EXAMPLE 5: User Metadata Extraction
 * Extract and process user metadata from Clerk user object
 */
export function userMetadataExample(clerkUser: UserResource) {
  try {
    const metadata = extractUserMetadata(clerkUser)
    
    console.log('Extracted metadata:', metadata)
    
    // Process metadata for specific use cases
    if (metadata && metadata.stage === 'newborn' && metadata.childAge) {
      console.log('👶 New parent detected - show newborn-specific guidance')
    }
    
    if (metadata && metadata.feedingMethod === 'breast') {
      console.log('🤱 Breastfeeding mother - prioritize feeding support')
    }
    
    return metadata
  } catch (error) {
    console.error('Failed to extract user metadata:', error)
    return null
  }
}

/**
 * EXAMPLE 6: Configuration Management
 * Get and customize Botpress configuration
 */
export function configurationExample() {
  // Get default configuration
  const defaultConfig = getDefaultBotpressConfiguration()
  console.log('Default config:', defaultConfig)

  // Customize for specific scenarios
  const pregnancyConfig: BotpressConfiguration = {
    ...defaultConfig,
    defaultTheme: 'light',
    defaultLanguage: 'es'
  }

  const toddlerConfig: BotpressConfiguration = {
    ...defaultConfig,
    defaultTheme: 'light',
    defaultLanguage: 'es'
  }

  return { defaultConfig, pregnancyConfig, toddlerConfig }
}

/**
 * EXAMPLE 7: Error Handling with Safe Operations
 * Use safeBotpressOperation for robust error handling
 */
export async function errorHandlingExample(clerkUser: UserResource) {
  // Safe metadata extraction
  const metadata = await safeBotpressOperation(
    () => extractUserMetadata(clerkUser),
    'extract user metadata'
  )

  if (!metadata) {
    console.log('Failed to extract metadata, using anonymous mode')
    return createAnonymousUrl()
  }

  // Safe URL creation
  const url = await safeBotpressOperation(
    () => createBotpressUrlForUser(clerkUser, { defaultTheme: 'light' }),
    'create user URL'
  )

  if (!url) {
    console.log('Failed to create user URL, fallback to basic URL')
    return createBasicUrl()
  }

  return url
}

/**
 * EXAMPLE 8: Custom Payload Integration
 * Send complex data to Botpress through custom payloads
 */
export function customPayloadExample() {
  const params: BotpressUrlParams = {
    theme: 'light',
    language: 'es',
    stage: 'newborn',
    source: 'custom_payload'
  }

  return buildBotpressUrl(params)
}

// Helper functions for examples
function createAnonymousUrl(): string {
  return buildBotpressUrl({
    theme: 'light',
    language: 'es',
    source: 'anonymous'
  })
}

function createBasicUrl(): string {
  return buildBotpressUrl({
    theme: 'light',
    language: 'es'
  })
}

/**
 * EXAMPLE 9: React Hook Integration Template
 * Template for creating a custom hook for React components
 */
export function useBotpressUrlTemplate() {
  const hookTemplate = `
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { createBotpressUrlForUser, safeBotpressOperation } from '@/lib/botpress-utils'

export function useBotpressUrl(options = {}) {
  const { user, isLoaded } = useUser()
  const [url, setUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isLoaded) return

    const generateUrl = async () => {
      try {
        setLoading(true)
        setError(null)

        const botpressUrl = await safeBotpressOperation(
          () => createBotpressUrlForUser(user, options),
          'generate Botpress URL'
        )

        setUrl(botpressUrl)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    generateUrl()
  }, [isLoaded, user, JSON.stringify(options)])

  return { url, loading, error }
}
  `
  
  return hookTemplate
}

/**
 * EXAMPLE 10: Advanced Integration Pattern
 * Complete integration with error recovery and fallbacks
 */
export async function advancedIntegrationExample(clerkUser: UserResource) {
  try {
    // Step 1: Validate environment
    const envValidation = validateBotpressEnvironment()
    if (!envValidation.isValid) {
      throw new Error(`Environment validation failed: ${envValidation.errors.join(', ')}`)
    }

    // Step 2: Extract user metadata with fallbacks
    const metadata = extractUserMetadata(clerkUser) || {
      id: clerkUser.id,
      source: 'clerk' as const,
      timestamp: new Date().toISOString()
    }
    
    // Step 3: Determine user context and customize accordingly
    const contextualOptions = determineContextualOptions(metadata)
    
    // Step 4: Create URL with all context
    const url = createBotpressUrlForUser(clerkUser, contextualOptions)
    
    // Step 5: Log for analytics (in production, send to your analytics service)
    logBotpressIntegration(metadata, url)
    
    return {
      success: true,
      url,
      metadata,
      options: contextualOptions
    }
  } catch (error) {
    // Fallback to anonymous URL
    console.error('Advanced integration failed, using fallback:', error)
    
    return {
      success: false,
      url: createAnonymousUrl(),
      metadata: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

function determineContextualOptions(metadata: BotpressUserMetadata): BotpressConfiguration {
  const options: BotpressConfiguration = {
    defaultTheme: 'light',
    defaultLanguage: metadata.language || 'es',
    debug: process.env.NODE_ENV === 'development'
  }

  return options
}

function logBotpressIntegration(metadata: BotpressUserMetadata, url: string) {
  // In a real application, you would send this to your analytics service
  const logData = {
    timestamp: new Date().toISOString(),
    userId: metadata.id,
    stage: metadata.stage,
    childAge: metadata.childAge,
    feedingMethod: metadata.feedingMethod,
    language: metadata.language,
    urlGenerated: true,
    urlLength: url.length
  }
  
  console.log('[Botpress Integration]', logData)
}

// Re-export utilities for convenience
export {
  buildBotpressUrl,
  createBotpressUrlForUser,
  extractUserMetadata,
  validateBotpressParams,
  getDefaultBotpressConfiguration,
  safeBotpressOperation,
  validateBotpressEnvironment
} from './botpress-utils'