import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { emitGPSUpdate } from '@/lib/socket-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const busId = searchParams.get('busId')
    const limit = parseInt(searchParams.get('limit') || '1')

    let query = `
      SELECT 
        g.*,
        b.bus_number,
        b.plate_number,
        b.status as bus_status
      FROM gps_tracking g
      INNER JOIN buses b ON g.bus_id = b.id
    `

    const params: any[] = []

    if (busId) {
      query += ' WHERE g.bus_id = ?'
      params.push(busId)
    }

    query += ' ORDER BY g.timestamp DESC'

    if (limit > 0) {
      query += ' LIMIT ?'
      params.push(limit)
    }

    const [rows] = await pool.query(query, params)
    
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GPS data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      bus_id,
      schedule_id,
      latitude,
      longitude,
      speed,
      heading,
      altitude
    } = data

    const [result]: any = await pool.query(
      `INSERT INTO gps_tracking (bus_id, schedule_id, latitude, longitude, speed, heading, altitude)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [bus_id, schedule_id, latitude, longitude, speed, heading, altitude]
    )

    // Emit real-time update via Socket.IO
    await emitGPSUpdate(bus_id)

    return NextResponse.json(
      { id: result.insertId, message: 'GPS data recorded' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to record GPS data' },
      { status: 500 }
    )
  }
}
