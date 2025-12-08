import { Router } from 'express'
import pool from '../config/database'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const [incidents] = await pool.query(`
      SELECT 
        i.*,
        b.bus_number,
        d.name as driver_name
      FROM incidents i
      LEFT JOIN buses b ON i.bus_id = b.id
      LEFT JOIN drivers d ON i.driver_id = d.id
      ORDER BY i.reported_at DESC
    `)
    res.json(incidents)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { bus_id, driver_id, type, description, severity, latitude, longitude } = req.body
    const [result] = await pool.query(
      'INSERT INTO incidents (bus_id, driver_id, incident_type, description, severity, latitude, longitude, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [bus_id, driver_id, type, description, severity, latitude, longitude, 'reported']
    )
    res.status(201).json({ id: (result as any).insertId })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
