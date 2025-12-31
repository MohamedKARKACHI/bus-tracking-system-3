"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { BusMap } from "@/components/bus-map"
import { DriverIdCard } from "@/components/driver-id-card"
import { useDriverSidebar } from "@/lib/driver-sidebar-context"
import {
  MapPin, Clock, AlertCircle, CheckCircle2, Navigation,
  Users, TrendingUp, Zap, Route, Circle, MessageSquare,
  Star, ChevronRight, X, Shield, Play, Calendar, Search,
  Timer, Bus, Fuel, Gauge, ArrowRight, Loader2, Bell, User,
  ChevronDown, ChevronUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import axios from "axios"
import { toast } from "sonner"

export default function DriverPortalPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { sidebarExpanded } = useDriverSidebar()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showIdCard, setShowIdCard] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showRouteStops, setShowRouteStops] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number; name: string } | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, title: "Traffic Alert", message: "Heavy traffic on Avenue Mohammed V", time: "5 min ago", type: "warning", read: false },
    { id: 2, title: "Passenger Request", message: "Wheelchair assistance needed at next stop", time: "10 min ago", type: "info", read: false },
    { id: 3, title: "Schedule Update", message: "Your afternoon shift has been confirmed", time: "1 hour ago", type: "success", read: true },
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      setIsSearching(true)
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&countrycodes=ma`)
        setSearchResults(response.data)
      } catch (e) {
        console.error("Search failed", e)
      } finally {
        setIsSearching(false)
      }
    } else {
      setSearchResults([])
    }
  }

  const handleSelectLocation = (result: any) => {
    setSelectedLocation({
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      name: result.display_name.split(',')[0]
    })
    setSearchQuery("")
    setSearchResults([])
    setShowSearch(false)
    toast.success(`Navigating to ${result.display_name.split(',')[0]}`)
  }

  const stats = [
    { label: "Trips", value: "12", icon: Route, color: "text-blue-500" },
    { label: "Passengers", value: "247", icon: Users, color: "text-violet-500" },
    { label: "On-Time", value: "94%", icon: Clock, color: "text-emerald-500" },
    { label: "Rating", value: "4.8", icon: Star, color: "text-amber-500" },
  ]

  const currentRoute = {
    name: "Marrakech Express",
    code: "Route 1",
    busNumber: "BUS-101",
    progress: 65,
    nextStop: "Ben Youssef",
    eta: "5 min",
    stops: [
      { id: 1, name: "Palmeraie", time: "08:00", status: "completed" },
      { id: 2, name: "Gueliz", time: "08:15", status: "completed" },
      { id: 3, name: "Ben Youssef", time: "08:30", status: "active", eta: "5 min" },
      { id: 4, name: "Jemaa el Fna", time: "08:45", status: "upcoming" },
      { id: 5, name: "Médina Gate", time: "09:00", status: "upcoming" },
    ],
  }

  const alerts = [
    { id: 1, title: "Traffic on Av. Mohammed V", time: "5 min", type: "warning" },
    { id: 2, title: "Wheelchair assistance needed", time: "2 min", type: "info" },
  ]

  return (
    <div className={cn(
      "min-h-screen pb-24 lg:pb-0 transition-all duration-300",
      sidebarExpanded ? "lg:ml-0" : "lg:ml-0"
    )}>

      {/* ============ MOBILE LAYOUT ============ */}
      <div className="lg:hidden">
        {/* Search Bar Only - buttons already in header */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
          <div
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-4 py-3 bg-muted rounded-xl cursor-pointer"
          >
            <Search className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Search stations, routes...</span>
          </div>
        </div>

        {/* Stats Row - 4 in horizontal line */}
        <div className="px-4 py-3">
          <div className="grid grid-cols-4 gap-2">
            {stats.map((stat, i) => (
              <div key={i} className="bg-card rounded-2xl p-3 border text-center">
                <stat.icon className={cn("w-5 h-5 mx-auto mb-1", stat.color)} />
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map Card - Mobile */}
        <div className="px-4 mb-4">
          <div className="bg-card rounded-3xl overflow-hidden shadow-lg border">
            <div className="h-64 relative">
              <BusMap
                height="100%"
                showControls={true}
                driverMode={true}
                centerOn={selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lon } : undefined}
              />
            </div>
            {/* Next Stop Info below map */}
            <div className="p-3 border-t flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold">{selectedLocation?.name || currentRoute.nextStop}</p>
                  <p className="text-sm text-muted-foreground">Next Stop • {currentRoute.eta}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-500 rounded-xl text-white text-sm font-medium">
                Navigate
              </button>
            </div>
          </div>
        </div>

        {/* Current Route Card */}
        <div className="px-4 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white/70 text-xs">Active Route</p>
                <h3 className="font-bold text-lg">{currentRoute.name}</h3>
                <p className="text-white/80 text-sm">{currentRoute.code} • {currentRoute.busNumber}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <span className="font-bold text-xl">{currentRoute.progress}%</span>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${currentRoute.progress}%` }} />
            </div>
          </div>
        </div>

        {/* Route Stops - Collapsible Dropdown */}
        <div className="px-4 mb-4">
          <button
            onClick={() => setShowRouteStops(!showRouteStops)}
            className="w-full flex items-center justify-between p-4 bg-card rounded-2xl border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                <Route className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <h3 className="font-bold">Route Stops</h3>
                <p className="text-xs text-muted-foreground">{currentRoute.stops.length} stops • {currentRoute.progress}% complete</p>
              </div>
            </div>
            {showRouteStops ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showRouteStops && (
            <div className="mt-2 bg-card rounded-2xl p-4 border space-y-3 animate-in slide-in-from-top-2 duration-200">
              {currentRoute.stops.map((stop, i) => (
                <div key={stop.id} className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                    stop.status === 'completed' ? "bg-emerald-500 text-white" :
                      stop.status === 'active' ? "bg-blue-500 text-white animate-pulse" :
                        "bg-muted text-muted-foreground"
                  )}>
                    {stop.status === 'completed' ? '✓' : i + 1}
                  </div>
                  <div className="flex-1">
                    <p className={cn("font-medium text-sm", stop.status === 'active' && "text-blue-500")}>{stop.name}</p>
                    <p className="text-xs text-muted-foreground">{stop.time}</p>
                  </div>
                  {stop.status === 'active' && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
                      {stop.eta}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-4 mb-4">
          <h3 className="font-bold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: AlertCircle, label: "Report", href: "/driver-portal/incidents", color: "bg-red-500" },
              { icon: MessageSquare, label: "Chat", href: "/driver-portal/messages", color: "bg-blue-500" },
              { icon: Calendar, label: "Schedule", href: "/driver-portal/schedule", color: "bg-violet-500" },
              { icon: TrendingUp, label: "Stats", href: "/driver-portal/performance", color: "bg-emerald-500" },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => router.push(action.href)}
                className="flex flex-col items-center gap-2 p-3 bg-card rounded-2xl border"
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", action.color)}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="px-4 mb-6">
          <h3 className="font-bold mb-3">Alerts</h3>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className={cn(
                "flex items-center gap-3 p-3 rounded-2xl",
                alert.type === 'warning' ? "bg-amber-50 dark:bg-amber-500/10" : "bg-blue-50 dark:bg-blue-500/10"
              )}>
                <AlertCircle className={cn("w-5 h-5", alert.type === 'warning' ? "text-amber-500" : "text-blue-500")} />
                <span className="text-sm font-medium flex-1">{alert.title}</span>
                <span className="text-xs text-muted-foreground">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ DESKTOP LAYOUT ============ */}
      <div className="hidden lg:flex flex-col h-[calc(100vh-64px)]">
        {/* FULL WIDTH TOP BAR */}
        <div className="flex items-center justify-between gap-6 px-6 py-4 border-b bg-background">
          {/* Left - Profile */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'D'}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Welcome back</p>
              <p className="font-bold text-sm">{user?.name || 'Driver'}</p>
            </div>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search stations, routes, locations..."
              className="w-full pl-12 pr-4 py-2.5 bg-muted rounded-xl border-none focus:ring-2 focus:ring-blue-500"
            />
            {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-blue-500" />}

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl border shadow-xl z-[1500] overflow-hidden max-h-64 overflow-y-auto">
                {searchResults.map((result, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectLocation(result)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted text-left transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{result.display_name.split(',')[0]}</p>
                      <p className="text-xs text-muted-foreground truncate">{result.display_name}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIdCard(true)}
              className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              title="ID Card"
            >
              <Shield className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => router.push('/driver-portal/settings')}
              className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              title="Profile Settings"
            >
              <User className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                  {notifications.filter(n => !n.read).length}
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-card rounded-2xl border shadow-xl z-[1500] overflow-hidden">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-bold">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          "p-4 border-b hover:bg-muted cursor-pointer transition-colors",
                          !notif.read && "bg-blue-50/50 dark:bg-blue-500/5"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            notif.type === 'warning' ? "bg-amber-100 text-amber-600" :
                              notif.type === 'success' ? "bg-emerald-100 text-emerald-600" :
                                "bg-blue-100 text-blue-600"
                          )}>
                            {notif.type === 'warning' ? <AlertCircle className="w-4 h-4" /> :
                              notif.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                                <Bell className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{notif.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{notif.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                          </div>
                          {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t">
                    <button
                      onClick={() => {
                        router.push('/driver-portal/messages')
                        setShowNotifications(false)
                      }}
                      className="w-full py-2 text-center text-sm text-blue-500 font-medium hover:bg-muted rounded-xl transition-colors"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-1 gap-6 p-6 overflow-hidden">
          {/* Left Panel - Info */}
          <div className="w-[360px] flex flex-col gap-4 overflow-y-auto">
            {/* Stats Row - 4 horizontal */}
            <div className="grid grid-cols-4 gap-2">
              {stats.map((stat, i) => (
                <div key={i} className="bg-card rounded-2xl p-3 border text-center">
                  <stat.icon className={cn("w-5 h-5 mx-auto mb-1", stat.color)} />
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Current Route Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/70 text-sm">Active Route</p>
                  <h3 className="font-bold text-xl">{currentRoute.name}</h3>
                  <p className="text-white/80">{currentRoute.code} • {currentRoute.busNumber}</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <span className="font-bold text-xl">{currentRoute.progress}%</span>
                </div>
              </div>
              <div className="h-2 bg-white/20 rounded-full mb-4">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${currentRoute.progress}%` }} />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-2xl">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <p className="text-white/70 text-xs">Next Stop</p>
                    <p className="font-semibold">{selectedLocation?.name || currentRoute.nextStop}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl">{currentRoute.eta}</p>
                  <p className="text-white/70 text-xs">ETA</p>
                </div>
              </div>
            </div>

            {/* Route Stops - Collapsible */}
            <div className="flex-1 flex flex-col min-h-0">
              <button
                onClick={() => setShowRouteStops(!showRouteStops)}
                className="flex items-center justify-between p-4 bg-card rounded-2xl border mb-2"
              >
                <h3 className="font-bold">Route Stops</h3>
                {showRouteStops ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {showRouteStops && (
                <div className="bg-card rounded-2xl p-4 border space-y-4 overflow-y-auto flex-1 animate-in slide-in-from-top-2 duration-200">
                  {currentRoute.stops.map((stop, i) => (
                    <div key={stop.id} className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          stop.status === 'completed' ? "bg-emerald-500 text-white" :
                            stop.status === 'active' ? "bg-blue-500 text-white" :
                              "bg-muted text-muted-foreground"
                        )}>
                          {stop.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                            stop.status === 'active' ? <Navigation className="w-5 h-5" /> :
                              <Circle className="w-5 h-5" />}
                        </div>
                        {i < currentRoute.stops.length - 1 && (
                          <div className={cn("w-0.5 h-6 my-1", stop.status === 'completed' ? "bg-emerald-500" : "bg-muted")} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={cn("font-semibold", stop.status === 'active' && "text-blue-500")}>{stop.name}</p>
                        <p className="text-sm text-muted-foreground">{stop.time}</p>
                      </div>
                      {stop.status === 'active' && (
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-bold rounded-full">
                          {stop.eta}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Map (smaller) */}
          <div className="flex-1 bg-card rounded-3xl overflow-hidden border shadow-lg">
            <BusMap
              height="100%"
              showControls={true}
              driverMode={true}
              centerOn={selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lon } : undefined}
            />
          </div>
        </div>
      </div>

      {/* Search Modal - Mobile */}
      {showSearch && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setShowSearch(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search stations, routes..."
                  className="w-full pl-12 pr-4 py-3 bg-muted rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectLocation(result)}
                  className="w-full flex items-center gap-3 p-4 bg-muted rounded-xl text-left"
                >
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{result.display_name.split(',')[0]}</p>
                    <p className="text-sm text-muted-foreground truncate">{result.display_name}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ID Card Modal */}
      {showIdCard && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowIdCard(false)}>
          <div className="relative w-full max-w-sm animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowIdCard(false)}
              className="absolute -top-3 -right-3 w-10 h-10 bg-background rounded-full shadow-lg flex items-center justify-center z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <DriverIdCard />
          </div>
        </div>
      )}
    </div>
  )
}
