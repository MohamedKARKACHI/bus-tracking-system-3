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
        centerLat={centerOn?.lat || 32.0}
        centerLng={centerOn?.lng || -6.5}
        zoom={driverMode ? 13 : 6}
      />
    </div>
  )
}
