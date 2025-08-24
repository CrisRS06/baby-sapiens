'use client'

import { UserButton } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import RealBotpressChat from '@/components/real-botpress-chat'

export default function ChatPage() {
  const t = useTranslations('chat')

  return (
    <div className="app-fixed-height bg-gradient-to-br from-slate-50 to-gray-100">
      
      {/* Fixed Header - 64px */}
      <header className="chat-header h-16 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto responsive-spacing h-full">
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

      {/* Chat Container - Optimized Layout */}
      <main className="chat-main responsive-spacing">
        <div className="w-full h-full max-w-5xl mx-auto">
          <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden component-isolated">
            <RealBotpressChat />
          </div>
        </div>
      </main>

    </div>
  )
}