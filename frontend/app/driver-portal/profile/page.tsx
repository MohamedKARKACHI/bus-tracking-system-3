"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { GlassCard } from "@/components/ui/glass-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "sonner"
import { toast } from "sonner"
import {
    User, Mail, Phone, MapPin, Shield, Award, Star,
    TrendingUp, Clock, Calendar, CheckCircle2, Edit2,
    Save, X, Camera, BadgeCheck, Trophy
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Mock Data - In real app, this would come from API
    const [profileData, setProfileData] = useState({
        name: user?.name || "Ahmed Benali",
        email: user?.email || "ahmed.driver@bustrack.com",
        phone: "+212 612 345 678",
        address: "123 Avenue Allal Al Fassi, Marrakech",
        employeeId: "DRV-2024-884",
        licenseNumber: "B-29384-H",
        joinDate: "March 2022",
        bio: "Professional bus driver with 5+ years of experience. Committed to passenger safety and punctuality.",
    })

    // Mock Stats
    const stats = [
        { label: "Total Trips", value: "1,248", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Rating", value: "4.9", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "On-Time", value: "98%", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Hours", value: "3.2k", icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/10" },
    ]

    // Mock Achievements
    const achievements = [
        { name: "5 Star Driver", icon: Star, color: "text-yellow-500", date: "Dec 2024" },
        { name: "Punctuality King", icon: Clock, color: "text-emerald-500", date: "Nov 2024" },
        { name: "Safe Shield", icon: Shield, color: "text-blue-500", date: "Oct 2024" },
        { name: "Veteran", icon: Award, color: "text-purple-500", date: "Sep 2024" },
    ]

    const handleSave = async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsEditing(false)
        setIsLoading(false)
        toast.success("Profile updated successfully")
    }

    return (
        <div className="min-h-[calc(100vh-80px)] p-4 md:p-6 lg:p-8 pb-32 lg:pb-8 space-y-6">

            {/* Header Section */}
            <GlassCard className="relative overflow-hidden p-0 border-0">
                {/* Banner Background */}
                <div className="h-32 md:h-48 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/80 to-transparent backdrop-blur-[2px]" />
                </div>

                {/* Profile Content */}
                <div className="px-6 pb-6 relative">
                    <div className="flex flex-col md:flex-row gap-6 items-start -mt-16">

                        {/* Avatar Group */}
                        <div className="relative group">
                            <div className="rounded-3xl p-1.5 bg-background shadow-xl">
                                <Avatar className="h-32 w-32 rounded-2xl border-2 border-border/50">
                                    <AvatarImage src="/avatars/driver-male.png" alt="Profile" className="object-cover" />
                                    <AvatarFallback className="rounded-2xl text-4xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                        {profileData.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <button className="absolute bottom-4 right-4 p-2 rounded-xl bg-primary text-primary-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Info & Actions */}
                        <div className="flex-1 pt-16 md:pt-20 space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold flex items-center gap-2">
                                        {profileData.name}
                                        <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500/20" />
                                    </h1>
                                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                        <Shield className="w-4 h-4" />
                                        Senior Driver • {profileData.employeeId}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {isEditing ? (
                                        <>
                                            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                                                <X className="w-4 h-4 mr-2" /> Cancel
                                            </Button>
                                            <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                                                {isLoading ? (
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                ) : (
                                                    <Save className="w-4 h-4 mr-2" />
                                                )}
                                                Save Changes
                                            </Button>
                                        </>
                                    ) : (
                                        <Button onClick={() => setIsEditing(true)} className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200">
                                            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Stats & Achievements */}
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, idx) => (
                            <GlassCard key={idx} className="p-4 flex flex-col items-center justify-center text-center gap-2 hover:scale-105 transition-transform duration-200 cursor-default">
                                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>

                    {/* Achievements */}
                    <GlassCard className="p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Achievements</h3>
                                <p className="text-sm text-muted-foreground">Recent milestones unlocked</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {achievements.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 group p-2 rounded-xl hover:bg-muted/50 transition-colors">
                                    <div className={cn("p-3 rounded-2xl bg-muted group-hover:scale-110 transition-transform", item.color.replace('text-', 'bg-') + '/10')}>
                                        <item.icon className={cn("w-5 h-5", item.color)} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm">{item.name}</div>
                                        <div className="text-xs text-muted-foreground">{item.date}</div>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Right Column - Personal Info Form */}
                <div className="lg:col-span-2">
                    <GlassCard className="p-6 md:p-8 h-full">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Personal Information</h3>
                                <p className="text-sm text-muted-foreground">Manage your personal details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        disabled={!isEditing}
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="pl-9 h-11 bg-muted/50 border-border/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        disabled={!isEditing}
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="pl-9 h-11 bg-muted/50 border-border/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        disabled={!isEditing}
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="pl-9 h-11 bg-muted/50 border-border/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        disabled={!isEditing}
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        className="pl-9 h-11 bg-muted/50 border-border/50"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <Label>Bio</Label>
                                <textarea
                                    disabled={!isEditing}
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    className={cn(
                                        "w-full min-h-[100px] rounded-xl border border-border/50 bg-muted/50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                                        !isEditing && "opacity-50 cursor-not-allowed"
                                    )}
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-border/50">
                            <h4 className="font-bold mb-4 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-emerald-500" />
                                Employment Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Employee ID</div>
                                    <div className="font-mono font-bold">{profileData.employeeId}</div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">License Number</div>
                                    <div className="font-mono font-bold">{profileData.licenseNumber}</div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Join Date</div>
                                    <div className="font-bold flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        {profileData.joinDate}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-medium mb-1">Status</div>
                                    <div className="font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Active • Verified
                                    </div>
                                </div>
                            </div>
                        </div>

                    </GlassCard>
                </div>
            </div>
        </div>
    )
}
