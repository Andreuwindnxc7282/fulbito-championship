"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, TrendingDown, Minus, Crown } from "lucide-react"
import { useState, useEffect } from "react"
import { authenticatedFetch } from "@/lib/auth-utils"

interface Standing {
  id: number
  team: number
  team_name: string
  team_logo: string | null
  tournament: number
  played: number
  won: number
  drawn: number
  lost: number
  goals_for: number
  goals_against: number
  goal_difference: number
  points: number
}

export function StandingsReal() {
  const [standings, setStandings] = useState<Standing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStandings = async () => {
      try {
        setLoading(true)
        const response = await authenticatedFetch('/api/standings/')
        if (response.ok) {
          const data = await response.json()
          setStandings(data.results || [])
        } else {
          setError('Error al cargar las posiciones')
        }
      } catch (err) {
        setError('Error de conexión')
        console.error('Error loading standings:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStandings()
  }, [])

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Trophy className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-muted-foreground">{position}</span>
    }
  }

  const getPositionColor = (position: number) => {
    if (position === 1) return "bg-yellow-500/10 border-yellow-500/20"
    if (position === 2) return "bg-gray-400/10 border-gray-400/20"
    if (position === 3) return "bg-amber-600/10 border-amber-600/20"
    return "bg-card"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Tabla de Posiciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Tabla de Posiciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Tabla de Posiciones
        </CardTitle>
        <CardDescription>
          Clasificación actual del torneo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {standings.map((standing, index) => {
            const position = index + 1
            return (
              <div
                key={standing.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${getPositionColor(position)}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getPositionIcon(position)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{standing.team_logo || "⚽"}</span>
                    <span className="font-medium">{standing.team_name}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">PJ</div>
                    <div className="font-medium">{standing.played}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">G</div>
                    <div className="font-medium text-green-600">{standing.won}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">E</div>
                    <div className="font-medium text-yellow-600">{standing.drawn}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">P</div>
                    <div className="font-medium text-red-600">{standing.lost}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">GF</div>
                    <div className="font-medium">{standing.goals_for}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">GC</div>
                    <div className="font-medium">{standing.goals_against}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">DG</div>
                    <div className={`font-medium ${
                      standing.goal_difference > 0 ? 'text-green-600' : 
                      standing.goal_difference < 0 ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {standing.goal_difference > 0 ? '+' : ''}{standing.goal_difference}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">PTS</div>
                    <div className="font-bold text-lg">{standing.points}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {standings.length === 0 && (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            No hay datos de posiciones disponibles
          </div>
        )}
      </CardContent>
    </Card>
  )
}
