"use client"

import { useEffect, useState } from "react"
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
import { Shield, MapPin, Activity, Route, TrendingUp, ChevronDown, Bus } from "lucide-react"

export default function Page() {
  const { user } = useAuth()
  const router = useRouter()
  const [isIdCardExpanded, setIsIdCardExpanded] = useState(false)

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Top Row: Header + Stats */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Welcome back, {user?.name || "John Admin"}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 w-fit">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">System Operational</span>
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <AdminStatsCards />
          </div>

          {/* Main Grid: 3 columns on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column - Admin ID & Live Routes */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-6">
              {/* Admin ID Card - Collapsible */}
              <GlassCard className="overflow-hidden">
                <button
                  onClick={() => setIsIdCardExpanded(!isIdCardExpanded)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">Admin ID Card</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Click to {isIdCardExpanded ? 'collapse' : 'expand'}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isIdCardExpanded ? 'rotate-180' : ''}`} />
                </button>

                <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isIdCardExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="p-4 pt-0 border-t border-slate-200 dark:border-slate-800">
                      <AdminIdCard
                        admin={{
                          id: user?.id || "ADM-2024-001",
                          name: user?.name || "John Admin",
                          email: user?.email || "admin@bustrack.com",
                          avatar: user?.avatar,
                          department: "Operations",
                          position: user?.role || "System Administrator",
                          joinDate: "Jan 2024",
                          accessLevel: "Full Access",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Live Routes */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Route className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Live Routes</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Active bus tracking</p>
                  </div>
                </div>
                <AdminRouteProgress />
              </GlassCard>
            </div>

            {/* Center Column - Map */}
            <div className="lg:col-span-8 xl:col-span-6">
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">Live Fleet Tracking</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Real-time GPS monitoring</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-800">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold text-red-700 dark:text-red-400">LIVE</span>
                  </div>
                </div>
                <div className="h-[450px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <LiveMap />
                </div>
              </GlassCard>
            </div>

            {/* Right Column - Fleet Status & Performance */}
            <div className="lg:col-span-12 xl:col-span-3 space-y-6">
              {/* Fleet Status */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Bus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Fleet Status</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Vehicle overview</p>
                  </div>
                </div>
                <FleetStatus />
              </GlassCard>

              {/* Performance Metrics */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Performance</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Key metrics</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {/* On-Time Performance */}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">On-Time</span>
                      <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">94%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>

                  {/* Customer Satisfaction */}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Satisfaction</span>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">4.8</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Active Alerts */}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Alerts</span>
                      <span className="text-xl font-bold text-purple-600 dark:text-purple-400">3</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">2 delays, 1 maintenance</p>
                  </div>

                  {/* Average Speed */}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Speed</span>
                      <span className="text-xl font-bold text-amber-600 dark:text-amber-400">45 km/h</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Optimal range</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
