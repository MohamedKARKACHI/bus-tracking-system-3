import express from 'express';
import pool from '../config/database';

const router = express.Router();

// Get all available routes with station information
router.get('/routes', async (req, res) => {
  try {
    const [routes] = await pool.query<any[]>(`
      SELECT 
        r.id,
        r.name,
        r.route_number,
        r.start_location,
        r.end_location,
        r.fare as base_price,
        r.estimated_duration_minutes as duration_minutes,
        r.status,
        COUNT(DISTINCT b.id) as available_buses
      FROM routes r
      LEFT JOIN schedules s ON r.id = s.route_id
      LEFT JOIN buses b ON s.bus_id = b.id AND b.status = 'active'
      WHERE r.status = 'active'
      GROUP BY r.id, r.name, r.route_number, r.start_location, r.end_location, 
               r.fare, r.estimated_duration_minutes, r.status
      ORDER BY r.route_number
    `);

    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// Get route details by ID
router.get('/routes/:id', async (req, res) => {
  try {
    const [routes] = await pool.query<any[]>(
      `SELECT 
        r.*,
        COUNT(DISTINCT b.id) as available_buses
      FROM routes r
      LEFT JOIN schedules s ON r.id = s.route_id
      LEFT JOIN buses b ON s.bus_id = b.id AND b.status = 'active'
      WHERE r.id = ?
      GROUP BY r.id`,
      [req.params.id]
    );

    if (!routes || routes.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }

    // Get route stops with GPS coordinates
    const [stops] = await pool.query<any[]>(
      `SELECT 
        stop_name,
        stop_order,
        latitude,
        longitude,
        estimated_arrival_time
      FROM route_stops
      WHERE route_id = ?
      ORDER BY stop_order`,
      [req.params.id]
    );

    res.json({
      ...routes[0],
      stops
    });
  } catch (error) {
    console.error('Error fetching route details:', error);
    res.status(500).json({ error: 'Failed to fetch route details' });
  }
});

// Get popular routes (most frequently booked)
router.get('/routes/popular/list', async (req, res) => {
  try {
    const [routes] = await pool.query<any[]>(`
      SELECT 
        r.id,
        r.name,
        r.route_number,
        r.start_location,
        r.end_location,
        r.fare as base_price,
        r.estimated_duration_minutes as duration_minutes,
        COUNT(t.id) as booking_count
      FROM routes r
      LEFT JOIN schedules s ON r.id = s.route_id
      LEFT JOIN tickets t ON s.id = t.schedule_id
      WHERE r.status = 'active'
      GROUP BY r.id, r.name, r.route_number, r.start_location, r.end_location, r.fare, r.estimated_duration_minutes
      ORDER BY booking_count DESC, r.fare ASC
      LIMIT 6
    `);

    res.json(routes);
  } catch (error) {
    console.error('Error fetching popular routes:', error);
    res.status(500).json({ error: 'Failed to fetch popular routes' });
  }
});

// Search routes by origin and destination
router.get('/routes/search', async (req, res) => {
  const { from, to, date } = req.query;

  try {
    let query = `
      SELECT 
        r.id,
        r.name,
        r.route_number,
        r.start_location,
        r.end_location,
        r.price,
        r.duration_minutes,
        r.status,
        COUNT(DISTINCT b.id) as available_buses
      FROM routes r
      LEFT JOIN buses b ON b.route_id = r.id AND b.status = 'active'
      WHERE r.status = 'active'
    `;

    const params: any[] = [];

    if (from) {
      query += ` AND (r.start_location LIKE ? OR EXISTS (
        SELECT 1 FROM route_stops rs 
        WHERE rs.route_id = r.id AND rs.station_name LIKE ?
      ))`;
      params.push(`%${from}%`, `%${from}%`);
    }

    if (to) {
      query += ` AND (r.end_location LIKE ? OR EXISTS (
        SELECT 1 FROM route_stops rs 
        WHERE rs.route_id = r.id AND rs.station_name LIKE ?
      ))`;
      params.push(`%${to}%`, `%${to}%`);
    }

    query += ` GROUP BY r.id ORDER BY r.price ASC`;

    const [routes] = await pool.query(query, params);
    res.json(routes);
  } catch (error) {
    console.error('Error searching routes:', error);
    res.status(500).json({ error: 'Failed to search routes' });
  }
});

// Create a booking
router.post('/bookings', async (req, res) => {
  const {
    userId,
    routeId,
    busId,
    seatNumbers,
    passengerName,
    passengerEmail,
    passengerPhone,
    travelDate,
    totalPrice
  } = req.body;

  try {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Create ticket
      const [ticketResult] = await connection.query(
        `INSERT INTO tickets (
          user_id, route_id, seat_number, price, 
          purchase_date, travel_date, status, qr_code
        ) VALUES (?, ?, ?, ?, NOW(), ?, 'confirmed', ?)`,
        [
          userId,
          routeId,
          seatNumbers.join(','),
          totalPrice,
          travelDate,
          `TCK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        ]
      );

      const ticketId = (ticketResult as any).insertId;

      await connection.commit();

      res.status(201).json({
        success: true,
        ticketId,
        message: 'Booking confirmed successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

export default router;
