"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { LiveMapFull } from "@/components/live-map-full"
import { ActiveBusesList } from "@/components/active-buses-list"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, RefreshCw, Bus, Navigation, Clock } from "lucide-react"

export default function TrackingPage() {
  const [selectedRoute, setSelectedRoute] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const stats = [
    { label: "Active Buses", value: "28", icon: Bus, color: "text-emerald-500" },
    { label: "In Transit", value: "22", icon: Navigation, color: "text-blue-500" },
    { label: "At Stops", value: "6", icon: Clock, color: "text-cyan-500" }
  ]

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 min-h-screen">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Fleet Tracking</h1>
              <p className="text-muted-foreground mt-1">Real-time GPS monitoring of all active buses</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <GlassCard key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by bus number, driver, or route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="bg-card border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
            >
              <option value="all">All Routes</option>
              <option value="1">City Center - Airport</option>
              <option value="2">North Terminal - University</option>
              <option value="3">Downtown - Beach</option>
              <option value="4">Shopping Mall - Industrial Area</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Map and List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          <div className="lg:col-span-2 min-h-[600px]">
            <LiveMapFull />
          </div>
          <div className="lg:col-span-1">
            <ActiveBusesList />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
