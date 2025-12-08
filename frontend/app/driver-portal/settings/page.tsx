"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { GlassCard } from "@/components/ui/glass-card"
import { Settings, User, Bell, Shield, Moon, Sun, Globe, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

export default function DriverSettingsPage() {
    const { user, logout } = useAuth()
    const { theme, setTheme } = useTheme()
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [language, setLanguage] = useState("English")

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6 pb-24 lg:pb-8">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                    <Settings className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Driver Settings
                </h1>
            </div>

            <div className="grid gap-6 max-w-2xl">
                {/* Profile Section */}
                <GlassCard className="p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-500" />
                        Profile Information
                    </h2>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                            {user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'DR'}
                        </div>
                        <div>
                            <p className="font-bold text-lg">{user?.name || 'Driver Name'}</p>
                            <p className="text-muted-foreground">{user?.email || 'driver@example.com'}</p>
                            <p className="text-xs text-blue-500 font-medium mt-1 uppercase tracking-wider">{user?.role || 'DRIVER'}</p>
                        </div>
                    </div>
                </GlassCard>

                {/* Preferences */}
                <GlassCard className="p-6 space-y-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Settings className="h-5 w-5 text-purple-500" />
                        App Preferences
                    </h2>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="font-medium">Appearance</p>
                                <p className="text-sm text-muted-foreground">Toggle dark/light mode</p>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                                <Bell className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">Notifications</p>
                                <p className="text-sm text-muted-foreground">Receive trip alerts</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notificationsEnabled}
                                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                                <Globe className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">Language</p>
                                <p className="text-sm text-muted-foreground">App language</p>
                            </div>
                        </div>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-transparent border border-border rounded-lg px-2 py-1 text-sm font-medium"
                        >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                        </select>
                    </div>
                </GlassCard>

                {/* Security */}
                <GlassCard className="p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-emerald-500" />
                        Security
                    </h2>
                    <button className="w-full text-left px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors flex items-center justify-between group">
                        <span className="font-medium">Change Password</span>
                        <span className="text-xs text-muted-foreground group-hover:text-foreground">Update</span>
                    </button>
                </GlassCard>

                <button
                    onClick={logout}
                    className="w-full p-4 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold flex items-center justify-center gap-2"
                >
                    <LogOut className="h-5 w-5" />
                    Log Out
                </button>
            </div>
        </div>
    )
}
