"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Dashboard } from "@/components/dashboard"
import { Teams } from "@/components/teams"
import { Players } from "@/components/players"
import { Schedule } from "@/components/schedule"
import { Standings } from "@/components/standings"

export default function FulbitoApp() {
  const [activeView, setActiveView] = useState("dashboard")

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />
      case "teams":
        return <Teams />
      case "players":
        return <Players />
      case "schedule":
        return <Schedule />
      case "standings":
        return <Standings />
      default:
        return <Dashboard />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-green-50 to-blue-50">
        <AppSidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-6">{renderView()}</main>
      </div>
    </SidebarProvider>
  )
}
