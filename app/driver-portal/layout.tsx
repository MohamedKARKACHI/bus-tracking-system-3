"use client"

import type React from "react"
import { DriverSidebarProvider } from "@/lib/driver-sidebar-context"
import { DriverPortalSidebar } from "@/components/driver-portal-sidebar"
import { DriverPortalHeader } from "@/components/driver-portal-header"
import { useDriverSidebar } from "@/lib/driver-sidebar-context"
import { cn } from "@/lib/utils"

export default function DriverPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <DriverSidebarProvider>
      <DriverPortalContent>{children}</DriverPortalContent>
    </DriverSidebarProvider>
  )
}

function DriverPortalContent({ children }: { children: React.ReactNode }) {
  const { sidebarExpanded } = useDriverSidebar()
  
  return (
    <div className="min-h-screen bg-background">
      <DriverPortalSidebar />
      <div className={cn(
        "transition-all duration-300",
        sidebarExpanded ? "lg:pl-72" : "lg:pl-20"
      )}>
        <DriverPortalHeader />
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
