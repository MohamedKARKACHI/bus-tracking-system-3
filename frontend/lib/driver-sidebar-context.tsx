"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface DriverSidebarContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarExpanded: boolean
  setSidebarExpanded: (expanded: boolean) => void
  toggleSidebar: () => void
  toggleExpanded: () => void
}

const DriverSidebarContext = createContext<DriverSidebarContextType | undefined>(undefined)

export function DriverSidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const toggleExpanded = () => setSidebarExpanded(!sidebarExpanded)

  return (
    <DriverSidebarContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        sidebarExpanded,
        setSidebarExpanded,
        toggleSidebar,
        toggleExpanded,
      }}
    >
      {children}
    </DriverSidebarContext.Provider>
  )
}

export function useDriverSidebar() {
  const context = useContext(DriverSidebarContext)
  if (!context) {
    throw new Error("useDriverSidebar must be used within DriverSidebarProvider")
  }
  return context
}
