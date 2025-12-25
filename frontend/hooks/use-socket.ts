import { useEffect, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let stompClient: Client | null = null

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize STOMP WebSocket connection
    if (!stompClient) {
      stompClient = new Client({
        webSocketFactory: () => new SockJS(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000' + '/ws'),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      })

      stompClient.onConnect = () => {
        console.log('STOMP WebSocket connected')
        setIsConnected(true)
      }

      stompClient.onDisconnect = () => {
        console.log('STOMP WebSocket disconnected')
        setIsConnected(false)
      }

      stompClient.onStompError = (frame) => {
        console.error('STOMP error:', frame)
        setIsConnected(false)
      }

      stompClient.activate()
    }

    return () => {
      // Don't disconnect on component unmount to keep connection alive
      // stompClient?.deactivate()
    }
  }, [])

  return { socket: stompClient, isConnected }
}

// Hook for subscribing to GPS updates
export function useGPSTracking(onUpdate: (data: any[]) => void) {
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (!socket || !isConnected) return

    // Subscribe to GPS updates via STOMP
    const subscription = socket.subscribe('/topic/gps-updates', (message) => {
      try {
        const data = JSON.parse(message.body)
        onUpdate(data)
      } catch (error) {
        console.error('Error parsing GPS update:', error)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [socket, isConnected, onUpdate])

  return { isConnected }
}

// Hook for tracking a specific bus
export function useBusTracking(busId: number | null, onUpdate: (data: any) => void) {
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (!socket || !isConnected || !busId) return

    // Subscribe to specific bus updates via STOMP
    const subscription = socket.subscribe(`/topic/bus/${busId}`, (message) => {
      try {
        const data = JSON.parse(message.body)
        onUpdate(data)
      } catch (error) {
        console.error('Error parsing bus update:', error)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [socket, isConnected, busId, onUpdate])

  return { isConnected }
}
