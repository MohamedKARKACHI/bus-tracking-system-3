"use client"

import { MapboxMap } from "./mapbox-map"

interface BusMapProps {
  height?: string
  showControls?: boolean
  driverMode?: boolean
  highlightBus?: string
  centerOn?: { lat: number; lng: number }
  className?: string
}

export function BusMap({
  height = "100%",
  showControls = true,
  driverMode = false,
  highlightBus,
  centerOn,
  className = "",
}: BusMapProps) {
  return (
    <div className={`relative w-full ${className}`} style={{ height, minHeight: '400px' }}>
      <MapboxMap
        fullScreen={showControls}
        showControls={showControls}
        centerLat={centerOn?.lat || 31.638}
        centerLng={centerOn?.lng || -7.998}
        zoom={driverMode ? 14 : 12}
      />
    </div>
  )
}
