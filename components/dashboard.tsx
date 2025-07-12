"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Calendar, TrendingUp, Clock, MapPin, Play, Timer, Tv, RefreshCw, Key } from "lucide-react"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import { setTempToken, clearTokens, hasToken, autoRenewToken } from "@/lib/temp-token"
import { SystemStatusCard } from "./system-status-card"

interface DashboardStats {
  total_teams: number
  total_players: number
  total_matches: number
  matches_played: number
  matches_scheduled: number
  total_goals: number
  upcoming_matches: Array<{
    id: number
    home_team: string
    away_team: string
    datetime: string
    venue: string
  }>
  recent_matches: Array<{
    id: number
    home_team: string
    away_team: string
    home_score: number
    away_score: number
    datetime: string
    venue?: string
  }>
}

interface TopScorer {
  player_name: string
  team_name: string
  goals: number
  position: number
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [topScorers, setTopScorers] = useState<TopScorer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Auto-renovar token antes de hacer las peticiones
      const tokenRenewed = await autoRenewToken();
      if (tokenRenewed) {
        console.log('🔄 Token renovado automáticamente antes de cargar datos');
      }
      
      // Si no hay token, establecer uno automáticamente
      if (!hasToken()) {
        console.log('🔄 No hay token, estableciendo uno automáticamente...');
        await setTempToken();
      }
      
      // Obtener datos del dashboard y top scorers con manejo de errores mejorado
      const [dashboardResponse, scorersResponse] = await Promise.all([
        api.get('/dashboard/stats/').catch(err => {
          console.log('Error en /dashboard/stats/:', err.message);
          throw err;
        }),
        api.get('/dashboard/top-scorers/').catch(err => {
          console.log('Error en /dashboard/top-scorers/:', err.message);
          throw err;
        })
      ])
      
      setStats(dashboardResponse.data)
      setTopScorers(scorersResponse.data)
      
