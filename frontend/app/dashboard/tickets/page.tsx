import { DashboardShell } from "@/components/dashboard-shell"
import { TicketBookingsAdmin } from "@/components/ticket-bookings-admin"

export default function TicketsManagementPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Ticket Management</h1>
          <p className="text-muted-foreground mt-1">View and manage all passenger ticket bookings</p>
        </div>

        <TicketBookingsAdmin />
      </div>
    </DashboardShell>
  )
}
