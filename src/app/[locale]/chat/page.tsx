'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import { LogOut, User, Loader2, AlertTriangle } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { createBotpressUrlForUser, validateBotpressEnvironment, safeBotpressOperation } from '@/lib/botpress-utils'
import BotpressIframeCustomizer from '@/components/botpress-iframe-customizer'
import { trackOpenWebchat, trackSignIn, startTimer, endTimer } from '@/lib/analytics'
// import BotpressChatWrapper from '@/components/botpress-chat-wrapper'

export default function ChatPage() {
  const t = useTranslations('chat')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { user, isLoaded, isSignedIn } = useUser()
  const [urlError, setUrlError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // Construir URL de Botpress dinámicamente basada en el usuario
  const [botpressUrl, setBotpressUrl] = useState<string | null>(null)
  
  const createUrl = useMemo(() => {
    if (!isLoaded) return null

    return () => createBotpressUrlForUser(
      user || null,
      {
        debug: process.env.NODE_ENV === 'development',
        autoOpen: true,
        defaultTheme: 'light',
        defaultLanguage: 'es'
      },
      {
        botName: 'Bress',
        color: 'hsl(245,78%,60%)',
        variant: 'soft'
      }
    )
  }, [user, isLoaded])

  // Validar entorno de Botpress al montar
  useEffect(() => {
    const validateEnvironment = async () => {
      try {
        const validation = validateBotpressEnvironment()
        
        if (!validation.isValid) {
          console.error('❌ Botpress environment validation failed:', validation.errors)
          setUrlError('Error de configuración del chat. Por favor, contacta al soporte.')
          return
        }

        if (validation.warnings.length > 0 && process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Botpress environment warnings:', validation.warnings)
        }

        // Crear URL usando la función memoizada
        if (createUrl) {
          const urlResult = await safeBotpressOperation(createUrl, 'create-user-botpress-url')
          
          if (!urlResult) {
            throw new Error('Failed to create Botpress URL')
          }

          if (process.env.NODE_ENV === 'development') {
            console.log('🤖 Botpress URL created:', urlResult.substring(0, 100) + '...')
          }

          setBotpressUrl(urlResult)
          setUrlError(null)
        } else {
          throw new Error('URL creation function not available')
        }
      } catch (error) {
        console.error('❌ Error initializing Botpress:', error)
        setUrlError('Error al cargar el chat. Por favor, recarga la página.')
      } finally {
        setIsInitializing(false)
      }
    }

    if (isLoaded && createUrl) {
      validateEnvironment()
    }
  }, [isLoaded, createUrl])

  // FASE 1: Analytics Tracking
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Track successful sign in - KEY EVENT
      trackSignIn()
      // Track opening webchat from chat page - KEY EVENT
      trackOpenWebchat('chat_page')
    }
  }, [isLoaded, isSignedIn])

  // Estados de carga
  const isLoading = !isLoaded || isInitializing
  const hasError = !!urlError

  return (
    <div className="h-screen-safe overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
      
      {/* Mobile Minimalista Expandible - Desktop Header Normal */}
      <header className={`relative flex-shrink-0 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm transition-all duration-300 ${
        showMobileMenu 
          ? 'h-10 lg:h-12' // Altura fija, menu flotante
          : 'h-10 lg:h-12' // Más compacto en móvil y desktop
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          {/* Mobile Minimalista */}
          <div className="lg:hidden flex items-center justify-between h-full">
            {/* Mobile: Solo logo pequeño y menú toggle */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-[hsl(245,78%,60%)] to-[hsl(174,100%,37%)] rounded-lg overflow-hidden">
                <img 
                  src="/bress-logo.png" 
                  alt="Bress" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-xs font-bold gradient-text-bress">Baby Sapiens</h1>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>

          {/* Desktop Header Normal */}
          <div className="hidden lg:flex items-center justify-between h-full">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-[hsl(245,78%,60%)] to-[hsl(174,100%,37%)] rounded-lg shadow-sm overflow-hidden">
                <img 
                  src="/bress-logo.png" 
                  alt="Bress" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-sm font-bold gradient-text-bress">Baby Sapiens</h1>
                <p className="text-xs text-gray-500">{t('subtitle')}</p>
              </div>
            </div>

            {/* User Profile */}
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-7 h-7"
                }
              }}
            />
          </div>

        </div>
      </header>

      {/* Chat Container - Fullscreen optimized */}
      <main className="flex-1 overflow-hidden p-0 lg:p-2 h-main-safe">
        <div className="w-full h-full mx-auto chat-container">
          <div className="h-full bg-white rounded-none lg:rounded-lg shadow-none lg:shadow-sm border-0 lg:border lg:border-gray-200/60 overflow-hidden chat-container">
            {/* Loading State */}
            {isLoading && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[hsl(245,78%,60%)] to-[hsl(174,100%,37%)] rounded-2xl mx-auto flex items-center justify-center overflow-hidden">
                    <img 
                      src="/bress-logo.png" 
                      alt="Bress" 
                      className="w-10 h-10 object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-[hsl(245,78%,60%)]" />
                    <span className="text-sm text-gray-600 font-medium">
                      {!isLoaded ? 'Iniciando sesión...' : 'Preparando chat...'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Configurando tu experiencia personalizada con Bress
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {!isLoading && hasError && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-6">
                <div className="text-center space-y-4 max-w-md">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl mx-auto flex items-center justify-center relative">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Problema con el chat
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{urlError}</p>
                  </div>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gradient-to-r from-[hsl(245,78%,60%)] to-[hsl(174,100%,37%)] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Recargar página
                  </button>
                </div>
              </div>
            )}

            {/* Chat Content */}
            {!isLoading && !hasError && botpressUrl && (
              <div style={{ width: '100%', height: '100%' }} className="botpress-iframe-container relative">
                <BotpressIframeCustomizer />
                <iframe
                  src={botpressUrl}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: 'transparent'
                  }}
                  title={`Chat personalizado de Bress${user ? ` para ${user.firstName || 'Usuario'}` : ''}`}
                  allow="camera; microphone; autoplay; encrypted-media; fullscreen; picture-in-picture; display-capture"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals"
                  onLoad={() => {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('✅ Botpress iframe loaded successfully')
                    }
                  }}
                  onError={() => {
                    console.error('❌ Botpress iframe failed to load')
                    setUrlError('Error al cargar el chat. Por favor, recarga la página.')
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Full-Screen Modal Overlay - Outside all containers */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-[10000] flex flex-col">
          {/* Full-screen backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-t-3xl shadow-2xl flex-1 flex flex-col mt-16">
            {/* Modal Header with close button */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[hsl(245,78%,60%)] to-[hsl(174,100%,37%)] rounded-xl overflow-hidden">
                  <img 
                    src="/bress-logo.png" 
                    alt="Baby Sapiens" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Baby Sapiens</h2>
                  <p className="text-sm text-gray-500">{t('subtitle')}</p>
                </div>
              </div>
              
              {/* Close button */}
              <button
                onClick={() => setShowMobileMenu(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* User Profile Section */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Perfil de usuario</h3>
                <div className="flex items-center justify-center">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-16 h-16",
                        userButtonBox: "flex-col items-center gap-3",
                        userButtonOuterBox: "flex-col items-center"
                      }
                    }}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900">Configuración</h3>
                
                <button className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Mi perfil</p>
                      <p className="text-sm text-gray-500">Gestionar información personal</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Ayuda y soporte</p>
                      <p className="text-sm text-gray-500">Preguntas frecuentes y contacto</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowMobileMenu(false)}
                className="w-full py-3 px-4 bg-gradient-to-r from-[hsl(245,78%,60%)] to-[hsl(174,100%,37%)] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Cerrar menú
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}