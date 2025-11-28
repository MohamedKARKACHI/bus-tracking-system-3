"use client"

import { Bus, MapPin, Clock, TrendingUp } from "lucide-react"
import { GlassCard } from "./ui/glass-card"

const buses = [
  {
    id: "BUS-101",
    route: "Route 101",
    location: "Downtown Terminal",
    speed: "45 km/h",
    status: "active",
    delay: "On Time",
  },
  {
    id: "BUS-202",
    route: "Route 202",
    location: "Central Station",
    speed: "38 km/h",
    status: "active",
    delay: "2 min late",
  },
  { id: "BUS-303", route: "Route 303", location: "North Plaza", speed: "52 km/h", status: "active", delay: "On Time" },
  { id: "BUS-404", route: "Route 404", location: "Airport Road", speed: "0 km/h", status: "stopped", delay: "Stopped" },
  {
    id: "BUS-505",
    route: "Route 505",
    location: "South Terminal",
    speed: "41 km/h",
    status: "active",
    delay: "On Time",
  },
]

export function ActiveBusesList() {
  return (
    <GlassCard className="h-[600px] overflow-hidden flex flex-col">
      <div className="p-6 border-b border-border/50">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Bus className="h-5 w-5 text-primary" />
          Active Buses
        </h3>
        <p className="text-sm text-muted-foreground mt-1">15 buses currently on routes</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {buses.map((bus) => (
          <div
            key={bus.id}
            className="p-4 rounded-xl bg-card/30 border border-border/30 hover:border-primary/30 hover:bg-card/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center ${bus.status === "active" ? "bg-primary/20" : "bg-muted/20"}`}
                >
                  <Bus className={`h-4 w-4 ${bus.status === "active" ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{bus.id}</p>
                  <p className="text-xs text-muted-foreground">{bus.route}</p>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${bus.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}
              >
                {bus.status === "active" ? "● Active" : "● Stopped"}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{bus.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{bus.speed}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span className={bus.delay === "On Time" ? "text-emerald-400" : "text-amber-400"}>{bus.delay}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
