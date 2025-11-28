"use client"

import { GlassCard } from "@/components/ui/glass-card"

export function FleetStatus() {
  return (
    <GlassCard>
      <h3 className="font-semibold text-lg mb-4 text-foreground">Fleet Distribution</h3>

      <div className="space-y-4">
        {/* Progress Item */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">In Operation</span>
            <span className="text-primary dark:text-cyan-400 font-bold">85%</span>
          </div>
          <div className="h-2.5 bg-slate-800/50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-cyan-400 w-[85%] shadow-[0_0_12px_var(--color-primary)] rounded-full" />
          </div>
        </div>

        {/* Progress Item */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">In Maintenance</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">10%</span>
          </div>
          <div className="h-2.5 bg-slate-800/50 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-[10%] shadow-[0_0_12px_rgba(251,146,60,0.5)] rounded-full" />
          </div>
        </div>

        {/* Progress Item */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Idle / Parked</span>
            <span className="text-slate-600 dark:text-slate-400 font-bold">5%</span>
          </div>
          <div className="h-2.5 bg-slate-800/50 rounded-full overflow-hidden">
            <div className="h-full bg-slate-600 w-[5%] rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 text-center hover:border-primary/40 transition-all">
          <span className="block text-2xl font-bold text-primary">12</span>
          <span className="text-xs text-muted-foreground">Routes Active</span>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 text-center hover:border-cyan-500/40 transition-all">
          <span className="block text-2xl font-bold text-cyan-400">42</span>
          <span className="text-xs text-muted-foreground">Drivers Online</span>
        </div>
      </div>
    </GlassCard>
  )
}
