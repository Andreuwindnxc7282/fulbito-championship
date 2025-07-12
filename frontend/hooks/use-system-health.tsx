"use client"

import { useState, useEffect, useCallback } from 'react'
import { checkBackendConnectivity, hasToken, isAutoSystemActive, setTempToken } from '@/lib/auto-token-system'

export interface SystemHealth {
  backend: boolean
  auth: boolean
  autoSystem: boolean
  lastCheck: Date
  error?: string
}

export function useSystemHealth() {
  const [health, setHealth] = useState<SystemHealth>({
    backend: false,
    auth: false,
    autoSystem: false,
    lastCheck: new Date()
  })
  const [checking, setChecking] = useState(false)

  const checkHealth = useCallback(async () => {
    setChecking(true)
    
    try {
      const [backendUp, authToken, autoActive] = await Promise.all([
        checkBackendConnectivity(),
        Promise.resolve(hasToken()),
        Promise.resolve(isAutoSystemActive())
      ])
      
      setHealth({
        backend: backendUp,
        auth: authToken,
        autoSystem: autoActive,
        lastCheck: new Date(),
        error: undefined
      })
      
      console.log('🏥 Sistema verificado:', { backendUp, authToken, autoActive })
    } catch (error) {
      console.error('Error verificando sistema:', error)
      setHealth(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error desconocido',
        lastCheck: new Date()
      }))
    } finally {
      setChecking(false)
    }
  }, [])

  const forceTokenRefresh = useCallback(async () => {
    setChecking(true)
    try {
      await setTempToken()
      await checkHealth()
      console.log('🔄 Token refrescado manualmente')
    } catch (error) {
      console.error('Error refrescando token:', error)
    } finally {
      setChecking(false)
    }
  }, [checkHealth])

  useEffect(() => {
    checkHealth()
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkHealth, 30000)
    
    return () => clearInterval(interval)
  }, [checkHealth])

  const isHealthy = health.backend && health.auth && health.autoSystem
  const hasWarnings = health.backend && !health.auth
  const hasCriticalError = !health.backend

  return {
    health,
    checking,
    isHealthy,
    hasWarnings,
    hasCriticalError,
    checkHealth,
    forceTokenRefresh
  }
}
