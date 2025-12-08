"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard-shell"
import { AdminIdCard } from "@/components/admin-id-card"
import { AdminStatsCards } from "@/components/admin-stats-cards"
import { AdminQuickStats } from "@/components/admin-quick-stats"
import { AdminRouteProgress } from "@/components/admin-route-progress"
import { LiveMap } from "@/components/live-map"
import { FleetStatus } from "@/components/fleet-status"
import { GlassCard } from "@/components/ui/glass-card"
import { Shield, MapPin, Activity, Route, TrendingUp } from "lucide-react"

export default function Page() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Welcome back, {user?.name || "Admin"}
                </p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">System Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Cards - Single Line at Top */}
          <div className="mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <AdminStatsCards />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent mb-6" />

          {/* Main Section - ID Card Left, Map & Routes Right */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
            {/* Left - Admin ID Card & Fleet Status */}
            <div className="xl:col-span-4 space-y-6">
              {/* Admin ID Card */}
              <GlassCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin ID</h2>
                </div>
                <AdminIdCard
                  admin={{
                    id: user?.id || "ADM-2024-001",
                    name: user?.name || "Admin User",
                    email: user?.email || "admin@bustrack.com",
                    avatar: user?.avatar,
                    department: "Operations",
                    position: user?.role || "Admin",
                    joinDate: "Jan 2024",
                    accessLevel: "Full Access",
                  }}
                />
              </GlassCard>

              {/* Fleet Status */}
              <GlassCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Fleet Status</h2>
                </div>
                <FleetStatus />
              </GlassCard>
            </div>

            {/* Right - Map & Routes (Bigger) */}
            <div className="xl:col-span-8 space-y-6">
              {/* Live Fleet Tracking Map */}
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Live Fleet Tracking</h2>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold text-red-700 dark:text-red-400">LIVE</span>
                  </div>
                </div>
                <div className="h-[400px] rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-800">
                  <LiveMap />
                </div>
              </GlassCard>

              {/* Live Routes and Performance - Below Map */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Routes */}
                <GlassCard className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Route className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Live Routes</h2>
                  </div>
                  <AdminRouteProgress />
                </GlassCard>

                {/* Performance Metrics */}
                <GlassCard className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Performance</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* On-Time Performance */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">On-Time Performance</span>
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">94%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>

                    {/* Customer Satisfaction */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Customer Satisfaction</span>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">4.8</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-5 h-5 fill-amber-400" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    {/* Active Alerts */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Alerts</span>
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">2 traffic delays, 1 maintenance</p>
                    </div>

                    {/* Average Speed */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Average Speed</span>
                        <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">45 km/h</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Within optimal range</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
