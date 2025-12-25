"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { GlassCard } from "@/components/ui/glass-card"
import {
  Bus,
  Search,
  Filter,
  Plus,
  MapPin,
  User,
  Calendar,
  Wrench,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Fuel,
  Activity
} from "lucide-react"

export default function FleetPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const fleetStats = [
    { label: "Total Buses", value: "45", icon: Bus, color: "from-blue-500 to-cyan-500", change: "+3" },
    { label: "Active", value: "38", icon: CheckCircle, color: "from-emerald-500 to-green-500", change: "+5" },
    { label: "Maintenance", value: "5", icon: Wrench, color: "from-amber-500 to-orange-500", change: "-2" },
    { label: "Out of Service", value: "2", icon: AlertTriangle, color: "from-red-500 to-rose-500", change: "0" },
  ]

  const buses = [
    {
      id: "BUS-101",
      number: "101",
      route: "Downtown Express",
      driver: "John Smith",
      status: "active",
      location: "Main Street Station",
      passengers: 42,
      capacity: 50,
      fuel: 85,
      lastMaintenance: "2024-11-15",
      nextMaintenance: "2025-01-15",
      mileage: "45,230 km"
    },
    {
      id: "BUS-203",
      number: "203",
      route: "Airport Shuttle",
      driver: "Sarah Johnson",
      status: "active",
      location: "Terminal 2",
      passengers: 28,
      capacity: 40,
      fuel: 62,
      lastMaintenance: "2024-11-20",
      nextMaintenance: "2025-01-20",
      mileage: "38,450 km"
    },
    {
      id: "BUS-156",
      number: "156",
      route: "University Loop",
      driver: "Mike Davis",
      status: "active",
      location: "Campus North",
      passengers: 38,
      capacity: 45,
      fuel: 71,
      lastMaintenance: "2024-11-10",
      nextMaintenance: "2025-01-10",
      mileage: "52,100 km"
    },
    {
      id: "BUS-089",
      number: "089",
      route: "Beach Line",
      driver: null,
      status: "maintenance",
      location: "Service Center",
      passengers: 0,
      capacity: 50,
      fuel: 45,
      lastMaintenance: "2024-12-01",
      nextMaintenance: "2024-12-05",
      mileage: "67,890 km"
    },
    {
      id: "BUS-234",
      number: "234",
      route: "Industrial Zone",
      driver: "Emma Wilson",
      status: "active",
      location: "Factory District",
      passengers: 15,
      capacity: 40,
      fuel: 90,
      lastMaintenance: "2024-11-25",
      nextMaintenance: "2025-01-25",
      mileage: "29,340 km"
    },
    {
      id: "BUS-312",
      number: "312",
      route: "City Center",
      driver: null,
      status: "out-of-service",
      location: "Depot",
      passengers: 0,
      capacity: 45,
      fuel: 0,
      lastMaintenance: "2024-10-15",
      nextMaintenance: "TBD",
      mileage: "89,450 km"
    },
  ]

  const filteredBuses = buses.filter(bus => {
    const matchesSearch = bus.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bus.driver && bus.driver.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || bus.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
      case "maintenance": return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
      case "out-of-service": return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
      default: return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
    }
  }

  const getFuelColor = (fuel: number) => {
    if (fuel > 70) return "bg-emerald-500"
    if (fuel > 30) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Fleet Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Monitor and manage your entire bus fleet in real-time
              </p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
              <Plus className="h-5 w-5" />
              Add New Bus
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {fleetStats.map((stat, index) => (
              <GlassCard key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <GlassCard className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by bus number, route, or driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white font-medium"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="out-of-service">Out of Service</option>
              </select>
              <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-slate-900 dark:text-white">
                <Filter className="h-5 w-5" />
                More Filters
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBuses.map((bus) => (
            <GlassCard key={bus.id} className="p-6 hover:shadow-xl transition-shadow">
              {/* Bus Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Bus className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Bus {bus.number}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{bus.id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(bus.status)}`}>
                  {bus.status.replace("-", " ").toUpperCase()}
                </span>
              </div>

              {/* Route Info */}
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                  {bus.route}
                </p>
              </div>

              {/* Details Grid */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">Location:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{bus.location}</span>
                </div>
                {bus.driver && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600 dark:text-slate-400">Driver:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{bus.driver}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">Passengers:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {bus.passengers}/{bus.capacity}
                  </span>
                  <div className="flex-1 ml-2">
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${(bus.passengers / bus.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fuel and Mileage */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Fuel className="h-4 w-4 text-slate-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">Fuel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${getFuelColor(bus.fuel)}`} style={{ width: `${bus.fuel}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{bus.fuel}%</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-slate-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">Mileage</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{bus.mileage}</p>
                </div>
              </div>

              {/* Maintenance Info */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Wrench className="h-3 w-3" />
                  <span>Next Maintenance: <strong className="text-slate-900 dark:text-white">{bus.nextMaintenance}</strong></span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* No Results */}
        {filteredBuses.length === 0 && (
          <GlassCard className="p-12 text-center">
            <Bus className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No buses found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filters</p>
          </GlassCard>
        )}
      </div>
    </DashboardShell>
  )
}
