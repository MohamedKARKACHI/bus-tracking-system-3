import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    let query = `
      SELECT 
        t.*,
        u.first_name,
        u.last_name,
        u.email,
        s.departure_time,
        s.arrival_time,
        r.route_number,
        r.name as route_name,
        bs.stop_name as boarding_stop_name,
        ds.stop_name as destination_stop_name,
        b.bus_number
      FROM tickets t
      INNER JOIN users u ON t.user_id = u.id
      INNER JOIN schedules s ON t.schedule_id = s.id
      INNER JOIN routes r ON s.route_id = r.id
      INNER JOIN route_stops bs ON t.boarding_stop_id = bs.id
      INNER JOIN route_stops ds ON t.destination_stop_id = ds.id
      INNER JOIN buses b ON s.bus_id = b.id
    `

    const params: any[] = []

    if (userId) {
      query += ' WHERE t.user_id = ?'
      params.push(userId)
    } else if (user && user.role === 'client') {
      query += ' WHERE t.user_id = ?'
      params.push(user.id)
    }

    query += ' ORDER BY t.booking_date DESC'

    const [rows] = await pool.query(query, params)
    
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    const data = await request.json()
    
    const {
      schedule_id,
      seat_number,
      boarding_stop_id,
      destination_stop_id,
      fare,
      payment_method = 'card'
    } = data

    const userId = user?.id || data.user_id

    if (!userId) {
      return NextResponse.json(
        { error: 'User authentication required' },
        { status: 401 }
      )
    }

    // Generate ticket number
    const ticketNumber = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    const [result]: any = await pool.query(
      `INSERT INTO tickets (
        ticket_number, user_id, schedule_id, seat_number, 
        boarding_stop_id, destination_stop_id, fare, 
        payment_method, status, payment_status
      )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'booked', 'pending')`,
      [ticketNumber, userId, schedule_id, seat_number, boarding_stop_id, destination_stop_id, fare, payment_method]
    )

    return NextResponse.json(
      { 
        id: result.insertId, 
        ticket_number: ticketNumber,
        message: 'Ticket booked successfully' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to book ticket' },
      { status: 500 }
    )
  }
}
