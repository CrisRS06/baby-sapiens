import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import "../globals.css"

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen relative overflow-hidden gradient-bg-organic dark:bg-gradient-to-br dark:from-purple-950 dark:via-purple-900 dark:to-cyan-950">
        {/* Animated background elements - Baby Sapiens themed */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-purple-400/25 via-purple-300/15 to-pink-300/10 rounded-full mix-blend-overlay filter blur-3xl opacity-60 animate-pulse [animation-duration:12s]"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-br from-cyan-400/20 via-teal-300/15 to-green-300/10 rounded-full mix-blend-overlay filter blur-3xl opacity-50 animate-pulse [animation-duration:15s] [animation-delay:3s]"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-pink-300/15 via-purple-200/10 to-blue-200/8 rounded-full mix-blend-overlay filter blur-2xl opacity-40 animate-pulse [animation-duration:18s] [animation-delay:6s]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,191,165,0.02)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30"></div>
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </NextIntlClientProvider>
  )
}