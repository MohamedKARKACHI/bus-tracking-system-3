"use client"

import { Users, UserCheck, UserX, Clock } from "lucide-react"
import { GlassCard } from "./ui/glass-card"

const stats = [
  { label: "Total Drivers", value: "48", icon: Users, color: "text-primary" },
  { label: "On Duty", value: "32", icon: UserCheck, color: "text-emerald-400" },
  { label: "Off Duty", value: "16", icon: UserX, color: "text-muted-foreground" },
  { label: "Avg. Hours/Day", value: "8.5", icon: Clock, color: "text-cyan-400" },
]

export function DriversStats() {
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
