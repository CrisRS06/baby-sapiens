'use client'

import { UserButton } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import RealBotpressChat from '@/components/real-botpress-chat'

export default function ChatPage() {
  const t = useTranslations('chat')

  return (
    <div 
      className="h-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 to-gray-100" 
      style={{ 
        height: '100vh',
        height: '-webkit-fill-available',
        height: '100dvh'
      }}
    >
      
      {/* Fixed Header - 64px */}
      <header className="h-16 flex-shrink-0 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
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
                <h1 className="text-lg font-bold gradient-text-bress">Bress</h1>
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

      {/* Chat Container - Safari iOS Compatible */}
      <main 
        className="flex-1 overflow-hidden p-2 sm:p-4 lg:p-6" 
        style={{ 
          height: 'calc(100% - 4rem)',
          height: 'calc(-webkit-fill-available - 4rem)',
          minHeight: 0,
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div 
          className="w-full h-full max-w-5xl mx-auto"
          style={{ 
            height: '100%',
            minHeight: 0
          }}
        >
          <div 
            className="h-full bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden"
            style={{ 
              height: '100%',
              position: 'relative',
              minHeight: 0
            }}
          >
            <RealBotpressChat />
          </div>
        </div>
      </main>

    </div>
  )
}