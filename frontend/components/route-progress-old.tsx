"use client"

import { useState, useEffect } from "react"
import { MapPin, CheckCircle2, Clock } from "lucide-react"
import { GlassCard } from "./ui/glass-card"
import { cn } from "@/lib/utils"
import { MARRAKECH_ROUTES, getRouteById } from "@/lib/routes-config"
import { useGPSTracking } from "@/hooks/use-socket"

interface RouteProgressProps {
  busId?: string
  routeId?: number
  compact?: boolean
}

export function RouteProgress({ busId, routeId = 1, compact = false }: RouteProgressProps) {
  const [currentStopIndex, setCurrentStopIndex] = useState(1) // 0 = completed, 1 = current
  const [estimatedArrival, setEstimatedArrival] = useState(5)

  const route = getRouteById(routeId)
  
  // Listen to GPS updates to determine current position
  const { isConnected } = useGPSTracking((gpsData) => {
    if (!gpsData || !Array.isArray(gpsData)) return
    
    // Find bus data
    const busData = gpsData.find((data: any) => {
      const id = data.bus?.id || data.busId || data.id
      return busId ? `BUS-${id}` === busId : id === 1
    })
    
    if (busData && route) {
      // Calculate which stop the bus is closest to
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
        
        // Estimate arrival time based on speed and distance
        const speed = busData.speed || 0
        if (speed > 5 && closestStopIndex < route.stations.length - 1) {
          const nextStation = route.stations[closestStopIndex + 1]
          const distanceToNext = Math.sqrt(
            Math.pow(nextStation.coords[1] - lat, 2) + 
            Math.pow(nextStation.coords[0] - lng, 2)
          )
          // Rough estimation: 0.01 degrees ≈ 1km, convert to minutes
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
    <GlassCard className={cn("border-2 border-primary/10", compact ? "p-4" : "p-4 sm:p-6")}>
      <h3 className={cn("font-bold text-foreground mb-2 flex items-center gap-2", compact ? "text-sm" : "text-base sm:text-lg")}>
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <MapPin className="h-4 w-4 text-white" />
        </div>
        Progression de l'Itinéraire
      </h3>
      
      <div className="mb-2 text-xs text-muted-foreground">
        {route.name}
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-muted-foreground">
            {completedCount} sur {stops.length} complétés
          </span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {progress}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className={cn(
        "space-y-2.5 sm:space-y-3 overflow-y-auto -mr-2 pr-4 scrollbar-thin scrollbar-thumb-blue-500/50 dark:scrollbar-thumb-blue-400/30 scrollbar-track-transparent hover:scrollbar-thumb-blue-600/70 dark:hover:scrollbar-thumb-blue-400/50",
        compact ? "max-h-[300px]" : "max-h-[400px]"
      )}>
        {stops.map((stop, index) => (
          <div
            key={stop.id}
            className={cn(
              "flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl border-2 transition-all duration-300",
              stop.status === "completed" && "bg-emerald-500/10 border-emerald-500/30 shadow-md",
              stop.status === "current" && "bg-blue-500/10 border-blue-500/30 shadow-lg ring-2 ring-blue-500/20",
              stop.status === "upcoming" && "bg-muted/50 border-border hover:border-primary/30"
            )}
          >
            <div
              className={cn(
                "h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg",
                stop.status === "completed" && "bg-gradient-to-br from-emerald-400 to-teal-500 text-white",
                stop.status === "current" && "bg-gradient-to-br from-blue-500 to-cyan-500 text-white animate-pulse",
                stop.status === "upcoming" && "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs sm:text-sm text-foreground truncate leading-tight">{stop.name}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 leading-tight">
                {stop.status === "completed" && `Départ - ${stop.time}`}
                {stop.status === "current" && (
                  <span className="text-blue-600 dark:text-blue-400 font-semibold animate-pulse">
                    Arrivée dans {stop.eta} min
                  </span>
                )}
                {stop.status === "upcoming" && `Prévu - ${stop.time}`}
              </p>
            </div>
            <div className="flex-shrink-0">
              {stop.status === "completed" && <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />}
              {stop.status === "current" && <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-blue-500 animate-ping" />}
              {stop.status === "upcoming" && <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />}
            </div>
          </div>
        ))}
      </div>
      
      {isConnected && (
        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Données en temps réel
        </div>
      )}
    </GlassCard>
  )
}
