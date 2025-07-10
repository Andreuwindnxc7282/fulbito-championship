"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Play, AlertCircle } from "lucide-react"
import { useMatchCountdown } from "@/hooks/use-match-countdown"
import { LiveMatchData } from "@/lib/real-api-data"

interface LiveMatchWidgetProps {
  matches: LiveMatchData[]
  showLiveOnly?: boolean
}

function MatchStatusBadge({ status, isLive }: { status: string; isLive: boolean }) {
  if (isLive) {
    return (
      <Badge className="bg-red-500 text-white animate-pulse">
        <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
        EN VIVO
      </Badge>
    )
  }
  switch (status) {
    case "scheduled":
      return <Badge variant="outline">Programado</Badge>
    case "finished":
      return <Badge variant="secondary">Finalizado</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function MatchWidget({ match }: { match: LiveMatchData }) {
  const { days, hours, minutes, seconds, isLive, hasStarted } = useMatchCountdown(match.datetime)

  const matchDate = new Date(match.datetime)
  const formattedDate = matchDate.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
  })
  const formattedTime = matchDate.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Card className={`transition-all duration-300 ${isLive ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MatchStatusBadge status={match.status} isLive={isLive} />
            <span className="text-sm text-gray-500">{formattedDate} • {formattedTime}</span>
          </div>
          {isLive && (
            <Button size="sm" className="bg-red-500 hover:bg-red-600">
              <Play className="h-3 w-3 mr-1" />
              Ver
            </Button>
          )}
        </div>
        <div className="text-center mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 text-right pr-4">
              <h3 className="font-bold text-gray-900">{match.homeTeam}</h3>
            </div>
            <div className="flex flex-col items-center min-w-[60px]">
              {hasStarted ? (
                <div className="text-2xl font-bold text-gray-900">
                  {match.homeScore} - {match.awayScore}
                </div>
              ) : (
                <div className="text-lg text-gray-400">vs</div>
              )}
            </div>
            <div className="flex-1 text-left pl-4">
              <h3 className="font-bold text-gray-900">{match.awayTeam}</h3>
            </div>
          </div>
        </div>
        {!hasStarted && (
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Comienza en:</div>
            <div className="flex justify-center gap-4 text-sm">
              {days > 0 && (
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-blue-600">{days}</span>
                  <span className="text-xs text-gray-500">días</span>
                </div>
              )}
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-blue-600">{hours}</span>
                <span className="text-xs text-gray-500">hrs</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-blue-600">{minutes}</span>
                <span className="text-xs text-gray-500">min</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-blue-600">{seconds}</span>
                <span className="text-xs text-gray-500">seg</span>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mt-3 pt-3 border-t border-gray-200">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {match.venue}
          </span>
        </div>
        {match.events && match.events.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Últimos eventos:</div>
            <div className="space-y-1">
              {match.events.slice(-2).map((event, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span>{event.minute}' {event.player_name}</span>
                  <span className="uppercase font-medium">{event.event_type.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function LiveMatchWidget({ matches, showLiveOnly = false }: LiveMatchWidgetProps) {
  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">No hay partidos disponibles</p>
      </div>
    )
  }
  
  const filteredMatches = showLiveOnly 
    ? matches.filter(match => match.status === 'live')
    : matches
  
  if (filteredMatches.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">
          {showLiveOnly ? 'No hay partidos en vivo' : 'No hay partidos programados'}
        </p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {filteredMatches.map((match) => (
        <MatchWidget key={match.id} match={match} />
      ))}
    </div>
  )
}
