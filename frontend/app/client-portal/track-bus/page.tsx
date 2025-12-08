"use client"

import { useState, useEffect } from "react"
import SimulationMap from "@/components/modern-map"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Clock, Navigation, Bus, Users, ArrowRight, TrendingUp, Ticket, Filter, RefreshCw } from "lucide-react"
import { fetchWithAuth } from "@/lib/api-client"

export default function ClientTrackingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [routes, setRoutes] = useState<any[]>([])
  const [buses, setBuses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [routesRes, busesRes] = await Promise.all([
        fetchWithAuth('/api/routes'),
        fetchWithAuth('/api/buses')
      ])

      if (routesRes.ok && busesRes.ok) {
        const routesData = await routesRes.json()
        const busesData = await busesRes.json()
        setRoutes(routesData)
        setBuses(busesData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeBuses = buses.filter(bus => bus.status === 'active')
  const nearbyBuses = activeBuses.slice(0, 4) // Simulating nearby buses for now

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
              Track Your Bus
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Real-time location and arrival estimates
            </p>
          </div>
          <div className="flex gap-3">
            <div className="group px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Buses</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activeBuses.length}</div>
            </div>
            <div className="group px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Routes</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{routes.filter(r => r.status === 'active').length}</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300" />
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search routes, buses, or destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-lg focus:shadow-xl transition-all duration-300"
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-250px)] min-h-[600px]">
          {/* Map Section */}
          <div className="xl:col-span-2 h-full flex flex-col gap-6">
            {/* Map */}
            <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
              <SimulationMap
                height="100%"
                showControls={true}
                selectedRouteId={selectedRoute}
              />

              {/* Route Info Overlay */}
              {selectedRoute && (
                <div className="absolute top-4 left-4 right-16 z-10">
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 max-w-md">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {routes.find(r => r.id === selectedRoute)?.name}
                      </h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedRoute(null)}
                        className="h-6 w-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                      >
                        ×
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Bus className="w-4 h-4" />
                        {buses.filter(b => b.routeId === selectedRoute).length} Buses
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Every {routes.find(r => r.id === selectedRoute)?.frequency || '15 min'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6 h-full overflow-hidden">
            {/* Routes List */}
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Active Routes
                </h3>
                <Button variant="ghost" size="icon" onClick={fetchData} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {filteredRoutes.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-300 border-2 ${selectedRoute === route.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md"
                      : "bg-slate-50 dark:bg-slate-800/50 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: route.color || '#3b82f6' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {route.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                            {route.code}
                          </span>
                          <span>•</span>
                          <span>{route.distance}</span>
                        </div>
                      </div>
                      {selectedRoute === route.id && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Nearby Buses */}
            <div className="h-1/3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Bus className="w-5 h-5 text-purple-500" />
                  Nearby Buses
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {nearbyBuses.map((bus) => (
                  <div
                    key={bus.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700">
                        <Bus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {bus.busNumber}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {routes.find(r => r.id === bus.routeId)?.name || 'Unknown Route'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                        On Time
                      </div>
                    </div>
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
