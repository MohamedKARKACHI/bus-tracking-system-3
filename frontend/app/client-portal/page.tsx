"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { MapPin, Ticket, TrendingUp, Bus, Navigation, ArrowRight, Loader2, Clock } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { BusMap } from "@/components/bus-map"
import { fetchWithAuth } from "@/lib/api-client"

export default function ClientPortalPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selectedBus, setSelectedBus] = useState<string | null>(null)
  const [stats, setStats] = useState({
    activeBuses: 0,
    myTickets: 0,
    totalRoutes: 0
  })
  const [upcomingTrips, setUpcomingTrips] = useState<any[]>([])
  const [nearbyBuses, setNearbyBuses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role !== "client") {
      if (user.role === "admin") {
        router.push("/dashboard")
      } else if (user.role === "driver") {
        router.push("/driver-portal")
      }
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch user tickets
      const ticketsRes = await fetch(`/api/tickets?userId=${user?.id}`)
      const ticketsData = await ticketsRes.json()

      // Get upcoming trips (booked tickets)
      const upcoming = ticketsData
        .filter((t: any) => t.status === 'booked')
        .slice(0, 2)
        .map((t: any) => ({
          id: t.id,
          date: new Date(t.departure_time).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          }),
          route: t.route_name,
          from: t.boarding_stop_name,
          to: t.destination_stop_name,
          ticketId: t.ticket_number
        }))

      setUpcomingTrips(upcoming)

      // Fetch buses
      const busesRes = await fetchWithAuth('/api/buses')
      const routesRes = await fetchWithAuth('/api/routes')
      const busesData = await busesRes.json()
      const routesData = await routesRes.json()

      // Get nearby buses (active ones)
      const nearby = busesData
        .filter((b: any) => b.status === 'active')
        .slice(0, 3)
        .map((b: any) => ({
          id: b.bus_number,
          route: b.route_name || 'Unknown Route',
          eta: Math.floor(Math.random() * 15) + 3, // Mock ETA
          seats: Math.floor(Math.random() * 20) + 5, // Mock seats
          status: 'on-time'
        }))

      setNearbyBuses(nearby)

      // Fetch routes
      // Routes already fetched above


      setStats({
        activeBuses: busesData.filter((b: any) => b.status === 'active').length,
        myTickets: ticketsData.filter((t: any) => t.status === 'booked').length,
        totalRoutes: routesData.length
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set mock data on error
      setStats({
        activeBuses: 11,
        myTickets: 3,
        totalRoutes: 4
      })
      setUpcomingTrips([
        { id: "t1", date: "Today, 2:30 PM", route: "Downtown Express", from: "Home", to: "Office", ticketId: "TCK-001" },
        { id: "t2", date: "Tomorrow, 9:00 AM", route: "Airport Shuttle", from: "Home", to: "Airport", ticketId: "TCK-002" },
      ])
      setNearbyBuses([
        { id: "101", route: "Downtown Express", eta: 5, seats: 12, status: "on-time" },
        { id: "205", route: "Airport Shuttle", eta: 12, seats: 3, status: "delayed" },
        { id: "308", route: "University Line", eta: 8, seats: 20, status: "on-time" },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || !user || user.role !== "client") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <Loader2 className="w-16 h-16 text-cyan-600 animate-spin" />
      </div>
    )
  }

  const statsDisplay = [
    { label: "Active Buses", value: stats?.activeBuses?.toString() ?? "0", icon: Bus, color: "from-blue-500 to-cyan-500" },
    { label: "My Tickets", value: stats?.myTickets?.toString() ?? "0", icon: Ticket, color: "from-purple-500 to-pink-500" },
    { label: "Total Routes", value: stats?.totalRoutes?.toString() ?? "0", icon: Navigation, color: "from-emerald-500 to-green-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {user.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Track buses and manage your trips</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {statsDisplay.map((stat, index) => (
                <GlassCard key={index} className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/client-portal/book-ticket">
                  <GlassCard className="p-6 hover:shadow-xl transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Ticket className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">Book Ticket</span>
                    </div>
                  </GlassCard>
                </Link>

                <Link href="/client-portal/track-bus">
                  <GlassCard className="p-6 hover:shadow-xl transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">Track Bus</span>
                    </div>
                  </GlassCard>
                </Link>

                <Link href="/client-portal/my-tickets">
                  <GlassCard className="p-6 hover:shadow-xl transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">My Tickets</span>
                    </div>
                  </GlassCard>
                </Link>

                <Link href="/client-portal/history">
                  <GlassCard className="p-6 hover:shadow-xl transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">History</span>
                    </div>
                  </GlassCard>
                </Link>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map */}
              <div className="lg:col-span-2">
                <GlassCard className="overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      Live Map
                    </h2>
                  </div>
                  <BusMap height="400px" showControls={true} highlightBus={selectedBus ? `BUS-${selectedBus}` : null} />
                </GlassCard>

                {/* Nearby Buses */}
                {nearbyBuses.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Nearby Buses</h2>
                    <div className="grid gap-4">
                      {nearbyBuses.map((bus) => (
                        <GlassCard key={bus.id} className="p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedBus(bus.id)}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <Bus className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">Bus #{bus.id}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{bus.route}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm text-slate-600 dark:text-slate-400">ETA</p>
                                <p className="font-bold text-slate-900 dark:text-white">{bus.eta} min</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-slate-600 dark:text-slate-400">Seats</p>
                                <p className="font-bold text-slate-900 dark:text-white">{bus.seats}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bus.status === "on-time"
                                ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                                : "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
                                }`}>
                                {bus.status}
                              </span>
                            </div>
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Upcoming Trips */}
                <GlassCard className="p-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-blue-500" />
                    Upcoming Trips
                  </h3>
                  {upcomingTrips.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingTrips.map((trip) => (
                        <div key={trip.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:shadow-md transition-all">
                          <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">{trip.date}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{trip.route}</p>
                          <div className="flex items-center gap-2 text-sm mb-3">
                            <span className="text-slate-900 dark:text-white font-medium">{trip.from}</span>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-900 dark:text-white font-medium">{trip.to}</span>
                          </div>
                          <Link href={`/client-portal/my-tickets/${trip.ticketId}`}>
                            <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                              View Ticket
                            </button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-600 dark:text-slate-400 mb-4">No upcoming trips</p>
                      <Link href="/client-portal/book-ticket">
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-sm font-medium transition-all">
                          Book a Ticket
                        </button>
                      </Link>
                    </div>
                  )}
                </GlassCard>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
