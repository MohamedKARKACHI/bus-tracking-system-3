"use client"

import { Zap } from "lucide-react"
import { GlassCard } from "./ui/glass-card"
import { MapboxMap } from "./mapbox-map"

export function LiveMapFull() {
  return (
    <GlassCard className="h-full relative overflow-hidden group p-0 min-h-[500px]">
      <MapboxMap fullScreen={true} showControls={true} zoom={12} />

      <div className="absolute top-20 left-4 flex flex-col gap-2 z-10">
        <GlassCard className="p-3 !bg-card/90 !backdrop-blur-md !border-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Live Tracking</p>
              <p className="text-lg font-bold text-foreground">Active</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </GlassCard>
  )
}
