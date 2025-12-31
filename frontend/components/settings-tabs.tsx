"use client"

import { useState } from "react"
import {
  Settings, Bell, Lock, Users, Palette, Database, Eye, EyeOff,
  ChevronRight, Shield, Smartphone, Globe, Moon, Sun, Monitor,
  Save, Mail, MessageSquare, AlertTriangle, CheckCircle2, Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const tabs = [
  { id: "general", label: "General", icon: Settings, description: "Basic settings" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Alerts & updates" },
  { id: "security", label: "Security", icon: Shield, description: "Password & 2FA" },
  { id: "users", label: "Users & Roles", icon: Users, description: "Team management" },
  { id: "appearance", label: "Appearance", icon: Palette, description: "Theme & display" },
  { id: "database", label: "Database", icon: Database, description: "Data & backups" },
]

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("general")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [theme, setTheme] = useState("system")

  const handleSave = () => {
    toast.success("Settings saved successfully!")
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar Navigation */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
            <h3 className="font-bold text-sm">Settings Menu</h3>
          </div>
          <div className="p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center",
                  activeTab === tab.id
                    ? "bg-white/20"
                    : "bg-muted"
                )}>
                  <tab.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{tab.label}</p>
                  <p className={cn(
                    "text-xs truncate",
                    activeTab === tab.id ? "text-white/70" : "text-muted-foreground"
                  )}>{tab.description}</p>
                </div>
                {activeTab === tab.id && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Panel */}
      <div className="flex-1">
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          {/* General Settings */}
          {activeTab === "general" && (
            <div>
              <div className="p-6 border-b bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">General Settings</h3>
                    <p className="text-sm text-muted-foreground">Manage your basic account settings</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <input
                      type="text"
                      defaultValue="Morocco Transit Services"
                      className="w-full px-4 py-3 bg-muted/50 border-0 rounded-xl text-foreground focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Email</label>
                    <input
                      type="email"
                      defaultValue="admin@bustrack.com"
                      className="w-full px-4 py-3 bg-muted/50 border-0 rounded-xl text-foreground focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Time Zone</label>
                    <select className="w-full px-4 py-3 bg-muted/50 border-0 rounded-xl text-foreground focus:ring-2 focus:ring-blue-500">
                      <option>UTC+0 (Western European Time - Morocco)</option>
                      <option>UTC+1 (Central European Time)</option>
                      <option>UTC+2 (Eastern European Time)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Language</label>
                    <select className="w-full px-4 py-3 bg-muted/50 border-0 rounded-xl text-foreground focus:ring-2 focus:ring-blue-500">
                      <option>English</option>
                      <option>Français</option>
                      <option>العربية</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 border-t flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div>
              <div className="p-6 border-b bg-gradient-to-r from-amber-500/5 to-orange-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Notification Preferences</h3>
                    <p className="text-sm text-muted-foreground">Control how you receive updates</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { name: "Email Notifications", desc: "Get notified via email", icon: Mail, enabled: true },
                  { name: "Push Notifications", desc: "Browser push alerts", icon: Smartphone, enabled: true },
                  { name: "SMS Alerts", desc: "Critical alerts via SMS", icon: MessageSquare, enabled: false },
                  { name: "Real-time Updates", desc: "Live dashboard updates", icon: Zap, enabled: true },
                  { name: "Weekly Reports", desc: "Summary reports every week", icon: CheckCircle2, enabled: true },
                  { name: "Security Alerts", desc: "Login and security warnings", icon: AlertTriangle, enabled: true },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.enabled} />
                      <div className="w-12 h-7 bg-muted rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[22px] after:w-[22px] after:transition-all after:shadow-md peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div>
              <div className="p-6 border-b bg-gradient-to-r from-emerald-500/5 to-green-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Security Settings</h3>
                    <p className="text-sm text-muted-foreground">Manage your password and security</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <div>
                    <p className="font-medium text-emerald-700 dark:text-emerald-400">Account Secured</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-300">Two-factor authentication is enabled</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          className="w-full px-4 py-3 pr-12 bg-muted/50 border-0 rounded-xl text-foreground focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="w-full px-4 py-3 pr-12 bg-muted/50 border-0 rounded-xl text-foreground focus:ring-2 focus:ring-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            className="w-full px-4 py-3 pr-12 bg-muted/50 border-0 rounded-xl text-foreground focus:ring-2 focus:ring-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <div>
              <div className="p-6 border-b bg-gradient-to-r from-violet-500/5 to-purple-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Appearance</h3>
                    <p className="text-sm text-muted-foreground">Customize the look and feel</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Theme</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "light", label: "Light", icon: Sun },
                      { id: "dark", label: "Dark", icon: Moon },
                      { id: "system", label: "System", icon: Monitor },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                          theme === t.id
                            ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10"
                            : "border-transparent bg-muted/30 hover:bg-muted/50"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          theme === t.id ? "bg-violet-500 text-white" : "bg-background text-muted-foreground"
                        )}>
                          <t.icon className="w-6 h-6" />
                        </div>
                        <span className={cn("font-medium", theme === t.id && "text-violet-600 dark:text-violet-400")}>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs */}
          {activeTab !== "general" && activeTab !== "notifications" && activeTab !== "security" && activeTab !== "appearance" && (
            <div className="p-6">
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  {tabs.find((t) => t.id === activeTab)?.icon && (
                    <span className="w-8 h-8 text-muted-foreground">
                      {(() => {
                        const Tab = tabs.find((t) => t.id === activeTab)?.icon
                        return Tab ? <Tab className="w-8 h-8" /> : null
                      })()}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2">{tabs.find((t) => t.id === activeTab)?.label}</h3>
                <p className="text-muted-foreground">
                  This section is coming soon...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
