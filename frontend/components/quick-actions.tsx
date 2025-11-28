"use client"

import { Plus, RefreshCw, Download, Ticket } from "lucide-react"
import Link from "next/link"
import { GlassCard } from "./ui/glass-card"

const actions = [
  { label: "Add Bus", icon: Plus, color: "bg-primary/10 text-primary hover:bg-primary/20", href: "/dashboard/fleet" },
  {
    label: "View Tickets",
    icon: Ticket,
    color: "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20",
    href: "/dashboard/tickets",
  },
  {
    label: "Sync Data",
    icon: RefreshCw,
    color: "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
    href: "#",
  },
  { label: "Export", icon: Download, color: "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20", href: "#" },
]

export function QuickActions() {
  return (
    <GlassCard>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link key={action.label} href={action.href}>
              <button
                className={`w-full flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${action.color}`}
              >
                <action.icon className="h-6 w-6" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
