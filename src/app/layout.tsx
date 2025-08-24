import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Baby Sapiens - Tu Compañero de Crianza con IA",
  description: "Conoce a Bress, tu compañero cálido y sereno desde el embarazo hasta los 5 años. Orientación basada en evidencia, apoyo personalizado y tranquilidad para familias modernas.",
  authors: [{ name: "Baby Sapiens" }],
  keywords: ["crianza", "IA", "embarazo", "bebé", "cuidado infantil", "desarrollo", "Bress", "evidencia científica"],
  openGraph: {
    title: "Baby Sapiens - Tu Compañero de Crianza con IA",
    description: "Apoyo en crianza basado en evidencia desde el embarazo hasta los 5 años",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Baby Sapiens - Tu Compañero de Crianza con IA",
    description: "Apoyo en crianza basado en evidencia desde el embarazo hasta los 5 años",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      localization={{
        signIn: {
          start: {
            title: "Inicia sesión en Baby Sapiens",
            subtitle: "Bienvenido de vuelta! Inicia sesión para continuar",
            actionText: "¿No tienes cuenta?",
            actionLink: "Regístrate"
          }
        },
        signUp: {
          start: {
            title: "Crea tu cuenta en Baby Sapiens", 
            subtitle: "Bienvenido! Crea tu cuenta para comenzar",
            actionText: "¿Ya tienes cuenta?",
            actionLink: "Inicia sesión"
          }
        },
        formFieldLabel__emailAddress: "Correo electrónico",
        formFieldLabel__password: "Contraseña",
        formFieldLabel__firstName: "Nombre",
        formFieldLabel__lastName: "Apellido",
        formFieldInputPlaceholder__emailAddress: "Ingresa tu correo electrónico",
        formFieldInputPlaceholder__password: "Ingresa tu contraseña", 
        formFieldInputPlaceholder__firstName: "Ingresa tu nombre",
        formFieldInputPlaceholder__lastName: "Ingresa tu apellido",
        formButtonPrimary: "Continuar",
        formFieldLabel__username: "Nombre de usuario",
        formFieldInputPlaceholder__username: "Ingresa tu nombre de usuario",
        dividerText: "o",
        socialButtonsBlockButton: "Continuar con {{provider|titleize}}"
      }}
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
        }
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/chat"
      afterSignUpUrl="/chat"
    >
      <html lang="es">
        <body className={`${inter.variable} font-sans antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}