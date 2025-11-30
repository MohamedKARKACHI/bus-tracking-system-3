"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { MapPin, Navigation, Clock, Zap, TrendingUp, CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminRouteProgress() {
  const [activeRoutes, setActiveRoutes] = useState<any[]>([])
  const [selectedRoute, setSelectedRoute] = useState<number>(0)

  useEffect(() => {
    // Comprehensive route data
    setActiveRoutes([
      {
        id: "RT-001",
        name: "Downtown Express",
        busNumber: "BUS-101",
        driver: "John Smith",
        progress: 65,
        currentStop: 8,
        totalStops: 12,
        eta: "14 min",
        delay: 0,
        status: "on-time",
        passengers: 42,
        capacity: 50,
        stops: [
          { name: "Central Station", time: "06:00 AM", status: "completed" },
          { name: "City Hall", time: "06:12 AM", status: "completed" },
          { name: "Market Square", time: "06:24 AM", status: "completed" },
          { name: "Tech Park", time: "06:36 AM", status: "completed" },
          { name: "University Plaza", time: "06:48 AM", status: "completed" },
          { name: "Shopping Mall", time: "07:00 AM", status: "completed" },
          { name: "Hospital Avenue", time: "07:12 AM", status: "completed" },
          { name: "Park Street", time: "07:24 AM", status: "completed" },
          { name: "Business District", time: "07:36 AM", status: "active" },
          { name: "Library Corner", time: "07:48 AM", status: "upcoming" },
          { name: "Sports Complex", time: "08:00 AM", status: "upcoming" },
          { name: "Airport Terminal", time: "08:15 AM", status: "upcoming" },
        ]
      },
      {
        id: "RT-002",
        name: "Airport Shuttle",
        busNumber: "BUS-203",
        driver: "Sarah Johnson",
        progress: 35,
        currentStop: 3,
        totalStops: 8,
        eta: "8 min",
        delay: 5,
        status: "delayed",
        passengers: 28,
        capacity: 40,
        stops: [
          { name: "Airport Terminal", time: "09:00 AM", status: "completed" },
          { name: "Hotel District", time: "09:15 AM", status: "completed" },
          { name: "Convention Center", time: "09:30 AM", status: "completed" },
          { name: "Downtown Hub", time: "09:45 AM", status: "active" },
          { name: "Metro Station", time: "10:00 AM", status: "upcoming" },
          { name: "Business Park", time: "10:15 AM", status: "upcoming" },
          { name: "Tech Campus", time: "10:30 AM", status: "upcoming" },
          { name: "Shopping District", time: "10:45 AM", status: "upcoming" },
        ]
      },
      {
        id: "RT-003",
        name: "University Loop",
        busNumber: "BUS-156",
        driver: "Mike Wilson",
        progress: 85,
        currentStop: 11,
        totalStops: 13,
        eta: "6 min",
        delay: 0,
        status: "on-time",
        passengers: 38,
        capacity: 45,
        stops: [
          { name: "Main Campus", time: "08:00 AM", status: "completed" },
          { name: "Student Housing A", time: "08:08 AM", status: "completed" },
          { name: "Library", time: "08:16 AM", status: "completed" },
          { name: "Science Building", time: "08:24 AM", status: "completed" },
          { name: "Engineering Complex", time: "08:32 AM", status: "completed" },
          { name: "Medical Center", time: "08:40 AM", status: "completed" },
          { name: "Sports Arena", time: "08:48 AM", status: "completed" },
          { name: "Student Union", time: "08:56 AM", status: "completed" },
          { name: "Research Park", time: "09:04 AM", status: "completed" },
          { name: "Innovation Hub", time: "09:12 AM", status: "completed" },
          { name: "Arts Center", time: "09:20 AM", status: "completed" },
          { name: "Student Housing B", time: "09:28 AM", status: "active" },
          { name: "Main Gate", time: "09:36 AM", status: "upcoming" },
        ]
      },
    ])
  }, [])

  if (activeRoutes.length === 0) {
    return (
      <GlassCard className="p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Navigation className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Live Route Progress
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Real-time tracking of active routes</p>
          </div>
        </div>
        <div className="text-center py-12">
          <Navigation className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No active routes at the moment</p>
        </div>
      </GlassCard>
    )
  }

  const route = activeRoutes[selectedRoute]
  const completedStops = route.stops.filter((s: any) => s.status === "completed").length
  const upcomingStops = route.stops.filter((s: any) => s.status === "upcoming").length

  return (
    <GlassCard className="p-4 sm:p-6 lg:p-8 overflow-hidden relative border-2 border-primary/10">
      {/* Animated Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-pulse pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg animate-pulse">
              <Navigation className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Live Route Progress
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {activeRoutes.length} active routes • Real-time updates
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full font-semibold shadow-lg text-sm",
            route.status === "on-time" && "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
            route.status === "delayed" && "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
          )}>
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            {route.status === "on-time" ? "On Schedule" : `${route.delay}min Delay`}
          </div>
        </div>

        {/* Route Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {activeRoutes.map((r, idx) => (
            <button
              key={r.id}
              onClick={() => setSelectedRoute(idx)}
              className={cn(
                "flex-shrink-0 px-4 py-2.5 rounded-xl font-semibold transition-all border-2",
                selectedRoute === idx
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-500 shadow-lg scale-105"
                  : "bg-muted/50 text-muted-foreground border-transparent hover:border-primary/20 hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  r.status === "on-time" ? "bg-emerald-400" : "bg-amber-400"
                )} />
                <span className="text-sm">{r.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Route Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {/* Progress Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-500/5 border-2 border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Progress</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {route.progress}%
              </span>
              <span className="text-xs text-muted-foreground">
                {completedStops}/{route.totalStops}
              </span>
            </div>
          </div>

          {/* ETA Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/5 border-2 border-purple-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Next Stop</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {route.eta}
              </span>
              <span className="text-xs text-muted-foreground">ETA</span>
            </div>
          </div>

          {/* Passengers Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border-2 border-emerald-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Passengers</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {route.passengers}
              </span>
              <span className="text-xs text-muted-foreground">/ {route.capacity}</span>
            </div>
          </div>

          {/* Remaining Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 border-2 border-amber-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Remaining</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {upcomingStops}
              </span>
              <span className="text-xs text-muted-foreground">stops</span>
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">Route Completion</span>
            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {route.progress}%
            </span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden shadow-inner">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000 shadow-lg"
              style={{ width: `${route.progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer" />
            </div>
            <div 
              className="absolute inset-y-0 right-0 bg-gradient-to-r from-transparent to-muted-foreground/10"
              style={{ width: `${100 - route.progress}%` }}
            />
          </div>
        </div>

        {/* Stops List with Modern Design */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
          {route.stops.map((stop: any, idx: number) => {
            const isCompleted = stop.status === "completed"
            const isActive = stop.status === "active"
            const isUpcoming = stop.status === "upcoming"

            return (
              <div
                key={idx}
                className={cn(
                  "relative pl-8 pb-3 transition-all duration-300",
                  isActive && "animate-in slide-in-from-left"
                )}
              >
                {/* Timeline Line */}
                {idx < route.stops.length - 1 && (
                  <div className={cn(
                    "absolute left-[15px] top-8 w-0.5 h-full transition-all duration-500",
                    isCompleted && "bg-gradient-to-b from-emerald-500 to-emerald-500/50",
                    isActive && "bg-gradient-to-b from-blue-500 to-muted",
                    isUpcoming && "bg-muted"
                  )} />
                )}

                {/* Stop Indicator */}
                <div className="absolute left-0 top-0">
                  {isCompleted && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg border-2 border-background">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {isActive && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-xl border-2 border-background animate-pulse">
                      <div className="h-3 w-3 rounded-full bg-white animate-ping absolute" />
                      <Navigation className="h-4 w-4 text-white relative z-10" />
                    </div>
                  )}
                  {isUpcoming && (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                      <Circle className="h-3 w-3 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Stop Content */}
                <div className={cn(
                  "p-4 rounded-xl transition-all duration-300 border-2",
                  isCompleted && "bg-emerald-500/5 border-emerald-500/20",
                  isActive && "bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/5 border-blue-500/30 shadow-lg scale-[1.02]",
                  isUpcoming && "bg-muted/30 border-border/50"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className={cn(
                        "text-sm sm:text-base font-bold mb-1",
                        isCompleted && "text-emerald-600 dark:text-emerald-400",
                        isActive && "text-blue-600 dark:text-blue-400",
                        isUpcoming && "text-muted-foreground"
                      )}>
                        {stop.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Clock className={cn(
                          "h-3 w-3",
                          isCompleted && "text-emerald-500",
                          isActive && "text-blue-500",
                          isUpcoming && "text-muted-foreground"
                        )} />
                        <span className="text-xs text-muted-foreground font-medium">{stop.time}</span>
                      </div>
                    </div>
                    
                    {isActive && (
                      <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold shadow-md animate-pulse">
                        ARRIVING
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Info */}
        <div className="mt-6 pt-6 border-t-2 border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">
                {route.driver.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{route.driver}</p>
                <p className="text-xs text-muted-foreground">{route.busNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live tracking active</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
