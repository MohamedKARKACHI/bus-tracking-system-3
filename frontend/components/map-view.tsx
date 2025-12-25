"use client"

import { MapboxMap } from "./mapbox-map"

export function MapView({ className = "", fullScreen = false }: { className?: string; fullScreen?: boolean }) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <MapboxMap fullScreen={fullScreen} showControls={fullScreen} zoom={fullScreen ? 12 : 11} />
    </div>
  )
}
