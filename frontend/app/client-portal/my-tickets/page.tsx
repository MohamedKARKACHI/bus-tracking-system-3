"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"
import {
  QrCode, Calendar, Download, Share2, Ticket, X, ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

import { useTickets } from "@/lib/ticket-context"

export default function PremiumMyTickets() {
  const { isDark } = useTheme()
  const { tickets: allTickets } = useTickets()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming')
  const [showQRModal, setShowQRModal] = useState<number | null>(null)

  const tickets = allTickets.filter(t =>
    activeTab === 'upcoming' ? t.status === 'upcoming' : t.status === 'completed'
  )

  const handleDownload = (ticket: typeof allTickets[0]) => {
    // Create ticket data as text
    const ticketData = `
PremiumBus - Digital Ticket
============================
Code: ${ticket.code}
Route: ${ticket.from} → ${ticket.to}
Date: ${ticket.date}
Time: ${ticket.time}
Seat: ${ticket.seat}
Price: $${ticket.price}
============================
    `.trim()

    const blob = new Blob([ticketData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ticket-${ticket.code}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async (ticket: typeof allTickets[0]) => {
    const shareData = {
      title: 'My Bus Ticket',
      text: `🚌 ${ticket.from} → ${ticket.to}\n📅 ${ticket.date} at ${ticket.time}\n💺 Seat ${ticket.seat}`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.text)
      alert('Ticket info copied to clipboard!')
    }
  }

  return (
    <>
      {/* QR Code Modal */}
      {showQRModal !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={cn(
            "relative w-[90%] max-w-sm p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300",
            isDark ? "bg-slate-900" : "bg-white"
          )}>
            <button
              onClick={() => setShowQRModal(null)}
              className={cn(
                "absolute top-4 right-4 p-2 rounded-full transition-colors",
                isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-500"
              )}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className={cn("text-xl font-bold mb-6 text-center", isDark ? "text-white" : "text-slate-900")}>
              Scan to Board
            </h3>

            {/* QR Code Placeholder */}
            <div className={cn(
              "w-48 h-48 mx-auto rounded-2xl flex items-center justify-center mb-6",
              isDark ? "bg-white" : "bg-slate-100"
            )}>
              <QrCode className="w-32 h-32 text-slate-900" />
            </div>

            <p className={cn("text-center text-sm font-mono", isDark ? "text-slate-400" : "text-slate-500")}>
              {allTickets.find(t => t.id === showQRModal)?.code}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className={cn("text-2xl sm:text-3xl font-bold mb-1", isDark ? "text-white" : "text-slate-900")}>
              My Tickets
            </h1>
            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
              Manage your upcoming and past journeys
            </p>
          </div>

          {/* Tab Toggle */}
          <div className={cn(
            "flex p-1 rounded-2xl border",
            isDark ? "bg-white/5 border-white/5" : "bg-slate-100 border-slate-200"
          )}>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={cn(
                "px-4 sm:px-6 py-2 text-sm font-bold rounded-xl transition-all",
                activeTab === 'upcoming'
                  ? isDark ? "bg-slate-800 text-white shadow-sm" : "bg-white text-slate-900 shadow-sm"
                  : isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "px-4 sm:px-6 py-2 text-sm font-bold rounded-xl transition-all",
                activeTab === 'history'
                  ? isDark ? "bg-slate-800 text-white shadow-sm" : "bg-white text-slate-900 shadow-sm"
                  : isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-700"
              )}
            >
              History
            </button>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className={cn(
              "text-center py-16 rounded-3xl border",
              isDark ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200"
            )}>
              <Ticket className={cn("w-12 h-12 mx-auto mb-4", isDark ? "text-slate-600" : "text-slate-300")} />
              <p className={cn("font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                No {activeTab} tickets
              </p>
              {activeTab === 'upcoming' && (
                <Link
                  href="/client-portal/book-ticket"
                  className="inline-block mt-4 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  Book a Trip
                </Link>
              )}
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={cn(
                  "group rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-xl",
                  isDark ? "bg-slate-800/80" : "bg-white"
                )}
              >
                {/* Ticket Body */}
                <div className="p-5 sm:p-6">
                  {/* Route Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2.5 rounded-xl",
                        ticket.status === 'upcoming'
                          ? "bg-blue-500/10 text-blue-500"
                          : isDark ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-400"
                      )}>
                        <Ticket className="w-5 h-5" />
                      </div>

                      {/* Route - Stacks on Mobile */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className={cn(
                          "text-lg sm:text-xl font-bold",
                          isDark ? "text-white" : "text-slate-900"
                        )}>
                          {ticket.from}
                        </span>
                        <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full self-start",
                          isDark ? "bg-white/10 text-slate-400" : "bg-slate-100 text-slate-500"
                        )}>
                          DIRECT
                        </span>
                        <span className={cn(
                          "text-lg sm:text-xl font-bold",
                          isDark ? "text-white" : "text-slate-900"
                        )}>
                          {ticket.to}
                        </span>
                      </div>
                    </div>

                    {/* QR Button */}
                    <button
                      onClick={() => setShowQRModal(ticket.id)}
                      className={cn(
                        "p-3 rounded-xl transition-colors",
                        isDark
                          ? "bg-slate-700 text-white hover:bg-slate-600"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Details Row */}
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    <div>
                      <p className={cn("text-[10px] font-bold uppercase tracking-wider mb-1", isDark ? "text-slate-500" : "text-slate-400")}>
                        DATE & TIME
                      </p>
                      <p className={cn("text-sm font-semibold flex items-center gap-2", isDark ? "text-slate-200" : "text-slate-700")}>
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        {ticket.date} • {ticket.time}
                      </p>
                    </div>
                    <div>
                      <p className={cn("text-[10px] font-bold uppercase tracking-wider mb-1", isDark ? "text-slate-500" : "text-slate-400")}>
                        SEAT
                      </p>
                      <p className={cn("text-sm font-semibold flex items-center gap-2", isDark ? "text-slate-200" : "text-slate-700")}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {ticket.seat} (Window)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className={cn(
                  "flex items-center justify-between px-5 py-3 border-t",
                  isDark ? "bg-slate-900/50 border-white/5" : "bg-slate-50 border-slate-100"
                )}>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDownload(ticket)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-400 hover:text-blue-500 hover:bg-white"
                      )}
                      title="Download Ticket"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare(ticket)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-400 hover:text-blue-500 hover:bg-white"
                      )}
                      title="Share Ticket"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    href={`/client-portal/my-tickets/${ticket.id}`}
                    className={cn(
                      "flex items-center gap-1 text-sm font-bold transition-colors",
                      isDark ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-600 hover:text-emerald-700"
                    )}
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
