import { DashboardShell } from "@/components/dashboard-shell"
import { PaymentsTable } from "@/components/payments-table"
import { PaymentsSummary } from "@/components/payments-summary"

export default function PaymentsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Payments</h1>
            <p className="text-muted-foreground mt-1">Track revenue, transactions, and billing</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <select className="bg-card/50 border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>This month</option>
              <option>Last month</option>
            </select>
            <button className="text-white bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm px-5 py-2.5 shadow-[0_0_15px_-3px_var(--color-primary)] transition-all">
              Download Invoice
            </button>
          </div>
        </div>

        <PaymentsSummary />
        <PaymentsTable />
      </div>
    </DashboardShell>
  )
}
