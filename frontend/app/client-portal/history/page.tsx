"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Search,
  Download,
  Filter,
  Navigation,
  ArrowRight
} from "lucide-react"

export default function TripHistoryPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "cancelled">("all")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role !== "client") {
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

  const tripHistory = [
    {
      id: "TRIP-001",
      ticketId: "TCK-001",
      date: "Nov 28, 2025",
      time: "2:30 PM",
      route: "Downtown Express",
      from: "Home",
      to: "Office",
      status: "completed",
      fare: "$3.50",
      duration: "25 min"
    },
    {
      id: "TRIP-002",
      ticketId: "TCK-005",
      date: "Nov 27, 2025",
      time: "9:00 AM",
      route: "Airport Shuttle",
      from: "Home",
      to: "Airport",
      status: "completed",
      fare: "$12.00",
      duration: "45 min"
    },
    {
      id: "TRIP-003",
      ticketId: "TCK-003",
      date: "Nov 26, 2025",
      time: "5:15 PM",
      route: "University Line",
      from: "Campus",
      to: "Home",
      status: "completed",
      fare: "$2.75",
      duration: "30 min"
    },
    {
      id: "TRIP-004",
      ticketId: "TCK-008",
      date: "Nov 25, 2025",
      time: "11:00 AM",
      route: "Beach Route",
      from: "Downtown",
      to: "Beach",
      status: "cancelled",
      fare: "$5.00",
      duration: "N/A"
    },
    {
      id: "TRIP-005",
      ticketId: "TCK-012",
      date: "Nov 24, 2025",
      time: "8:00 AM",
      route: "Downtown Express",
      from: "Home",
      to: "Office",
      status: "completed",
      fare: "$3.50",
      duration: "22 min"
    },
    {
      id: "TRIP-006",
      ticketId: "TCK-015",
      date: "Nov 23, 2025",
      time: "3:45 PM",
      route: "Shopping Mall",
      from: "Mall",
      to: "Home",
      status: "completed",
      fare: "$4.25",
      duration: "35 min"
    }
  ]

  const filteredTrips = tripHistory.filter((trip) => {
    const matchesSearch = 
      trip.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = 
      filterStatus === "all" || trip.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const stats = {
    totalTrips: tripHistory.filter(t => t.status === "completed").length,
    totalSpent: tripHistory
      .filter(t => t.status === "completed")
      .reduce((sum, t) => sum + parseFloat(t.fare.replace("$", "")), 0),
    cancelled: tripHistory.filter(t => t.status === "cancelled").length
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Trip History</h1>
        <p className="text-muted-foreground">View all your past trips and bookings</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-6 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Trips</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalTrips}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Navigation className="w-6 h-6 text-cyan-600" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
              <p className="text-3xl font-bold text-foreground">${stats.totalSpent.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Cancelled</p>
              <p className="text-3xl font-bold text-foreground">{stats.cancelled}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Search and Filter */}
      <GlassCard className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by route, location, or ticket ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              className={filterStatus === "all" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white" : ""}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "completed" ? "default" : "outline"}
              onClick={() => setFilterStatus("completed")}
              className={filterStatus === "completed" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white" : ""}
            >
              Completed
            </Button>
            <Button
              variant={filterStatus === "cancelled" ? "default" : "outline"}
              onClick={() => setFilterStatus("cancelled")}
              className={filterStatus === "cancelled" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white" : ""}
            >
              Cancelled
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Trip History List */}
      <div className="space-y-4">
        {filteredTrips.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No trips found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search terms" : "You haven't taken any trips yet"}
            </p>
          </GlassCard>
        ) : (
          filteredTrips.map((trip) => (
            <GlassCard key={trip.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      trip.status === "completed" 
                        ? "bg-emerald-500/10" 
                        : "bg-red-500/10"
                    }`}>
                      {trip.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{trip.route}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {trip.date}
                        <Clock className="w-4 h-4 ml-2" />
                        {trip.time}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-foreground ml-13">
                    <MapPin className="w-4 h-4 text-cyan-600" />
                    <span>{trip.from}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>{trip.to}</span>
                  </div>
                </div>

                {/* Middle Section */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Ticket ID</p>
                    <p className="font-semibold text-cyan-600">{trip.ticketId}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Duration</p>
                    <p className="font-semibold text-foreground">{trip.duration}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Fare</p>
                    <p className="font-bold text-lg text-foreground">{trip.fare}</p>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold text-center ${
                    trip.status === "completed"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  }`}>
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </span>
                  {trip.status === "completed" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-cyan-500/30 hover:bg-cyan-500/10"
                      onClick={() => router.push(`/client-portal/my-tickets/${trip.ticketId}`)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Receipt
                    </Button>
                  )}
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </>
  )
}
