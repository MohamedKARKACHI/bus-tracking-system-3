"use client"

import { useState } from "react"
import { PremiumCard } from "@/components/premium/card"
import {
  Search, MapPin, Calendar, Users, ArrowRight, Bus,
  CreditCard, Check, ShieldCheck, Clock, Armchair, ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"

import { useTickets } from "@/lib/ticket-context"

// Mock 3D Bus Image (Using a high-quality placeholder that looks like the uploaded one)
const BUS_IMAGE_URL = "https://cdn.dribbble.com/users/5661/screenshots/15456382/media/07df6c20845a70311756570535e5812b.png?resize=1600x1200&vertical=center" // Futuristic Bus Concept

export default function PremiumBookTicket() {
  const { addTicket } = useTickets()
  const [step, setStep] = useState<'search' | 'select' | 'seat' | 'pay' | 'success'>('search')
  const [searchParams, setSearchParams] = useState({ from: '', to: '', date: '', passengers: 1 })
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])

  // Helper to go back
  const goBack = () => {
    if (step === 'select') setStep('search')
    if (step === 'seat') setStep('select')
    if (step === 'pay') setStep('seat')
  }

  // Handle Payment Success
  const handlePayment = () => {
    // Add ticket to context
    addTicket({
      from: searchParams.from || 'Casablanca',
      to: searchParams.to || 'Marrakech',
      date: searchParams.date || 'Oct 25, 2025',
      time: '08:00 AM',
      seat: `${selectedSeats.length} Seats`,
      price: (selectedSeats.length * 45) + 5
    })
    setStep('success')
  }

  // Search Step
  const SearchSection = () => (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-6">
        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">Premium Travel</span>
        <h1 className="text-4xl font-extrabold pm-text-primary tracking-tight leading-tight">
          Where will you <br /> <span className="text-emerald-500">explore</span> today?
        </h1>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-2 shadow-2xl shadow-emerald-900/10 dark:shadow-black/20 border border-slate-100 dark:border-white/5">

        {/* Segmented Control */}
        <div className="flex p-1 bg-slate-100 dark:bg-black/20 rounded-[2rem] mb-6">
          <button className="flex-1 py-3 rounded-[1.8rem] bg-white dark:bg-[#0f172a] text-emerald-600 dark:text-emerald-400 font-bold shadow-sm transition-all text-sm">One Way</button>
          <button className="flex-1 py-3 rounded-[1.8rem] text-slate-400 font-bold hover:text-slate-600 transition-all text-sm">Round Trip</button>
        </div>

        <div className="space-y-4 px-4 pb-4">
          {/* From/To Stacked */}
          <div className="relative">
            <div className="absolute left-6 top-5 bottom-5 w-[2px] bg-gradient-to-b from-emerald-500 to-blue-500/30 rounded-full">
              <div className="absolute top-0 left-[-3px] w-2 h-2 rounded-full border-2 border-emerald-500 bg-white dark:bg-[#1e293b]" />
              <div className="absolute bottom-0 left-[-3px] w-2 h-2 rounded-full border-2 border-blue-400 bg-white dark:bg-[#1e293b]" />
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-4 pl-12 transition-all hover:bg-slate-100 dark:hover:bg-black/30">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">From</label>
                <input
                  className="w-full bg-transparent font-bold text-lg pm-text-primary placeholder:text-slate-300 outline-none"
                  placeholder="Select Departure"
                  value={searchParams.from}
                  onChange={e => setSearchParams({ ...searchParams, from: e.target.value })}
                />
              </div>
              <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-4 pl-12 transition-all hover:bg-slate-100 dark:hover:bg-black/30">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">To</label>
                <input
                  className="w-full bg-transparent font-bold text-lg pm-text-primary placeholder:text-slate-300 outline-none"
                  placeholder="Select Destination"
                  value={searchParams.to}
                  onChange={e => setSearchParams({ ...searchParams, to: e.target.value })}
                />
              </div>
            </div>

            {/* Swap Button */}
            <button className="absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-[#0f172a] shadow-lg border border-slate-100 dark:border-white/10 flex items-center justify-center text-emerald-500 hover:rotate-180 transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Date & Pax Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-4 transition-all hover:bg-slate-100 dark:hover:bg-black/30">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</label>
              <input type="date" className="w-full bg-transparent font-bold text-sm pm-text-primary outline-none" />
            </div>
            <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-4 transition-all hover:bg-slate-100 dark:hover:bg-black/30">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1"><Users className="w-3 h-3" /> Passengers</label>
              <input type="number" defaultValue={1} min={1} className="w-full bg-transparent font-bold text-sm pm-text-primary outline-none" />
            </div>
          </div>

          <button
            onClick={() => setStep('select')}
            className="w-full bg-[#0f172a] dark:bg-emerald-500 text-white font-bold py-5 rounded-[1.5rem] shadow-xl shadow-slate-900/20 dark:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            Search Trip <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )

  // Route Selection (Flight Style)
  const RouteList = () => (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white dark:bg-[#1e293b] flex items-center justify-center shadow-sm text-slate-400 hover:text-emerald-500 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold pm-text-primary">Select Trip</h2>
          <p className="text-xs text-slate-400">3 Routes Available</p>
        </div>
      </div>

      {[1, 2, 3].map((i) => (
        <div
          key={i}
          onClick={() => { setSelectedRoute(i); setStep('seat'); }}
          className="group relative bg-white dark:bg-[#1e293b] rounded-[2rem] p-6 shadow-lg shadow-slate-200/50 dark:shadow-black/20 cursor-pointer overflow-hidden border border-transparent hover:border-emerald-500 transition-all hover:scale-[1.02]"
        >
          {/* Airline Brand */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Bus className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold pm-text-primary">Premium Liner</h4>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">ID 8472</span>
              </div>
            </div>
            <span className="text-lg font-bold text-emerald-500">45.00 MAD</span>
          </div>

          {/* Route Graph */}
          <div className="flex items-center justify-between mb-6 relative">
            <div className="text-left">
              <p className="text-2xl font-bold pm-text-primary font-mono">08:00</p>
              <p className="text-xs text-slate-400 font-bold uppercase">Casablanca</p>
            </div>

            {/* Flight Path Graphic */}
            <div className="flex-1 px-8 relative flex items-center justify-center">
              <div className="w-full h-[2px] bg-slate-200 dark:bg-slate-700 dashed-line relative">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-emerald-500 bg-white" />
                <Bus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors bg-white dark:bg-[#1e293b] px-1" />
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold pm-text-primary font-mono">12:30</p>
              <p className="text-xs text-slate-400 font-bold uppercase">Marrakech</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-white/5">
            <div className="flex gap-4">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 4h 30m</span>
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Armchair className="w-3 h-3" /> 24 Seats</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // 3D Seat Selection (Bus Interior)
  const SeatMap = () => (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white dark:bg-[#1e293b] flex items-center justify-center shadow-sm text-slate-400 hover:text-emerald-500 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold pm-text-primary">Select Seats</h2>
          <p className="text-xs text-slate-400">Lower Deck • Business Class</p>
        </div>
        <div className="flex gap-2 text-[10px] font-bold">
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" /> Avail</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Your</div>
        </div>
      </div>

      {/* 3D Bus Container */}
      <div className="relative bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#1e293b] dark:to-black rounded-[3rem] p-4 shadow-2xl border-4 border-white dark:border-slate-800 overflow-hidden">

        {/* Cockpit Area */}
        <div className="h-24 bg-gradient-to-b from-slate-200 to-transparent dark:from-white/5 rounded-t-[2.5rem] mb-4 flex justify-center pt-4 opacity-50">
          <div className="w-16 h-2 bg-slate-300 rounded-full" />
        </div>

        {/* Seats Grid */}
        <div className="grid grid-cols-4 gap-x-6 gap-y-4 px-6 pb-12 relative z-10">
          {/* Aisle Marker */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -ml-[1px] bg-slate-200 dark:bg-white/5 border-l border-dashed border-slate-300 dark:border-white/10" />

          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className={`relative group ${i % 2 === 1 ? 'mr-0' : 'mr-auto'} ${Math.floor(i / 2) % 2 === 0 ? 'ml-0' : 'ml-auto'}`} style={{ gridColumn: i % 4 < 2 ? 'span 1' : 'span 1' }}>
              <button
                onClick={() => {
                  if (selectedSeats.includes(i)) setSelectedSeats(selectedSeats.filter(s => s !== i))
                  else setSelectedSeats([...selectedSeats, i])
                }}
                className={cn(
                  "w-12 h-14 rounded-2xl transition-all duration-300 relative shadow-md",
                  selectedSeats.includes(i)
                    ? "bg-emerald-500 text-white translate-y-[-4px] shadow-emerald-500/40"
                    : "bg-white dark:bg-[#0f172a] text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-400"
                )}
              >
                {/* 3D Seat Shape Styling */}
                <div className="absolute top-1 left-1 right-1 h-8 rounded-xl bg-black/5 dark:bg-white/5" />
                <span className="relative z-10 font-bold text-xs">{i + 1}{['A', 'B', 'C', 'D'][i % 4]}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Bottom Action */}
      <div className="fixed bottom-24 lg:bottom-10 left-6 right-6 lg:left-auto lg:right-10 lg:w-[400px] bg-white dark:bg-[#1e293b] p-4 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-white/10 flex items-center justify-between pb-4 animate-in slide-in-from-bottom-20 z-50">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase">Total Price</p>
          <p className="text-2xl font-bold pm-text-primary"><span className="text-emerald-500">{selectedSeats.length * 45} MAD</span></p>
        </div>
        <button
          onClick={() => setStep('pay')}
          disabled={selectedSeats.length === 0}
          className="px-8 py-4 bg-[#0f172a] dark:bg-emerald-500 text-white font-bold rounded-[1.5rem] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  )

  const PayScreen = () => (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pt-10">
      <PremiumCard className="text-center py-12 px-8 shadow-2xl rounded-[3rem]">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 text-emerald-500 relative">
          <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full animate-ping" />
          <ShieldCheck className="w-10 h-10 relative z-10" />
        </div>
        <h2 className="text-3xl font-extrabold pm-text-primary mb-2">Checkout</h2>
        <p className="pm-text-secondary mb-10">Secure payment via Stripe</p>

        <div className="bg-slate-50 dark:bg-black/20 p-6 rounded-3xl mb-8 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-bold text-slate-400">Tickets ({selectedSeats.length})</span>
            <span className="text-sm font-bold pm-text-primary">{selectedSeats.length * 45} MAD</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-sm font-bold text-slate-400">Taxes</span>
            <span className="text-sm font-bold pm-text-primary">5.00 MAD</span>
          </div>
          <div className="border-t border-slate-200 dark:border-white/10 pt-4 flex justify-between">
            <span className="text-lg font-bold pm-text-primary">Total</span>
            <span className="text-2xl font-bold text-emerald-500">{(selectedSeats.length * 45) + 5} MAD</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-[#0f172a] dark:bg-emerald-500 text-white font-bold py-5 rounded-[1.5rem] hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-3"
        >
          <CreditCard className="w-5 h-5" /> Pay Now
        </button>
      </PremiumCard>
    </div>
  )

  return (
    <div className="min-h-[80vh] flex flex-col justify-center pb-32">
      {step === 'search' && <SearchSection />}
      {step === 'select' && <RouteList />}
      {step === 'seat' && <SeatMap />}
      {step === 'pay' && <PayScreen />}
      {step === 'success' && (
        <div className="text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/30">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-4">You're All Set!</h1>
          <p className="pm-text-secondary text-lg mb-12 max-w-md mx-auto">Your boarding pass is ready.</p>
          <button onClick={() => setStep('search')} className="px-10 py-4 bg-slate-100 dark:bg-white/10 rounded-full font-bold pm-text-primary hover:bg-slate-200 dark:hover:bg-white/20 transition-colors shadow-lg">View Ticket</button>
        </div>
      )}
    </div>
  )
}
