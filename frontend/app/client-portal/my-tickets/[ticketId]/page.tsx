"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Download, Share2, MapPin, Calendar, Clock, User, CheckCircle, Sparkles, QrCode, FileImage, FileText, X, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TicketPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const ticketRef = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [showDownloadPopup, setShowDownloadPopup] = useState(false)

  const downloadAsImage = () => {
    setShowDownloadPopup(false)
    setDownloading(true)
    
    // Create a canvas with the ticket design
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      alert('Canvas not supported')
      setDownloading(false)
      return
    }

    // Set canvas size
    canvas.width = 800
    canvas.height = 1000

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 800, 1000)
    bgGradient.addColorStop(0, '#e0f2fe')
    bgGradient.addColorStop(1, '#ccfbf1')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, 800, 1000)

    // Ticket container background
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = 'rgba(0,0,0,0.1)'
    ctx.shadowBlur = 20
    ctx.shadowOffsetY = 10
    roundRect(ctx, 40, 40, 720, 920, 24)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0

    // Header gradient
    const headerGradient = ctx.createLinearGradient(40, 40, 760, 200)
    headerGradient.addColorStop(0, '#06b6d4')
    headerGradient.addColorStop(1, '#3b82f6')
    ctx.fillStyle = headerGradient
    roundRect(ctx, 40, 40, 720, 160, 24, true)
    ctx.fill()

    // Ticket ID
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.font = 'bold 14px -apple-system, sans-serif'
    ctx.fillText(`TICKET ID: ${ticketData.id}`, 60, 70)

    // Route name
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 28px -apple-system, sans-serif'
    ctx.fillText(ticketData.route, 60, 110)

    // Bus number
    ctx.font = '16px -apple-system, sans-serif'
    ctx.fillText(`Bus #${ticketData.busNumber}`, 60, 135)

    // Journey FROM
    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.fillText('FROM', 60, 160)
    ctx.font = 'bold 20px -apple-system, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(ticketData.from, 60, 185)

    // Arrow
    ctx.font = '24px -apple-system, sans-serif'
    ctx.fillText('→', 380, 185)

    // Journey TO
    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.fillText('TO', 680, 160)
    ctx.font = 'bold 20px -apple-system, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'right'
    ctx.fillText(ticketData.to, 740, 185)
    ctx.textAlign = 'left'

    // Perforated line
    ctx.fillStyle = '#06b6d4'
    ctx.fillRect(40, 200, 720, 32)
    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(60 + i * 40, 200, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(60 + i * 40, 232, 6, 0, Math.PI * 2)
      ctx.fill()
    }

    // Details section
    ctx.fillStyle = '#0f172a'
    
    // Passenger
    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('PASSENGER', 120, 280)
    ctx.font = 'bold 18px -apple-system, sans-serif'
    ctx.fillStyle = '#0f172a'
    ctx.fillText(ticketData.passengerName, 120, 305)

    // Date
    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('DATE', 480, 280)
    ctx.font = 'bold 18px -apple-system, sans-serif'
    ctx.fillStyle = '#0f172a'
    ctx.fillText(ticketData.date, 480, 305)

    // Time
    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('TIME', 120, 360)
    ctx.font = 'bold 18px -apple-system, sans-serif'
    ctx.fillStyle = '#0f172a'
    ctx.fillText(ticketData.time, 120, 385)

    // QR Code container (white background with shadow)
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = 'rgba(0,0,0,0.1)'
    ctx.shadowBlur = 20
    ctx.shadowOffsetY = 8
    roundRect(ctx, 530, 330, 160, 160, 16)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0
    
    // Border
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)'
    ctx.lineWidth = 2
    roundRect(ctx, 530, 330, 160, 160, 16)
    ctx.stroke()
    
    // QR Code dark background
    const qrGradient = ctx.createLinearGradient(554, 354, 666, 466)
    qrGradient.addColorStop(0, '#1e293b')
    qrGradient.addColorStop(1, '#475569')
    ctx.fillStyle = qrGradient
    roundRect(ctx, 554, 354, 112, 112, 12)
    ctx.fill()
    
    // Simple QR code icon (like lucide QR icon)
    ctx.fillStyle = '#ffffff'
    ctx.lineWidth = 4
    ctx.strokeStyle = '#ffffff'
    
    // Outer frame
    ctx.strokeRect(574, 374, 72, 72)
    
    // Corner squares
    ctx.fillRect(580, 380, 18, 18)
    ctx.fillRect(612, 380, 18, 18)
    ctx.fillRect(580, 412, 18, 18)
    
    // Dots in middle
    ctx.fillRect(606, 406, 6, 6)
    ctx.fillRect(618, 406, 6, 6)
    ctx.fillRect(606, 418, 6, 6)
    ctx.fillRect(618, 418, 6, 6)
    ctx.fillRect(612, 424, 6, 6)
    
    ctx.font = '11px -apple-system, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.textAlign = 'center'
    ctx.fillText('Scan this QR code to board', 610, 500)
    ctx.textAlign = 'left'

    // Seat and Price section
    const seatPriceGradient = ctx.createLinearGradient(60, 540, 740, 600)
    seatPriceGradient.addColorStop(0, '#ecfeff')
    seatPriceGradient.addColorStop(1, '#dbeafe')
    ctx.fillStyle = seatPriceGradient
    roundRect(ctx, 60, 540, 680, 80, 16)
    ctx.fill()

    // Seat
    ctx.font = '14px -apple-system, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.textAlign = 'center'
    ctx.fillText('SEAT NUMBER', 220, 570)
    ctx.font = 'bold 32px -apple-system, sans-serif'
    ctx.fillStyle = '#06b6d4'
    ctx.fillText(ticketData.seatNumber, 220, 605)

    // Price
    ctx.font = '14px -apple-system, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('AMOUNT PAID', 580, 570)
    ctx.font = 'bold 32px -apple-system, sans-serif'
    ctx.fillStyle = '#10b981'
    ctx.fillText(ticketData.price, 580, 605)
    ctx.textAlign = 'left'

    // Barcode (w-2 bars with gap-1 spacing like web)
    const barcodeY = 680
    const barcodeX = 260
    const barWidth = 8
    const barGap = 4
    const maxHeight = 64
    
    ticketData.barcode.split('').forEach((_, i) => {
      ctx.fillStyle = '#0f172a'
      const height = i % 2 === 0 ? maxHeight : maxHeight * 0.6
      const x = barcodeX + i * (barWidth + barGap)
      const y = barcodeY + (maxHeight - height) / 2
      roundRect(ctx, x, y, barWidth, height, barWidth / 2)
      ctx.fill()
    })

    ctx.font = '11px -apple-system, monospace'
    ctx.fillStyle = '#64748b'
    ctx.textAlign = 'center'
    ctx.fillText(ticketData.barcode.split('').join(' '), 400, barcodeY + 85)
    ctx.textAlign = 'left'

    // Notice
    ctx.fillStyle = '#fef3c7'
    roundRect(ctx, 60, 800, 680, 60, 12)
    ctx.fill()
    ctx.fillStyle = '#92400e'
    ctx.font = '13px -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('⚠️ Please arrive at the boarding point 10 minutes', 400, 830)
    ctx.fillText('before departure time', 400, 850)

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `BusTrack-Ticket-${ticketData.id}.png`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        setDownloading(false)
      }
    }, 'image/png')
  }

  // Helper function to draw rounded rectangles
  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, topOnly = false) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    if (topOnly) {
      ctx.lineTo(x + width, y + height)
      ctx.lineTo(x, y + height)
    } else {
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    }
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }

  const downloadAsPDF = () => {
    setShowDownloadPopup(false)
    setDownloading(true)
    
    // Create a canvas with the ticket design (same as image)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      alert('Canvas not supported')
      setDownloading(false)
      return
    }

    // Same drawing code as downloadAsImage
    canvas.width = 800
    canvas.height = 1000

    const bgGradient = ctx.createLinearGradient(0, 0, 800, 1000)
    bgGradient.addColorStop(0, '#e0f2fe')
    bgGradient.addColorStop(1, '#ccfbf1')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, 800, 1000)

    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = 'rgba(0,0,0,0.1)'
    ctx.shadowBlur = 20
    ctx.shadowOffsetY = 10
    roundRect(ctx, 40, 40, 720, 920, 24)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0

    const headerGradient = ctx.createLinearGradient(40, 40, 760, 200)
    headerGradient.addColorStop(0, '#06b6d4')
    headerGradient.addColorStop(1, '#3b82f6')
    ctx.fillStyle = headerGradient
    roundRect(ctx, 40, 40, 720, 160, 24, true)
    ctx.fill()

    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.font = 'bold 14px -apple-system, sans-serif'
    ctx.fillText(`TICKET ID: ${ticketData.id}`, 60, 70)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 28px -apple-system, sans-serif'
    ctx.fillText(ticketData.route, 60, 110)

    ctx.font = '16px -apple-system, sans-serif'
    ctx.fillText(`Bus #${ticketData.busNumber}`, 60, 135)

    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.fillText('FROM', 60, 160)
    ctx.font = 'bold 20px -apple-system, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(ticketData.from, 60, 185)

    ctx.font = '24px -apple-system, sans-serif'
    ctx.fillText('→', 380, 185)

    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.fillText('TO', 680, 160)
    ctx.font = 'bold 20px -apple-system, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'right'
    ctx.fillText(ticketData.to, 740, 185)
    ctx.textAlign = 'left'

    ctx.fillStyle = '#06b6d4'
    ctx.fillRect(40, 200, 720, 32)
    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(60 + i * 40, 200, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(60 + i * 40, 232, 6, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('PASSENGER', 120, 280)
    ctx.font = 'bold 18px -apple-system, sans-serif'
    ctx.fillStyle = '#0f172a'
    ctx.fillText(ticketData.passengerName, 120, 305)

    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('DATE', 480, 280)
    ctx.font = 'bold 18px -apple-system, sans-serif'
    ctx.fillStyle = '#0f172a'
    ctx.fillText(ticketData.date, 480, 305)

    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('TIME', 120, 360)
    ctx.font = 'bold 18px -apple-system, sans-serif'
    ctx.fillStyle = '#0f172a'
    ctx.fillText(ticketData.time, 120, 385)

    // QR Code container (white background with shadow)
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = 'rgba(0,0,0,0.1)'
    ctx.shadowBlur = 20
    ctx.shadowOffsetY = 8
    roundRect(ctx, 530, 330, 160, 160, 16)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0
    
    // Border
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)'
    ctx.lineWidth = 2
    roundRect(ctx, 530, 330, 160, 160, 16)
    ctx.stroke()
    
    // QR Code dark background
    const qrGradient = ctx.createLinearGradient(554, 354, 666, 466)
    qrGradient.addColorStop(0, '#1e293b')
    qrGradient.addColorStop(1, '#475569')
    ctx.fillStyle = qrGradient
    roundRect(ctx, 554, 354, 112, 112, 12)
    ctx.fill()
    
    // Simple QR code icon (like lucide QR icon)
    ctx.fillStyle = '#ffffff'
    ctx.lineWidth = 4
    ctx.strokeStyle = '#ffffff'
    
    // Outer frame
    ctx.strokeRect(574, 374, 72, 72)
    
    // Corner squares
    ctx.fillRect(580, 380, 18, 18)
    ctx.fillRect(612, 380, 18, 18)
    ctx.fillRect(580, 412, 18, 18)
    
    // Dots in middle
    ctx.fillRect(606, 406, 6, 6)
    ctx.fillRect(618, 406, 6, 6)
    ctx.fillRect(606, 418, 6, 6)
    ctx.fillRect(618, 418, 6, 6)
    ctx.fillRect(612, 424, 6, 6)
    
    ctx.font = '11px -apple-system, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.textAlign = 'center'
    ctx.fillText('Scan this QR code to board', 610, 500)
    ctx.textAlign = 'left'

    const seatPriceGradient = ctx.createLinearGradient(60, 540, 740, 600)
    seatPriceGradient.addColorStop(0, '#ecfeff')
    seatPriceGradient.addColorStop(1, '#dbeafe')
    ctx.fillStyle = seatPriceGradient
    roundRect(ctx, 60, 540, 680, 80, 16)
    ctx.fill()

    ctx.font = '14px -apple-system, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.textAlign = 'center'
    ctx.fillText('SEAT NUMBER', 220, 570)
    ctx.font = 'bold 32px -apple-system, sans-serif'
    ctx.fillStyle = '#06b6d4'
    ctx.fillText(ticketData.seatNumber, 220, 605)

    ctx.font = '14px -apple-system, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('AMOUNT PAID', 580, 570)
    ctx.font = 'bold 32px -apple-system, sans-serif'
    ctx.fillStyle = '#10b981'
    ctx.fillText(ticketData.price, 580, 605)
    ctx.textAlign = 'left'

    // Barcode (w-2 bars with gap-1 spacing like web)
    const barcodeY = 680
    const barcodeX = 260
    const barWidth = 8
    const barGap = 4
    const maxHeight = 64
    
    ticketData.barcode.split('').forEach((_, i) => {
      ctx.fillStyle = '#0f172a'
      const height = i % 2 === 0 ? maxHeight : maxHeight * 0.6
      const x = barcodeX + i * (barWidth + barGap)
      const y = barcodeY + (maxHeight - height) / 2
      roundRect(ctx, x, y, barWidth, height, barWidth / 2)
      ctx.fill()
    })

    ctx.font = '11px -apple-system, monospace'
    ctx.fillStyle = '#64748b'
    ctx.textAlign = 'center'
    ctx.fillText(ticketData.barcode.split('').join(' '), 400, barcodeY + 85)
    ctx.textAlign = 'left'

    ctx.fillStyle = '#fef3c7'
    roundRect(ctx, 60, 800, 680, 60, 12)
    ctx.fill()
    ctx.fillStyle = '#92400e'
    ctx.font = '13px -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('⚠️ Please arrive at the boarding point 10 minutes', 400, 830)
    ctx.fillText('before departure time', 400, 850)

    // Convert to PDF using jsPDF
    import('jspdf').then(({ default: jsPDF }) => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`BusTrack-Ticket-${ticketData.id}.pdf`)
      setDownloading(false)
    }).catch(() => {
      alert('Failed to load PDF library')
      setDownloading(false)
    })
  }

  const handleDownloadTicket = () => {
    setShowDownloadPopup(true)
  }

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
            onClick={handleDownloadTicket}
            disabled={downloading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg px-8 py-6"
          >
            <Download className="w-5 h-5 mr-2" />
            {downloading ? "Downloading..." : "Download Ticket"}
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

      {/* Download Format Popup */}
      {showDownloadPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-2 border-cyan-500/20 rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setShowDownloadPopup(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Choose Download Format
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Select your preferred format to save the ticket
                </p>
              </div>

              {/* Format Options */}
              <div className="space-y-3 mb-6">
                {/* PDF Option */}
                <button
                  onClick={downloadAsPDF}
                  disabled={downloading}
                  className="group relative w-full p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-red-500/50 dark:hover:border-red-500/50 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Printer className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        Print / Save as PDF
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Use your browser's print dialog
                      </p>
                    </div>
                    <div className="text-red-600 dark:text-red-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Print →
                    </div>
                  </div>
                </button>

                {/* Image Option */}
                <button
                  onClick={downloadAsImage}
                  disabled={downloading}
                  className="group relative w-full p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 bg-white dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FileImage className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        Image (PNG)
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Easy to share on social media
                      </p>
                    </div>
                    <div className="text-cyan-600 dark:text-cyan-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Download →
                    </div>
                  </div>
                </button>
              </div>

              {/* Cancel Button */}
              <button
                onClick={() => setShowDownloadPopup(false)}
                className="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-all duration-200"
              >
                Cancel
              </button>

              {/* Download Status */}
              {downloading && (
                <div className="mt-4 p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-cyan-700 dark:text-cyan-300 font-medium">
                    Preparing your ticket...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
