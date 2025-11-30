"use client"

import { useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import {
  Bus,
  MapPin,
  Users,
  Gauge,
  Clock,
  X,
  Route,
  Lock,
  Square,
  ArrowRight,
  Plus,
  Minus,
  Maximize,
  Minimize,
  Navigation,
  Locate,
} from "lucide-react"

const MAPBOX_TOKEN = "pk.eyJ1Ijoic2ltbzMzIiwiYSI6ImNtaWRwcnc2czA3bDYybXNiaGsxc2kxN2oifQ.vIT5iMLrm07zHJkrSqftHA"

interface BusData {
  id: string
  name: string
  route: string
  routeColor: string
  coordinates: [number, number]
  status: "moving" | "stopped" | "in-station"
  speed: number
  heading: number
  passengers: number
  nextStop: string
  eta: string
}

interface StationData {
  id: string
  name: string
  coordinates: [number, number]
  type: "major" | "regular" | "terminal"
  status: "active" | "locked" | "busy"
  routes: string[]
  labelColor: "blue" | "green" | "orange" | "purple" | "red"
}

interface MapboxMapProps {
  className?: string
  fullScreen?: boolean
  showControls?: boolean
  centerLat?: number
  centerLng?: number
  zoom?: number
}

const stations: StationData[] = [
  {
    id: "s1",
    name: "Palmeraie",
    coordinates: [31.6695, -7.9811],
    type: "terminal",
    status: "active",
    routes: ["Route 1"],
    labelColor: "orange",
  },
  {
    id: "s2",
    name: "Sorelle Garden",
    coordinates: [31.65, -7.99],
    type: "major",
    status: "active",
    routes: ["Route 1", "Route 2"],
    labelColor: "green",
  },
  {
    id: "s3",
    name: "Route 3",
    coordinates: [31.645, -8.01],
    type: "regular",
    status: "active",
    routes: ["Route 3"],
    labelColor: "green",
  },
  {
    id: "s4",
    name: "Carré Eden",
    coordinates: [31.638, -8.022],
    type: "major",
    status: "locked",
    routes: ["Route 1"],
    labelColor: "blue",
  },
  {
    id: "s5",
    name: "Marjane Gueliz",
    coordinates: [31.634, -8.015],
    type: "regular",
    status: "active",
    routes: ["Route 2"],
    labelColor: "blue",
  },
  {
    id: "s6",
    name: "Bab Doukkala",
    coordinates: [31.64, -8.0],
    type: "major",
    status: "busy",
    routes: ["Route 1", "Route 3"],
    labelColor: "orange",
  },
  {
    id: "s7",
    name: "Cyber Park",
    coordinates: [31.635, -7.99],
    type: "regular",
    status: "active",
    routes: ["Route 2"],
    labelColor: "orange",
  },
  {
    id: "s8",
    name: "Gueliz Center",
    coordinates: [31.63, -8.01],
    type: "regular",
    status: "active",
    routes: ["Route 2"],
    labelColor: "blue",
  },
  {
    id: "s9",
    name: "Ben Youssef",
    coordinates: [31.637, -7.982],
    type: "major",
    status: "active",
    routes: ["Route 1", "Route 2"],
    labelColor: "green",
  },
  {
    id: "s10",
    name: "Place de la",
    coordinates: [31.632, -7.988],
    type: "regular",
    status: "locked",
    routes: ["Route 3"],
    labelColor: "purple",
  },
  {
    id: "s11",
    name: "Kesh",
    coordinates: [31.628, -7.98],
    type: "terminal",
    status: "active",
    routes: ["Route 1"],
    labelColor: "purple",
  },
  {
    id: "s12",
    name: "Theatre Royal",
    coordinates: [31.624, -8.008],
    type: "major",
    status: "active",
    routes: ["Route 2"],
    labelColor: "orange",
  },
  {
    id: "s13",
    name: "Koutoubia",
    coordinates: [31.628, -7.993],
    type: "major",
    status: "active",
    routes: ["Route 1", "Route 3"],
    labelColor: "purple",
  },
  {
    id: "s14",
    name: "Jemaa el Fna",
    coordinates: [31.6258, -7.9891],
    type: "terminal",
    status: "busy",
    routes: ["Route 1", "Route 2", "Route 3"],
    labelColor: "green",
  },
  {
    id: "s15",
    name: "Hivernage Hotel",
    coordinates: [31.618, -8.018],
    type: "major",
    status: "active",
    routes: ["Route 2"],
    labelColor: "blue",
  },
  {
    id: "s16",
    name: "Marrakech Train Sta",
    coordinates: [31.622, -8.002],
    type: "terminal",
    status: "active",
    routes: ["Route 1", "Route 2", "Route 3"],
    labelColor: "purple",
  },
]

// Simulated bus data
const initialBuses: BusData[] = [
  {
    id: "BUS-101",
    name: "Express 101",
    route: "Route 1",
    routeColor: "#8b5cf6",
    coordinates: [31.648, -7.992],
    status: "moving",
    speed: 45,
    heading: 135,
    passengers: 32,
    nextStop: "Bab Doukkala",
    eta: "3 min",
  },
  {
    id: "BUS-202",
    name: "City Line 202",
    route: "Route 2",
    routeColor: "#22c55e",
    coordinates: [31.633, -7.987],
    status: "moving",
    speed: 38,
    heading: 200,
    passengers: 45,
    nextStop: "Ben Youssef",
    eta: "5 min",
  },
  {
    id: "BUS-303",
    name: "Metro 303",
    route: "Route 3",
    routeColor: "#06b6d4",
    coordinates: [31.642, -8.005],
    status: "in-station",
    speed: 0,
    heading: 90,
    passengers: 28,
    nextStop: "Koutoubia",
    eta: "8 min",
  },
  {
    id: "BUS-104",
    name: "Express 104",
    route: "Route 1",
    routeColor: "#8b5cf6",
    coordinates: [31.626, -7.991],
    status: "stopped",
    speed: 0,
    heading: 45,
    passengers: 15,
    nextStop: "Train Station",
    eta: "12 min",
  },
]

// Route paths
const routes = [
  {
    id: "route-1",
    name: "Route 1",
    color: "#8b5cf6",
    coordinates: [
      [31.6695, -7.9811],
      [31.65, -7.99],
      [31.64, -8.0],
      [31.637, -7.982],
      [31.6258, -7.9891],
      [31.628, -7.993],
      [31.622, -8.002],
    ] as [number, number][],
  },
  {
    id: "route-2",
    name: "Route 2",
    color: "#22c55e",
    coordinates: [
      [31.65, -7.99],
      [31.635, -7.99],
      [31.637, -7.982],
      [31.6258, -7.9891],
      [31.624, -8.008],
      [31.618, -8.018],
      [31.622, -8.002],
    ] as [number, number][],
  },
  {
    id: "route-3",
    name: "Route 3",
    color: "#06b6d4",
    coordinates: [
      [31.645, -8.01],
      [31.64, -8.0],
      [31.632, -7.988],
      [31.628, -7.993],
      [31.622, -8.002],
    ] as [number, number][],
  },
]

const labelColors: Record<string, { bg: string; text: string }> = {
  blue: { bg: "#3b82f6", text: "#ffffff" },
  green: { bg: "#22c55e", text: "#ffffff" },
  orange: { bg: "#f97316", text: "#ffffff" },
  purple: { bg: "#8b5cf6", text: "#ffffff" },
  red: { bg: "#ef4444", text: "#ffffff" },
}

const MapControlButtons = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { useMap } = mod

      const ControlButtons = ({
        onFullscreenToggle,
        isFullscreen,
        userLocation,
        setUserLocation,
      }: {
        onFullscreenToggle: () => void
        isFullscreen: boolean
        userLocation: [number, number] | null
        setUserLocation: (loc: [number, number] | null) => void
      }) => {
        const map = useMap()

        const handleZoomIn = () => {
          map.zoomIn()
        }

        const handleZoomOut = () => {
          map.zoomOut()
        }

        const handleMyLocation = () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords
                setUserLocation([latitude, longitude])
                map.flyTo([latitude, longitude], 16, { duration: 1.5 })
              },
              (error) => {
                console.error("Error getting location:", error.message || "Unknown error")
                // User-friendly error messages
                let errorMessage = "Unable to get your location."
                if (error.code === 1) {
                  errorMessage = "Location access denied. Please enable location permissions."
                } else if (error.code === 2) {
                  errorMessage = "Location unavailable. Please try again."
                } else if (error.code === 3) {
                  errorMessage = "Location request timed out. Please try again."
                }
                alert(errorMessage)
              },
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
            )
          } else {
            alert("Geolocation is not supported by your browser")
          }
        }

        const handleChangeLocation = () => {
          // Center on Marrakech with animation
          map.flyTo([31.638, -7.998], 14, { duration: 1.5 })
        }

        return (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-[1000]">
            {/* Zoom Controls */}
            <div className="flex flex-col rounded-lg bg-card/95 backdrop-blur-md border border-border shadow-lg overflow-hidden">
              <button
                onClick={handleZoomIn}
                className="p-2.5 hover:bg-accent text-foreground transition-colors border-b border-border"
                title="Zoom In"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2.5 hover:bg-accent text-foreground transition-colors"
                title="Zoom Out"
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={onFullscreenToggle}
              className="p-2.5 rounded-lg bg-card/95 backdrop-blur-md border border-border shadow-lg hover:bg-accent text-foreground transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>

            {/* My Location Button */}
            <button
              onClick={handleMyLocation}
              className="p-2.5 rounded-lg bg-card/95 backdrop-blur-md border border-border shadow-lg hover:bg-accent text-foreground transition-colors"
              title="My Location"
            >
              <Locate className="w-5 h-5" />
            </button>

            {/* Change Location / Reset View */}
            <button
              onClick={handleChangeLocation}
              className="p-2.5 rounded-lg bg-card/95 backdrop-blur-md border border-border shadow-lg hover:bg-accent text-foreground transition-colors"
              title="Reset to Marrakech"
            >
              <Navigation className="w-5 h-5" />
            </button>
          </div>
        )
      }

      return ControlButtons
    }),
  { ssr: false },
)

