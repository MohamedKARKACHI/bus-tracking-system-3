"use client"

import { useState } from "react"
import { Navigation, MapPin, Clock, Users, ChevronLeft, ChevronRight, Circle, CheckCircle2, Loader2 } from "lucide-react"

export function AdminRouteProgress() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const routes = [
    {
      id: 1,
      name: "Downtown Express",
      busNumber: "BUS-101",
      color: "#3b82f6",
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
      color: "#22c55e",
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
      color: "#8b5cf6",
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

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-2xl overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-50" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Live Route</h3>
              <p className="text-sm text-slate-400">Real-time tracking</p>
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevRoute}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-400 min-w-[60px] text-center">
              {currentIndex + 1} / {routes.length}
            </span>
            <button
              onClick={nextRoute}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Route info card */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-lg font-bold text-white mb-1">{currentRoute.name}</h4>
              <p className="text-sm text-slate-400">{currentRoute.busNumber}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${currentRoute.status === "on-time"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              }`}>
              {currentRoute.status === "on-time" ? "● On Time" : "● Delayed"}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">{completedStops}/{totalStops} stops</span>
              <span className="text-xs font-bold" style={{ color: currentRoute.color }}>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 relative overflow-hidden"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${currentRoute.color} 0%, ${currentRoute.color}dd 100%)`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Passengers */}
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">{currentRoute.passengers}/{currentRoute.capacity}</span>
            <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                style={{ width: `${(currentRoute.passengers / currentRoute.capacity) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stops timeline */}
        <div className="space-y-3">
          {currentRoute.stops.map((stop, index) => {
            const isCompleted = stop.status === "completed"
            const isActive = stop.status === "active"
            const isUpcoming = stop.status === "upcoming"

            return (
              <div key={index} className="relative">
                {/* Connecting line */}
                {index < currentRoute.stops.length - 1 && (
                  <div
                    className="absolute left-[19px] top-10 w-0.5 h-8 transition-all"
                    style={{
                      background: isCompleted
                        ? `linear-gradient(180deg, ${currentRoute.color} 0%, ${currentRoute.color}80 100%)`
                        : 'linear-gradient(180deg, #475569 0%, #334155 100%)'
                    }}
                  />
                )}

                <div className={`flex items-center gap-4 p-3 rounded-xl transition-all ${isActive
                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                    : isCompleted
                      ? 'bg-slate-800/30 border border-slate-700/30'
                      : 'bg-slate-800/20 border border-slate-700/20'
                  }`}>
                  {/* Stop indicator */}
                  <div className="relative flex-shrink-0">
                    {isCompleted && (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${currentRoute.color}20`, border: `2px solid ${currentRoute.color}` }}>
                        <CheckCircle2 className="w-5 h-5" style={{ color: currentRoute.color }} />
                      </div>
                    )}
                    {isActive && (
                      <div className="relative">
                        <div className="absolute inset-0 w-10 h-10 rounded-full animate-ping" style={{ background: `${currentRoute.color}40` }} />
                        <div className="relative w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${currentRoute.color} 0%, ${currentRoute.color}cc 100%)`, boxShadow: `0 0 20px ${currentRoute.color}80` }}>
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                      </div>
                    )}
                    {isUpcoming && (
                      <div className="w-10 h-10 rounded-full border-2 border-slate-600 bg-slate-800/50 flex items-center justify-center">
                        <Circle className="w-5 h-5 text-slate-500" />
                      </div>
                    )}
                  </div>

                  {/* Stop info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h5 className={`font-semibold truncate ${isActive ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                        }`}>
                        {stop.name}
                      </h5>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className={isActive ? 'text-blue-400 font-semibold' : 'text-slate-500'}>
                        {isActive ? 'Arriving in 5 min' : isCompleted ? 'Departed ' + stop.time : 'Scheduled ' + stop.time}
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  {isActive && (
                    <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                      <span className="text-xs font-semibold text-blue-400">Current</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
