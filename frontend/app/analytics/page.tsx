import { DashboardShell } from "@/components/dashboard-shell"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { AnalyticsFilters } from "@/components/analytics-filters"

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Analytics</h1>
            <p className="text-muted-foreground mt-1">Deep insights into your fleet performance</p>
          </div>
          <button className="text-white bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm px-5 py-2.5 shadow-[0_0_15px_-3px_var(--color-primary)] transition-all mt-4 md:mt-0 w-fit">
            Export Report
          </button>
        </div>

        <AnalyticsFilters />
        <AnalyticsCharts />
      </div>
    </DashboardShell>
  )
}
