import { Router } from 'express'
import pool from '../config/database'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const [schedules] = await pool.query(`
      SELECT 
        s.*,
        b.bus_number,
        r.name as route_name
      FROM schedules s
      LEFT JOIN buses b ON s.bus_id = b.id
      LEFT JOIN routes r ON s.route_id = r.id
      ORDER BY s.departure_time
    `)
    res.json(schedules)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
