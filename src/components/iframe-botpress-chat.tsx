'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Loader2, RefreshCw, AlertTriangle, MessageCircle } from 'lucide-react'

interface IframeBotpressChatProps {
  className?: string
  style?: React.CSSProperties
}

const IFRAME_URL = "https://cdn.botpress.cloud/webchat/v3.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/08/23/00/20250823001639-J61VAXD4.json"

export default function IframeBotpressChat({ className, style }: IframeBotpressChatProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Maximum retry attempts
  const MAX_RETRIES = 3
  
  // Loading timeout duration (10 seconds)
  const LOADING_TIMEOUT = 10000

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
    setIsRetrying(false)
    
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Post-load optimization for iOS Safari
    if (iframeRef.current) {
      try {
        // Focus optimization for better mobile performance
        const iframe = iframeRef.current
        iframe.style.pointerEvents = 'auto'
        
        // Add hardware acceleration class
        iframe.classList.add('hw-accelerated')
      } catch (error) {
        console.debug('Iframe post-load optimization failed:', error)
      }
    }
  }, [])

  const handleIframeError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    setIsRetrying(false)
    
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    console.error('Iframe failed to load Botpress chat')
  }, [])

  const handleRetry = useCallback(() => {
    if (retryCount >= MAX_RETRIES) {
      console.error(`Max retries (${MAX_RETRIES}) reached for Botpress iframe`)
      return
    }

    setIsRetrying(true)
    setIsLoading(true)
    setHasError(false)
    setRetryCount(prev => prev + 1)

    // Force iframe reload by updating src
    if (iframeRef.current) {
      const newUrl = `${IFRAME_URL}&retry=${retryCount + 1}&t=${Date.now()}`
      iframeRef.current.src = newUrl
    }

    // Set loading timeout
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false)
      setHasError(true)
      setIsRetrying(false)
    }, LOADING_TIMEOUT)
  }, [retryCount])

  // Set initial loading timeout
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (isLoading && !hasError) {
        setIsLoading(false)
        setHasError(true)
      }
    }, LOADING_TIMEOUT)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isLoading, hasError])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div 
      className={`iframe-chat-container h-full w-full relative bg-white ${className || ''}`}
      style={{
        // Debug: Add blue border to see container boundaries
        ...(process.env.NODE_ENV === 'development' && {
          border: '2px solid blue',
          boxSizing: 'border-box'
        }),
        ...style
      }}
    >
      {/* Loading State */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 z-10">
          <div className="text-center space-y-4">
            <div className="relative">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
              <div className="absolute inset-0 w-8 h-8 border-2 border-purple-200 rounded-full animate-pulse mx-auto" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">
                {isRetrying ? 'Reintentando conexión...' : 'Iniciando Bress...'}
              </h3>
              <p className="text-xs text-gray-500 max-w-48 mx-auto">
                Tu asistente de crianza se está preparando
              </p>
              {retryCount > 0 && (
                <p className="text-xs text-purple-600">
                  Intento {retryCount} de {MAX_RETRIES}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 z-10 p-6">
          <div className="text-center space-y-4 max-w-sm">
            <div className="relative">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-800">
                Error de conexión
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                No pudimos cargar el chat de Bress. Verifica tu conexión a internet.
              </p>
            </div>

            {/* Retry Button */}
            {retryCount < MAX_RETRIES && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-purple-600/20 hover:shadow-xl hover:shadow-purple-600/30 transform hover:scale-105 active:scale-100 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Reintentando...' : 'Reintentar'}
              </button>
            )}

            {/* Maximum retries reached */}
            {retryCount >= MAX_RETRIES && (
              <div className="space-y-3">
                <p className="text-xs text-red-600 font-medium">
                  Máximo de intentos alcanzado
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 transition-all duration-300 ease-out"
                >
                  <RefreshCw className="w-4 h-4" />
                  Recargar página
                </button>
              </div>
            )}

            {/* Technical Info */}
            <details className="text-left">
              <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
                Información técnica
              </summary>
              <div className="mt-2 p-2 bg-gray-100 rounded-lg text-xs text-gray-600 font-mono">
                <p>URL: {IFRAME_URL}</p>
                <p>Intentos: {retryCount}/{MAX_RETRIES}</p>
                <p>Timestamp: {new Date().toISOString()}</p>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        src={IFRAME_URL}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        className="w-full h-full border-0 bg-transparent"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '100%', // Force minimum height
          border: 'none',
          background: 'transparent',
          // Hardware acceleration
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform, opacity',
          // iOS Safari optimizations
          WebkitOverflowScrolling: 'touch',
          WebkitTextSizeAdjust: '100%',
          // Debug: Add red border to see iframe boundaries
          ...(process.env.NODE_ENV === 'development' && {
            border: '2px solid red',
            boxSizing: 'border-box'
          }),
          ...style
        }}
        title="Bress - Asistente para padres primerizos"
        allow="camera; microphone; autoplay; encrypted-media; fullscreen; picture-in-picture; display-capture"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals"
        loading="eager"
        // Accessibility attributes
        role="application"
        aria-label="Chat de Bress - Asistente inteligente para padres"
        aria-describedby="bress-chat-description"
      />

      {/* Screen reader description */}
      <div id="bress-chat-description" className="sr-only">
        Chat interactivo con Bress, tu asistente inteligente para consultas sobre crianza, 
        basado en evidencia científica de organizaciones como OMS, AAP, ACOG, CDC y NHS.
      </div>

      {/* Connection Status Indicator (bottom right) */}
      <div className="absolute bottom-2 right-2 z-20 pointer-events-none">
        {!isLoading && !hasError && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-500/90 text-white text-xs rounded-full backdrop-blur-sm">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Conectado
          </div>
        )}
        {hasError && (
          <div className="flex items-center gap-1 px-2 py-1 bg-red-500/90 text-white text-xs rounded-full backdrop-blur-sm">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
            Sin conexión
          </div>
        )}
      </div>
    </div>
  )
}