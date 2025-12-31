"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { ThemeProvider } from "@/lib/theme-context"
import { PremiumLayoutShell } from "@/components/premium/layout-shell"
import { Toaster } from "@/components/ui/toaster"

import { TicketProvider } from "@/lib/ticket-context"

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
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
    <ThemeProvider>
      <PremiumLayoutShell>
        <TicketProvider>
          {children}
        </TicketProvider>
        <Toaster />
      </PremiumLayoutShell>
    </ThemeProvider>
  )
}
