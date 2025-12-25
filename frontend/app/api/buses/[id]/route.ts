import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [rows]: any = await pool.query(
      `SELECT 
        b.*,
        d.license_number,
        u.first_name as driver_first_name,
        u.last_name as driver_last_name
      FROM buses b
      LEFT JOIN drivers d ON b.current_driver_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE b.id = ?`,
      [params.id]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Bus not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bus' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const updates: string[] = []
    const values: any[] = []

    Object.keys(data).forEach(key => {
      updates.push(`${key} = ?`)
      values.push(data[key])
    })

    values.push(params.id)

    await pool.query(
      `UPDATE buses SET ${updates.join(', ')} WHERE id = ?`,
      values
    )

    return NextResponse.json({ message: 'Bus updated successfully' })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update bus' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await pool.query('DELETE FROM buses WHERE id = ?', [params.id])
    return NextResponse.json({ message: 'Bus deleted successfully' })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to delete bus' },
      { status: 500 }
    )
  }
}
