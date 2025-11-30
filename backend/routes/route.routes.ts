import { Router } from 'express'
import pool from '../config/database'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const [routes] = await pool.query('SELECT * FROM routes ORDER BY name')
    res.json(routes)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const [routes] = await pool.query('SELECT * FROM routes WHERE id = ?', [req.params.id])
    if ((routes as any[]).length === 0) {
      return res.status(404).json({ error: 'Route not found' })
    }
    res.json((routes as any[])[0])
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, start_location, end_location, distance, estimated_duration } = req.body
    const [result] = await pool.query(
      'INSERT INTO routes (name, start_location, end_location, distance, estimated_duration) VALUES (?, ?, ?, ?, ?)',
      [name, start_location, end_location, distance, estimated_duration]
    )
    res.status(201).json({ id: (result as any).insertId })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
