import { DashboardShell } from "@/components/dashboard-shell"
import { SettingsTabs } from "@/components/settings-tabs"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your system preferences and configurations</p>
        </div>

        <SettingsTabs />
      </div>
    </DashboardShell>
  )
}
