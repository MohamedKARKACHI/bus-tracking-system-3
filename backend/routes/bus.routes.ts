import { Router } from 'express'
import pool from '../config/database'

const router = Router()

// Get all buses
router.get('/', async (req, res) => {
  try {
    const [buses] = await pool.query(`
      SELECT 
        b.*,
        d.name as driver_name,
        r.name as route_name
      FROM buses b
      LEFT JOIN drivers d ON b.driver_id = d.id
      LEFT JOIN routes r ON b.route_id = r.id
      ORDER BY b.bus_number
    `)
    res.json(buses)
  } catch (error) {
    console.error('Error fetching buses:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get bus by ID
router.get('/:id', async (req, res) => {
  try {
    const [buses] = await pool.query(
      'SELECT * FROM buses WHERE id = ?',
      [req.params.id]
    )
    
    if ((buses as any[]).length === 0) {
      return res.status(404).json({ error: 'Bus not found' })
    }
    
    res.json((buses as any[])[0])
  } catch (error) {
    console.error('Error fetching bus:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create bus
router.post('/', async (req, res) => {
  try {
    const { bus_number, plate_number, model, capacity, status } = req.body
    
    const [result] = await pool.query(
      'INSERT INTO buses (bus_number, plate_number, model, capacity, status) VALUES (?, ?, ?, ?, ?)',
      [bus_number, plate_number, model, capacity, status || 'active']
    )
    
    res.status(201).json({ id: (result as any).insertId })
  } catch (error) {
    console.error('Error creating bus:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update bus
router.put('/:id', async (req, res) => {
  try {
    const { bus_number, plate_number, model, capacity, status, driver_id, route_id } = req.body
    
    await pool.query(
      'UPDATE buses SET bus_number = ?, plate_number = ?, model = ?, capacity = ?, status = ?, driver_id = ?, route_id = ? WHERE id = ?',
      [bus_number, plate_number, model, capacity, status, driver_id, route_id, req.params.id]
    )
    
    res.json({ message: 'Bus updated successfully' })
  } catch (error) {
    console.error('Error updating bus:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete bus
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM buses WHERE id = ?', [req.params.id])
    res.json({ message: 'Bus deleted successfully' })
  } catch (error) {
    console.error('Error deleting bus:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
