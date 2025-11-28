import { DashboardShell } from "@/components/dashboard-shell"
import { CameraGrid } from "@/components/camera-grid"
import { CameraStats } from "@/components/camera-stats"

export default function CamerasPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">ANPR Cameras</h1>
            <p className="text-muted-foreground mt-1">Monitor automatic number plate recognition cameras</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="text-foreground bg-card/50 hover:bg-accent border border-border font-medium rounded-lg text-sm px-5 py-2.5 transition-all">
              View History
            </button>
            <button className="text-white bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm px-5 py-2.5 shadow-[0_0_15px_-3px_var(--color-primary)] transition-all">
              + Add Camera
            </button>
          </div>
        </div>

        <CameraStats />
        <CameraGrid />
      </div>
    </DashboardShell>
  )
}
