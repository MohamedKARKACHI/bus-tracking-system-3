"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Bus, MapPin, Layers, Navigation2, Maximize2, Minimize2, RefreshCw, Play, Pause } from 'lucide-react'
import { fetchWithAuth } from "@/lib/api-client"

mapboxgl.accessToken = 'pk.eyJ1Ijoic2ltbzMzIiwiYSI6ImNtaWRwcnc2czA3bDYybXNiaGsxc2kxN2oifQ.vIT5iMLrm07zHJkrSqftHA'

interface SimulationMapProps {
    className?: string
    height?: string
    showControls?: boolean
    enable3D?: boolean
    centerLat?: number
    centerLng?: number
    zoom?: number
    selectedRouteId?: string | null
}

export default function SimulationMap({
    className = '',
    height = '600px',
    showControls = true,
    enable3D = true,
    centerLat = 31.6295,
    centerLng = -7.9811,
    zoom = 12,
    selectedRouteId = null
}: SimulationMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<mapboxgl.Map | null>(null)
    const [mapLoaded, setMapLoaded] = useState(false)
    const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'dark'>('dark')
    const [is3D, setIs3D] = useState(enable3D)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isSimulating, setIsSimulating] = useState(true)
    const [buses, setBuses] = useState<any[]>([])
    const [stops, setStops] = useState<any[]>([])
    const [routes, setRoutes] = useState<any[]>([])
    const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())
    const animationFrameRef = useRef<number>()

    const styleUrls = {
        streets: 'mapbox://styles/mapbox/streets-v12',
        satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
        dark: 'mapbox://styles/mapbox/dark-v11'
    }

    const fetchMapData = useCallback(async () => {
        try {
            const [busesRes, stopsRes, routesRes] = await Promise.all([
                fetchWithAuth('/api/buses/live'),
                fetchWithAuth('/api/route-stops/live'),
                fetchWithAuth('/api/routes/paths')
            ])

            const busesData = await busesRes.json()
            const stopsData = await stopsRes.json()
            const routesData = await routesRes.json()

            setBuses(busesData)
            setStops(stopsData)
            setRoutes(routesData)
        } catch (error) {
            console.error('Error fetching map data:', error)
        }
    }, [])

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current || map.current) return

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: styleUrls[mapStyle],
            center: [centerLng, centerLat],
            zoom: zoom,
            pitch: is3D ? 50 : 0,
            bearing: 0,
            antialias: true,
            attributionControl: false
        })

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
                trackUserLocation: true,
                showUserHeading: true
            }),
            'top-right'
        )

        map.current.on('load', () => {
            setMapLoaded(true)

            // Add 3D buildings
            if (is3D && map.current) {
                const layers = map.current.getStyle().layers
                const labelLayerId = layers?.find(
                    (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
                )?.id

                map.current.addLayer(
                    {
                        id: '3d-buildings',
                        source: 'composite',
                        'source-layer': 'building',
                        filter: ['==', 'extrude', 'true'],
                        type: 'fill-extrusion',
                        minzoom: 15,
                        paint: {
                            'fill-extrusion-color': [
                                'interpolate',
                                ['linear'],
                                ['get', 'height'],
                                0, '#444',
                                50, '#666',
                                100, '#888'
                            ],
                            'fill-extrusion-height': [
                                'interpolate',
                                ['linear'],
                                ['zoom'],
                                15,
                                0,
                                15.05,
                                ['get', 'height']
                            ],
                            'fill-extrusion-base': [
                                'interpolate',
                                ['linear'],
                                ['zoom'],
                                15,
                                0,
                                15.05,
                                ['get', 'min_height']
                            ],
                            'fill-extrusion-opacity': 0.8
                        }
                    },
                    labelLayerId
                )
            }

            fetchMapData()
        })

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            map.current?.remove()
            map.current = null
        }
    }, [])

    // Update map style
    useEffect(() => {
        if (!map.current || !mapLoaded) return
        map.current.setStyle(styleUrls[mapStyle])
    }, [mapStyle, mapLoaded])

    // Toggle 3D
    useEffect(() => {
        if (!map.current || !mapLoaded) return

        map.current.easeTo({
            pitch: is3D ? 50 : 0,
            duration: 1000
        })
    }, [is3D, mapLoaded])

    // Add animated route lines
    useEffect(() => {
        if (!map.current || !mapLoaded || routes.length === 0) return

        routes.forEach((route, index) => {
            if (!route.coordinates || route.coordinates.length < 2) return

            // Filter if selectedRouteId is provided
            if (selectedRouteId && route.id !== selectedRouteId) {
                const sourceId = `route-${route.id}`
                const layerId = `route-layer-${route.id}`
                const glowLayerId = `route-glow-${route.id}`
                if (map.current!.getLayer(glowLayerId)) map.current!.removeLayer(glowLayerId)
                if (map.current!.getLayer(layerId)) map.current!.removeLayer(layerId)
                if (map.current!.getSource(sourceId)) map.current!.removeSource(sourceId)
                return
            }

            const sourceId = `route-${route.id}`
            const layerId = `route-layer-${route.id}`
            const glowLayerId = `route-glow-${route.id}`

            // Remove existing layers
            if (map.current!.getLayer(glowLayerId)) map.current!.removeLayer(glowLayerId)
            if (map.current!.getLayer(layerId)) map.current!.removeLayer(layerId)
            if (map.current!.getSource(sourceId)) map.current!.removeSource(sourceId)

            map.current!.addSource(sourceId, {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: route.coordinates
                    }
                }
            })

            // Glow effect layer
            map.current!.addLayer({
                id: glowLayerId,
                type: 'line',
                source: sourceId,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': route.color || '#3b82f6',
                    'line-width': 12,
                    'line-opacity': 0.3,
                    'line-blur': 8
                }
            })

            // Main animated line
            map.current!.addLayer({
                id: layerId,
                type: 'line',
                source: sourceId,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': route.color || '#3b82f6',
                    'line-width': 5,
                    'line-opacity': 0.9,
                    'line-gradient': [
                        'interpolate',
                        ['linear'],
                        ['line-progress'],
                        0, route.color || '#3b82f6',
                        0.5, '#ffffff',
                        1, route.color || '#3b82f6'
                    ]
                }
            })

            // Animate the line
            let step = 0
            const animateLine = () => {
                if (!isSimulating) return

                step = (step + 0.01) % 1

                if (map.current && map.current.getLayer(layerId)) {
                    map.current.setPaintProperty(layerId, 'line-dasharray', [
                        Math.sin(step * Math.PI * 2) * 2 + 2,
                        Math.cos(step * Math.PI * 2) * 2 + 2
                    ])
                }

                animationFrameRef.current = requestAnimationFrame(animateLine)
            }

            if (isSimulating) {
                animateLine()
            }
        })
    }, [routes, mapLoaded, isSimulating, selectedRouteId])

    // Add animated bus markers
    useEffect(() => {
        if (!map.current || !mapLoaded || buses.length === 0) return

        // Clear existing markers if filtering changes
        if (selectedRouteId) {
            markersRef.current.forEach((marker, id) => {
                const busId = id.replace('bus-', '')
                const bus = buses.find(b => b.id === busId)
                if (bus && bus.routeId !== selectedRouteId) {
                    marker.remove()
                    markersRef.current.delete(id)
                }
            })
        }

        buses.forEach((bus, index) => {
            if (!bus.coordinates || bus.coordinates.length !== 2) return

            // Filter if selectedRouteId is provided
            if (selectedRouteId && bus.routeId !== selectedRouteId) return

            const markerId = `bus-${bus.id}`
            let marker = markersRef.current.get(markerId)

            if (!marker) {
                // Create 3D-style bus marker
                const el = document.createElement('div')
                el.className = 'bus-marker-3d'
                el.innerHTML = `
          <div style="
            position: relative;
            width: 50px;
            height: 50px;
            transform-style: preserve-3d;
            animation: float 3s ease-in-out infinite;
          ">
            <!-- Pulse ring -->
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background: ${bus.route?.color || '#3b82f6'};
              opacity: 0.3;
              animation: pulse 2s ease-out infinite;
            "></div>
            
            <!-- Main marker -->
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, ${bus.route?.color || '#3b82f6'} 0%, ${adjustColor(bus.route?.color || '#3b82f6', -30)} 100%);
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 8px 16px rgba(0,0,0,0.4), 0 0 20px ${bus.route?.color || '#3b82f6'}80;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.3s;
            ">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
              </svg>
            </div>
            
            <!-- Direction indicator -->
            <div style="
              position: absolute;
              top: -5px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-bottom: 10px solid ${bus.route?.color || '#3b82f6'};
              filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            "></div>
          </div>
          
          <style>
            @keyframes pulse {
              0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
              50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-5px); }
            }
            .bus-marker-3d:hover > div > div:nth-child(2) {
              transform: translate(-50%, -50%) scale(1.2);
              box-shadow: 0 12px 24px rgba(0,0,0,0.5), 0 0 30px ${bus.route?.color || '#3b82f6'};
            }
          </style>
        `

                const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
          <div style="padding: 12px; min-width: 220px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 12px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <div style="width: 40px; height: 40px; background: ${bus.route?.color || '#3b82f6'}; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                </svg>
              </div>
              <div>
                <div style="font-weight: bold; font-size: 18px; color: white; margin-bottom: 2px;">
                  Bus ${bus.busNumber}
                </div>
                <div style="font-size: 12px; color: ${bus.route?.color || '#3b82f6'}; font-weight: 600;">
                  ${bus.route?.name || 'N/A'}
                </div>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
              <div style="background: rgba(255,255,255,0.1); padding: 6px; border-radius: 6px;">
                <div style="color: #94a3b8; margin-bottom: 2px;">Plate</div>
                <div style="color: white; font-weight: 600;">${bus.plateNumber || 'N/A'}</div>
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 6px; border-radius: 6px;">
                <div style="color: #94a3b8; margin-bottom: 2px;">Capacity</div>
                <div style="color: white; font-weight: 600;">${bus.capacity || 'N/A'}</div>
              </div>
            </div>
            <div style="margin-top: 8px; display: flex; align-items: center; gap: 6px; font-size: 12px;">
              <div style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 10px #22c55e;"></div>
              <span style="color: #22c55e; font-weight: 600;">ACTIVE</span>
            </div>
          </div>
        `)

                marker = new mapboxgl.Marker(el)
                    .setLngLat(bus.coordinates as [number, number])
                    .setPopup(popup)
                    .addTo(map.current!)

                markersRef.current.set(markerId, marker)
            } else {
                // Animate marker movement
                marker.setLngLat(bus.coordinates as [number, number])
            }
        })
    }, [buses, mapLoaded])

    // Add stop markers with glow
    useEffect(() => {
        if (!map.current || !mapLoaded || stops.length === 0) return

        // Clear existing markers if filtering changes (not strictly necessary for stops as we recreate them mostly, but good practice)
        // For simplicity, we'll just rely on the fact that we're iterating stops. 
        // Ideally we should track stop markers separately to remove them efficiently.
        // For now, let's just filter what we add.

        stops.forEach(stop => {
            if (!stop.coordinates || stop.coordinates.length !== 2) return

            // Filter if selectedRouteId is provided
            if (selectedRouteId && stop.routeId !== selectedRouteId) return

            const el = document.createElement('div')
            el.innerHTML = `
        <div style="position: relative; width: 30px; height: 30px;">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30px;
            height: 30px;
            background: ${stop.route?.color || '#3b82f6'}40;
            border-radius: 50%;
            animation: stopPulse 2s ease-out infinite;
          "></div>
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 16px;
            height: 16px;
            background: white;
            border: 3px solid ${stop.route?.color || '#3b82f6'};
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 15px ${stop.route?.color || '#3b82f6'}80;
            cursor: pointer;
            transition: all 0.2s;
          "></div>
        </div>
        <style>
          @keyframes stopPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
            50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
          }
        </style>
      `

            const popup = new mapboxgl.Popup({ offset: 15, closeButton: false }).setHTML(`
        <div style="padding: 8px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 8px;">
          <div style="font-weight: bold; font-size: 14px; color: white; margin-bottom: 4px;">
            ${stop.name}
          </div>
          <div style="font-size: 12px; color: ${stop.route?.color || '#3b82f6'}; font-weight: 600;">
            Route ${stop.route?.number || 'N/A'}
          </div>
        </div>
      `)

            new mapboxgl.Marker(el)
                .setLngLat(stop.coordinates as [number, number])
                .setPopup(popup)
                .addTo(map.current!)
        })
    }, [stops, mapLoaded])

    const toggleFullscreen = () => setIsFullscreen(!isFullscreen)
    const handleRefresh = () => fetchMapData()

    return (
        <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : ''} ${className}`}>
            <div
                ref={mapContainer}
                style={{ height: isFullscreen ? '100vh' : height }}
                className="w-full rounded-xl overflow-hidden shadow-2xl"
            />

            {showControls && (
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {/* Style Toggle */}
                    <div className="bg-slate-900/90 backdrop-blur-xl rounded-lg shadow-2xl p-2 border border-slate-700">
                        <div className="flex gap-1">
                            {(['streets', 'satellite', 'dark'] as const).map((style) => (
                                <button
                                    key={style}
                                    onClick={() => setMapStyle(style)}
                                    className={`px-3 py-2 rounded text-sm font-medium transition-all ${mapStyle === style
                                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        }`}
                                >
                                    {style.charAt(0).toUpperCase() + style.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-slate-900/90 backdrop-blur-xl rounded-lg shadow-2xl p-2 border border-slate-700 flex flex-col gap-2">
                        <button
                            onClick={() => setIs3D(!is3D)}
                            className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
                        >
                            <Layers className="w-4 h-4" />
                            {is3D ? '2D' : '3D'}
                        </button>
                        <button
                            onClick={() => setIsSimulating(!isSimulating)}
                            className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
                        >
                            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
                        >
                            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="bg-slate-900/90 backdrop-blur-xl rounded-lg shadow-2xl p-3 border border-slate-700">
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Bus className="w-4 h-4 text-cyan-400" />
                                <span className="font-semibold text-white">{buses.length}</span>
                                <span className="text-slate-400">Buses</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-green-400" />
                                <span className="font-semibold text-white">{stops.length}</span>
                                <span className="text-slate-400">Stops</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function adjustColor(color: string, amount: number): string {
    const clamp = (num: number) => Math.min(Math.max(num, 0), 255)
    const num = parseInt(color.replace('#', ''), 16)
    const r = clamp((num >> 16) + amount)
    const g = clamp(((num >> 8) & 0x00FF) + amount)
    const b = clamp((num & 0x0000FF) + amount)
    return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1)
}
