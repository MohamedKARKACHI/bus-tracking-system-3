"use client"

import { DollarSign, TrendingUp, CreditCard, Wallet } from "lucide-react"
import { GlassCard } from "./ui/glass-card"

const stats = [
  { label: "Total Revenue", value: "$124,580", change: "+12.5%", icon: DollarSign, color: "text-primary" },
  { label: "This Month", value: "$18,240", change: "+8.2%", icon: TrendingUp, color: "text-emerald-400" },
  { label: "Transactions", value: "2,847", change: "+15.3%", icon: CreditCard, color: "text-cyan-400" },
  { label: "Avg. Per Trip", value: "$43.75", change: "+2.1%", icon: Wallet, color: "text-amber-400" },
]

export function PaymentsSummary() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <GlassCard key={stat.label}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`h-12 w-12 rounded-xl bg-card/50 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">{stat.change}</span>
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mt-1">
              {stat.value}
            </p>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
