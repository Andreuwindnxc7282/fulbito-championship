"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Calendar, TrendingUp, Clock, MapPin, Play, Timer, Tv, RefreshCw } from "lucide-react"
import { LiveMatchWidget } from "@/components/match/live-match-widget"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"

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

interface LiveMatchData {
  id: number
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  status: 'scheduled' | 'live' | 'finished' | 'suspended' | 'cancelled'
  venue: string
  datetime: string
  events?: any[]
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [topScorers, setTopScorers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [dashboardData, scorersData] = await Promise.all([
        getDashboardStats(),
        getTopScorers()
      ])
      setStats(dashboardData)
      setTopScorers(scorersData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('No se pudo conectar con el backend. Usando datos de demostración.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
    
    // Auto-refresh cada 30 segundos para partidos en vivo
    const interval = setInterval(() => {
      if (stats?.liveMatches && stats.liveMatches.length > 0) {
        clearCache() // Limpiar cache para obtener datos frescos
        loadDashboardData()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [stats?.liveMatches?.length])

  const handleRefresh = () => {
    clearCache()
    loadDashboardData()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard de Fulbito</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const dashboardStats = [
    {
      title: "Equipos Participantes",
      value: stats?.totalTeams.toString() || "0",
      description: "En International Champions Cup 2025",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Partidos Totales",
      value: stats?.totalMatches.toString() || "0",
      description: `${stats?.finishedMatches || 0} finalizados, ${stats?.upcomingMatches || 0} programados`,
      icon: Trophy,
      color: "bg-green-500",
    },
    {
      title: "Partidos EN VIVO",
      value: (stats?.liveMatchesCount ?? 0).toString(),
      description: (stats?.liveMatchesCount ?? 0) > 0 ? "¡Hay acción en este momento!" : "No hay partidos en vivo",
      icon: Tv,
      color: (stats?.liveMatchesCount ?? 0) > 0 ? "bg-red-500" : "bg-gray-500",
    },
    {
      title: "Próximo Partido",
      value: stats?.nextMatches?.[0] ? `${stats.nextMatches[0].homeTeam} vs ${stats.nextMatches[0].awayTeam}` : "Sin programar",
      description: stats?.nextMatches?.[0] ? new Date(stats.nextMatches[0].datetime).toLocaleString('es-ES') : "Próximamente",
      icon: Clock,
      color: "bg-purple-500",
    },
  ]

  // Los datos ya vienen de la API a través de stats y topScorers
  const liveMatches = stats?.liveMatches || []
  const upcomingMatches = stats?.nextMatches?.slice(0, 3) || []
  const recentMatches = stats?.recentMatches?.slice(-4) || []

  return (
    <div className="space-y-6">
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
                <p className="text-sm text-gray-600">Julio 2025 • Datos en tiempo real</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {(stats?.liveMatchesCount ?? 0) > 0 ? 'EN VIVO' : 'ACTUALIZADO'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <p className="text-yellow-800 font-medium">⚠️ {error}</p>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            Para usar todas las funciones, inicia el backend ejecutando: <code className="bg-yellow-100 px-1 rounded">python manage.py runserver</code>
          </p>
        </div>
      )}

      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`h-8 w-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Partidos en Vivo - Sección destacada */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-red-50 via-pink-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tv className="h-6 w-6 text-red-600" />
            <span className="text-red-800">Partidos en Vivo</span>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </CardTitle>
          <CardDescription>Sigue los partidos en tiempo real</CardDescription>
        </CardHeader>
        <CardContent>
          {liveMatches && liveMatches.length > 0 ? (
            <LiveMatchWidget matches={liveMatches} showLiveOnly={false} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Tv className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay partidos en vivo en este momento</p>
              <p className="text-sm">Los partidos aparecerán aquí cuando comiencen</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximos Partidos con Countdown */}
        <Card className="border-0 shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-blue-600" />
              Próximos Partidos
            </CardTitle>
            <CardDescription>Cuenta regresiva en tiempo real</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingMatches && upcomingMatches.length > 0 ? (
              <LiveMatchWidget matches={upcomingMatches} showLiveOnly={false} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Timer className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No hay próximos partidos programados</p>
                <p className="text-sm">El calendario se actualizará pronto</p>
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{scorer.name}</p>
                      <p className="text-sm text-gray-500">{scorer.team}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{scorer.goals}</p>
                    <p className="text-xs text-gray-500">goles</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
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
                      <span className="font-medium text-gray-900">{match.homeTeam}</span>
                      <span className="text-lg font-bold text-gray-900">
                        {match.homeScore} - {match.awayScore}
                      </span>
                      <span className="font-medium text-gray-900">{match.awayTeam}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {match.venue}
                      </span>
                      <span>{new Date(match.datetime).toLocaleDateString('es-ES')}</span>
                      <Badge variant="secondary" className="text-xs">
                        {match.status}
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
