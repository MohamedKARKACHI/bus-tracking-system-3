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
      first_name,
      last_name,
      email,
      phone,
      password = 'defaultPassword123', // Should be hashed in production
      license_number,
      license_expiry,
      vehicle_type = 'Bus',
      status = 'available'
    } = data

    // First, create the user
    const [userResult]: any = await pool.query(
      `INSERT INTO users (name, first_name, last_name, email, phone, password, role, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 'driver', TRUE)`,
      [`${first_name} ${last_name}`, first_name, last_name, email, phone, password]
    )

    const userId = userResult.insertId

    // Then, create the driver record
    const [driverResult]: any = await pool.query(
      `INSERT INTO drivers (user_id, license_number, license_expiry, status)
       VALUES (?, ?, ?, ?)`,
      [userId, license_number, license_expiry, status]
    )

    return NextResponse.json(
      {
        id: driverResult.insertId,
        user_id: userId,
        message: 'Driver created successfully',
        driver: {
          id: driverResult.insertId,
          user_id: userId,
          first_name,
          last_name,
          email,
          phone,
          license_number,
          license_expiry,
          vehicle_type,
          status
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: (error as any).message || 'Failed to create driver' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      id,
      user_id,
      first_name,
      last_name,
      email,
      phone,
      license_number,
      license_expiry,
      status
    } = data

    // Update user information
    await pool.query(
      `UPDATE users 
       SET first_name = ?, last_name = ?, email = ?, phone = ?
       WHERE id = ?`,
      [first_name, last_name, email, phone, user_id]
    )

    // Update driver information
    await pool.query(
      `UPDATE drivers 
       SET license_number = ?, license_expiry = ?, status = ?
       WHERE id = ?`,
      [license_number, license_expiry, status, id]
    )

    return NextResponse.json(
      { message: 'Driver updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update driver' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('user_id')

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Driver ID and User ID are required' },
        { status: 400 }
      )
    }

    // Soft delete by setting user as inactive
    await pool.query(
      `UPDATE users SET is_active = FALSE WHERE id = ?`,
      [userId]
    )

    return NextResponse.json(
      { message: 'Driver deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to delete driver' },
      { status: 500 }
    )
  }
}
