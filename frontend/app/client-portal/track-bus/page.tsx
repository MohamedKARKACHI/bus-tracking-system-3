"use client"

import { useState } from "react"
import { BusMap } from "@/components/bus-map"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Clock, Navigation, Bus, Users, ArrowRight, TrendingUp, Ticket } from "lucide-react"

export default function ClientTrackingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [highlightedBus, setHighlightedBus] = useState<string | null>(null)

  const routes = [
    { id: "1", name: "Downtown Express", color: "bg-blue-500", buses: 3 },
    { id: "2", name: "Airport Shuttle", color: "bg-purple-500", buses: 2 },
    { id: "3", name: "University Line", color: "bg-emerald-500", buses: 4 },
    { id: "4", name: "Beach Route", color: "bg-orange-500", buses: 2 }
  ]

  const nearbyBuses = [
    { id: "#101", route: "Downtown Express", eta: 5, distance: "0.8 km", seats: 12, status: "on-time", color: "blue" },
    { id: "#205", route: "Airport Shuttle", eta: 12, distance: "2.3 km", seats: 3, status: "delayed", color: "purple" },
    { id: "#308", route: "University Line", eta: 8, distance: "1.5 km", seats: 20, status: "on-time", color: "emerald" },
    { id: "#412", route: "Beach Route", eta: 15, distance: "3.2 km", seats: 8, status: "on-time", color: "orange" }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">Track Your Bus</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Real-time location and arrival estimates</p>
          </div>
          <div className="flex gap-3">
            <div className="group px-4 py-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Active Buses</div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">11</div>
            </div>
            <div className="group px-4 py-2 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105">
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Available Seats</div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">43</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300" />
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 dark:text-blue-400" />
            <Input
              type="text"
              placeholder="Search routes, buses, or destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-lg focus:shadow-xl focus:shadow-blue-500/10 transition-all duration-300"
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500" />
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
                <BusMap 
                  height="500px" 
                  showControls={true}
                  highlightBus={highlightedBus}
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
                {nearbyBuses.map((bus) => (
                  <div
                    key={bus.id}
                    onClick={() => setHighlightedBus(bus.id)}
                    className={`group cursor-pointer rounded-xl border transition-all duration-300 relative overflow-hidden ${
                      highlightedBus === bus.id
                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/20 shadow-xl shadow-blue-500/30 scale-[1.03]"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-blue-500/10"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-purple-400/5 to-pink-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="p-4 relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-${bus.color}-500 flex items-center justify-center`}>
                            <Bus className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{bus.id}</div>
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
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                          Book
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Routes */}
            <div className="relative group rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <h3 className="relative font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Active Routes
              </h3>
              <div className="relative space-y-3">
                {routes.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRoute(route.id)}
                    className={`relative w-full text-left p-3 rounded-xl transition-all duration-300 overflow-hidden ${
                      selectedRoute === route.id
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02]"
                        : "bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-750 hover:shadow-md"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-purple-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${route.color}`} />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-white text-sm">{route.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{route.buses} buses active</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
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

            {/* Upcoming Trips */}
            <div className="relative group rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <h3 className="relative font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-blue-500" />
                Your Trips
              </h3>
              <div className="relative space-y-3">
                <div className="group p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-750 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Today, 2:30 PM</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-500 text-white text-xs font-medium">TCK-001</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Downtown Express</div>
                </div>
                <div className="group p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-750 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Tomorrow, 9:00 AM</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-500 text-white text-xs font-medium">TCK-002</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Airport Shuttle</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
