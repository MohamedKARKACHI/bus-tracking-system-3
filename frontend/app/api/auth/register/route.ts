import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone, role = 'client' } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const [existingUsers]: any = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    const [result]: any = await pool.query(
      `INSERT INTO users (email, password, role, first_name, last_name, phone) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, role, firstName, lastName, phone || null]
    )

    const userId = result.insertId

    // Create JWT token
    const token = signToken({
      id: userId,
      email,
      role: role as 'admin' | 'driver' | 'client'
    })

    return NextResponse.json({
      user: {
        id: userId,
        email,
        name: `${firstName} ${lastName}`,
        role,
        avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=3B82F6&color=fff`
      },
      token
    }, { status: 201 })

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
