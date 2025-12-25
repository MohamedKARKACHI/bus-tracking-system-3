"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Download, Share2, MapPin, Calendar, Clock, User, CheckCircle, Sparkles, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"

const downloadTicket = async (ticketRef: React.RefObject<HTMLDivElement>, ticketId: string) => {
  try {
    const element = ticketRef.current
    if (!element) return

    const clonedElement = element.cloneNode(true) as HTMLElement
    // We need to append the clone to the body to ensure styles are computed correctly, 
    // but hide it from view.
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    document.body.appendChild(clonedElement);

    const allElements = [clonedElement, ...clonedElement.querySelectorAll("*")]

    allElements.forEach((el) => {
      const computed = window.getComputedStyle(el as HTMLElement)
      const inlineStyle = (el as HTMLElement).getAttribute("style") || ""

      // Copy all computed styles to inline style to avoid CSS parsing issues
      let styleString = inlineStyle
      for (let i = 0; i < computed.length; i++) {
        const prop = computed[i]
        const value = computed.getPropertyValue(prop)
        if (value && !inlineStyle.includes(prop)) {
          // Avoid copying big properties that might cause issues or aren't needed
          if (typeof value === 'string') {
            styleString += `${prop}:${value};`
          }
        }
      }
      ; (el as HTMLElement).setAttribute("style", styleString)
    })

    // Dynamic import to avoid SSR issues
    const html2canvas = (await import("html2canvas")).default

    // Capture the ticket as canvas
    const canvas = await html2canvas(clonedElement, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      ignoreElements: (element: Element) => {
        // Ignore elements that might cause issues
        return element.tagName === "SCRIPT" || element.tagName === "STYLE"
      },
    })

    // Clean up
    document.body.removeChild(clonedElement);

    // Create download link
    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = `ticket-${ticketId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error("Error downloading ticket:", error)
    alert("Failed to download ticket. Please try again.")
  }
}

export default function TicketPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const ticketRef = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
    setTimeout(() => setAnimated(true), 100)
  }, [user, router])

  if (!user) return null

  const ticketData = {
    id: params.ticketId as string,
    route: "Downtown Express",
    from: "Main Station",
    to: "Downtown Center",
    date: "Dec 28, 2024",
    time: "2:30 PM",
    busNumber: "101",
    seatNumber: "12A",
    passengerName: user.name,
    price: "$5.50",
    status: "confirmed",
    barcode: "123456789012",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full mb-4 transition-all duration-500 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Booking Confirmed</span>
          </div>
          <h1
            className={`text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 transition-all duration-500 delay-100 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            Your Digital Ticket
          </h1>
          <p
            className={`text-slate-600 dark:text-slate-400 transition-all duration-500 delay-200 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            Save this page or download your ticket
          </p>
        </div>

        {/* Digital Ticket - Holographic Design */}
        <div
          ref={ticketRef}
          className={`relative transition-all duration-700 delay-300 ${animated ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-xl opacity-30 animate-pulse" />

          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-900/90 dark:to-slate-800/70 rounded-3xl overflow-hidden shadow-2xl border border-white/50 dark:border-slate-700/50">
            {/* Holographic Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -skew-x-12 animate-shimmer" />

            {/* Top Section - Ticket Header */}
            <div className="relative p-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-700/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-semibold tracking-wider opacity-90">E-TICKET</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-1">{ticketData.route}</h2>
                  <p className="text-cyan-100 text-sm">Bus #{ticketData.busNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90 mb-1">Ticket ID</p>
                  <p className="text-lg font-bold tracking-wider">{ticketData.id}</p>
                </div>
              </div>

              {/* Journey Info */}
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-cyan-100 mb-1">FROM</p>
                  <p className="text-xl font-bold">{ticketData.from}</p>
                </div>
                <div className="flex flex-col items-center gap-2 px-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="w-24 h-0.5 bg-white/30" />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-xs text-cyan-100 mb-1">TO</p>
                  <p className="text-xl font-bold">{ticketData.to}</p>
                </div>
              </div>
            </div>

            {/* Perforated Edge Effect */}
            <div className="relative h-8 bg-gradient-to-r from-cyan-500 to-blue-600">
              <div className="absolute top-0 left-0 right-0 flex justify-between px-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-blue-50 dark:bg-slate-950 rounded-full -translate-y-1/2" />
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-white/90 dark:bg-slate-900/90 rounded-full translate-y-1/2" />
                ))}
              </div>
            </div>

            {/* Bottom Section - Ticket Details */}
            <div className="relative p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">PASSENGER</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{ticketData.passengerName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">DATE</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{ticketData.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">TIME</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{ticketData.time}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - QR Code */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative">
                    {/* QR Code with Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 blur-xl opacity-30 rounded-2xl" />
                    <div className="relative p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-cyan-500/30">
                      <div className="w-40 h-40 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 rounded-xl flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-white dark:text-slate-900" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
                    Scan this QR code to board
                  </p>
                </div>
              </div>

              {/* Seat and Price Info */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-2xl border border-cyan-200 dark:border-cyan-800">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">SEAT NUMBER</p>
                  <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{ticketData.seatNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">AMOUNT PAID</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{ticketData.price}</p>
                </div>
              </div>

              {/* Barcode */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center gap-1 h-16 mb-2">
                  {ticketData.barcode.split("").map((digit, i) => (
                    <div
                      key={i}
                      className="w-2 bg-slate-900 dark:bg-slate-100 rounded-full"
                      style={{ height: i % 2 === 0 ? "100%" : "60%" }}
                    />
                  ))}
                </div>
                <p className="text-center text-xs text-slate-500 dark:text-slate-400 tracking-widest">
                  {ticketData.barcode}
                </p>
              </div>

              {/* Footer Note */}
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs text-yellow-800 dark:text-yellow-300 text-center">
                  Please arrive at the boarding point 10 minutes before departure time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex flex-wrap gap-4 justify-center mt-8 transition-all duration-700 delay-500 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Button
            onClick={() => downloadTicket(ticketRef, ticketData.id)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg px-8 py-6"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Ticket
          </Button>
          <Button variant="outline" className="px-8 py-6 border-2 bg-transparent">
            <Share2 className="w-5 h-5 mr-2" />
            Share Ticket
          </Button>
          <Button variant="outline" onClick={() => router.push("/client-portal")} className="px-8 py-6 border-2">
            Back to Portal
          </Button>
        </div>

        {/* Help Text */}
        <p
          className={`text-center text-sm text-slate-600 dark:text-slate-400 mt-8 transition-all duration-700 delay-600 ${animated ? "opacity-100" : "opacity-0"}`}
        >
          Need help? Contact our support team at support@bustrack.com
        </p>
      </div>
    </div>
  )
}
