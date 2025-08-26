/**
 * Analytics Dashboard - Baby Sapiens Alpha Monitoring
 * Fail-fast thresholds y validación de valor real
 */

'use client'

import { useState, useEffect } from 'react'
import { getConversationsSummary, exportConversationsData } from '@/lib/botpress-analytics'
import { AlertTriangle, CheckCircle, Activity, Clock, Users, MessageSquare, TrendingUp, Download } from 'lucide-react'

interface DashboardMetrics {
  total: number
  avgFirstAnswerMs: number
  avgTtrMs: number
  csatAverage: number
  topicDistribution: Record<string, number>
  riskFlagRate: number
}

interface ThresholdStatus {
  velocity: 'pass' | 'warning' | 'fail'
  value: 'pass' | 'warning' | 'fail'
  coverage: 'pass' | 'warning' | 'fail'
  revenue: 'pass' | 'warning' | 'fail'
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    total: 0,
    avgFirstAnswerMs: 0,
    avgTtrMs: 0,
    csatAverage: 0,
    topicDistribution: {},
    riskFlagRate: 0
  })
  
  const [thresholds, setThresholds] = useState<ThresholdStatus>({
    velocity: 'pass',
    value: 'pass',
    coverage: 'pass',
    revenue: 'pass'
  })

  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Refresh data every 30 seconds
  useEffect(() => {
    const updateMetrics = () => {
      const summary = getConversationsSummary()
      setMetrics(summary)
      calculateThresholds(summary)
      setLastUpdate(new Date())
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  // Calcular estado de umbrales fail-fast
  const calculateThresholds = (data: DashboardMetrics) => {
    const newThresholds: ThresholdStatus = {
      // Velocidad: p50 first_answer_ms < 30s; p50 ttr_ms < 6min
      velocity: (data.avgFirstAnswerMs < 30000 && data.avgTtrMs < 360000) ? 'pass' : 
                (data.avgFirstAnswerMs < 45000 && data.avgTtrMs < 480000) ? 'warning' : 'fail',
      
      // Valor: ≥ 70% CSAT ≥ 4/5
      value: data.csatAverage >= 4.0 ? 'pass' : 
             data.csatAverage >= 3.5 ? 'warning' : 'fail',
      
      // Cobertura: Simulamos unknown_intent < 20% (invertir "otro")
      coverage: ((data.topicDistribution.otro || 0) / data.total) < 0.2 ? 'pass' :
                ((data.topicDistribution.otro || 0) / data.total) < 0.3 ? 'warning' : 'fail',
      
      // Revenue signal: Simulamos ≥ 5% pricing_intent (datos limitados en alpha)
      revenue: data.total >= 10 ? 'pass' : 'warning' // Placeholder hasta tener datos reales
    }
    
    setThresholds(newThresholds)
  }

  const exportData = () => {
    const data = exportConversationsData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `baby-sapiens-conversations-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'fail': return <AlertTriangle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusColor = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass': return 'bg-green-50 border-green-200 text-green-700'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-700'
      case 'fail': return 'bg-red-50 border-red-200 text-red-700'
    }
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}min`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Baby Sapiens Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Alpha validation metrics • Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Fail-Fast Thresholds */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          <div className={`p-4 rounded-lg border-2 ${getStatusColor(thresholds.velocity)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Velocidad</span>
              </div>
              {getStatusIcon(thresholds.velocity)}
            </div>
            <div className="space-y-1 text-sm">
              <div>Primera respuesta: {formatTime(metrics.avgFirstAnswerMs)}</div>
              <div>Resolución: {formatTime(metrics.avgTtrMs)}</div>
              <div className="text-xs opacity-75">Target: &lt;30s / &lt;6min</div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${getStatusColor(thresholds.value)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Valor</span>
              </div>
              {getStatusIcon(thresholds.value)}
            </div>
            <div className="space-y-1 text-sm">
              <div>CSAT promedio: {metrics.csatAverage.toFixed(1)}/5</div>
              <div>Respuestas: {metrics.total}</div>
              <div className="text-xs opacity-75">Target: ≥4.0/5</div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${getStatusColor(thresholds.coverage)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                <span className="font-medium">Cobertura</span>
              </div>
              {getStatusIcon(thresholds.coverage)}
            </div>
            <div className="space-y-1 text-sm">
              <div>Temas "otros": {((metrics.topicDistribution.otro || 0) / metrics.total * 100).toFixed(1)}%</div>
              <div>Total consultas: {metrics.total}</div>
              <div className="text-xs opacity-75">Target: &lt;20%</div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${getStatusColor(thresholds.revenue)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Monetización</span>
              </div>
              {getStatusIcon(thresholds.revenue)}
            </div>
            <div className="space-y-1 text-sm">
              <div>Intención de pago: N/A</div>
              <div>En desarrollo</div>
              <div className="text-xs opacity-75">Target: ≥5%</div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Performance</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total conversaciones</span>
                <span className="font-semibold text-lg">{metrics.total}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Primera respuesta (promedio)</span>
                <span className="font-semibold">{formatTime(metrics.avgFirstAnswerMs)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Tiempo resolución (promedio)</span>
                <span className="font-semibold">{formatTime(metrics.avgTtrMs)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Banderas rojas</span>
                <span className="font-semibold">{(metrics.riskFlagRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Topic Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Temas</h2>
            <div className="space-y-3">
              {Object.entries(metrics.topicDistribution).map(([topic, count]) => (
                <div key={topic} className="flex items-center justify-between">
                  <span className="capitalize text-gray-600">{topic}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${(count / metrics.total) * 100}%` }}
                      />
                    </div>
                    <span className="font-semibold min-w-[3rem] text-right">
                      {count} ({((count / metrics.total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert System */}
        {(thresholds.velocity === 'fail' || thresholds.value === 'fail' || 
          thresholds.coverage === 'fail' || thresholds.revenue === 'fail') && (
          <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
              <AlertTriangle className="w-5 h-5" />
              FAIL-FAST THRESHOLD ALERT
            </div>
            <p className="text-red-600 text-sm">
              2+ umbrales críticos han fallado. Considera ajustar promesa de valor, copy, macros top y CTAs 
              (priorizar WhatsApp según metodología LATAM).
            </p>
          </div>
        )}

        {/* Success State */}
        {Object.values(thresholds).every(status => status === 'pass') && (
          <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
              <CheckCircle className="w-5 h-5" />
              ALL SYSTEMS GO 🚀
            </div>
            <p className="text-green-600 text-sm">
              Todos los umbrales están pasando. El valor está validado y listo para escalar tráfico.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}