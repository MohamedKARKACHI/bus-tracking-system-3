"use client"

import { CreditCard, CheckCircle2, Clock, ArrowUpRight, ArrowDownLeft } from "lucide-react"
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
    <GlassCard className="overflow-hidden">
      <div className="p-6 border-b border-slate-200/50 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Latest payment activity across the fleet</p>
          </div>
          <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
            View All
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200/50 dark:border-white/10">
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transaction ID</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Time</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bus / Route</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Method</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
            {transactions.map((txn) => (
              <tr key={txn.id} className="group hover:bg-slate-50/80 dark:hover:bg-white/5 transition-all duration-200">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white text-sm">{txn.id}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">{txn.date}</td>
                <td className="py-4 px-6">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{txn.bus}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{txn.route}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-bold text-slate-900 dark:text-emerald-400">{txn.amount}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CreditCard className="h-4 w-4 text-slate-400" />
                    {txn.method}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${txn.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      }`}
                  >
                    {txn.status === "completed" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    <span className="capitalize">{txn.status}</span>
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
