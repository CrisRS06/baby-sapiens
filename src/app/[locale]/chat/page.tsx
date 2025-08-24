'use client'

import { useEffect, useRef } from 'react'
import { UserButton } from '@clerk/nextjs'
import { Baby, Heart, Moon, Sparkles, Star, MessageCircle } from 'lucide-react'
import Script from 'next/script'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/navigation'

export default function ChatPage() {
  const webchatRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef(false)
  const t = useTranslations('chat')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()


  useEffect(() => {
    // Inject custom styles for Bress webchat
    const style = document.createElement('style')
    style.textContent = `
      #webchat {
        width: 100% !important;
        height: 100% !important;
        min-height: 500px !important;
        display: flex !important;
        flex-direction: column !important;
      }
      
      #webchat .bpWebchat {
        position: unset !important;
        width: 100% !important;
        height: 100% !important;
        max-height: 100% !important;
        max-width: 100% !important;
      }

      #webchat .bpFab {
        display: none !important;
      }
      
      #webchat iframe {
        width: 100% !important;
        height: 100% !important;
        border-radius: 1.5rem !important;
        min-height: 400px !important;
        box-shadow: 0 0 50px rgba(139, 92, 246, 0.08) !important;
      }
      
      /* Responsive adjustments */
      @media (max-width: 768px) {
        #webchat iframe {
          min-height: 350px !important;
          border-radius: 1rem !important;
        }
      }
      
      /* Hide Botpress branding */
      #webchat .bpw-powered-by {
        display: none !important;
      }

      /* Custom Bress theme overrides */
      #webchat .bpw-header {
        background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%) !important;
      }

      #webchat .bpw-from-bot .bpw-chat-bubble {
        background: linear-gradient(135deg, #f3e8ff 0%, #e0f2fe 100%) !important;
        color: #4c1d95 !important;
      }

      #webchat .bpw-from-user .bpw-chat-bubble {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      style.remove()
    }
  }, [])

  const initializeBotpress = () => {
    // Prevent double initialization
    if (isInitialized.current) return
    
    // Check if botpress is available on window
    if (typeof window !== 'undefined' && (window as any).botpress) {
      console.log('[Bress] Initializing webchat...')
      isInitialized.current = true

      // Listen for ready event BEFORE initializing
      ;(window as any).botpress.on("webchat:ready", () => {
        console.log('[Bress] Webchat ready, opening...')
        ;(window as any).botpress.open()
      })

      // Initialize with Bress configuration
      ;(window as any).botpress.init({
        "botId": "cb13f3bc-fe1c-4c9a-810b-e991283cd9e6",
        "configuration": {
          "version": "v1",
          "composerPlaceholder": "Escribe tu duda (edad del bebé + tema). Ej.: 'Bebé 4 m • se despierta cada 2 h'",
          "botName": "Bress: Asistente para padres primerizos",
          "botAvatar": "https://files.bpcontent.cloud/2025/08/23/00/20250823004944-C94MYIP5.png",
          "botDescription": "Guía breve y accionable, basada en evidencia (OMS, AAP, ACOG, CDC, NHS/NICE) para embarazo → 5 años: sueño, alimentación, desarrollo, salud mental y seguridad. No sustituye atención médica.",
          "fabImage": "https://files.bpcontent.cloud/2025/08/23/00/20250823004944-C94MYIP5.png",
          "website": {},
          "email": {},
          "phone": {},
          "termsOfService": {},
          "privacyPolicy": {},
          "color": "#3276EA",
          "variant": "solid",
          "headerVariant": "glass",
          "themeMode": "light",
          "fontFamily": "inter",
          "radius": 4,
          "feedbackEnabled": true,
          "footer": "[⚡ by Baby Sapiens]"
        },
        "clientId": "f657ad35-3575-4861-92bd-e52dac005765",
        "selector": "#webchat"
      })

      console.log('[Bress] Initialization complete')
      
      // Force open the webchat after initialization
      setTimeout(() => {
        if ((window as any).botpress && (window as any).botpress.open) {
          console.log('[Bress] Force opening webchat...')
          ;(window as any).botpress.open()
        }
      }, 500)
    } else {
      console.log('[Bress] Not ready yet, retrying...')
      setTimeout(initializeBotpress, 100)
    }
  }

  return (
    <div className="h-screen flex flex-col gradient-bg-organic relative overflow-hidden">
      {/* Animated decorative elements */}
      <div className="blob-purple w-64 h-64 -top-32 -left-32 opacity-30" />
      <div className="blob-turquoise w-64 h-64 -bottom-32 -right-32 opacity-30" />
      <Star className="w-6 h-6 decoration-star absolute top-20 right-20 animate-float" />
      <Star className="w-4 h-4 decoration-star absolute bottom-20 left-20 animate-gentle-pulse" />

      {/* Load Botpress Script */}
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.2/inject.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('[Bress] Script loaded')
          initializeBotpress()
        }}
        onError={() => {
          console.error('[Bress] Failed to load script')
        }}
      />

      {/* Header - Fixed height with purple gradient */}
      <div className="glass-card border-b border-purple-200/30 bg-gradient-to-r from-purple-50/80 via-white/90 to-cyan-50/80 backdrop-blur-xl flex-shrink-0 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[hsl(245,78%,60%)] to-[hsl(174,100%,37%)] rounded-xl shadow-glow overflow-hidden">
                  <img 
                    src="/bress-logo.png" 
                    alt="Bress Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold gradient-text-bress text-lg">Bress</h1>
                <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
              </div>
              <div className="block sm:hidden">
                <h1 className="font-bold text-sm gradient-text-bress">Bress</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Flex grow to fill remaining space */}
      <div className="flex-1 overflow-hidden px-4 py-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          {/* Info Cards - Baby-themed with icons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-4 flex-shrink-0">
            <div className="neo-soft p-2 sm:p-3 border border-purple-200/30">
              <h3 className="font-semibold text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1 flex items-center gap-2">
                <span className="text-lg">{t('features.diagnosis.title').split(' ')[0]}</span>
                {t('features.diagnosis.title').split(' ').slice(1).join(' ')}
              </h3>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {t('features.diagnosis.description')}
              </p>
            </div>
            <div className="neo-soft p-2 sm:p-3 border border-cyan-200/30">
              <h3 className="font-semibold text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1 flex items-center gap-2">
                <span className="text-lg">{t('features.optimization.title').split(' ')[0]}</span>
                {t('features.optimization.title').split(' ').slice(1).join(' ')}
              </h3>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {t('features.optimization.description')}
              </p>
            </div>
            <div className="neo-soft p-2 sm:p-3 border border-green-200/30">
              <h3 className="font-semibold text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1 flex items-center gap-2">
                <span className="text-lg">{t('features.materials.title').split(' ')[0]}</span>
                {t('features.materials.title').split(' ').slice(1).join(' ')}
              </h3>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {t('features.materials.description')}
              </p>
            </div>
          </div>

          {/* Webchat Container - Enhanced with baby-friendly design */}
          <div className="flex-1 glass-card bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-xl border border-purple-200/30 rounded-3xl shadow-glass-lg p-4 sm:p-6 overflow-hidden relative">
            {/* Decorative corner elements */}
            <div className="absolute top-2 left-2 animate-gentle-pulse">
              <Heart className="w-6 h-6 decoration-heart opacity-30" />
            </div>
            <div className="absolute bottom-2 right-2 animate-float">
              <Star className="w-5 h-5 decoration-star opacity-30" />
            </div>
            
            <div 
              id="webchat" 
              ref={webchatRef}
              className="w-full h-full rounded-2xl relative z-10"
              style={{ minHeight: '500px' }}
            />
          </div>

          {/* Quick Tips */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3 text-purple-500" />
              <span>Pregunta sobre crianza</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <Heart className="w-3 h-3 text-cyan-500" />
              <span>Respuestas con evidencia</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>Orientación personalizada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}