      setLastUpdated(new Date())
      console.log('✅ Dashboard cargado exitosamente');
    } catch (error: any) {
      console.error('Error loading dashboard data:', error)
      
      // Determinar tipo de error y mostrar mensaje apropiado
      let errorMessage = 'Error desconocido al cargar datos';
      
      if (!error?.response) {
        // Error de red/conexión
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:8000';
      } else if (error.response?.status === 401) {
        // Error de autenticación
        errorMessage = 'Error de autenticación. Intentando renovar token automáticamente...';
        
        // Intentar renovar token y reintentar una vez más
        try {
          console.log('🔄 Error 401, renovando token y reintentando...');
          await setTempToken();
          
          const [dashboardResponse, scorersResponse] = await Promise.all([
            api.get('/dashboard/stats/'),
            api.get('/dashboard/top-scorers/')
          ])
          setStats(dashboardResponse.data)
          setTopScorers(scorersResponse.data)
          setLastUpdated(new Date())
          console.log('✅ Dashboard cargado exitosamente después de renovar token');
          return;
        } catch (retryError) {
          console.error('Error en segundo intento:', retryError);
          errorMessage = 'Error de autenticación persistente. Verifica la configuración del sistema.';
        }
      } else if (error.response?.status >= 500) {
        // Error del servidor
        errorMessage = `Error del servidor (${error.response.status}). El backend puede estar iniciándose o tener problemas.`;
      } else {
        // Otros errores HTTP
        errorMessage = `Error HTTP ${error.response?.status}: ${error.response?.data?.message || 'Error desconocido'}`;
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('🚀 Dashboard iniciándose...');
    
    // Auto-establecer token si no existe
    if (!hasToken()) {
      console.log('🔄 No hay token al iniciar, estableciendo automáticamente...');
      setTempToken();
    }
    
    // Cargar datos del dashboard
    loadDashboardData()
    
    // Configurar auto-renovación cada 30 minutos
    const autoRenewInterval = setInterval(() => {
      const renewed = autoRenewToken();
      if (renewed) {
        console.log('🔄 Token auto-renovado en intervalor programado');
        loadDashboardData(); // Recargar datos con nuevo token
      }
    }, 30 * 60 * 1000); // 30 minutos
    
    return () => clearInterval(autoRenewInterval);
  }, [])

  const handleRefresh = () => {
    loadDashboardData()
  }

  const handleSetTempToken = () => {
    setTempToken()
    loadDashboardData()
  }

  const handleClearTokens = () => {
    clearTokens()
    setError('Token eliminado. Establece un token para acceder a los datos.')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Cargando dashboard...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
            {!hasToken() && (
              <Button onClick={handleSetTempToken} variant="default">
                <Key className="h-4 w-4 mr-2" />
                Establecer Token
              </Button>
            )}
            {hasToken() && (
              <Button onClick={handleClearTokens} variant="destructive">
                <Key className="h-4 w-4 mr-2" />
                Limpiar Tokens
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {hasToken() ? 'Token encontrado - Verifica que el backend esté funcionando' : 'No hay token de autenticación'}
          </p>
        </div>
      </div>
    )
  }

  const dashboardCards = [
    {
      title: "Equipos",
      value: stats?.total_teams.toString() || "0",
      description: "Equipos participantes",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Partidos Totales",
      value: stats?.total_matches.toString() || "0",
      description: `${stats?.matches_played || 0} finalizados, ${stats?.matches_scheduled || 0} programados`,
      icon: Trophy,
      color: "bg-green-500",
    },
    {
      title: "Jugadores",
      value: stats?.total_players.toString() || "0",
      description: "Jugadores registrados",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Goles Totales",
      value: stats?.total_goals.toString() || "0",
      description: "Goles anotados en el torneo",
      icon: Trophy,
      color: "bg-yellow-500",
    },
  ]

  const upcomingMatches = stats?.upcoming_matches || []
  const recentMatches = stats?.recent_matches || []

  return (
    <div className="space-y-6">
      {/* System Status Card */}
      <SystemStatusCard />
      
      {/* Automated Development Tools Bar */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">🤖 Sistema Automático de Tokens</span>
            <span className="text-xs text-gray-600 bg-green-100 px-2 py-1 rounded">
              Auto-renovación activada
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSetTempToken} variant="outline" size="sm">
              <Key className="h-4 w-4 mr-1" />
              Forzar Token
            </Button>
            <Button onClick={handleClearTokens} variant="outline" size="sm">
              <Key className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
            <span className="text-xs text-gray-600">
              Token: {hasToken() ? '✅ Válido' : '🔄 Auto-estableciendo...'}
            </span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          ⚡ El sistema detecta automáticamente tokens expirados y los renueva sin intervención manual
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">International Champions Cup 2025 • {lastUpdated.toLocaleTimeString('es-ES')}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleRefresh} 
            disabled={loading}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">⚽ Campeonato Internacional 2025</h3>
                <p className="text-sm text-gray-600">Estado: Activo</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card) => (
          <Card key={card.title} className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`p-2 rounded-full ${card.color}`}>
                <card.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximos Partidos */}
        <Card className="border-0 shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-blue-600" />
              Próximos Partidos
            </CardTitle>
            <CardDescription>Partidos programados</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingMatches && upcomingMatches.length > 0 ? (
              <div className="space-y-4">
                {upcomingMatches.slice(0, 3).map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{match.home_team}</span>
                        <span className="text-sm text-gray-500">vs</span>
                        <span className="font-medium text-gray-900">{match.away_team}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {match.venue}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(match.datetime).toLocaleString('es-ES')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Timer className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No hay próximos partidos programados</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Scorers */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Tabla de Goleadores
            </CardTitle>
            <CardDescription>Los máximos anotadores del torneo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topScorers && topScorers.length > 0 ? (
              topScorers.slice(0, 5).map((scorer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {scorer.position}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{scorer.player_name}</p>
                      <p className="text-sm text-gray-500">{scorer.team_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{scorer.goals}</span>
                    <span className="text-sm text-gray-500">goles</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No hay datos de goleadores disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Matches */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Partidos Recientes
          </CardTitle>
          <CardDescription>Últimos resultados del campeonato</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentMatches && recentMatches.length > 0 ? (
              recentMatches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{match.home_team}</span>
                      <span className="text-lg font-bold text-gray-900">
                        {match.home_score} - {match.away_score}
                      </span>
                      <span className="font-medium text-gray-900">{match.away_team}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(match.datetime).toLocaleDateString('es-ES')}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Finalizado
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No hay partidos recientes disponibles</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
