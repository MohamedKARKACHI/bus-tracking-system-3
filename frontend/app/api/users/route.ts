import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    let query = 'SELECT id, name, email, role, phone, created_at FROM users'
    const params: any[] = []

    if (role) {
      query += ' WHERE role = ?'
      params.push(role)
    }

    query += ' ORDER BY created_at DESC'

    const [users] = await pool.query(query, params)
    return NextResponse.json(users)
  } catch (error) {
    console.error('Get all users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone, role = 'client' } = body

    // Check if user exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )

    if ((existing as any[]).length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, role]
    )

    const userId = (result as any).insertId

    return NextResponse.json({
      id: userId,
      name,
      email,
      role,
      phone
    }, { status: 201 })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
