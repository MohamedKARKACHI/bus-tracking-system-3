"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { MapPin, Clock, Users, Ticket, TrendingUp, Bus, Navigation, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BusMap } from "@/components/bus-map"

export default function ClientPortalPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selectedBus, setSelectedBus] = useState<string | null>(null)

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

  if (isLoading || !user || user.role !== "client") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  const buses = [
    { id: "101", route: "Downtown Express", eta: 5, distance: "0.8 km", status: "on-time", seats: 12, color: "blue" },
    { id: "205", route: "Airport Shuttle", eta: 12, distance: "2.3 km", status: "delayed", seats: 3, color: "purple" },
    { id: "308", route: "University Line", eta: 8, distance: "1.5 km", status: "on-time", seats: 20, color: "emerald" },
    { id: "412", route: "Beach Route", eta: 15, distance: "3.2 km", status: "on-time", seats: 8, color: "orange" },
  ]

  const upcomingTrips = [
    { id: "t1", date: "Today, 2:30 PM", route: "Downtown Express", from: "Home", to: "Office", ticketId: "TCK-001" },
    { id: "t2", date: "Tomorrow, 9:00 AM", route: "Airport Shuttle", from: "Home", to: "Airport", ticketId: "TCK-002" },
  ]

  const stats = [
    { label: "Active Buses", value: "11", icon: Bus, color: "text-blue-500" },
    { label: "Total Routes", value: "4", icon: Navigation, color: "text-purple-500" },
    { label: "My Tickets", value: "3", icon: Ticket, color: "text-emerald-500" },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">Dashboard</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Track buses and manage your trips</p>
          </div>
          <Link href="/client-portal/book-ticket">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105">
              <Ticket className="w-5 h-5 mr-2" />
              Book New Ticket
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="group relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    Live Map
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Live</span>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-lg opacity-20 group-hover:opacity-30 transition duration-500 pointer-events-none" />
                <BusMap 
                  height="500px" 
                  showControls={true}
                  highlightBus={selectedBus ? `BUS-${selectedBus}` : null}
                />
              </div>
            </div>

            {/* Nearby Buses */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Bus className="w-5 h-5 text-blue-500" />
                Nearby Buses
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {buses.map((bus) => (
                  <button
                    key={bus.id}
                    onClick={() => setSelectedBus(bus.id)}
                    className={`group text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                      selectedBus === bus.id
                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/20 shadow-xl shadow-blue-500/30 scale-[1.03]"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-blue-500/10"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-purple-400/5 to-pink-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${bus.color}-500 flex items-center justify-center`}>
                          <Bus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">#{bus.id}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">{bus.route}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bus.status === "on-time" 
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400" 
                          : "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400"
                      }`}>
                        {bus.status}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{bus.eta} min</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Users className="w-4 h-4" />
                          <span>{bus.seats}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Stats */}
            <div className="relative group rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <h3 className="relative font-bold text-lg text-slate-900 dark:text-white mb-4">Today's Stats</h3>
              <div className="relative space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Trips Completed</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">127</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                  <span className="text-sm text-slate-600 dark:text-slate-400">On-Time Rate</span>
                  <span className="text-xl font-bold text-emerald-500">94%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Avg Wait Time</span>
                  <span className="text-xl font-bold text-blue-500">6m</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="relative group rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <h3 className="relative font-bold text-lg mb-6 flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Quick Actions
              </h3>
              <div className="relative space-y-3">
                <Link href="/client-portal/track-bus" className="block">
                  <div className="group/item relative overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-750 p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-blue-500/50 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform duration-300">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">Track Bus</span>
                    </div>
                  </div>
                </Link>
                <Link href="/client-portal/book-ticket" className="block">
                  <div className="group/item relative overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-750 p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-purple-500/50 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform duration-300">
                        <Ticket className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">Book Ticket</span>
                    </div>
                  </div>
                </Link>
                <Link href="/client-portal/my-tickets" className="block">
                  <div className="group/item relative overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-750 p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-emerald-500/50 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-blue-500/0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform duration-300">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">My Tickets</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Upcoming Trips */}
            <div className="relative group rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <h3 className="relative font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-blue-500" />
                Upcoming Trips
              </h3>
              <div className="relative space-y-3">
                {upcomingTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="group p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-750 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-purple-400/5 to-pink-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{trip.date}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{trip.route}</p>
                      </div>
                      <span className="px-2 py-1 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium shadow-lg shadow-blue-500/30">
                        {trip.ticketId}
                      </span>
                    </div>
                    <div className="relative flex items-center gap-2 text-sm mb-3">
                      <span className="text-slate-900 dark:text-white font-medium">{trip.from}</span>
                      <div className="flex-1 h-px bg-slate-300 dark:bg-slate-600 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <ArrowRight className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <span className="text-slate-900 dark:text-white font-medium">{trip.to}</span>
                    </div>
                    <Link href={`/client-portal/my-tickets/${trip.ticketId}`}>
                      <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        View Ticket
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
