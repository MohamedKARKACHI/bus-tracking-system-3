"use client"

import { useState } from "react"
import { useTheme } from "@/lib/theme-context"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import {
  User, Shield, Settings, Bell,
  ChevronRight, LogOut, Wallet, Plus, CreditCard as CardIcon, X, Check, AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function PremiumProfile() {
  const { isDark } = useTheme()
  const { user, logout } = useAuth()
  const [balance, setBalance] = useState(1240.50)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const handleLogout = () => {
    setShowLogoutModal(false)
    logout()
  }

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount)
    if (amount > 0) {
      setBalance(prev => prev + amount)
      setShowTopUpModal(false)
      setTopUpAmount('')
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
    }
  }

  const settingsGroups = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Personal Information", desc: "Name, Email, Phone", href: "/client-portal/settings" },
        { icon: Shield, label: "Security", desc: "Password, 2FA", href: "/client-portal/settings" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", desc: "Email, SMS, Push", href: "/client-portal/notifications" },
        { icon: Settings, label: "App Settings", desc: "Language, Theme", href: "/client-portal/settings" },
      ]
    }
  ]

  return (
    <>
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className={cn(
            "flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl",
            isDark ? "bg-emerald-900 text-emerald-100" : "bg-emerald-500 text-white"
          )}>
            <Check className="w-5 h-5" />
            <span className="font-bold">Balance updated successfully!</span>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={cn(
            "relative w-[90%] max-w-sm p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300",
            isDark ? "bg-slate-900" : "bg-white"
          )}>
            <button
              onClick={() => setShowLogoutModal(false)}
              className={cn(
                "absolute top-4 right-4 p-2 rounded-full transition-colors",
                isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-500"
              )}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className={cn(
                "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
                isDark ? "bg-rose-500/20" : "bg-rose-100"
              )}>
                <AlertTriangle className="w-8 h-8 text-rose-500" />
              </div>

              <h3 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>
                Sign Out?
              </h3>
              <p className={cn("text-sm mb-6", isDark ? "text-slate-400" : "text-slate-500")}>
                Are you sure you want to sign out?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-bold transition-colors",
                    isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-xl font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={cn(
            "relative w-[90%] max-w-md p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300",
            isDark ? "bg-slate-900" : "bg-white"
          )}>
            <button
              onClick={() => setShowTopUpModal(false)}
              className={cn(
                "absolute top-4 right-4 p-2 rounded-full transition-colors",
                isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-500"
              )}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>
              Top Up Wallet
            </h3>
            <p className={cn("mb-6", isDark ? "text-slate-400" : "text-slate-500")}>
              Add funds to your PremiumBus wallet
            </p>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[10, 25, 50, 100, 200, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTopUpAmount(amount.toString())}
                  className={cn(
                    "py-3 rounded-xl font-bold transition-all",
                    topUpAmount === amount.toString()
                      ? "bg-blue-500 text-white"
                      : isDark
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <label className={cn("text-sm font-bold block mb-2", isDark ? "text-slate-400" : "text-slate-500")}>
                Or enter custom amount
              </label>
              <div className="relative">
                <span className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold",
                  isDark ? "text-slate-500" : "text-slate-400"
                )}>$</span>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="0.00"
                  className={cn(
                    "w-full pl-10 pr-4 py-4 rounded-xl text-lg font-bold outline-none transition-all",
                    isDark
                      ? "bg-slate-800 text-white border-slate-700 focus:border-blue-500"
                      : "bg-slate-100 text-slate-900 border-slate-200 focus:border-blue-500",
                    "border-2"
                  )}
                />
              </div>
            </div>

            <button
              onClick={handleTopUp}
              disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
            >
              Add ${topUpAmount || '0'} to Wallet
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start px-4">

        {/* Left Column: Wallet Section */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
          <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>My Wallet</h2>

          {/* 3D Credit Card Visual */}
          <div className="relative h-56 rounded-[2rem] bg-gradient-to-br from-[#0f172a] to-[#334155] p-8 shadow-2xl shadow-blue-500/20 overflow-hidden group hover:scale-[1.02] transition-transform duration-500 border border-white/10">
            {/* Holographic Effects */}
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mb-16 mix-blend-screen" />

            <div className="relative z-10 flex flex-col justify-between h-full text-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="font-mono text-lg opacity-80 tracking-widest">PREMIUM</span>
              </div>

              <div className="pl-1">
                <p className="text-sm text-blue-200 font-medium mb-1">Total Balance</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl text-blue-300">$</span>
                  <p className="text-4xl font-bold tracking-tight text-white">{balance.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Card Holder</p>
                  <p className="font-medium tracking-wide">{user?.name?.toUpperCase() || 'GUEST USER'}</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-500/80 backdrop-blur-sm" />
                  <div className="w-8 h-8 rounded-full bg-yellow-400/80 backdrop-blur-sm -ml-5 mix-blend-overlay" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowTopUpModal(true)}
              className={cn(
                "p-4 rounded-2xl border transition-all text-center group shadow-sm hover:shadow-lg",
                isDark
                  ? "bg-slate-800 border-white/5 hover:border-blue-500/30"
                  : "bg-white border-slate-200 hover:border-blue-500/30"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform",
                isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-500"
              )}>
                <Plus className="w-6 h-6" />
              </div>
              <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>Top Up</span>
            </button>
            <button
              onClick={() => alert('Coming soon: Manage payment methods!')}
              className={cn(
                "p-4 rounded-2xl border transition-all text-center group shadow-sm hover:shadow-lg",
                isDark
                  ? "bg-slate-800 border-white/5 hover:border-purple-500/30"
                  : "bg-white border-slate-200 hover:border-purple-500/30"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform",
                isDark ? "bg-purple-900/30 text-purple-400" : "bg-purple-50 text-purple-500"
              )}>
                <CardIcon className="w-6 h-6" />
              </div>
              <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>Manage Cards</span>
            </button>
          </div>
        </div>

        {/* Right Column: Profile Settings */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>Settings</h2>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          <div className="space-y-8">
            {settingsGroups.map((group, idx) => (
              <div key={idx} className="animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                <h3 className={cn("text-xs font-extrabold uppercase tracking-widest mb-4 px-2", isDark ? "text-slate-500" : "text-slate-400")}>
                  {group.title}
                </h3>
                <div className="space-y-3">
                  {group.items.map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-6 group cursor-pointer rounded-2xl transition-all hover:scale-[1.01]",
                        isDark
                          ? "bg-slate-800/80 border border-white/5 hover:border-blue-500/20"
                          : "bg-white border border-slate-100 hover:border-blue-200"
                      )}
                    >
                      <div className="p-4 pl-6">
                        <div className={cn(
                          "p-3 rounded-2xl transition-all duration-300 shadow-sm",
                          isDark
                            ? "bg-slate-700 text-slate-400 group-hover:text-white group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600"
                            : "bg-slate-100 text-slate-500 group-hover:text-white group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600"
                        )}>
                          <item.icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex-1 py-5">
                        <h4 className={cn("font-bold text-lg mb-0.5", isDark ? "text-white" : "text-slate-900")}>{item.label}</h4>
                        <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{item.desc}</p>
                      </div>
                      <div className={cn("pr-8 transition-colors", isDark ? "text-slate-600 group-hover:text-blue-400" : "text-slate-300 group-hover:text-blue-500")}>
                        <ChevronRight className="w-6 h-6" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
