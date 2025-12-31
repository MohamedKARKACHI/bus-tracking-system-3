"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useGPSTracking } from "@/hooks/use-socket"
import { getRouteById, MARRAKECH_ROUTES } from "@/lib/routes-config"

interface BusData {
  id: string
  busId: number
  routeId: number
  lat: number
  lng: number
  speed: number
  heading: number
  status: "moving" | "stopped" | "in-station"
  routeName?: string
  driverName?: string
  lastUpdate: Date
}

interface BusContextType {
  buses: BusData[]
  currentBus: BusData | null
  setCurrentBusId: (id: string) => void
  isConnected: boolean
  getBusById: (id: string) => BusData | undefined
  // Search State
  userInfo: { name: string; role: string } | null
  globalSearchQuery: string
  setGlobalSearchQuery: (query: string) => void
  globalSearchResults: any[]
  searchDate: Date | undefined
  setSearchDate: (date: Date | undefined) => void
  triggerRouteCalculation: (destination: any) => void
}

const BusContext = createContext<BusContextType | undefined>(undefined)

// Simple event bus for route triggering
export const routeEventBus = {
  listeners: [] as Function[],
  subscribe(callback: Function) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback)
    }
  },
  emit(destination: any) {
    this.listeners.forEach(cb => cb(destination))
  }
}

export function BusDataProvider({ children }: { children: ReactNode }) {
  const [buses, setBuses] = useState<BusData[]>([])
  const [currentBusId, setCurrentBusId] = useState<string>("BUS-1")
  const [globalSearchQuery, setGlobalSearchQuery] = useState("")
  const [globalSearchResults, setGlobalSearchResults] = useState<any[]>([])
  const [searchDate, setSearchDate] = useState<Date | undefined>(undefined)

  const triggerRouteCalculation = (destination: any) => {
    routeEventBus.emit(destination)
  }

  const { isConnected } = useGPSTracking((gpsData) => {
    if (!gpsData || !Array.isArray(gpsData)) return

    const transformedBuses: BusData[] = gpsData.map((data: any) => {
      const busId = data.bus?.id || data.busId || data.id
      const routeId = data.bus?.routeId || data.routeId || ((busId - 1) % 4) + 1
      const route = getRouteById(routeId)

      return {
        id: `BUS-${busId}`,
        busId,
        routeId,
        lat: data.latitude || data.lat,
        lng: data.longitude || data.lng || data.lon,
        speed: data.speed || 0,
        heading: data.heading || 0,
        status: data.speed > 5 ? 'moving' : (data.speed === 0 ? 'stopped' : 'in-station'),
        routeName: route?.name || data.bus?.route || `Route ${routeId}`,
        driverName: data.bus?.driver || data.driver_name || 'Chauffeur',
        lastUpdate: new Date()
      }
    })

    setBuses(transformedBuses)
  })

  const currentBus = buses.find(bus => bus.id === currentBusId) || null

  const getBusById = (id: string) => buses.find(bus => bus.id === id)

  return (
    <BusContext.Provider value={{
      buses,
      currentBus,
      setCurrentBusId,
      isConnected,
      getBusById,
      userInfo: { name: "Admin User", role: "Administrator" },
      globalSearchQuery,
      setGlobalSearchQuery,
      globalSearchResults,
      searchDate,
      setSearchDate,
      triggerRouteCalculation
    }}>
      {children}
    </BusContext.Provider>
  )
}

export function useBusData() {
  const context = useContext(BusContext)
  if (context === undefined) {
    throw new Error('useBusData must be used within a BusDataProvider')
  }
  return context
}
