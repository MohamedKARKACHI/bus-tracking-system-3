"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { GlassCard } from "@/components/ui/glass-card"
import { fetchWithAuth } from "@/lib/api-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  MessageSquare, Search, MoreVertical, Phone, Video,
  Send, Paperclip, Mic, ArrowLeft, Camera, Image as ImageIcon,
  Check, CheckCheck, Circle, X, Trash2, StopCircle, MicOff
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
type Message = {
  id: string
  content: string
  sender: 'me' | 'other'
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
  type: 'text' | 'image' | 'voice'
}

type Conversation = {
  id: string
  name: string
  avatar: string
  initials: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  messages: Message[]
}

export default function MessagesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [activeCall, setActiveCall] = useState<{ type: 'voice' | 'video', status: 'ringing' | 'connected' } | null>(null)
  const [callDuration, setCallDuration] = useState(0)

  // Timer for recording
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => setRecordingDuration(prev => prev + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  // Timer for call
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeCall?.status === 'connected') {
      interval = setInterval(() => setCallDuration(prev => prev + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [activeCall?.status])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedId) {
      fetchMessages(selectedId)
    }
  }, [selectedId])

  const fetchConversations = async () => {
    try {
      const response = await fetchWithAuth('/api/messages/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      } else {
        throw new Error('Failed to fetch')
      }
    } catch (error) {
      console.warn('Backend unavailable, using mock data for conversations.')
      setConversations([
        {
          id: "1",
          name: "Central Dispatch",
          avatar: "/avatars/dispatch.png",
          initials: "CD",
          lastMessage: "Please confirm when you reach the terminal.",
          time: "10:42 AM",
          unread: 2,
          online: true,
          messages: [
            { id: "1", content: "Route 4 update: Heavy traffic reported on Main St.", sender: "other", timestamp: "10:30 AM", status: "read", type: "text" },
            { id: "2", content: "Copy that. Rerouting via 5th Ave?", sender: "me", timestamp: "10:32 AM", status: "read", type: "text" },
            { id: "3", content: "Yes, approved. Proceed with caution.", sender: "other", timestamp: "10:35 AM", status: "read", type: "text" },
            { id: "4", content: "Please confirm when you reach the terminal.", sender: "other", timestamp: "10:42 AM", status: "delivered", type: "text" }
          ]
        },
        {
          id: "2",
          name: "Ahmed Benali",
          avatar: "/avatars/driver-1.png",
          initials: "AB",
          lastMessage: "Can you swap shifts for tomorrow?",
          time: "09:15 AM",
          unread: 1,
          online: false,
          messages: [
            { id: "1", content: "Hey, are you working the morning shift tomorrow?", sender: "other", timestamp: "09:10 AM", status: "read", type: "text" },
            { id: "2", content: "Can you swap shifts for tomorrow?", sender: "other", timestamp: "09:15 AM", status: "delivered", type: "text" }
          ]
        },
        {
          id: "3",
          name: "Maintenance Support",
          avatar: "/avatars/support.png",
          initials: "MS",
          lastMessage: "Bus 101 service scheduled for 2 PM.",
          time: "Yesterday",
          unread: 0,
          online: true,
          messages: [
            { id: "1", content: "Reported brake noise on Bus 101.", sender: "me", timestamp: "Yesterday", status: "read", type: "text" },
            { id: "2", content: "Received. We'll check it out.", sender: "other", timestamp: "Yesterday", status: "read", type: "text" },
            { id: "3", content: "Bus 101 service scheduled for 2 PM.", sender: "other", timestamp: "Yesterday", status: "read", type: "text" }
          ]
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (userId: string) => {
    try {
      const response = await fetchWithAuth(`/api/messages/${userId}`)
      if (response.ok) {
        const data = await response.json()
        const formattedMessages: Message[] = data.map((msg: any) => ({
          id: msg.id.toString(),
          content: msg.message,
          sender: msg.sender_id === user?.id ? 'me' : 'other',
          timestamp: new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: msg.is_read ? 'read' : 'sent',
          type: 'text'
        }))

        setConversations(prev => prev.map(conv => {
          if (conv.id === userId) {
            return { ...conv, messages: formattedMessages }
          }
          return conv
        }))
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const selectedConversation = conversations.find(c => c.id === selectedId)

  // Mobile: Handle back button behavior
  const handleBack = () => setSelectedId(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedId) return

    const tempId = Date.now().toString()
    const imageUrl = URL.createObjectURL(file)

    // Optimistic update
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedId) {
        return {
          ...conv,
          lastMessage: "Sent an image",
          time: 'Just now',
          messages: [
            ...conv.messages,
            {
              id: tempId,
              content: imageUrl,
              sender: 'me',
              timestamp: 'Just now',
              status: 'sent',
              type: 'image'
            }
          ]
        }
      }
      return conv
    }))
    
    // Reset input
    e.target.value = ''
  }

  const handleVoiceRecord = (action: 'start' | 'stop' | 'cancel') => {
    if (action === 'start') {
      setIsRecording(true)
      setRecordingDuration(0)
    } else if (action === 'cancel') {
      setIsRecording(false)
      setRecordingDuration(0)
    } else if (action === 'stop') {
      setIsRecording(false)
      if (selectedId) {
        const tempId = Date.now().toString()
        setConversations(prev => prev.map(conv => {
          if (conv.id === selectedId) {
            return {
              ...conv,
              lastMessage: "Sent a voice message",
              time: 'Just now',
              messages: [
                ...conv.messages,
                {
                  id: tempId,
                  content: formatTime(recordingDuration),
                  sender: 'me',
                  timestamp: 'Just now',
                  status: 'sent',
                  type: 'voice'
                }
              ]
            }
          }
          return conv
        }))
      }
    }
  }

  const handleCall = (type: 'voice' | 'video') => {
    if (!selectedConversation) return
    setActiveCall({ type, status: 'ringing' })
    
    // Simulate connection after 2 seconds
    setTimeout(() => {
      setActiveCall(prev => prev ? { ...prev, status: 'connected' } : null)
    }, 2000)
  }

  const endCall = () => {
    setActiveCall(null)
    setCallDuration(0)
  }

  const handleSend = async () => {
    if (!inputMessage.trim() || !selectedId) return

    const tempId = Date.now().toString()
    const messageContent = inputMessage
    setInputMessage("")

    // Optimistic update
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedId) {
        return {
          ...conv,
          lastMessage: messageContent,
          time: 'Just now',
          messages: [
            ...conv.messages,
            {
              id: tempId,
              content: messageContent,
              sender: 'me',
              timestamp: 'Just now',
              status: 'sent',
              type: 'text'
            }
          ]
        }
      }
      return conv
    }))

    try {
      const response = await fetchWithAuth('/api/messages', {
        method: 'POST',
        body: JSON.stringify({
          receiver_id: selectedId,
          message: messageContent
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      
      // Refresh messages to get the real ID and timestamp
      fetchMessages(selectedId)
    } catch (error) {
      console.error('Failed to send message:', error)
      // TODO: Show error state or revert optimistic update
    }
  }

  return (
    <div className="h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-4 p-4 lg:p-6 overflow-hidden">

      {/* List View - Hidden on Mobile if chat is selected */}
      <div className={cn(
        "flex-1 lg:max-w-md flex flex-col bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden transition-all duration-300",
        selectedId ? "hidden lg:flex" : "flex"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Messages</h1>
            <div className="flex gap-2">
              <button className="p-2 rounded-full hover:bg-muted"><MoreVertical className="h-5 w-5" /></button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 pb-24 lg:pb-2">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={cn(
                "w-full p-3 rounded-xl flex gap-3 transition-all text-left group",
                selectedId === conv.id ? "bg-blue-600/10 border-blue-600/20" : "hover:bg-muted/50 border-transparent border"
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-background shadow-md group-hover:scale-105 transition-transform">
                  <AvatarImage src={conv.avatar} alt={conv.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold">
                    {conv.initials}
                  </AvatarFallback>
                </Avatar>
                {conv.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold truncate">{conv.name}</h3>
                  <span className="text-xs text-muted-foreground">{conv.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate max-w-[80%]">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat View - Full Screen on Mobile */}
      <div className={cn(
        "bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl flex flex-col overflow-hidden transition-all duration-300",
        !selectedId
          ? "hidden lg:flex items-center justify-center flex-[2] h-[600px]"
          : "fixed inset-0 z-50 bg-background flex flex-col lg:static lg:inset-auto lg:bg-card/50 lg:flex-[2] lg:h-[600px]"
      )}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border/50 flex items-center gap-3 bg-card/95 backdrop-blur-sm lg:bg-transparent shrink-0">
              <button onClick={handleBack} className="lg:hidden p-2 -ml-2 rounded-full hover:bg-muted">
                <ArrowLeft className="h-6 w-6" />
              </button>

              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                  <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold">
                    {selectedConversation.initials}
                  </AvatarFallback>
                </Avatar>
                {selectedConversation.online && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                )}
              </div>

              <div className="flex-1">
                <h2 className="font-bold text-base leading-tight">{selectedConversation.name}</h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {selectedConversation.online ? 'Online' : 'Offline'}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleCall('voice')}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleCall('video')}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Video className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-muted/20 scroll-smooth">
              {selectedConversation.messages.map(msg => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 max-w-[85%] lg:max-w-[70%]",
                    msg.sender === 'me' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "p-3 lg:p-4 rounded-2xl shadow-sm",
                    msg.sender === 'me'
                      ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-tr-sm"
                      : "bg-muted border border-border/50 rounded-tl-sm"
                  )}>
                    <p className="text-sm lg:text-base leading-relaxed">{msg.content}</p>
                    <div className={cn(
                      "flex items-center gap-1 text-[10px] mt-1 opacity-70",
                      msg.sender === 'me' ? "justify-end text-white" : "text-muted-foreground"
                    )}>
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'me' && (
                        msg.status === 'read' ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="shrink-0 p-3 lg:p-4 lg:pb-4 border-t border-border/50 bg-card/95 backdrop-blur-sm lg:bg-transparent pb-safe-bottom mb-24 lg:mb-0">
              {isRecording ? (
                <div className="flex items-center gap-4 p-2 bg-red-500/10 rounded-2xl border border-red-500/20 animate-pulse">
                  <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono font-bold text-red-500">{formatTime(recordingDuration)}</span>
                  <div className="flex-1" />
                  <button 
                    onClick={() => handleVoiceRecord('cancel')}
                    className="p-2 rounded-full hover:bg-red-500/20 text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleVoiceRecord('stop')}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-end gap-2">
                  <div className="flex gap-1 pb-2">
                    <label className="p-2 rounded-xl hover:bg-muted cursor-pointer transition-colors active:scale-95">
                      <Camera className="h-6 w-6 text-blue-500" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment" 
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                    </label>
                    <label className="p-2 rounded-xl hover:bg-muted cursor-pointer transition-colors active:scale-95">
                      <ImageIcon className="h-6 w-6 text-purple-500" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>

                  <div className="flex-1 bg-muted/50 rounded-2xl border border-border/50 flex items-center pr-2 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 min-h-[48px]"
                    />
                    <button 
                      onClick={() => handleVoiceRecord('start')}
                      className="p-2 text-muted-foreground hover:text-foreground"
                    >
                      <Mic className="h-5 w-5" />
                    </button>
                  </div>

                  <button
                    onClick={handleSend}
                    disabled={!inputMessage.trim()}
                    className="p-3 rounded-full bg-blue-600 text-white shadow-lg disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95 transition-all"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Call Overlay */}
            {activeCall && (
              <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="relative mb-8">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl animate-pulse">
                    <Avatar className="h-full w-full border-4 border-background">
                      <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                      <AvatarFallback className="text-4xl">{selectedConversation.initials}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-3 rounded-full bg-background shadow-lg">
                    {activeCall.type === 'video' ? (
                      <Video className="h-6 w-6 text-blue-500" />
                    ) : (
                      <Phone className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-2">{selectedConversation.name}</h2>
                <p className="text-muted-foreground mb-12 animate-pulse">
                  {activeCall.status === 'ringing' ? 'Calling...' : formatTime(callDuration)}
                </p>

                <div className="flex items-center gap-6">
                  <button className="p-4 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                    <MicOff className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={endCall}
                    className="p-6 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-xl hover:scale-105 transition-all"
                  >
                    <Phone className="h-8 w-8 rotate-[135deg]" />
                  </button>
                  <button className="p-4 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                    <Video className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-center h-full text-muted-foreground">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="h-10 w-10 opacity-50" />
            </div>
            <h3 className="text-xl font-bold">Select a conversation</h3>
            <p className="text-sm opacity-70">Choose a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
