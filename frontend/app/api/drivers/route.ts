import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = `
      SELECT 
        d.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        b.bus_number,
        b.plate_number
      FROM drivers d
      INNER JOIN users u ON d.user_id = u.id
      LEFT JOIN buses b ON b.current_driver_id = d.id
      WHERE u.is_active = TRUE
    `

    const params: any[] = []

    if (status) {
      query += ' AND d.status = ?'
      params.push(status)
    }

    query += ' ORDER BY u.last_name, u.first_name'

    const [rows] = await pool.query(query, params)
    
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      user_id,
      license_number,
      license_expiry,
      status = 'available'
    } = data

    const [result]: any = await pool.query(
      `INSERT INTO drivers (user_id, license_number, license_expiry, status)
       VALUES (?, ?, ?, ?)`,
      [user_id, license_number, license_expiry, status]
    )

    // Ensure the associated user has the correct role
    await pool.query(
      `UPDATE users SET role = 'driver' WHERE id = ?`,
      [user_id]
    )

    return NextResponse.json(
      { id: result.insertId, message: 'Driver created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create driver' },
      { status: 500 }
    )
  }
}
