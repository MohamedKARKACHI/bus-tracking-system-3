"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import {
    MessageCircle, Send, AlertTriangle, CheckCircle2, Clock, X,
    Plus, FileText, AlertCircle, HelpCircle, MapPin, CreditCard,
    Bus, User, ChevronRight, Search, Filter
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type ReclamationType = 'delay' | 'driver' | 'vehicle' | 'payment' | 'lost_item' | 'other'
type ReclamationStatus = 'pending' | 'in_progress' | 'resolved' | 'closed'

interface Reclamation {
    id: string
    type: ReclamationType
    title: string
    description: string
    status: ReclamationStatus
    createdAt: string
    updatedAt: string
    response?: string
}

interface ChatMessage {
    id: string
    content: string
    sender: 'user' | 'support'
    timestamp: string
}

const reclamationTypes = [
    { value: 'delay', label: 'Bus Delay', icon: Clock, color: 'amber' },
    { value: 'driver', label: 'Driver Behavior', icon: User, color: 'red' },
    { value: 'vehicle', label: 'Vehicle Condition', icon: Bus, color: 'blue' },
    { value: 'payment', label: 'Payment Issue', icon: CreditCard, color: 'purple' },
    { value: 'lost_item', label: 'Lost Item', icon: MapPin, color: 'cyan' },
    { value: 'other', label: 'Other', icon: HelpCircle, color: 'slate' },
]

