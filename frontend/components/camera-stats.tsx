"use client"

import { Video, CheckCircle2, AlertTriangle, Activity } from "lucide-react"
import { GlassCard } from "./ui/glass-card"

const stats = [
  { label: "Total Cameras", value: "24", icon: Video, color: "text-primary" },
  { label: "Online", value: "22", icon: CheckCircle2, color: "text-emerald-400" },
  { label: "Offline", value: "2", icon: AlertTriangle, color: "text-amber-400" },
  { label: "Detections Today", value: "1,847", icon: Activity, color: "text-cyan-400" },
]

export function CameraStats() {
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
