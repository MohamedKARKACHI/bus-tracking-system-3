"use client"

import { useState } from "react"
import { BusMap } from "@/components/bus-map"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Clock, Navigation, Bus, Filter } from "lucide-react"

export default function ClientTrackingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [highlightedBus, setHighlightedBus] = useState<string | null>(null)

  const routes = [
    { id: "1", name: "City Center - Airport", buses: 3, status: "Active" },
    { id: "2", name: "North Terminal - University", buses: 2, status: "Active" },
    { id: "3", name: "Downtown - Beach", buses: 4, status: "Active" },
    { id: "4", name: "Shopping Mall - Industrial Area", buses: 2, status: "Limited" }
  ]

  const nearbyBuses = [
    { id: "BUS-001", route: "City Center - Airport", eta: "5 min", distance: "0.8 km", seats: 12 },
    { id: "BUS-002", route: "North Terminal - University", eta: "12 min", distance: "2.3 km", seats: 8 },
    { id: "BUS-003", route: "Downtown - Beach", eta: "8 min", distance: "1.5 km", seats: 15 }
  ]

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 sm:p-6 lg:px-8 lg:py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Track Your Bus</h1>
            <p className="text-muted-foreground mt-1">Real-time location of buses on your routes</p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by route, bus number, or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Flexible */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:p-6 overflow-hidden">
        {/* Map Section - Full Height */}
        <div className="lg:col-span-2 h-full min-h-[500px]">
          <BusMap 
            height="100%" 
            showControls={true}
            highlightBus={highlightedBus}
          />
        </div>

        {/* Sidebar - Scrollable */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto max-h-full">
          {/* Nearby Buses */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Nearby Buses</h3>
            </div>
            <div className="space-y-3">
              {nearbyBuses.map((bus) => (
                <div
                  key={bus.id}
                  onClick={() => setHighlightedBus(bus.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    highlightedBus === bus.id
                      ? "bg-primary/10 border-primary"
                      : "bg-muted/30 border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bus className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">{bus.id}</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
                      {bus.seats} seats
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{bus.route}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{bus.eta}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Navigation className="h-3 w-3" />
                      <span>{bus.distance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Active Routes */}
          <GlassCard className="p-6">
            <h3 className="font-semibold text-lg mb-4">Active Routes</h3>
            <div className="space-y-2">
              {routes.map((route) => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedRoute === route.id
                      ? "bg-primary/10 border-primary"
                      : "bg-muted/30 border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{route.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        route.status === "Active"
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {route.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{route.buses} buses running</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
