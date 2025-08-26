'use client'

import { useEffect, useState, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Share2, X } from 'lucide-react'

/**
 * Hook personalizado para crear overlay responsivo que cubra el botón de Botpress
 */
const useResponsiveOverlay = () => {
  const [overlayData, setOverlayData] = useState<{
    isActive: boolean;
    position: { top: number; right: number };
    size: { width: number; height: number };
    containerBounds: DOMRect | null;
  }>({
    isActive: false,
    position: { top: 0, right: 0 },
    size: { width: 0, height: 0 },
    containerBounds: null
  })

  const overlayRefs = useRef<HTMLDivElement[]>([])

  useLayoutEffect(() => {
    let resizeObserver: ResizeObserver | null = null
    let mutationObserver: MutationObserver | null = null
    let intersectionObserver: IntersectionObserver | null = null
    let animationFrameId: number

    const calculateOverlayPosition = () => {
      const iframe = document.querySelector('iframe[src*="botpress"]') as HTMLIFrameElement
      const container = iframe?.closest('.botpress-iframe-container, .chat-container, main') as HTMLElement
      
      if (!iframe || !container) return null

      const iframeRect = iframe.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      // Calcular posición responsiva basada en el tamaño del iframe
      const responsiveConfig = {
        mobile: { width: iframeRect.width < 480, overlay: { width: 80, height: 50, top: 8, right: 8 } },
        tablet: { width: iframeRect.width >= 480 && iframeRect.width < 1024, overlay: { width: 100, height: 60, top: 12, right: 12 } },
        desktop: { width: iframeRect.width >= 1024, overlay: { width: 120, height: 70, top: 16, right: 16 } }
      }

      let config = responsiveConfig.desktop
      if (responsiveConfig.mobile.width) config = responsiveConfig.mobile
      else if (responsiveConfig.tablet.width) config = responsiveConfig.tablet

      return {
        position: {
          top: iframeRect.top + config.overlay.top,
          right: window.innerWidth - (iframeRect.right - config.overlay.right)
        },
        size: {
          width: config.overlay.width,
          height: config.overlay.height
        },
        containerBounds: containerRect
      }
    }

    const updateOverlay = () => {
      const overlayConfig = calculateOverlayPosition()
      if (overlayConfig) {
        setOverlayData({
          isActive: true,
          ...overlayConfig
        })
        createMultiLayerOverlay(overlayConfig)
      }
    }

    const createMultiLayerOverlay = (config: NonNullable<ReturnType<typeof calculateOverlayPosition>>) => {
      // Remover overlays existentes
      overlayRefs.current.forEach(overlay => overlay?.remove())
      overlayRefs.current = []

      // Crear múltiples overlays para cobertura completa pero más sutiles
      const overlayConfigs = [
        { offset: { top: 0, right: 0 }, size: 1, opacity: 1 }, // Principal
        { offset: { top: -2, right: -2 }, size: 1.1, opacity: 0.7 }, // Expansión pequeña
        { offset: { top: -4, right: -4 }, size: 1.2, opacity: 0.4 }, // Expansión media
      ]

      overlayConfigs.forEach((overlayConfig, index) => {
        const overlay = document.createElement('div')
        overlay.className = `botpress-overlay-layer-${index}`
        overlay.style.cssText = `
          position: fixed;
          top: ${config.position.top + overlayConfig.offset.top}px;
          right: ${config.position.right + overlayConfig.offset.right}px;
          width: ${Math.ceil(config.size.width * overlayConfig.size)}px;
          height: ${Math.ceil(config.size.height * overlayConfig.size)}px;
          background: ${index === 0 
            ? 'linear-gradient(135deg, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.95) 100%)'
            : `linear-gradient(135deg, 
                rgba(139, 92, 246, ${0.02 * overlayConfig.opacity}) 0%,
                rgba(6, 214, 160, ${0.02 * overlayConfig.opacity}) 100%)`
          };
          backdrop-filter: blur(${index === 0 ? 8 : 4 + index}px);
          border-radius: ${10 + index * 2}px;
          z-index: ${7000 + index};
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: ${index === 0 
            ? '1px solid rgba(226, 232, 240, 0.8)' 
            : `1px solid rgba(255, 255, 255, ${0.1 * overlayConfig.opacity})`
          };
          box-shadow: ${index === 0 
            ? '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
            : `0 ${1 + index}px ${4 + index * 2}px rgba(0, 0, 0, ${0.03 * overlayConfig.opacity})`
          };
        `
        
        // Solo mostrar branding en el overlay principal y muy sutil
        if (index === 0) {
          overlay.innerHTML = `
            <div style="
              position: absolute;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: Inter, system-ui, sans-serif;
              font-size: 8px;
              font-weight: 500;
              color: rgba(139, 92, 246, 0.3);
              text-shadow: 0 1px 1px rgba(255, 255, 255, 0.9);
              text-align: center;
              line-height: 1.1;
              opacity: 0.7;
            ">
              Baby<br>Sapiens
            </div>
          `
        }

        document.body.appendChild(overlay)
        overlayRefs.current.push(overlay)
      })
    }

    const debouncedUpdate = () => {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = requestAnimationFrame(updateOverlay)
    }

    // Configurar observadores
    const setupObservers = () => {
      const iframe = document.querySelector('iframe[src*="botpress"]') as HTMLIFrameElement
      const container = iframe?.closest('.botpress-iframe-container, .chat-container, main') as HTMLElement
      
      if (iframe) {
        // ResizeObserver para cambios de tamaño
        resizeObserver = new ResizeObserver(debouncedUpdate)
        resizeObserver.observe(iframe)
        if (container) resizeObserver.observe(container)

        // MutationObserver para cambios en atributos del iframe
        mutationObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && 
                ['style', 'class', 'src'].includes(mutation.attributeName || '')) {
              debouncedUpdate()
            }
          })
        })
        mutationObserver.observe(iframe, { attributes: true })

        // IntersectionObserver para detectar visibilidad
        intersectionObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              debouncedUpdate()
            } else {
              // Remover overlays si el iframe no es visible
              overlayRefs.current.forEach(overlay => overlay?.remove())
              overlayRefs.current = []
            }
          })
        })
        intersectionObserver.observe(iframe)
      }
    }

    // Configurar con delay para permitir que el iframe se cargue
    const initTimer = setTimeout(() => {
      setupObservers()
      updateOverlay()
    }, 500)

    // Event listeners para resize y orientación
    window.addEventListener('resize', debouncedUpdate)
    window.addEventListener('orientationchange', () => {
      setTimeout(debouncedUpdate, 100)
    })

    return () => {
      clearTimeout(initTimer)
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', debouncedUpdate)
      window.removeEventListener('orientationchange', debouncedUpdate)
      
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
      intersectionObserver?.disconnect()
      
      // Cleanup overlays
      overlayRefs.current.forEach(overlay => overlay?.remove())
      overlayRefs.current = []
    }
  }, [])

  return overlayData
}

