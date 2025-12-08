"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Ticket, Calendar, MapPin, ArrowRight, Clock, Loader2, Filter } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

interface TicketData {
  id: number
  ticket_number: string
  route_name: string
  boarding_stop_name: string
  destination_stop_name: string
  departure_time: string
  seat_number: string
  status: string
  fare: number
  booking_date: string
}

export default function MyTicketsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all')

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

  useEffect(() => {
    if (user?.id) {
      fetchTickets()
    }
  }, [user])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tickets?userId=${user?.id}`)
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || !user || user.role !== "client") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-cyan-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  const filteredTickets = filter === 'all'
    ? tickets
    : tickets.filter(t => t.status.toLowerCase() === filter)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'booked':
      case 'active':
        return "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
      case 'completed':
        return "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
      case 'cancelled':
        return "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
      default:
        return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">My Tickets</h1>
          <p className="text-slate-600 dark:text-slate-400">View and manage your bus tickets</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'active', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${filter === status
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          /* Empty State */
          <GlassCard className="p-12 text-center">
            <Ticket className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tickets found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {filter === 'all' ? "You haven't booked any tickets yet" : `No ${filter} tickets`}
            </p>
            <Link href="/client-portal/book-ticket">
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all">
                Book Your First Ticket
              </button>
            </Link>
          </GlassCard>
        ) : (
          /* Tickets Grid */
          <div className="grid gap-4">
            {filteredTickets.map((ticket) => (
              <GlassCard key={ticket.id} className="hover:shadow-xl transition-shadow">
                <Link href={`/client-portal/my-tickets/${ticket.ticket_number}`}>
                  <div className="flex flex-col md:flex-row md:items-center gap-6 cursor-pointer group p-6">
                    {/* Ticket Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Ticket className="w-8 h-8 text-white" />
                    </div>

                    {/* Ticket Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{ticket.route_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {ticket.boarding_stop_name} → {ticket.destination_stop_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(ticket.booking_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {ticket.departure_time}
                        </div>
                      </div>
                    </div>

                    {/* Ticket ID and Arrow */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Ticket ID</p>
                        <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{ticket.ticket_number}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Seat {ticket.seat_number}</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">${ticket.fare}</p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-cyan-600 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
