"use client"

import { FileText } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back, here's what's happening with your fleet today.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
        <select className="bg-card/50 border border-border text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary p-2.5 min-w-[160px] cursor-pointer transition-all hover:bg-card/70">
          <option>All Stations</option>
          <option>Central Station</option>
          <option>North Terminal</option>
          <option>South Terminal</option>
          <option>East Hub</option>
        </select>
        <button className="flex items-center gap-2 text-white bg-primary hover:bg-primary/90 focus:ring-4 focus:ring-primary/30 font-medium rounded-xl text-sm px-5 py-2.5 focus:outline-none shadow-[0_0_15px_-3px_var(--color-primary)] transition-all">
          <FileText className="h-4 w-4" />
          Generate Report
        </button>
      </div>
    </div>
  )
}
