"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { GoogleLogin } from "@react-oauth/google"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Mail, Lock, Eye, EyeOff, X, User, Home, Sun, Moon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")
  const { user, isLoading: authLoading, login, loginWithGoogle } = useAuth()
  const router = useRouter()
  const [error, setError] = useState("")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isGoogleOAuthEnabled = typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
    !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.includes('your_google_client_id_here')

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "admin") router.push("/dashboard")
      else if (user.role === "driver") router.push("/driver-portal")
      else router.push("/client-portal")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black dark:bg-black">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const user = await login(email, password)
      if (user.role === "admin") router.push("/dashboard")
      else if (user.role === "driver") router.push("/driver-portal")
      else router.push("/client-portal")
    } catch (err: any) {
      setError(err.message || "Invalid credentials")
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async (credentialResponse: any) => {
    setError("")
    setIsLoading(true)
    try {
      if (!credentialResponse.credential) throw new Error("No credential received")
      const user = await loginWithGoogle(credentialResponse.credential)
      if (user.role === "admin") router.push("/dashboard")
      else if (user.role === "driver") router.push("/driver-portal")
      else router.push("/client-portal")
    } catch (err: any) {
      setError(err.message || "Google login failed")
      setIsLoading(false)
    }
  }

  const isDark = theme === 'dark'

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${isDark ? 'bg-black' : 'bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100'}`}>
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
        {/* Back to Home Button */}
        <Link
          href="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${isDark
              ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-sm'
            }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>

        {/* Theme Toggle Button */}
        {mounted && (
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${isDark
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-sm'
              }`}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Animated Colorful Background */}
      <div className="absolute inset-0 overflow-hidden">
        {isDark ? (
          <>
            <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 opacity-80 blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 opacity-80 blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-40 blur-3xl animate-pulse delay-500" />
            <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-30" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <path fill="url(#waveGradient)" d="M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,186.7C672,160,768,128,864,128C960,128,1056,160,1152,170.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            </svg>
          </>
        ) : (
          <>
            <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 opacity-60 blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-cyan-200 via-blue-200 to-indigo-200 opacity-60 blur-3xl animate-pulse delay-1000" />
          </>
        )}
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className={`backdrop-blur-2xl rounded-3xl border p-8 shadow-2xl ${isDark
            ? 'bg-white/10 border-white/20'
            : 'bg-white/80 border-slate-200'
          }`}>
          {/* Tab Switcher */}
          <div className="flex justify-center mb-8">
            <div className={`inline-flex rounded-full p-1 ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
              <button
                onClick={() => setActiveTab("signup")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "signup"
                    ? isDark ? "bg-white/20 text-white shadow-lg" : "bg-white text-slate-900 shadow"
                    : isDark ? "text-white/60 hover:text-white" : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                Sign up
              </button>
              <button
                onClick={() => setActiveTab("signin")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "signin"
                    ? isDark ? "bg-white/20 text-white shadow-lg" : "bg-white text-slate-900 shadow"
                    : isDark ? "text-white/60 hover:text-white" : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                Sign in
              </button>
            </div>
          </div>

          {/* Title */}
          <h2 className={`text-2xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {activeTab === "signin" ? "Welcome back" : "Create an account"}
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
              <p className="text-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First name"
                  className={`py-6 rounded-xl ${isDark
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                    }`}
                />
                <Input
                  type="text"
                  placeholder="Last name"
                  className={`py-6 rounded-xl ${isDark
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                    }`}
                />
              </div>
            )}

            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`pl-12 py-6 rounded-xl ${isDark
                    ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40'
                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                required
              />
            </div>

            {activeTab === "signin" && (
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`pl-12 pr-12 py-6 rounded-xl ${isDark
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                    }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-white/40 hover:text-white/60' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full py-6 font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 ${isDark
                  ? 'bg-white hover:bg-white/90 text-black'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className={`w-5 h-5 border-2 rounded-full animate-spin ${isDark ? 'border-black/30 border-t-black' : 'border-white/30 border-t-white'}`} />
                  {activeTab === "signin" ? "Signing in..." : "Creating..."}
                </span>
              ) : (
                activeTab === "signin" ? "Sign in" : "Create an account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDark ? 'border-white/20' : 'border-slate-200'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 uppercase text-xs tracking-wider ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                Or sign in with
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {isGoogleOAuthEnabled ? (
              <div className="col-span-2 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => setError("Google login failed")}
                  theme={isDark ? "filled_black" : "outline"}
                  size="large"
                  shape="rectangular"
                />
              </div>
            ) : (
              <>
                <button className={`flex items-center justify-center gap-2 py-3 border rounded-xl transition-colors ${isDark
                    ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-sm font-medium">Google</span>
                </button>
                <button className={`flex items-center justify-center gap-2 py-3 border rounded-xl transition-colors ${isDark
                    ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span className="text-sm font-medium">Apple</span>
                </button>
              </>
            )}
          </div>

          {/* Terms */}
          <p className={`text-center text-xs mt-6 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            By {activeTab === "signin" ? "signing in" : "creating an account"}, you agree to our{" "}
            <Link href="/terms" className={`underline ${isDark ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`}>Terms & Service</Link>
          </p>
        </div>

        {/* Real Credentials Info */}
        <div className={`mt-4 p-4 rounded-xl backdrop-blur ${isDark
            ? 'bg-cyan-500/10 border border-cyan-500/20'
            : 'bg-blue-50 border border-blue-200'
          }`}>
          <p className={`text-xs text-center font-medium mb-2 ${isDark ? 'text-cyan-400' : 'text-blue-700'}`}>
            📋 Test Credentials (from database):
          </p>
          <div className={`space-y-1 text-xs ${isDark ? 'text-cyan-300/80' : 'text-blue-600'}`}>
            <p><strong>Admin:</strong> admin@bustrack.com / admin123</p>
            <p><strong>Driver:</strong> driver@bustrack.com / driver123</p>
            <p><strong>Client:</strong> client@bustrack.com / client123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
