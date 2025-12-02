"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { GlassCard } from "@/components/ui/glass-card"
import { BusMap } from "@/components/bus-map"
import { useDriverSidebar } from "@/lib/driver-sidebar-context"
import {
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Phone,
  MessageSquare,
  Users,
  TrendingUp,
  Award,
  Activity,
  Zap,
  Route,
  Bell,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DriverIdCard } from "@/components/driver-id-card"

export default function DriverPortalPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { sidebarExpanded } = useDriverSidebar()
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  const [stats] = useState({
    todayTrips: 12,
    passengers: 247,
    onTimePercent: 94,
    distance: 142,
    rating: 4.8,
    totalTrips: 156,
  })

  const [currentRoute] = useState({
    name: "Route 1 - Marrakech Express",
    stops: [
      { id: 1, name: "Palmeraie", time: "08:00", status: "completed" },
      { id: 2, name: "Gueliz", time: "08:15", status: "current", eta: 5 },
      { id: 3, name: "Ben Youssef", time: "08:30", status: "upcoming" },
      { id: 4, name: "Jemaa el Fna", time: "08:45", status: "upcoming" },
    ],
  })

  const [alerts] = useState([
    {
      id: 1,
      title: "Traffic Delay",
      message: "Heavy traffic on Main St",
      time: "5 min ago",
      type: "warning",
    },
    {
      id: 2,
      title: "Passenger Request",
      message: "Wheelchair assistance needed",
      time: "2 min ago",
      type: "info",
    },
  ])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role !== "driver") {
      router.push(user.role === "admin" ? "/dashboard" : "/client-portal")
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== "driver") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }


  return (
    <main className={cn(
      "flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-gradient-to-br from-background via-background to-primary/5",
      "transition-all duration-300"
    )}>
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Driver Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-muted/50 border border-border">
              <Clock className="h-4 w-4 inline mr-2 text-primary" />
              <span className="text-sm font-semibold">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Today's Trips", value: stats.todayTrips, icon: Navigation, color: "blue" },
            { label: "Passengers", value: stats.passengers, icon: Users, color: "purple" },
            { label: "On-Time", value: `${stats.onTimePercent}%`, icon: CheckCircle2, color: "emerald" },
            { label: "Distance", value: `${stats.distance}km`, icon: MapPin, color: "cyan" },
            { label: "Rating", value: stats.rating, icon: Award, color: "amber" },
            { label: "Total Trips", value: stats.totalTrips, icon: TrendingUp, color: "rose" },
          ].map((stat, idx) => (
            <GlassCard key={idx} className="p-3 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={cn(
                  "h-4 w-4",
                  stat.color === "blue" && "text-blue-500",
                  stat.color === "purple" && "text-purple-500",
                  stat.color === "emerald" && "text-emerald-500",
                  stat.color === "cyan" && "text-cyan-500",
                  stat.color === "amber" && "text-amber-500",
                  stat.color === "rose" && "text-rose-500"
                )} />
                <Zap className="h-3 w-3 text-muted-foreground opacity-50" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={cn(
                "text-xl font-bold",
                stat.color === "blue" && "text-blue-600 dark:text-blue-400",
                stat.color === "purple" && "text-purple-600 dark:text-purple-400",
                stat.color === "emerald" && "text-emerald-600 dark:text-emerald-400",
                stat.color === "cyan" && "text-cyan-600 dark:text-cyan-400",
                stat.color === "amber" && "text-amber-600 dark:text-amber-400",
                stat.color === "rose" && "text-rose-600 dark:text-rose-400"
              )}>{stat.value}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Driver ID & Route Progress */}
        <div className="lg:col-span-1 space-y-6">
          {/* Driver ID Card */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-bold">Driver ID</h2>
            </div>
            <DriverIdCard 
              driver={{
                id: "DRV-2024-001",
                name: "Mohamed KARKACHI",
                email: user?.email || "mohamed.k@bustrack.com",
                avatar: user?.avatar || "/placeholder.svg",
                licenseNumber: "DL-MA-2024-12345",
                busNumber: "BUS-101",
                joinDate: "Jan 2024",
                rating: 4.8,
              }}
            />
          </GlassCard>

          {/* Route Progress */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Route className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-bold">Route Progress</h2>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">
                  {currentRoute.stops.filter(s => s.status === 'completed').length}/{currentRoute.stops.length} stops
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round((currentRoute.stops.filter(s => s.status === 'completed').length / currentRoute.stops.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                  style={{ width: `${(currentRoute.stops.filter(s => s.status === 'completed').length / currentRoute.stops.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Stops List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {currentRoute.stops.map((stop, idx) => (
                <div
                  key={stop.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                    stop.status === "completed" && "bg-emerald-500/10 border-emerald-500/30",
                    stop.status === "current" && "bg-blue-500/10 border-blue-500/30 ring-2 ring-blue-500/20",
                    stop.status === "upcoming" && "bg-muted/30 border-border"
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                    stop.status === "completed" && "bg-emerald-500 text-white",
                    stop.status === "current" && "bg-blue-500 text-white animate-pulse",
                    stop.status === "upcoming" && "bg-muted text-muted-foreground"
                  )}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{stop.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {stop.status === "completed" && `Departed ${stop.time}`}
                      {stop.status === "current" && (
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          Arriving in {stop.eta} min
                        </span>
                      )}
                      {stop.status === "upcoming" && `Scheduled ${stop.time}`}
                    </p>
                  </div>
                  <div>
                    {stop.status === "completed" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                    {stop.status === "current" && <Clock className="h-5 w-5 text-blue-500 animate-pulse" />}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column - Map & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Map */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-bold">Live Navigation</h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-red-600 dark:text-red-400">LIVE</span>
              </div>
            </div>
            
            <div className="h-[400px] md:h-[500px] rounded-xl overflow-hidden border-2 border-border mb-4">
              <BusMap height="100%" showControls={true} driverMode={true} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
                <Navigation className="h-5 w-5" />
                Navigate
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
                <Phone className="h-5 w-5" />
                Contact
              </button>
            </div>
          </GlassCard>

          {/* Quick Actions & Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-bold">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Report", icon: AlertCircle, color: "red" },
                  { label: "Call", icon: Phone, color: "purple" },
                  { label: "Complete", icon: CheckCircle2, color: "emerald" },
                  { label: "Messages", icon: MessageSquare, color: "cyan" },
                ].map((action, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-border transition-all hover:scale-105 active:scale-95",
                      action.color === "red" && "hover:border-red-500/50 hover:bg-red-500/10",
                      action.color === "purple" && "hover:border-purple-500/50 hover:bg-purple-500/10",
                      action.color === "emerald" && "hover:border-emerald-500/50 hover:bg-emerald-500/10",
                      action.color === "cyan" && "hover:border-cyan-500/50 hover:bg-cyan-500/10"
                    )}
                  >
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      action.color === "red" && "bg-gradient-to-br from-red-500 to-red-600",
                      action.color === "purple" && "bg-gradient-to-br from-purple-500 to-purple-600",
                      action.color === "emerald" && "bg-gradient-to-br from-emerald-500 to-emerald-600",
                      action.color === "cyan" && "bg-gradient-to-br from-cyan-500 to-cyan-600"
                    )}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold">{action.label}</span>
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Alerts */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-bold">Alerts</h2>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all hover:scale-[1.02]",
                      alert.type === "warning" && "bg-amber-500/10 border-amber-500/30",
                      alert.type === "info" && "bg-blue-500/10 border-blue-500/30"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className={cn(
                        "h-4 w-4 mt-0.5 shrink-0",
                        alert.type === "warning" && "text-amber-500",
                        alert.type === "info" && "text-blue-500"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold">{alert.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </main>
  )
}
