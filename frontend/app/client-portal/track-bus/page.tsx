"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet"
import { Search, MapPin, Clock, Bus, ChevronDown, RefreshCw, Navigation2, AlertCircle } from "lucide-react"
import { useOSMRoutes, useOSMStops, CITY_COORDINATES, AVAILABLE_CITIES, type OSMRoute, type OSMStop } from "@/hooks/use-osm-data"
import { useTheme } from "@/lib/theme-context"
import { cn } from "@/lib/utils"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Component to fly to new location when city changes
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 })
  }, [map, center, zoom])

  return null
}

// Create custom stop icon
const createStopIcon = (color: string = '#3b82f6') => L.divIcon({
  className: 'custom-stop-icon',
  html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

export default function ClientTrackingPage() {
  const { isDark } = useTheme()
  const [selectedCity, setSelectedCity] = useState('Marrakech')
  const [selectedRoute, setSelectedRoute] = useState<OSMRoute | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCityDropdown, setShowCityDropdown] = useState(false)

  const cityCoords = CITY_COORDINATES[selectedCity]
  const { routes, loading: routesLoading, error: routesError, refetch: refetchRoutes } = useOSMRoutes(selectedCity)
  const { stops, loading: stopsLoading, error: stopsError, refetch: refetchStops } = useOSMStops(cityCoords.lat, cityCoords.lon, 5000)

  // Filter routes by search
  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.to.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
    setSelectedRoute(null)
    setShowCityDropdown(false)
  }

  const handleRefresh = () => {
    refetchRoutes()
    refetchStops()
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={cn("text-2xl sm:text-3xl font-bold mb-1", isDark ? "text-white" : "text-slate-900")}>
            Track Bus
          </h1>
          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            Real-time bus routes from OpenStreetMap
          </p>
        </div>

        {/* City Selector */}
        <div className="relative">
          <button
            onClick={() => setShowCityDropdown(!showCityDropdown)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all",
              isDark
                ? "bg-slate-800 text-white border border-white/10 hover:bg-slate-700"
                : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
            )}
          >
            <MapPin className="w-4 h-4 text-blue-500" />
            {selectedCity}
            <ChevronDown className={cn("w-4 h-4 transition-transform", showCityDropdown && "rotate-180")} />
          </button>

          {showCityDropdown && (
            <div className={cn(
              "absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl border z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200",
              isDark ? "bg-slate-800 border-white/10" : "bg-white border-slate-200"
            )}>
              {AVAILABLE_CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => handleCityChange(city)}
                  className={cn(
                    "w-full text-left px-4 py-3 transition-colors",
                    selectedCity === city
                      ? isDark ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
                      : isDark ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={cn(
          "p-4 rounded-2xl border",
          isDark ? "bg-slate-800/80 border-white/5" : "bg-white border-slate-200"
        )}>
          <p className={cn("text-xs font-bold uppercase tracking-wider mb-1", isDark ? "text-slate-500" : "text-slate-400")}>
            Routes Found
          </p>
          <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
            {routesLoading ? "..." : routes.length}
          </p>
        </div>
        <div className={cn(
          "p-4 rounded-2xl border",
          isDark ? "bg-slate-800/80 border-white/5" : "bg-white border-slate-200"
        )}>
          <p className={cn("text-xs font-bold uppercase tracking-wider mb-1", isDark ? "text-slate-500" : "text-slate-400")}>
            Bus Stops
          </p>
          <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
            {stopsLoading ? "..." : stops.length}
          </p>
        </div>
        <div className={cn(
          "p-4 rounded-2xl border",
          isDark ? "bg-slate-800/80 border-white/5" : "bg-white border-slate-200"
        )}>
          <button
            onClick={handleRefresh}
            disabled={routesLoading || stopsLoading}
            className={cn(
              "w-full h-full flex items-center justify-center gap-2 transition-colors",
              isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
            )}
          >
            <RefreshCw className={cn("w-5 h-5", (routesLoading || stopsLoading) && "animate-spin")} />
            <span className="font-bold">Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className={cn(
          "lg:col-span-2 h-[500px] rounded-2xl overflow-hidden border",
          isDark ? "border-white/10" : "border-slate-200"
        )}>
          <MapContainer
            center={[cityCoords.lat, cityCoords.lon]}
            zoom={cityCoords.zoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={isDark
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
            />
            <MapController center={[cityCoords.lat, cityCoords.lon]} zoom={cityCoords.zoom} />

            {/* Render all routes or just selected */}
            {(selectedRoute ? [selectedRoute] : filteredRoutes.slice(0, 20)).map(route => (
              route.coordinates.length > 0 && (
                <Polyline
                  key={route.id}
                  positions={route.coordinates.map(c => [c[1], c[0]] as [number, number])}
                  pathOptions={{
                    color: route.color || '#3b82f6',
                    weight: selectedRoute?.id === route.id ? 5 : 3,
                    opacity: selectedRoute ? (selectedRoute.id === route.id ? 1 : 0.3) : 0.7,
                  }}
                />
              )
            ))}

            {/* Render stops */}
            {stops.slice(0, 50).map(stop => (
              <Marker
                key={stop.id}
                position={[stop.coordinates[1], stop.coordinates[0]]}
                icon={createStopIcon()}
              >
                <Popup>
                  <div className="font-sans">
                    <p className="font-bold text-sm">{stop.name}</p>
                    {stop.ref && <p className="text-xs text-slate-500">Ref: {stop.ref}</p>}
                    {stop.shelter && <p className="text-xs text-emerald-600">🏛 Shelter available</p>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Routes List */}
        <div className={cn(
          "rounded-2xl border overflow-hidden flex flex-col max-h-[500px]",
          isDark ? "bg-slate-800/80 border-white/5" : "bg-white border-slate-200"
        )}>
          {/* Search */}
          <div className="p-4 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }}>
            <div className="relative">
              <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", isDark ? "text-slate-500" : "text-slate-400")} />
              <input
                type="text"
                placeholder="Search routes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors",
                  isDark
                    ? "bg-slate-900 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
                )}
              />
            </div>
          </div>

          {/* Routes */}
          <div className="flex-1 overflow-y-auto p-2">
            {routesLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : routesError ? (
              <div className={cn("p-4 rounded-xl flex items-center gap-3", isDark ? "bg-rose-900/20" : "bg-rose-50")}>
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <p className={cn("text-sm", isDark ? "text-rose-300" : "text-rose-600")}>
                  {routesError}
                </p>
              </div>
            ) : filteredRoutes.length === 0 ? (
              <div className={cn("text-center py-12", isDark ? "text-slate-500" : "text-slate-400")}>
                <Bus className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No routes found</p>
                <p className="text-xs mt-1">Try a different city or search term</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredRoutes.map(route => (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRoute(selectedRoute?.id === route.id ? null : route)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all",
                      selectedRoute?.id === route.id
                        ? isDark ? "bg-blue-600/20 border border-blue-500/30" : "bg-blue-50 border border-blue-200"
                        : isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: route.color || '#3b82f6' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={cn("font-bold text-sm truncate", isDark ? "text-white" : "text-slate-900")}>
                          {route.name || route.ref || 'Unnamed Route'}
                        </p>
                        {(route.from || route.to) && (
                          <p className={cn("text-xs truncate", isDark ? "text-slate-400" : "text-slate-500")}>
                            {route.from} → {route.to}
                          </p>
                        )}
                      </div>
                      {selectedRoute?.id === route.id && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Route Details */}
          {selectedRoute && (
            <div className={cn(
              "p-4 border-t",
              isDark ? "bg-slate-900/50 border-white/5" : "bg-slate-50 border-slate-100"
            )}>
              <p className={cn("font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>
                {selectedRoute.name}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {selectedRoute.operator && (
                  <div>
                    <span className={isDark ? "text-slate-500" : "text-slate-400"}>Operator:</span>
                    <span className={cn("ml-1 font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
                      {selectedRoute.operator}
                    </span>
                  </div>
                )}
                <div>
                  <span className={isDark ? "text-slate-500" : "text-slate-400"}>Stops:</span>
                  <span className={cn("ml-1 font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
                    {selectedRoute.stops.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
