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
  Package,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Phone,
  MessageSquare,
  Users,
  TrendingUp,
  Award,
  Activity,
  ZoomIn,
  ZoomOut,
  Locate,
  Maximize,
  X,
  Settings,
  Layers,
  Compass,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DriverPortalPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { sidebarExpanded } = useDriverSidebar()
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showFullscreenMenu, setShowFullscreenMenu] = useState(false)
  
  // Update time every second for dynamic display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  // Track fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    }
  }, [])
  
  const [stats, setStats] = useState({
    todayTrips: 12,
    passengers: 247,
    onTimePercent: 94,
    distance: 142,
    rating: 4.8,
    completedTrips: 156,
  })
  
  // Simulate dynamic stats updates
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        passengers: prev.passengers + Math.floor(Math.random() * 3), // Random passenger increase
        distance: parseFloat((prev.distance + Math.random() * 0.1).toFixed(1)), // Gradual distance increase
      }))
    }, 5000) // Update every 5 seconds
    
    return () => clearInterval(statsInterval)
  }, [])

  const [currentRoute, setCurrentRoute] = useState({
    name: "Route A - Downtown Loop",
    status: "active",
    stops: [
      { id: 1, name: "Central Station", time: "08:00 AM", status: "completed" },
      { id: 2, name: "Market Square", time: "08:15 AM", status: "current", eta: 5 },
      { id: 3, name: "University Campus", time: "08:30 AM", status: "upcoming" },
      { id: 4, name: "City Hall", time: "08:45 AM", status: "upcoming" },
      { id: 5, name: "Shopping District", time: "09:00 AM", status: "upcoming" },
    ],
  })
  
  // Simulate ETA countdown
  useEffect(() => {
    const etaInterval = setInterval(() => {
      setCurrentRoute(prev => ({
        ...prev,
        stops: prev.stops.map(stop => {
          if (stop.status === 'current' && stop.eta && stop.eta > 0) {
            return { ...stop, eta: stop.eta - 1 }
          }
          return stop
        })
      }))
    }, 60000) // Update every minute
    
    return () => clearInterval(etaInterval)
  }, [])

  // Map control handlers
  const handleZoomIn = () => {
    console.log('Zoom In clicked')
    if (typeof window !== 'undefined' && (window as any).mapInstance) {
      const map = (window as any).mapInstance
      console.log('Map instance found, zooming in')
      map.zoomIn()
    } else {
      console.log('Map instance not found')
    }
  }

  const handleZoomOut = () => {
    console.log('Zoom Out clicked')
    if (typeof window !== 'undefined' && (window as any).mapInstance) {
      const map = (window as any).mapInstance
      console.log('Map instance found, zooming out')
      map.zoomOut()
    } else {
      console.log('Map instance not found')
    }
  }

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (typeof window !== 'undefined' && (window as any).mapInstance) {
            const map = (window as any).mapInstance
            map.flyTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 15,
              duration: 2000
            })
          }
        },
        (error) => {
          // Silently handle geolocation errors - user may have denied permission
          console.debug('Geolocation not available:', error.message)
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0
        }
      )
    }
  }

  const handleFullscreen = () => {
    const mapContainer = document.querySelector('.mapboxgl-map')
    if (mapContainer) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        mapContainer.requestFullscreen()
      }
    }
  }

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "warning",
      title: "Traffic Delay",
      message: "Heavy traffic on Main St. Consider alternate route.",
      time: "5 min ago",
      icon: AlertCircle,
      color: "amber",
    },
    {
      id: 2,
      type: "info",
      title: "Passenger Request",
      message: "Wheelchair assistance needed at next stop.",
      time: "2 min ago",
      icon: Package,
      color: "blue",
    },
  ])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role !== "driver") {
      // Redirect non-driver users to their appropriate portal
      if (user.role === "admin") {
        router.push("/dashboard")
      } else {
        router.push("/client-portal")
      }
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== "driver") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main
      className={cn(
        "flex-1 p-3 sm:p-4 md:p-5 lg:p-8 overflow-y-auto transition-all duration-300 bg-gradient-to-br from-background via-background to-muted/20",
        sidebarExpanded ? "lg:ml-0" : "lg:ml-0",
      )}
    >
      {/* Active Status Banner */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-6 w-6 text-white" />
              <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-400 animate-pulse border-2 border-white" />
            </div>
            <div>
              <p className="font-bold text-base sm:text-lg text-foreground">On Duty - Active Route</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{currentRoute.name}</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-500/30 transition-all">
              End Shift
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
        <GlassCard className="p-2.5 sm:p-3 lg:p-4 hover:scale-105 transition-transform duration-200 border-l-4 border-l-blue-500">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Today's Trips</p>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Navigation className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{stats.todayTrips}</p>
          </div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-4 hover:scale-105 transition-transform duration-200 border-l-4 border-l-cyan-500">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Passengers</p>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">{stats.passengers}</p>
          </div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-4 hover:scale-105 transition-transform duration-200 border-l-4 border-l-emerald-500">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">On-Time %</p>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{stats.onTimePercent}%</p>
          </div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-4 hover:scale-105 transition-transform duration-200 border-l-4 border-l-purple-500">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Distance</p>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.distance} km</p>
          </div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-4 hover:scale-105 transition-transform duration-200 border-l-4 border-l-amber-500">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Rating</p>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{stats.rating}/5.0</p>
          </div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-4 hover:scale-105 transition-transform duration-200 border-l-4 border-l-rose-500">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Trips</p>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">{stats.completedTrips}</p>
          </div>
        </GlassCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Route Navigation Map - Takes 2 columns on xl screens */}
        <div className="xl:col-span-2">
          <GlassCard className="p-4 sm:p-6 border-2 border-primary/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Navigation className="h-4 w-4 text-white" />
                </div>
                Live Route Navigation
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">LIVE</span>
              </div>
            </div>
            
            {/* Map Container */}
            <div className="mb-4 h-[400px] sm:h-[500px] lg:h-[600px] rounded-xl overflow-hidden border-2 border-border relative" id="map-fullscreen-container">
              <BusMap 
                height="100%" 
                showControls={true}
                driverMode={true}
              />
              
              {/* Fullscreen Controls Overlay - Shows when in fullscreen */}
              {isFullscreen && (
                <div className="fixed inset-0 z-[10000] pointer-events-none">
                  {/* Exit Fullscreen Button - Top Left */}
                  <button
                    onClick={handleFullscreen}
                    className="absolute top-4 left-4 pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl shadow-2xl border-2 border-red-500/50 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all active:scale-95"
                  >
                    <X className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </button>
                  
                  {/* Map Controls - Top Right */}
                  <div className="absolute top-4 right-4 pointer-events-auto flex flex-col gap-2">
                    <button
                      onClick={handleZoomIn}
                      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl shadow-2xl border-2 border-blue-500/50 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all active:scale-95"
                      title="Zoom In"
                    >
                      <ZoomIn className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </button>
                    <button
                      onClick={handleZoomOut}
                      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl shadow-2xl border-2 border-blue-500/50 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all active:scale-95"
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </button>
                    <button
                      onClick={handleLocate}
                      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl shadow-2xl border-2 border-purple-500/50 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all active:scale-95"
                      title="Locate Me"
                    >
                      <Locate className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </button>
                    
                    {/* Settings Button */}
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={() => setShowFullscreenMenu(!showFullscreenMenu)}
                      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl shadow-2xl border-2 border-orange-500/50 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/50 transition-all active:scale-95"
                      title="Settings"
                    >
                      <Settings className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </button>
                  </div>
                  
                  {/* Settings Menu Panel */}
                  {showFullscreenMenu && (
                    <div className="absolute top-4 right-24 pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border-2 border-border p-4 w-72">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-foreground flex items-center gap-2">
                          <Settings className="h-5 w-5 text-orange-500" />
                          Map Settings
                        </h3>
                        <button
                          onClick={() => setShowFullscreenMenu(false)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {/* Map Style */}
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Map Style</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button className="p-2 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-xs font-semibold">
                              <Layers className="h-4 w-4 mx-auto mb-1" />
                              Dark
                            </button>
                            <button className="p-2 rounded-lg border-2 border-border hover:border-blue-500/50 text-xs font-semibold">
                              <Layers className="h-4 w-4 mx-auto mb-1" />
                              Light
                            </button>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Quick Actions</label>
                          <div className="space-y-2">
                            <button
                              onClick={() => {
                                if ((window as any).mapInstance) {
                                  (window as any).mapInstance.resetNorth()
                                }
                              }}
                              className="w-full p-2 rounded-lg border-2 border-border hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                              <Compass className="h-4 w-4 text-purple-500" />
                              Reset North
                            </button>
                            <button
                              onClick={() => {
                                if ((window as any).mapInstance) {
                                  (window as any).mapInstance.setZoom(12)
                                }
                              }}
                              className="w-full p-2 rounded-lg border-2 border-border hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                              <ZoomIn className="h-4 w-4 text-blue-500" />
                              Reset Zoom
                            </button>
                          </div>
                        </div>
                        
                        {/* Route Info */}
                        <div className="pt-2 border-t border-border">
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Current Route:</span>
                              <span className="font-semibold">{currentRoute.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Backdrop overlay when menu is open */}
                  {showFullscreenMenu && (
                    <div 
                      className="absolute inset-0 bg-black/20 pointer-events-auto"
                      onClick={() => setShowFullscreenMenu(false)}
                    />
                  )}
                  
                  
                  {/* Quick Stats - Bottom */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto flex gap-2 flex-wrap justify-center max-w-[90vw]">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-2xl border-2 border-emerald-500/50">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">LIVE</span>
                      </div>
                    </div>
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-2xl border-2 border-blue-500/50">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-semibold text-foreground">{currentRoute.stops.filter(s => s.status === 'completed').length}/{currentRoute.stops.length} Stops</span>
                      </div>
                    </div>
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-2xl border-2 border-purple-500/50">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-semibold text-foreground">
                          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile Map Controls - Only visible on mobile */}
            <div className="grid grid-cols-4 gap-2 mb-4 sm:hidden">
              <button 
                onClick={handleZoomIn}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border-2 border-border hover:border-blue-500/50 hover:bg-blue-500/10 transition-all active:scale-95"
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <ZoomIn className="h-4 w-4 text-white" />
                </div>
                <span className="text-[9px] font-semibold text-muted-foreground">Zoom In</span>
              </button>
              <button 
                onClick={handleZoomOut}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border-2 border-border hover:border-blue-500/50 hover:bg-blue-500/10 transition-all active:scale-95"
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <ZoomOut className="h-4 w-4 text-white" />
                </div>
                <span className="text-[9px] font-semibold text-muted-foreground">Zoom Out</span>
              </button>
              <button 
                onClick={handleLocate}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border-2 border-border hover:border-purple-500/50 hover:bg-purple-500/10 transition-all active:scale-95"
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Locate className="h-4 w-4 text-white" />
                </div>
                <span className="text-[9px] font-semibold text-muted-foreground">Locate</span>
              </button>
              <button 
                onClick={handleFullscreen}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border-2 border-border hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all active:scale-95"
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Maximize className="h-4 w-4 text-white" />
                </div>
                <span className="text-[9px] font-semibold text-muted-foreground">Fullscreen</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
              onClick={() => {
                const currentStop = currentRoute.stops.find(s => s.status === 'current')
                if (currentStop && (window as any).mapInstance) {
                  alert(`🚌 Navigating to ${currentStop.name}...`)
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <Navigation className="h-5 w-5" />
              Navigate to Next Stop
            </button>
            <button 
              onClick={() => alert('📞 Connecting to dispatch...')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <Phone className="h-5 w-5" />
              Contact Dispatch
            </button>
          </div>
        </GlassCard>
      </div>

        {/* Route Progress - Takes 1 column on xl screens */}
        <GlassCard className="p-4 sm:p-6 border-2 border-primary/10">
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            Route Progress
          </h3>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-muted-foreground">
                {currentRoute.stops.filter(s => s.status === 'completed').length} of {currentRoute.stops.length} completed
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((currentRoute.stops.filter(s => s.status === 'completed').length / currentRoute.stops.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
                style={{ width: `${(currentRoute.stops.filter(s => s.status === 'completed').length / currentRoute.stops.length) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2.5 sm:space-y-3 max-h-[400px] overflow-y-auto -mr-2 pr-4 scrollbar-thin scrollbar-thumb-blue-500/50 dark:scrollbar-thumb-blue-400/30 scrollbar-track-transparent hover:scrollbar-thumb-blue-600/70 dark:hover:scrollbar-thumb-blue-400/50">
            {currentRoute.stops.map((stop, index) => (
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
                    {stop.status === "completed" && `Departed - ${stop.time}`}
                    {stop.status === "current" && (
                      <span className="text-blue-600 dark:text-blue-400 font-semibold animate-pulse">
                        Arriving in {stop.eta} min
                      </span>
                    )}
                    {stop.status === "upcoming" && `Scheduled - ${stop.time}`}
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
        </GlassCard>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions - Takes 2 columns on xl screens */}
        <div className="xl:col-span-2">
        <GlassCard className="p-4 sm:p-6 border-2 border-primary/10">
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button 
              onClick={() => {
                const issue = prompt('Describe the issue:');
                if (issue) {
                  alert(`✅ Issue reported: ${issue}\nDispatch has been notified.`);
                }
              }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-red-500/50 hover:bg-red-500/10 transition-all group active:scale-95"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-foreground">Report Issue</span>
            </button>

            <button 
              onClick={() => {
                alert('📞 Calling dispatch...\nConnecting to support center.');
              }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-purple-500/50 hover:bg-purple-500/10 transition-all group active:scale-95"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-foreground">Call Dispatch</span>
            </button>

            <button 
              onClick={() => {
                if (confirm('Mark current trip as completed?')) {
                  alert('✅ Trip completed!\nGreat job today!');
                }
              }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group active:scale-95"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-foreground">Complete Trip</span>
            </button>

            <button 
              onClick={() => {
                router.push('/driver-portal/messages');
              }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all group active:scale-95"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-foreground">Messages</span>
            </button>
          </div>
        </GlassCard>
        </div>

        {/* Active Alerts - Takes 1 column on xl screens */}
        <GlassCard className="p-4 sm:p-6 border-2 border-primary/10">
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            Active Alerts
          </h3>
          <div className="space-y-2.5 sm:space-y-3 max-h-[400px] overflow-y-auto -mr-2 pr-4 scrollbar-thin scrollbar-thumb-amber-500/50 dark:scrollbar-thumb-amber-400/30 scrollbar-track-transparent hover:scrollbar-thumb-amber-600/70 dark:hover:scrollbar-thumb-amber-400/50">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02]",
                  alert.color === "amber" && "bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50 shadow-md",
                  alert.color === "blue" && "bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50 shadow-md"
                )}
              >
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className={cn(
                    "h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg",
                    alert.color === "amber" && "bg-gradient-to-br from-amber-500 to-orange-500",
                    alert.color === "blue" && "bg-gradient-to-br from-blue-500 to-cyan-500"
                  )}>
                    <alert.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-foreground leading-tight">{alert.title}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 leading-tight">{alert.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
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
    </main>
  )
}
