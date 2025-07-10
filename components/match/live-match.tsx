"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Clock, MapPin, User, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MatchEvent {
  id: number
  player_name: string
  team_name: string
  minute: number
  event_type: string
  description: string
}

interface MatchData {
  id: number
  home_team: string
  away_team: string
  home_score: number | null
  away_score: number | null
  status: string
  venue: string
  datetime: string
  referee: string | null
  events: MatchEvent[]
  last_updated: string
  error?: string
}

interface LiveMatchProps {
  matchId: string
  isAdmin?: boolean
}

export function LiveMatch({ matchId, isAdmin = false }: LiveMatchProps) {
  const [matchData, setMatchData] = useState<MatchData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Connect to WebSocket
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/ws/matches/${matchId}/`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      setIsConnected(true)
      setIsLoading(false)
      toast({
        title: "Conexión establecida",
        description: "Estás viendo el partido en vivo",
      })
    }

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        })
      } else {
        setMatchData(data)
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
      toast({
        title: "Conexión cerrada",
        description: "La conexión en vivo se ha cerrado",
        variant: "destructive",
      })
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      setIsLoading(false)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar al partido en vivo",
        variant: "destructive",
      })
    }

    setSocket(ws)

    // Cleanup on unmount
    return () => {
      ws.close()
    }
  }, [matchId, toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "live":
        return "bg-green-100 text-green-800"
      case "finished":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "Gol":
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case "Tarjeta Amarilla":
        return <div className="h-4 w-3 bg-yellow-400 rounded-sm" />
      case "Tarjeta Roja":
        return <div className="h-4 w-3 bg-red-500 rounded-sm" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
        <p className="text-lg font-medium text-gray-700">Conectando al partido en vivo...</p>
      </div>
    )
  }

  if (!matchData) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg font-medium text-gray-700">No se pudo cargar la información del partido</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Partido en Vivo</h1>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(matchData.status)}>
            {matchData.status === "live" ? "EN VIVO" : matchData.status === "finished" ? "FINALIZADO" : "PROGRAMADO"}
          </Badge>
          {isConnected ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 animate-pulse">
              Transmisión en vivo
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Desconectado
            </Badge>
          )}
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-lg">
            {matchData.home_team} vs {matchData.away_team}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score */}
          <div className="flex items-center justify-center gap-8 py-6">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">{matchData.home_team}</p>
              <p className="text-sm text-gray-500">Local</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {matchData.home_score ?? 0} - {matchData.away_score ?? 0}
              </div>
              <p className="text-xs text-gray-500">
                {matchData.status === "live" ? "EN CURSO" : matchData.status === "finished" ? "FINAL" : "PROGRAMADO"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">{matchData.away_team}</p>
              <p className="text-sm text-gray-500">Visitante</p>
            </div>
          </div>

          <Separator />

          {/* Match Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatDate(matchData.datetime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{matchData.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Árbitro: {matchData.referee || "No asignado"}</span>
            </div>
          </div>

          <Separator />

          {/* Match Events */}
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="events">Eventos del Partido</TabsTrigger>
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            </TabsList>
            <TabsContent value="events" className="space-y-4 pt-4">
              {matchData.events.length > 0 ? (
                <div className="space-y-3">
                  {matchData.events.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                        {getEventIcon(event.event_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{event.player_name}</span>
                          <span className="text-xs text-gray-500">({event.team_name})</span>
                        </div>
                        <p className="text-sm text-gray-600">{event.event_type}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">{event.minute}'</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No hay eventos registrados</div>
              )}
            </TabsContent>
            <TabsContent value="stats" className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-center">{matchData.home_team}</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>Posesión</span>
                      <span className="font-medium">52%</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>Tiros</span>
                      <span className="font-medium">12</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>Tiros a puerta</span>
                      <span className="font-medium">5</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>Faltas</span>
                      <span className="font-medium">8</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium text-center">{matchData.away_team}</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">48%</span>
                      <span>Posesión</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">9</span>
                      <span>Tiros</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">3</span>
                      <span>Tiros a puerta</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">10</span>
                      <span>Faltas</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-medium mb-4">Panel de Control</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => {
                    if (socket && socket.readyState === WebSocket.OPEN) {
                      socket.send(
                        JSON.stringify({
                          action: "change_status",
                          status: "live",
                        }),
                      )
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Iniciar Partido
                </Button>
                <Button
                  onClick={() => {
                    if (socket && socket.readyState === WebSocket.OPEN) {
                      socket.send(
                        JSON.stringify({
                          action: "change_status",
                          status: "finished",
                        }),
                      )
                    }
                  }}
                  variant="outline"
                >
                  Finalizar Partido
                </Button>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 text-right">
            Última actualización: {formatDate(matchData.last_updated)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
