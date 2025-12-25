"use client"

import { useState, useEffect } from "react"
import { MapPin, CheckCircle2, Clock, Navigation2, Zap, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { MARRAKECH_ROUTES, getRouteById } from "@/lib/routes-config"
import { useGPSTracking } from "@/hooks/use-socket"

interface RouteProgressProps {
  busId?: string
  routeId?: number
  compact?: boolean
}

export function RouteProgress({ busId, routeId = 1, compact = false }: RouteProgressProps) {
  const [currentStopIndex, setCurrentStopIndex] = useState(1)
  const [estimatedArrival, setEstimatedArrival] = useState(5)

  const route = getRouteById(routeId)
  
  const { isConnected } = useGPSTracking((gpsData) => {
    if (!gpsData || !Array.isArray(gpsData)) return
    
    const busData = gpsData.find((data: any) => {
      const id = data.bus?.id || data.busId || data.id
      return busId ? `BUS-${id}` === busId : id === 1
    })
    
    if (busData && route) {
      const lat = busData.latitude || busData.lat
      const lng = busData.longitude || busData.lng || busData.lon
      
      if (lat && lng) {
        let closestStopIndex = 0
        let minDistance = Infinity
        
        route.stations.forEach((station, index) => {
          const distance = Math.sqrt(
            Math.pow(station.coords[1] - lat, 2) + 
            Math.pow(station.coords[0] - lng, 2)
          )
          
          if (distance < minDistance) {
            minDistance = distance
            closestStopIndex = index
          }
        })
        
        setCurrentStopIndex(closestStopIndex)
        
        const speed = busData.speed || 0
        if (speed > 5 && closestStopIndex < route.stations.length - 1) {
          const nextStation = route.stations[closestStopIndex + 1]
          const distanceToNext = Math.sqrt(
            Math.pow(nextStation.coords[1] - lat, 2) + 
            Math.pow(nextStation.coords[0] - lng, 2)
          )
          const estimatedMinutes = Math.round((distanceToNext * 100) / (speed / 60))
          setEstimatedArrival(Math.min(Math.max(estimatedMinutes, 1), 30))
        }
      }
    }
  })

  if (!route) {
    return <div className="text-sm text-muted-foreground">Route non trouvée</div>
  }

  const stops = route.stations.map((station, index) => ({
    id: index,
    name: station.name,
    time: station.time,
    status: index < currentStopIndex ? 'completed' : index === currentStopIndex ? 'current' : 'upcoming',
    eta: estimatedArrival
  }))

  const completedCount = stops.filter(s => s.status === 'completed').length
  const progress = Math.round((completedCount / stops.length) * 100)

  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 border-2 border-blue-500/20 dark:border-blue-400/30 backdrop-blur-xl shadow-2xl",
      compact ? "p-4" : "p-6"
    )}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-500/10 to-blue-500/10 rounded-full blur-3xl -z-10" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50 animate-pulse">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background animate-ping" />
          </div>
          <div>
            <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Route Progress
            </h3>
            <p className="text-xs text-muted-foreground font-medium">{route.name}</p>
          </div>
        </div>
        
        {isConnected && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">Live</span>
          </div>
        )}
      </div>
      
      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-3 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-muted-foreground">Completed</span>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedCount}</p>
        </div>
        
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-3 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span className="text-xs font-medium text-muted-foreground">Progress</span>
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{progress}%</p>
        </div>
        
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/10 to-pink-600/5 p-3 border border-pink-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-pink-500" />
            <span className="text-xs font-medium text-muted-foreground">ETA</span>
          </div>
          <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{estimatedArrival}m</p>
        </div>
      </div>
      
      {/* Animated Progress Bar */}
      <div className="mb-6 relative">
        <div className="h-3 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm border border-border/50">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{completedCount}/{stops.length} Stops</span>
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">{progress}%</span>
        </div>
      </div>
      
      {/* Stops List */}
      <div className={cn(
        "space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent hover:scrollbar-thumb-purple-500/50",
        compact ? "max-h-[280px]" : "max-h-[350px]"
      )}>
        {stops.map((stop, index) => (
          <div
            key={stop.id}
            className={cn(
              "group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02]",
              stop.status === "completed" && "bg-gradient-to-r from-green-500/10 to-emerald-500/5 border-green-500/30 shadow-lg shadow-green-500/10",
              stop.status === "current" && "bg-gradient-to-r from-blue-500/15 via-purple-500/10 to-pink-500/5 border-blue-500/40 shadow-xl shadow-blue-500/20 ring-2 ring-blue-500/30 animate-pulse-slow",
              stop.status === "upcoming" && "bg-muted/30 border-border/50 hover:border-purple-500/30"
            )}
          >
            {/* Decorative corner accent */}
            {stop.status === "current" && (
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full" />
            )}
            
            <div className="relative flex items-center gap-3 p-4">
              {/* Stop Number Badge */}
              <div className="relative">
                <div
                  className={cn(
                    "h-12 w-12 flex-shrink-0 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300",
                    stop.status === "completed" && "bg-gradient-to-br from-green-400 to-emerald-500 text-white ring-4 ring-green-500/20",
                    stop.status === "current" && "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white animate-pulse ring-4 ring-blue-500/30",
                    stop.status === "upcoming" && "bg-muted/70 text-muted-foreground ring-4 ring-transparent group-hover:ring-purple-500/20"
                  )}
                >
                  {stop.status === "completed" ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    index + 1
                  )}
                </div>
                {stop.status === "current" && (
                  <div className="absolute -top-1 -right-1">
                    <Zap className="h-5 w-5 text-yellow-400 drop-shadow-glow animate-bounce" />
                  </div>
                )}
              </div>
              
              {/* Stop Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-sm text-foreground truncate">{stop.name}</p>
                  {stop.status === "current" && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wide shadow-lg">
                      Now
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {stop.status === "completed" && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Departed {stop.time}
                    </span>
                  )}
                  {stop.status === "current" && (
                    <span className="text-xs font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent flex items-center gap-1 animate-pulse">
                      <Navigation2 className="h-3 w-3 text-blue-500 animate-bounce" />
                      Arriving in {stop.eta} min
                    </span>
                  )}
                  {stop.status === "upcoming" && (
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Scheduled {stop.time}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="flex-shrink-0">
                {stop.status === "completed" && (
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                )}
                {stop.status === "current" && (
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-blue-500 animate-ping" />
                  </div>
                )}
                {stop.status === "upcoming" && (
                  <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .drop-shadow-glow {
          filter: drop-shadow(0 0 6px rgba(250, 204, 21, 0.8));
        }
      `}</style>
    </div>
  )
}
