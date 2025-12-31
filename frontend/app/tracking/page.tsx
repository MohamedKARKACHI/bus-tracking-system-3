"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { MapboxMap } from "@/components/mapbox-map"

import { routeEventBus } from "@/lib/bus-data-context" // To trigger map flyTo
import { Button } from "@/components/ui/button"
import { RefreshCw, Navigation, MapPin, Zap } from "lucide-react"

export default function TrackingPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }



  return (
    <DashboardShell>
      {/* 
        The DashboardShell adds the sidebar and header. 
        We want the map to take the FULL height of the remaining area.
        The wrapper in DashboardShell has `flex-1 overflow-hidden`, but `p-4` or `p-8` might restrict full bleed.
        We'll negate padding with negative margins or ensure DashboardShell allows custom content structure if needed.
        Assuming DashboardShell uses padding for main content area. We might need to handle this.
        
        Correction: DashboardShell (viewed earlier) has `p-4 sm:p-8` on Main. 
        To get full-bleed map, we wrap in a div that compensates or just accept the padding as a "frame".
        Let's try a "Framed" design first, which looks premium (like a rounded app window).
      */}

      <div className="relative w-full h-[calc(100vh-8rem)] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 group">

        {/* Map Background */}
        <div className="absolute inset-0 z-0">
          <MapboxMap
            className="w-full h-full"
            fullScreen={false}
            showControls={true} // We keep standard controls (zoom etc)
          />
        </div>



        {/* Floating Status Bar (Bottom Center) - Glassmorphism */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-auto">
          <div className="flex items-center gap-6 px-6 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-full shadow-2xl border border-slate-200/50 dark:border-slate-800/50 transition-all hover:scale-105 cursor-default">

            <div className="flex items-center gap-2">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">System Live</span>
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-slate-800 dark:text-white">28 Active</span>
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-800 dark:text-white">High Accuracy</span>
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

            <button
              onClick={handleRefresh}
              className={`p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isRefreshing ? 'animate-spin text-indigo-500' : 'text-slate-500'}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>

          </div>
        </div>

      </div>
    </DashboardShell>
  )
}
