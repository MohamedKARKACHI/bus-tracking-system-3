import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, license_expiry } = body
    const driverId = params.id

    // Update driver details
    await pool.query(
      'UPDATE drivers SET status = ?, license_expiry = ? WHERE id = ?',
      [status, license_expiry, driverId]
    )

    return NextResponse.json({ message: 'Driver updated successfully' })
  } catch (error) {
    console.error('Update driver error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
