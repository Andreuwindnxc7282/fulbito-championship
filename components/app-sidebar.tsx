"use client"

import { Trophy, Users, UserCheck, Calendar, BarChart3, Home, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    id: "dashboard",
  },
  {
    title: "Equipos",
    icon: Users,
    id: "teams",
  },
  {
    title: "Jugadores",
    icon: UserCheck,
    id: "players",
  },
  {
    title: "Calendario",
    icon: Calendar,
    id: "schedule",
  },
  {
    title: "Tabla de Posiciones",
    icon: BarChart3,
    id: "standings",
  },
]

interface AppSidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export function AppSidebar({ activeView, setActiveView }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-green-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-500">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">FulbitoManager</h1>
            <p className="text-sm text-gray-500">Campeonato 2025</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-medium">Gestión del Campeonato</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveView(item.id)}
                    isActive={activeView === item.id}
                    className="w-full justify-start gap-3 px-3 py-2 text-left hover:bg-green-50 data-[active=true]:bg-green-100 data-[active=true]:text-green-700"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50">
              <Settings className="h-5 w-5" />
              <span>Configuración</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
