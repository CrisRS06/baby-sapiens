'use client'

import { SignIn, useUser } from '@clerk/nextjs'
import { Heart, Baby, Moon, Star, Shield, Sparkles } from 'lucide-react'
import { useRouter, usePathname } from '@/navigation'
import { useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/navigation'

export default function Home() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const t = useTranslations('landing')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const pathname = usePathname()

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir al chat
    if (isLoaded && isSignedIn) {
      router.push('/chat')
    }
  }, [isSignedIn, isLoaded, router])


  return (
    <div className="mobile-viewport-container relative overflow-hidden w-full">
      {/* Animated Background Blobs */}
      <div className="blob-purple w-96 h-96 -top-48 -left-48" />
      <div className="blob-turquoise w-96 h-96 -bottom-48 -right-48" />

      {/* Mobile-First Layout: Auth form first, branding secondary */}
      <div className="flex flex-col lg:flex-row flex-1">
        
        {/* Auth Section - Mobile First */}
        <div className="w-full lg:w-1/2 flex-1 flex flex-col justify-start lg:justify-center px-4 py-6 lg:py-12 relative z-10 overflow-x-hidden">
          <div className="w-full max-w-sm lg:max-w-md mx-auto">
            
            {/* Mobile Header - Compact */}
            <div className="mb-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[hsl(245,78%,60%)] to-[hsl(174,100%,37%)] rounded-xl shadow-glow overflow-hidden">
                  <img 
                    src="/bress-logo.png" 
                    alt="Bress Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-2xl font-black tracking-tight gradient-text-bress">
                  {t('title')}
                </h1>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {t('subtitle')}
              </p>
            </div>

            {/* Sign In Card - Mobile Optimized */}
            <div className="glass-card p-4 lg:p-8 shadow-glass-lg border-purple-200/25 relative">
              <SignIn 
                routing="hash"
                afterSignInUrl="/chat"
                afterSignUpUrl="/chat"
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'shadow-none bg-transparent border-none w-full',
                    headerTitle: 'text-xl lg:text-2xl font-bold text-center mb-2 text-purple-900',
                    headerSubtitle: 'text-center text-muted-foreground font-medium mb-4 lg:mb-6 text-sm lg:text-base',
                    socialButtonsBlockButton: 
                      'border border-purple-200 hover:bg-purple-50/50 transition-all duration-200 rounded-xl font-medium shadow-sm hover:shadow-md hover:scale-105 transform w-full py-2 lg:py-3 text-sm lg:text-base',
                    formButtonPrimary: 
                      'btn-modern text-white font-semibold py-3 text-base w-full',
                    footerActionLink: 'text-purple-600 hover:text-purple-700 font-semibold transition-colors text-sm lg:text-base',
                    formFieldInput: 
                      'border-purple-200 bg-white/60 backdrop-blur-sm rounded-xl py-2.5 lg:py-3 px-3 lg:px-4 font-medium placeholder:text-purple-400/60 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 w-full text-sm lg:text-base',
                    identityPreviewEditButton: 'text-purple-600 hover:text-purple-700 font-medium text-sm lg:text-base',
                    formFieldLabel: 'text-purple-900 font-semibold mb-2 text-sm lg:text-base',
                    footer: 'hidden',
                    dividerLine: 'bg-purple-200',
                    dividerText: 'text-purple-600 font-medium text-sm lg:text-base',
                    formFieldAction: 'text-purple-600 hover:text-purple-700 font-medium text-sm lg:text-base',
                  },
                }}
              />
            </div>

            {/* Trust Badges - Mobile Compact */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-3 h-3 text-purple-500" />
                <span>{t('signIn.privacySecure')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="w-3 h-3 text-cyan-500" />
                <span>{t('signIn.evidenceBased')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Branding Section - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative z-10">
          <div className="max-w-lg animate-fade-up">
            {/* Desktop Branding Content */}
            <div className="flex items-center gap-4 mb-10">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-[hsl(245,78%,60%)] to-[hsl(174,100%,37%)] rounded-2xl shadow-glow overflow-hidden">
                  <img 
                    src="/bress-logo.png" 
                    alt="Bress - Tu compañero de crianza con IA" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <Star className="w-5 h-5 decoration-star absolute -top-2 -right-2 animate-gentle-pulse" />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tight gradient-text-bress">
                  {t('title')}
                </h1>
                <p className="text-lg text-purple-600 font-medium mt-1">with Bress</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-foreground mb-6 leading-tight">
              {t('subtitle')}
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed font-medium">
              {t('description')}
            </p>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-gradient-to-br from-[hsl(245,78%,60%)] to-[hsl(245,78%,55%)] rounded-2xl shadow-glass transform group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-1">
                    {t('features.diagnosis.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('features.diagnosis.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-gradient-to-br from-[hsl(174,100%,37%)] to-[hsl(174,100%,32%)] rounded-2xl shadow-glass transform group-hover:scale-110 transition-transform">
                  <Moon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-1">
                    {t('features.optimization.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('features.optimization.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-gradient-to-br from-[hsl(245,78%,60%)] via-[hsl(220,78%,60%)] to-[hsl(174,100%,37%)] rounded-2xl shadow-glass transform group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-1">
                    {t('features.knowledge.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('features.knowledge.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Safety Note with Baby-friendly styling */}
            <div className="mt-12 p-6 neo-soft relative overflow-hidden">
              <div className="absolute top-2 right-2 animate-float">
                <Star className="w-4 h-4 decoration-star" />
              </div>
              <p className="text-sm font-medium text-purple-700 leading-relaxed relative z-10">
                <strong className="text-purple-800">{t('safetyNote.title')}</strong> {t('safetyNote.description')}
              </p>
            </div>

            {/* Testimonial */}
            <div className="mt-8 p-4 glass-card bg-gradient-to-r from-purple-50/60 to-cyan-50/40">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm italic text-muted-foreground mb-2">
                "Bress ha sido mi salvación durante esas desveladas a las 3 AM. Tener respuestas basadas en evidencia al instante me da confianza como madre primeriza."
              </p>
              <p className="text-xs font-semibold text-purple-600">- María S., Madre de 2</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}