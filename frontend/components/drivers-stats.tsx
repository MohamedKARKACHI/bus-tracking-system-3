"use client"

import { useEffect, useState } from "react"
import { Users, UserCheck, Shield, UserCircle } from "lucide-react"
import { GlassCard } from "./ui/glass-card"
import { fetchWithAuth } from "@/lib/api-client"

export function DriversStats() {
  const [stats, setStats] = useState([
    { label: "Total Users", value: "-", icon: Users, color: "text-primary" },
    { label: "Drivers", value: "-", icon: UserCircle, color: "text-blue-400" },
    { label: "Clients", value: "-", icon: UserCheck, color: "text-emerald-400" },
    { label: "Admins", value: "-", icon: Shield, color: "text-purple-400" },
  ])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetchWithAuth('/api/users')
      if (response.ok) {
        const users: any[] = await response.json()
        const total = users.length
        const drivers = users.filter(u => u.role === 'driver').length
        const clients = users.filter(u => u.role === 'client').length
        const admins = users.filter(u => u.role === 'admin').length

        setStats([
          { label: "Total Users", value: total.toString(), icon: Users, color: "text-primary" },
          { label: "Drivers", value: drivers.toString(), icon: UserCircle, color: "text-blue-400" },
          { label: "Clients", value: clients.toString(), icon: UserCheck, color: "text-emerald-400" },
          { label: "Admins", value: admins.toString(), icon: Shield, color: "text-purple-400" },
        ])
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <GlassCard key={stat.label}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-xl bg-card/50 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
