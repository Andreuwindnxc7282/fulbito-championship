"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Users, Trophy, Edit, Trash2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Team {
  id: number
  name: string
  logo?: string
  coach_name: string
  founded: number
  player_count: number
  group?: string
}

export function Teams() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    coach_name: "",
    founded: new Date().getFullYear(),
    description: ""
  })
  const { toast } = useToast()

  const loadTeams = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/teams/', {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTeams(data.results || data)
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los equipos",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error loading teams:', error)
      toast({
        title: "Error",
        description: "Error de conexión al cargar equipos",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeams()
  }, [])

  const handleCreateTeam = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/teams/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Equipo creado exitosamente"
        })
        setIsDialogOpen(false)
        resetForm()
        loadTeams()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: `Error al crear equipo: ${JSON.stringify(errorData)}`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating team:', error)
      toast({
        title: "Error",
        description: "Error de conexión al crear equipo",
        variant: "destructive"
      })
    }
  }

  const handleUpdateTeam = async () => {
    if (!selectedTeam) return
    
    try {
      const response = await fetch(`http://localhost:8000/api/teams/${selectedTeam.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Equipo actualizado exitosamente"
        })
        setIsDialogOpen(false)
        resetForm()
        loadTeams()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: `Error al actualizar equipo: ${JSON.stringify(errorData)}`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating team:', error)
      toast({
        title: "Error",
        description: "Error de conexión al actualizar equipo",
        variant: "destructive"
      })
    }
  }

  const handleDeleteTeam = async (teamId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/teams/${teamId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Equipo eliminado exitosamente"
        })
        loadTeams()
      } else {
        toast({
          title: "Error",
          description: "Error al eliminar equipo",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting team:', error)
      toast({
        title: "Error",
        description: "Error de conexión al eliminar equipo",
        variant: "destructive"
      })
    }
  }

  const openEditDialog = (team: Team) => {
    setSelectedTeam(team)
    setIsEditMode(true)
    setFormData({
      name: team.name,
      coach_name: team.coach_name,
      founded: team.founded,
      description: ""
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setSelectedTeam(null)
    setIsEditMode(false)
    resetForm()
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      coach_name: "",
      founded: new Date().getFullYear(),
      description: ""
    })
    setSelectedTeam(null)
    setIsEditMode(false)
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.coach_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Equipos</h1>
          <p className="text-gray-600">Administrar equipos del torneo</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={loadTeams} 
            disabled={loading}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={openCreateDialog} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Equipo
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar equipos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline">
          {filteredTeams.length} equipo{filteredTeams.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {team.logo || "⚽"}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <CardDescription>
                      Fundado en {team.founded}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(team)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente 
                          el equipo "{team.name}" y todos sus datos asociados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTeam(team.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Entrenador:</span>
                    <span className="font-medium">{team.coach_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Jugadores:</span>
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      {team.player_count}
                    </Badge>
                  </div>
                  {team.group && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Grupo:</span>
                      <Badge>{team.group}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron equipos</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'Comienza agregando un nuevo equipo.'}
          </p>
          {!searchTerm && (
            <Button onClick={openCreateDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Crear Primer Equipo
            </Button>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? `Editar ${selectedTeam?.name}` : 'Crear Nuevo Equipo'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Modifica los datos del equipo.' 
                : 'Completa la información para crear un nuevo equipo.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Equipo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Real Madrid"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="coach">Entrenador</Label>
              <Input
                id="coach"
                value={formData.coach_name}
                onChange={(e) => setFormData(prev => ({ ...prev, coach_name: e.target.value }))}
                placeholder="Ej: Carlo Ancelotti"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="founded">Año de Fundación</Label>
              <Input
                id="founded"
                type="number"
                value={formData.founded}
                onChange={(e) => setFormData(prev => ({ ...prev, founded: parseInt(e.target.value) }))}
                min="1800"
                max="2025"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción (Opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Información adicional del equipo..."
                className="min-h-[80px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={isEditMode ? handleUpdateTeam : handleCreateTeam}
              disabled={!formData.name || !formData.coach_name}
            >
              {isEditMode ? 'Actualizar' : 'Crear'} Equipo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
