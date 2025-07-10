"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Trophy, Download, Printer, BarChart3, Calendar, Users, AlertCircle, Loader2 } from "lucide-react"
import { publicAPI } from "@/lib/api"

interface TournamentReportProps {
  tournamentId?: number
}

export function TournamentReport({ tournamentId = 1 }: TournamentReportProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tournamentData, setTournamentData] = useState<any>(null)

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await publicAPI.getStandings(tournamentId)
        setTournamentData(response.data)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching tournament data:", err)
        setError("No se pudo cargar la información del torneo")
        setIsLoading(false)
      }
    }

    fetchTournamentData()
  }, [tournamentId])

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = () => {
    // This would typically use a library like jsPDF
    alert("Exportando a PDF...")
  }

  const handleExportExcel = () => {
    // This would typically use a library like xlsx
    alert("Exportando a Excel...")
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
        <p className="text-lg font-medium text-gray-700">Cargando informe del torneo...</p>
      </div>
    )
  }

  if (error || !tournamentData) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg font-medium text-gray-700">{error || "Error al cargar los datos"}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Informe del Torneo</h1>
          <p className="text-gray-600">Estadísticas completas y resultados</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2 bg-transparent">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel} className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Información del Torneo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {tournamentData.tournament?.name || "Campeonato de Fulbito 2025"}
                </h3>
                <p className="text-sm text-gray-600">Temporada {tournamentData.tournament?.season_year || "2025"}</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {tournamentData.tournament?.is_active ? "Activo" : "Finalizado"}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Fecha de inicio</p>
                <p className="font-medium">{tournamentData.tournament?.start_date || "01/02/2025"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de fin</p>
                <p className="font-medium">{tournamentData.tournament?.end_date || "30/07/2025"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Equipos participantes</p>
                <p className="font-medium">{tournamentData.teams?.length || 12}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fases</p>
                <p className="font-medium">{tournamentData.stages?.length || 4}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Estadísticas Generales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-900">{tournamentData.stats?.total_matches || 66}</div>
                <p className="text-sm text-gray-600">Partidos Totales</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-900">{tournamentData.stats?.matches_played || 24}</div>
                <p className="text-sm text-gray-600">Partidos Jugados</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-900">{tournamentData.stats?.total_goals || 156}</div>
                <p className="text-sm text-gray-600">Goles Totales</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-900">
                  {tournamentData.stats?.avg_goals_per_match || 6.5}
                </div>
                <p className="text-sm text-gray-600">Promedio Goles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="standings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="standings" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Tabla de Posiciones
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendario
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Equipos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standings" className="space-y-4 pt-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">Pos</th>
                      <th className="px-4 py-3">Equipo</th>
                      <th className="px-4 py-3">PJ</th>
                      <th className="px-4 py-3">G</th>
                      <th className="px-4 py-3">E</th>
                      <th className="px-4 py-3">P</th>
                      <th className="px-4 py-3">GF</th>
                      <th className="px-4 py-3">GC</th>
                      <th className="px-4 py-3">DG</th>
                      <th className="px-4 py-3">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tournamentData.standings?.map((standing: any, index: number) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">{standing.team}</td>
                        <td className="px-4 py-3">{standing.played}</td>
                        <td className="px-4 py-3">{standing.won}</td>
                        <td className="px-4 py-3">{standing.drawn}</td>
                        <td className="px-4 py-3">{standing.lost}</td>
                        <td className="px-4 py-3">{standing.goals_for}</td>
                        <td className="px-4 py-3">{standing.goals_against}</td>
                        <td className="px-4 py-3">{standing.goal_difference}</td>
                        <td className="px-4 py-3 font-bold">{standing.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Filtrar por fase:</h3>
            <Select defaultValue="all">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todas las fases" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fases</SelectItem>
                <SelectItem value="group">Fase de Grupos</SelectItem>
                <SelectItem value="quarter">Cuartos de Final</SelectItem>
                <SelectItem value="semi">Semifinales</SelectItem>
                <SelectItem value="final">Final</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6 space-y-4">
              {tournamentData.stages?.map((stage: any) => (
                <div key={stage.id} className="space-y-4">
                  <h3 className="font-medium text-lg">{stage.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stage.matches?.slice(0, 4).map((match: any) => (
                      <div key={match.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">{match.datetime}</span>
                          <Badge variant="outline">{match.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{match.home_team}</span>
                          {match.status === "finished" ? (
                            <span className="font-bold">
                              {match.home_score} - {match.away_score}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">vs</span>
                          )}
                          <span className="font-medium">{match.away_team}</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">{match.venue}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournamentData.teams?.map((team: any) => (
              <Card key={team.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700">
                      {team.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{team.name}</h3>
                      <p className="text-sm text-gray-500">{team.group}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="font-bold">{team.stats?.played || 0}</div>
                      <div className="text-xs text-gray-500">Jugados</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="font-bold">{team.stats?.won || 0}</div>
                      <div className="text-xs text-gray-500">Ganados</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="font-bold">{team.stats?.points || 0}</div>
                      <div className="text-xs text-gray-500">Puntos</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
