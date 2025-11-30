import { Router } from 'express'
import pool from '../config/database'
import { emitGPSUpdate } from '../socket/socket-server'

const router = Router()

// Get latest GPS locations for all buses
router.get('/latest', async (req, res) => {
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
      ORDER BY gt.timestamp DESC
    `)
    res.json(gpsData)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get GPS history for specific bus
router.get('/bus/:busId/history', async (req, res) => {
  try {
    const { busId } = req.params
    const { limit = 100 } = req.query
    
    const [gpsData] = await pool.query(`
      SELECT * FROM gps_tracking 
      WHERE bus_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `, [busId, parseInt(limit as string)])
    
    res.json(gpsData)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update GPS location (from GPS device or simulator)
router.post('/update', async (req, res) => {
  try {
    const { bus_id, latitude, longitude, speed, heading } = req.body
    
    const [result] = await pool.query(
      'INSERT INTO gps_tracking (bus_id, latitude, longitude, speed, heading) VALUES (?, ?, ?, ?, ?)',
      [bus_id, latitude, longitude, speed || 0, heading || 0]
    )
    
    // Emit real-time update via Socket.IO
    await emitGPSUpdate(bus_id)
    
    res.status(201).json({ id: (result as any).insertId })
  } catch (error) {
    console.error('GPS update error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
