"use client"

import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
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
  Footprints,
  Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlaceResult, TripMetadata, BusData } from "./map-types"
import { ScheduleModal } from "@/components/schedule-modal"
import { routeEventBus } from "@/lib/bus-data-context"
import { toast } from "sonner"

const BottomSheetWrapper = ({ children, isFullscreen }: { children: React.ReactNode, isFullscreen: boolean }) => {
  if (typeof document === 'undefined') return null
  if (isFullscreen) return <>{children}</>
  return createPortal(children, document.body)
}

const MAPBOX_TOKEN = "pk.eyJ1Ijoic2ltbzMzIiwiYSI6ImNtaWRwcnc2czA3bDYybXNiaGsxc2kxN2oifQ.vIT5iMLrm07zHJkrSqftHA"

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

// Stations Data
const stations: StationData[] = [
  // Marrakech stations
  { id: "s1", name: "Palmeraie", coordinates: [31.6695, -7.9811], type: "terminal", status: "active", routes: ["Route 1"], labelColor: "orange" },
  { id: "s2", name: "Gueliz", coordinates: [31.65, -7.99], type: "major", status: "active", routes: ["Route 1", "Route 2"], labelColor: "green" },
  { id: "s3", name: "Massira", coordinates: [31.645, -8.01], type: "regular", status: "active", routes: ["Route 3"], labelColor: "green" },
  { id: "s4", name: "Bab Doukkala", coordinates: [31.638, -8.022], type: "major", status: "locked", routes: ["Route 1"], labelColor: "blue" },
  { id: "s5", name: "Marjane Gueliz", coordinates: [31.634, -8.015], type: "regular", status: "active", routes: ["Route 2"], labelColor: "blue" },
  { id: "s6", name: "Bab Agnaou", coordinates: [31.64, -8.0], type: "major", status: "busy", routes: ["Route 1", "Route 3"], labelColor: "orange" },
  { id: "s7", name: "Menara", coordinates: [31.635, -7.99], type: "regular", status: "active", routes: ["Route 2"], labelColor: "orange" },
  { id: "s8", name: "Place 16 Novembre", coordinates: [31.63, -8.01], type: "regular", status: "active", routes: ["Route 2"], labelColor: "blue" },
  { id: "s9", name: "Ben Youssef", coordinates: [31.637, -7.982], type: "major", status: "active", routes: ["Route 1", "Route 2"], labelColor: "green" },
  { id: "s10", name: "Majorelle Garden", coordinates: [31.632, -7.988], type: "regular", status: "locked", routes: ["Route 3"], labelColor: "purple" },
  { id: "s11", name: "Train Station", coordinates: [31.628, -7.98], type: "terminal", status: "active", routes: ["Route 1"], labelColor: "purple" },
  { id: "s12", name: "Hivernage", coordinates: [31.624, -8.008], type: "major", status: "active", routes: ["Route 2"], labelColor: "orange" },
  { id: "s13", name: "Koutoubia", coordinates: [31.628, -7.993], type: "major", status: "active", routes: ["Route 1", "Route 3"], labelColor: "purple" },
  { id: "s14", name: "Jemaa el Fna", coordinates: [31.6258, -7.9891], type: "terminal", status: "busy", routes: ["Route 1", "Route 2", "Route 3"], labelColor: "green" },
  { id: "s15", name: "Medina", coordinates: [31.618, -8.018], type: "major", status: "active", routes: ["Route 2"], labelColor: "blue" },
  { id: "s16", name: "Gare ONCF Marrakech", coordinates: [31.622, -8.002], type: "terminal", status: "active", routes: ["Route 1", "Route 2", "Route 3"], labelColor: "purple" },
  // Casablanca stations
  { id: "cs1", name: "Casa Port", coordinates: [33.5951, -7.6187], type: "terminal", status: "active", routes: ["Casa Line 1"], labelColor: "blue" },
  { id: "cs2", name: "Morocco Mall", coordinates: [33.5342, -7.6698], type: "major", status: "active", routes: ["Casa Line 1", "Casa Line 2"], labelColor: "green" },
  { id: "cs3", name: "Hassan II Mosque", coordinates: [33.6084, -7.6325], type: "major", status: "busy", routes: ["Casa Line 1"], labelColor: "orange" },
  // Tangier stations
  { id: "ts1", name: "Port Tanger Med", coordinates: [35.7795, -5.8108], type: "terminal", status: "active", routes: ["Tanger Line 1"], labelColor: "blue" },
  { id: "ts2", name: "Grand Socco", coordinates: [35.7813, -5.8103], type: "major", status: "active", routes: ["Tanger Line 1", "Tanger Line 2"], labelColor: "green" },
]

