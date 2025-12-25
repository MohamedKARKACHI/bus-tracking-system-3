"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { ArrowUpRight, Camera, CheckCircle2, AlertOctagon } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "anpr",
    title: "Bus #1024 Detected",
    desc: "Station Entry - Central Hub",
    time: "2 min ago",
    icon: Camera,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: 2,
    type: "alert",
    title: "Route Deviation Alert",
    desc: "Bus #089 left designated route",
    time: "14 min ago",
    icon: AlertOctagon,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    id: 3,
    type: "success",
    title: "Shift Completed",
    desc: "Driver Mike R. ended shift",
    time: "45 min ago",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    id: 4,
    type: "anpr",
    title: "Bus #1024 Detected",
    desc: "Checkpoint A2 - Main St",
    time: "1h ago",
    icon: Camera,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: 5,
    type: "info",
    title: "Maintenance Scheduled",
    desc: "Bus #055 due for inspection",
    time: "2h ago",
    icon: ArrowUpRight,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
]

export function RecentActivity() {
  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Live Feed</h3>
        <button className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">View All</button>
      </div>

      <div className="space-y-6 relative">
        {/* Timeline Line */}
        

        {activities.map((item) => (
          <div key={item.id} className="relative pl-12 group">
            {/* Timeline Dot */}
            <div
              className={`absolute left-0 top-1 h-10 w-10 rounded-full border-2 border-white/10 flex items-center justify-center ${item.bg} transition-transform group-hover:scale-110`}
            >
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-medium group-hover:text-primary transition-colors text-slate-800 dark:text-white">
                {item.title}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">{item.desc}</span>
              <span className="text-[10px] text-muted-foreground/70 mt-1 font-mono">{item.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_var(--color-emerald-400)]" />
          <span className="text-xs text-emerald-300">
            System running optimally. No major incidents in the last 24 hours.
          </span>
        </div>
      </div>
    </GlassCard>
  )
}
