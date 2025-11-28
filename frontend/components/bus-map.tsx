"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Wifi, WifiOff, ZoomIn, ZoomOut, Maximize, Locate, Navigation as NavigationIcon, MapPin, Bus } from "lucide-react"
import { useGPSTracking } from "@/hooks/use-socket"
import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from 'mapbox-gl'

const MAPBOX_TOKEN = "pk.eyJ1Ijoic2ltbzMzIiwiYSI6ImNtaWRwcnc2czA3bDYybXNiaGsxc2kxN2oifQ.vIT5iMLrm07zHJkrSqftHA"

interface BusLocation {
  id: string
  bus_id: number
  lat: number
  lng: number
  speed: number
  heading: number
  routeColor: string
  status: "moving" | "stopped" | "in-station"
  route_name?: string
  driver_name?: string
}

interface BusMapProps {
  fullScreen?: boolean
  height?: string
  showControls?: boolean
  highlightBus?: string | null
  highlightRoute?: number | null
  driverMode?: boolean
  showStops?: boolean
  centerOn?: { lat: number; lng: number }
}

export function BusMap({ 
  fullScreen = false, 
  height = "400px", 
  showControls = true,
  highlightBus = null,
  centerOn
}: BusMapProps) {
  // Initialize with mock bus data for Marrakech
  const [buses, setBuses] = useState<BusLocation[]>([
    {
      id: 'BUS-101',
      bus_id: 101,
      lat: 31.6295,
      lng: -7.9811,
      speed: 45,
      heading: 90,
      routeColor: '#3b82f6',
      status: 'moving',
      route_name: 'Route 1: Jemaa el-Fna → Gueliz',
      driver_name: 'Ahmed Hassan'
    },
    {
      id: 'BUS-202',
      bus_id: 202,
      lat: 31.6340,
      lng: -8.0089,
      speed: 0,
      heading: 180,
      routeColor: '#10b981',
      status: 'stopped',
      route_name: 'Route 2: Menara Airport → Medina',
      driver_name: 'Fatima Zahra'
    },
    {
      id: 'BUS-303',
      bus_id: 303,
      lat: 31.6585,
      lng: -7.9897,
      speed: 30,
      heading: 270,
      routeColor: '#f59e0b',
      status: 'moving',
      route_name: 'Route 3: Hivernage → Majorelle Garden',
      driver_name: 'Omar Idrissi'
    },
    {
      id: 'BUS-404',
      bus_id: 404,
      lat: 31.6167,
      lng: -7.9973,
      speed: 15,
      heading: 45,
      routeColor: '#8b5cf6',
      status: 'in-station',
      route_name: 'Route 4: Marrakech Station → Palmeraie',
      driver_name: 'Youssef Alami'
    }
  ])
  const [selectedBus, setSelectedBus] = useState<BusLocation | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [currentZoom, setCurrentZoom] = useState(12)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const markers = useRef<{ [key: string]: any }>({})
  const userMarkerRef = useRef<any>(null)
  const vehicleMarkersRef = useRef<Map<string, any>>(new Map())

  // Initialize Mapbox
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const loadMapbox = async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default
        
        // Validate token
        if (!MAPBOX_TOKEN) {
          setMapError('Mapbox token is missing')
          return
        }

        mapboxgl.accessToken = MAPBOX_TOKEN

        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [centerOn?.lng || -7.9811, centerOn?.lat || 31.6295],
          zoom: 12,
          attributionControl: false,
          trackResize: true,
          preserveDrawingBuffer: false,
          collectResourceTiming: false
        })

        // Add event listeners with error handling
        map.current.on('load', () => {
          setMapLoaded(true)
          
          if (!map.current) return
          
          // Expose map instance globally for external controls
          if (typeof window !== 'undefined') {
            (window as any).mapInstance = map.current
          }
          
          // Force controls visibility after map loads
          setTimeout(() => {
            const controls = document.querySelectorAll('.mapboxgl-ctrl-group, .mapboxgl-ctrl')
            controls.forEach((ctrl: any) => {
              ctrl.style.display = 'block'
              ctrl.style.visibility = 'visible'
              ctrl.style.opacity = '1'
              ctrl.style.zIndex = '9999'
            })
          }, 200)

          // Get user's current location and add marker
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const coords: [number, number] = [
                  position.coords.longitude,
                  position.coords.latitude
                ]
                updateUserLocation(coords)
                
                // Center map on user location when first obtained
                if (map.current) {
                  map.current.flyTo({
                    center: coords,
                    zoom: 13,
                    duration: 1500
                  })
                }
              },
              (error) => {
                // Silently handle - location is optional
              },
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            )
          }

          // Add mock vehicle tracking data (will be replaced with real Socket.IO data)
          setTimeout(() => {
            // Define routes with stations - Real Casablanca locations
            const routes = [
              {
                id: 'route-1',
                name: 'Route 1: Casa-Port → Ain Diab',
                color: '#3b82f6',
                stations: [
                  { name: 'Casa-Port Station', coords: [-7.6196, 33.5931] },
                  { name: 'Place Mohammed V', coords: [-7.6266, 33.5931] },
                  { name: 'Maarif', coords: [-7.6336, 33.5831] },
                  { name: 'Ain Diab Beach', coords: [-7.6596, 33.5731] },
                  { name: 'Morocco Mall', coords: [-7.6696, 33.5631] },
                ],
                vehicleId: 'vehicle-101'
              },
              {
                id: 'route-2',
                name: 'Route 2: Airport → Downtown',
                color: '#10b981',
                stations: [
                  { name: 'Airport Terminal', coords: [-7.5896, 33.3676] },
                  { name: 'Anfa Place', coords: [-7.6196, 33.5731] },
                  { name: 'Twin Center', coords: [-7.6296, 33.5831] },
                  { name: 'Central Market', coords: [-7.6196, 33.5931] },
                  { name: 'Old Medina', coords: [-7.6096, 33.6031] },
                ],
                vehicleId: 'vehicle-202'
              },
              {
                id: 'route-3',
                name: 'Route 3: University → Business District',
                color: '#f59e0b',
                stations: [
                  { name: 'Hassan II University', coords: [-7.6496, 33.5631] },
                  { name: 'Gauthier', coords: [-7.6396, 33.5731] },
                  { name: 'Casa Finance City', coords: [-7.6296, 33.5831] },
                  { name: 'Bourgogne', coords: [-7.6196, 33.5931] },
                  { name: 'Habous Quarter', coords: [-7.6096, 33.5831] },
                ],
                vehicleId: 'vehicle-303'
              },
              {
                id: 'route-4',
                name: 'Route 4: Derb Sultan → Sidi Moumen',
                color: '#8b5cf6',
                stations: [
                  { name: 'Derb Sultan', coords: [-7.6096, 33.5731] },
                  { name: 'Hay Mohammadi', coords: [-7.5996, 33.5631] },
                  { name: 'Sidi Moumen', coords: [-7.5796, 33.5531] },
                  { name: 'Zenata', coords: [-7.5696, 33.5431] },
                ],
                vehicleId: 'vehicle-404'
              }
            ]

            // Add route lines and stations to map
            routes.forEach(route => {
              // Add route line source
              if (map.current && map.current.getSource(route.id)) {
                map.current.removeLayer(`${route.id}-line`)
                map.current.removeSource(route.id)
              }

              if (!map.current) return

              map.current.addSource(route.id, {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: route.stations.map(s => s.coords)
                  }
                }
              })

              // Add route line layer
              map.current.addLayer({
                id: `${route.id}-line`,
                type: 'line',
                source: route.id,
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                paint: {
                  'line-color': route.color,
                  'line-width': 4,
                  'line-opacity': 0.8
                }
              })

              // Add station markers
              route.stations.forEach((station, index) => {
                const isStart = index === 0
                const isEnd = index === route.stations.length - 1
                
                const stationEl = document.createElement('div')
                stationEl.className = 'station-marker'
                stationEl.innerHTML = `
                  <div class="flex flex-col items-center">
                    <div class="${isStart ? 'bg-green-600' : isEnd ? 'bg-red-600' : 'bg-white'} rounded-full p-2 shadow-lg border-3 ${isStart || isEnd ? 'border-white' : 'border-slate-400'}" style="border-width: 3px;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${isStart || isEnd ? 'white' : route.color}" stroke-width="2">
                        ${isStart ? '<path d="M5 12h14M12 5l7 7-7 7"/>' : isEnd ? '<circle cx="12" cy="12" r="10"/>' : '<rect x="3" y="3" width="18" height="18" rx="2"/>'}
                      </svg>
                    </div>
                    <div class="mt-1 px-2 py-0.5 rounded text-xs font-semibold shadow-md" style="background-color: ${route.color}; color: white;">
                      ${station.name}
                    </div>
                  </div>
                `
                
                new mapboxgl.Marker(stationEl)
                  .setLngLat(station.coords as [number, number])
                  .setPopup(
                    new mapboxgl.Popup({ offset: 25 })
                      .setHTML(`
                        <div style="padding: 8px;">
                          <h4 style="font-weight: bold; margin-bottom: 4px;">${station.name}</h4>
                          <p style="font-size: 11px; color: #6b7280;">${route.name}</p>
                          <p style="font-size: 11px; margin-top: 4px;">
                            ${isStart ? '🚀 Start Point' : isEnd ? '🏁 End Point' : '🚏 Stop'}
                          </p>
                        </div>
                      `)
                  )
                  .addTo(map.current)
              })
            })

            // Add vehicle markers on their routes
            const mockVehicles = routes.map((route, index) => ({
              id: route.vehicleId,
              position: route.stations[Math.floor(index * 1.5) % route.stations.length].coords as [number, number],
              label: route.name.split(':')[0],
              route: route
            }))
            
            console.log('Adding vehicle markers with routes:', mockVehicles)
            updateVehicleMarkers(mockVehicles.map(v => ({
              id: v.id,
              position: v.position,
              label: v.label
            })))

            // Store routes for vehicle movement
            ;(window as any).busRoutes = routes
          }, 500)
        })

        map.current.on('error', (e: any) => {
          console.error('Mapbox error event:', e)
          if (e?.error?.message) {
            setMapError(e.error.message)
          }
        })

        // Add controls with try-catch
        try {
          // Add navigation controls (zoom +/-)
          const nav = new mapboxgl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true
          })
          map.current.addControl(nav, 'top-right')
          
          // Add geolocation control (locate me)
          const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: { 
              enableHighAccuracy: true 
            },
            trackUserLocation: true,
            showUserHeading: true,
            showUserLocation: true
          })
          map.current.addControl(geolocate, 'top-right')
          
          // Add fullscreen control
          const fullscreen = new mapboxgl.FullscreenControl()
          map.current.addControl(fullscreen, 'top-right')
          
          // Add scale control
          const scale = new mapboxgl.ScaleControl({
            maxWidth: 100,
            unit: 'metric'
          })
          map.current.addControl(scale, 'bottom-left')
          
          // Apply styles to ensure controls are visible and properly positioned
          setTimeout(() => {
            const controlElements = document.querySelectorAll('.mapboxgl-ctrl-group, .mapboxgl-ctrl')
            controlElements.forEach((el: any) => {
              el.style.display = 'block !important'
              el.style.visibility = 'visible !important'
              el.style.opacity = '1 !important'
              el.style.zIndex = '10 !important'
              el.style.position = 'relative !important'
              el.style.pointerEvents = 'auto !important'
            })
            
            // Ensure top-right controls are properly positioned
            const topRightContainer = document.querySelector('.mapboxgl-ctrl-top-right')
            if (topRightContainer) {
              const element = topRightContainer as HTMLElement
              element.style.top = '10px'
              element.style.right = '10px'
              element.style.zIndex = '10'
              element.style.pointerEvents = 'auto'
            }
            
            // Style individual buttons
            const buttons = document.querySelectorAll('.mapboxgl-ctrl-group button')
            buttons.forEach((btn: any) => {
              btn.style.display = 'block !important'
              btn.style.visibility = 'visible !important'
              btn.style.width = '29px !important'
              btn.style.height = '29px !important'
            })
          }, 100)
        } catch (controlError) {
          console.warn('Error adding map controls:', controlError)
        }
      } catch (error: any) {
        console.error('Error loading Mapbox:', error)
        setMapError(error?.message || 'Failed to initialize map')
      }
    }

    loadMapbox()

    return () => {
      if (map.current) {
        try {
          map.current.remove()
          map.current = null
        } catch (error) {
          console.warn('Error cleaning up map:', error)
        }
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
        userMarkerRef.current = null
      }
      vehicleMarkersRef.current.forEach(marker => marker.remove())
      vehicleMarkersRef.current.clear()
    }
  }, [centerOn])

  // Update markers when buses change
  useEffect(() => {
    if (!map.current || typeof window === 'undefined') return

    const updateMarkers = async () => {
      const mapboxgl = (await import('mapbox-gl')).default

      // Remove old markers
      Object.keys(markers.current).forEach(busId => {
        if (!buses.find(b => b.id === busId)) {
          markers.current[busId]?.remove()
          delete markers.current[busId]
        }
      })

      // Add/update markers
      buses.forEach(bus => {
        const getBusColor = (b: BusLocation) => {
          if (highlightBus && b.id !== highlightBus) return "#94a3b8"
          if (b.status === "moving") return "#3b82f6"
          if (b.status === "stopped") return "#06b6d4"
          return "#10b981"
        }

        const color = getBusColor(bus)

        // Create marker element
        const el = document.createElement('div')
        el.className = 'bus-marker'
        el.style.cssText = `
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: ${color};
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transform: rotate(${bus.heading}deg);
          position: relative;
          transition: transform 0.3s ease;
        `

        // Add navigation icon
        el.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
          ${bus.speed > 0 ? `<div style="position: absolute; top: -8px; right: -8px; background: rgba(0,0,0,0.8); color: white; font-size: 10px; padding: 2px 6px; border-radius: 999px; font-weight: bold;">${Math.round(bus.speed)}</div>` : ''}
        `

        el.addEventListener('click', () => {
          setSelectedBus(bus)
          if (map.current) {
            map.current.flyTo({
              center: [bus.lng, bus.lat],
              zoom: 15,
              duration: 800
            })
          }
        })

        if (markers.current[bus.id]) {
          // Update existing marker
          markers.current[bus.id].setLngLat([bus.lng, bus.lat])
        } else {
          // Create new marker
          markers.current[bus.id] = new mapboxgl.Marker(el)
            .setLngLat([bus.lng, bus.lat])
            .addTo(map.current)
        }

        // Add popup
        if (selectedBus?.id === bus.id) {
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 12px; min-width: 200px;">
                <h4 style="font-weight: bold; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  ${bus.id}
                </h4>
                <div style="font-size: 12px; line-height: 1.6;">
                  ${bus.route_name ? `<p><strong>Route:</strong> ${bus.route_name}</p>` : ''}
                  ${bus.driver_name ? `<p><strong>Driver:</strong> ${bus.driver_name}</p>` : ''}
                  <p><strong>Speed:</strong> ${Math.round(bus.speed)} km/h</p>
                  <p><strong>Status:</strong> <span style="text-transform: capitalize;">${bus.status}</span></p>
                  <p style="color: #6b7280; margin-top: 4px; font-size: 11px;">${bus.lat.toFixed(6)}, ${bus.lng.toFixed(6)}</p>
                </div>
              </div>
            `)
          markers.current[bus.id].setPopup(popup).togglePopup()
        }
      })

      // Auto-center on highlighted bus
      if (highlightBus && map.current) {
        const highlighted = buses.find(b => b.id === highlightBus)
        if (highlighted) {
          map.current.flyTo({
            center: [highlighted.lng, highlighted.lat],
            zoom: 15,
            duration: 1000
          })
        }
      }
    }

    updateMarkers()
  }, [buses, highlightBus, selectedBus])

  // Use Socket.IO for real-time GPS updates
  const handleGPSUpdate = useCallback((data: any[]) => {
    const busLocations: BusLocation[] = data.map((gps: any) => ({
      id: `BUS-${gps.bus_id}`,
      bus_id: gps.bus_id,
      lat: parseFloat(gps.latitude),
      lng: parseFloat(gps.longitude),
      speed: parseFloat(gps.speed) || 0,
      heading: parseFloat(gps.heading) || 0,
      routeColor: gps.speed > 5 ? "#3b82f6" : "#06b6d4",
      status: gps.speed > 5 ? "moving" : "stopped" as "moving" | "stopped" | "in-station",
      route_name: gps.route_name,
      driver_name: gps.driver_name
    }))
    setBuses(busLocations)
  }, [])

  const { isConnected } = useGPSTracking(handleGPSUpdate)

  // Track user location continuously and simulate vehicle movement
  useEffect(() => {
    if (!mapLoaded || !map.current) return

    let watchId: number | null = null
    let vehicleInterval: NodeJS.Timeout | null = null

    // Watch user location for continuous updates
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ]
          updateUserLocation(coords)
        },
        (error) => {
          console.log('Geolocation watch error:', error)
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      )
    }

    // Simulate vehicle movement along routes
    const vehicleProgress: { [key: string]: number } = {
      'vehicle-101': 0,
      'vehicle-202': 0,
      'vehicle-303': 0,
      'vehicle-404': 0
    }

    vehicleInterval = setInterval(() => {
      const routes = (window as any).busRoutes
      if (!routes || routes.length === 0) return

      const updatedVehicles = routes.map((route: any, index: number) => {
        const vehicleId = route.vehicleId
        const progress = vehicleProgress[vehicleId] || 0
        const stations = route.stations
        
        // Calculate position along the route
        const totalStations = stations.length - 1
        const currentSegment = Math.floor(progress)
        const segmentProgress = progress - currentSegment
        
        if (currentSegment >= totalStations) {
          // Reset to start when reaching end
          vehicleProgress[vehicleId] = 0
          return {
            id: vehicleId,
            position: stations[0].coords as [number, number],
            label: `Bus ${101 + index}`
          }
        }
        
        // Interpolate position between two stations
        const start = stations[currentSegment].coords
        const end = stations[currentSegment + 1].coords
        
        const lng = start[0] + (end[0] - start[0]) * segmentProgress
        const lat = start[1] + (end[1] - start[1]) * segmentProgress
        
        // Move vehicle along route (0.05 = 5% progress per update)
        vehicleProgress[vehicleId] = progress + 0.05
        
        return {
          id: vehicleId,
          position: [lng, lat] as [number, number],
          label: `Bus ${101 + index}`
        }
      })
      
      updateVehicleMarkers(updatedVehicles)
    }, 2000) // Update every 2 seconds

    // Cleanup
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
      if (vehicleInterval) {
        clearInterval(vehicleInterval)
      }
    }
  }, [mapLoaded])

  // Center on location if provided
  useEffect(() => {
    if (centerOn && map.current) {
      map.current.flyTo({
        center: [centerOn.lng, centerOn.lat],
        zoom: 14,
        duration: 1000
      })
    }
  }, [centerOn])

  // Custom control functions
  const handleZoomIn = () => {
    if (map.current) {
      const zoom = map.current.getZoom()
      map.current.setZoom(zoom + 1)
      setCurrentZoom(zoom + 1)
    }
  }

  const handleZoomOut = () => {
    if (map.current) {
      const zoom = map.current.getZoom()
      map.current.setZoom(zoom - 1)
      setCurrentZoom(zoom - 1)
    }
  }

  const handleLocateMe = () => {
    if (navigator.geolocation && map.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ]
          
          // Update user location marker
          updateUserLocation(coords)
          
          // Fly to user location
          map.current.flyTo({
            center: coords,
            zoom: 15,
            duration: 1000
          })
        },
        (error) => {
          // Silently handle geolocation errors - location is optional
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      alert('Geolocation is not supported by your browser')
    }
  }

  const handleFullscreen = () => {
    const container = mapContainer.current?.parentElement
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().then(() => {
          // Add exit button after entering fullscreen
          setTimeout(() => {
            const exitBtn = document.createElement('button')
            exitBtn.id = 'fullscreen-exit-btn'
            exitBtn.className = 'fullscreen-exit-btn'
            exitBtn.innerHTML = `
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
              </svg>
            `
            exitBtn.onclick = () => {
              if (document.exitFullscreen) {
                document.exitFullscreen()
              }
            }
            document.body.appendChild(exitBtn)
          }, 100)
        })
      } else {
        document.exitFullscreen()
        // Remove exit button
        const exitBtn = document.getElementById('fullscreen-exit-btn')
        if (exitBtn) exitBtn.remove()
      }
    }
    
    // Listen for fullscreen changes to clean up button
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        const exitBtn = document.getElementById('fullscreen-exit-btn')
        if (exitBtn) exitBtn.remove()
      }
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  }

  const handleResetNorth = () => {
    if (map.current) {
      map.current.resetNorth()
    }
  }

  // Create custom marker element
  const createMarkerElement = (type: 'user' | 'vehicle', label?: string) => {
    const el = document.createElement('div')
    el.className = 'custom-marker'
    
    if (type === 'user') {
      el.innerHTML = `
        <div class="flex flex-col items-center">
          <div class="bg-blue-500 rounded-full p-3 shadow-lg border-4 border-white dark:border-slate-800 animate-pulse">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="mt-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">You</div>
        </div>
      `
    } else {
      el.innerHTML = `
        <div class="flex flex-col items-center">
          <div class="bg-green-500 rounded-full p-3 shadow-lg border-4 border-white dark:border-slate-800">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          ${label ? `<div class="mt-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">${label}</div>` : ''}
        </div>
      `
    }
    
    return el
  }

  // Update user location marker
  const updateUserLocation = (coords: [number, number]) => {
    if (!map.current) return

    setUserLocation(coords)

    try {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLngLat(coords)
      } else {
        const el = createMarkerElement('user')
        userMarkerRef.current = new mapboxgl.Marker(el)
          .setLngLat(coords)
          .addTo(map.current)
        
        console.log('User location marker added:', coords)
      }
    } catch (error) {
      console.error('Error updating user location:', error)
    }
  }

  // Update vehicle markers
  const updateVehicleMarkers = (vehicles: Array<{ id: string; position: [number, number]; label: string }>) => {
    if (!map.current) return

    // Remove markers that no longer exist
    const currentIds = new Set(vehicles.map(v => v.id))
    vehicleMarkersRef.current.forEach((marker: any, id: string) => {
      if (!currentIds.has(id)) {
        marker.remove()
        vehicleMarkersRef.current.delete(id)
      }
    })

    // Add or update vehicle markers
    vehicles.forEach(vehicle => {
      const existingMarker = vehicleMarkersRef.current.get(vehicle.id)
      
      if (existingMarker) {
        existingMarker.setLngLat(vehicle.position)
      } else {
        const el = createMarkerElement('vehicle', vehicle.label)
        const marker = new mapboxgl.Marker(el)
          .setLngLat(vehicle.position)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div style="padding: 10px; min-width: 180px;">
                  <h4 style="font-weight: bold; margin-bottom: 6px; color: #10b981;">${vehicle.label}</h4>
                  <p style="font-size: 12px; color: #6b7280; margin: 4px 0;">
                    📍 Position: ${vehicle.position[1].toFixed(4)}, ${vehicle.position[0].toFixed(4)}
                  </p>
                  <p style="font-size: 12px; color: #6b7280; margin: 4px 0;">
                    🚌 Status: <span style="color: #10b981; font-weight: 600;">Active</span>
                  </p>
                  <p style="font-size: 11px; color: #9ca3af; margin-top: 6px;">
                    Click marker for details
                  </p>
                </div>
              `)
          )
          .addTo(map.current!)
        
        vehicleMarkersRef.current.set(vehicle.id, marker)
        console.log('Vehicle marker added:', vehicle.label, vehicle.position)
      }
    })
  }

  return (
    <GlassCard
      className={`relative p-0 flex flex-col overflow-hidden group ${fullScreen ? "h-full" : ""}`}
      style={{ height: fullScreen ? "100%" : height }}
    >
      {/* Header with controls */}
      {showControls && (
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-background/80 to-transparent pointer-events-none backdrop-blur-sm">
          <div className="flex items-center gap-3 pl-2">
            <h3 className="text-lg font-semibold text-foreground">Live Fleet Tracking</h3>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
              isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isConnected ? 'Live' : 'Offline'}
            </div>
            <div className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
              {buses.length} {buses.length === 1 ? 'Bus' : 'Buses'}
            </div>
          </div>
        </div>
      )}

      {/* Mapbox Map Container - Note: Mapbox may warn about empty container during initialization, this is expected */}
      <div ref={mapContainer} className="w-full h-full relative"
        style={{ minHeight: height === "100%" ? "400px" : height }}>
        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}
        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center">
              <p className="text-sm text-red-500">{mapError}</p>
              <p className="text-xs text-muted-foreground mt-2">Please check your internet connection</p>
            </div>
          </div>
        )}
        
        {/* Ensure controls are visible - additional overlay */}
        {mapLoaded && (
          <div className="absolute top-0 right-0 z-[9999] pointer-events-none" style={{ zIndex: 9999 }}>
            <div className="pointer-events-auto" />
          </div>
        )}
      </div>

      {/* Custom Control Panel - Always Visible */}
      {showControls && mapLoaded && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[10000]">
          {/* Zoom Controls */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={handleZoomIn}
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-200 dark:border-slate-700"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4 text-slate-700 dark:text-slate-200" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4 text-slate-700 dark:text-slate-200" />
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={handleResetNorth}
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-200 dark:border-slate-700"
              title="Reset north"
            >
              <NavigationIcon className="h-4 w-4 text-slate-700 dark:text-slate-200" />
            </button>
            <button
              onClick={handleLocateMe}
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-200 dark:border-slate-700"
              title="Locate me"
            >
              <Locate className="h-4 w-4 text-slate-700 dark:text-slate-200" />
            </button>
            <button
              onClick={handleFullscreen}
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Fullscreen"
            >
              <Maximize className="h-4 w-4 text-slate-700 dark:text-slate-200" />
            </button>
          </div>
        </div>
      )}

      {/* Legend - Hidden on mobile */}
      <div className="absolute bottom-6 right-6 hidden sm:flex flex-col gap-2 pointer-events-none">
        <div className="px-4 py-2 rounded-xl bg-card/90 backdrop-blur-md border border-border shadow-lg">
          <div className="text-xs font-semibold text-foreground mb-2">Routes</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
              <span className="text-xs text-muted-foreground">Route 1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              <span className="text-xs text-muted-foreground">Route 2</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
              <span className="text-xs text-muted-foreground">Route 3</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#8b5cf6]" />
              <span className="text-xs text-muted-foreground">Route 4</span>
            </div>
          </div>
        </div>
        <div className="px-4 py-2 rounded-xl bg-card/90 backdrop-blur-md border border-border flex items-center gap-3 shadow-lg">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-green-600 border-2 border-white" />
            <span className="text-xs font-medium text-muted-foreground">Start</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-white border-2 border-slate-400" />
            <span className="text-xs font-medium text-muted-foreground">Stop</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-600 border-2 border-white" />
            <span className="text-xs font-medium text-muted-foreground">End</span>
          </div>
        </div>
      </div>

      {/* Tracking Info Panel - Hidden on mobile */}
      {showControls && (
        <div className="absolute bottom-6 left-6 hidden sm:flex flex-col gap-2 pointer-events-auto">
          <div className="px-4 py-3 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-semibold text-foreground">Location Tracking</span>
            </div>
            <div className="space-y-2">
              {userLocation ? (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">Your location: Active</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                    <span className="text-xs text-muted-foreground">Your location: Not set</span>
                  </div>
                  <button
                    onClick={handleLocateMe}
                    className="text-xs px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    Enable Location
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">Vehicles: {vehicleMarkersRef.current.size} tracked</span>
              </div>
              <div className="flex items-center gap-2">
                <Bus className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">Buses: {buses.length} active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  )
}
