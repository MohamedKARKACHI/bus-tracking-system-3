"use client"

import { CreditCard, CheckCircle2, Clock } from "lucide-react"
import { GlassCard } from "./ui/glass-card"

const transactions = [
  {
    id: "TXN-001",
    date: "2024-01-27 14:32",
    bus: "BUS-101",
    route: "Route 101",
    amount: "$45.00",
    method: "Credit Card",
    status: "completed",
  },
  {
    id: "TXN-002",
    date: "2024-01-27 14:28",
    bus: "BUS-202",
    route: "Route 202",
    amount: "$38.50",
    method: "Cash",
    status: "completed",
  },
  {
    id: "TXN-003",
    date: "2024-01-27 14:15",
    bus: "BUS-303",
    route: "Route 303",
    amount: "$52.00",
    method: "Mobile Pay",
    status: "completed",
  },
  {
    id: "TXN-004",
    date: "2024-01-27 14:10",
    bus: "BUS-404",
    route: "Route 404",
    amount: "$41.25",
    method: "Credit Card",
    status: "pending",
  },
  {
    id: "TXN-005",
    date: "2024-01-27 14:05",
    bus: "BUS-505",
    route: "Route 505",
    amount: "$47.75",
    method: "Debit Card",
    status: "completed",
  },
]

export function PaymentsTable() {
  return (
    <GlassCard>
      <div className="p-6 border-b border-border/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
        <p className="text-sm text-muted-foreground mt-1">Latest payment activity</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Transaction ID</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Date & Time</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Bus / Route</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Amount</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Method</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="border-b border-border/20 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <span className="font-medium text-primary dark:text-cyan-400">{txn.id}</span>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{txn.date}</td>
                <td className="p-4">
                  <div>
                    <p className="text-sm text-slate-800 dark:text-white">{txn.bus}</p>
                    <p className="text-xs text-muted-foreground">{txn.route}</p>
                  </div>
                </td>
                <td className="p-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{txn.amount}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CreditCard className="h-3.5 w-3.5" />
                    {txn.method}
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      txn.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {txn.status === "completed" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
