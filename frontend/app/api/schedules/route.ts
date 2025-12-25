import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const routeId = searchParams.get('routeId')
    const date = searchParams.get('date')

    let query = `
      SELECT 
        s.*,
        r.route_number,
        r.name as route_name,
        r.start_location,
        r.end_location,
        b.bus_number,
        b.model as bus_model,
        u.first_name as driver_first_name,
        u.last_name as driver_last_name
      FROM schedules s
      INNER JOIN routes r ON s.route_id = r.id
      INNER JOIN buses b ON s.bus_id = b.id
      INNER JOIN drivers d ON s.driver_id = d.id
      INNER JOIN users u ON d.user_id = u.id
      WHERE 1=1
    `

    const params: any[] = []

    if (status) {
      query += ' AND s.status = ?'
      params.push(status)
    }

    if (routeId) {
      query += ' AND s.route_id = ?'
      params.push(routeId)
    }

    if (date) {
      query += ' AND DATE(s.departure_time) = ?'
      params.push(date)
    }

    query += ' ORDER BY s.departure_time'

    const [rows] = await pool.query(query, params)
    
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      route_id,
      bus_id,
      driver_id,
      departure_time,
      arrival_time,
      status = 'scheduled'
    } = data

    const [result]: any = await pool.query(
      `INSERT INTO schedules (route_id, bus_id, driver_id, departure_time, arrival_time, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [route_id, bus_id, driver_id, departure_time, arrival_time, status]
    )

    return NextResponse.json(
      { id: result.insertId, message: 'Schedule created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    )
  }
}