// Bus Data
const initialBuses: BusData[] = [
  // Marrakech buses
  {
    id: "BUS-101", name: "Express 101", route: "Route 1", routeColor: "#8b5cf6", coordinates: [31.648, -7.992],
    status: "moving", speed: 45, heading: 135, passengers: 32, nextStop: "Bab Agnaou", eta: "3 min",
  },
  {
    id: "BUS-202", name: "City Line 202", route: "Route 2", routeColor: "#22c55e", coordinates: [31.642, -7.99],
    status: "moving", speed: 38, heading: 200, passengers: 45, nextStop: "Ben Youssef", eta: "5 min",
  },
  {
    id: "BUS-303", name: "Metro 303", route: "Route 3", routeColor: "#06b6d4", coordinates: [31.643, -8.005],
    status: "moving", speed: 35, heading: 90, passengers: 28, nextStop: "Bab Agnaou", eta: "4 min",
  },
  {
    id: "BUS-104", name: "Express 104", route: "Route 1", routeColor: "#8b5cf6", coordinates: [31.627, -7.992],
    status: "moving", speed: 42, heading: 45, passengers: 38, nextStop: "Koutoubia", eta: "2 min",
  },
  {
    id: "BUS-205", name: "City Line 205", route: "Route 2", routeColor: "#22c55e", coordinates: [31.625, -7.995],
    status: "moving", speed: 40, heading: 180, passengers: 52, nextStop: "Theatre Royal", eta: "6 min",
  },
  // Casablanca buses
  {
    id: "CASA-101", name: "Casa Express 101", route: "Casa Line 1", routeColor: "#ef4444", coordinates: [33.598, -7.625],
    status: "moving", speed: 50, heading: 180, passengers: 48, nextStop: "Hassan II Mosque", eta: "4 min",
  },
  // Tangier buses
  {
    id: "TANG-101", name: "Tanger Express 101", route: "Tanger Line 1", routeColor: "#10b981", coordinates: [35.782, -5.812],
    status: "moving", speed: 40, heading: 90, passengers: 30, nextStop: "Grand Socco", eta: "2 min",
  },
]

