"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface UnifiedSidebarContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarExpanded: boolean
  setSidebarExpanded: (expanded: boolean) => void
  toggleSidebar: () => void
  toggleExpanded: () => void
}

const UnifiedSidebarContext = createContext<UnifiedSidebarContextType | undefined>(undefined)

export function UnifiedSidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const toggleExpanded = () => setSidebarExpanded(!sidebarExpanded)

  return (
    <UnifiedSidebarContext.Provider
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
    </UnifiedSidebarContext.Provider>
  )
}

export function useUnifiedSidebar() {
  const context = useContext(UnifiedSidebarContext)
  if (!context) {
    throw new Error("useUnifiedSidebar must be used within UnifiedSidebarProvider")
  }
  return context
}

export const useDriverSidebar = useUnifiedSidebar
export const useClientSidebar = useUnifiedSidebar
export const DriverSidebarProvider = UnifiedSidebarProvider
export const ClientSidebarProvider = UnifiedSidebarProvider
