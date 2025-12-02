import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import { initializeSocketServer } from './socket/socket-server'
import { connectDatabase } from './config/database'
import authRoutes from './routes/auth.routes'
import busRoutes from './routes/bus.routes'
import routeRoutes from './routes/route.routes'
import scheduleRoutes from './routes/schedule.routes'
import incidentRoutes from './routes/incident.routes'
import messageRoutes from './routes/message.routes'
import gpsRoutes from './routes/gps.routes'
import ticketRoutes from './routes/ticket.routes'
import bookingRoutes from './routes/booking.routes'

const app = express()
const server = createServer(app)
const PORT = parseInt(process.env.BACKEND_PORT || '4000', 10)

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/buses', busRoutes)
app.use('/api/routes', routeRoutes)
app.use('/api/schedules', scheduleRoutes)
app.use('/api/incidents', incidentRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/gps', gpsRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/bookings', bookingRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Initialize database and Socket.IO
connectDatabase().then(() => {
  initializeSocketServer(server)
  
  server.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`)
    console.log(`📡 Socket.IO enabled for real-time tracking`)
  })
}).catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
