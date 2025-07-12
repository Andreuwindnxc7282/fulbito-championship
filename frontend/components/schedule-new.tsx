"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, Clock, MapPin, Users, Trophy, Edit, Play, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Match {
  id: number
  home_team_name: string
  away_team_name: string
  home_score: number | null
  away_score: number | null
  datetime: string
  venue_name: string
  referee_name: string
  status: 'scheduled' | 'live' | 'finished' | 'suspended' | 'cancelled'
}

interface Team {
  id: number
  name: string
  coach_name: string
}

export function Schedule() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    home_team: "",
    away_team: "",
    datetime: "",
    venue_name: "",
    referee_name: ""
  })
  const { toast } = useToast()

  const loadMatches = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/public/schedule/1/', {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMatches(data.matches || [])
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los partidos",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error loading matches:', error)
      toast({
        title: "Error",
        description: "Error de conexión al cargar partidos",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadTeams = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/teams/', {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTeams(data.results || data)
      }
    } catch (error) {
      console.error('Error loading teams:', error)
    }
  }

  useEffect(() => {
    loadMatches()
    loadTeams()
  }, [])

  const handleCreateMatch = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/matches/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          home_team: parseInt(formData.home_team),
          away_team: parseInt(formData.away_team),
          datetime: formData.datetime,
          venue_name: formData.venue_name,
          referee_name: formData.referee_name,
          status: 'scheduled'
        })
      })
      
      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Partido programado exitosamente"
        })
        setIsDialogOpen(false)
        resetForm()
        loadMatches()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: `Error al programar partido: ${JSON.stringify(errorData)}`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating match:', error)
      toast({
        title: "Error",
        description: "Error de conexión al programar partido",
        variant: "destructive"
      })
    }
  }

  const handleUpdateMatch = async () => {
    if (!selectedMatch) return
    
    try {
      const response = await fetch(`http://localhost:8000/api/matches/${selectedMatch.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          home_team: parseInt(formData.home_team),
          away_team: parseInt(formData.away_team),
          datetime: formData.datetime,
          venue_name: formData.venue_name,
          referee_name: formData.referee_name,
          status: selectedMatch.status
        })
      })
      
      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Partido actualizado exitosamente"
        })
        setIsDialogOpen(false)
        resetForm()
        loadMatches()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: `Error al actualizar partido: ${JSON.stringify(errorData)}`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating match:', error)
      toast({
        title: "Error",
        description: "Error de conexión al actualizar partido",
        variant: "destructive"
      })
    }
  }

  const handleStartMatch = async (matchId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/matches/${matchId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'live',
          home_score: 0,
          away_score: 0
        })
      })
      
      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Partido iniciado exitosamente"
        })
        loadMatches()
      } else {
        toast({
          title: "Error",
          description: "Error al iniciar partido",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error starting match:', error)
      toast({
        title: "Error",
        description: "Error de conexión al iniciar partido",
        variant: "destructive"
      })
    }
  }

  const openEditDialog = (match: Match) => {
    setSelectedMatch(match)
    setIsEditMode(true)
    setFormData({
      home_team: teams.find(t => t.name === match.home_team_name)?.id.toString() || "",
      away_team: teams.find(t => t.name === match.away_team_name)?.id.toString() || "",
      datetime: match.datetime.slice(0, 16), // Format for datetime-local input
      venue_name: match.venue_name,
      referee_name: match.referee_name
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setSelectedMatch(null)
    setIsEditMode(false)
    resetForm()
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      home_team: "",
      away_team: "",
      datetime: "",
      venue_name: "",
      referee_name: ""
    })
    setSelectedMatch(null)
    setIsEditMode(false)
  }

  const upcomingMatches = matches.filter((match) => match.status === "scheduled")
  const liveMatches = matches.filter((match) => match.status === "live")
  const completedMatches = matches.filter((match) => match.status === "finished")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "live":
        return "bg-green-100 text-green-800 animate-pulse"
      case "finished":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Programado"
      case "live":
        return "EN VIVO"
      case "finished":
        return "Finalizado"
      case "suspended":
        return "Suspendido"
      case "cancelled":
        return "Cancelado"
      default:
        return "Desconocido"
    }
  }

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime)
    return {
      date: date.toLocaleDateString('es-ES'),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const MatchCard = ({ match }: { match: Match }) => {
    const { date, time } = formatDateTime(match.datetime)
    
    return (
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge className="bg-purple-100 text-purple-800">
              Torneo 2025
            </Badge>
            <Badge className={getStatusColor(match.status)}>
              {getStatusText(match.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Teams and Score */}
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <div className="font-bold text-lg text-gray-900">{match.home_team_name}</div>
              <div className="text-sm text-gray-500">Local</div>
            </div>
            <div className="flex items-center gap-4 px-4">
              {match.status === "finished" ? (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {match.home_score} - {match.away_score}
                  </div>
                  <div className="text-xs text-gray-500">Final</div>
                </div>
              ) : match.status === "live" ? (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {match.home_score || 0} - {match.away_score || 0}
                  </div>
                  <div className="text-xs text-green-600 animate-pulse">EN VIVO</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-lg font-medium text-gray-600">VS</div>
                  <div className="text-xs text-gray-500">{time}</div>
                </div>
              )}
            </div>
            <div className="flex-1 text-center">
              <div className="font-bold text-lg text-gray-900">{match.away_team_name}</div>
              <div className="text-sm text-gray-500">Visitante</div>
            </div>
          </div>

          {/* Match Details */}
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
              <Clock className="h-4 w-4 ml-2" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{match.venue_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Árbitro: {match.referee_name}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-transparent"
              onClick={() => openEditDialog(match)}
            >
              <Edit className="h-3 w-3 mr-1" />
              Editar
            </Button>
            {match.status === "scheduled" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Play className="h-3 w-3 mr-1" />
                    Iniciar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Iniciar partido?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esto iniciará el partido entre {match.home_team_name} vs {match.away_team_name}.
                      El estado cambiará a "EN VIVO" y se iniciará el marcador en 0-0.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleStartMatch(match.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Iniciar Partido
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {match.status === "live" && (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Trophy className="h-3 w-3 mr-1" />
                Gestionar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Calendario de Partidos</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendario de Partidos</h1>
          <p className="text-gray-600">Gestiona la programación del campeonato</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={loadMatches} 
            disabled={loading}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={openCreateDialog} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Programar Partido
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Próximos ({upcomingMatches.length})
          </TabsTrigger>
          <TabsTrigger value="live" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            En Vivo ({liveMatches.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Finalizados ({completedMatches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingMatches.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay partidos programados</h3>
              <p className="text-gray-600 mb-4">Programa el primer partido del torneo.</p>
              <Button onClick={openCreateDialog} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Programar Primer Partido
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="live" className="space-y-4">
          {liveMatches.length === 0 ? (
            <div className="text-center py-12">
              <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay partidos en vivo</h3>
              <p className="text-gray-600">Los partidos en curso aparecerán aquí.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedMatches.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay partidos finalizados</h3>
              <p className="text-gray-600">Los partidos completados aparecerán aquí.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog for Create/Edit Match */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? `Editar Partido` : 'Programar Nuevo Partido'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Modifica los datos del partido.' 
                : 'Completa la información para programar un nuevo partido.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="homeTeam">Equipo Local</Label>
                <Select 
                  value={formData.home_team}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, home_team: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar equipo local" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="awayTeam">Equipo Visitante</Label>
                <Select 
                  value={formData.away_team}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, away_team: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar equipo visitante" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="datetime">Fecha y Hora</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={formData.datetime}
                onChange={(e) => setFormData(prev => ({ ...prev, datetime: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="venue">Estadio/Cancha</Label>
              <Input
                id="venue"
                value={formData.venue_name}
                onChange={(e) => setFormData(prev => ({ ...prev, venue_name: e.target.value }))}
                placeholder="Ej: Hard Rock Stadium"
              />
            </div>
            <div>
              <Label htmlFor="referee">Árbitro</Label>
              <Input
                id="referee"
                value={formData.referee_name}
                onChange={(e) => setFormData(prev => ({ ...prev, referee_name: e.target.value }))}
                placeholder="Ej: Anthony Taylor"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={isEditMode ? handleUpdateMatch : handleCreateMatch}
              disabled={!formData.home_team || !formData.away_team || !formData.datetime}
              className="bg-green-600 hover:bg-green-700"
            >
              {isEditMode ? 'Actualizar' : 'Programar'} Partido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
