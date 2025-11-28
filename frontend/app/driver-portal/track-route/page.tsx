"use client"

import { useState, useEffect } from "react"
import { BusMap } from "@/components/bus-map"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Bus, MapPin, Navigation, Clock, Users, AlertCircle, TrendingUp, Play, Pause } from "lucide-react"

export default function DriverTrackingPage() {
  const { user } = useAuth()
  const [myBusLocation, setMyBusLocation] = useState({ lat: 33.5731, lng: -7.6196 })
  const [isOnDuty, setIsOnDuty] = useState(true)
  const [routeProgress, setRouteProgress] = useState(65)
  const [passengerCount, setPassengerCount] = useState(32)

  // Simulate GPS tracking
  useEffect(() => {
    if (!isOnDuty) return

    const interval = setInterval(() => {
      setMyBusLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }))
      
      // Update progress
      setRouteProgress(prev => Math.min(prev + 0.5, 100))
    }, 5000)

    return () => clearInterval(interval)
  }, [isOnDuty])

  const handleDutyToggle = () => {
    setIsOnDuty(!isOnDuty)
    if (!isOnDuty) {
      // Reset progress when starting duty
      setRouteProgress(0)
    }
  }

  const currentRoute = {
    name: "City Center - Airport",
    progress: routeProgress,
    nextStop: "Park Avenue",
    eta: "8 min",
    passengers: passengerCount,
    capacity: 45
  }

  const upcomingStops = [
    { name: "Park Avenue", eta: "8 min", distance: "2.1 km", status: "upcoming" },
    { name: "Highway Junction", eta: "18 min", distance: "5.3 km", status: "upcoming" },
    { name: "International Airport", eta: "25 min", distance: "8.7 km", status: "final" }
  ]

  const alerts = [
    { type: "warning", message: "Heavy traffic on Main Street - Consider alternative route", time: "5 min ago" },
    { type: "info", message: "Next stop has 4 passengers waiting", time: "2 min ago" }
  ]

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">My Route Tracking</h1>
          <p className="text-muted-foreground mt-1">Real-time navigation and route management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={isOnDuty ? "default" : "outline"}
            onClick={handleDutyToggle}
            className={isOnDuty ? "bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2" : "flex items-center gap-2"}
          >
            {isOnDuty ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isOnDuty ? "On Duty" : "Start Duty"}
          </Button>
          {isOnDuty && (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              GPS Tracking Active
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[500px]">
            <BusMap 
              height="100%" 
              showControls={true}
              centerOn={myBusLocation}
              highlightBus="BUS-001"
            />
          </div>

          {/* Route Progress */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Current Route Progress</h3>
              <span className="text-sm text-muted-foreground">{currentRoute.progress}% Complete</span>
            </div>
            <div className="relative w-full h-2 bg-muted rounded-full mb-6">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-cyan-500 rounded-full transition-all"
                style={{ width: `${currentRoute.progress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Route</p>
                <p className="text-sm font-semibold">{currentRoute.name}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Next Stop</p>
                <p className="text-sm font-semibold">{currentRoute.nextStop}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">ETA</p>
                <p className="text-sm font-semibold">{currentRoute.eta}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Passengers</p>
                <p className="text-sm font-semibold">{currentRoute.passengers}/{currentRoute.capacity}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Upcoming Stops */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Upcoming Stops</h3>
            </div>
            <div className="space-y-3">
              {upcomingStops.map((stop, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    stop.status === "final"
                      ? "bg-primary/10 border-primary"
                      : "bg-muted/30 border-border"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-semibold text-sm">{stop.name}</span>
                      {stop.status === "final" && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                          Final
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{stop.eta}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Navigation className="h-3 w-3" />
                      <span>{stop.distance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Live Alerts */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-lg">Live Alerts</h3>
            </div>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    alert.type === "warning"
                      ? "bg-amber-500/10 border-amber-500/30"
                      : "bg-blue-500/10 border-blue-500/30"
                  }`}
                >
                  <p className="text-xs text-foreground mb-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Stats */}
          <GlassCard className="p-6">
            <h3 className="font-semibold text-lg mb-4">Today's Performance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">On-Time Rate</span>
                </div>
                <span className="font-semibold">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Total Passengers</span>
                </div>
                <span className="font-semibold">127</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bus className="h-4 w-4 text-cyan-500" />
                  <span className="text-sm text-muted-foreground">Trips Completed</span>
                </div>
                <span className="font-semibold">3</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
