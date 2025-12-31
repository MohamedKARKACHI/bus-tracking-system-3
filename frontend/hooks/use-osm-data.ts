"use client"

import { useState, useEffect, useCallback } from 'react'

export interface OSMRoute {
    id: number
    name: string
    ref: string
    operator: string
    network: string
    from: string
    to: string
    color: string
    coordinates: [number, number][]
    stops: { name: string; coordinates: [number, number] }[]
}

export interface OSMStop {
    id: number
    name: string
    ref: string
    operator: string
    network: string
    coordinates: [number, number]
    shelter: boolean
    bench: boolean
    type: string
}

interface UseOSMRoutesResult {
    routes: OSMRoute[]
    loading: boolean
    error: string | null
    refetch: () => void
}

interface UseOSMStopsResult {
    stops: OSMStop[]
    loading: boolean
    error: string | null
    refetch: () => void
}

// Cache for OSM data to avoid repeated API calls
const routeCache = new Map<string, { data: OSMRoute[]; timestamp: number }>()
const stopCache = new Map<string, { data: OSMStop[]; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Hook to fetch bus routes from OpenStreetMap
 */
export function useOSMRoutes(city: string = 'Marrakech'): UseOSMRoutesResult {
    const [routes, setRoutes] = useState<OSMRoute[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchRoutes = useCallback(async () => {
        const cacheKey = city.toLowerCase()
        const cached = routeCache.get(cacheKey)

        // Return cached data if valid
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            setRoutes(cached.data)
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/osm/routes?city=${encodeURIComponent(city)}`)
            const data = await response.json()

            if (data.success && data.routes) {
                setRoutes(data.routes)
                routeCache.set(cacheKey, { data: data.routes, timestamp: Date.now() })
            } else {
                throw new Error(data.error || 'Failed to fetch routes')
            }
        } catch (err) {
            console.error('Error fetching OSM routes:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch routes')
            setRoutes([])
        } finally {
            setLoading(false)
        }
    }, [city])

    useEffect(() => {
        fetchRoutes()
    }, [fetchRoutes])

    return { routes, loading, error, refetch: fetchRoutes }
}

/**
 * Hook to fetch bus stops from OpenStreetMap
 */
export function useOSMStops(
    lat: number = 31.6295,
    lon: number = -7.9811,
    radius: number = 5000
): UseOSMStopsResult {
    const [stops, setStops] = useState<OSMStop[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchStops = useCallback(async () => {
        const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)},${radius}`
        const cached = stopCache.get(cacheKey)

        // Return cached data if valid
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            setStops(cached.data)
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await fetch(
                `/api/osm/stops?lat=${lat}&lon=${lon}&radius=${radius}`
            )
            const data = await response.json()

            if (data.success && data.stops) {
                setStops(data.stops)
                stopCache.set(cacheKey, { data: data.stops, timestamp: Date.now() })
            } else {
                throw new Error(data.error || 'Failed to fetch stops')
            }
        } catch (err) {
            console.error('Error fetching OSM stops:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch stops')
            setStops([])
        } finally {
            setLoading(false)
        }
    }, [lat, lon, radius])

    useEffect(() => {
        fetchStops()
    }, [fetchStops])

    return { stops, loading, error, refetch: fetchStops }
}

/**
 * City coordinates for quick lookup
 */
export const CITY_COORDINATES: Record<string, { lat: number; lon: number; zoom: number }> = {
    'Marrakech': { lat: 31.6295, lon: -7.9811, zoom: 13 },
    'Casablanca': { lat: 33.5731, lon: -7.5898, zoom: 12 },
    'Tangier': { lat: 35.7595, lon: -5.8340, zoom: 13 },
    'Rabat': { lat: 34.0209, lon: -6.8416, zoom: 13 },
    'Fes': { lat: 34.0181, lon: -5.0078, zoom: 13 },
    'Agadir': { lat: 30.4278, lon: -9.5981, zoom: 13 },
}

export const AVAILABLE_CITIES = Object.keys(CITY_COORDINATES)
