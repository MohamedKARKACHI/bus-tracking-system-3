"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { useDriverSidebar } from "@/lib/driver-sidebar-context"
import { useAuth } from "@/lib/auth-context"
import {
  Calendar, Clock, Navigation, CheckCircle2, MapPin, Users,
  TrendingUp, AlertCircle, Bus, Play, Pause, ChevronRight,
  Timer, Route, Star, Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Shift {
  id: string
  route: string
  code: string
  startTime: string
  endTime: string
  duration: string
  stops: number
  passengers: number
  status: 'completed' | 'active' | 'scheduled'
  busNumber: string
}

interface DaySchedule {
  id: number
  date: string
  day: string
  shifts: Shift[]
}

export default function SchedulePage() {
  const { sidebarExpanded } = useDriverSidebar()
  const { user } = useAuth()
  const [selectedDay, setSelectedDay] = useState(0)

  // Rich schedule data
  const schedules: DaySchedule[] = [
    {
      id: 1,
      date: "Today - Dec 29",
      day: "Sunday",
      shifts: [
        {
          id: "SH-001",
          route: "Marrakech Express",
          code: "Route A",
          startTime: "06:00 AM",
          endTime: "10:00 AM",
          duration: "4h",
          stops: 12,
          passengers: 45,
          status: "completed",
          busNumber: "BUS-101",
        },
        {
          id: "SH-002",
          route: "Gueliz - Médina",
          code: "Route B",
          startTime: "11:00 AM",
          endTime: "03:00 PM",
          duration: "4h",
          stops: 8,
          passengers: 32,
          status: "active",
          busNumber: "BUS-101",
        },
        {
          id: "SH-003",
          route: "Airport Shuttle",
          code: "Route C",
          startTime: "04:00 PM",
          endTime: "08:00 PM",
          duration: "4h",
          stops: 6,
          passengers: 0,
          status: "scheduled",
          busNumber: "BUS-101",
        },
      ],
    },
    {
      id: 2,
      date: "Tomorrow - Dec 30",
      day: "Monday",
      shifts: [
        {
          id: "SH-004",
          route: "Palmeraie Loop",
          code: "Route D",
          startTime: "07:00 AM",
          endTime: "11:00 AM",
          duration: "4h",
          stops: 10,
          passengers: 0,
          status: "scheduled",
          busNumber: "BUS-101",
        },
        {
          id: "SH-005",
          route: "City Center Express",
          code: "Route E",
          startTime: "12:00 PM",
          endTime: "04:00 PM",
          duration: "4h",
          stops: 14,
          passengers: 0,
          status: "scheduled",
          busNumber: "BUS-101",
        },
      ],
    },
    {
      id: 3,
      date: "Dec 31",
      day: "Tuesday",
      shifts: [
        {
          id: "SH-006",
          route: "Marrakech Express",
          code: "Route A",
          startTime: "06:00 AM",
          endTime: "10:00 AM",
          duration: "4h",
          stops: 12,
          passengers: 0,
          status: "scheduled",
          busNumber: "BUS-101",
        },
      ],
    },
    {
      id: 4,
      date: "Jan 1",
      day: "Wednesday",
      shifts: [
        {
          id: "SH-007",
          route: "Holiday Special",
          code: "Route H",
          startTime: "10:00 AM",
          endTime: "06:00 PM",
          duration: "8h",
          stops: 20,
          passengers: 0,
          status: "scheduled",
          busNumber: "BUS-101",
        },
      ],
    },
  ]

  const totalShifts = schedules.reduce((acc, day) => acc + day.shifts.length, 0)
  const completedShifts = schedules.reduce((acc, day) =>
    acc + day.shifts.filter(s => s.status === 'completed').length, 0)
  const activeShifts = schedules.reduce((acc, day) =>
    acc + day.shifts.filter(s => s.status === 'active').length, 0)
  const totalHours = schedules.reduce((acc, day) =>
    acc + day.shifts.reduce((sum, shift) => sum + parseInt(shift.duration), 0), 0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">Completed</span>
      case 'active':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 animate-pulse">In Progress</span>
      case 'scheduled':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400">Scheduled</span>
    }
  }

  return (
    <main className={cn(
      "flex-1 p-4 md:p-6 lg:p-8 pb-32 lg:pb-8 bg-gradient-to-br from-background via-background to-muted/20",
      sidebarExpanded ? "lg:ml-0" : "lg:ml-0",
    )}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Weekly Schedule
              </h1>
              <p className="text-sm text-muted-foreground">Manage your shifts and routes</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 font-medium text-sm hover:bg-violet-200 dark:hover:bg-violet-500/30 transition-colors">
            <Calendar className="w-4 h-4 inline mr-2" />
            This Week
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <GlassCard className="p-5 border-l-4 border-l-violet-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{totalShifts}</div>
          <p className="text-sm text-muted-foreground">Total Shifts</p>
        </GlassCard>

        <GlassCard className="p-5 border-l-4 border-l-emerald-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-bold text-emerald-500">+{completedShifts}</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{completedShifts}</div>
          <p className="text-sm text-muted-foreground">Completed</p>
        </GlassCard>

        <GlassCard className="p-5 border-l-4 border-l-blue-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            {activeShifts > 0 && <span className="flex h-3 w-3"><span className="animate-ping absolute h-3 w-3 rounded-full bg-blue-400 opacity-75"></span><span className="relative rounded-full h-3 w-3 bg-blue-500"></span></span>}
          </div>
          <div className="text-3xl font-bold text-foreground">{activeShifts}</div>
          <p className="text-sm text-muted-foreground">Active Now</p>
        </GlassCard>

        <GlassCard className="p-5 border-l-4 border-l-amber-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Timer className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">{totalHours}h</div>
          <p className="text-sm text-muted-foreground">Total Hours</p>
        </GlassCard>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {schedules.map((day, idx) => (
          <button
            key={day.id}
            onClick={() => setSelectedDay(idx)}
            className={cn(
              "flex-shrink-0 px-5 py-3 rounded-2xl font-medium transition-all duration-300",
              selectedDay === idx
                ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            <div className="text-sm font-bold">{day.day}</div>
            <div className="text-xs opacity-80">{day.shifts.length} shifts</div>
          </button>
        ))}
      </div>

      {/* Schedule Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{schedules[selectedDay].date}</h2>
            <p className="text-sm text-muted-foreground">{schedules[selectedDay].day} • {schedules[selectedDay].shifts.length} shifts</p>
          </div>
        </div>

        {schedules[selectedDay].shifts.map((shift) => (
          <GlassCard key={shift.id} className="p-5 hover:shadow-xl transition-all duration-300 group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg",
                  shift.status === 'completed' ? "bg-gradient-to-br from-emerald-500 to-green-600" :
                    shift.status === 'active' ? "bg-gradient-to-br from-blue-500 to-cyan-600" :
                      "bg-gradient-to-br from-slate-400 to-slate-500"
                )}>
                  {shift.status === 'active' ? <Play className="h-6 w-6 text-white" /> : <Bus className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold">{shift.route}</h3>
                    {getStatusBadge(shift.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Route className="h-4 w-4" />
                      {shift.code}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bus className="h-4 w-4" />
                      {shift.busNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {shift.stops} stops
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{shift.startTime}</div>
                  <p className="text-xs text-muted-foreground">Start</p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" />
                  <span className="text-xs font-medium">{shift.duration}</span>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{shift.endTime}</div>
                  <p className="text-xs text-muted-foreground">End</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-violet-500 transition-colors" />
              </div>
            </div>

            {shift.status === 'completed' && (
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm"><strong>{shift.passengers}</strong> passengers served</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm"><strong>4.8</strong> rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">On Time</span>
                </div>
              </div>
            )}

            {shift.status === 'active' && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Route Progress</span>
                  <span className="text-sm font-bold text-blue-500">65%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" />
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </main>
  )
}
