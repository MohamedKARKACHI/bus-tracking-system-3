"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

import { ClientSidebarProvider, useClientSidebar } from "@/lib/client-sidebar-context"
import { ClientPortalSidebar } from "@/components/client-portal-sidebar"
import { Menu, X } from "lucide-react"

function ClientPortalLayoutContent({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen, sidebarExpanded } = useClientSidebar()
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login')
      } else if (user.role !== 'client') {
        if (user.role === 'admin') router.replace('/admin')
        else if (user.role === 'driver') router.replace('/driver-portal')
        else router.replace('/login')
      }
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== 'client') {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-card/80 backdrop-blur-xl shadow-lg border border-border"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={`
        fixed top-0 left-0 h-screen bg-card/70 backdrop-blur-2xl border-r border-border
        transition-all duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${sidebarExpanded ? "w-72" : "w-20"}
      `}
      >
        <ClientPortalSidebar />
      </aside>

      <main className={`transition-all duration-300 ${sidebarExpanded ? "lg:ml-72" : "lg:ml-20"} p-4 md:p-8`}>
        <div className="mt-12 lg:mt-0">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientSidebarProvider>
      <ClientPortalLayoutContent>{children}</ClientPortalLayoutContent>
    </ClientSidebarProvider>
  )
}
