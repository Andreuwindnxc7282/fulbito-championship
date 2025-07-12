"use client"

import { useState } from "react"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, User, Trophy, Target, Calendar, Edit, Trash2 } from "lucide-react"

export function Players() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTeam, setFilterTeam] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [playerToDelete, setPlayerToDelete] = useState<any>(null)
  const { toast } = useToast()

  const players = [
    // Real Madrid 2025
    { id: 1, firstName: "Thibaut", lastName: "Courtois", birthDate: "1992-05-11", position: "Portero", team: "Real Madrid", goals: 0, assists: 0, yellowCards: 0, redCards: 0, matchesPlayed: 8, number: 1, age: 32 },
    { id: 2, firstName: "Dani", lastName: "Carvajal", birthDate: "1992-01-11", position: "Defensor", team: "Real Madrid", goals: 1, assists: 3, yellowCards: 2, redCards: 0, matchesPlayed: 8, number: 2, age: 32 },
    { id: 3, firstName: "Eder", lastName: "Militão", birthDate: "1998-01-18", position: "Defensor", team: "Real Madrid", goals: 2, assists: 1, yellowCards: 1, redCards: 0, matchesPlayed: 7, number: 3, age: 27 },
    { id: 4, firstName: "David", lastName: "Alaba", birthDate: "1992-06-24", position: "Defensor", team: "Real Madrid", goals: 1, assists: 2, yellowCards: 1, redCards: 0, matchesPlayed: 6, number: 4, age: 32 },
    { id: 5, firstName: "Jude", lastName: "Bellingham", birthDate: "2003-06-29", position: "Centrocampista", team: "Real Madrid", goals: 4, assists: 5, yellowCards: 2, redCards: 0, matchesPlayed: 8, number: 5, age: 21 },
    { id: 6, firstName: "Luka", lastName: "Modrić", birthDate: "1985-09-09", position: "Centrocampista", team: "Real Madrid", goals: 1, assists: 6, yellowCards: 1, redCards: 0, matchesPlayed: 7, number: 10, age: 39 },
    { id: 7, firstName: "Vinícius", lastName: "Jr.", birthDate: "2000-07-12", position: "Delantero", team: "Real Madrid", goals: 6, assists: 4, yellowCards: 3, redCards: 0, matchesPlayed: 8, number: 7, age: 24 },
    { id: 8, firstName: "Kylian", lastName: "Mbappé", birthDate: "1998-12-20", position: "Delantero", team: "Real Madrid", goals: 10, assists: 3, yellowCards: 1, redCards: 0, matchesPlayed: 8, number: 9, age: 26 },

    // Manchester City 2025
    { id: 9, firstName: "Ederson", lastName: "Moraes", birthDate: "1993-08-17", position: "Portero", team: "Manchester City", goals: 0, assists: 1, yellowCards: 0, redCards: 0, matchesPlayed: 10, number: 31, age: 31 },
    { id: 10, firstName: "Kyle", lastName: "Walker", birthDate: "1990-05-28", position: "Defensor", team: "Manchester City", goals: 0, assists: 2, yellowCards: 3, redCards: 0, matchesPlayed: 9, number: 2, age: 34 },
    { id: 11, firstName: "Ruben", lastName: "Dias", birthDate: "1997-05-14", position: "Defensor", team: "Manchester City", goals: 1, assists: 0, yellowCards: 2, redCards: 0, matchesPlayed: 10, number: 3, age: 27 },
    { id: 12, firstName: "Josko", lastName: "Gvardiol", birthDate: "2002-01-23", position: "Defensor", team: "Manchester City", goals: 2, assists: 1, yellowCards: 1, redCards: 0, matchesPlayed: 8, number: 24, age: 22 },
    { id: 13, firstName: "Rodri", lastName: "Hernández", birthDate: "1996-06-22", position: "Centrocampista", team: "Manchester City", goals: 3, assists: 4, yellowCards: 4, redCards: 0, matchesPlayed: 10, number: 16, age: 28 },
    { id: 14, firstName: "Kevin", lastName: "De Bruyne", birthDate: "1991-06-28", position: "Centrocampista", team: "Manchester City", goals: 2, assists: 8, yellowCards: 1, redCards: 0, matchesPlayed: 9, number: 17, age: 33 },
    { id: 15, firstName: "Phil", lastName: "Foden", birthDate: "2000-05-28", position: "Centrocampista", team: "Manchester City", goals: 5, assists: 6, yellowCards: 2, redCards: 0, matchesPlayed: 10, number: 47, age: 24 },
    { id: 16, firstName: "Erling", lastName: "Haaland", birthDate: "2000-07-21", position: "Delantero", team: "Manchester City", goals: 12, assists: 2, yellowCards: 1, redCards: 0, matchesPlayed: 10, number: 9, age: 24 },

    // Arsenal 2025
    { id: 17, firstName: "David", lastName: "Raya", birthDate: "1995-09-15", position: "Portero", team: "Arsenal", goals: 0, assists: 0, yellowCards: 0, redCards: 0, matchesPlayed: 12, number: 22, age: 29 },
    { id: 18, firstName: "Ben", lastName: "White", birthDate: "1997-10-08", position: "Defensor", team: "Arsenal", goals: 1, assists: 4, yellowCards: 2, redCards: 0, matchesPlayed: 12, number: 4, age: 27 },
    { id: 19, firstName: "William", lastName: "Saliba", birthDate: "2001-03-24", position: "Defensor", team: "Arsenal", goals: 2, assists: 1, yellowCards: 1, redCards: 0, matchesPlayed: 12, number: 2, age: 23 },
    { id: 20, firstName: "Gabriel", lastName: "Magalhães", birthDate: "1997-12-19", position: "Defensor", team: "Arsenal", goals: 3, assists: 0, yellowCards: 3, redCards: 0, matchesPlayed: 11, number: 6, age: 27 },
    { id: 21, firstName: "Declan", lastName: "Rice", birthDate: "1999-01-14", position: "Centrocampista", team: "Arsenal", goals: 2, assists: 3, yellowCards: 3, redCards: 0, matchesPlayed: 12, number: 41, age: 26 },
    { id: 22, firstName: "Martin", lastName: "Ødegaard", birthDate: "1998-12-17", position: "Centrocampista", team: "Arsenal", goals: 5, assists: 8, yellowCards: 1, redCards: 0, matchesPlayed: 11, number: 8, age: 26 },
    { id: 23, firstName: "Bukayo", lastName: "Saka", birthDate: "2001-09-05", position: "Delantero", team: "Arsenal", goals: 9, assists: 7, yellowCards: 2, redCards: 0, matchesPlayed: 12, number: 7, age: 23 },
    { id: 24, firstName: "Gabriel", lastName: "Jesus", birthDate: "1997-04-03", position: "Delantero", team: "Arsenal", goals: 6, assists: 4, yellowCards: 1, redCards: 0, matchesPlayed: 10, number: 9, age: 27 },

    // Inter Miami 2025
    { id: 25, firstName: "Drake", lastName: "Callender", birthDate: "1997-10-05", position: "Portero", team: "Inter Miami", goals: 0, assists: 0, yellowCards: 1, redCards: 0, matchesPlayed: 9, number: 1, age: 27 },
    { id: 26, firstName: "Jordi", lastName: "Alba", birthDate: "1989-03-21", position: "Defensor", team: "Inter Miami", goals: 1, assists: 5, yellowCards: 2, redCards: 0, matchesPlayed: 8, number: 18, age: 35 },
    { id: 27, firstName: "Sergio", lastName: "Busquets", birthDate: "1988-07-16", position: "Centrocampista", team: "Inter Miami", goals: 0, assists: 4, yellowCards: 3, redCards: 0, matchesPlayed: 9, number: 5, age: 36 },
    { id: 28, firstName: "Lionel", lastName: "Messi", birthDate: "1987-06-24", position: "Delantero", team: "Inter Miami", goals: 8, assists: 6, yellowCards: 1, redCards: 0, matchesPlayed: 9, number: 10, age: 37 },
    { id: 29, firstName: "Luis", lastName: "Suárez", birthDate: "1987-01-24", position: "Delantero", team: "Inter Miami", goals: 4, assists: 2, yellowCards: 2, redCards: 0, matchesPlayed: 8, number: 9, age: 38 },
    { id: 30, firstName: "Leonardo", lastName: "Campana", birthDate: "2000-07-24", position: "Delantero", team: "Inter Miami", goals: 2, assists: 1, yellowCards: 0, redCards: 0, matchesPlayed: 7, number: 19, age: 24 }
  ]

  const teams = ["Real Madrid", "Manchester City", "Arsenal", "Inter Miami"]
  const positions = ["Portero", "Defensor", "Centrocampista", "Delantero"]

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTeam = filterTeam === "all" || player.team === filterTeam

    return matchesSearch && matchesTeam
  }).sort((a, b) => {
    let aValue: string | number, bValue: string | number
    
    switch (sortBy) {
      case "name":
        aValue = `${a.firstName} ${a.lastName}`
        bValue = `${b.firstName} ${b.lastName}`
        break
      case "goals":
        aValue = a.goals
        bValue = b.goals
        break
      case "assists":
        aValue = a.assists
        bValue = b.assists
        break
      case "age":
        aValue = a.age
        bValue = b.age
        break
      default:
        aValue = a.team
        bValue = b.team
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" 
        ? aValue - bValue
        : bValue - aValue
    }
    return 0
  })

  // Estadísticas resumidas
  const totalPlayers = filteredPlayers.length
  const totalGoals = filteredPlayers.reduce((sum, player) => sum + player.goals, 0)
  const totalAssists = filteredPlayers.reduce((sum, player) => sum + player.assists, 0)
  const avgAge = filteredPlayers.length > 0 
    ? (filteredPlayers.reduce((sum, player) => sum + player.age, 0) / filteredPlayers.length).toFixed(1)
    : 0

  const getPositionColor = (position: string) => {
    switch (position) {
      case "Portero":
        return "bg-yellow-100 text-yellow-800"
      case "Defensor":
        return "bg-blue-100 text-blue-800"
      case "Centrocampista":
        return "bg-green-100 text-green-800"
      case "Delantero":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  // Funciones para editar y eliminar jugadores
  const handleEditPlayer = (player: any) => {
    setSelectedPlayer(player)
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  const handleDeletePlayer = (player: any) => {
    setPlayerToDelete(player)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeletePlayer = () => {
    // Aquí se haría la llamada a la API para eliminar el jugador
    console.log("Eliminando jugador:", playerToDelete)
    // Por ahora solo mostramos un mensaje
    toast({
      title: "Jugador eliminado",
      description: `${playerToDelete.firstName} ${playerToDelete.lastName} ha sido eliminado del campeonato.`,
      variant: "destructive",
    })
    setIsDeleteDialogOpen(false)
    setPlayerToDelete(null)
  }

  const handleSavePlayer = () => {
    if (isEditMode) {
      // Aquí se haría la llamada a la API para actualizar el jugador
      console.log("Actualizando jugador:", selectedPlayer)
      toast({
        title: "Jugador actualizado",
        description: `Los datos de ${selectedPlayer.firstName} ${selectedPlayer.lastName} han sido actualizados.`,
      })
    } else {
      // Aquí se haría la llamada a la API para crear el jugador
      console.log("Creando nuevo jugador")
      toast({
        title: "Jugador creado",
        description: "El nuevo jugador ha sido agregado al campeonato.",
      })
    }
    setIsDialogOpen(false)
    setIsEditMode(false)
    setSelectedPlayer(null)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setIsEditMode(false)
    setSelectedPlayer(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Jugadores</h1>
          <p className="text-gray-600">Administra los jugadores del campeonato 2025</p>
          
          {/* Estadísticas resumidas */}
          <div className="flex gap-4 mt-2">
            <div className="text-sm text-gray-500">
              <span className="font-medium">{totalPlayers}</span> jugadores
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium">{totalGoals}</span> goles
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium">{totalAssists}</span> asistencias
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium">{avgAge}</span> años promedio
            </div>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Jugador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Editar Jugador" : "Agregar Nuevo Jugador"}</DialogTitle>
              <DialogDescription>
                {isEditMode ? "Modifica la información del jugador." : "Completa la información del jugador para agregarlo al campeonato."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  Nombre
                </Label>
                <Input 
                  id="firstName" 
                  placeholder="Nombre" 
                  className="col-span-3" 
                  defaultValue={isEditMode ? selectedPlayer?.firstName : ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Apellido
                </Label>
                <Input 
                  id="lastName" 
                  placeholder="Apellido" 
                  className="col-span-3" 
                  defaultValue={isEditMode ? selectedPlayer?.lastName : ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="birthDate" className="text-right">
                  Fecha Nac.
                </Label>
                <Input 
                  id="birthDate" 
                  type="date" 
                  className="col-span-3" 
                  defaultValue={isEditMode ? selectedPlayer?.birthDate : ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  Posición
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar posición" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="team" className="text-right">
                  Equipo
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleSavePlayer}>
                {isEditMode ? "Actualizar" : "Guardar"} Jugador
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar jugadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterTeam} onValueChange={setFilterTeam}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por equipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los equipos</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team} value={team}>
                {team}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nombre</SelectItem>
            <SelectItem value="goals">Goles</SelectItem>
            <SelectItem value="assists">Asistencias</SelectItem>
            <SelectItem value="age">Edad</SelectItem>
            <SelectItem value="team">Equipo</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="px-3"
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </Button>

        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {filteredPlayers.length} jugadores encontrados
        </Badge>
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Mostrando {filteredPlayers.length} de {players.length} jugadores
        </div>
        {filteredPlayers.length === 0 && (
          <div className="text-sm text-gray-400">
            No se encontraron jugadores con los filtros aplicados
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map((player) => (
          <Card
            key={player.id}
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {player.firstName[0]}
                    {player.lastName[0]}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {player.firstName} {player.lastName}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {calculateAge(player.birthDate)} años • {player.team}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getPositionColor(player.position)}>{player.position}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span>{player.goals} goles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span>{player.assists} asistencias</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  <span>{player.matchesPlayed} partidos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span>{player.yellowCards} amarillas</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="bg-green-50 p-2 rounded">
                  <div className="font-bold text-green-700">{player.goals}</div>
                  <div className="text-green-600">Goles</div>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="font-bold text-blue-700">{player.assists}</div>
                  <div className="text-blue-600">Asistencias</div>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <div className="font-bold text-purple-700">{player.matchesPlayed}</div>
                  <div className="text-purple-600">Partidos</div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleEditPlayer(player)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent" onClick={() => handleDeletePlayer(player)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estadísticas resumidas */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Estadísticas Resumidas</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{totalGoals}</div>
            <div className="text-sm text-green-600">Goles Totales</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{totalAssists}</div>
            <div className="text-sm text-blue-600">Asistencias Totales</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">{totalPlayers}</div>
            <div className="text-sm text-purple-600">Jugadores Totales</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-500">
            Edad Promedio:{" "}
            <span className="font-semibold text-gray-800">{avgAge} años</span>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación para eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar a{" "}
              <span className="font-semibold">{playerToDelete?.firstName} {playerToDelete?.lastName}</span>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 py-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={confirmDeletePlayer}>
              Eliminar Jugador
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}