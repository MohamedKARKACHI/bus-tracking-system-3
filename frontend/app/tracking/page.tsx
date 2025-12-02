"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { LiveMapFull } from "@/components/live-map-full"
import { ActiveBusesList } from "@/components/active-buses-list"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, RefreshCw, Bus, Navigation, Clock, Zap, Radio, TrendingUp, MapPin } from "lucide-react"

export default function TrackingPage() {
  const [selectedRoute, setSelectedRoute] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const stats = [
    { label: "Active Buses", value: "28", icon: Bus, color: "from-emerald-500 to-green-600", iconColor: "text-emerald-500" },
    { label: "In Transit", value: "22", icon: Navigation, color: "from-blue-500 to-cyan-600", iconColor: "text-blue-500" },
    { label: "At Stops", value: "6", icon: Clock, color: "from-purple-500 to-pink-600", iconColor: "text-purple-500" }
  ]

  const quickActions = [
    { label: "Export Data", icon: Download, color: "from-orange-500 to-red-600" },
    { label: "Refresh Live", icon: RefreshCw, color: "from-cyan-500 to-blue-600", action: handleRefresh },
    { label: "View Reports", icon: TrendingUp, color: "from-purple-500 to-indigo-600" },
  ]

  return (
    <DashboardShell>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 dark:from-cyan-600/10 dark:to-blue-700/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-500/20 dark:from-purple-600/10 dark:to-pink-700/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-cyan-100">Live Tracking Active</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-100">
                  Track Your Bus
                </h1>
                <p className="text-cyan-100 text-lg max-w-2xl">
                  Real-time GPS monitoring with precision accuracy • Track all active buses across the city
                </p>
              </div>
              
              {/* Quick Stats in Header */}
              <div className="flex gap-3">
                {stats.map((stat, index) => (
                  <div key={index} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 min-w-[120px]">
                    <stat.icon className="w-8 h-8 mb-2" />
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-cyan-100 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 p-4 flex items-center gap-3 hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Smart Search & Filters */}
          <GlassCard className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-500" />
                <Input
                  type="text"
                  placeholder="Search by bus number, driver name, or route..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base border-2 border-transparent focus:border-cyan-500 bg-white dark:bg-slate-800"
                />
              </div>
              
              <div className="flex gap-3">
                <select 
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="h-12 px-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-medium"
                >
                  <option value="all">🚍 All Routes</option>
                  <option value="1">🛣️ Route 1 - City Center</option>
                  <option value="2">🏫 Route 2 - University</option>
                  <option value="3">🏖️ Route 3 - Beach Line</option>
                  <option value="4">🏭 Route 4 - Industrial</option>
                </select>
                
                <Button variant="outline" className="h-12 px-6 border-2">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Enhanced Map and List Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Map - Takes 2/3 on large screens */}
            <div className="xl:col-span-2">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                <div className="relative">
                  <LiveMapFull />
                </div>
              </div>
            </div>
            
            {/* Active Buses List - Takes 1/3 */}
            <div className="xl:col-span-1">
              <div className="relative group h-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                <div className="relative h-full">
                  <GlassCard className="p-6 h-full">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Zap className="w-6 h-6 text-cyan-500" />
                        Live Buses
                      </h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">28 Active</span>
                      </div>
                    </div>
                    <ActiveBusesList />
                  </GlassCard>
                </div>
              </div>
            </div>
          </div>

          {/* Live Status Footer */}
          <GlassCard className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">System Online</span>
                </div>
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">GPS Accuracy: <strong className="text-slate-900 dark:text-white">High</strong></span>
                </div>
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Last updated: <strong className="text-slate-900 dark:text-white">2 seconds ago</strong></span>
              </div>
              
              <Button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardShell>
  )
}
