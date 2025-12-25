"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { useDriverSidebar } from "@/lib/driver-sidebar-context"
import { 
  Navigation, MapPin, Clock, Users, TrendingUp, ArrowLeft, 
  Star, Calendar, Route, BarChart3, Target, CheckCircle2,
  AlertCircle, TrendingDown, Award, Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function RouteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { sidebarExpanded } = useDriverSidebar()
  const [route, setRoute] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRouteDetails()
  }, [params.id])

  const fetchRouteDetails = async () => {
    try {
      const response = await fetch(`/api/routes/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setRoute(data)
      } else {
        // Fallback data for the specific route
        const routeId = params.id as string
        const routesData: { [key: string]: any } = {
          "RT-001": {
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
            lastStop: "City Mall",
            busNumber: "BUS-101",
            schedule: "06:00 AM - 10:00 PM",
            peakHours: "8:00 AM - 10:00 AM, 5:00 PM - 7:00 PM",
            averageSpeed: "28 km/h",
            fuelEfficiency: "6.5 km/L",
            safetyScore: 98,
            stopsList: [
              { id: 1, name: "Central Station", time: "06:00 AM", passengers: 25, completed: true },
              { id: 2, name: "Market Square", time: "06:15 AM", passengers: 18, completed: true },
              { id: 3, name: "City Hall", time: "06:28 AM", passengers: 22, completed: true },
              { id: 4, name: "Business Park", time: "06:42 AM", passengers: 15, completed: true },
              { id: 5, name: "University Ave", time: "06:58 AM", passengers: 30, completed: false },
              { id: 6, name: "Shopping Center", time: "07:15 AM", passengers: 20, completed: false },
              { id: 7, name: "Hospital District", time: "07:32 AM", passengers: 12, completed: false },
              { id: 8, name: "Tech Hub", time: "07:48 AM", passengers: 25, completed: false },
              { id: 9, name: "Park Avenue", time: "08:05 AM", passengers: 14, completed: false },
              { id: 10, name: "Waterfront", time: "08:22 AM", passengers: 18, completed: false },
              { id: 11, name: "Convention Center", time: "08:38 AM", passengers: 16, completed: false },
              { id: 12, name: "City Mall", time: "08:55 AM", passengers: 20, completed: false },
            ],
            recentTrips: [
              { id: 1, date: "Nov 27, 2025", startTime: "06:00 AM", endTime: "08:55 AM", passengers: 156, onTime: true, rating: 4.9 },
              { id: 2, date: "Nov 26, 2025", startTime: "06:00 AM", endTime: "09:02 AM", passengers: 142, onTime: false, rating: 4.6 },
              { id: 3, date: "Nov 25, 2025", startTime: "06:00 AM", endTime: "08:52 AM", passengers: 148, onTime: true, rating: 4.8 },
              { id: 4, date: "Nov 24, 2025", startTime: "06:00 AM", endTime: "08:58 AM", passengers: 139, onTime: true, rating: 4.7 },
              { id: 5, date: "Nov 23, 2025", startTime: "06:00 AM", endTime: "08:50 AM", passengers: 151, onTime: true, rating: 5.0 },
            ],
            achievements: [
              { id: 1, title: "Perfect Week", description: "100% on-time arrivals for 7 days", icon: Award, color: "emerald", completed: true },
              { id: 2, title: "Passenger Favorite", description: "4.8+ rating for 30 days", icon: Star, color: "amber", completed: true },
              { id: 3, title: "Efficiency Master", description: "95%+ completion rate", icon: Zap, color: "blue", completed: true },
              { id: 4, title: "Safety Champion", description: "No incidents for 90 days", icon: CheckCircle2, color: "purple", completed: false },
            ],
          },
          "RT-002": {
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
            lastStop: "Tech Park",
            busNumber: "BUS-102",
            schedule: "07:00 AM - 09:00 PM",
            peakHours: "7:00 AM - 9:00 AM, 4:00 PM - 6:00 PM",
            averageSpeed: "32 km/h",
            fuelEfficiency: "7.2 km/L",
            safetyScore: 96,
            stopsList: [
              { id: 1, name: "Main Campus", time: "07:00 AM", passengers: 20, completed: true },
              { id: 2, name: "Student Housing", time: "07:12 AM", passengers: 15, completed: true },
              { id: 3, name: "Library District", time: "07:25 AM", passengers: 18, completed: true },
              { id: 4, name: "Research Center", time: "07:38 AM", passengers: 12, completed: true },
              { id: 5, name: "Innovation Hub", time: "07:52 AM", passengers: 14, completed: true },
              { id: 6, name: "Science Park", time: "08:06 AM", passengers: 16, completed: true },
              { id: 7, name: "Engineering Quarter", time: "08:20 AM", passengers: 13, completed: true },
              { id: 8, name: "Tech Park", time: "08:35 AM", passengers: 18, completed: true },
            ],
            recentTrips: [
              { id: 1, date: "Nov 27, 2025", startTime: "07:00 AM", endTime: "08:35 AM", passengers: 118, onTime: true, rating: 4.7 },
              { id: 2, date: "Nov 26, 2025", startTime: "07:00 AM", endTime: "08:42 AM", passengers: 105, onTime: false, rating: 4.5 },
              { id: 3, date: "Nov 25, 2025", startTime: "07:00 AM", endTime: "08:38 AM", passengers: 112, onTime: true, rating: 4.6 },
              { id: 4, date: "Nov 24, 2025", startTime: "07:00 AM", endTime: "08:40 AM", passengers: 109, onTime: true, rating: 4.8 },
            ],
            achievements: [
              { id: 1, title: "Early Bird", description: "95%+ morning punctuality", icon: Award, color: "emerald", completed: true },
              { id: 2, title: "Student Choice", description: "4.5+ rating for 60 days", icon: Star, color: "amber", completed: true },
              { id: 3, title: "Route Master", description: "Completed 180+ trips", icon: Target, color: "blue", completed: true },
            ],
          },
          "RT-003": {
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
            lastStop: "Downtown Hub",
            busNumber: "BUS-103",
            schedule: "05:00 AM - 11:00 PM",
            peakHours: "6:00 AM - 9:00 AM, 5:00 PM - 8:00 PM",
            averageSpeed: "45 km/h",
            fuelEfficiency: "5.8 km/L",
            safetyScore: 99,
            stopsList: [
              { id: 1, name: "Airport Terminal", time: "05:00 AM", passengers: 18, completed: false },
              { id: 2, name: "International Gate", time: "05:15 AM", passengers: 12, completed: false },
              { id: 3, name: "Hotel District", time: "05:35 AM", passengers: 10, completed: false },
              { id: 4, name: "Business Quarter", time: "05:55 AM", passengers: 15, completed: false },
              { id: 5, name: "City Center", time: "06:15 AM", passengers: 14, completed: false },
              { id: 6, name: "Downtown Hub", time: "06:30 AM", passengers: 16, completed: false },
            ],
            recentTrips: [
              { id: 1, date: "Nov 26, 2025", startTime: "05:00 AM", endTime: "06:30 AM", passengers: 82, onTime: true, rating: 5.0 },
              { id: 2, date: "Nov 25, 2025", startTime: "05:00 AM", endTime: "06:28 AM", passengers: 76, onTime: true, rating: 4.9 },
              { id: 3, date: "Nov 24, 2025", startTime: "05:00 AM", endTime: "06:32 AM", passengers: 79, onTime: true, rating: 4.8 },
            ],
            achievements: [
              { id: 1, title: "Perfect Timing", description: "98%+ on-time rate", icon: Award, color: "emerald", completed: true },
              { id: 2, title: "Top Rated", description: "4.9 average rating", icon: Star, color: "amber", completed: true },
              { id: 3, title: "Safety First", description: "99 safety score", icon: CheckCircle2, color: "purple", completed: true },
            ],
          },
        }

        setRoute(routesData[routeId] || routesData["RT-001"])
      }
    } catch (error) {
      console.error("Failed to fetch route details:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!route) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Route not found</h1>
          <button onClick={() => router.back()} className="text-blue-500 hover:underline">
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <main
      className={cn(
        "flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto transition-all duration-300 bg-gradient-to-br from-background via-background to-muted/20",
        sidebarExpanded ? "lg:ml-0" : "lg:ml-0"
      )}
    >
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-all hover:scale-105"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-medium">Back to Routes</span>
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
              <Route className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                {route.name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="font-semibold">{route.code}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  {route.rating}
                </span>
                <span>•</span>
                <span>{route.busNumber}</span>
              </div>
            </div>
          </div>
          <span
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold shadow-md",
              route.status === "active" && "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
              route.status === "completed" && "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
              route.status === "scheduled" && "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            )}
          >
            {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
          </span>
        </div>

        {/* Route Path */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-foreground">{route.firstStop}</span>
            <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
            <span className="font-semibold text-foreground">{route.lastStop}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
        <GlassCard className="p-3 sm:p-4 hover:scale-105 transition-all duration-200 border-l-4 border-l-blue-500">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mb-3">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{route.stops}</div>
          <div className="text-xs text-muted-foreground">Stops</div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-4 hover:scale-105 transition-all duration-200 border-l-4 border-l-purple-500">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg mb-3">
            <Navigation className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{route.distance}</div>
          <div className="text-xs text-muted-foreground">Distance</div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-4 hover:scale-105 transition-all duration-200 border-l-4 border-l-cyan-500">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg mb-3">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{route.duration}</div>
          <div className="text-xs text-muted-foreground">Duration</div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-4 hover:scale-105 transition-all duration-200 border-l-4 border-l-emerald-500">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg mb-3">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{route.avgPassengers}</div>
          <div className="text-xs text-muted-foreground">Avg Passengers</div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-4 hover:scale-105 transition-all duration-200 border-l-4 border-l-amber-500">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg mb-3">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{route.onTimeRate}%</div>
          <div className="text-xs text-muted-foreground">On-Time</div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-4 hover:scale-105 transition-all duration-200 border-l-4 border-l-rose-500">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg mb-3">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{route.totalTrips}</div>
          <div className="text-xs text-muted-foreground">Total Trips</div>
        </GlassCard>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Route Information */}
        <GlassCard className="p-4 sm:p-6 xl:col-span-2 border-2 border-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Route Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50 dark:bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Schedule</div>
              <div className="font-semibold text-foreground">{route.schedule}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 dark:bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Frequency</div>
              <div className="font-semibold text-foreground">{route.frequency}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 dark:bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Peak Hours</div>
              <div className="font-semibold text-foreground text-sm">{route.peakHours}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 dark:bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Average Speed</div>
              <div className="font-semibold text-foreground">{route.averageSpeed}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 dark:bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Fuel Efficiency</div>
              <div className="font-semibold text-foreground">{route.fuelEfficiency}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 dark:bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Safety Score</div>
              <div className="font-semibold text-foreground">{route.safetyScore}/100</div>
            </div>
          </div>
        </GlassCard>

        {/* Achievements */}
        <GlassCard className="p-4 sm:p-6 border-2 border-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Achievements</h2>
          </div>

          <div className="space-y-3">
            {route.achievements?.map((achievement: any) => {
              const Icon = achievement.icon
              return (
                <div
                  key={achievement.id}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all",
                    achievement.completed
                      ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30"
                      : "bg-muted/30 border-border/30"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center shadow-lg",
                        achievement.color === "emerald" && "bg-gradient-to-br from-emerald-500 to-emerald-600",
                        achievement.color === "amber" && "bg-gradient-to-br from-amber-500 to-amber-600",
                        achievement.color === "blue" && "bg-gradient-to-br from-blue-500 to-blue-600",
                        achievement.color === "purple" && "bg-gradient-to-br from-purple-500 to-purple-600"
                      )}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground text-sm">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                    {achievement.completed && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>

      {/* Stops List */}
      <GlassCard className="p-4 sm:p-6 border-2 border-primary/10 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Route Stops ({route.stops})</h2>
        </div>

        <div className="space-y-3">
          {route.stopsList?.map((stop: any, index: number) => (
            <div
              key={stop.id}
              className={cn(
                "p-3 sm:p-4 rounded-xl border-2 transition-all",
                stop.completed
                  ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30"
                  : "bg-muted/30 border-border/30"
              )}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg",
                    stop.completed
                      ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                      : "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                  )}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{stop.name}</div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {stop.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      ~{stop.passengers} passengers
                    </span>
                  </div>
                </div>
                {stop.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                ) : (
                  <Clock className="h-6 w-6 text-blue-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Recent Trips */}
      <GlassCard className="p-4 sm:p-6 border-2 border-primary/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Recent Trips</h2>
        </div>

        <div className="space-y-3">
          {route.recentTrips?.map((trip: any) => (
            <div key={trip.id} className="p-4 rounded-xl bg-muted/30 border border-border/30 hover:border-primary/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-foreground">{trip.date}</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-semibold",
                        trip.onTime
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/20 text-red-600 dark:text-red-400"
                      )}
                    >
                      {trip.onTime ? "On Time" : "Delayed"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {trip.startTime} - {trip.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {trip.passengers} passengers
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      {trip.rating} rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Action Button */}
      {route.status === "active" && (
        <div className="mt-6">
          <button
            onClick={() => router.push("/driver-portal/track-route")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
          >
            <Navigation className="h-6 w-6" />
            Start Navigation
          </button>
        </div>
      )}
    </main>
  )
}
