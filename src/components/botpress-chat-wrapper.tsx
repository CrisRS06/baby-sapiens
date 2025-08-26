'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Dynamic imports for code splitting optimization
const IframeBotpressChat = dynamic(
  () => import('./iframe-botpress-chat'),
  {
    ssr: false,
    loading: () => <ChatLoadingFallback message="Cargando chat iframe..." />
  }
)

const RealBotpressChat = dynamic(
  () => import('./real-botpress-chat'),
  {
    ssr: false,
    loading: () => <ChatLoadingFallback message="Cargando chat React..." />
  }
)

interface BotpressChatWrapperProps {
  className?: string
  style?: React.CSSProperties
  /** Override environment variable for feature flag */
  forceImplementation?: 'iframe' | 'react' | null
}

function ChatLoadingFallback({ message }: { message: string }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="text-center space-y-4">
        <div className="relative">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <div className="absolute inset-0 w-8 h-8 border-2 border-purple-200 rounded-full animate-pulse mx-auto" />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">{message}</h3>
          <p className="text-xs text-gray-500 max-w-48 mx-auto">
            Tu asistente de crianza se está preparando
          </p>
        </div>
      </div>
    </div>
  )
}

export default function BotpressChatWrapper({ 
  className, 
  style, 
  forceImplementation 
}: BotpressChatWrapperProps) {
  // Feature flag logic with override capability
  const shouldUseIframe = (() => {
    // Override takes precedence
    if (forceImplementation === 'iframe') return true
    if (forceImplementation === 'react') return false
    
    // Check environment variable
    const envFlag = process.env.NEXT_PUBLIC_USE_IFRAME_CHAT
    return envFlag === 'true' || envFlag === '1'
  })()

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.debug('BotpressChatWrapper configuration:', {
      shouldUseIframe,
      envFlag: process.env.NEXT_PUBLIC_USE_IFRAME_CHAT,
      forceImplementation,
      implementationUsed: shouldUseIframe ? 'iframe' : 'react'
    })
  }

  return (
    <div className="h-full w-full relative">
      {/* Implementation Switch */}
      <Suspense 
        fallback={
          <ChatLoadingFallback 
            message={shouldUseIframe ? "Cargando chat iframe..." : "Cargando chat React..."} 
          />
        }
      >
        {shouldUseIframe ? (
          <IframeBotpressChat 
            className={className}
            style={style}
          />
        ) : (
          <RealBotpressChat 
            className={className}
            style={style}
          />
        )}
      </Suspense>

      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 z-50 pointer-events-none">
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/90 text-white text-xs rounded-full backdrop-blur-sm font-mono">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
            {shouldUseIframe ? 'IFRAME' : 'REACT'}
          </div>
        </div>
      )}

      {/* Feature Flag Info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-2 left-2 z-50 pointer-events-none">
          <details className="text-left">
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition-colors bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
              Implementation Info
            </summary>
            <div className="mt-1 p-2 bg-white/95 backdrop-blur-sm rounded-lg text-xs text-gray-600 font-mono shadow-lg border border-gray-200">
              <div className="space-y-1">
                <p><strong>Implementation:</strong> {shouldUseIframe ? 'Iframe' : 'React Component'}</p>
                <p><strong>Environment Flag:</strong> {process.env.NEXT_PUBLIC_USE_IFRAME_CHAT || 'undefined'}</p>
                <p><strong>Force Override:</strong> {forceImplementation || 'none'}</p>
                <p><strong>Decision Logic:</strong> 
                  {forceImplementation 
                    ? `Override: ${forceImplementation}` 
                    : `Env: ${process.env.NEXT_PUBLIC_USE_IFRAME_CHAT === 'true' ? 'iframe' : 'react'}`
                  }
                </p>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}

// Named export for specific implementation access
export { IframeBotpressChat, RealBotpressChat }