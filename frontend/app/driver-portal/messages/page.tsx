"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { useDriverSidebar } from "@/lib/driver-sidebar-context"
import { useAuth } from "@/lib/auth-context"
import { Clock, User, Send, MessageCircle, CheckCheck, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MessagesPage() {
  const { sidebarExpanded } = useDriverSidebar()
  const { user } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
        if (data.length > 0) setSelectedConversation(data[0])
      } else {
        // Fallback test data
        const fallbackData = [
          { id: 1, from: 'Dispatch Center', message: 'Route A schedule updated for tomorrow', time: '10 min ago', unread: true },
          { id: 2, from: 'Fleet Manager', message: 'Great job on maintaining punctuality!', time: '1 hour ago', unread: false },
          { id: 3, from: 'Dispatch Center', message: 'Weather alert: Heavy rain expected this afternoon', time: '2 hours ago', unread: false },
          { id: 4, from: 'Support Team', message: 'Your vehicle maintenance is scheduled for Friday', time: '1 day ago', unread: false },
        ]
        setMessages(fallbackData)
        setSelectedConversation(fallbackData[0])
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      // Fallback test data
      const fallbackData = [
        { id: 1, from: 'Dispatch Center', message: 'Route A schedule updated for tomorrow', time: '10 min ago', unread: true },
        { id: 2, from: 'Fleet Manager', message: 'Great job on maintaining punctuality!', time: '1 hour ago', unread: false },
        { id: 3, from: 'Dispatch Center', message: 'Weather alert: Heavy rain expected this afternoon', time: '2 hours ago', unread: false },
      ]
      setMessages(fallbackData)
      setSelectedConversation(fallbackData[0])
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage, to: 'dispatch' })
      })
      if (response.ok) {
        setNewMessage("")
        fetchMessages()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main
      className={cn(
        "flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto transition-all duration-300 bg-gradient-to-br from-background via-background to-muted/20",
        sidebarExpanded ? "lg:ml-0" : "lg:ml-0",
      )}
    >
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
          <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Messages</h1>
        </div>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Communication with dispatch and management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <GlassCard className="p-3 sm:p-4 border-2 border-primary/10">
            <h3 className="text-[10px] sm:text-xs lg:text-sm font-bold text-muted-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              CONVERSATIONS ({messages.length})
            </h3>
            <div className="space-y-2">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedConversation(msg)}
                  className={cn(
                    "w-full p-2.5 sm:p-3 lg:p-4 rounded-xl text-left transition-all border-2",
                    msg.unread 
                      ? "bg-blue-500/10 border-blue-500/30 shadow-md" 
                      : "border-transparent hover:border-primary/20 hover:bg-accent",
                  )}
                >
                  <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md flex-shrink-0">
                          <User className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-white" />
                        </div>
                        {msg.unread && (
                          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-background animate-pulse" />
                        )}
                      </div>
                      <span className="font-semibold text-xs sm:text-sm text-foreground">{msg.from}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{msg.message}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {msg.time}
                    </p>
                    {msg.unread && (
                      <div className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                        NEW
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          <GlassCard className="p-3 sm:p-4 lg:p-6 h-[450px] sm:h-[500px] lg:h-[600px] flex flex-col border-2 border-primary/10">
            {/* Chat Header */}
            <div className="flex items-center gap-3 pb-4 border-b-2 border-border">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base sm:text-lg text-foreground">Dispatch Center</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
                  Active now
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 py-4 sm:py-6 space-y-4 overflow-y-auto">
              {/* Received Message */}
              <div className="flex gap-3 animate-in slide-in-from-left">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 max-w-[80%]">
                  <div className="bg-gradient-to-br from-accent to-muted/50 rounded-2xl rounded-tl-sm p-3 sm:p-4 border border-border shadow-sm">
                    <p className="text-sm text-foreground">Route A schedule updated for tomorrow. Please check the new timing in your schedule.</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    10 min ago
                  </p>
                </div>
              </div>

              {/* Sent Message */}
              <div className="flex gap-3 justify-end animate-in slide-in-from-right">
                <div className="flex-1 max-w-[80%]">
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl rounded-tr-sm p-3 sm:p-4 shadow-lg ml-auto">
                    <p className="text-sm text-white">Acknowledged. Thanks for the update! I'll review the new schedule now.</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-right flex items-center gap-1 justify-end">
                    <CheckCheck className="h-3 w-3" />
                    5 min ago
                  </p>
                </div>
              </div>

              <div className="flex gap-3 animate-in slide-in-from-left">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 max-w-[80%]">
                  <div className="bg-gradient-to-br from-accent to-muted/50 rounded-2xl rounded-tl-sm p-3 sm:p-4 border border-border shadow-sm">
                    <p className="text-sm text-foreground">Perfect! Let me know if you have any questions.</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Just now
                  </p>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="pt-4 border-t-2 border-border">
              <div className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-xl bg-muted border-2 border-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-foreground placeholder:text-muted-foreground transition-all"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  )
}
