"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DriverSidebarProvider } from "@/lib/driver-sidebar-context"
import { DriverPortalSidebar } from "@/components/driver-portal-sidebar"
import { DriverPortalHeader } from "@/components/driver-portal-header"
import { useDriverSidebar } from "@/lib/driver-sidebar-context"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

import { MobileNav } from "@/components/mobile-nav"
import { Toaster } from "@/components/ui/toaster"

export default function DriverPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <DriverSidebarProvider>
      <DriverPortalContent>{children}</DriverPortalContent>
    </DriverSidebarProvider>
  )
}

function DriverPortalContent({ children }: { children: React.ReactNode }) {
  const { sidebarExpanded } = useDriverSidebar()
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login')
      } else if (user.role !== 'driver') {
        // Redirect based on role if they are logged in but not a driver
        if (user.role === 'admin') router.replace('/admin')
        else if (user.role === 'client') router.replace('/client-portal')
        else router.replace('/login')
      }
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== 'driver') {
    return null // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background pb-0">
      <DriverPortalSidebar />
      <div className={cn(
        "transition-all duration-300",
        sidebarExpanded ? "lg:pl-72" : "lg:pl-20"
      )}>
        <DriverPortalHeader />
        <main className="min-h-screen pb-32 lg:pb-8">{children}</main>
      </div>
      <MobileNav />
      <Toaster />
    </div>
  )
}
