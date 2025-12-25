import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?',
      [params.id]
    )

    const user = (users as any[])[0]

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, email, phone, role, password } = body
    const userId = params.id

    // Check if user exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    )

    if ((existing as any[]).length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let query = 'UPDATE users SET name = ?, email = ?, phone = ?, role = ?'
    const queryParams = [name, email, phone, role]

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      query += ', password = ?'
      queryParams.push(hashedPassword)
    }

    query += ' WHERE id = ?'
    queryParams.push(userId)

    await pool.query(query, queryParams)

    return NextResponse.json({ message: 'User updated successfully' })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [result] = await pool.query(
      'DELETE FROM users WHERE id = ?',
      [params.id]
    )

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
