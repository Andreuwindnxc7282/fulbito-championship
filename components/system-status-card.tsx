"use client"

import { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, RefreshCw, Server, Shield } from 'lucide-react'
import { checkBackendConnectivity, hasToken, isAutoSystemActive, setTempToken } from '@/lib/auto-token-system'

interface SystemStatus {
  backend: boolean
  auth: boolean
  autoSystem: boolean
  lastCheck: Date
}

export function SystemStatusCard() {
  const [status, setStatus] = useState<SystemStatus>({
    backend: false,
    auth: false,
    autoSystem: false,
    lastCheck: new Date()
  })
  const [checking, setChecking] = useState(false)

  const checkSystemStatus = async () => {
    setChecking(true)
    
    try {
      const backendUp = await checkBackendConnectivity()
      const authToken = hasToken()
      const autoActive = isAutoSystemActive()
      
      setStatus({
        backend: backendUp,
        auth: authToken,
        autoSystem: autoActive,
        lastCheck: new Date()
      })
      
      console.log('Sistema verificado:', { backendUp, authToken, autoActive })
    } catch (error) {
      console.error('Error verificando sistema:', error)
    } finally {
      setChecking(false)
    }
  }

  const forceTokenRefresh = async () => {
    setChecking(true)
    try {
      await setTempToken()
      await checkSystemStatus()
      console.log('Token refrescado manualmente')
    } catch (error) {
      console.error('Error refrescando token:', error)
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    checkSystemStatus()
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkSystemStatus, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (isOk: boolean) => {
    return isOk ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    )
  }

  const getStatusBadge = (isOk: boolean, label: string) => {
    return (
      <Badge variant={isOk ? "default" : "destructive"} className="flex items-center gap-1">
        {getStatusIcon(isOk)}
        {label}
      </Badge>
    )
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Estado del Sistema
        </CardTitle>
        <CardDescription>
          Monitoreo en tiempo real de la conectividad y autenticación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {getStatusBadge(status.backend, 'Backend')}
          {getStatusBadge(status.auth, 'Autenticación')}
          {getStatusBadge(status.autoSystem, 'Auto-Sistema')}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Clock className="h-4 w-4" />
          Última verificación: {status.lastCheck.toLocaleTimeString()}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={checkSystemStatus} 
            disabled={checking}
            variant="outline"
            size="sm"
          >
            {checking ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Verificar
          </Button>
          
          <Button 
            onClick={forceTokenRefresh} 
            disabled={checking}
            variant="outline"
            size="sm"
          >
            <Shield className="h-4 w-4 mr-2" />
            Renovar Token
          </Button>
        </div>
        
        {!status.backend && (
          <div className="mt-4 p-3 bg-destructive/10 rounded-md">
            <p className="text-sm text-destructive">
              ⚠️ Backend no disponible. Verifica que el servidor Django esté ejecutándose en http://localhost:8000
            </p>
          </div>
        )}
        
        {status.backend && !status.auth && (
          <div className="mt-4 p-3 bg-yellow-500/10 rounded-md">
            <p className="text-sm text-yellow-700">
              ⚠️ Sin token de autenticación. Haz clic en "Renovar Token" para solucionarlo.
            </p>
          </div>
        )}
        
        {status.backend && status.auth && status.autoSystem && (
          <div className="mt-4 p-3 bg-green-500/10 rounded-md">
            <p className="text-sm text-green-700">
              ✅ Sistema funcionando correctamente. Auto-renovación activa.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
