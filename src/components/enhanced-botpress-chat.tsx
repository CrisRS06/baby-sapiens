'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import dynamic from 'next/dynamic'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { 
  createBotpressUrlForUser,
  getDefaultBotpressConfiguration,
  validateBotpressEnvironment,
  extractUserMetadata,
  safeBotpressOperation,
  type BotpressConfiguration,
  type ValidationResult
} from '@/lib/botpress-utils'

// Dynamic import for Botpress Webchat
const Webchat = dynamic(
  () => import('@botpress/webchat').then((mod) => mod.Webchat),
  {
    ssr: false,
    loading: () => <LoadingState />
  }
)

interface EnhancedBotpressChatProps {
  className?: string
  style?: React.CSSProperties
  configOverrides?: Partial<BotpressConfiguration>
  onChatReady?: () => void
  onError?: (error: string) => void
  debug?: boolean
}

function LoadingState() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-50/30 to-cyan-50/30">
      <div className="text-center space-y-4">
        <div className="relative">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <div className="absolute inset-0 w-8 h-8 border-2 border-purple-200 rounded-full animate-pulse mx-auto" />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Iniciando Bress...</h3>
          <p className="text-xs text-gray-500 max-w-48 mx-auto">
            Tu asistente de crianza se está preparando
          </p>
        </div>
      </div>
    </div>
  )
}

function ErrorState({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-red-50/30 to-orange-50/30 p-4">
      <div className="text-center space-y-4 max-w-sm">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-red-700">Error de conexión</h3>
          <p className="text-xs text-red-600">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-red-700 hover:text-red-800 underline transition-colors"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EnhancedBotpressChat({
  className,
  style,
  configOverrides = {},
  onChatReady,
  onError,
  debug = false
}: EnhancedBotpressChatProps) {
  const { user, isLoaded: isUserLoaded } = useUser()
  const [chatUrl, setChatUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [envValidation, setEnvValidation] = useState<ValidationResult | null>(null)
  const [userMetadata, setUserMetadata] = useState<ReturnType<typeof extractUserMetadata> | null>(null)
  
  // Validate environment on mount
  useEffect(() => {
    const validation = validateBotpressEnvironment()
    setEnvValidation(validation)
    
    if (!validation.isValid) {
      const errorMessage = `Environment validation failed: ${validation.errors.join(', ')}`
      setError(errorMessage)
      onError?.(errorMessage)
      return
    }

    if (validation.warnings.length > 0 && debug) {
      console.warn('[Enhanced Botpress Chat] Environment warnings:', validation.warnings)
    }
  }, [debug, onError])

  // Initialize chat when user data is loaded
  useEffect(() => {
    if (!isUserLoaded || !envValidation?.isValid) return

    const initializeChat = async () => {
      try {
        // Extract user metadata
        const metadata = await safeBotpressOperation(
          () => extractUserMetadata(user),
          'extract user metadata'
        )

        if (!metadata) {
          throw new Error('Failed to extract user metadata')
        }

        setUserMetadata(metadata)

        // Create Botpress URL with user context
        const url = await safeBotpressOperation(
          () => createBotpressUrlForUser(user, {
            defaultLanguage: 'es',
            defaultTheme: 'light'
          }),
          'create Botpress URL for user'
        )

        if (!url) {
          throw new Error('Failed to create Botpress URL')
        }

        setChatUrl(url)
        onChatReady?.()

        if (debug) {
          console.debug('[Enhanced Botpress Chat] Initialization complete:', {
            url,
            metadata,
            user: user?.id
          })
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown initialization error'
        setError(errorMessage)
        onError?.(errorMessage)
        
        if (debug) {
          console.error('[Enhanced Botpress Chat] Initialization failed:', err)
        }
      }
    }

    initializeChat()
  }, [isUserLoaded, user, envValidation, onChatReady, onError, debug])

  // Error state
  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          setError(null)
          setChatUrl(null)
        }}
      />
    )
  }

  // Loading state
  if (!isUserLoaded || !chatUrl) {
    return <LoadingState />
  }

  // Get configuration
  const configuration = {
    ...getDefaultBotpressConfiguration(),
    ...configOverrides
  }

  return (
    <div className={`h-full w-full relative component-isolated ${className || ''}`} style={style}>
      {/* Debug panel */}
      {debug && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 z-50 max-w-xs">
          <details className="text-left bg-white/95 backdrop-blur-sm rounded-lg text-xs shadow-lg border border-gray-200">
            <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800 transition-colors p-2 font-semibold">
              Debug Info
            </summary>
            <div className="p-2 space-y-2 text-xs text-gray-600 font-mono border-t border-gray-200">
              <div><strong>User ID:</strong> {user?.id || 'Anonymous'}</div>
              <div><strong>Language:</strong> {userMetadata?.language || 'default'}</div>
              <div><strong>Stage:</strong> {userMetadata?.stage || 'unknown'}</div>
              <div><strong>Age:</strong> {userMetadata?.childAge ? `${userMetadata.childAge}` : 'N/A'}</div>
              <div><strong>Feeding:</strong> {userMetadata?.feedingMethod || 'unknown'}</div>
              {envValidation?.warnings && envValidation.warnings.length > 0 && (
                <div className="text-yellow-600">
                  <strong>Warnings:</strong> {envValidation.warnings.length}
                </div>
              )}
            </div>
          </details>
        </div>
      )}

      {/* Botpress Webchat */}
      <Webchat
        clientId={process.env.NEXT_PUBLIC_BOTPRESS_CLIENT_ID!}
        configuration={{
          botName: 'Bress',
          composerPlaceholder: userMetadata?.language === 'en' 
            ? "Type your question (baby age + topic). Ex: '4mo baby • wakes every 2h'"
            : "Escribe tu duda (edad del bebé + tema). Ej.: 'Bebé 4 m • se despierta cada 2 h'",
          themeMode: 'light',
          variant: 'solid'
        }}
        className="hw-accelerated"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%'
        }}
      />

      {/* User context indicator */}
      {userMetadata && (
        <div className="absolute bottom-2 left-2 z-40 pointer-events-none">
          <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-700 text-xs rounded-full backdrop-blur-sm">
            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
            {userMetadata.name && (
              <span>Hola, {userMetadata.name}</span>
            )}
            {userMetadata.stage && userMetadata.stage !== 'unknown' && (
              <span className="text-purple-600">• {userMetadata.stage}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}