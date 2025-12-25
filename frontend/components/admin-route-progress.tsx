"use client"

import { useState } from "react"
import { Navigation, MapPin, Clock, Users, ChevronLeft, ChevronRight, Circle, CheckCircle2, Loader2, Bus } from "lucide-react"

export function AdminRouteProgress() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const routes = [
    {
      id: 1,
      name: "Downtown Express",
      busNumber: "BUS-101",
      color: "blue",
      stops: [
        { name: "Palmeraie", status: "completed", time: "08:00" },
        { name: "Gueliz", status: "completed", time: "08:15" },
        { name: "Ben Youssef", status: "active", time: "08:30" },
        { name: "Jemaa el Fna", status: "upcoming", time: "08:45" }
      ],
      passengers: 42,
      capacity: 50,
      status: "on-time"
    },
    {
      id: 2,
      name: "Airport Shuttle",
      busNumber: "BUS-203",
      color: "emerald",
      stops: [
        { name: "Downtown Hub", status: "completed", time: "09:00" },
        { name: "Metro Station", status: "active", time: "09:20" },
        { name: "Terminal 1", status: "upcoming", time: "09:40" },
        { name: "Terminal 2", status: "upcoming", time: "09:55" }
      ],
      passengers: 28,
      capacity: 40,
      status: "delayed"
    },
    {
      id: 3,
      name: "University Loop",
      busNumber: "BUS-156",
      color: "violet",
      stops: [
        { name: "Main Campus", status: "completed", time: "10:00" },
        { name: "Library", status: "completed", time: "10:12" },
        { name: "Student Housing", status: "completed", time: "10:25" },
        { name: "Sports Complex", status: "active", time: "10:35" }
      ],
      passengers: 38,
      capacity: 45,
      status: "on-time"
    }
  ]

  const currentRoute = routes[currentIndex]
  const completedStops = currentRoute.stops.filter(s => s.status === "completed").length
  const totalStops = currentRoute.stops.length
  const progress = (completedStops / totalStops) * 100

  const nextRoute = () => {
    setCurrentIndex((prev) => (prev + 1) % routes.length)
  }

  const prevRoute = () => {
    setCurrentIndex((prev) => (prev - 1 + routes.length) % routes.length)
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; light: string; gradient: string }> = {
      blue: {
        bg: "bg-blue-500",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
        light: "bg-blue-50 dark:bg-blue-950/50",
        gradient: "from-blue-500 to-blue-600"
      },
      emerald: {
        bg: "bg-emerald-500",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800",
        light: "bg-emerald-50 dark:bg-emerald-950/50",
        gradient: "from-emerald-500 to-emerald-600"
      },
      violet: {
        bg: "bg-violet-500",
        text: "text-violet-600 dark:text-violet-400",
        border: "border-violet-200 dark:border-violet-800",
        light: "bg-violet-50 dark:bg-violet-950/50",
        gradient: "from-violet-500 to-violet-600"
      }
    }
    return colors[color] || colors.blue
  }

  const colorClasses = getColorClasses(currentRoute.color)

  return (
    <div className="space-y-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses.gradient} flex items-center justify-center shadow-sm`}>
            <Bus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">{currentRoute.name}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{currentRoute.busNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevRoute}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums min-w-[40px] text-center">
            {currentIndex + 1}/{routes.length}
          </span>
          <button
            onClick={nextRoute}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status and Progress */}
      <div className={`p-4 rounded-xl ${colorClasses.light} border ${colorClasses.border}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress</span>
            <span className={`text-sm font-bold ${colorClasses.text}`}>{Math.round(progress)}%</span>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            currentRoute.status === "on-time"
              ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400"
              : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              currentRoute.status === "on-time" ? "bg-emerald-500" : "bg-amber-500"
            }`} />
            {currentRoute.status === "on-time" ? "On Time" : "Delayed"}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${colorClasses.gradient}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between mt-3 text-sm text-slate-600 dark:text-slate-400">
          <span>{completedStops} of {totalStops} stops completed</span>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{currentRoute.passengers}/{currentRoute.capacity}</span>
          </div>
        </div>
      </div>

      {/* Stops List */}
      <div className="space-y-1">
        {currentRoute.stops.map((stop, index) => {
          const isCompleted = stop.status === "completed"
          const isActive = stop.status === "active"

          return (
            <div
              key={index}
              className={`relative flex items-center gap-3 p-3 rounded-xl transition-all ${
                isActive
                  ? `${colorClasses.light} border ${colorClasses.border}`
                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              {/* Timeline connector */}
              {index < currentRoute.stops.length - 1 && (
                <div className={`absolute left-[26px] top-[42px] w-0.5 h-6 ${
                  isCompleted ? colorClasses.bg : "bg-slate-200 dark:bg-slate-700"
                }`} />
              )}

              {/* Status icon */}
              <div className="relative z-10 flex-shrink-0">
                {isCompleted && (
                  <div className={`w-8 h-8 rounded-full ${colorClasses.bg} flex items-center justify-center`}>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
                {isActive && (
                  <div className="relative">
                    <div className={`absolute inset-0 w-8 h-8 rounded-full ${colorClasses.bg} animate-ping opacity-25`} />
                    <div className={`relative w-8 h-8 rounded-full ${colorClasses.bg} flex items-center justify-center`}>
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                  </div>
                )}
                {!isCompleted && !isActive && (
                  <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{index + 1}</span>
                  </div>
                )}
              </div>

              {/* Stop info */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${
                  isActive
                    ? "text-slate-900 dark:text-white"
                    : isCompleted
                      ? "text-slate-700 dark:text-slate-300"
                      : "text-slate-500 dark:text-slate-400"
                }`}>
                  {stop.name}
                </p>
                <p className={`text-xs ${
                  isActive ? colorClasses.text + " font-medium" : "text-slate-500 dark:text-slate-400"
                }`}>
                  {isActive ? "Arriving in 5 min" : isCompleted ? `Departed ${stop.time}` : `Scheduled ${stop.time}`}
                </p>
              </div>

              {/* Current badge */}
              {isActive && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses.bg} text-white`}>
                  Current
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
