"use client"

import { Search } from "lucide-react"

export function FleetFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search by bus ID, registration, or model..."
          className="w-full pl-10 pr-4 py-2.5 bg-card/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
        />
      </div>
      <select className="bg-card/50 border border-border text-foreground text-sm rounded-xl focus:ring-primary focus:border-primary p-2.5 min-w-[140px]">
        <option>All Status</option>
        <option>Active</option>
        <option>Maintenance</option>
        <option>Inactive</option>
      </select>
      <select className="bg-card/50 border border-border text-foreground text-sm rounded-xl focus:ring-primary focus:border-primary p-2.5 min-w-[140px]">
        <option>All Types</option>
        <option>Standard</option>
        <option>Double Decker</option>
        <option>Electric</option>
      </select>
    </div>
  )
}
