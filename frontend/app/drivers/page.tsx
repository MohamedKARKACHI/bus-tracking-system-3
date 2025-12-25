"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DriversTable } from "@/components/drivers-table"
import { DriversStats } from "@/components/drivers-stats"
import { CreateDriverModal } from "@/components/create-driver-modal"

export default function DriversPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Create a key to force re-render of table when new driver is added
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Drivers & Users</h1>
            <p className="text-muted-foreground mt-1">Manage drivers, staff, and user accounts</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-white bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm px-5 py-2.5 shadow-[0_0_15px_-3px_var(--color-primary)] transition-all mt-4 md:mt-0 w-fit"
          >
            + Add User
          </button>
        </div>

        <DriversStats />
        <DriversTable key={refreshKey} />

        <CreateDriverModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => setRefreshKey(prev => prev + 1)}
        />
      </div>
    </DashboardShell>
  )
}
