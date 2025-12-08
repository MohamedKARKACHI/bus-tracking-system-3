"use client"

import { useState, useEffect } from "react"
import { User, Phone, Mail, Clock, Loader2 } from "lucide-react"
import { GlassCard } from "./ui/glass-card"
import type { Driver } from "@/types"
import { fetchWithAuth } from "@/lib/api-client"

export function DriversTable() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDrivers()
  }, [])

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      const response = await fetchWithAuth('/api/drivers')

      if (!response.ok) {
        throw new Error('Failed to fetch drivers')
      }

      const data = await response.json()
      setDrivers(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching drivers:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <GlassCard className="p-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading drivers...</span>
      </GlassCard>
    )
  }

  if (error) {
    return (
      <GlassCard className="p-6">
        <div className="text-center text-red-500">
          <p className="font-semibold">Error loading drivers</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchDrivers}
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
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Driver</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Contact</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Current Bus</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Route</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Hours Today</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{driver.full_name}</p>
                      <p className="text-xs text-muted-foreground">DRV-{driver.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {driver.phone_number || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {driver.email}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${driver.status === "active"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-muted/20 text-muted-foreground"
                      }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {driver.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-foreground">{driver.current_bus_id ? `BUS-${driver.current_bus_id}` : '-'}</td>
                <td className="p-4 text-sm text-muted-foreground">{driver.current_route_id ? `Route ${driver.current_route_id}` : '-'}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    N/A
                  </div>
                </td>
                <td className="p-4">
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
