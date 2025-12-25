"use client"

import { useState, useEffect } from "react"
import { BusMap } from "@/components/bus-map"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { MapPin, Clock, Users, AlertCircle, Navigation2, TrendingUp, Radio } from "lucide-react"

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
      
      setRouteProgress(prev => Math.min(prev + 0.5, 100))
    }, 5000)

    return () => clearInterval(interval)
  }, [isOnDuty])

  const currentRoute = {
    name: "City Center - Airport",
    nextStop: "Park Avenue",
    eta: "8 min",
    passengers: passengerCount,
    capacity: 45
  }

  const upcomingStops = [
    { name: "Park Avenue", eta: "8 min", distance: "2.1 km" },
    { name: "Highway Junction", eta: "18 min", distance: "5.3 km" },
    { name: "International Airport", eta: "25 min", distance: "8.7 km", isFinal: true }
  ]

  const alerts = [
    { message: "Heavy traffic on Main Street - Consider alternative route", time: "5 min ago", type: "warning" },
    { message: "Next stop has 4 passengers waiting", time: "2 min ago", type: "info" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-cyan-800 to-blue-900 dark:from-white dark:via-cyan-200 dark:to-blue-100 bg-clip-text text-transparent drop-shadow-sm">
              Route Tracking
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium">Real-time navigation & management</p>
          </div>
          <Button
            onClick={() => setIsOnDuty(!isOnDuty)}
            className={`${
              isOnDuty 
                ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/60" 
                : "bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 shadow-lg shadow-slate-500/50"
            } text-white px-6 py-6 text-base font-medium transition-all duration-300 transform hover:scale-105`}
          >
            <div className="flex items-center gap-2">
              <Radio className={`h-5 w-5 ${isOnDuty ? "animate-pulse" : ""}`} />
              {isOnDuty ? "On Duty" : "Off Duty"}
            </div>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map & Progress - Left 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Map */}
            <GlassCard className="overflow-hidden p-0 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <div className="h-[450px] md:h-[550px] relative">
                <BusMap 
                  height="100%" 
                  showControls={true}
                  centerOn={myBusLocation}
                  highlightBus="BUS-001"
                />
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="relative">
                      <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                      <div className="absolute inset-0 h-3 w-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">GPS Active</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Route Progress */}
            <GlassCard className="p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-slate-800/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-cyan-500 animate-pulse" />
                  Route Progress
                </h3>
                <span className="text-3xl font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-700 bg-clip-text text-transparent drop-shadow-lg">
                  {routeProgress.toFixed(0)}%
                </span>
              </div>
              
              <div className="relative w-full h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 rounded-full overflow-hidden mb-6 shadow-inner">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 rounded-full transition-all duration-500 shadow-xl"
                  style={{ width: `${routeProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent animate-pulse" />
                  <div className="absolute inset-0 bg-white/30 blur-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="group bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-slate-300 dark:hover:border-slate-600">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">Route</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentRoute.name}</p>
                </div>
                <div className="group bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-50 dark:from-cyan-900/30 dark:via-cyan-900/40 dark:to-cyan-900/30 p-4 rounded-2xl border border-cyan-200/50 dark:border-cyan-800/50 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105">
                  <p className="text-xs text-cyan-700 dark:text-cyan-400 mb-1.5 font-medium">Next Stop</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentRoute.nextStop}</p>
                </div>
                <div className="group bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900/30 dark:via-blue-900/40 dark:to-blue-900/30 p-4 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105">
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-1.5 font-medium">ETA</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{currentRoute.eta}</p>
                </div>
                <div className="group bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:via-emerald-900/40 dark:to-emerald-900/30 p-4 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-1.5 font-medium">Passengers</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{currentRoute.passengers}/{currentRoute.capacity}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar - Right column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upcoming Stops */}
            <GlassCard className="p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-slate-800/50">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <MapPin className="h-5 w-5 text-white drop-shadow-md" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Stops</h3>
              </div>
              
              <div className="space-y-3">
                {upcomingStops.map((stop, index) => (
                  <div
                    key={index}
                    className={`group p-4 rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                      stop.isFinal
                        ? "bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-blue-600/20 border-2 border-cyan-500 dark:border-cyan-400 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40"
                        : "bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 shadow-md hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2.5">
                      <span className="font-bold text-slate-900 dark:text-white">{stop.name}</span>
                      {stop.isFinal && (
                        <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-md">
                          Final
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-4 w-4 text-cyan-500" />
                        <span>{stop.eta}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Navigation2 className="h-4 w-4 text-blue-500" />
                        <span>{stop.distance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Live Alerts */}
            <GlassCard className="p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-slate-800/50">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/50 animate-pulse">
                  <AlertCircle className="h-5 w-5 text-white drop-shadow-md" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Alerts</h3>
              </div>
              
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                      alert.type === "warning"
                        ? "bg-gradient-to-br from-amber-50 via-amber-100 to-orange-50 dark:from-amber-900/30 dark:via-amber-900/40 dark:to-orange-900/30 border-amber-400 dark:border-amber-700 shadow-amber-500/20"
                        : "bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 dark:from-blue-900/30 dark:via-blue-900/40 dark:to-cyan-900/30 border-blue-400 dark:border-blue-700 shadow-blue-500/20"
                    }`}
                  >
                    <p className="text-sm text-slate-900 dark:text-white font-semibold mb-1.5">{alert.message}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{alert.time}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Performance Stats */}
            <GlassCard className="p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-slate-800/50">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                  <TrendingUp className="h-5 w-5 text-white drop-shadow-md" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Today's Stats</h3>
              </div>
              
              <div className="space-y-3">
                <div className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-100 to-green-50 dark:from-emerald-900/30 dark:via-emerald-900/40 dark:to-green-900/30 border-2 border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105">
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-semibold">On-Time Rate</span>
                  <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent drop-shadow-sm">94%</span>
                </div>
                <div className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-blue-100 to-cyan-50 dark:from-blue-900/30 dark:via-blue-900/40 dark:to-cyan-900/30 border-2 border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105">
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-semibold">Total Passengers</span>
                  <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">127</span>
                </div>
                <div className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-cyan-50 via-cyan-100 to-blue-50 dark:from-cyan-900/30 dark:via-cyan-900/40 dark:to-blue-900/30 border-2 border-cyan-200 dark:border-cyan-800 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105">
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-semibold">Trips Completed</span>
                  <span className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">3</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
