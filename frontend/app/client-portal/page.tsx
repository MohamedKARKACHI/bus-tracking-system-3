"use client"

import { useEffect, useState } from "react"
import Link from 'next/link'
import { PremiumCard, StatGrid } from "@/components/premium/card"
import { useAuth } from "@/lib/auth-context"
import {
  Bus, MapPin, TrendingUp, AlertCircle, Ticket, ChevronRight, Navigation, Maximize, Minimize, X, Search
} from "lucide-react"
import { MapboxMap } from "@/components/mapbox-map"
import { FullscreenMapModal } from "@/components/fullscreen-map-modal"

export default function PremiumDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ activeTrips: 0, points: 240, saved: 45 })
  const [recentTrips, setRecentTrips] = useState<any[]>([])
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)

  // Location tracking state
  const [locationName, setLocationName] = useState("Your Location")
  const [nearestStation, setNearestStation] = useState<string | null>(null)
  const [stationDistance, setStationDistance] = useState<string | null>(null)

  useEffect(() => {
    // Simulate data fetch
    setTimeout(() => setLoading(false), 1000)
    setRecentTrips([
      { id: 1, from: 'Casablanca', to: 'Marrakech', date: 'Today, 10:00 AM', status: 'On Time', icon: '🌴' },
      { id: 2, from: 'Rabat', to: 'Tangier', date: 'Tomorrow, 08:30 AM', status: 'Scheduled', icon: '🛳️' }
    ])
  }, [])

  // Listen for location updates from the map
  useEffect(() => {
    const handleLocationUpdate = (event: CustomEvent) => {
      const { locationName, nearestStation, distance } = event.detail
      if (locationName) setLocationName(locationName)
      if (nearestStation) setNearestStation(nearestStation)
      if (distance) setStationDistance(distance)
    }

    window.addEventListener('user-location-update', handleLocationUpdate as EventListener)
    return () => window.removeEventListener('user-location-update', handleLocationUpdate as EventListener)
  }, [])

  if (loading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-white/20 animate-spin" />
    </div>
  )

  return (
    <>
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400 mb-2 tracking-tight">
            Hello, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="pm-text-secondary text-lg">Where are we going today?</p>
        </div>

        {/* Search Bar - Centered */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm group-hover:shadow-md"
              placeholder="Search for routes, stations..."
            />
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-500/20">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">System Operational</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">

        {/* Left Column (Main Content) - Spans 8 cols */}
        <div className="lg:col-span-8 space-y-8">

          {/* Vibrant Stats Row */}
          <StatGrid columns={3}>
            {/* Card 1: Blue Gradient */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg shadow-blue-500/20 group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Ticket className="w-16 h-16 transform rotate-12" />
              </div>
              <div className="relative z-10">
                <p className="text-blue-100 font-medium mb-1">Active Trips</p>
                <h2 className="text-4xl font-bold">{stats.activeTrips}</h2>
              </div>
            </div>

            {/* Card 2: Purple Gradient */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white shadow-lg shadow-purple-500/20 group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <TrendingUp className="w-16 h-16 transform -rotate-12" />
              </div>
              <div className="relative z-10">
                <p className="text-purple-100 font-medium mb-1">Points</p>
                <h2 className="text-4xl font-bold">{stats.points}</h2>
              </div>
            </div>

            {/* Card 3: Emerald Gradient */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 p-6 text-white shadow-lg shadow-emerald-500/20 group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Bus className="w-16 h-16 transform rotate-6" />
              </div>
              <div className="relative z-10">
                <p className="text-emerald-100 font-medium mb-1">Saved</p>
                <h2 className="text-4xl font-bold">{stats.saved} MAD</h2>
              </div>
            </div>
          </StatGrid>

          {/* Map Section - Using OpenStreetMap */}
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border pm-border-color bg-white dark:bg-slate-900 h-[350px] lg:h-[450px] relative flex flex-col">
            {/* Map Header with Location Info */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between">
              <div className="px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col gap-1 max-w-[60%]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {nearestStation ? "Route to Station" : "Live Tracking"}
                  </span>
                </div>
                <span className="text-sm font-bold pm-text-primary">{locationName}</span>
                {nearestStation && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    → {nearestStation} ({stationDistance} km away)
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  console.log("[ClientPortal] Dispatching map-request-locate event")
                  window.dispatchEvent(new CustomEvent('map-request-locate'))
                }}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg transition-all hover:scale-105 flex items-center gap-2 text-sm"
              >
                <MapPin className="w-4 h-4" />
                {nearestStation ? "Refresh" : "Find Nearest"}
              </button>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
              <MapboxMap showControls={true} />
            </div>

            {/* Bottom Action Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700">
                <Bus className="w-4 h-4 text-blue-500" />
                <span className="text-sm pm-text-primary font-medium">
                  {nearestStation ? `Walking: ~${Math.round((parseFloat(stationDistance || '0') / 5) * 60)} min` : "Real-time GPS"}
                </span>
              </div>
              <button
                onClick={() => setIsMapFullscreen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg transition-all hover:scale-105"
              >
                <Maximize className="w-4 h-4" /> Full Screen
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar Widgets) - Spans 4 cols */}
        <div className="lg:col-span-4 space-y-6">



          {/* Recent Activity (Clean List) */}
          <div className="rounded-3xl bg-white dark:bg-[#1e293b] p-6 border pm-border-color shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg pm-text-primary">Recent Trips</h3>
              <Link href="/client-portal/my-tickets" className="text-sm font-bold text-blue-500 hover:text-blue-600">See All</Link>
            </div>
            <div className="space-y-4">
              {recentTrips.map(trip => (
                <Link
                  key={trip.id}
                  href={`/client-portal/my-tickets/${trip.id}`}
                  className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-500/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{trip.icon}</div>
                    <div>
                      <p className="text-sm font-bold pm-text-primary">{trip.from} <span className="text-slate-400">→</span> {trip.to}</p>
                      <p className="text-xs pm-text-secondary font-medium mt-0.5">{trip.date}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </Link>
              ))}

              {/* Alert Snippet */}
              <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-500/20 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-500">Route 42 Active</p>
                  <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70">Minor delays expected downtown.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Map Modal */}
      <FullscreenMapModal
        isOpen={isMapFullscreen}
        onClose={() => setIsMapFullscreen(false)}
      />
    </>
  )
}
