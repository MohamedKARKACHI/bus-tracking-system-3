import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import type { User } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('🔐 Login attempt for:', email)

    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Get user from database
    const [users]: any = await pool.query(
      'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
      [email]
    )

    console.log('📊 Users found:', users.length)

    if (users.length === 0) {
      console.log('❌ No user found with email:', email)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const user = users[0]
    console.log('✅ User found:', user.email, 'Role:', user.role)

    // Normalize role to lowercase to match frontend expectations
    const normalizedRole = String(user.role).toLowerCase() as 'admin' | 'driver' | 'client'

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password)
    console.log('🔑 Password valid:', validPassword)
    
    if (!validPassword) {
      console.log('❌ Invalid password for:', email)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = signToken({
      id: user.id,
      email: user.email,
      role: normalizedRole
    })

    // Return user data and token
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        role: normalizedRole,
        avatar: `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=3B82F6&color=fff`
      },
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