// Routes
const routes = [
  // Marrakech routes
  {
    id: "route-1", name: "Route 1", color: "#8b5cf6",
    coordinates: [
      [31.6695, -7.9811], [31.667, -7.985], [31.664, -7.987], [31.66, -7.988], [31.655, -7.989],
      [31.65, -7.99], [31.648, -7.992], [31.646, -7.995], [31.644, -7.998], [31.64, -8.0],
      [31.639, -7.995], [31.638, -7.99], [31.637, -7.982], [31.635, -7.985], [31.632, -7.987],
      [31.63, -7.988], [31.6258, -7.9891], [31.627, -7.992], [31.628, -7.993], [31.626, -7.996],
      [31.624, -7.999], [31.622, -8.002]
    ] as [number, number][],
  },
  {
    id: "route-2", name: "Route 2", color: "#22c55e",
    coordinates: [
      [31.65, -7.99], [31.648, -7.99], [31.645, -7.99], [31.642, -7.99], [31.64, -7.99],
      [31.637, -7.989], [31.637, -7.982], [31.635, -7.985], [31.632, -7.987], [31.63, -7.988],
      [31.6258, -7.9891], [31.625, -7.995], [31.624, -8.002], [31.624, -8.008], [31.622, -8.01],
      [31.62, -8.014], [31.618, -8.018], [31.62, -8.01], [31.622, -8.002]
    ] as [number, number][],
  },
  {
    id: "route-3", name: "Route 3", color: "#06b6d4",
    coordinates: [
      [31.645, -8.01], [31.644, -8.008], [31.643, -8.005], [31.641, -8.002], [31.64, -8.0],
      [31.638, -7.997], [31.636, -7.994], [31.634, -7.99], [31.632, -7.988], [31.63, -7.99],
      [31.628, -7.993], [31.626, -7.996], [31.624, -7.999], [31.622, -8.002]
    ] as [number, number][],
  },
  // Casablanca routes
  {
    id: "casa-route-1", name: "Casa Line 1", color: "#ef4444",
    coordinates: [[33.5951, -7.6187], [33.598, -7.625], [33.602, -7.628], [33.6084, -7.6325], [33.605, -7.64], [33.598, -7.65], [33.58, -7.66], [33.56, -7.665], [33.5342, -7.6698]] as [number, number][],
  },
  {
    id: "casa-route-2", name: "Casa Line 2", color: "#f59e0b",
    coordinates: [[33.5342, -7.6698], [33.545, -7.66], [33.56, -7.645], [33.5731, -7.6289], [33.58, -7.628], [33.5892, -7.6264]] as [number, number][],
  },
  // Tangier routes
  {
    id: "tanger-route-1", name: "Tanger Line 1", color: "#10b981",
    coordinates: [[35.7795, -5.8108], [35.782, -5.812], [35.7813, -5.8103], [35.783, -5.812], [35.7847, -5.8139]] as [number, number][],
  },
]

// Utilities
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371 // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in km
}

// Find nearest station to a given location
const findNearestStation = (lat: number, lon: number): { station: StationData; distance: number } | null => {
  if (stations.length === 0) return null

  let nearest = stations[0]
  let minDistance = calculateDistance(lat, lon, nearest.coordinates[0], nearest.coordinates[1])

  for (const station of stations) {
    const dist = calculateDistance(lat, lon, station.coordinates[0], station.coordinates[1])
    if (dist < minDistance) {
      minDistance = dist
      nearest = station
    }
  }

  return { station: nearest, distance: minDistance }
}

// Reverse geocode to get location name
const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
    const data = await res.json()
    if (data.address) {
      // Return city, town, or village name
      return data.address.city || data.address.town || data.address.village || data.address.suburb || data.display_name?.split(',')[0] || "Unknown Location"
    }
    return "Unknown Location"
  } catch (e) {
    console.error("Reverse geocoding failed:", e)
    return "Unknown Location"
  }
}

