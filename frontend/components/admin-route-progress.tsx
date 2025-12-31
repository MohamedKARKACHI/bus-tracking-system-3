"use client"

import { useState } from "react"
import { Navigation, MapPin, Clock, Users, ChevronLeft, ChevronRight, Check, Route, RefreshCcw } from "lucide-react"

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
  const progress = Math.round((completedStops / totalStops) * 100)

  const nextRoute = () => {
    setCurrentIndex((prev) => (prev + 1) % routes.length)
  }

  const prevRoute = () => {
    setCurrentIndex((prev) => (prev - 1 + routes.length) % routes.length)
  }

  return (
    <div className="space-y-6 font-sans">

      {/* 1. Header Section */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          <Route className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Live Routes</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Active bus tracking</p>
        </div>
      </div>

      {/* 2. Route Selector Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
            <BusIcon />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white text-base">{currentRoute.name}</h4>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{currentRoute.busNumber}</p>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button onClick={prevRoute} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all text-slate-500">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 px-2">
            {currentIndex + 1}/{routes.length}
          </span>
          <button onClick={nextRoute} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all text-slate-500">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Progress Overview Card */}
      <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Progress</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${currentRoute.status === 'on-time'
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
              : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
            }`}>
            <span className={`w-2 h-2 rounded-full ${currentRoute.status === 'on-time' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {currentRoute.status === 'on-time' ? 'On Time' : 'Delayed'}
          </div>
        </div>

        {/* Bar */}
        <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>{completedStops} of {totalStops} stops completed</span>
          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <Users className="w-4 h-4 text-slate-400" />
            {currentRoute.passengers}/{currentRoute.capacity}
          </div>
        </div>
      </div>

      {/* 4. Vertical Timeline */}
      <div className="relative pl-2 pt-2 space-y-0">
        {currentRoute.stops.map((stop, index) => {
          const isCompleted = stop.status === "completed"
          const isActive = stop.status === "active"
          const isLast = index === currentRoute.stops.length - 1

          return (
            <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
              {/* Vertical Line Connector */}
              {!isLast && (
                <div className={`absolute left-[15px] top-[30px] bottom-0 w-0.5 ${isCompleted ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                  }`} />
              )}

              {/* Node Icon */}
              <div className="relative z-10 shrink-0">
                {isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border-4 border-white dark:border-slate-950 shadow-sm">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : isActive ? (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border-4 border-white dark:border-slate-950 shadow-md ring-4 ring-blue-50 dark:ring-blue-900/20">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-400">{index + 1}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 pt-1 ${isActive ? "bg-blue-50 dark:bg-blue-900/10 -m-3 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className={`font-bold ${isActive ? "text-slate-900 dark:text-white text-base" : "text-slate-700 dark:text-slate-300"}`}>
                      {stop.name}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {isCompleted ? `Departed ${stop.time}` : isActive ? `Arriving in 5 min` : `Scheduled ${stop.time}`}
                    </p>
                  </div>
                  {isActive && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm shadow-blue-500/30">
                      Current
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

function BusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 16C4 16.88 4.39 17.67 5 18.22V20C5 20.55 5.45 21 6 21H7C7.55 21 8 20.55 8 20V19H16V20C16 20.55 16.45 21 17 21H18C18.55 21 19 20.55 19 20V18.22C19.61 17.67 20 16.88 20 16V6C20 2.5 16.42 2 12 2C7.58 2 4 2.5 4 6V16ZM7.5 17C6.67 17 6 16.33 6 15.5C6 14.67 6.67 14 7.5 14C8.33 14 9 14.67 9 15.5C9 16.33 8.33 17 7.5 17ZM16.5 17C15.67 17 15 16.33 15 15.5C15 14.67 15.67 14 16.5 14C17.33 14 18 14.67 18 15.5C18 16.33 17.33 17 16.5 17ZM5.5 6H18.5V11H5.5V6Z" fill="currentColor" />
    </svg>
  )
}
