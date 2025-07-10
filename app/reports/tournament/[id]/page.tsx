"use client"

import { useParams } from "next/navigation"
import { TournamentReport } from "@/components/reports/tournament-report"

export default function TournamentReportPage() {
  const params = useParams()
  const tournamentId = Number.parseInt(params.id as string, 10)

  return <TournamentReport tournamentId={tournamentId} />
}
