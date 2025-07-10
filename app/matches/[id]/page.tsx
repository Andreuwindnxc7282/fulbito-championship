"use client"

import { useParams } from "next/navigation"
import { LiveMatch } from "@/components/match/live-match"
import { useAuth } from "@/hooks/use-auth"

export default function MatchPage() {
  const params = useParams()
  const { user } = useAuth()
  const matchId = params.id as string

  const isAdmin = user?.is_staff || false

  return <LiveMatch matchId={matchId} isAdmin={isAdmin} />
}
