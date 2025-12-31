"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface Ticket {
    id: number
    from: string
    to: string
    date: string
    time: string
    status: 'upcoming' | 'completed' | 'cancelled'
    seat: string
    price: number
    code: string
}

interface TicketContextType {
    tickets: Ticket[]
    addTicket: (ticket: Omit<Ticket, 'id' | 'status' | 'code'>) => void
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

const INITIAL_TICKETS: Ticket[] = [
    { id: 1, from: 'Casablanca', to: 'Marrakech', date: 'Oct 24, 2025', time: '08:00 AM', status: 'upcoming', seat: '4A', price: 45, code: 'TKT-001-2025' },
    { id: 2, from: 'Rabat', to: 'Tangier', date: 'Sep 15, 2025', time: '02:30 PM', status: 'completed', seat: '12B', price: 38, code: 'TKT-002-2025' }
]

export function TicketProvider({ children }: { children: React.ReactNode }) {
    const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS)

    const addTicket = (newTicketData: Omit<Ticket, 'id' | 'status' | 'code'>) => {
        const newTicket: Ticket = {
            ...newTicketData,
            id: Math.floor(Math.random() * 10000), // Simple random ID
            status: 'upcoming',
            code: `TKT-${Math.floor(Math.random() * 1000)}-2025`
        }
        setTickets(prev => [newTicket, ...prev])
    }

    return (
        <TicketContext.Provider value={{ tickets, addTicket }}>
            {children}
        </TicketContext.Provider>
    )
}

export function useTickets() {
    const context = useContext(TicketContext)
    if (context === undefined) {
        throw new Error("useTickets must be used within a TicketProvider")
    }
    return context
}
