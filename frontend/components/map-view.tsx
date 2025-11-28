"use client"

import { BusMap } from "./bus-map"

export function MapView({ className = "", fullScreen = false }: { className?: string; fullScreen?: boolean }) {
  return <BusMap fullScreen={fullScreen} showControls={false} height={fullScreen ? "100%" : "400px"} />
}
