import { Router } from 'express'
import pool from '../config/database'

const router = Router()

// Get all tickets for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const [tickets] = await pool.query(`
      SELECT 
        t.*,
        r.name as route_name,
        r.start_location,
        r.end_location,
        bs1.stop_name as boarding_stop,
        bs2.stop_name as destination_stop,
        s.departure_time,
        s.arrival_time,
        b.bus_number,
        u.first_name,
        u.last_name
      FROM tickets t
      LEFT JOIN schedules s ON t.schedule_id = s.id
      LEFT JOIN routes r ON s.route_id = r.id
      LEFT JOIN route_stops bs1 ON t.boarding_stop_id = bs1.id
      LEFT JOIN route_stops bs2 ON t.destination_stop_id = bs2.id
      LEFT JOIN buses b ON s.bus_id = b.id
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.user_id = ?
      ORDER BY t.booking_date DESC
    `, [req.params.userId])
    res.json(tickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get single ticket by ticket number
router.get('/:ticketNumber', async (req, res) => {
  try {
    const [tickets] = await pool.query(`
      SELECT 
        t.*,
        r.name as route_name,
        r.start_location,
        r.end_location,
        r.fare,
        bs1.stop_name as boarding_stop,
        bs2.stop_name as destination_stop,
        s.departure_time,
        s.arrival_time,
        b.bus_number,
        u.first_name,
        u.last_name,
        u.email
      FROM tickets t
      LEFT JOIN schedules s ON t.schedule_id = s.id
      LEFT JOIN routes r ON s.route_id = r.id
      LEFT JOIN route_stops bs1 ON t.boarding_stop_id = bs1.id
      LEFT JOIN route_stops bs2 ON t.destination_stop_id = bs2.id
      LEFT JOIN buses b ON s.bus_id = b.id
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.ticket_number = ?
    `, [req.params.ticketNumber])
    
    if ((tickets as any[]).length === 0) {
      return res.status(404).json({ error: 'Ticket not found' })
    }
    res.json((tickets as any[])[0])
  } catch (error) {
    console.error('Error fetching ticket:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create new ticket
router.post('/', async (req, res) => {
  try {
    const { 
      user_id, 
      schedule_id, 
      seat_number, 
      boarding_stop_id, 
      destination_stop_id, 
      fare,
      payment_method 
    } = req.body

    // Generate unique ticket number
    const ticketNumber = `TCK-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    const [result] = await pool.query(
      `INSERT INTO tickets (
        ticket_number, 
        user_id, 
        schedule_id, 
        seat_number, 
        boarding_stop_id, 
        destination_stop_id, 
        fare,
        status,
        payment_status,
        payment_method
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', 'paid', ?)`,
      [
        ticketNumber,
        user_id,
        schedule_id,
        seat_number,
        boarding_stop_id,
        destination_stop_id,
        fare,
        payment_method || 'card'
      ]
    )

    // Get the created ticket with full details
    const [tickets] = await pool.query(`
      SELECT 
        t.*,
        r.name as route_name,
        r.start_location,
        r.end_location,
        bs1.stop_name as boarding_stop,
        bs2.stop_name as destination_stop,
        s.departure_time,
        s.arrival_time,
        b.bus_number,
        u.first_name,
        u.last_name
      FROM tickets t
      LEFT JOIN schedules s ON t.schedule_id = s.id
      LEFT JOIN routes r ON s.route_id = r.id
      LEFT JOIN route_stops bs1 ON t.boarding_stop_id = bs1.id
      LEFT JOIN route_stops bs2 ON t.destination_stop_id = bs2.id
      LEFT JOIN buses b ON s.bus_id = b.id
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `, [(result as any).insertId])

    res.status(201).json((tickets as any[])[0])
  } catch (error) {
    console.error('Error creating ticket:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update ticket status
router.patch('/:ticketNumber/status', async (req, res) => {
  try {
    const { status } = req.body
    await pool.query(
      'UPDATE tickets SET status = ? WHERE ticket_number = ?',
      [status, req.params.ticketNumber]
    )
    res.json({ message: 'Ticket status updated successfully' })
  } catch (error) {
    console.error('Error updating ticket:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Cancel ticket
router.delete('/:ticketNumber', async (req, res) => {
  try {
    await pool.query(
      'UPDATE tickets SET status = ?, payment_status = ? WHERE ticket_number = ?',
      ['cancelled', 'refunded', req.params.ticketNumber]
    )
    res.json({ message: 'Ticket cancelled successfully' })
  } catch (error) {
    console.error('Error cancelling ticket:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
