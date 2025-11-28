"use client"

import { TrendingUp, Activity, BarChart3, PieChart } from "lucide-react"
import { GlassCard } from "./ui/glass-card"

export function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Revenue Trend
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Monthly revenue overview</p>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-border/50 rounded-lg">
            <p className="text-muted-foreground text-sm">Chart visualization coming soon</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-400" />
                Fleet Utilization
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Average daily usage</p>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-border/50 rounded-lg">
            <p className="text-muted-foreground text-sm">Chart visualization coming soon</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                Route Performance
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Performance by route</p>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-border/50 rounded-lg">
            <p className="text-muted-foreground text-sm">Chart visualization coming soon</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <PieChart className="h-5 w-5 text-amber-400" />
                Distribution
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Fleet distribution analysis</p>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-border/50 rounded-lg">
            <p className="text-muted-foreground text-sm">Chart visualization coming soon</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
