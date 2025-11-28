import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const severity = searchParams.get('severity')

    let query = `
      SELECT 
        i.*,
        b.bus_number,
        u.first_name as driver_first_name,
        u.last_name as driver_last_name
      FROM incidents i
      INNER JOIN buses b ON i.bus_id = b.id
      INNER JOIN drivers d ON i.driver_id = d.id
      INNER JOIN users u ON d.user_id = u.id
      WHERE 1=1
    `

    const params: any[] = []

    if (status) {
      query += ' AND i.status = ?'
      params.push(status)
    }

    if (severity) {
      query += ' AND i.severity = ?'
      params.push(severity)
    }

    query += ' ORDER BY i.reported_at DESC'

    const [rows] = await pool.query(query, params)
    
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      bus_id,
      driver_id,
      schedule_id,
      incident_type,
      description,
      severity = 'low'
    } = data

    const [result]: any = await pool.query(
      `INSERT INTO incidents (bus_id, driver_id, schedule_id, incident_type, description, severity)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [bus_id, driver_id, schedule_id, incident_type, description, severity]
    )

    return NextResponse.json(
      { id: result.insertId, message: 'Incident reported successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to report incident' },
      { status: 500 }
    )
  }
}
