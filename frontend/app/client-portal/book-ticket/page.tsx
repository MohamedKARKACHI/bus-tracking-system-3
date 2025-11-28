"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MapPin, CreditCard, ArrowRight, Check } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BusMap } from "@/components/bus-map"

export default function BookTicketPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [booking, setBooking] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
    route: "",
    busId: "",
    seatNumbers: [] as number[],
    totalPrice: 0,
  })

  const routes = [
    { id: "101", name: "Downtown Express", from: "Main Station", to: "Downtown", price: 5.5, duration: "25 min" },
    { id: "205", name: "Airport Shuttle", from: "City Center", to: "Airport", price: 12.0, duration: "45 min" },
    { id: "308", name: "University Line", from: "Metro Hub", to: "University", price: 3.0, duration: "20 min" },
    { id: "412", name: "Beach Route", from: "Plaza Mall", to: "Beach", price: 8.5, duration: "35 min" },
  ]

  const availableSeats = Array.from({ length: 40 }, (_, i) => i + 1)

  const handleSelectRoute = (route: any) => {
    setBooking({
      ...booking,
      route: route.name,
      busId: route.id,
      from: route.from,
      to: route.to,
      totalPrice: route.price * booking.passengers,
    })
    setStep(2)
  }

  const handleSelectSeats = (seatNumber: number) => {
    const newSeats = booking.seatNumbers.includes(seatNumber)
      ? booking.seatNumbers.filter((s) => s !== seatNumber)
      : [...booking.seatNumbers, seatNumber]

    if (newSeats.length <= booking.passengers) {
      setBooking({ ...booking, seatNumbers: newSeats })
    }
  }

  const handlePayment = () => {
    // Generate ticket ID
    const ticketId = `TCK-${Date.now().toString().slice(-6)}`
    // Redirect to ticket page
    router.push(`/client-portal/my-tickets/${ticketId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Book Your Ticket</h1>
          <p className="text-slate-600 dark:text-slate-400">Choose your route, select seats, and complete payment</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {step > s ? <Check className="w-6 h-6" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-16 md:w-24 h-1 rounded-full transition-all ${
                      step > s ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 md:gap-16">
            <span
              className={`text-xs md:text-sm font-medium ${step >= 1 ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500"}`}
            >
              Route
            </span>
            <span
              className={`text-xs md:text-sm font-medium ${step >= 2 ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500"}`}
            >
              Seats
            </span>
            <span
              className={`text-xs md:text-sm font-medium ${step >= 3 ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500"}`}
            >
              Details
            </span>
            <span
              className={`text-xs md:text-sm font-medium ${step >= 4 ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500"}`}
            >
              Payment
            </span>
          </div>
        </div>

        {/* Step 1: Select Route */}
        {step === 1 && (
          <div className="space-y-4">
            <GlassCard>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Select Your Route</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {routes.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => handleSelectRoute(route)}
                    className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 bg-white dark:bg-slate-800 hover:shadow-xl transition-all text-left group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{route.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span>{route.from}</span>
                          <ArrowRight className="w-4 h-4 text-cyan-600" />
                          <span>{route.to}</span>
                        </div>
                        <p className="text-xs text-slate-500">{route.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">${route.price}</p>
                        <p className="text-xs text-slate-500">per person</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Available Now</span>
                      <ArrowRight className="w-5 h-5 text-cyan-600 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Route Preview Map */}
            {booking.route && (
              <GlassCard>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Route Preview</h2>
                <BusMap 
                  height="300px" 
                  showControls={false}
                  highlightBus={booking.busId ? `BUS-${booking.busId}` : null}
                />
              </GlassCard>
            )}
          </div>
        )}

        {/* Step 2: Select Seats */}
        {step === 2 && (
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Select Your Seats</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Choose {booking.passengers} seat{booking.passengers > 1 ? "s" : ""} for {booking.route}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400">Selected</p>
                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  {booking.seatNumbers.length}/{booking.passengers}
                </p>
              </div>
            </div>

            {/* Bus Layout */}
            <div className="mb-6 p-6 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <div className="text-center mb-4">
                <div className="inline-block px-4 py-2 bg-slate-700 text-white rounded-t-xl font-medium">Driver</div>
              </div>
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {availableSeats.map((seat) => {
                  const isSelected = booking.seatNumbers.includes(seat)
                  const isOccupied = [5, 12, 18, 23, 31].includes(seat) // Mock occupied seats

                  return (
                    <button
                      key={seat}
                      onClick={() => !isOccupied && handleSelectSeats(seat)}
                      disabled={isOccupied}
                      className={`aspect-square rounded-xl font-bold text-sm transition-all ${
                        isOccupied
                          ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                          : isSelected
                            ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg scale-110"
                            : "bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-cyan-100 dark:hover:bg-cyan-900 hover:scale-105"
                      }`}
                    >
                      {seat}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white dark:bg-slate-600 rounded-lg border-2 border-slate-300 dark:border-slate-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg"></div>
                  <span className="text-slate-600 dark:text-slate-400">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-slate-300 dark:bg-slate-700 rounded-lg"></div>
                  <span className="text-slate-600 dark:text-slate-400">Occupied</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={booking.seatNumbers.length !== booking.passengers}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
              >
                Continue
              </Button>
            </div>
          </GlassCard>
        )}

        {/* Step 3: Enter Details */}
        {step === 3 && (
          <GlassCard>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Passenger Details</h2>
            <div className="space-y-4 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Full Name</label>
                  <Input placeholder="John Doe" className="py-6" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Email</label>
                  <Input type="email" placeholder="john@example.com" defaultValue={user?.email} className="py-6" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Phone Number
                  </label>
                  <Input placeholder="+1 (555) 123-4567" className="py-6" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Travel Date
                  </label>
                  <Input
                    type="date"
                    className="py-6"
                    value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-2xl border border-cyan-200 dark:border-cyan-800 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Route:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{booking.route}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">From - To:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {booking.from} → {booking.to}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Seats:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{booking.seatNumbers.join(", ")}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-cyan-300 dark:border-cyan-700">
                  <span className="text-slate-600 dark:text-slate-400">Total Price:</span>
                  <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    ${booking.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
              >
                Continue to Payment
              </Button>
            </div>
          </GlassCard>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <GlassCard>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Payment Details</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Card Number</label>
                <Input placeholder="1234 5678 9012 3456" className="py-6" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Expiry Date
                  </label>
                  <Input placeholder="MM/YY" className="py-6" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">CVV</label>
                  <Input placeholder="123" className="py-6" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Cardholder Name
                </label>
                <Input placeholder="JOHN DOE" className="py-6" />
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    ${booking.totalPrice.toFixed(2)}
                  </p>
                </div>
                <CreditCard className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setStep(3)} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={handlePayment}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white shadow-lg"
              >
                Complete Payment
              </Button>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
