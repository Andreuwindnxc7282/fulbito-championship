import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal, Award } from "lucide-react"

export function Standings() {
  const groupAStandings = [
    {
      position: 1,
      team: "Real Madrid",
      logo: "🏆",
      played: 11,
      won: 8,
      drawn: 2,
      lost: 1,
      goalsFor: 24,
      goalsAgainst: 8,
      goalDifference: 16,
      points: 26,
      form: ["W", "W", "D", "W", "W"],
      trend: "up",
    },
    {
      position: 2,
      team: "Barcelona",
      logo: "⚽",
      played: 11,
      won: 7,
      drawn: 3,
      lost: 1,
      goalsFor: 22,
      goalsAgainst: 10,
      goalDifference: 12,
      points: 24,
      form: ["W", "D", "W", "W", "D"],
      trend: "up",
    },
    {
      position: 3,
      team: "PSG",
      logo: "🇫🇷",
      played: 11,
      won: 5,
      drawn: 4,
      lost: 2,
      goalsFor: 18,
      goalsAgainst: 12,
      goalDifference: 6,
      points: 19,
      form: ["D", "W", "L", "D", "W"],
      trend: "same",
    },
    {
      position: 4,
      team: "Juventus",
      logo: "⚪",
      played: 11,
      won: 5,
      drawn: 3,
      lost: 3,
      goalsFor: 16,
      goalsAgainst: 14,
      goalDifference: 2,
      points: 18,
      form: ["L", "W", "W", "D", "L"],
      trend: "down",
    },
    {
      position: 5,
      team: "AC Milan",
      logo: "🔴",
      played: 11,
      won: 4,
      drawn: 4,
      lost: 3,
      goalsFor: 15,
      goalsAgainst: 15,
      goalDifference: 0,
      points: 16,
      form: ["D", "L", "W", "D", "W"],
      trend: "up",
    },
    {
      position: 6,
      team: "Inter Milan",
      logo: "🔵",
      played: 11,
      won: 3,
      drawn: 5,
      lost: 3,
      goalsFor: 12,
      goalsAgainst: 16,
      goalDifference: -4,
      points: 14,
      form: ["D", "D", "L", "W", "D"],
      trend: "down",
    },
  ]

  const groupBStandings = [
    {
      position: 1,
      team: "Manchester City",
      logo: "🔵",
      played: 11,
      won: 6,
      drawn: 4,
      lost: 1,
      goalsFor: 20,
      goalsAgainst: 9,
      goalDifference: 11,
      points: 22,
      form: ["W", "D", "W", "W", "D"],
      trend: "up",
    },
    {
      position: 2,
      team: "Liverpool",
      logo: "🔴",
      played: 11,
      won: 6,
      drawn: 3,
      lost: 2,
      goalsFor: 19,
      goalsAgainst: 11,
      goalDifference: 8,
      points: 21,
      form: ["W", "W", "L", "W", "D"],
      trend: "up",
    },
    {
      position: 3,
      team: "Chelsea",
      logo: "🔵",
      played: 11,
      won: 5,
      drawn: 4,
      lost: 2,
      goalsFor: 17,
      goalsAgainst: 13,
      goalDifference: 4,
      points: 19,
      form: ["D", "W", "W", "D", "L"],
      trend: "same",
    },
    {
      position: 4,
      team: "Arsenal",
      logo: "🔴",
      played: 11,
      won: 5,
      drawn: 2,
      lost: 4,
      goalsFor: 16,
      goalsAgainst: 16,
      goalDifference: 0,
      points: 17,
      form: ["L", "W", "L", "W", "W"],
      trend: "up",
    },
    {
      position: 5,
      team: "Tottenham",
      logo: "⚪",
      played: 11,
      won: 4,
      drawn: 3,
      lost: 4,
      goalsFor: 14,
      goalsAgainst: 17,
      goalDifference: -3,
      points: 15,
      form: ["L", "D", "W", "L", "D"],
      trend: "down",
    },
    {
      position: 6,
      team: "Manchester United",
      logo: "🔴",
      played: 11,
      won: 3,
      drawn: 4,
      lost: 4,
      goalsFor: 13,
      goalsAgainst: 18,
      goalDifference: -5,
      points: 13,
      form: ["L", "D", "L", "D", "W"],
      trend: "down",
    },
  ]

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 3:
        return <Award className="h-4 w-4 text-orange-500" />
      default:
        return <span className="text-sm font-bold text-gray-500">{position}</span>
    }
  }

  const getPositionColor = (position: number) => {
    if (position <= 2) return "bg-green-50 border-l-4 border-green-500"
    if (position <= 4) return "bg-blue-50 border-l-4 border-blue-500"
    return "bg-gray-50"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getFormColor = (result: string) => {
    switch (result) {
      case "W":
        return "bg-green-500 text-white"
      case "D":
        return "bg-yellow-500 text-white"
      case "L":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const StandingsTable = ({ standings, groupName }: { standings: any[]; groupName: string }) => (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          {groupName}
        </CardTitle>
        <CardDescription>Tabla de posiciones actualizada</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {standings.map((team) => (
            <div
              key={team.position}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all hover:shadow-md ${getPositionColor(team.position)}`}
            >
              {/* Position */}
              <div className="flex items-center justify-center w-8">{getPositionIcon(team.position)}</div>

              {/* Team Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl">{team.logo}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{team.team}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {team.form.map((result, index) => (
                      <span
                        key={index}
                        className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${getFormColor(result)}`}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="font-bold text-gray-900">{team.played}</p>
                  <p className="text-gray-500 text-xs">PJ</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-green-600">{team.won}</p>
                  <p className="text-gray-500 text-xs">G</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-yellow-600">{team.drawn}</p>
                  <p className="text-gray-500 text-xs">E</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-red-600">{team.lost}</p>
                  <p className="text-gray-500 text-xs">P</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">
                    {team.goalsFor}:{team.goalsAgainst}
                  </p>
                  <p className="text-gray-500 text-xs">GF:GC</p>
                </div>
                <div className="text-center">
                  <p className={`font-bold ${team.goalDifference >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {team.goalDifference > 0 ? "+" : ""}
                    {team.goalDifference}
                  </p>
                  <p className="text-gray-500 text-xs">DG</p>
                </div>
              </div>

              {/* Points and Trend */}
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{team.points}</p>
                  <p className="text-gray-500 text-xs">PTS</p>
                </div>
                {getTrendIcon(team.trend)}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Leyenda</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Clasifican a Semifinales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Repechaje</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="h-3 w-3 text-yellow-500" />
              <span>Líder</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>Tendencia positiva</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tabla de Posiciones</h1>
          <p className="text-gray-600">Clasificación en vivo del campeonato</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Trophy className="h-3 w-3 mr-1" />
          Actualizado en vivo
        </Badge>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-600">Partidos Jugados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-600">Goles Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">6.5</p>
                <p className="text-sm text-gray-600">Promedio Goles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <Medal className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">42</p>
                <p className="text-sm text-gray-600">Partidos Restantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="groupA" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="groupA" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Grupo A
          </TabsTrigger>
          <TabsTrigger value="groupB" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Grupo B
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groupA" className="space-y-4">
          <StandingsTable standings={groupAStandings} groupName="Grupo A" />
        </TabsContent>

        <TabsContent value="groupB" className="space-y-4">
          <StandingsTable standings={groupBStandings} groupName="Grupo B" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