// Calculate route between two points using OSRM
const calculateRoutePath = async (start: [number, number], end: [number, number]): Promise<[number, number][]> => {
  try {
    const res = await fetch(`https://router.project-osrm.org/route/v1/foot/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`)
    const data = await res.json()
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number])
    }
    // Fallback to straight line
    return [start, end]
  } catch (e) {
    console.error("Route calculation failed:", e)
    return [start, end]
  }
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
        setMapStyle,
      }: {
        onFullscreenToggle: () => void
        isFullscreen: boolean
        userLocation: [number, number] | null
        setUserLocation: (loc: [number, number] | null) => void
        setMapStyle: (style: "dark" | "streets" | "satellite") => void
      }) => {
        const map = useMap()
        const [showStyleMenu, setShowStyleMenu] = useState(false)

        const handleZoomIn = () => map.setZoom(map.getZoom() + 1, { animate: true })
        const handleZoomOut = () => map.setZoom(map.getZoom() - 1, { animate: true })

        const handleMyLocation = () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords
                setUserLocation([latitude, longitude])
                map.flyTo([latitude, longitude], 16, { duration: 1.5 })
              },
              (error) => {
                // Fallback to Marrakech center if geolocation fails
                toast.error("Location unavailable - showing Marrakech center")
                const marrakechCenter: [number, number] = [31.6295, -7.9811]
                setUserLocation(marrakechCenter)
                map.flyTo(marrakechCenter, 14, { duration: 1.5 })
              },
              { enableHighAccuracy: true, timeout: 5000 }
            )
          } else {
            toast.error("Geolocation not supported")
            const marrakechCenter: [number, number] = [31.6295, -7.9811]
            setUserLocation(marrakechCenter)
            map.flyTo(marrakechCenter, 14, { duration: 1.5 })
          }
        }

        const handleChangeLocation = () => map.flyTo([31.638, -7.998], 12, { duration: 1.5 })

        return (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-[1000]">
            {/* Style Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowStyleMenu(!showStyleMenu)}
                className="p-3 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/10 text-white transition-colors"
                title="Map Layers"
              >
                <Layers className="w-5 h-5" />
              </button>

              {showStyleMenu && (
                <div className="absolute right-full mr-3 top-0 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-2 w-32 flex flex-col gap-1 shadow-2xl">
                  <button onClick={() => { setMapStyle('dark'); setShowStyleMenu(false) }} className="text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg">Dark Neon</button>
                  <button onClick={() => { setMapStyle('streets'); setShowStyleMenu(false) }} className="text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg">Light</button>
                  <button onClick={() => { setMapStyle('satellite'); setShowStyleMenu(false) }} className="text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg">Satellite</button>
                </div>
              )}
            </div>

            <div className="flex flex-col rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
              <button onClick={handleZoomIn} className="p-3 hover:bg-white/10 text-white transition-colors border-b border-white/5"><Plus className="w-5 h-5" /></button>
              <button onClick={handleZoomOut} className="p-3 hover:bg-white/10 text-white transition-colors"><Minus className="w-5 h-5" /></button>
            </div>

            <button onClick={onFullscreenToggle} className="p-3 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/10 text-white transition-colors">
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>

            <button onClick={handleMyLocation} className="p-3 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/10 text-white transition-colors">
              <Locate className="w-5 h-5" />
            </button>
          </div>
        )
      }
      return ControlButtons
    }),
  { ssr: false },
)

// Dynamic Leaflet Imports
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false })

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
          const resizeObserver = new ResizeObserver(() => {
            if (map) map.invalidateSize()
          })
          const container = map.getContainer()
          resizeObserver.observe(container)
          return () => resizeObserver.disconnect()
        }, [map])
        return null
      }
    }),
  { ssr: false }
)

const MapEventHandler = dynamic(
  () =>
    Promise.all([
      import("react-leaflet"),
      import("react")
    ]).then(([leafletMod, reactMod]) => {
      const { useMap } = leafletMod
      const { useEffect } = reactMod

      // Default fallback location (Casablanca city center)
      const FALLBACK_LOCATION: [number, number] = [33.5731, -7.5898]

      return function MapEventHandler({
        setUserLocation,
        setDestination,
        setDestinationName,
        setRoutePath,
        setTripMetadata
      }: {
        setUserLocation: (loc: [number, number] | null) => void
        setDestination: (loc: [number, number] | null) => void
        setDestinationName: (name: string | null) => void
        setRoutePath: (path: [number, number][] | null) => void
        setTripMetadata: (meta: TripMetadata | null) => void
      }) {
        const map = useMap()

        useEffect(() => {
          if (!map) return
          console.log("[MapEventHandler] Attaching location listener")

          const processLocation = async (latitude: number, longitude: number) => {
            const userLoc: [number, number] = [latitude, longitude]
            setUserLocation(userLoc)

            // Find nearest station
            const nearest = findNearestStation(latitude, longitude)
            if (nearest) {
              const stationCoords: [number, number] = [nearest.station.coordinates[0], nearest.station.coordinates[1]]
              setDestination(stationCoords)
              setDestinationName(nearest.station.name)

              // Calculate route
              const route = await calculateRoutePath(userLoc, stationCoords)
              setRoutePath(route)

              // Estimate walking time (5 km/h average walking speed)
              const walkingTime = Math.round((nearest.distance / 5) * 60)
              setTripMetadata({
                distance: nearest.distance.toFixed(1) + " km",
                duration: walkingTime + " min walk"
              })

              // Fly to show both user and station
              const bounds = [userLoc, stationCoords]
              map.flyToBounds(bounds as any, { padding: [50, 50], duration: 1.5 })

              toast.success(`Nearest station: ${nearest.station.name} (${nearest.distance.toFixed(1)} km)`, { id: "locate-loader", duration: 4000 })

              // Emit location info for dashboard
              const locationName = await reverseGeocode(latitude, longitude)
              window.dispatchEvent(new CustomEvent('user-location-update', {
                detail: {
                  locationName,
                  nearestStation: nearest.station.name,
                  distance: nearest.distance.toFixed(1)
                }
              }))
            } else {
              map.flyTo(userLoc, 16, { duration: 1.5 })
              toast.success("Location centered", { id: "locate-loader" })
            }
          }

          const handleRemoteLocate = () => {
            console.log("[MapEventHandler] Location request received")
            if (navigator.geolocation) {
              toast.loading("Finding nearest station...", { id: "locate-loader" })
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords
                  console.log("[MapEventHandler] Location found:", latitude, longitude)
                  processLocation(latitude, longitude)
                },
                (error) => {
                  console.error("[MapEventHandler] Location error, using fallback:", error)
                  processLocation(FALLBACK_LOCATION[0], FALLBACK_LOCATION[1])
                },
                { enableHighAccuracy: true, timeout: 5000 }
              )
            } else {
              processLocation(FALLBACK_LOCATION[0], FALLBACK_LOCATION[1])
            }
          }

          window.addEventListener('map-request-locate', handleRemoteLocate)
          return () => window.removeEventListener('map-request-locate', handleRemoteLocate)
        }, [map, setUserLocation, setDestination, setDestinationName, setRoutePath, setTripMetadata])
        return null
      }
    }),
  { ssr: false }
)

export function MapboxMap({
  className = "",
  fullScreen = false,
  centerLat = 33.5,
  centerLng = -7.0,
  zoom = 6,
  showControls = true
}: MapboxMapProps) {
  const [buses, setBuses] = useState<BusData[]>(initialBuses)
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null)

  const [selectedStation, setSelectedStation] = useState<StationData | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [L, setL] = useState<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [mapStyle, setMapStyle] = useState<"dark" | "streets" | "satellite">("dark")

  const { theme } = useTheme()
  const [destination, setDestination] = useState<[number, number] | null>(null)
  const [destinationName, setDestinationName] = useState<string | null>(null)
  const [routePath, setRoutePath] = useState<[number, number][] | null>(null)
  const [tripMetadata, setTripMetadata] = useState<TripMetadata | null>(null)
  const [showSchedule, setShowSchedule] = useState(false)

  // Subscribe to Global Search Routing
  useEffect(() => {
    const unsubscribe = routeEventBus.subscribe((place: PlaceResult) => {
      handleSelectPlace(place)
    })
    return () => unsubscribe()
  }, [userLocation])

  // Client Initialization
  useEffect(() => {
    setIsClient(true)
    import("leaflet").then((leaflet) => {
      setL(leaflet.default)
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
    })
  }, [])

  // Fullscreen Handler
  const handleFullscreenToggle = useCallback(() => {
    const mapContainer = document.getElementById("map-container")
    if (!mapContainer) return
    if (!document.fullscreenElement) {
      mapContainer.requestFullscreen().catch(err => console.error("Error attempting to enable fullscreen:", err))
    } else {
      document.exitFullscreen()
    }
  }, [])

  // Sync fullscreen state with browser events (handles Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Bus Movement Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) => prev.map((bus) => {
        if (bus.status !== "moving") return bus
        const route = routes.find((r) => r.name === bus.route)
        if (!route) return bus

        let closest = 0, minDst = Infinity
        route.coordinates.forEach((c, i) => {
          const d = Math.sqrt(Math.pow(c[0] - bus.coordinates[0], 2) + Math.pow(c[1] - bus.coordinates[1], 2))
          if (d < minDst) { minDst = d; closest = i }
        })

        const next = route.coordinates[(closest + 1) % route.coordinates.length]
        const step = 0.0003
        const dy = next[0] - bus.coordinates[0], dx = next[1] - bus.coordinates[1]

        return { ...bus, coordinates: [bus.coordinates[0] + dy * step, bus.coordinates[1] + dx * step] as [number, number] }
      }))
    }, 1500)
  }, [])


  const handleSelectPlace = async (place: PlaceResult) => {
    const lat = parseFloat(place.lat)
    const lon = parseFloat(place.lon)
    setDestination([lat, lon])
    setDestinationName(place.display_name.split(',')[0])

    if (userLocation) {
      await calculateRoute(userLocation, [lat, lon])
    }
    // Fly to destination
    const mapContainer = document.querySelector('.leaflet-container');
    // We can't easily access 'map' here without ref, but state update will trigger re-render.
  }

  const calculateRoute = async (start: [number, number], end: [number, number]) => {
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`)
      const data = await res.json()
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0]
        const coords = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]])
        setRoutePath(coords)
        setTripMetadata({
          distance: (route.distance / 1000).toFixed(1) + " km",
          duration: Math.round(route.duration / 60) + " min"
        })
      }
    } catch (e) {
      console.error("Routing failed", e)
      // Fallback straight line
      setRoutePath([start, end])
      setTripMetadata({ distance: "N/A", duration: "N/A" })
    }
  }

  // Icon Creators
  const createStationIcon = (station: StationData) => {
    if (!L) return null
    const isActive = mapStyle === 'dark'
    const color = isActive ? 'white' : '#333'
    const bg = isActive ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)'
    const text = isActive ? 'white' : 'black'

    const html = `
      <div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center;">
        <div style="width: 16px; height: 16px; background: ${color}; border-radius: 50%; border: 3px solid ${isActive ? '#111' : 'white'}; box-shadow: 0 2px 10px rgba(0,0,0,0.2);"></div>
        <div style="margin-top: 4px; background: ${bg}; backdrop-filter: blur(4px); padding: 2px 6px; border-radius: 4px; color: ${text}; font-size: 10px; font-weight: 600;">${station.name}</div>
      </div>
    `
    return L.divIcon({ html, className: "station-marker", iconSize: [80, 50], iconAnchor: [40, 8] })
  }

  const createBusIcon = (bus: BusData, isSelected: boolean) => {
    if (!L) return null
    const scale = isSelected ? 1.2 : 1
    const borderColor = mapStyle === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'

    const html = `
      <div style="position: relative; width: ${36 * scale}px; height: ${36 * scale}px;">
         <div style="position: absolute; inset: 0; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border: 2px solid ${borderColor};">
            <svg width="${18 * scale}" height="${18 * scale}" viewBox="0 0 24 24" fill="black"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/></svg>
         </div>
      </div>
    `
    return L.divIcon({ html, className: "bus-marker", iconSize: [36 * scale, 36 * scale], iconAnchor: [18 * scale, 18 * scale] })
  }

  const createUserLocationIcon = () => {
    if (!L) return null
    const html = `<div style="width: 20px; height: 20px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px #3b82f6;"></div>`
    return L.divIcon({ html, className: "user-loc", iconSize: [20, 20], iconAnchor: [10, 10] })
  }

  const getTileUrl = () => {
    if (mapStyle === 'satellite') return `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`
    if (mapStyle === 'streets') return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`
    return `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`
  }

  if (!isClient || !L) return <div className="bg-slate-900 w-full h-full flex items-center justify-center text-white">Loading Map...</div>

  // Calculated Attributes
  const userDistance = selectedBus && userLocation
    ? calculateDistance(userLocation[0], userLocation[1], selectedBus.coordinates[0], selectedBus.coordinates[1])
    : 0

  const userEta = userDistance > 0 ? Math.round((userDistance / 40) * 60) : 0 // 40km/h avg speed

  return (
    <div id="map-container" className={`relative w-full h-full min-h-[400px] ${className} ${isFullscreen ? "fixed inset-0 z-[9999]" : ""}`}>

      <style jsx global>{`
        .leaflet-container { background: ${mapStyle === 'dark' ? '#111' : '#e5e7eb'} !important; }
        .station-marker, .bus-marker, .user-loc, .destination-marker { background: transparent !important; border: none !important; }
        .leaflet-control-zoom { display: none !important; }
      `}</style>

      {/* -- Trip Info Card (Floating) -- */}
      {tripMetadata && destinationName && (
        <div className={`absolute top-20 left-4 z-[1000] w-80 rounded-2xl p-4 shadow-2xl transition-all duration-300 animate-in slide-in-from-left-4 ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-black/60 backdrop-blur-xl border border-white/10 text-white'}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Trip to</h3>
              <div className="text-lg font-bold leading-tight">{destinationName}</div>
            </div>
            <div className="bg-cyan-500/20 p-2 rounded-full">
              <Navigation className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl ${theme === 'light' ? 'bg-slate-50' : 'bg-white/5'}`}>
              <div className="flex items-center gap-2 mb-1 opacity-60">
                <Clock className="w-3 h-3" />
                <span className="text-xs">Est. Time</span>
              </div>
              <div className="text-xl font-bold font-mono">{tripMetadata.duration}</div>
            </div>
            <div className={`p-3 rounded-xl ${theme === 'light' ? 'bg-slate-50' : 'bg-white/5'}`}>
              <div className="flex items-center gap-2 mb-1 opacity-60">
                <Footprints className="w-3 h-3" />
                <span className="text-xs">Distance</span>
              </div>
              <div className="text-xl font-bold font-mono">{tripMetadata.distance}</div>
            </div>
          </div>

          <button
            onClick={() => { setDestination(null); setRoutePath(null); setTripMetadata(null); }}
            className="w-full mt-4 py-2 text-xs font-semibold text-center hover:bg-white/10 rounded-lg transition-colors opacity-60 hover:opacity-100"
          >
            Clear Route
          </button>
        </div>
      )}

      <MapContainer
        center={[centerLat, centerLng]} zoom={zoom} zoomControl={false}
        style={{ width: "100%", height: "100%", borderRadius: isFullscreen ? "0" : "1rem" }}
      >
        <MapResizeHandler />
        <MapEventHandler
          setUserLocation={setUserLocation}
          setDestination={setDestination}
          setDestinationName={setDestinationName}
          setRoutePath={setRoutePath}
          setTripMetadata={setTripMetadata}
        />
        <TileLayer url={getTileUrl()} tileSize={512} zoomOffset={-1} maxZoom={19} />

        {/* Routes Display */}
        {/* Destination Route */}
        {routePath && (
          <>
            <Polyline positions={routePath} pathOptions={{ color: theme === 'dark' ? '#00f2ff' : '#2563eb', weight: 8, opacity: 0.3, lineCap: 'round' }} />
            <Polyline positions={routePath} pathOptions={{ color: theme === 'dark' ? '#fff' : '#1d4ed8', weight: 4, opacity: 0.9, lineCap: 'round', dashArray: theme === 'light' ? '1, 10' : undefined }} />
          </>
        )}


        {/* Bus Routes */}
        {routes.map((route) => (
          <div key={route.id}>
            {/* Neon Glow Only in Dark Mode */}
            {mapStyle === 'dark' && (
              <>
                <Polyline positions={route.coordinates} pathOptions={{ color: route.color, weight: 12, opacity: 0.1, lineCap: 'round' }} />
                <Polyline positions={route.coordinates} pathOptions={{ color: route.color, weight: 6, opacity: 0.3, lineCap: 'round' }} />
              </>
            )}
            <Polyline positions={route.coordinates} pathOptions={{ color: mapStyle === 'dark' ? '#fff' : route.color, weight: 3, opacity: 0.9 }} />
          </div>
        ))}

        {/* Map Objects */}
        {destination && (
          <Marker position={destination} icon={L.divIcon({
            html: `<div style="font-size: 24px;">📍</div>`,
            className: 'destination-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
          })} />
        )}
        {stations.map(st => <Marker key={st.id} position={st.coordinates} icon={createStationIcon(st)} eventHandlers={{ click: () => { setSelectedStation(st); setSelectedBus(null) } }} />)}
        {buses.map(bus => <Marker key={bus.id} position={bus.coordinates} icon={createBusIcon(bus, selectedBus?.id === bus.id)} eventHandlers={{ click: () => { setSelectedBus(bus); setSelectedStation(null) } }} />)}
        {userLocation && <Marker position={userLocation} icon={createUserLocationIcon()} />}

        {showControls && (
          <MapControlButtons
            onFullscreenToggle={handleFullscreenToggle} isFullscreen={isFullscreen}
            userLocation={userLocation} setUserLocation={setUserLocation}
            setMapStyle={setMapStyle}
          />
        )}
      </MapContainer>

      {/* Bottom Sheet - Bus Info */}
      {selectedBus && isClient && (
        <BottomSheetWrapper isFullscreen={isFullscreen}>
          <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-in slide-in-from-bottom duration-300 pointer-events-none flex justify-center">
            <div className="w-full md:max-w-md md:mb-6 pointer-events-auto">
              {/* Driver Card - Dark header */}
              <div className={`mx-4 mb-3 p-4 rounded-2xl shadow-2xl ${theme === 'light' ? 'bg-slate-800' : 'bg-slate-900'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                      <Bus className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{selectedBus.name}</h3>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-yellow-400 text-xs">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        if (userLocation && selectedBus) {
                          const busCoords: [number, number] = [selectedBus.coordinates[0], selectedBus.coordinates[1]]
                          setDestination(busCoords)
                          setDestinationName(selectedBus.name)
                          await calculateRoute(userLocation, busCoords)
                          toast.success(`Route traced to ${selectedBus.name}`)
                        } else if (!userLocation) {
                          // Try to get user location first
                          if (navigator.geolocation) {
                            toast.loading("Getting your location...")
                            navigator.geolocation.getCurrentPosition(
                              async (position) => {
                                const loc: [number, number] = [position.coords.latitude, position.coords.longitude]
                                setUserLocation(loc)
                                if (selectedBus) {
                                  const busCoords: [number, number] = [selectedBus.coordinates[0], selectedBus.coordinates[1]]
                                  setDestination(busCoords)
                                  setDestinationName(selectedBus.name)
                                  await calculateRoute(loc, busCoords)
                                  toast.success(`Route traced to ${selectedBus.name}`)
                                }
                              },
                              () => toast.error("Could not get your location"),
                              { enableHighAccuracy: true, timeout: 5000 }
                            )
                          }
                        }
                      }}
                      className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      title="Trace route to this bus"
                    >
                      <MapPin className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedBus(null)}
                      className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Info Card - Light body */}
              <div className={`mx-4 mb-4 rounded-2xl shadow-2xl overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
                {/* ETA Section */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className={`text-xl font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                        Arrival: {selectedBus.eta}
                      </p>
                      <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                        Distance from you: <span className="text-pink-500 font-semibold">{userDistance.toFixed(1)} km</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 ml-16">
                    <span className={`px-3 py-1 rounded-full text-sm ${theme === 'light' ? 'bg-slate-100 text-slate-600' : 'bg-slate-700 text-slate-300'}`}>
                      {selectedBus.route}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${theme === 'light' ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      On Route
                    </span>
                  </div>
                </div>

                {/* Destination Section */}
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Navigation className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-lg ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                        {selectedBus.nextStop}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                          <Gauge className="w-4 h-4 text-emerald-500" />
                          <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-white'}`}>{selectedBus.speed} km/h</span>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                          <Users className="w-4 h-4 text-orange-500" />
                          <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-white'}`}>{selectedBus.passengers}% full</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => setShowSchedule(true)}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
                  >
                    View Full Schedule • Track Bus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </BottomSheetWrapper>
      )}


      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={showSchedule}
        onClose={() => setShowSchedule(false)}
        busName={selectedBus?.name}
      />
    </div >
  )
}

