'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function NativeChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy Bress 👋\n\nTu asistente especializado en crianza con evidencia científica. Estoy aquí para ayudarte con:\n\n🌙 **Sueño y descanso**\n🍼 **Alimentación y lactancia**\n🌟 **Desarrollo y crecimiento**\n💚 **Salud mental y bienestar**\n🛡️ **Seguridad infantil**\n\n*Recuerda: Esta orientación se basa en evidencia científica pero no sustituye la consulta médica profesional.*\n\n**¿En qué puedo ayudarte hoy?**',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(userMessage.content),
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('sueño') || input.includes('dormir') || input.includes('despierta')) {
      return '💤 **Sobre el sueño del bebé**\n\nEs normal que los bebés tengan patrones de sueño diferentes. Algunos consejos basados en evidencia:\n\n• **0-3 meses**: Los recién nacidos duermen 14-17 horas al día en ciclos cortos\n• **Rutina consistente**: Ayuda a establecer patrones de sueño saludables\n• **Ambiente seguro**: Cuna firme, sin objetos sueltos\n\n¿Podrías contarme la edad del bebé y qué específicamente te preocupa del sueño?'
    }
    
    if (input.includes('alimentación') || input.includes('lactancia') || input.includes('comer')) {
      return '🍼 **Sobre alimentación**\n\nLa alimentación es fundamental para el desarrollo:\n\n• **Lactancia exclusiva**: Recomendada hasta los 6 meses (OMS)\n• **Alimentación complementaria**: Introducir gradualmente desde los 6 meses\n• **Señales de hambre**: El bebé te dirá cuándo necesita comer\n\n¿Qué edad tiene el bebé y qué aspectos específicos de la alimentación te gustaría consultar?'
    }
    
    if (input.includes('desarrollo') || input.includes('crecimiento') || input.includes('hitos')) {
      return '🌟 **Desarrollo infantil**\n\nCada bebé se desarrolla a su ritmo, pero hay hitos generales:\n\n• **0-3 meses**: Sonrisa social, sostiene la cabeza\n• **3-6 meses**: Se voltea, ríe, agarra objetos\n• **6-12 meses**: Se sienta, gatea, primeras palabras\n\n¿Qué edad tiene tu bebé y hay algún aspecto específico del desarrollo que te preocupe?'
    }

    if (input.includes('embarazo') || input.includes('embarazada')) {
      return '🤰 **Durante el embarazo**\n\nEs una etapa muy importante. Algunos aspectos clave:\n\n• **Controles prenatales**: Fundamentales para seguimiento\n• **Alimentación saludable**: Ácido fólico, hierro, calcio\n• **Actividad física**: Moderada y adaptada\n• **Descanso**: Importante para tu bienestar\n\n¿En qué semana de embarazo te encuentras y qué te gustaría saber específicamente?'
    }
    
    return '🤖 **Gracias por tu consulta**\n\nPara darte la mejor orientación basada en evidencia, me ayudarías indicando:\n\n• **Edad del bebé** (si aplica)\n• **Situación específica** que te preocupa\n• **Contexto adicional** que consideres relevante\n\nRecuerda que esta orientación no sustituye la consulta médica profesional. ¿Podrías darme más detalles sobre tu consulta?'
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'bot' && (
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[hsl(245,78%,60%)] to-[hsl(174,100%,37%)] rounded-full flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-[hsl(245,78%,60%)] to-[hsl(245,78%,55%)] text-white shadow-lg shadow-purple-500/25'
                  : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200 text-gray-800 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed space-y-2">
                {message.content.split('\n').map((line, index) => {
                  // Handle bold text
                  if (line.includes('**')) {
                    const parts = line.split('**')
                    return (
                      <div key={index}>
                        {parts.map((part, i) => 
                          i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
                        )}
                      </div>
                    )
                  }
                  // Handle italic text
                  if (line.includes('*') && !line.includes('**')) {
                    const parts = line.split('*')
                    return (
                      <div key={index} className="text-gray-600 text-xs">
                        {parts.map((part, i) => 
                          i % 2 === 1 ? <em key={i}>{part}</em> : part
                        )}
                      </div>
                    )
                  }
                  // Handle bullet points
                  if (line.startsWith('•') || line.includes('🌙') || line.includes('🍼') || line.includes('🌟') || line.includes('💚') || line.includes('🛡️')) {
                    return <div key={index} className="flex items-start gap-2 py-0.5">{line}</div>
                  }
                  // Regular text
                  return line ? <div key={index}>{line}</div> : <div key={index} className="h-2"></div>
                })}
              </div>
              <div
                className={`text-xs mt-2 ${
                  message.sender === 'user' 
                    ? 'text-purple-100' 
                    : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>

            {message.sender === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-md">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[hsl(245,78%,60%)] to-[hsl(174,100%,37%)] rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta sobre crianza..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm bg-gray-50 focus:bg-white transition-colors"
              disabled={isTyping}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 bg-gradient-to-r from-[hsl(245,78%,60%)] to-[hsl(245,78%,55%)] text-white rounded-full flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Quick Suggestions */}
        <div className="flex flex-wrap gap-2 mt-3 max-w-4xl mx-auto">
          {[
            { text: 'Problemas de sueño', emoji: '🌙' },
            { text: 'Alimentación complementaria', emoji: '🍼' },
            { text: 'Desarrollo 6 meses', emoji: '🌟' },
            { text: 'Lactancia materna', emoji: '🤱' }
          ].slice(0, 3).map((suggestion) => (
            <button
              key={suggestion.text}
              onClick={() => setInput(suggestion.text)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gradient-to-r from-purple-50 to-purple-25 text-purple-700 rounded-full border border-purple-200 hover:bg-purple-100 hover:scale-105 transition-all duration-200 shadow-sm"
              disabled={isTyping}
            >
              <span>{suggestion.emoji}</span>
              <span className="font-medium">{suggestion.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}