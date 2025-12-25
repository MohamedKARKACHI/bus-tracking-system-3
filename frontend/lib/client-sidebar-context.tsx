"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ClientSidebarContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarExpanded: boolean
  setSidebarExpanded: (expanded: boolean) => void
  toggleSidebar: () => void
  toggleExpanded: () => void
}

const ClientSidebarContext = createContext<ClientSidebarContextType | undefined>(undefined)

export function ClientSidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const toggleExpanded = () => setSidebarExpanded(!sidebarExpanded)

  return (
    <ClientSidebarContext.Provider
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
    </ClientSidebarContext.Provider>
  )
}

export function useClientSidebar() {
  const context = useContext(ClientSidebarContext)
  if (!context) {
    throw new Error("useClientSidebar must be used within ClientSidebarProvider")
  }
  return context
}
