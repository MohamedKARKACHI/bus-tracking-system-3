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
}

const BusContext = createContext<BusContextType | undefined>(undefined)

export function BusDataProvider({ children }: { children: ReactNode }) {
  const [buses, setBuses] = useState<BusData[]>([])
  const [currentBusId, setCurrentBusId] = useState<string>("BUS-1")

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
      getBusById
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
