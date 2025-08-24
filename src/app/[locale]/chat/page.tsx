'use client'

import { UserButton } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import { LogOut, User } from 'lucide-react'
import { useState } from 'react'
import RealBotpressChat from '@/components/real-botpress-chat'

export default function ChatPage() {
  const t = useTranslations('chat')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <div className="h-screen-safe overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
      
      {/* Mobile Minimalista Expandible - Desktop Header Normal */}
      <header className={`relative flex-shrink-0 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm transition-all duration-300 ${
        showMobileMenu 
          ? 'h-12 lg:h-16' // Altura fija, menu flotante
          : 'h-12 lg:h-16' // Compacto en móvil, normal en desktop
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          {/* Mobile Minimalista */}
          <div className="lg:hidden flex items-center justify-between h-full">
            {/* Mobile: Solo logo pequeño y menú toggle */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-[hsl(245,78%,60%)] to-[hsl(174,100%,37%)] rounded-lg overflow-hidden">
                <img 
                  src="/bress-logo.png" 
                  alt="Bress" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-sm font-bold gradient-text-bress">Baby Sapiens</h1>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <User className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Desktop Header Normal */}
          <div className="hidden lg:flex items-center justify-between h-full">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[hsl(245,78%,60%)] to-[hsl(174,100%,37%)] rounded-xl shadow-sm overflow-hidden">
                <img 
                  src="/bress-logo.png" 
                  alt="Bress" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text-bress">Baby Sapiens</h1>
                <p className="text-xs text-gray-600">{t('subtitle')}</p>
              </div>
            </div>

            {/* User Profile */}
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9"
                }
              }}
            />
          </div>

        </div>
      </header>

      {/* Chat Container - Mobile Fullscreen, Desktop with padding */}
      <main className="flex-1 overflow-hidden p-0 lg:p-6 h-main-safe">
        <div className="w-full h-full max-w-5xl mx-auto chat-container">
          <div className="h-full bg-white rounded-none lg:rounded-2xl shadow-none lg:shadow-sm border-0 lg:border lg:border-gray-200/60 overflow-hidden chat-container">
            <RealBotpressChat />
          </div>
        </div>
      </main>

      {/* Mobile Full-Screen Modal Overlay - Outside all containers */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-[9999] flex flex-col">
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
                    afterSignOutUrl="/"
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