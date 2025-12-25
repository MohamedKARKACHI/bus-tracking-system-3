import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('user_id')

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        const query = `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.created_at,
        u.avatar_url,
        COUNT(DISTINCT t.id) as total_tickets,
        COUNT(DISTINCT CASE WHEN t.status = 'active' THEN t.id END) as active_tickets,
        SUM(CASE WHEN tr.status = 'completed' THEN tr.amount ELSE 0 END) as total_spent
      FROM users u
      LEFT JOIN tickets t ON u.id = t.user_id
      LEFT JOIN transactions tr ON u.id = tr.user_id
      WHERE u.id = ? AND u.role = 'client'
      GROUP BY u.id
    `

        const [rows]: any = await pool.query(query, [userId])

        if (rows.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(rows[0])
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json()
        const {
            user_id,
            first_name,
            last_name,
            email,
            phone,
            avatar_url
        } = data

        if (!user_id) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        const updates: string[] = []
        const params: any[] = []

        if (first_name) {
            updates.push('first_name = ?')
            params.push(first_name)
        }
        if (last_name) {
            updates.push('last_name = ?')
            params.push(last_name)
        }
        if (email) {
            updates.push('email = ?')
            params.push(email)
        }
        if (phone) {
            updates.push('phone = ?')
            params.push(phone)
        }
        if (avatar_url) {
            updates.push('avatar_url = ?')
            params.push(avatar_url)
        }

        if (updates.length === 0) {
            return NextResponse.json(
                { error: 'No fields to update' },
                { status: 400 }
            )
        }

        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ? AND role = 'client'`
        params.push(user_id)

        await pool.query(query, params)

        return NextResponse.json(
            { message: 'Profile updated successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        )
    }
}
