"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Shield, Search, Filter, MoreVertical, CheckCircle2, XCircle, Loader2, Edit, Trash2 } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { useState, useEffect } from "react"
import { fetchWithAuth } from "@/lib/api-client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditUserModal } from "@/components/edit-user-modal"

interface DriverCard {
    id: number
    user_id: number
    full_name: string
    email: string
    phone: string
    role: string
    status: string
    license_expiry: string
}

export default function IdCardsPage() {
    const [cards, setCards] = useState<DriverCard[]>([])
    const [loading, setLoading] = useState(true)
    const [editingUser, setEditingUser] = useState<any | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const fetchCards = async () => {
        try {
            const response = await fetchWithAuth('/api/drivers')
            if (response.ok) {
                const data = await response.json()
                const formattedCards = data.map((d: any) => ({
                    id: d.id,
                    user_id: d.user_id,
                    full_name: `${d.first_name} ${d.last_name}`,
                    email: d.email,
                    phone: d.phone,
                    role: "Driver", // Default for now as API returns drivers
                    status: d.status === "active" || d.status === "available" ? "Active" : "Inactive",
                    license_expiry: new Date(d.license_expiry).toLocaleDateString()
                }))
                setCards(formattedCards)
            }
        } catch (error) {
            console.error("Failed to fetch ID cards", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCards()
    }, [])

    const handleEdit = (card: DriverCard) => {
        setEditingUser({
            id: card.user_id,
            name: card.full_name,
            email: card.email,
            phone: card.phone,
            role: 'driver'
        })
        setIsEditModalOpen(true)
    }


    return (
        <DashboardShell>
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                            <Shield className="h-8 w-8 text-blue-500" />
                            ID Cards Management
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Manage physical access and identification cards
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
                        Issue New Card
                    </button>
                </div>

                {/* Filters */}
                <GlassCard className="p-4 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or card ID..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                    </button>
                </GlassCard>

                {/* Cards Grid */}
                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {cards.map((card) => (
                            <GlassCard key={card.id} className="relative overflow-hidden hover:border-blue-500/30 transition-all group">
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 outline-none">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(card)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Revoke Card
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="p-6 flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center mb-4 text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {card.full_name.charAt(0)}
                                    </div>

                                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{card.full_name}</h3>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mb-4">
                                        {card.role}
                                    </span>

                                    <div className="w-full space-y-2 text-sm">
                                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                                            <span className="text-slate-500">Card ID</span>
                                            <span className="font-mono text-slate-700 dark:text-slate-300">IDC-{card.id}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                                            <span className="text-slate-500">Expires</span>
                                            <span className="text-slate-700 dark:text-slate-300">{card.license_expiry}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-slate-500">Status</span>
                                            <span className={`flex items-center gap-1.5 font-medium ${card.status === 'Active' ? 'text-emerald-500' : 'text-red-500'
                                                }`}>
                                                {card.status === 'Active' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                {card.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                )}
            </div>

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={() => {
                    setIsEditModalOpen(false)
                    fetchCards()
                }}
                user={editingUser}
            />
        </DashboardShell>
    )
}
