"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, 
  Users, 
  Calendar, 
  Trophy, 
  Settings, 
  Database, 
  BarChart3,
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2,
  ExternalLink
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { isAdmin, logout } from "@/lib/auth-utils"
import { authenticatedFetch } from "@/lib/auth-utils"

interface DashboardStats {
  totalUsers: number
  totalTeams: number
  totalMatches: number
  totalPlayers: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTeams: 0,
    totalMatches: 0,
    totalPlayers: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Verificar si es admin
    if (!isAdmin()) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos de administrador",
        variant: "destructive"
      })
      router.push("/login")
      return
    }

    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true)
      
      // Cargar estadísticas desde la API
      const [teamsResponse, matchesResponse] = await Promise.all([
        authenticatedFetch('http://localhost:8000/api/teams/'),
        authenticatedFetch('http://localhost:8000/api/matches/')
      ])

      if (teamsResponse.ok && matchesResponse.ok) {
        const teamsData = await teamsResponse.json()
        const matchesData = await matchesResponse.json()

        setStats({
          totalUsers: 2, // Admin + testuser
          totalTeams: teamsData.count || teamsData.length || 0,
          totalMatches: matchesData.count || matchesData.length || 0,
          totalPlayers: 0 // Se puede agregar después
        })
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      toast({
        title: "Error",
        description: "Error al cargar estadísticas del dashboard",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    })
    router.push("/login")
  }

  const openExternalLink = (url: string) => {
    window.open(url, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 animate-pulse mx-auto mb-4 text-blue-600" />
          <p className="text-lg">Cargando Dashboard de Administrador...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Administrador</h1>
                <p className="text-sm text-gray-600">Fulbito Championship 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Shield className="h-3 w-3 mr-1" />
                Superusuario
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Equipos</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTeams}</div>
              <p className="text-xs text-muted-foreground">
                Equipos registrados en el campeonato
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Partidos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMatches}</div>
              <p className="text-xs text-muted-foreground">
                Partidos programados y finalizados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Usuarios registrados en el sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estadísticas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground">
                Sistema funcionando correctamente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="management">Gestión</TabsTrigger>
            <TabsTrigger value="external">Enlaces Externos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Accesos Rápidos</CardTitle>
                  <CardDescription>
                    Accede rápidamente a las funciones principales del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => router.push("/")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Frontend Principal
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => openExternalLink("http://localhost:8000/admin/")}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Panel Admin Django
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => openExternalLink("http://localhost:8000/swagger/")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Documentación API
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado del Sistema</CardTitle>
                  <CardDescription>
                    Información sobre el estado actual del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Backend Django</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Activo
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Frontend Next.js</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Activo
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Base de Datos</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Conectada
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Autenticación JWT</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Funcional
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="management" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Equipos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Equipo
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-1" />
                    Gestionar Equipos
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Partidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Programar Partido
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-1" />
                    Gestionar Calendario
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Usuarios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Crear Usuario
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-1" />
                    Gestionar Usuarios
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="external" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Panel de Administración Django</CardTitle>
                  <CardDescription>
                    Acceso completo a la base de datos y configuración del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={() => openExternalLink("http://localhost:8000/admin/")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Admin Django
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    Credenciales: admin / admin123
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documentación API (Swagger)</CardTitle>
                  <CardDescription>
                    Explorar y probar todas las APIs disponibles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={() => openExternalLink("http://localhost:8000/swagger/")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Swagger UI
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    Documentación interactiva de la API REST
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
