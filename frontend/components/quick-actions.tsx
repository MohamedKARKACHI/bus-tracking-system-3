"use client"


import { Plus, RefreshCw, Download, Ticket } from "lucide-react"
import Link from "next/link"
import { GlassCard } from "./ui/glass-card"

const actions = [
  { label: "Add Bus", icon: Plus, bg: "from-blue-500 via-cyan-400 to-blue-600", href: "/dashboard/fleet" },
  { label: "View Tickets", icon: Ticket, bg: "from-pink-500 via-fuchsia-500 to-purple-600", href: "/dashboard/tickets" },
  { label: "Sync Data", icon: RefreshCw, bg: "from-emerald-500 via-green-400 to-teal-500", href: "#" },
  { label: "Export", icon: Download, bg: "from-yellow-400 via-orange-400 to-pink-500", href: "#" },
]

export function QuickActions() {
  return (
    <GlassCard className="backdrop-blur-xl bg-gradient-to-br from-white/30 to-blue-100/10 dark:from-blue-900/30 dark:to-blue-900/10 border border-blue-400/20 shadow-2xl">
      <div className="p-3">
        <h3 className="text-base font-bold text-foreground mb-3 tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-2">
          {actions.map((action) => (
            <Link key={action.label} href={action.href}>
              <button
                className={
                  `w-full flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all text-center group hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400/60 bg-white/10 dark:bg-blue-900/20 shadow-lg hover:shadow-xl border border-transparent hover:border-blue-400/30`
                }
              >
                <span className={`flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br ${action.bg} text-white shadow-md group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold tracking-tight text-blue-900 dark:text-blue-100 drop-shadow-sm group-hover:text-blue-600 transition-colors duration-200">{action.label}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
