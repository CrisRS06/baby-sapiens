'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Webchat to prevent SSR issues
const Webchat = dynamic(
  () => import('@botpress/webchat').then((mod) => mod.Webchat),
  {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center">
      <div className="text-purple-600">Cargando chat...</div>
    </div>
  }
)

const clientId = "f657ad35-3575-4861-92bd-e52dac005765"

export default function RealBotpressChat() {
  return (
    <div className="h-full w-full">
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
          height: '100%',
          width: '100%',
          display: 'flex'
        }}
      />
    </div>
  )
}