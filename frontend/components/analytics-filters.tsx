"use client"

export function AnalyticsFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <select className="bg-card/50 border border-border text-foreground text-sm rounded-xl focus:ring-primary focus:border-primary p-2.5 min-w-[160px]">
        <option>Last 7 days</option>
        <option>Last 30 days</option>
        <option>Last 3 months</option>
        <option>Last year</option>
        <option>Custom range</option>
      </select>
      <select className="bg-card/50 border border-border text-foreground text-sm rounded-xl focus:ring-primary focus:border-primary p-2.5 min-w-[160px]">
        <option>All Routes</option>
        <option>Route 101</option>
        <option>Route 202</option>
        <option>Route 303</option>
      </select>
      <select className="bg-card/50 border border-border text-foreground text-sm rounded-xl focus:ring-primary focus:border-primary p-2.5 min-w-[160px]">
        <option>All Metrics</option>
        <option>Performance</option>
        <option>Revenue</option>
        <option>Efficiency</option>
      </select>
    </div>
  )
}