export default function ReclamationsPage() {
    const { user } = useAuth()
    const { isDark } = useTheme()
    const [reclamations, setReclamations] = useState<Reclamation[]>([])
    const [showNewForm, setShowNewForm] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<ReclamationStatus | 'all'>('all')
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const [newMessage, setNewMessage] = useState("")
    const chatEndRef = useRef<HTMLDivElement>(null)

    const [formData, setFormData] = useState({
        type: 'delay' as ReclamationType,
        title: '',
        description: ''
    })

    useEffect(() => {
        // Load mock data
        setReclamations([
            {
                id: 'REC-001',
                type: 'delay',
                title: 'Bus 45 min late on Route 1',
                description: 'The bus on Route 1 was 45 minutes late this morning, causing me to miss my appointment.',
                status: 'resolved',
                createdAt: '2024-12-25T10:30:00',
                updatedAt: '2024-12-26T14:00:00',
                response: 'We apologize for the inconvenience. The delay was due to unexpected traffic. We have taken measures to improve punctuality.'
            },
            {
                id: 'REC-002',
                type: 'vehicle',
                title: 'Broken AC in Bus #203',
                description: 'The air conditioning in bus #203 was not working during today\'s trip. It was very uncomfortable.',
                status: 'in_progress',
                createdAt: '2024-12-27T15:20:00',
                updatedAt: '2024-12-28T09:00:00'
            },
            {
                id: 'REC-003',
                type: 'payment',
                title: 'Double charge on ticket purchase',
                description: 'I was charged twice for my ticket purchase yesterday. Order ID: TKT-2024-1234.',
                status: 'pending',
                createdAt: '2024-12-28T11:00:00',
                updatedAt: '2024-12-28T11:00:00'
            }
        ])

        setChatMessages([
            { id: '1', content: 'Hello! Welcome to BusTrack Support. How can I help you today?', sender: 'support', timestamp: '10:00' },
        ])

        setLoading(false)
    }, [])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatMessages])

    const handleSubmitReclamation = (e: React.FormEvent) => {
        e.preventDefault()
        const newReclamation: Reclamation = {
            id: `REC-${String(reclamations.length + 1).padStart(3, '0')}`,
            ...formData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        setReclamations([newReclamation, ...reclamations])
        setShowNewForm(false)
        setFormData({ type: 'delay', title: '', description: '' })
        toast.success('Reclamation submitted successfully!')
    }

    const handleSendMessage = () => {
        if (!newMessage.trim()) return

        const userMessage: ChatMessage = {
            id: String(chatMessages.length + 1),
            content: newMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }
        setChatMessages([...chatMessages, userMessage])
        setNewMessage("")

        // Simulate support response
        setTimeout(() => {
            const responses = [
                "Thank you for your message. A support agent will respond shortly.",
                "I understand your concern. Let me check on that for you.",
                "Thank you for bringing this to our attention. We're looking into it.",
                "I'm here to help! Could you provide more details about your issue?"
            ]
            const supportMessage: ChatMessage = {
                id: String(chatMessages.length + 2),
                content: responses[Math.floor(Math.random() * responses.length)],
                sender: 'support',
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }
            setChatMessages(prev => [...prev, supportMessage])
        }, 1500)
    }

    const getStatusColor = (status: ReclamationStatus) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
            case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
            case 'resolved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
            case 'closed': return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400'
        }
    }

    const getStatusIcon = (status: ReclamationStatus) => {
        switch (status) {
            case 'pending': return <Clock className="w-3.5 h-3.5" />
            case 'in_progress': return <AlertCircle className="w-3.5 h-3.5" />
            case 'resolved': return <CheckCircle2 className="w-3.5 h-3.5" />
            case 'closed': return <X className="w-3.5 h-3.5" />
        }
    }

    const filteredReclamations = filter === 'all'
        ? reclamations
        : reclamations.filter(r => r.status === filter)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-24 lg:pb-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                        Reclamations & Support
                    </h1>
                    <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
                        Report issues and get help from our support team
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all",
                            showChat
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                : isDark
                                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                        )}
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="hidden sm:inline">Live Chat</span>
                    </button>
                    <button
                        onClick={() => setShowNewForm(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">New Report</span>
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Reports', value: reclamations.length, color: 'slate' },
                    { label: 'Pending', value: reclamations.filter(r => r.status === 'pending').length, color: 'amber' },
                    { label: 'In Progress', value: reclamations.filter(r => r.status === 'in_progress').length, color: 'blue' },
                    { label: 'Resolved', value: reclamations.filter(r => r.status === 'resolved').length, color: 'emerald' }
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className={cn(
                            "p-4 rounded-2xl border transition-all hover:scale-105",
                            isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"
                        )}
                    >
                        <p className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>{stat.label}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['all', 'pending', 'in_progress', 'resolved', 'closed'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status as any)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                            filter === status
                                ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg"
                                : isDark
                                    ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                    >
                        {status === 'all' ? 'All' : status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                    </button>
                ))}
            </div>

            {/* Reclamations List */}
            <div className="space-y-4">
                {filteredReclamations.length === 0 ? (
                    <div className={cn(
                        "text-center py-12 rounded-2xl border",
                        isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"
                    )}>
                        <FileText className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                        <p className="text-lg font-medium">No reclamations found</p>
                        <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
                            Create a new report to get started
                        </p>
                    </div>
                ) : (
                    filteredReclamations.map((rec) => {
                        const typeInfo = reclamationTypes.find(t => t.value === rec.type)
                        const TypeIcon = typeInfo?.icon || HelpCircle
                        return (
                            <div
                                key={rec.id}
                                className={cn(
                                    "p-5 rounded-2xl border transition-all hover:shadow-lg cursor-pointer group",
                                    isDark ? "bg-slate-900/50 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300"
                                )}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                        `bg-${typeInfo?.color}-100 dark:bg-${typeInfo?.color}-500/20`
                                    )} style={{ background: isDark ? `rgba(var(--${typeInfo?.color}-500), 0.2)` : undefined }}>
                                        <TypeIcon className={cn("w-6 h-6", `text-${typeInfo?.color}-500`)} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1", getStatusColor(rec.status))}>
                                                {getStatusIcon(rec.status)}
                                                {rec.status.replace('_', ' ')}
                                            </span>
                                            <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                                                {rec.id}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-lg">{rec.title}</h3>
                                        <p className={cn("text-sm mt-1 line-clamp-2", isDark ? "text-slate-400" : "text-slate-500")}>
                                            {rec.description}
                                        </p>
                                        {rec.response && (
                                            <div className={cn("mt-3 p-3 rounded-xl text-sm", isDark ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-50 border border-emerald-100")}>
                                                <p className="font-medium text-emerald-600 dark:text-emerald-400 mb-1">Response:</p>
                                                <p className={isDark ? "text-slate-300" : "text-slate-600"}>{rec.response}</p>
                                            </div>
                                        )}
                                        <p className={cn("text-xs mt-3", isDark ? "text-slate-500" : "text-slate-400")}>
                                            Created: {new Date(rec.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* New Reclamation Modal */}
            {showNewForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className={cn(
                        "w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto",
                        isDark ? "bg-slate-900" : "bg-white"
                    )}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">New Reclamation</h2>
                            <button onClick={() => setShowNewForm(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReclamation} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2">Type of Issue</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {reclamationTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: type.value as ReclamationType })}
                                            className={cn(
                                                "flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left",
                                                formData.type === type.value
                                                    ? "border-rose-500 bg-rose-50 dark:bg-rose-500/10"
                                                    : isDark
                                                        ? "border-slate-700 hover:border-slate-600"
                                                        : "border-slate-200 hover:border-slate-300"
                                            )}
                                        >
                                            <type.icon className="w-5 h-5 flex-shrink-0" />
                                            <span className="text-sm font-medium">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Brief description of the issue"
                                    className={cn(
                                        "w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all",
                                        isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                                    )}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Please provide as much detail as possible..."
                                    className={cn(
                                        "w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none",
                                        isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                                    )}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowNewForm(false)}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl font-medium transition-all",
                                        isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-100 hover:bg-slate-200"
                                    )}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:shadow-lg transition-all"
                                >
                                    Submit Report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Chat Panel */}
            {showChat && (
                <div className={cn(
                    "fixed bottom-20 right-4 lg:bottom-4 lg:right-8 w-[calc(100%-2rem)] max-w-sm h-[450px] rounded-2xl shadow-2xl border overflow-hidden z-[90] animate-in slide-in-from-bottom-4 duration-300 flex flex-col",
                    isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                )}>
                    {/* Chat Header */}
                    <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold">Live Support</h3>
                                <p className="text-xs text-white/80">Usually responds in 5 min</p>
                            </div>
                        </div>
                        <button onClick={() => setShowChat(false)} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex",
                                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                                )}
                            >
                                <div className={cn(
                                    "max-w-[80%] px-4 py-2.5 rounded-2xl",
                                    msg.sender === 'user'
                                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md"
                                        : isDark
                                            ? "bg-slate-800 rounded-bl-md"
                                            : "bg-slate-100 rounded-bl-md"
                                )}>
                                    <p className="text-sm">{msg.content}</p>
                                    <p className={cn(
                                        "text-xs mt-1",
                                        msg.sender === 'user' ? "text-white/70" : isDark ? "text-slate-500" : "text-slate-400"
                                    )}>{msg.timestamp}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className={cn("p-4 border-t", isDark ? "border-slate-800" : "border-slate-200")}>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your message..."
                                className={cn(
                                    "flex-1 px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all",
                                    isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                                )}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg transition-all"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
