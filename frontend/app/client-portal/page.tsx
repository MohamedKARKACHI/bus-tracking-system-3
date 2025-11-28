"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { MapPin, Clock, Navigation, Ticket, Bell } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { BusMap } from "@/components/bus-map"

export default function ClientPortalPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selectedBus, setSelectedBus] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role !== "client") {
      // Redirect non-client users to their appropriate portal
      if (user.role === "admin") {
        router.push("/dashboard")
      } else if (user.role === "driver") {
        router.push("/driver-portal")
      }
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== "client") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const buses = [
    { id: "101", route: "Downtown Express", eta: "5 min", location: "Main St & 5th Ave", status: "on-time", seats: 12 },
    { id: "205", route: "Airport Shuttle", eta: "12 min", location: "Airport Rd", status: "delayed", seats: 3 },
    { id: "308", route: "University Line", eta: "8 min", location: "Campus Dr", status: "on-time", seats: 20 },
    { id: "412", route: "Beach Route", eta: "15 min", location: "Ocean Blvd", status: "on-time", seats: 8 },
  ]

  const upcomingTrips = [
    { id: "t1", date: "Today, 2:30 PM", route: "Downtown Express", from: "Home", to: "Office", ticketId: "TCK-001" },
    { id: "t2", date: "Tomorrow, 9:00 AM", route: "Airport Shuttle", from: "Home", to: "Airport", ticketId: "TCK-002" },
  ]

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Track Your Bus</h1>
          <p className="text-muted-foreground">Real-time location and arrival estimates</p>
        </div>
        <Link href="/client-portal/book-ticket">
          <Button className="mt-4 md:mt-0 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg px-6 py-6">
            <Ticket className="w-5 h-5 mr-2" />
            Book New Ticket
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Live Map */}
        <GlassCard className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Live Map</h2>
            <Bell className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
            <BusMap 
              height="500px" 
              showControls={false}
              highlightBus={selectedBus ? `BUS-${selectedBus}` : null}
            />
          </div>
        </GlassCard>

        {/* Available Buses */}
        <GlassCard className="lg:col-span-1">
          <h2 className="text-xl font-bold text-foreground mb-4">Available Buses</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">{buses.map((bus) => (
              <button
                key={bus.id}
                onClick={() => setSelectedBus(bus.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                  selectedBus === bus.id ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30" : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 text-xs font-semibold">
                        #{bus.id}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bus.status === "on-time"
                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                            : "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                        }`}
                      >
                        {bus.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{bus.route}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                      <MapPin className="w-4 h-4" />
                      {bus.location}
                    </p>
                    <p className="text-xs text-muted-foreground">{bus.seats} seats available</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-bold text-lg">
                      <Clock className="w-5 h-5" />
                      {bus.eta}
                    </div>
                    <p className="text-xs text-muted-foreground">ETA</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Upcoming Trips */}
        <GlassCard className="lg:col-span-2">
          <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Trips</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border border-cyan-200 dark:border-cyan-800"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{trip.date}</p>
                    <h3 className="font-bold text-foreground">{trip.route}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-cyan-600 text-white text-xs font-semibold">
                    {trip.ticketId}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground mb-3">
                  <span>{trip.from}</span>
                  <div className="flex-1 h-0.5 bg-cyan-300 dark:bg-cyan-700 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center">
                      <Navigation className="w-3 h-3 text-white rotate-90" />
                    </div>
                  </div>
                  <span>{trip.to}</span>
                </div>
                <Link href={`/client-portal/my-tickets/${trip.ticketId}`}>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                    View Ticket
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  )
}
