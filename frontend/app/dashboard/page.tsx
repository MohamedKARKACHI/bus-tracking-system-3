"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard-shell"
import { MapboxMap } from "@/components/mapbox-map"
import { AdminRouteProgress } from "@/components/admin-route-progress"
import { AdminIdCard } from "@/components/admin-id-card"
import { Bus, CreditCard, AlertCircle, Clock, MoreHorizontal, ArrowUpRight, ArrowDownRight, Calendar, Search, Bell, User, Shield } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

// Zen-style Stat Card
function ZenStatCard({ title, value, change, trend, chartData }: { title: string; value: string; change: string; trend: 'up' | 'down', chartData?: number[] }) {
  return (
    <div
      className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all cursor-pointer"
      onClick={() => toast.info(`Viewing details for ${title}`)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 transition-colors">{title}</h3>
        {/* Simple Sparkline simulation */}
        <div className="h-8 w-20 flex items-end gap-1">
          {[40, 60, 45, 70, 50, 80, 60].map((h, i) => (
            <div key={i} className={`w-2 rounded-sm transition-all duration-500 ${trend === 'up' ? 'bg-emerald-100 group-hover:bg-emerald-200 dark:bg-emerald-900/30 dark:group-hover:bg-emerald-900/50' : 'bg-rose-100 group-hover:bg-rose-200 dark:bg-rose-900/30 dark:group-hover:bg-rose-900/50'}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h2>
        <div className="flex items-center gap-1.5">
          {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> : <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />}
          <span className={`text-xs font-semibold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>{change}</span>
          <span className="text-xs text-slate-400">last week</span>
        </div>
      </div>
    </div>
  )
}

// Zen-style List Item
function ZenListItem({ icon: Icon, title, subtitle, value, highlight, onClick }: any) {
  return (
    <div
      className="group flex items-center justify-between p-3 first:pt-0 last:pb-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer"
      onClick={onClick || (() => toast.info(`Clicked ${title}`))}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors">
          {typeof Icon === 'string' ? <span className="text-lg">{Icon}</span> : <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 transition-colors" />}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{title}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="block text-sm font-bold text-slate-800 dark:text-white">{value}</span>
        {highlight && <span className="inline-block h-1 w-12 rounded-full bg-blue-500/20"><div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} /></span>}
      </div>
    </div>
  )
}

export default function Page() {
  const { user } = useAuth()
  const [date] = useState(new Date())
  const [showIdCard, setShowIdCard] = useState(false)

  // Location tracking state
  const [locationName, setLocationName] = useState("Casablanca Region")
  const [nearestStation, setNearestStation] = useState<string | null>(null)
  const [stationDistance, setStationDistance] = useState<string | null>(null)

  // Listen for location updates from the map
  useEffect(() => {
    const handleLocationUpdate = (event: CustomEvent) => {
      const { locationName, nearestStation, distance } = event.detail
      if (locationName) setLocationName(locationName)
      if (nearestStation) setNearestStation(nearestStation)
      if (distance) setStationDistance(distance)
    }

    window.addEventListener('user-location-update', handleLocationUpdate as EventListener)
    return () => window.removeEventListener('user-location-update', handleLocationUpdate as EventListener)
  }, [])

  return (
    <DashboardShell>
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0B1120] p-6 lg:p-8 font-sans">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {user?.name || "Alex Jander"}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(date, "MMM d, yyyy 'at' hh:mm a")}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm text-sm hover:border-indigo-200 dark:hover:border-indigo-800 transition-all active:scale-95"
              onClick={() => toast.success("Refreshed Live View")}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="font-medium text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Live View</span>
            </button>
            <button
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm text-sm hover:border-amber-200 dark:hover:border-amber-800 transition-all active:scale-95"
              onClick={() => toast.warning("2 Critical Alerts Pending")}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="font-medium text-slate-600 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Alerts: 2</span>
            </button>

            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block" />

            <button
              className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-90"
              onClick={() => toast.info("No new notifications")}
            >
              <Bell className="w-5 h-5 text-slate-500" />
            </button>

            <button
              className={`p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-90 ${showIdCard ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' : ''}`}
              onClick={() => setShowIdCard(!showIdCard)}
              title="Show Admin ID"
            >
              <User className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN (Widgets) */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Admin ID Overlay/Toggle area - If active, show it prominently */}
            {showIdCard && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-white">Admin Identity</h3>
                  <button onClick={() => setShowIdCard(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    Close
                  </button>
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <AdminIdCard admin={user ? {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    position: "System Administrator",
                    department: "Operations",
                    joinDate: "Jan 2024",
                    accessLevel: "Root"
                  } : undefined} />

                  <div className="flex-1 space-y-4 py-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Access Privileges</h4>
                      <ul className="space-y-2">
                        {['Fleet Monitoring', 'Driver Management', 'Revenue Analytics', 'System Configuration'].map((perm) => (
                          <li key={perm} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <Shield className="w-3 h-3 text-emerald-500" />
                            {perm}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                      onClick={() => toast.success("Identity verified for offline use")}
                    >
                      Print ID Card
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 1. Stats Grid (2x2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ZenStatCard
                title="Active Buses"
                value="34"
                change="1.2%"
                trend="up"
              />
              <ZenStatCard
                title="Total Revenue"
                value="12,450 MAD"
                change="22.2%"
                trend="up"
              />
              <ZenStatCard
                title="Total Passengers"
                value="1,245"
                change="12.2%"
                trend="up"
              />
              <ZenStatCard
                title="Completed Trips"
                value="125"
                change="5.2%"
                trend="up"
              />
            </div>

            {/* 2. Top Routes (Bar Chart Style) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 dark:text-white">Top Routes</h3>
                <button
                  onClick={() => toast.info("Opening route management")}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5 text-slate-400 cursor-pointer" />
                </button>
              </div>

              <div className="space-y-6">
                {[
                  { name: "Downtown Express (Route 1)", val: 450, p: '75%', icon: '🚀' },
                  { name: "Airport Shuttle (Route 2)", val: 320, p: '55%', icon: '✈️' },
                  { name: "University Loop (Route 3)", val: 180, p: '35%', icon: '🎓' }
                ].map((route) => (
                  <div
                    key={route.name}
                    className="group cursor-pointer"
                    onClick={() => toast.info(`Route Details: ${route.name}`)}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 group-hover:text-indigo-500 transition-colors">
                        <span className="text-lg">{route.icon}</span> {route.name}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white group-hover:scale-105 transition-transform">{route.val} Trips</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-all duration-700" style={{ width: route.p }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Split Row: Recent Alerts & Fleet Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Alerts */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-white">System Alerts</h3>
                  <button
                    onClick={() => toast.info("Viewing all alerts")}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <AlertCircle className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <div className="space-y-4">
                  <ZenListItem onClick={() => toast.error("CRITICAL: Engine overheating on BUS-104")} icon={AlertCircle} title="Engine Warning" subtitle="BUS-104 • 2m ago" value="Critical" highlight={false} />
                  <ZenListItem onClick={() => toast.warning("Route 2 is experiencing heavy traffic")} icon={Clock} title="Route Delay" subtitle="Route 2 • 15m ago" value="+12m" highlight={false} />
                </div>
              </div>

              {/* Fleet Status */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-white">Fleet Status</h3>
                  <button
                    onClick={() => toast.info("Opening fleet management")}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Bus className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <div className="space-y-4">
                  <ZenListItem icon={Bus} title="Active" subtitle="On Route" value="34" highlight={true} />
                  <ZenListItem icon={CreditCard} title="Maintenance" subtitle="In Shop" value="4" highlight={false} />
                </div>
              </div>
            </div>

            {/* Live Route Progress Widget (Redesigned Version) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <AdminRouteProgress />
            </div>

          </div>

          {/* RIGHT COLUMN (Map) */}
          <div className="lg:col-span-4 h-full min-h-[500px] lg:min-h-0 relative">
            <div className="sticky top-6 h-[calc(100vh-6rem)] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900">
              <MapboxMap
                className="w-full h-full"
                showSidebar={false}
                showControls={true}
                fullScreen={false}
              />

              {/* Floating Overlay on Map */}
              <div className="absolute top-4 left-4 right-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm z-[1000] flex flex-col gap-2">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                    {nearestStation ? "Route to Station" : "Live Tracking"}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-white">{locationName}</span>
                      {nearestStation && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          → {nearestStation} ({stationDistance} km)
                        </span>
                      )}
                    </div>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      console.log("[Dashboard] Dispatching map-request-locate event")
                      window.dispatchEvent(new CustomEvent('map-request-locate'))
                    }}
                    className="flex-1 py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 transition-all active:scale-95"
                  >
                    {nearestStation ? "Refresh" : "Nearest"}
                  </button>
                  <button
                    onClick={() => toast.info("Centered on main hub")}
                    className="py-1.5 px-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition-all active:scale-95"
                  >
                    Hub
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardShell>
  )
}
