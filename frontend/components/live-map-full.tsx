"use client"

import { BusMap } from "./bus-map"
import { Zap } from "lucide-react"
import { GlassCard } from "./ui/glass-card"

export function LiveMapFull() {
  return (
    <div className="relative h-[600px]">
      <BusMap height="600px" showControls={true} />

      <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
        <GlassCard className="p-3 !bg-card/90 !backdrop-blur-md !border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Units</p>
              <p className="text-lg font-bold text-foreground">15</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
