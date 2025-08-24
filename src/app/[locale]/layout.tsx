import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import "../globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Baby Sapiens - Tu Copiloto de Crianza con IA",
  description: "Conoce a Bress, tu compañero cálido y sereno desde el embarazo hasta los 5 años. Orientación basada en evidencia, apoyo personalizado y tranquilidad para familias modernas.",
  authors: [{ name: "Baby Sapiens" }],
  keywords: ["crianza", "IA", "embarazo", "bebé", "cuidado infantil", "desarrollo", "Bress", "evidencia científica"],
  openGraph: {
    title: "Baby Sapiens - Tu Copiloto de Crianza con IA",
    description: "Apoyo en crianza basado en evidencia desde el embarazo hasta los 5 años",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Baby Sapiens - Tu Copiloto de Crianza con IA",
    description: "Apoyo en crianza basado en evidencia desde el embarazo hasta los 5 años",
  },
}

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
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "hsl(255, 65%, 55%)", // Bress Purple
          colorBackground: "hsl(280, 35%, 98%)", // Soft lavender white
          colorInputBackground: "hsl(270, 25%, 95%)",
          colorInputText: "hsl(270, 30%, 12%)",
          borderRadius: "1.25rem",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "16px",
        },
        elements: {
          formButtonPrimary: "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold shadow-lg shadow-purple-600/20 hover:shadow-xl hover:shadow-purple-600/30 transform hover:scale-105 transition-all duration-300 rounded-2xl border border-purple-500/20",
          card: "backdrop-blur-3xl bg-gradient-to-br from-white/18 to-white/10 border border-white/25 shadow-xl shadow-purple-900/3 rounded-3xl relative overflow-hidden",
          headerTitle: "text-2xl font-bold mb-2 text-purple-900",
          headerSubtitle: "text-purple-600/70 font-medium mb-6",
          socialButtonsBlockButton: "border border-purple-200 hover:bg-purple-50/50 transition-all duration-200 rounded-xl font-medium shadow-sm hover:shadow-md hover:scale-105 transform backdrop-blur-sm",
          formFieldInput: "border-purple-200 bg-white/60 backdrop-blur-sm rounded-xl py-3 px-4 font-medium placeholder:text-purple-400/60 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
          footerActionLink: "text-purple-600 hover:text-purple-700 font-semibold transition-colors",
          formFieldLabel: "text-purple-900 font-semibold mb-2",
          dividerLine: "bg-purple-200",
          dividerText: "text-purple-600 font-medium",
          identityPreviewEditButton: "text-purple-600 hover:text-purple-700 font-medium",
          formFieldAction: "text-purple-600 hover:text-purple-700 font-medium",
        },
        localization: {
          signIn: {
            start: {
              title: "Inicia Sesión en Baby Sapiens",
              subtitle: "¡Bienvenido de vuelta! Inicia sesión para continuar",
              actionText: "¿No tienes cuenta?",
              actionLink: "Regístrate"
            }
          },
          signUp: {
            start: {
              title: "Únete a Baby Sapiens",
              subtitle: "Crea tu cuenta para comenzar tu viaje de crianza",
              actionText: "¿Ya tienes cuenta?",
              actionLink: "Inicia sesión"
            }
          }
        }
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/chat"
      afterSignUpUrl="/chat"
    >
      <html lang={locale}>
        <body className={`${inter.variable} font-sans antialiased`}>
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
        </body>
      </html>
    </ClerkProvider>
  )
}