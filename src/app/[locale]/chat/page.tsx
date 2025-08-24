'use client'

import { UserButton } from '@clerk/nextjs'
import { Heart, Sparkles, Star, MessageCircle, Baby, Moon, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Webchat } from '@botpress/webchat'

const clientId = "f657ad35-3575-4861-92bd-e52dac005765"

export default function ChatPage() {
  const t = useTranslations('chat')

  return (
    <div className="min-h-screen gradient-bg-organic relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="blob-purple w-96 h-96 -top-48 -left-48 opacity-20" />
      <div className="blob-turquoise w-80 h-80 -bottom-32 -right-32 opacity-15" />
      
      {/* Floating Stars */}
      <Star className="w-4 h-4 decoration-star absolute top-20 left-[15%] animate-float text-purple-300/40" />
      <Star className="w-3 h-3 decoration-star absolute top-40 right-[20%] animate-gentle-pulse text-cyan-300/40" />
      <Heart className="w-4 h-4 decoration-heart absolute bottom-32 left-[25%] animate-float text-pink-300/40" />
      <Sparkles className="w-3 h-3 decoration-sparkles absolute bottom-20 right-[30%] animate-gentle-pulse text-purple-300/40" />

      {/* Header */}
      <header className="relative z-20 border-b border-white/20 backdrop-blur-xl bg-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo y Título */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[hsl(245,78%,60%)] to-[hsl(174,100%,37%)] rounded-2xl shadow-glow overflow-hidden">
                  <img 
                    src="/bress-logo.png" 
                    alt="Bress Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm animate-gentle-pulse" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight gradient-text-bress">
                  Bress
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {t('subtitle')}
                </p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-gentle-pulse" />
                <span className="text-xs font-medium text-purple-700">En línea</span>
              </div>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 sm:w-10 sm:h-10",
                    userButtonPopoverCard: "glass-card border-white/30"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Welcome Section - Solo visible en desktop */}
        <div className="hidden lg:block mb-8">
          <div className="glass-card p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-[hsl(245,78%,60%)] to-[hsl(245,78%,55%)] rounded-2xl shadow-glass">
                <Baby className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  ¡Hola! Soy Bress 👋
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Tu asistente especializado en crianza con evidencia científica. Pregúntame sobre sueño, alimentación, desarrollo, salud mental y seguridad para bebés y niños.
                </p>
                
                {/* Ejemplos de preguntas */}
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { icon: Moon, text: "Bebé 6m • despertares nocturnos", color: "from-blue-500 to-purple-500" },
                    { icon: Heart, text: "Embarazo 28s • alimentación", color: "from-pink-500 to-red-500" },
                    { icon: Sparkles, text: "Niño 2a • desarrollo del lenguaje", color: "from-green-500 to-cyan-500" }
                  ].map((example, index) => (
                    <div key={index} className="neo-soft p-3 group cursor-pointer hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1.5 bg-gradient-to-br ${example.color} rounded-lg`}>
                          <example.icon className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-medium text-foreground">Ejemplo</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        "{example.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats - Solo visible en desktop */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 mb-8">
          {[
            { 
              icon: MessageCircle, 
              title: "Respuestas Instantáneas", 
              description: "Basadas en evidencia científica",
              color: "from-purple-500 to-blue-500"
            },
            { 
              icon: Heart, 
              title: "Guías Personalizadas", 
              description: "Adaptadas a la edad del bebé",
              color: "from-pink-500 to-purple-500" 
            },
            { 
              icon: Zap, 
              title: "Disponible 24/7", 
              description: "Apoyo cuando lo necesites",
              color: "from-cyan-500 to-teal-500"
            }
          ].map((stat, index) => (
            <div key={index} className="neo-soft p-4 group">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-xl shadow-glass group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  {stat.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-11">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Chat Container */}
        <div className="glass-card p-0 sm:p-6 shadow-glass-lg overflow-hidden">
          {/* Chat Header - Solo en móvil */}
          <div className="sm:hidden p-4 border-b border-white/20 bg-gradient-to-r from-purple-50/50 to-cyan-50/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[hsl(245,78%,60%)] to-[hsl(174,100%,37%)] rounded-xl shadow-glass overflow-hidden">
                <img src="/bress-logo.png" alt="Bress" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Bress</h3>
                <p className="text-xs text-muted-foreground">Tu asistente de crianza</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-gentle-pulse" />
                <span className="text-xs text-muted-foreground">En línea</span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="hidden sm:block absolute top-4 left-4 z-10">
            <Heart className="w-5 h-5 decoration-heart opacity-20 animate-gentle-pulse" />
          </div>
          <div className="hidden sm:block absolute bottom-4 right-4 z-10">
            <Sparkles className="w-4 h-4 decoration-sparkles opacity-20 animate-float" />
          </div>

          {/* Webchat Component */}
          <div 
            className="relative z-20 rounded-none sm:rounded-2xl overflow-hidden"
            style={{
              height: 'calc(100vh - 140px)', // Mobile height
              minHeight: '500px'
            }}
          >
            <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-white/5 to-purple-50/10 pointer-events-none" />
            
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
                footer: "[⚡ by Baby Sapiens]",
                radius: 3
              }}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                borderRadius: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Quick Tips Footer - Solo desktop */}
        <div className="hidden lg:flex items-center justify-center gap-8 mt-8 py-6">
          {[
            { icon: MessageCircle, text: "Pregunta sobre cualquier etapa", color: "text-purple-500" },
            { icon: Heart, text: "Respuestas con evidencia científica", color: "text-pink-500" },
            { icon: Sparkles, text: "Orientación personalizada 24/7", color: "text-cyan-500" }
          ].map((tip, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm border border-white/30">
              <tip.icon className={`w-4 h-4 ${tip.color}`} />
              <span className="text-sm font-medium text-foreground">
                {tip.text}
              </span>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}