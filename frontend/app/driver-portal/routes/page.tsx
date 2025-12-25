"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { useDriverSidebar } from "@/lib/driver-sidebar-context"
import { useAuth } from "@/lib/auth-context"
import { Navigation, MapPin, Clock, Users, TrendingUp, Filter, Search, Star, Route, Calendar, ChevronRight, BarChart3, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { fetchWithAuth } from "@/lib/api-client"

export default function MyRoutesPage() {
  const { sidebarExpanded } = useDriverSidebar()
  const { user } = useAuth()
  const router = useRouter()
  const [routes, setRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    try {
      const response = await fetchWithAuth('/api/routes')
      if (response.ok) {
        const data = await response.json()
        // Ensure data is an array
        setRoutes(Array.isArray(data) ? data : [])
      } else {
        // Enhanced fallback data with comprehensive route details
        setRoutes([
          {
            id: "RT-001",
            name: "Downtown Loop",
            code: "Route A",
            stops: 12,
            distance: "24.5 km",
            duration: "2h 15m",
            avgPassengers: 145,
            completionRate: 96,
            onTimeRate: 94,
            totalTrips: 248,
            rating: 4.8,
            status: "active",
            frequency: "Every 15 min",
            firstStop: "Central Station",
            lastStop: "City Mall"
          },
          {
            id: "RT-002",
            name: "University Express",
            code: "Route B",
            stops: 8,
            distance: "18.2 km",
            duration: "1h 45m",
            avgPassengers: 112,
            completionRate: 94,
            onTimeRate: 92,
            totalTrips: 186,
            rating: 4.6,
            status: "completed",
            frequency: "Every 20 min",
            firstStop: "Main Campus",
            lastStop: "Tech Park"
          },
          {
            id: "RT-003",
            name: "Airport Shuttle",
            code: "Route C",
            stops: 6,
            distance: "32.8 km",
            duration: "1h 30m",
            avgPassengers: 78,
            completionRate: 98,
            onTimeRate: 96,
            totalTrips: 142,
            rating: 4.9,
            status: "scheduled",
            frequency: "Every 30 min",
            firstStop: "Airport Terminal",
            lastStop: "Downtown Hub"
          },
          {
            id: "RT-004",
            name: "Shopping District",
            code: "Route D",
            stops: 10,
            distance: "16.5 km",
            duration: "2h 00m",
            avgPassengers: 128,
            completionRate: 93,
            onTimeRate: 90,
            totalTrips: 215,
            rating: 4.5,
            status: "completed",
            frequency: "Every 18 min",
            firstStop: "Plaza Center",
            lastStop: "Fashion District"
          },
          {
            id: "RT-005",
            name: "Evening Commute",
            code: "Route E",
            stops: 14,
            distance: "28.3 km",
            duration: "2h 30m",
            avgPassengers: 165,
            completionRate: 95,
            onTimeRate: 93,
            totalTrips: 198,
            rating: 4.7,
            status: "scheduled",
            frequency: "Every 12 min",
            firstStop: "Business District",
            lastStop: "Residential Area"
          },
          {
            id: "RT-006",
            name: "Coastal Route",
            code: "Route F",
            stops: 9,
            distance: "21.7 km",
            duration: "1h 50m",
            avgPassengers: 95,
            completionRate: 97,
            onTimeRate: 95,
            totalTrips: 176,
            rating: 4.8,
            status: "completed",
            frequency: "Every 25 min",
            firstStop: "Beach Boulevard",
            lastStop: "Harbor View"
          },
        ])
      }
    } catch (error) {
      console.error('Failed to fetch routes:', error)
      setRoutes([
        {
          id: "RT-001",
          name: "Downtown Loop",
          code: "Route A",
          stops: 12,
          distance: "24.5 km",
          duration: "2h 15m",
          avgPassengers: 145,
          completionRate: 96,
          onTimeRate: 94,
          totalTrips: 248,
          rating: 4.8,
          status: "active",
          frequency: "Every 15 min",
          firstStop: "Central Station",
          lastStop: "City Mall"
        },
        {
          id: "RT-002",
          name: "University Express",
          code: "Route B",
          stops: 8,
          distance: "18.2 km",
          duration: "1h 45m",
          avgPassengers: 112,
          completionRate: 94,
          onTimeRate: 92,
          totalTrips: 186,
          rating: 4.6,
          status: "completed",
          frequency: "Every 20 min",
          firstStop: "Main Campus",
          lastStop: "Tech Park"
        },
        {
          id: "RT-003",
          name: "Airport Shuttle",
          code: "Route C",
          stops: 6,
          distance: "32.8 km",
          duration: "1h 30m",
          avgPassengers: 78,
          completionRate: 98,
          onTimeRate: 96,
          totalTrips: 142,
          rating: 4.9,
          status: "scheduled",
          frequency: "Every 30 min",
          firstStop: "Airport Terminal",
          lastStop: "Downtown Hub"
        },
        {
          id: "RT-004",
          name: "Shopping District",
          code: "Route D",
          stops: 10,
          distance: "16.5 km",
          duration: "2h 00m",
          avgPassengers: 128,
          completionRate: 93,
          onTimeRate: 90,
          totalTrips: 215,
          rating: 4.5,
          status: "completed",
          frequency: "Every 18 min",
          firstStop: "Plaza Center",
          lastStop: "Fashion District"
        },
        {
          id: "RT-005",
          name: "Evening Commute",
          code: "Route E",
          stops: 14,
          distance: "28.3 km",
          duration: "2h 30m",
          avgPassengers: 165,
          completionRate: 95,
          onTimeRate: 93,
          totalTrips: 198,
          rating: 4.7,
          status: "scheduled",
          frequency: "Every 12 min",
          firstStop: "Business District",
          lastStop: "Residential Area"
        },
        {
          id: "RT-006",
          name: "Coastal Route",
          code: "Route F",
          stops: 9,
          distance: "21.7 km",
          duration: "1h 50m",
          avgPassengers: 95,
          completionRate: 97,
          onTimeRate: 95,
          totalTrips: 176,
          rating: 4.8,
          status: "completed",
          frequency: "Every 25 min",
          firstStop: "Beach Boulevard",
          lastStop: "Harbor View"
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredRoutes = (Array.isArray(routes) ? routes : [])
    .filter(r => filter === "all" ? true : r.status === filter)
    .filter(r =>
      searchQuery === "" ? true :
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

  // Calculate stats
  const totalRoutes = (Array.isArray(routes) ? routes : []).length
  const activeRoutes = (Array.isArray(routes) ? routes : []).filter(r => r.status === "active").length
  const avgCompletionRate = (Array.isArray(routes) ? routes : []).length > 0
    ? (Array.isArray(routes) ? routes : []).reduce((acc, r) => acc + (r.completionRate || 0), 0) / (Array.isArray(routes) ? routes : []).length
    : 0
  const totalTrips = (Array.isArray(routes) ? routes : []).reduce((acc, r) => acc + (r.totalTrips || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main
      className={cn(
        "flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto transition-all duration-300 bg-gradient-to-br from-background via-background to-muted/20",
        sidebarExpanded ? "lg:ml-0" : "lg:ml-0",
      )}
    >
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <Route className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">My Routes</h1>
        </div>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Manage and track your assigned routes</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
        <GlassCard className="p-2.5 sm:p-3 lg:p-4 hover:scale-105 transition-all duration-200 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <Route className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-white" />
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground mb-0.5 sm:mb-1">{totalRoutes}</div>
          <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground leading-tight">Total Routes</div>
        </GlassCard>

        <GlassCard className="p-2.5 sm:p-3 lg:p-4 hover:scale-105 transition-all duration-200 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <Navigation className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-white" />
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground mb-0.5 sm:mb-1">{activeRoutes}</div>
          <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground leading-tight">Active Routes</div>
        </GlassCard>

        <GlassCard className="p-2.5 sm:p-3 lg:p-4 hover:scale-105 transition-all duration-200 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <BarChart3 className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-white" />
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground mb-0.5 sm:mb-1">{avgCompletionRate.toFixed(1)}%</div>
          <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground leading-tight">Avg Completion</div>
        </GlassCard>

        <GlassCard className="p-2.5 sm:p-3 lg:p-4 hover:scale-105 transition-all duration-200 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <Target className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-white" />
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground mb-0.5 sm:mb-1">{totalTrips}</div>
          <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground leading-tight">Total Trips</div>
        </GlassCard>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search routes by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border-2 border-border/50 focus:border-blue-500/50 transition-all outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2",
              filter === "all"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            All ({totalRoutes})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={cn(
              "px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2",
              filter === "active"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            Active ({activeRoutes})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={cn(
              "px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2",
              filter === "completed"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Routes Grid */}
      {filteredRoutes.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold text-foreground mb-2">No routes found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </GlassCard>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {filteredRoutes.map((route) => (
            <GlassCard key={route.id} className="p-4 sm:p-6 border-2 border-primary/10 hover:border-primary/20 transition-all">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                    <Navigation className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">{route.name}</h3>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <span className="font-semibold">{route.code}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        {route.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold shadow-md",
                    route.status === "active" && "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
                    route.status === "completed" && "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
                    route.status === "scheduled" && "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
                  )}
                >
                  {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                </span>
              </div>

              {/* Route Info */}
              <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/10">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-foreground">{route.firstStop}</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="font-medium text-foreground">{route.lastStop}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-4">
                <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                    <span className="text-xs text-muted-foreground">Stops</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-foreground">{route.stops}</p>
                </div>

                <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Navigation className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">Distance</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-foreground">{route.distance}</p>
                </div>

                <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-500" />
                    <span className="text-xs text-muted-foreground">Duration</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-foreground">{route.duration}</p>
                </div>

                <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                    <span className="text-xs text-muted-foreground">Avg Pass.</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-foreground">{route.avgPassengers}</p>
                </div>

                <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                    <span className="text-xs text-muted-foreground">On-Time</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-foreground">{route.onTimeRate}%</p>
                </div>

                <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-rose-500" />
                    <span className="text-xs text-muted-foreground">Trips</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-foreground">{route.totalTrips}</p>
                </div>
              </div>

              {/* Frequency Badge */}
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <Clock className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-medium text-foreground">{route.frequency}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => router.push(`/driver-portal/routes/${route.id}`)}
                  className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  View Details
                </button>
                {route.status === "active" && (
                  <button
                    onClick={() => router.push('/driver-portal/track-route')}
                    className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Navigation className="h-4 w-4" />
                    Start Navigation
                  </button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </main>
  )
}
