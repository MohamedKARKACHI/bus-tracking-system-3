"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsGrid } from "@/components/stats-grid"
import { LiveMap } from "@/components/live-map"
import { RecentActivity } from "@/components/recent-activity"
import { FleetStatus } from "@/components/fleet-status"
import { QuickActions } from "@/components/quick-actions"
import { RecentTickets } from "@/components/recent-tickets"
import { AdminRouteProgress } from "@/components/admin-route-progress"

export default function Page() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role !== "admin") {
      // Redirect non-admin users to their appropriate portal
      if (user.role === "driver") {
        router.push("/driver-portal")
      } else {
        router.push("/client-portal")
      }
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 min-h-screen">
        <DashboardHeader />

        <StatsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <LiveMap />
            <AdminRouteProgress />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FleetStatus />
              <QuickActions />
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            <RecentActivity />
            <RecentTickets />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
