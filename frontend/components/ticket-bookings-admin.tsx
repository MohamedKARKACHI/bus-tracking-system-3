"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Ticket, MapPin, CreditCard, Check, MoreVertical, Clock, Loader2 } from "lucide-react"
import type { Ticket as TicketType } from "@/types"
import { fetchWithAuth } from "@/lib/api-client"

export function TicketBookingsAdmin() {
  const [filter, setFilter] = useState("all")
  const [bookings, setBookings] = useState<TicketType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetchWithAuth('/api/tickets')

      if (!response.ok) {
        throw new Error('Failed to fetch tickets')
      }

      const data = await response.json()
      setBookings(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = filter === "all" ? bookings : bookings.filter((b) => b.status === filter)

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    revenue: bookings.filter((b) => b.payment_status === "paid").reduce((sum, b) => sum + parseFloat(b.price.toString()), 0),
  }

  if (loading) {
    return (
      <GlassCard className="p-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading bookings...</span>
      </GlassCard>
    )
  }

  if (error) {
    return (
      <GlassCard className="p-6">
        <div className="text-center text-red-500">
          <p className="font-semibold">Error loading bookings</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchBookings}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
          >
            Retry
          </button>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Ticket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Total Bookings</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.confirmed}</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Confirmed</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pending}</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">${stats.revenue.toFixed(2)}</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Revenue</p>
        </GlassCard>
      </div>

      {/* Bookings Table */}
      <GlassCard>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Bookings</h2>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("confirmed")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "confirmed"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "pending"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
            >
              Pending
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Ticket ID</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Passenger</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Route</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Date & Time</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Seat</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Price</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                        TCK-{booking.id}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{booking.passenger_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{booking.passenger_email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Route {booking.route_id}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Seat {booking.seat_number}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-slate-900 dark:text-white">{new Date(booking.booking_date).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{booking.travel_time || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-sm">
                      {booking.seat_number}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ${parseFloat(booking.price.toString()).toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === "confirmed"
                        ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                        : "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                        }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
