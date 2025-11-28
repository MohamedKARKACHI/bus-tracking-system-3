import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import pool from './db'

let io: SocketIOServer | null = null

export function initializeSocketServer(httpServer: HTTPServer) {
  if (io) {
    console.log('Socket.IO server already initialized')
    return io
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_APP_URL 
        : 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Join room for real-time GPS updates
    socket.on('subscribe-gps', () => {
      socket.join('gps-updates')
      console.log(`Client ${socket.id} subscribed to GPS updates`)
    })

    // Join room for specific bus tracking
    socket.on('track-bus', (busId: number) => {
      socket.join(`bus-${busId}`)
      console.log(`Client ${socket.id} tracking bus ${busId}`)
    })

    // Stop tracking specific bus
    socket.on('untrack-bus', (busId: number) => {
      socket.leave(`bus-${busId}`)
      console.log(`Client ${socket.id} stopped tracking bus ${busId}`)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  // Start broadcasting GPS updates every 5 seconds
  startGPSBroadcast()

  console.log('Socket.IO server initialized')
  return io
}

export function getSocketServer(): SocketIOServer | null {
  return io
}

// Broadcast GPS location updates to all connected clients
async function startGPSBroadcast() {
  setInterval(async () => {
    if (!io) return

    try {
      // Fetch latest GPS locations
      const [gpsData] = await pool.query(`
        SELECT 
          gt.id,
          gt.bus_id,
          gt.latitude,
          gt.longitude,
          gt.speed,
          gt.heading,
          gt.timestamp,
          b.bus_number,
          b.plate_number,
          b.model,
          b.status as bus_status
        FROM gps_tracking gt
        INNER JOIN buses b ON gt.bus_id = b.id
        WHERE gt.timestamp = (
          SELECT MAX(timestamp) 
          FROM gps_tracking 
          WHERE bus_id = gt.bus_id
        )
        AND b.status = 'active'
        ORDER BY gt.timestamp DESC
      `)

      // Broadcast to all subscribers
      io.to('gps-updates').emit('gps-update', gpsData)

      // Broadcast individual bus updates to specific trackers
      for (const gps of gpsData as any[]) {
        io.to(`bus-${gps.bus_id}`).emit('bus-location', gps)
      }
    } catch (error) {
      console.error('Error broadcasting GPS data:', error)
    }
  }, 5000) // Update every 5 seconds
}

// Function to manually emit GPS update when new data is received
export async function emitGPSUpdate(busId: number) {
  if (!io) return

  try {
    const [gpsData] = await pool.query(`
      SELECT 
        gt.id,
        gt.bus_id,
        gt.latitude,
        gt.longitude,
        gt.speed,
        gt.heading,
        gt.timestamp,
        b.registration_number,
        b.model,
        b.status as bus_status
      FROM gps_tracking gt
      INNER JOIN buses b ON gt.bus_id = b.id
      WHERE gt.bus_id = ?
      ORDER BY gt.timestamp DESC
      LIMIT 1
    `, [busId])

    if ((gpsData as any[]).length > 0) {
      const location = (gpsData as any[])[0]
      io.to('gps-updates').emit('gps-update', [location])
      io.to(`bus-${busId}`).emit('bus-location', location)
    }
  } catch (error) {
    console.error('Error emitting GPS update:', error)
  }
}
