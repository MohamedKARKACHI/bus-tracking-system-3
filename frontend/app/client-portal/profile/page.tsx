"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role !== "client") {
      if (user.role === "admin") {
        router.push("/dashboard")
      } else if (user.role === "driver") {
        router.push("/driver-portal")
      }
    } else if (user) {
      // Initialize form with user data
      const nameParts = user.name?.split(" ") || ["", ""]
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: "+1234567890",
        address: "123 Main Street",
        city: "New York",
        country: "United States",
      })
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Call API to update profile
    console.log("Updated profile:", formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form to original user data
    const nameParts = user.name?.split(" ") || ["", ""]
    setFormData({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      email: user.email || "",
      phone: "+1234567890",
      address: "123 Main Street",
      city: "New York",
      country: "United States",
    })
    setIsEditing(false)
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <GlassCard className="lg:col-span-1">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mx-auto mb-4 flex items-center justify-center">
              <span className="text-5xl font-bold text-white">
                {formData.firstName.charAt(0)}
                {formData.lastName.charAt(0)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-muted-foreground mb-2">{formData.email}</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 text-sm font-semibold">
              <User className="w-4 h-4 mr-1" />
              Client
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Member since Nov 2025</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{formData.city}, {formData.country}</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Profile Details Form */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Personal Information</h3>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-border"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-foreground mb-2 block">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  className="bg-background border-border"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-foreground mb-2 block">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  className="bg-background border-border"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="bg-background border-border"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="bg-background border-border"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium text-foreground mb-2 block">
                <MapPin className="w-4 h-4 inline mr-2" />
                Street Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                className="bg-background border-border"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium text-foreground mb-2 block">
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={!isEditing}
                  className="bg-background border-border"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-sm font-medium text-foreground mb-2 block">
                  Country
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  disabled={!isEditing}
                  className="bg-background border-border"
                />
              </div>
            </div>
          </form>
        </GlassCard>

        {/* Account Settings */}
        <GlassCard className="lg:col-span-3">
          <h3 className="text-xl font-bold text-foreground mb-4">Account Settings</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors">
              <h4 className="font-semibold text-foreground mb-2">Change Password</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Update your password to keep your account secure
              </p>
              <Button variant="outline" className="w-full">
                Update Password
              </Button>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors">
              <h4 className="font-semibold text-foreground mb-2">Notification Preferences</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Manage how you receive notifications
              </p>
              <Button variant="outline" className="w-full">
                Manage Notifications
              </Button>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors">
              <h4 className="font-semibold text-foreground mb-2">Payment Methods</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Add or remove payment methods
              </p>
              <Button variant="outline" className="w-full">
                Manage Payments
              </Button>
            </div>
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors">
              <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">Delete Account</h4>
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                Permanently delete your account and all data
              </p>
              <Button variant="outline" className="w-full border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950">
                Delete Account
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  )
}
