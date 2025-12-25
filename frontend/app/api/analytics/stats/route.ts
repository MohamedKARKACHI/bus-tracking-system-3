import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get overall statistics
    const [busStats]: any = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
        SUM(CASE WHEN status = 'out_of_service' THEN 1 ELSE 0 END) as out_of_service
      FROM buses
    `)

    const [driverStats]: any = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'on_duty' THEN 1 ELSE 0 END) as on_duty,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN status = 'off_duty' THEN 1 ELSE 0 END) as off_duty
      FROM drivers
    `)

    const [routeStats]: any = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
      FROM routes
    `)

    const [ticketStats]: any = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN payment_status = 'paid' THEN fare ELSE 0 END) as total_revenue
      FROM tickets
      WHERE DATE(booking_date) = CURDATE()
    `)

    const [scheduleStats]: any = await pool.query(`
      SELECT 
        COUNT(*) as total_today,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM schedules
      WHERE DATE(departure_time) = CURDATE()
    `)

    return NextResponse.json({
      buses: busStats[0],
      drivers: driverStats[0],
      routes: routeStats[0],
      tickets: ticketStats[0],
      schedules: scheduleStats[0]
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