/**
 * Componente para personalizar el iframe de Botpress
 * Sistema avanzado de overlay responsivo para ocultar el botón Share original
 */
export default function BotpressIframeCustomizer() {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0, width: 0, height: 0 })
  const overlayData = useResponsiveOverlay()

  // Cerrar menú con Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showShareMenu) {
        setShowShareMenu(false)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showShareMenu])

  useEffect(() => {
    // PostMessage interceptor para comunicación con Botpress
    const handleBotpressMessage = (event: MessageEvent) => {
      if (!event.origin.includes('botpress.cloud')) return
      
      // Intentar comandos de ocultación cuando el webchat esté listo
      if (event.data && typeof event.data === 'object') {
        const { type } = event.data
        
        if (['webchat.ready', 'webchat.show', 'webchat.open'].includes(type)) {
          sendHideCommands(event.source)
        }
      }
    }

    const sendHideCommands = (iframeWindow: MessageEventSource | null) => {
      if (!iframeWindow) return
      
      const hideCommands = [
        { type: 'webchat.hideShare', payload: { hide: true } },
        { type: 'ui.hideElement', payload: { selector: '[aria-label*="Share"]' } },
        { type: 'style.inject', payload: { css: '.share-button { display: none !important; }' } },
        { action: 'hideShare', enabled: false },
        { command: 'setUI', shareButton: false }
      ]
      
      hideCommands.forEach((command, index) => {
        setTimeout(() => {
          try {
            (iframeWindow as Window).postMessage(command, 'https://cdn.botpress.cloud')
          } catch (error) {
            // Ignorar errores de postMessage
          }
        }, index * 25)
      })
    }

    // CSS global para intentar ocultar elementos y animaciones
    const globalStyle = document.createElement('style')
    globalStyle.textContent = `
      /* Intentos de ocultación global */
      iframe[src*="botpress"] {
        position: relative;
      }
      
      /* Ocultar elementos que puedan ser el botón share */
      [aria-label*="Share" i],
      [title*="Share" i],
      [data-testid*="share" i],
      button[class*="share" i],
      .bp-share-button,
      .share-button,
      .botpress-share,
      [class*="ShareButton" i] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      
      /* Animaciones para el menú */
      @keyframes menuSlideIn {
        from {
          opacity: 0;
          transform: scale(0.85) translateY(-8px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      
      @keyframes menuSlideOut {
        from {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        to {
          opacity: 0;
          transform: scale(0.85) translateY(-8px);
        }
      }
    `
    document.head.appendChild(globalStyle)

    window.addEventListener('message', handleBotpressMessage)

    return () => {
      window.removeEventListener('message', handleBotpressMessage)
      globalStyle.remove()
      
      const customButton = document.getElementById('baby-sapiens-share-button')
      if (customButton) {
        customButton.remove()
      }
    }
  }, [])

  // Efecto separado para manejar el botón y sus estados
  useEffect(() => {
    createCustomShareButton()
  }, [showShareMenu])

  // Función para crear el botón personalizado de Baby Sapiens que se sincroniza con el overlay
  const createCustomShareButton = () => {
    let shareButton = document.getElementById('baby-sapiens-share-button') as HTMLButtonElement
    
    // Si no existe, crear el botón
    if (!shareButton) {
      shareButton = document.createElement('button')
      shareButton.id = 'baby-sapiens-share-button'
      document.body.appendChild(shareButton)
    }
    
    // Función para sincronizar posición con el overlay
    const syncWithOverlay = () => {
      const iframe = document.querySelector('iframe[src*="botpress"]') as HTMLIFrameElement
      if (!iframe) return

      const iframeRect = iframe.getBoundingClientRect()
      
      // Calcular configuración responsiva
      const responsiveConfig = {
        mobile: { width: iframeRect.width < 480, button: { size: 50, top: 10, right: 10 } },
        tablet: { width: iframeRect.width >= 480 && iframeRect.width < 1024, button: { size: 58, top: 15, right: 15 } },
        desktop: { width: iframeRect.width >= 1024, button: { size: 65, top: 20, right: 20 } }
      }

      let config = responsiveConfig.desktop
      if (responsiveConfig.mobile.width) config = responsiveConfig.mobile
      else if (responsiveConfig.tablet.width) config = responsiveConfig.tablet

      // Calcular posición centrada con el overlay
      const buttonTop = iframeRect.top + config.button.top
      const buttonRight = window.innerWidth - (iframeRect.right - config.button.right)
      
      // Actualizar estado de posición para el menú
      setButtonPosition({
        top: buttonTop,
        right: buttonRight,
        width: config.button.size,
        height: config.button.size
      })
      
      shareButton.style.cssText = `
        position: fixed;
        top: ${buttonTop}px;
        right: ${buttonRight}px;
        width: ${config.button.size}px;
        height: ${config.button.size}px;
        background: ${showShareMenu 
          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 214, 160, 0.15))'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95))'};
        border: 2px solid ${showShareMenu 
          ? 'rgba(139, 92, 246, 0.6)' 
          : 'rgba(139, 92, 246, 0.3)'};
        border-radius: ${Math.round(config.button.size * 0.25)}px;
        z-index: 8500;
        pointer-events: all;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 
          0 8px 24px rgba(139, 92, 246, 0.2),
          0 4px 12px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.9),
          inset 0 0 0 1px rgba(139, 92, 246, 0.1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        backdrop-filter: blur(16px);
        transform: translateZ(0);
      `
    }
    
    // Configurar el botón inicialmente
    syncWithOverlay()
    
    shareButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#baby-sapiens-gradient-btn)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <defs>
          <linearGradient id="baby-sapiens-gradient-btn" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8B5CF6"/>
            <stop offset="100%" style="stop-color:#06D6A0"/>
          </linearGradient>
        </defs>
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    `

    shareButton.onmouseenter = () => {
      shareButton.style.transform = 'scale(1.1) translateY(-2px) translateZ(0)'
      shareButton.style.boxShadow = `
        0 12px 32px rgba(139, 92, 246, 0.3),
        0 6px 16px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 1),
        inset 0 0 0 1px rgba(139, 92, 246, 0.2)
      `
      shareButton.style.background = `
        linear-gradient(135deg, 
          rgba(255, 255, 255, 1), 
          rgba(248, 250, 252, 0.98))
      `
      shareButton.style.borderColor = 'rgba(139, 92, 246, 0.5)'
    }

    shareButton.onmouseleave = () => {
      shareButton.style.transform = 'scale(1) translateY(0px) translateZ(0)'
      shareButton.style.boxShadow = `
        0 8px 24px rgba(139, 92, 246, 0.2),
        0 4px 12px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.9),
        inset 0 0 0 1px rgba(139, 92, 246, 0.1)
      `
      shareButton.style.background = `
        linear-gradient(135deg, 
          rgba(255, 255, 255, 0.98), 
          rgba(248, 250, 252, 0.95))
      `
      shareButton.style.borderColor = 'rgba(139, 92, 246, 0.3)'
    }
    
    shareButton.onclick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      setShowShareMenu(prev => !prev)
    }
    
    // Observers para reposicionar el botón cuando cambie el overlay
    const resizeObserver = new ResizeObserver(syncWithOverlay)
    const mutationObserver = new MutationObserver(syncWithOverlay)
    
    const iframe = document.querySelector('iframe[src*="botpress"]') as HTMLIFrameElement
    if (iframe) {
      resizeObserver.observe(iframe)
      mutationObserver.observe(iframe, { attributes: true })
      
      const container = iframe.closest('.botpress-iframe-container, .chat-container, main') as HTMLElement
      if (container) {
        resizeObserver.observe(container)
      }
    }
    
    // Event listeners para cambios de ventana
    window.addEventListener('resize', syncWithOverlay)
    window.addEventListener('orientationchange', () => {
      setTimeout(syncWithOverlay, 100)
    })
    
    // Cleanup cuando se remueva el botón
    const originalRemove = shareButton.remove.bind(shareButton)
    shareButton.remove = () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('resize', syncWithOverlay)
      window.removeEventListener('orientationchange', syncWithOverlay)
      originalRemove()
    }
  }

  // Funciones para compartir en redes sociales
  const shareToFacebook = () => {
    const url = encodeURIComponent('https://www.babysapiens.org/')
    const text = encodeURIComponent('¡Descubre Baby Sapiens! Tu asistente IA personalizado para la crianza basado en evidencia científica. 🍼✨')
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400')
    setShowShareMenu(false)
  }

  const shareToTwitter = () => {
    const url = encodeURIComponent('https://www.babysapiens.org/')
    const text = encodeURIComponent('¡Descubre Baby Sapiens! Tu asistente IA personalizado para la crianza 🍼✨ #BabySapiens #Crianza #IA')
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400')
    setShowShareMenu(false)
  }

  const shareToWhatsApp = () => {
    const url = encodeURIComponent('https://www.babysapiens.org/')
    const text = encodeURIComponent('¡Hola! Te comparto Baby Sapiens, un asistente IA increíble para padres primerizos. Me está ayudando muchísimo con la crianza de mi bebé 🍼✨')
    window.open(`https://wa.me/?text=${text} ${url}`, '_blank')
    setShowShareMenu(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('https://www.babysapiens.org/')
      // Mostrar feedback temporal con el nuevo diseño
      const button = document.getElementById('baby-sapiens-share-button')
      if (button) {
        const originalHTML = button.innerHTML
        button.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#success-gradient)" stroke-width="2.5">
            <defs>
              <linearGradient id="success-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#10B981"/>
                <stop offset="100%" style="stop-color:#06D6A0"/>
              </linearGradient>
            </defs>
            <polyline points="20,6 9,17 4,12"/>
          </svg>
        `
        setTimeout(() => {
          button.innerHTML = originalHTML
        }, 2000)
      }
      setShowShareMenu(false)
    } catch (err) {
      console.error('Error copiando al portapapeles:', err)
    }
  }

  // Función para calcular la posición óptima del menú
  const calculateMenuPosition = () => {
    const menuWidth = 220
    const menuHeight = 320
    const gap = 12
    
    // Convertir right-based a left-based positioning
    const buttonLeft = window.innerWidth - buttonPosition.right - buttonPosition.width
    
    // Determinar posición horizontal
    let left: number | 'auto' = buttonLeft
    let right: number | 'auto' = 'auto'
    
    // Si el menú se saldría por la derecha, posicionarlo a la izquierda del botón
    if (buttonLeft + menuWidth > window.innerWidth - 20) {
      right = buttonPosition.right
      left = 'auto'
    }
    
    // Determinar posición vertical
    let top = buttonPosition.top + buttonPosition.height + gap
    
    // Si el menú se saldría por abajo, posicionarlo arriba del botón
    if (top + menuHeight > window.innerHeight - 20) {
      top = buttonPosition.top - menuHeight - gap
    }
    
    return {
      left,
      right,
      top,
      transformOrigin: right !== 'auto' 
        ? `${buttonPosition.width/2 + gap}px ${gap}px`  // Origen en el botón cuando está a la derecha
        : `${buttonPosition.width/2}px ${buttonPosition.height + gap}px` // Origen en el botón cuando está arriba
    }
  }

  // Componente del menú extraído para usar con Portal
  const ShareMenuContent = () => {
    const menuPos = calculateMenuPosition()
    
    return (
    <div 
      style={{ zIndex: 9000 }}
      className="fixed inset-0 animate-in fade-in duration-200" 
      onClick={() => setShowShareMenu(false)}
    >
      {/* Backdrop con glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-purple-900/15 to-teal-900/15 backdrop-blur-md" />
      
      {/* Menú de opciones con diseño mejorado y posicionamiento dinámico */}
      <div 
        style={{ 
          position: 'fixed',
          top: `${menuPos.top}px`,
          left: menuPos.left !== 'auto' ? `${menuPos.left}px` : 'auto',
          right: menuPos.right !== 'auto' ? `${menuPos.right}px` : 'auto',
          transformOrigin: menuPos.transformOrigin,
          zIndex: 9100,
          animation: 'menuSlideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          boxShadow: `
            0 25px 50px rgba(139, 92, 246, 0.25),
            0 15px 30px rgba(0, 0, 0, 0.18),
            0 5px 15px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.95),
            inset 0 0 0 1px rgba(139, 92, 246, 0.15)
          `
        }}
        className="bg-gradient-to-br from-white/99 via-white/96 to-gray-50/99 rounded-2xl border border-white/70 py-3 min-w-[220px] backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Connector tail - visual bridge to button */}
        <div 
          className="absolute w-3 h-3 bg-gradient-to-br from-white/99 to-gray-50/99 border-l border-t border-white/70 transform rotate-45"
          style={{
            [menuPos.right !== 'auto' ? 'right' : 'left']: menuPos.right !== 'auto' ? '24px' : '24px',
            [menuPos.top < buttonPosition.top ? 'bottom' : 'top']: '-6px',
            filter: 'drop-shadow(0 -2px 4px rgba(139, 92, 246, 0.1))'
          }}
        />
        {/* Header con gradiente */}
        <div className="px-4 py-3 border-b border-gradient-to-r from-purple-200/30 to-teal-200/30">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-teal-500 rounded-lg flex items-center justify-center">
              <Share2 className="w-3 h-3 text-white" />
            </div>
            <p className="text-sm font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
              Compartir Baby Sapiens
            </p>
          </div>
          <p className="text-xs text-gray-600 font-medium">Ayuda a más familias a criar con evidencia</p>
        </div>
        
        <div className="py-2">
          <button
            onClick={shareToWhatsApp}
            className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100/50 flex items-center gap-3 text-sm font-medium transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:shadow-green-500/40 group-hover:scale-105 transition-all duration-200">
              <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.485"/>
              </svg>
            </div>
            <div>
              <span className="text-gray-900">WhatsApp</span>
              <p className="text-xs text-gray-500">Compartir por mensaje</p>
            </div>
          </button>

          <button
            onClick={shareToFacebook}
            className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 flex items-center gap-3 text-sm font-medium transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25 group-hover:shadow-blue-600/40 group-hover:scale-105 transition-all duration-200">
              <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div>
              <span className="text-gray-900">Facebook</span>
              <p className="text-xs text-gray-500">Compartir en feed</p>
            </div>
          </button>

          <button
            onClick={shareToTwitter}
            className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 flex items-center gap-3 text-sm font-medium transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-black rounded-xl flex items-center justify-center shadow-lg shadow-gray-900/25 group-hover:shadow-gray-900/40 group-hover:scale-105 transition-all duration-200">
              <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <div>
              <span className="text-gray-900">X (Twitter)</span>
              <p className="text-xs text-gray-500">Compartir tweet</p>
            </div>
          </button>

          <button
            onClick={copyToClipboard}
            className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-purple-50 hover:to-teal-50 flex items-center gap-3 text-sm font-medium transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/25 group-hover:shadow-purple-600/40 group-hover:scale-105 transition-all duration-200">
              <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </div>
            <div>
              <span className="text-gray-900">Copiar enlace</span>
              <p className="text-xs text-gray-500">Portapapeles</p>
            </div>
          </button>
        </div>

        {/* Footer con branding sutil */}
        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-xs text-center text-gray-400 font-medium">
            🍼 Crianza basada en evidencia científica
          </p>
        </div>
      </div>
    </div>
  )
  }

  return (
    <>
      {/* Estilos globales para animaciones del menú */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes menuSlideIn {
            from {
              opacity: 0;
              transform: scale(0.92) translateY(-8px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `
      }} />

      {/* Debug info para development */}
      {process.env.NODE_ENV === 'development' && overlayData.isActive && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-[6000]">
          <div>Overlay activo: {overlayData.isActive ? '✅' : '❌'}</div>
          <div>Posición: {Math.round(overlayData.position.top)}, {Math.round(overlayData.position.right)}</div>
          <div>Tamaño: {overlayData.size.width}x{overlayData.size.height}</div>
        </div>
      )}

      {/* Menú de compartir usando React Portal - se renderiza directamente en document.body */}
      {showShareMenu && typeof window !== 'undefined' && createPortal(
        <ShareMenuContent />,
        document.body
      )}
    </>
  )
}