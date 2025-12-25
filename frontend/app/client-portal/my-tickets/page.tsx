"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Ticket, Calendar, MapPin, ArrowRight, Clock } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

export default function MyTicketsPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null

  const tickets = [
    {
      id: "TCK-001",
      route: "Downtown Express",
      from: "Main Station",
      to: "Downtown",
      date: "Dec 28, 2024",
      time: "2:30 PM",
      seat: "12A",
      status: "active",
    },
    {
      id: "TCK-002",
      route: "Airport Shuttle",
      from: "City Center",
      to: "Airport",
      date: "Dec 30, 2024",
      time: "9:00 AM",
      seat: "8B",
      status: "upcoming",
    },
    {
      id: "TCK-003",
      route: "University Line",
      from: "Metro Hub",
      to: "University",
      date: "Dec 15, 2024",
      time: "7:45 AM",
      seat: "5C",
      status: "completed",
    },
  ]

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">My Tickets</h1>
        <p className="text-slate-600 dark:text-slate-400">View and manage your bus tickets</p>
      </div>

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <GlassCard key={ticket.id}>
            <Link href={`/client-portal/my-tickets/${ticket.id}`}>
              <div className="flex flex-col md:flex-row md:items-center gap-6 cursor-pointer group">
                {/* Ticket Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Ticket className="w-8 h-8 text-white" />
                </div>

                {/* Ticket Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{ticket.route}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${ticket.status === "active"
                          ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                          : ticket.status === "upcoming"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {ticket.from} → {ticket.to}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {ticket.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {ticket.time}
                    </div>
                  </div>
                </div>

                {/* Ticket ID and Arrow */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Ticket ID</p>
                    <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{ticket.id}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Seat {ticket.seat}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-cyan-600 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </GlassCard>
        ))}
      </div>
    </>
  )
}
