"use client"

import { Bus, Wrench, ParkingCircle, Route, Users } from "lucide-react"

export function FleetStatus() {
  const fleetData = [
    { 
      label: "In Operation", 
      value: 34, 
      total: 40,
      percent: 85, 
      icon: Bus,
      color: "emerald",
      bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      textColor: "text-emerald-600 dark:text-emerald-400",
      barColor: "bg-emerald-500"
    },
    { 
      label: "Maintenance", 
      value: 4, 
      total: 40,
      percent: 10, 
      icon: Wrench,
      color: "amber",
      bgLight: "bg-amber-50 dark:bg-amber-950/30",
      borderColor: "border-amber-200 dark:border-amber-800",
      textColor: "text-amber-600 dark:text-amber-400",
      barColor: "bg-amber-500"
    },
    { 
      label: "Idle / Parked", 
      value: 2, 
      total: 40,
      percent: 5, 
      icon: ParkingCircle,
      color: "slate",
      bgLight: "bg-slate-50 dark:bg-slate-800/50",
      borderColor: "border-slate-200 dark:border-slate-700",
      textColor: "text-slate-600 dark:text-slate-400",
      barColor: "bg-slate-400 dark:bg-slate-500"
    },
  ]

  return (
    <div className="space-y-4">
      {/* Fleet Distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {fleetData.map((item) => (
          <div
            key={item.label}
            className={`p-4 rounded-xl ${item.bgLight} border ${item.borderColor} transition-all hover:shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`w-4 h-4 ${item.textColor}`} />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold ${item.textColor}`}>{item.value}</span>
              <span className="text-sm text-slate-400 dark:text-slate-500">/ {item.total}</span>
            </div>
            <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${item.barColor} rounded-full transition-all`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <Route className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Active Routes</span>
          </div>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</span>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200 dark:border-violet-800">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-violet-500" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Drivers Online</span>
          </div>
          <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">42</span>
        </div>
      </div>
    </div>
  )
}
