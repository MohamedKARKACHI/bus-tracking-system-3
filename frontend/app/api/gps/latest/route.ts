import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get latest GPS position for each active bus
    const query = `
      SELECT 
        g.*,
        b.bus_number,
        b.plate_number,
        b.status as bus_status,
        b.model,
        s.route_id,
        r.route_number,
        r.name as route_name
      FROM gps_tracking g
      INNER JOIN buses b ON g.bus_id = b.id
      LEFT JOIN schedules s ON g.schedule_id = s.id
      LEFT JOIN routes r ON s.route_id = r.id
      WHERE g.timestamp = (
        SELECT MAX(timestamp) 
        FROM gps_tracking 
        WHERE bus_id = g.bus_id
      )
      AND b.status = 'active'
      ORDER BY b.bus_number
    `

    const [rows] = await pool.query(query)
    
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch latest GPS data' },
      { status: 500 }
    )
  }
}
