"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { BusMap } from "@/components/bus-map"
import { DriverIdCard } from "@/components/driver-id-card"
import { useTheme } from "next-themes"
import {
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Phone,
  Users,
  TrendingUp,
  Award,
  Activity,
  Zap,
  Route,
  Bell,
  Loader2,
  Circle,
  MessageSquare,
  Star,
  Fuel,
  Gauge,
  ChevronDown
} from "lucide-react"

export default function DriverPortalPage() {
  const { theme } = useTheme()
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isProfileExpanded, setIsProfileExpanded] = useState(true)
  const [isRouteExpanded, setIsRouteExpanded] = useState(true)

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
    fuel: 75,
    speed: 45
  })

  const [currentRoute] = useState({
    name: "Route 1 - Marrakech Express",
    busNumber: "BUS-101",
    color: "#3b82f6",
    stops: [
      { id: 1, name: "Palmeraie", time: "08:00", status: "completed" },
      { id: 2, name: "Gueliz", time: "08:15", status: "completed" },
      { id: 3, name: "Ben Youssef", time: "08:30", status: "active", eta: 5 },
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

  const renderQuickActionsAndAlerts = (isGrid: boolean) => (
    <div className={isGrid ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-4 mt-4 h-full"}>
      {/* Quick Actions */}
      <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 ${!isGrid ? 'shrink-0' : ''}`}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {[
            { label: "Report Issue", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-100 dark:border-red-500/20" },
            { label: "Contact Ops", icon: Phone, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10", border: "border-purple-100 dark:border-purple-500/20" },
            { label: "End Trip", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20" },
            { label: "Messages", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20" },
          ].map((action, idx) => (
            <button
              key={idx}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border ${action.border} ${action.bg} hover:brightness-95 transition-all`}
            >
              <action.icon className={`w-6 h-6 ${action.color} mb-2`} />
              <span className={`text-xs font-medium ${action.color}`}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 ${!isGrid ? 'flex-1 min-h-0 flex flex-col' : ''}`}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 shrink-0">
          <Bell className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">Recent Alerts</h3>
        </div>
        <div className={`p-4 space-y-3 ${!isGrid ? 'overflow-y-auto custom-scrollbar' : ''}`}>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-xl border ${alert.type === "warning"
                ? "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20"
                : "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20"
                }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-full ${alert.type === "warning" ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600" : "bg-blue-100 dark:bg-blue-500/20 text-blue-600"
                  }`}>
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{alert.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{alert.message}</p>
                  <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {alert.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role !== "driver") {
      router.push(user.role === "admin" ? "/dashboard" : "/client-portal")
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== "driver") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-cyan-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading driver portal...</p>
        </div>
      </div>
    )
  }

  const completedStops = currentRoute.stops.filter(s => s.status === "completed").length
  const totalStops = currentRoute.stops.length
  const progress = (completedStops / totalStops) * 100

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-[1920px] mx-auto flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 order-1">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'Driver'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-500/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-sm">On Duty</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">
              <Clock className="w-4 h-4" />
              <span className="font-medium text-sm">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="order-3 md:order-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { label: "Trips", value: stats.todayTrips, icon: Navigation, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
            { label: "Passengers", value: stats.passengers, icon: Users, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
            { label: "On-Time", value: `${stats.onTimePercent}%`, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
            { label: "Distance", value: `${stats.distance}km`, icon: MapPin, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-500/10" },
            { label: "Rating", value: stats.rating, icon: Star, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
            { label: "Total", value: stats.totalTrips, icon: TrendingUp, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-500/10" },
            { label: "Fuel", value: `${stats.fuel}%`, icon: Fuel, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
            { label: "Speed", value: `${stats.speed}km/h`, icon: Gauge, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="order-2 md:order-3 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[600px]">
          {/* Left Column: ID Card (3 cols) */}
          <div className="xl:col-span-3 flex flex-col gap-6 h-[600px]">
            {/* Driver ID Card */}
            <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 flex flex-col ${isProfileExpanded ? 'h-full' : 'h-fit'}`}>
              <button
                onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                className="w-full p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shrink-0"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Driver Profile</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isProfileExpanded ? 'rotate-180' : ''}`} />
              </button>

              <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isProfileExpanded ? 'grid-rows-[1fr] flex-1' : 'grid-rows-[0fr] flex-none'} overflow-hidden`}>
                <div className="min-h-0 h-full">
                  <DriverIdCard
                    className="max-w-none h-full w-full aspect-auto shadow-none"
                    driver={{
                      id: "DRV-2024-001",
                      name: user?.name || "Mohamed KARKACHI",
                      email: user?.email || "mohamed.k@bustrack.com",
                      avatar: user?.avatar || "/placeholder.svg",
                      licenseNumber: "DL-MA-2024-12345",
                      busNumber: currentRoute.busNumber,
                      joinDate: "Jan 2024",
                      rating: stats.rating,
                    }}
                  />
                </div>
              </div>
            </div>
            {!isProfileExpanded && (
              <div className="flex-1 min-h-0">
                {renderQuickActionsAndAlerts(false)}
              </div>
            )}
          </div>

          {/* Middle Column: Map & Actions (6 cols) */}
          <div className="xl:col-span-6 flex flex-col gap-6">
            {/* Map Container */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-[600px] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Live Navigation</h3>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> Start
                  </button>
                </div>
              </div>
              <div className="flex-1 relative bg-slate-100 dark:bg-slate-800">
                <BusMap height="100%" showControls={true} driverMode={true} />
              </div>
            </div>

            {isProfileExpanded && renderQuickActionsAndAlerts(true)}
          </div>

          {/* Right Column: Route Progress (3 cols) */}
          <div className="xl:col-span-3 flex flex-col gap-6 h-[600px]">
            {/* Current Route Timeline */}
            <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ${isRouteExpanded ? 'h-full' : 'h-fit'}`}>
              <button
                onClick={() => setIsRouteExpanded(!isRouteExpanded)}
                className="w-full p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shrink-0"
              >
                <div className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Route Progress</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">
                    {Math.round(progress)}%
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isRouteExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isRouteExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} overflow-hidden`}>
                <div className="min-h-0 h-full overflow-y-auto custom-scrollbar">
                  <div className="p-4">
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-1">{currentRoute.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{currentRoute.busNumber}</p>
                  <div className="mt-3 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-0">
                  {currentRoute.stops.map((stop, index) => {
                    const isCompleted = stop.status === "completed"
                    const isActive = stop.status === "active"
                    const isLast = index === currentRoute.stops.length - 1

                    return (
                      <div key={index} className="relative pl-8 pb-8 last:pb-0">
                        {/* Timeline Line */}
                        {!isLast && (
                          <div className={`absolute left-[11px] top-3 bottom-0 w-0.5 ${isCompleted ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'
                            }`} />
                        )}

                        {/* Timeline Dot */}
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white dark:bg-slate-900 ${isActive
                          ? 'border-blue-500 text-blue-500 shadow-lg shadow-blue-500/20 scale-110'
                          : isCompleted
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 text-slate-300'
                          }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : isActive ? (
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          ) : (
                            <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full" />
                          )}
                        </div>

                        {/* Content */}
                        <div className={`transition-all ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <h5 className={`font-medium text-sm ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'
                              }`}>
                              {stop.name}
                            </h5>
                            {isActive && (
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full uppercase tracking-wide">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              {isActive ? `Arriving in ${stop.eta} min` : stop.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}
