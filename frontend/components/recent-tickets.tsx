"use client"

import { Ticket, Calendar, MapPin, User, Check, Clock } from "lucide-react"
import Link from "next/link"
import { GlassCard } from "./ui/glass-card"

export function RecentTickets() {
  const recentBookings = [
    {
      id: "TCK-001",
      passenger: "John Doe",
      route: "Downtown Express",
      from: "Main Station",
      to: "Downtown",
      date: "Dec 28, 2024",
      time: "2:30 PM",
      status: "confirmed",
    },
    {
      id: "TCK-002",
      passenger: "Jane Smith",
      route: "Airport Shuttle",
      from: "City Center",
      to: "Airport",
      date: "Dec 30, 2024",
      time: "9:00 AM",
      status: "confirmed",
    },
    {
      id: "TCK-003",
      passenger: "Bob Johnson",
      route: "University Line",
      from: "Metro Hub",
      to: "University",
      date: "Dec 28, 2024",
      time: "7:45 AM",
      status: "pending",
    },
    {
      id: "TCK-004",
      passenger: "Alice Williams",
      route: "Beach Route",
      from: "Plaza Mall",
      to: "Beach",
      date: "Dec 29, 2024",
      time: "11:00 AM",
      status: "confirmed",
    },
    {
      id: "TCK-005",
      passenger: "Charlie Brown",
      route: "Downtown Express",
      from: "East Side",
      to: "City Center",
      date: "Dec 28, 2024",
      time: "5:15 PM",
      status: "confirmed",
    },
  ]

  return (
    <GlassCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-foreground">Recent Bookings</h3>
          </div>
          <Link href="/dashboard/tickets" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-card/30 hover:bg-card/50 border border-border/30 hover:border-primary/30 transition-all"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground truncate">{booking.route}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{booking.passenger}</p>
                    </div>
                  </div>
                  <span
                    className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "confirmed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {booking.status === "confirmed" ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Confirmed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">
                    {booking.from} → {booking.to}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{booking.date}</span>
                  </div>
                  <span>•</span>
                  <span>{booking.time}</span>
                  <span>•</span>
                  <span className="font-mono text-cyan-400">{booking.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
