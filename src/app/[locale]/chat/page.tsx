'use client'

import { useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { Heart, Sparkles, Star, MessageCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Webchat, Fab } from '@botpress/webchat'

const clientId = "f657ad35-3575-4861-92bd-e52dac005765"

export default function ChatPage() {
  const t = useTranslations('chat')
  const [isWebchatOpen, setIsWebchatOpen] = useState(true) // Siempre abierto en nuestro caso

  return (
    <div className="h-screen flex flex-col gradient-bg-organic relative overflow-y-auto">
      {/* Animated decorative elements - Hidden on mobile */}
      <div className="hidden sm:block blob-purple w-64 h-64 -top-32 -left-32 opacity-30" />
      <div className="hidden sm:block blob-turquoise w-64 h-64 -bottom-32 -right-32 opacity-30" />
      <Star className="hidden sm:block w-6 h-6 decoration-star absolute top-20 right-20 animate-float" />
      <Star className="hidden sm:block w-4 h-4 decoration-star absolute bottom-20 left-20 animate-gentle-pulse" />

      {/* Header - Fixed height with purple gradient */}
      <div className="glass-card border-b border-purple-200/30 bg-gradient-to-r from-purple-50/80 via-white/90 to-cyan-50/80 backdrop-blur-xl flex-shrink-0 relative z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-16">
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

      {/* Main Content - Full viewport on mobile for maximum chat space */}
      <div className="flex-1 p-0 sm:px-6 sm:py-4 lg:px-8 relative z-10 min-h-0">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          {/* Info Cards - Baby-themed with icons - Hidden on mobile for better chat UX */}
          <div className="hidden sm:grid sm:grid-cols-3 gap-4 mb-4 flex-shrink-0">
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

          {/* Webchat Container - Full viewport on mobile */}
          <div className="flex-1 bg-white sm:glass-card sm:bg-gradient-to-br sm:from-white/90 sm:to-purple-50/50 sm:backdrop-blur-xl sm:border sm:border-purple-200/30 sm:rounded-3xl sm:shadow-glass-lg p-0 sm:p-6 overflow-hidden relative min-h-0">
            {/* Decorative corner elements - Hidden on mobile */}
            <div className="hidden sm:block absolute top-2 left-2 animate-gentle-pulse">
              <Heart className="w-6 h-6 decoration-heart opacity-30" />
            </div>
            <div className="hidden sm:block absolute bottom-2 right-2 animate-float">
              <Star className="w-5 h-5 decoration-star opacity-30" />
            </div>
            
            {/* Native React Botpress Webchat */}
            <div className="w-full h-full relative z-10">
              <Webchat
                clientId={clientId}
                configuration={{
                  botName: "Bress: Asistente para padres primerizos",
                  botAvatar: "https://files.bpcontent.cloud/2025/08/23/00/20250823004944-C94MYIP5.png",
                  botDescription: "Guía breve y accionable, basada en evidencia (OMS, AAP, ACOG, CDC, NHS/NICE) para embarazo → 5 años: sueño, alimentación, desarrollo, salud mental y seguridad. No sustituye atención médica.",
                  composerPlaceholder: "Escribe tu duda (edad del bebé + tema). Ej.: 'Bebé 4 m • se despierta cada 2 h'",
                  color: "#8b5cf6",
                  variant: "solid",
                  themeMode: "light",
                  fontFamily: "inter",
                  showPoweredBy: false,
                  footer: "[⚡ by Baby Sapiens]"
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: 'calc(100vh - 70px)',
                  display: 'flex'
                }}
                className="rounded-none sm:rounded-2xl"
              />
            </div>
          </div>

          {/* Quick Tips - Hidden on mobile for better chat UX */}
          <div className="mt-4 hidden sm:flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3 text-purple-500" />
              <span>Pregunta sobre crianza</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-cyan-500" />
              <span>Respuestas con evidencia</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>Orientación personalizada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}