// Dynamic imports for react-leaflet
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false })
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false })

// Component to handle map resize
const MapResizeHandler = dynamic(
  () =>
    Promise.all([
      import("react-leaflet"),
      import("react")
    ]).then(([leafletMod, reactMod]) => {
      const { useMap } = leafletMod
      const { useEffect } = reactMod
      return function MapResizeHandler() {
        const map = useMap()
        useEffect(() => {
          const handleResize = () => {
            setTimeout(() => {
              try {
                if (map && map.invalidateSize) {
                  map.invalidateSize()
                }
              } catch (error) {
                console.warn('Map resize error:', error)
              }
            }, 100)
          }
          window.addEventListener('resize', handleResize)
          // Also invalidate on mount
          setTimeout(() => {
            try {
              if (map && map.invalidateSize) {
                map.invalidateSize()
              }
            } catch (error) {
              console.warn('Map initial resize error:', error)
            }
          }, 200)
          return () => {
            window.removeEventListener('resize', handleResize)
          }
        }, [map])
        return null
      }
    }),
  { ssr: false }
)

export function MapboxMap({
  className = "",
  fullScreen = false,
  centerLat = 31.638,
  centerLng = -7.998,
  zoom = 14,
}: MapboxMapProps) {
  const [buses, setBuses] = useState<BusData[]>(initialBuses)
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null)
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null)
  const [mapStyle, setMapStyle] = useState<"dark" | "satellite" | "streets">("dark")
  const [showRoutes, setShowRoutes] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [L, setL] = useState<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [mapKey, setMapKey] = useState(0)

  useEffect(() => {
    setIsClient(true)
    import("leaflet").then((leaflet) => {
      setL(leaflet.default)
      // Fix default icon issue
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
    }).catch((error) => {
      console.error('Failed to load Leaflet:', error)
    })
  }, [])

  // Force map re-render when container size changes
  useEffect(() => {
    if (isClient && L) {
      const timer = setTimeout(() => {
        setMapKey(prev => prev + 1)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isClient, L, isFullscreen])

  const handleFullscreenToggle = useCallback(() => {
    const mapContainer = document.getElementById("map-container")
    if (!mapContainer) return

    if (!isFullscreen) {
      if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Simulate bus movement
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          if (bus.status !== "moving") return bus
          const newLat = bus.coordinates[0] + (Math.random() - 0.5) * 0.0008
          const newLng = bus.coordinates[1] + (Math.random() - 0.5) * 0.0008
          return {
            ...bus,
            coordinates: [newLat, newLng] as [number, number],
            speed: Math.floor(30 + Math.random() * 30),
            passengers: Math.max(0, Math.min(60, bus.passengers + Math.floor(Math.random() * 5) - 2)),
            heading: (bus.heading + (Math.random() - 0.5) * 30 + 360) % 360,
          }
        }),
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const getTileUrl = () => {
    switch (mapStyle) {
      case "satellite":
        return `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`
      case "streets":
        return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`
      default:
        return `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`
    }
  }

  const createStationIcon = (station: StationData) => {
    if (!L) return null
    const colors = labelColors[station.labelColor]
    const iconContent =
      station.status === "locked"
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
        : station.type === "terminal"
          ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`
          : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`

    const html = `
      <div style="display: flex; align-items: center; position: relative;">
        <div style="
          width: 40px; 
          height: 40px; 
          border-radius: 50%; 
          background: white; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 3px solid ${station.status === "busy" ? "#ef4444" : "white"};
        ">
          ${iconContent}
        </div>
        <div style="
          position: absolute;
          left: 48px;
          white-space: nowrap;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          font-family: system-ui, -apple-system, sans-serif;
          background: ${colors.bg};
          color: ${colors.text};
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        ">
          ${station.name}
        </div>
      </div>
    `
    return L.divIcon({
      html,
      className: "station-marker",
      iconSize: [200, 44],
      iconAnchor: [20, 22],
    })
  }

  const createBusIcon = (bus: BusData, isSelected: boolean) => {
    if (!L) return null
    const scale = isSelected ? 1.2 : 1
    const html = `
      <div style="
        width: ${48 * scale}px; 
        height: ${48 * scale}px; 
        border-radius: 50%; 
        border: 4px solid #ef4444; 
        background: white; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        box-shadow: 0 4px 16px rgba(239, 68, 68, 0.5);
        animation: pulse 2s infinite;
      ">
        <div style="
          width: ${24 * scale}px; 
          height: ${24 * scale}px; 
          border-radius: 50%; 
          background: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="${14 * scale}" height="${14 * scale}" viewBox="0 0 24 24" fill="white" style="transform: rotate(${bus.heading}deg)">
            <path d="M3 11l19-9-9 19-2-8-8-2z"/>
          </svg>
        </div>
      </div>
    `
    return L.divIcon({
      html,
      className: "bus-marker",
      iconSize: [48 * scale, 48 * scale],
      iconAnchor: [24 * scale, 24 * scale],
    })
  }

  const createUserLocationIcon = () => {
    if (!L) return null
    const html = `
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #3b82f6;
        border: 4px solid white;
        box-shadow: 0 0 0 2px #3b82f6, 0 4px 12px rgba(59, 130, 246, 0.5);
        animation: userPulse 2s infinite;
      "></div>
    `
    return L.divIcon({
      html,
      className: "user-location-marker",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }

  // Load Leaflet CSS
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      link.crossOrigin = ''
      document.head.appendChild(link)
    }
  }, [])

  if (!isClient || !L) {
    return (
      <div
        className={`relative w-full h-full min-h-[400px] ${className} bg-slate-900 rounded-xl flex items-center justify-center`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      id="map-container"
      className={`relative w-full h-full min-h-[400px] ${className} ${isFullscreen ? "fixed inset-0 z-[9999] min-h-screen" : ""}`}
    >
      <style jsx global>{`
        .leaflet-container { 
          width: 100% !important; 
          height: 100% !important; 
          min-height: 400px;
          border-radius: 0.75rem; 
          z-index: 0; 
          background: #1e293b;
        }
        .station-marker, .bus-marker, .user-location-marker { 
          background: transparent !important; 
          border: none !important; 
        }
        .leaflet-div-icon { 
          background: transparent !important; 
          border: none !important; 
        }
        .leaflet-control-zoom { 
          display: none !important; 
        }
        .leaflet-tile-container img {
          max-width: none !important;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 16px rgba(239, 68, 68, 0.5); }
          50% { transform: scale(1.05); box-shadow: 0 4px 24px rgba(239, 68, 68, 0.7); }
        }
        @keyframes userPulse {
          0%, 100% { box-shadow: 0 0 0 2px #3b82f6, 0 4px 12px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.3), 0 4px 20px rgba(59, 130, 246, 0.7); }
        }
        #map-container:fullscreen { border-radius: 0; }
        #map-container:fullscreen .leaflet-container { border-radius: 0; }
      `}</style>

      <MapContainer
        center={[centerLat, centerLng]}
        zoom={zoom}
        style={{ width: "100%", height: "100%", minHeight: "400px", borderRadius: isFullscreen ? "0" : "0.75rem" }}
        zoomControl={false}
        key={`map-${mapKey}-${centerLat}-${centerLng}-${zoom}`}
        whenReady={(mapEvent) => {
          // Invalidate map size to fix blank areas
          const map = mapEvent.target
          if (map && typeof map.invalidateSize === 'function') {
            setTimeout(() => {
              try {
                map.invalidateSize()
              } catch (error) {
                console.warn('Map invalidateSize error:', error)
              }
            }, 100)
          }
        }}
      >
        <MapResizeHandler />
        <TileLayer
          url={getTileUrl()}
          attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          tileSize={512}
          zoomOffset={-1}
          maxZoom={18}
          minZoom={10}
        />

        {/* Route Lines */}
        {showRoutes &&
          routes.map((route) => (
            <div key={route.id}>
              <Polyline positions={route.coordinates} pathOptions={{ color: route.color, weight: 8, opacity: 0.3 }} />
              <Polyline positions={route.coordinates} pathOptions={{ color: route.color, weight: 4, opacity: 0.9 }} />
            </div>
          ))}

        {/* Station Markers */}
        {stations.map((station) => {
          const icon = createStationIcon(station)
          if (!icon) return null
          return (
            <Marker
              key={station.id}
              position={station.coordinates}
              icon={icon}
              eventHandlers={{
                click: () => {
                  setSelectedStation(station)
                  setSelectedBus(null)
                },
              }}
            />
          )
        })}

        {/* Bus Markers */}
        {buses.map((bus) => {
          const icon = createBusIcon(bus, selectedBus?.id === bus.id)
          if (!icon) return null
          return (
            <Marker
              key={bus.id}
              position={bus.coordinates}
              icon={icon}
              eventHandlers={{
                click: () => {
                  setSelectedBus(bus)
                  setSelectedStation(null)
                },
              }}
            />
          )
        })}

        {userLocation && <Marker position={userLocation} icon={createUserLocationIcon()} />}

        <MapControlButtons
          onFullscreenToggle={handleFullscreenToggle}
          isFullscreen={isFullscreen}
          userLocation={userLocation}
          setUserLocation={setUserLocation}
        />
      </MapContainer>

      {/* Map Controls - Left Side */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-[1000]">
        <div className="flex gap-1 p-1 rounded-lg bg-card/90 backdrop-blur-md border border-border shadow-lg">
          {(["dark", "streets", "satellite"] as const).map((style) => (
            <button
              key={style}
              onClick={() => setMapStyle(style)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                mapStyle === style
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowRoutes(!showRoutes)}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors shadow-lg ${
            showRoutes
              ? "bg-primary text-primary-foreground"
              : "bg-card/90 backdrop-blur-md border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Route className="w-3.5 h-3.5" />
          {showRoutes ? "Hide Routes" : "Show Routes"}
        </button>
      </div>

      {/* Route Legend */}
      <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap z-[1000]">
        {routes.map((route) => (
          <div
            key={route.id}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/90 backdrop-blur-md border border-border shadow-lg"
          >
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }} />
            <span className="text-xs font-medium text-foreground">{route.name}</span>
          </div>
        ))}
      </div>

      {/* Status Panel */}
      <div className="absolute top-4 right-16 z-[1000]">
        <div className="p-3 rounded-lg bg-card/90 backdrop-blur-md border border-border shadow-lg space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-foreground font-medium">Online</span>
            <span className="text-xs text-muted-foreground ml-2">
              {buses.filter((b) => b.status === "moving").length} Buses
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>Locked</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowRight className="w-3 h-3 text-green-500" />
            <span>Terminal</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2 text-xs text-blue-500">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Your Location</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Bus Info */}
      {selectedBus && (
        <div className="absolute bottom-4 right-4 w-80 z-[1000]">
          <div className="p-4 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-2xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border-4 border-red-500 bg-white">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                    <Bus className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{selectedBus.name}</h4>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: selectedBus.routeColor }}
                  >
                    {selectedBus.route}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBus(null)}
                className="p-1.5 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-xl bg-accent/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Status
                </p>
                <p className="text-sm font-bold text-foreground capitalize flex items-center gap-1.5 mt-1">
                  <span
                    className={`w-2 h-2 rounded-full ${selectedBus.status === "moving" ? "bg-emerald-500 animate-pulse" : selectedBus.status === "stopped" ? "bg-amber-500" : "bg-blue-500"}`}
                  />
                  {selectedBus.status}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-accent/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <Gauge className="w-3 h-3" /> Speed
                </p>
                <p className="text-sm font-bold text-foreground mt-1">{selectedBus.speed} km/h</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <Users className="w-3 h-3" /> Passengers
                </p>
                <p className="text-sm font-bold text-foreground mt-1">{selectedBus.passengers}/60</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <Clock className="w-3 h-3" /> ETA
                </p>
                <p className="text-sm font-bold text-foreground mt-1">{selectedBus.eta}</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Next Stop</p>
              <p className="text-sm font-bold text-foreground mt-1">{selectedBus.nextStop}</p>
            </div>
          </div>
        </div>
      )}

      {/* Selected Station Info */}
      {selectedStation && !selectedBus && (
        <div className="absolute bottom-4 right-4 w-80 z-[1000]">
          <div className="p-4 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-2xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border-4"
                  style={{ borderColor: labelColors[selectedStation.labelColor].bg }}
                >
                  {selectedStation.status === "locked" ? (
                    <Lock className="w-5 h-5 text-gray-500" />
                  ) : selectedStation.type === "terminal" ? (
                    <ArrowRight className="w-5 h-5 text-green-500" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{selectedStation.name}</h4>
                  <p className="text-xs text-muted-foreground capitalize">{selectedStation.type} Station</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStation(null)}
                className="p-1.5 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-accent/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Status</p>
                <p className="text-sm font-bold text-foreground capitalize mt-1 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${selectedStation.status === "active" ? "bg-green-500" : selectedStation.status === "locked" ? "bg-gray-400" : "bg-red-500 animate-pulse"}`}
                  />
                  {selectedStation.status}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-accent/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Routes</p>
                <div className="flex flex-wrap gap-1">
                  {selectedStation.routes.map((route) => {
                    const routeData = routes.find((r) => r.name === route)
                    return (
                      <span
                        key={route}
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: routeData?.color || "#666" }}
                      >
                        {route}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// The following component was removed as it was not being used and its functionality was integrated into the main MapboxMap component.
// function StationsAndBusesOverlay({
//   stations,
//   buses,
//   selectedBus,
//   onSelectBus,
//   onSelectStation,
// }: {
//   stations: StationData[]
//   buses: BusData[]
//   selectedBus: BusData | null
//   onSelectBus: (bus: BusData) => void
//   onSelectStation: (station: StationData) => void
// }) {
//   const [markers, setMarkers] = useState<React.ReactNode[]>([])

//   useEffect(() => {
//     // Import Leaflet and create markers
//     const loadMarkers = async () => {
//       const L = (await import("leaflet")).default
//       const { useMap } = await import("react-leaflet")

//       // Markers will be handled by the parent map component
//     }
//     loadMarkers()
//   }, [stations, buses])

//   return null // Markers are handled by Leaflet's native components
// }

export { stations, routes, initialBuses as buses }
