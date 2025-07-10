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
import { authenticatedFetch, getAuthHeaders, setTempAuthToken, setSuperuserAuthToken, loginAsAdmin } from "@/lib/auth-utils"

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

  // Establecer token temporal para desarrollo
  useEffect(() => {
    setTempAuthToken()
  }, [])

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
      const response = await authenticatedFetch('http://localhost:8000/api/teams/')
      
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
      const response = await authenticatedFetch('http://localhost:8000/api/matches/', {
        method: 'POST',
        body: JSON.stringify({
          team_home: parseInt(formData.home_team),
          team_away: parseInt(formData.away_team),
          datetime: formatDateForAPI(formData.datetime),
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
      const response = await authenticatedFetch(`http://localhost:8000/api/matches/${selectedMatch.id}/`, {
        method: 'PUT',
        body: JSON.stringify({
          team_home: parseInt(formData.home_team),
          team_away: parseInt(formData.away_team),
          datetime: formatDateForAPI(formData.datetime),
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
      datetime: formatDateFromAPI(match.datetime),
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
    return new Date(datetime).toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Función para formatear fecha al formato ISO 8601
  const formatDateForAPI = (datetimeLocal: string): string => {
    if (!datetimeLocal) return ''
    
    // El input datetime-local da formato "YYYY-MM-DDTHH:mm"
    // Necesitamos convertirlo a formato ISO 8601 con zona horaria
    const date = new Date(datetimeLocal)
    return date.toISOString()
  }

  // Función para formatear fecha desde ISO a datetime-local
  const formatDateFromAPI = (isoDatetime: string): string => {
    if (!isoDatetime) return ''
    
    // Convertir de ISO 8601 a formato para input datetime-local
    const date = new Date(isoDatetime)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const MatchCard = ({ match }: { match: Match }) => (
    <Card key={match.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(match.status)}>
              {getStatusText(match.status)}
            </Badge>
            {match.status === "live" && (
              <Badge variant="outline" className="animate-pulse">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
                LIVE
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {match.status === "scheduled" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(match)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="default">
                      <Play className="h-4 w-4 mr-1" />
                      Iniciar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Iniciar Partido</AlertDialogTitle>
                      <AlertDialogDescription>
                        ¿Estás seguro de que quieres iniciar este partido? El estado cambiará a "EN VIVO".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleStartMatch(match.id)}>
                        Iniciar Partido
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Local</div>
            <div className="text-lg font-semibold text-center">{match.home_team_name}</div>
            {match.home_score !== null && (
              <div className="text-2xl font-bold text-blue-600">{match.home_score}</div>
            )}
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-400 mb-2">VS</div>
            {match.status === "finished" && match.home_score !== null && match.away_score !== null && (
              <div className="text-sm font-medium text-gray-600">
                {match.home_score} - {match.away_score}
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Visitante</div>
            <div className="text-lg font-semibold text-center">{match.away_team_name}</div>
            {match.away_score !== null && (
              <div className="text-2xl font-bold text-red-600">{match.away_score}</div>
            )}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDateTime(match.datetime)}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {match.venue_name}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {match.referee_name}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Calendario de Partidos</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Cargando partidos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Calendario de Partidos</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              setTempAuthToken()
              toast({
                title: "Autenticación",
                description: "Token JWT establecido correctamente",
                variant: "default"
              })
            }} 
            variant="outline" 
            size="sm"
          >
            🔑 Autenticar
          </Button>
          <Button 
            onClick={async () => {
              const result = await loginAsAdmin()
              toast({
                title: result.success ? "Admin Login" : "Error",
                description: result.message,
                variant: result.success ? "default" : "destructive"
              })
            }} 
            variant="outline" 
            size="sm"
            className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
          >
            🔐 Login Admin
          </Button>
          <Button onClick={loadMatches} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Actualizar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-1" />
                Programar Partido
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Editar Partido" : "Programar Nuevo Partido"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode 
                    ? "Modifica los detalles del partido seleccionado."
                    : "Completa los detalles para programar un nuevo partido."
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="home_team">Equipo Local</Label>
                    <Select value={formData.home_team} onValueChange={(value) => setFormData({...formData, home_team: value})}>
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
                    <Label htmlFor="away_team">Equipo Visitante</Label>
                    <Select value={formData.away_team} onValueChange={(value) => setFormData({...formData, away_team: value})}>
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
                    onChange={(e) => setFormData({...formData, datetime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="venue_name">Cancha</Label>
                  <Input
                    id="venue_name"
                    value={formData.venue_name}
                    onChange={(e) => setFormData({...formData, venue_name: e.target.value})}
                    placeholder="Nombre de la cancha"
                  />
                </div>
                <div>
                  <Label htmlFor="referee_name">Árbitro</Label>
                  <Input
                    id="referee_name"
                    value={formData.referee_name}
                    onChange={(e) => setFormData({...formData, referee_name: e.target.value})}
                    placeholder="Nombre del árbitro"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={isEditMode ? handleUpdateMatch : handleCreateMatch}>
                  {isEditMode ? "Actualizar" : "Programar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Próximos ({upcomingMatches.length})
          </TabsTrigger>
          <TabsTrigger value="live">
            En Vivo ({liveMatches.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Finalizados ({completedMatches.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          {upcomingMatches.length > 0 ? (
            upcomingMatches.map((match) => <MatchCard key={match.id} match={match} />)
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay partidos programados</h3>
                <p className="text-gray-500 text-center">
                  Programa nuevos partidos para que aparezcan aquí.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="live" className="mt-6">
          {liveMatches.length > 0 ? (
            liveMatches.map((match) => <MatchCard key={match.id} match={match} />)
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Play className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay partidos en vivo</h3>
                <p className="text-gray-500 text-center">
                  Los partidos iniciados aparecerán aquí.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {completedMatches.length > 0 ? (
            completedMatches.map((match) => <MatchCard key={match.id} match={match} />)
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay partidos finalizados</h3>
                <p className="text-gray-500 text-center">
                  Los partidos completados aparecerán aquí.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
