"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Maximize2 } from "lucide-react"
import Link from "next/link"
import { MapboxMap } from "./mapbox-map"

export function LiveMap() {
  return (
    <GlassCard className="h-[400px] lg:h-[500px] p-0 flex flex-col relative overflow-hidden group">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-background/80 to-transparent pointer-events-none">
        <h3 className="text-lg font-semibold text-foreground pl-2">Live Fleet Tracking</h3>
        <div className="flex gap-2 pointer-events-auto">
          <Link
            href="/tracking"
            className="p-2 rounded-lg bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card border border-border backdrop-blur-md transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Mapbox Map */}
      <MapboxMap fullScreen={false} showControls={false} zoom={11} />
    </GlassCard>
  )
}
