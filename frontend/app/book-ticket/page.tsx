"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  MapPin,
  Clock,
  ArrowRight,
  Check,
  Bus,
  Users,
  DollarSign,
  Navigation,
  AlertCircle,
  Star,
  Wifi,
  AirVent,
  Zap,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface BusRoute {
  id: string
  name: string
  from: string
  to: string
  price: number
  duration: string
  nextBus: string
  estimatedArrival: string
  estimatedDeparture: string
  busNumber: string
  availableSeats: number
  totalSeats: number
  amenities: string[]
  rating: number
  distance: string
  currentLocation: string
  status: "arriving" | "departed" | "scheduled"
}

export default function PublicBookTicketPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [searchResults, setSearchResults] = useState<BusRoute[]>([])
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [passengerCount, setPassengerCount] = useState(1)
  const [travelDate, setTravelDate] = useState("")
  const [trackingBus, setTrackingBus] = useState(false)

  // Popular locations for quick selection
  const popularLocations = [
    "Main Station",
    "Downtown Plaza",
    "Airport Terminal",
    "University Campus",
    "City Center",
    "Beach Resort",
    "Shopping Mall",
    "Tech Park",
  ]

  // Mock routes data
  const allRoutes: BusRoute[] = [
    {
      id: "101",
      name: "Downtown Express",
      from: "Main Station",
      to: "Downtown Plaza",
      price: 5.5,
      duration: "25 min",
      nextBus: "5 mins",
      estimatedArrival: "10:15 AM",
      estimatedDeparture: "10:20 AM",
      busNumber: "BUS-101",
      availableSeats: 28,
      totalSeats: 40,
      amenities: ["WiFi", "AC", "USB Charging"],
      rating: 4.8,
      distance: "12.5 km",
      currentLocation: "3.2 km away",
      status: "arriving",
    },
    {
      id: "205",
      name: "Airport Shuttle",
      from: "City Center",
      to: "Airport Terminal",
      price: 12.0,
      duration: "45 min",
      nextBus: "12 mins",
      estimatedArrival: "10:30 AM",
      estimatedDeparture: "10:35 AM",
      busNumber: "BUS-205",
      availableSeats: 15,
      totalSeats: 50,
      amenities: ["WiFi", "AC", "USB Charging", "Luggage Space"],
      rating: 4.9,
      distance: "28.3 km",
      currentLocation: "8.5 km away",
      status: "arriving",
    },
    {
      id: "308",
      name: "University Line",
      from: "Main Station",
      to: "University Campus",
      price: 3.0,
      duration: "20 min",
      nextBus: "2 mins",
      estimatedArrival: "10:05 AM",
      estimatedDeparture: "10:08 AM",
      busNumber: "BUS-308",
      availableSeats: 32,
      totalSeats: 40,
      amenities: ["WiFi", "AC"],
      rating: 4.7,
      distance: "8.7 km",
      currentLocation: "0.8 km away",
      status: "arriving",
    },
    {
      id: "412",
      name: "Beach Route",
      from: "Shopping Mall",
      to: "Beach Resort",
      price: 8.5,
      duration: "35 min",
      nextBus: "18 mins",
      estimatedArrival: "10:40 AM",
      estimatedDeparture: "10:45 AM",
      busNumber: "BUS-412",
      availableSeats: 22,
      totalSeats: 45,
      amenities: ["WiFi", "AC", "USB Charging"],
      rating: 4.6,
      distance: "18.9 km",
      currentLocation: "Not yet departed",
      status: "scheduled",
    },
  ]

  // Search for routes
  const handleSearch = () => {
    if (!fromLocation || !toLocation) return

    const results = allRoutes.filter(
      (route) =>
        route.from.toLowerCase().includes(fromLocation.toLowerCase()) &&
        route.to.toLowerCase().includes(toLocation.toLowerCase()),
    )
    setSearchResults(results)
    setStep(2)
  }

  // Real-time tracking simulation
  useEffect(() => {
    if (trackingBus && selectedRoute) {
      const interval = setInterval(() => {
        // Simulate bus moving closer
        console.log("Tracking bus location update")
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [trackingBus, selectedRoute])

  const availableSeats = Array.from({ length: 40 }, (_, i) => i + 1)
  const occupiedSeats = [5, 12, 18, 23, 31, 7, 14, 28, 35, 39] // Mock occupied seats

  const getStatusColor = (status: string) => {
    switch (status) {
      case "arriving":
        return "bg-emerald-500"
      case "departed":
        return "bg-blue-500"
      case "scheduled":
        return "bg-orange-500"
      default:
        return "bg-slate-500"
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "WiFi":
        return <Wifi className="w-4 h-4" />
      case "AC":
        return <AirVent className="w-4 h-4" />
      case "USB Charging":
        return <Zap className="w-4 h-4" />
      default:
        return <Check className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">BusTrack</h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">Book Your Journey</p>
              </div>
            </div>
            <Button onClick={() => router.push("/")} variant="outline">
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Search Routes */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                Where are you going?
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Find the best bus routes with real-time tracking and live updates
              </p>
            </div>

            <GlassCard className="p-8">
              <div className="space-y-6 mb-8">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-600" />
                    From
                  </label>
                  <Input
                    placeholder="Enter departure location"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="h-14 text-lg"
                    list="from-locations"
                  />
                  <datalist id="from-locations">
                    {popularLocations.map((loc) => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                </div>

                <div className="flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <ArrowRight className="w-5 h-5 text-white rotate-90" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-cyan-600" />
                    To
                  </label>
                  <Input
                    placeholder="Enter destination"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="h-14 text-lg"
                    list="to-locations"
                  />
                  <datalist id="to-locations">
                    {popularLocations.map((loc) => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-600" />
                      Travel Date
                    </label>
                    <Input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="h-14"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-600" />
                      Passengers
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={passengerCount}
                      onChange={(e) => setPassengerCount(Number.parseInt(e.target.value) || 1)}
                      className="h-14"
                    />
                  </div>
                </div>
              </div>

              {/* Popular routes quick select */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Popular Routes</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { from: "Main Station", to: "Downtown Plaza" },
                    { from: "City Center", to: "Airport Terminal" },
                    { from: "Main Station", to: "University Campus" },
                  ].map((route, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setFromLocation(route.from)
                        setToLocation(route.to)
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-100 dark:hover:bg-cyan-900 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:scale-105"
                    >
                      {route.from} → {route.to}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSearch}
                disabled={!fromLocation || !toLocation || !travelDate}
                className="w-full h-14 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg"
              >
                Search Available Buses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </GlassCard>
          </div>
        )}

        {/* Step 2: Select Bus with Real-time Tracking */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <Button onClick={() => setStep(1)} variant="outline">
                ← Change Route
              </Button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Available Buses</h2>
              <p className="text-slate-600 dark:text-slate-400">
                {fromLocation} → {toLocation} • {travelDate}
              </p>
            </div>

            {searchResults.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No buses found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Try different locations or check back later</p>
                <Button onClick={() => setStep(1)}>Search Again</Button>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {searchResults.map((route) => (
                  <GlassCard key={route.id} className="p-6 hover:shadow-xl transition-all">
                    <div className="grid md:grid-cols-12 gap-6">
                      {/* Bus Info */}
                      <div className="md:col-span-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{route.name}</h3>
                              <Badge className={`${getStatusColor(route.status)} text-white border-0`}>
                                {route.status === "arriving" ? "Arriving Soon" : route.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {route.from}
                              </span>
                              <ArrowRight className="w-4 h-4 text-cyan-600" />
                              <span>{route.to}</span>
                            </div>

                            {/* Real-time Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-cyan-600" />
                                <div>
                                  <p className="text-xs text-slate-500">Next Bus</p>
                                  <p className="font-bold text-sm text-slate-900 dark:text-white">{route.nextBus}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Navigation className="w-4 h-4 text-emerald-600" />
                                <div>
                                  <p className="text-xs text-slate-500">Distance</p>
                                  <p className="font-bold text-sm text-slate-900 dark:text-white">{route.distance}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <div>
                                  <p className="text-xs text-slate-500">Arrival</p>
                                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                                    {route.estimatedArrival}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-600" />
                                <div>
                                  <p className="text-xs text-slate-500">Departure</p>
                                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                                    {route.estimatedDeparture}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Current Location Tracking */}
                            <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 mb-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="relative">
                                    <Bus className="w-5 h-5 text-cyan-600" />
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Live Location</p>
                                    <p className="font-semibold text-sm text-slate-900 dark:text-white">
                                      {route.currentLocation}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedRoute(route)
                                    setTrackingBus(true)
                                  }}
                                  className="text-cyan-600 border-cyan-600"
                                >
                                  Track Live
                                </Button>
                              </div>
                            </div>

                            {/* Amenities */}
                            <div className="flex flex-wrap items-center gap-2">
                              {route.amenities.map((amenity, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                                >
                                  {getAmenityIcon(amenity)}
                                  {amenity}
                                </div>
                              ))}
                              <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
                                <Star className="w-4 h-4 fill-amber-500" />
                                {route.rating}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price & Seats */}
                      <div className="md:col-span-4 flex flex-col justify-between">
                        <div>
                          <div className="text-right mb-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Price per person</p>
                            <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-400">${route.price}</p>
                          </div>

                          {/* Seat Availability */}
                          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 border border-emerald-200 dark:border-emerald-800 mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Seats Available
                              </span>
                              <span className="text-lg font-bold text-emerald-600">
                                {route.availableSeats}/{route.totalSeats}
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all"
                                style={{ width: `${(route.availableSeats / route.totalSeats) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => {
                            setSelectedRoute(route)
                            setStep(3)
                          }}
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg"
                        >
                          Select Bus
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Select Seats */}
        {step === 3 && selectedRoute && (
          <div>
            <div className="mb-6">
              <Button onClick={() => setStep(2)} variant="outline">
                ← Back to Routes
              </Button>
            </div>

            <GlassCard className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Select Your Seats</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedRoute.name} • {selectedRoute.busNumber}
                </p>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Choose {passengerCount} seat{passengerCount > 1 ? "s" : ""}
                </div>
              </div>

              {/* Bus Layout */}
              <div className="mb-8 p-6 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <div className="text-center mb-6">
                  <div className="inline-block px-6 py-3 bg-slate-700 text-white rounded-t-xl font-bold">DRIVER</div>
                </div>
                <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                  {availableSeats.map((seat) => {
                    const isSelected = selectedSeats.includes(seat)
                    const isOccupied = occupiedSeats.includes(seat)

                    return (
                      <button
                        key={seat}
                        onClick={() => {
                          if (isOccupied) return
                          if (isSelected) {
                            setSelectedSeats(selectedSeats.filter((s) => s !== seat))
                          } else if (selectedSeats.length < passengerCount) {
                            setSelectedSeats([...selectedSeats, seat])
                          }
                        }}
                        disabled={isOccupied}
                        className={`aspect-square rounded-xl font-bold text-sm transition-all ${
                          isOccupied
                            ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                            : isSelected
                              ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg scale-110 ring-2 ring-cyan-300"
                              : "bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-cyan-100 dark:hover:bg-cyan-900 hover:scale-105 shadow-sm"
                        }`}
                      >
                        {seat}
                      </button>
                    )
                  })}
                </div>
                <div className="flex items-center justify-center gap-6 mt-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white dark:bg-slate-600 rounded-lg shadow-sm"></div>
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

              {/* Booking Summary */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border border-cyan-200 dark:border-cyan-800 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-cyan-600" />
                  Booking Summary
                </h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Selected Seats:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {selectedSeats.length > 0 ? selectedSeats.sort((a, b) => a - b).join(", ") : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Price per seat:</span>
                    <span className="font-bold text-slate-900 dark:text-white">${selectedRoute.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Number of passengers:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{passengerCount}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-cyan-300 dark:border-cyan-700">
                  <span className="font-bold text-slate-900 dark:text-white">Total Amount:</span>
                  <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                    ${(selectedRoute.price * selectedSeats.length).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setStep(4)}
                disabled={selectedSeats.length !== passengerCount}
                className="w-full h-14 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg"
              >
                Continue to Passenger Details
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </GlassCard>
          </div>
        )}

        {/* Step 4: Passenger Details & Payment */}
        {step === 4 && selectedRoute && (
          <div>
            <div className="mb-6">
              <Button onClick={() => setStep(3)} variant="outline">
                ← Back to Seats
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Passenger Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                      Full Name
                    </label>
                    <Input placeholder="John Doe" className="h-12" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Email</label>
                    <Input type="email" placeholder="john@example.com" className="h-12" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Phone</label>
                    <Input placeholder="+1 (555) 123-4567" className="h-12" />
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-slate-700 dark:text-slate-300">
                      Your ticket will be sent to your email. Please arrive at the station 10 minutes before departure.
                    </div>
                  </div>
                </div>
              </GlassCard>

              <div className="space-y-6">
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Journey Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">From</p>
                        <p className="font-bold text-slate-900 dark:text-white">{selectedRoute.from}</p>
                        <p className="text-sm text-emerald-600 font-medium mt-1">
                          Departs: {selectedRoute.estimatedDeparture}
                        </p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-cyan-600" />
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">To</p>
                        <p className="font-bold text-slate-900 dark:text-white">{selectedRoute.to}</p>
                        <p className="text-sm text-blue-600 font-medium mt-1">
                          Arrives: {selectedRoute.estimatedArrival}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 mb-1">Bus Number</p>
                        <p className="font-bold text-slate-900 dark:text-white">{selectedRoute.busNumber}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 mb-1">Duration</p>
                        <p className="font-bold text-slate-900 dark:text-white">{selectedRoute.duration}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 mb-1">Seats</p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {selectedSeats.sort((a, b) => a - b).join(", ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 mb-1">Travel Date</p>
                        <p className="font-bold text-slate-900 dark:text-white">{travelDate}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/50 dark:to-cyan-950/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">Total Amount</span>
                    <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${(selectedRoute.price * selectedSeats.length).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    {selectedSeats.length} × ${selectedRoute.price} per seat
                  </p>
                  <Button
                    onClick={() => {
                      router.push(`/client-portal/my-tickets/TCK-${Date.now().toString().slice(-6)}`)
                    }}
                    className="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white shadow-lg"
                  >
                    Proceed to Payment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </GlassCard>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
