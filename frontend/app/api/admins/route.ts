import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')

        let query = `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.role,
        u.is_active,
        u.created_at
      FROM users u
      WHERE u.role = 'admin'
    `

        const params: any[] = []

        if (status) {
            query += ' AND u.is_active = ?'
            params.push(status === 'active' ? 1 : 0)
        }

        query += ' ORDER BY u.last_name, u.first_name'

        const [rows] = await pool.query(query, params)

        return NextResponse.json(rows)
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch admins' },
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
            department = 'Operations',
            position = 'Admin',
            access_level = 'Full Access'
        } = data

        // Insert user with admin role
        const [result]: any = await pool.query(
            `INSERT INTO users (first_name, last_name, email, phone, password, role, is_active)
       VALUES (?, ?, ?, ?, ?, 'admin', TRUE)`,
            [first_name, last_name, email, phone, password]
        )

        return NextResponse.json(
            {
                id: result.insertId,
                message: 'Admin created successfully',
                admin: {
                    id: result.insertId,
                    first_name,
                    last_name,
                    email,
                    phone,
                    role: 'admin',
                    department,
                    position,
                    access_level
                }
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to create admin' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json()
        const {
            id,
            first_name,
            last_name,
            email,
            phone,
            is_active
        } = data

        await pool.query(
            `UPDATE users 
       SET first_name = ?, last_name = ?, email = ?, phone = ?, is_active = ?
       WHERE id = ? AND role = 'admin'`,
            [first_name, last_name, email, phone, is_active, id]
        )

        return NextResponse.json(
            { message: 'Admin updated successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to update admin' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'Admin ID is required' },
                { status: 400 }
            )
        }

        // Soft delete by setting is_active to false
        await pool.query(
            `UPDATE users SET is_active = FALSE WHERE id = ? AND role = 'admin'`,
            [id]
        )

        return NextResponse.json(
            { message: 'Admin deleted successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to delete admin' },
            { status: 500 }
        )
    }
}
