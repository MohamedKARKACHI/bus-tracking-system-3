"use client"

import { useState } from "react"
import { GlassCard } from "./ui/glass-card"
import { Settings, Bell, Lock, Users, Palette, Database, Eye, EyeOff } from "lucide-react"

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "users", label: "Users & Roles", icon: Users },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "database", label: "Database", icon: Database },
]

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("general")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <GlassCard>
          <div className="p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="lg:col-span-3">
        <GlassCard>
          <div className="p-6">
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Company Name</label>
                      <input
                        type="text"
                        defaultValue="Morocco Transit Services"
                        className="w-full px-4 py-2.5 bg-card/50 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="abdellah.h@bustrack.com"
                        className="w-full px-4 py-2.5 bg-card/50 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Time Zone</label>
                      <select className="w-full px-4 py-2.5 bg-card/50 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50">
                        <option>UTC+0 (Western European Time - Morocco)</option>
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC-6 (Central Time)</option>
                        <option>UTC-7 (Mountain Time)</option>
                        <option>UTC-8 (Pacific Time)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button className="text-white bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm px-6 py-2.5 shadow-[0_0_15px_-3px_var(--color-primary)] transition-all">
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {["Email Notifications", "Push Notifications", "SMS Alerts", "Desktop Notifications"].map(
                      (item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/30"
                        >
                          <span className="text-foreground">{item}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-muted/30 peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          className="w-full px-4 py-2.5 pr-12 bg-card/50 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className="w-full px-4 py-2.5 pr-12 bg-card/50 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          className="w-full px-4 py-2.5 pr-12 bg-card/50 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="text-white bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm px-6 py-2.5 shadow-[0_0_15px_-3px_var(--color-primary)] transition-all">
                  Update Password
                </button>
              </div>
            )}

            {activeTab !== "general" && activeTab !== "notifications" && activeTab !== "security" && (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">
                  {tabs.find((t) => t.id === activeTab)?.label} settings coming soon...
                </p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
