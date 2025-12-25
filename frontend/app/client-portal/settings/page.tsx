"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Shield, 
  Eye, 
  Moon, 
  Sun, 
  Globe, 
  CreditCard,
  Lock,
  Smartphone,
  AlertCircle,
  LogOut
} from "lucide-react"

export default function SettingsPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    tripReminders: true,
    promotions: false,
    updates: true
  })
  const [privacy, setPrivacy] = useState({
    shareLocation: true,
    analytics: true,
    publicProfile: false
  })
  const [darkMode, setDarkMode] = useState(false)

  const handleLogout = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = () => {
    logout()
    router.push("/login")
  }

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role !== "client") {
      if (user.role === "admin") {
        router.push("/dashboard")
      } else if (user.role === "driver") {
        router.push("/driver-portal")
      }
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== "client") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings</p>
      </div>

      <div className="space-y-6">
        {/* Notifications Settings */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground">Configure how you receive updates</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium text-foreground">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium text-foreground">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get text messages for important updates</p>
                </div>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium text-foreground">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                </div>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium text-foreground">Trip Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminders before scheduled trips</p>
                </div>
              </div>
              <Switch
                checked={notifications.tripReminders}
                onCheckedChange={(checked) => setNotifications({ ...notifications, tripReminders: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium text-foreground">Promotions & Offers</Label>
                  <p className="text-sm text-muted-foreground">Receive promotional emails and special offers</p>
                </div>
              </div>
              <Switch
                checked={notifications.promotions}
                onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium text-foreground">System Updates</Label>
                  <p className="text-sm text-muted-foreground">Stay informed about new features and updates</p>
                </div>
              </div>
              <Switch
                checked={notifications.updates}
                onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
              />
            </div>
          </div>
        </GlassCard>

        {/* Privacy Settings */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Privacy & Security</h2>
              <p className="text-sm text-muted-foreground">Control your data and privacy</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium text-foreground">Share Location</Label>
                  <p className="text-sm text-muted-foreground">Allow us to access your location for better service</p>
                </div>
              </div>
              <Switch
                checked={privacy.shareLocation}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, shareLocation: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium text-foreground">Analytics & Performance</Label>
                  <p className="text-sm text-muted-foreground">Help us improve by sharing usage data</p>
                </div>
              </div>
              <Switch
                checked={privacy.analytics}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, analytics: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium text-foreground">Public Profile</Label>
                  <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                </div>
              </div>
              <Switch
                checked={privacy.publicProfile}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, publicProfile: checked })}
              />
            </div>
          </div>
        </GlassCard>

        {/* Appearance */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              {darkMode ? <Moon className="w-6 h-6 text-purple-600" /> : <Sun className="w-6 h-6 text-purple-600" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Appearance</h2>
              <p className="text-sm text-muted-foreground">Customize how the app looks</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
              <div>
                <Label className="font-medium text-foreground">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
              </div>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </GlassCard>

        {/* Account Security */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Account Security</h2>
              <p className="text-sm text-muted-foreground">Manage your account security settings</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-border"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-border"
            >
              <Shield className="w-4 h-4 mr-2" />
              Two-Factor Authentication
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-border"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Payment Methods
            </Button>
          </div>
        </GlassCard>

        {/* Danger Zone */}
        <GlassCard className="border-red-200 dark:border-red-900">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-700 dark:text-red-300">Danger Zone</h2>
              <p className="text-sm text-red-600 dark:text-red-400">Irreversible actions</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="w-full justify-start border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50"
            >
              Deactivate Account
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50"
            >
              Delete Account Permanently
            </Button>
          </div>
        </GlassCard>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" className="border-border">
            Cancel
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
            Save Changes
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-red-500/10">
                <LogOut className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Confirm Logout</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to logout? You will need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-muted/50 text-foreground font-medium transition-all duration-200 hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
