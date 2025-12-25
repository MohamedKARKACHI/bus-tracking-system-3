"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MapPin, CreditCard, ArrowRight, Check, Loader2, Bus, Clock, Users, ChevronRight, Wifi } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BusMap } from "@/components/bus-map"

// Moroccan stations from map data
const moroccanStations = [
  // Marrakech
  "Palmeraie", "Gueliz", "Massira", "Bab Doukkala", "Marjane Gueliz",
  "Bab Agnaou", "Menara", "Place 16 Novembre", "Ben Youssef", "Majorelle Garden",
  "Train Station", "Hivernage", "Koutoubia", "Jemaa el Fna", "Medina", "Gare ONCF Marrakech",
  // Casablanca
  "Casa Port", "Morocco Mall", "Hassan II Mosque", "Maarif", "Twin Center",
  // Tangier
  "Port Tanger Med", "Grand Socco", "Kasbah", "Ibn Batouta Mall"
];

interface Route {
  id: string;
  name: string;
  route_number?: string;
  start_location: string;
  end_location: string;
  price: number;
  duration_minutes: number;
  status?: string;
  available_buses?: number;
}

export default function BookTicketPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [routes, setRoutes] = useState<Route[]>([])
  const [popularRoutes, setPopularRoutes] = useState<Route[]>([])
  const [filteredStations, setFilteredStations] = useState<string[]>([])
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)
  
  const [booking, setBooking] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
    route: "",
    routeId: "",
    busId: "",
    seatNumbers: [] as number[],
    totalPrice: 0,
    passengerName: user?.name || "",
    passengerEmail: user?.email || "",
    passengerPhone: "",
  })

  // Fetch routes from API
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8080/api/routes')
        if (response.ok) {
          const data = await response.json()
          setRoutes(data)
        }
      } catch (error) {
        console.error('Error fetching routes:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchPopularRoutes = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/routes') // No popular endpoint, fallback to all
        if (response.ok) {
          const data = await response.json()
          setPopularRoutes(data)
        }
      } catch (error) {
        console.error('Error fetching popular routes:', error)
      }
    }

    fetchRoutes()
    fetchPopularRoutes()
  }, [])

  useEffect(() => {
    if (booking.from || booking.to) {
      const searchRoutes = async () => {
        try {
          const params = new URLSearchParams()
          if (booking.from) params.append('from', booking.from)
          if (booking.to) params.append('to', booking.to)
          
          const response = await fetch(`http://localhost:8080/api/routes?${params}`)
          if (response.ok) {
            const data = await response.json()
            setRoutes(data)
          }
        } catch (error) {
          console.error('Error searching routes:', error)
        }
      }
      searchRoutes()
    }
  }, [booking.from, booking.to])

  const filterStations = (input: string) => {
    return moroccanStations.filter(station => 
      station.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5)
  }

  const handleFromChange = (value: string) => {
    setBooking({ ...booking, from: value })
    setFilteredStations(filterStations(value))
    setShowFromSuggestions(true)
  }

  const handleToChange = (value: string) => {
    setBooking({ ...booking, to: value })
    setFilteredStations(filterStations(value))
    setShowToSuggestions(true)
  }

  const selectStation = (station: string, type: 'from' | 'to') => {
    if (type === 'from') {
      setBooking({ ...booking, from: station })
      setShowFromSuggestions(false)
    } else {
      setBooking({ ...booking, to: station })
      setShowToSuggestions(false)
    }
  }

  const availableSeats = Array.from({ length: 40 }, (_, i) => i + 1)

  const handleSelectRoute = (route: Route) => {
    setBooking({
      ...booking,
      route: `${route.start_location} → ${route.end_location}`,
      routeId: route.id,
      from: route.start_location,
      to: route.end_location,
      totalPrice: route.base_price * booking.passengers,
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

  const handlePayment = async () => {
    // Simulate successful booking and show ticket/confirmation
    setStep(5); // Add a new step for ticket display
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `${numPrice.toFixed(0)} MAD`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Where are you going?
          </h1>
        </div>
        {/* ...rest of the component... */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* From Input with Autocomplete */}
              <div className="relative">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <MapPin className="w-4 h-4 text-cyan-500" />
                  From
                </label>
                <Input
                  placeholder="Enter departure location"
                  value={booking.from}
                  onChange={(e) => handleFromChange(e.target.value)}
                  onFocus={() => setShowFromSuggestions(true)}
                  className="py-6"
                />
                {showFromSuggestions && filteredStations.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {filteredStations.map((station) => (
                      <button
                        key={station}
                        onClick={() => selectStation(station, 'from')}
                        className="w-full px-4 py-3 text-left hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-cyan-500" />
                          <span className="text-slate-900 dark:text-white">{station}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* To Input with Autocomplete */}
              <div className="relative">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  To
                </label>
                <Input
                  placeholder="Enter destination"
                  value={booking.to}
                  onChange={(e) => handleToChange(e.target.value)}
                  onFocus={() => setShowToSuggestions(true)}
                  className="py-6"
                />
                {showToSuggestions && filteredStations.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {filteredStations.map((station) => (
                      <button
                        key={station}
                        onClick={() => selectStation(station, 'to')}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="text-slate-900 dark:text-white">{station}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
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
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Passengers
                </label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={booking.passengers}
                  onChange={(e) => setBooking({ ...booking, passengers: parseInt(e.target.value) || 1 })}
                  className="py-6"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  className="w-full py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                  onClick={() => {
                    setStep(2);
                  }}
                >
                  Search Available Buses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Popular Routes */}
            {popularRoutes.length > 0 && !booking.from && !booking.to && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Popular Routes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularRoutes.slice(0, 3).map((route) => (
                    <button
                      key={route.id}
                      onClick={() => {
                        setBooking({
                          ...booking,
                          from: route.start_location,
                          to: route.end_location
                        })
                      }}
                      className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-cyan-500 dark:hover:border-cyan-500 transition-colors text-sm"
                    >
                      {route.start_location} → {route.end_location}
                    </button>
                  ))}

                </div>
              </div>
            )}

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
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Bus className="text-cyan-500" />
                Available Routes
              </h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-400">Loading available routes...</p>
                </div>
              ) : routes.length === 0 ? (
                <div className="text-center py-12">
                  <Bus className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    {booking.from || booking.to 
                      ? "No routes found for your search. Try different locations."
                      : "Start searching for routes by entering your departure and destination above."}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {routes.map((route) => (
                    <button
                      key={route.id}
                      onClick={() => handleSelectRoute(route)}
                      className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 bg-white dark:bg-slate-800 hover:shadow-xl transition-all text-left group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold mb-2">
                            <MapPin className="w-4 h-4" />
                            <span>{route.start_location}</span>
                          </div>
                          <div className="flex items-center gap-2 my-1">
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </div>
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{route.end_location}</span>
                          </div>
                          <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(route.duration_minutes)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {route.available_buses} {route.available_buses === 1 ? 'bus' : 'buses'} available
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                            {formatPrice(route.base_price * (booking.passengers || 1))}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatPrice(route.base_price)} × {booking.passengers || 1}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="border-cyan-500 text-cyan-600 dark:text-cyan-400 text-xs">
                            <Wifi className="w-3 h-3 mr-1" />
                            WiFi
                          </Badge>
                          <Badge variant="outline" className="border-blue-500 text-blue-600 dark:text-blue-400 text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            GPS
                          </Badge>
                        </div>
                        <ArrowRight className="w-5 h-5 text-cyan-600 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
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

        {/* Step 5: Ticket Confirmation */}
        {step === 5 && (
          <GlassCard className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Booking Confirmed!</h2>
            <p className="mb-2">Thank you for your booking, <b>{booking.passengerName || 'Passenger'}</b>.</p>
            <div className="my-4 p-4 rounded-lg border bg-slate-50 dark:bg-slate-800 inline-block text-left">
              <div><b>From:</b> {booking.from}</div>
              <div><b>To:</b> {booking.to}</div>
              <div><b>Date:</b> {booking.date}</div>
              <div><b>Passengers:</b> {booking.passengers}</div>
              <div><b>Seats:</b> {booking.seatNumbers.length > 0 ? booking.seatNumbers.join(', ') : 'Auto-assigned'}</div>
              <div><b>Total Paid:</b> ${booking.totalPrice || '0.00'}</div>
            </div>
            <p className="mt-4">A confirmation email will be sent to <b>{booking.passengerEmail || 'your email'}</b>.</p>
            <Button className="mt-6" onClick={() => setStep(1)}>Book Another Ticket</Button>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
