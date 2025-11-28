import { DashboardShell } from "@/components/dashboard-shell"
import { FleetList } from "@/components/fleet-list"
import { FleetFilters } from "@/components/fleet-filters"

export default function FleetPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Fleet Management</h1>
            <p className="text-muted-foreground mt-1">Manage your entire bus fleet from one place</p>
          </div>
          <button className="text-white bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm px-5 py-2.5 shadow-[0_0_15px_-3px_var(--color-primary)] transition-all mt-4 md:mt-0 w-fit">
            + Add New Bus
          </button>
        </div>

        <FleetFilters />
        <FleetList />
      </div>
    </DashboardShell>
  )
}
