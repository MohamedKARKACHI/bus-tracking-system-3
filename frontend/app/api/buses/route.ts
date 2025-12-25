import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import type { Bus } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = `
      SELECT 
        b.*,
        d.license_number,
        u.first_name as driver_first_name,
        u.last_name as driver_last_name,
        dr.status as driver_status
      FROM buses b
      LEFT JOIN drivers d ON b.current_driver_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN drivers dr ON b.current_driver_id = dr.id
    `

    const params: any[] = []

    if (status) {
      query += ' WHERE b.status = ?'
      params.push(status)
    }

    query += ' ORDER BY b.bus_number'

    const [rows] = await pool.query(query, params)
    
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch buses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      bus_number,
      plate_number,
      model,
      capacity,
      year,
      status = 'active',
      fuel_type = 'diesel'
    } = data

    const [result]: any = await pool.query(
      `INSERT INTO buses (bus_number, plate_number, model, capacity, year, status, fuel_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [bus_number, plate_number, model, capacity, year, status, fuel_type]
    )

    return NextResponse.json(
      { id: result.insertId, message: 'Bus created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create bus' },
      { status: 500 }
    )
  }
}
