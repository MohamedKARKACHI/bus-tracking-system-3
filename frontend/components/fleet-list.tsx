"use client"

import { useState, useEffect } from "react"
import { Bus, Wrench, Zap, Calendar, Loader2 } from "lucide-react"
import { GlassCard } from "./ui/glass-card"
import type { Bus as BusType } from "@/types"
import { fetchWithAuth } from "@/lib/api-client"

export function FleetList() {
  const [fleet, setFleet] = useState<BusType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFleet()
  }, [])

  const fetchFleet = async () => {
    try {
      setLoading(true)
      const response = await fetchWithAuth('/api/buses')

      if (!response.ok) {
        throw new Error('Failed to fetch fleet data')
      }

      const data = await response.json()
      setFleet(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching fleet:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <GlassCard className="p-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading fleet data...</span>
      </GlassCard>
    )
  }

  if (error) {
    return (
      <GlassCard className="p-6">
        <div className="text-center text-red-500">
          <p className="font-semibold">Error loading fleet data</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchFleet}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
          >
            Retry
          </button>
        </div>
      </GlassCard>
    )
  }
  return (
    <GlassCard>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Bus ID</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Registration</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Model</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Year</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Mileage</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Next Service</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fleet.map((bus) => (
              <tr key={bus.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Bus className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-primary dark:text-cyan-400">BUS-{bus.id}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{bus.registration_number}</td>
                <td className="p-4 text-sm text-foreground">{bus.model}</td>
                <td className="p-4 text-sm text-muted-foreground">{bus.year}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${bus.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                      }`}
                  >
                    {bus.status === "active" ? <Zap className="h-3 w-3" /> : <Wrench className="h-3 w-3" />}
                    {bus.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{bus.mileage ? `${bus.mileage.toLocaleString()} km` : 'N/A'}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {bus.next_service_date || 'Not scheduled'}
                  </div>
                </td>
                <td className="p-4">
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
