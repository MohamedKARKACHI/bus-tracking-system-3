import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

// This endpoint seeds demo users for testing
export async function POST(request: NextRequest) {
    try {
        console.log('🌱 Seeding demo users...')

        // Hash passwords
        const adminHash = await bcrypt.hash('admin123', 10)
        const driverHash = await bcrypt.hash('driver123', 10)
        const clientHash = await bcrypt.hash('client123', 10)

        // Create or update demo users
        const users = [
            {
                email: 'admin@bustrack.com',
                password: adminHash,
                first_name: 'Admin',
                last_name: 'User',
                role: 'admin',
                phone: '+212600000001'
            },
            {
                email: 'driver@bustrack.com',
                password: driverHash,
                first_name: 'Driver',
                last_name: 'User',
                role: 'driver',
                phone: '+212600000002'
            },
            {
                email: 'client@bustrack.com',
                password: clientHash,
                first_name: 'Client',
                last_name: 'User',
                role: 'client',
                phone: '+212600000003'
            }
        ]

        const results = []

        for (const user of users) {
            // Check if user exists
            const [existing]: any = await pool.query(
                'SELECT id FROM users WHERE email = ?',
                [user.email]
            )

            if (existing.length > 0) {
                // Update existing user
                await pool.query(
                    `UPDATE users SET 
            password = ?, 
            first_name = ?, 
            last_name = ?, 
            role = ?, 
            is_active = TRUE 
          WHERE email = ?`,
                    [user.password, user.first_name, user.last_name, user.role, user.email]
                )
                results.push({ email: user.email, status: 'updated' })
                console.log(`✅ Updated user: ${user.email}`)
            } else {
                // Insert new user
                await pool.query(
                    `INSERT INTO users (email, password, first_name, last_name, role, phone, is_active, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, TRUE, NOW())`,
                    [user.email, user.password, user.first_name, user.last_name, user.role, user.phone]
                )
                results.push({ email: user.email, status: 'created' })
                console.log(`✅ Created user: ${user.email}`)
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Demo users seeded successfully',
            users: results,
            credentials: [
                { role: 'admin', email: 'admin@bustrack.com', password: 'admin123' },
                { role: 'driver', email: 'driver@bustrack.com', password: 'driver123' },
                { role: 'client', email: 'client@bustrack.com', password: 'client123' }
            ]
        })

    } catch (error: any) {
        console.error('❌ Seed error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to seed users' },
            { status: 500 }
        )
    }
}

// GET endpoint to check if demo users exist
export async function GET() {
    try {
        const [users]: any = await pool.query(
            `SELECT email, role, is_active, created_at 
       FROM users 
       WHERE email IN ('admin@bustrack.com', 'driver@bustrack.com', 'client@bustrack.com')`
        )

        return NextResponse.json({
            exists: users.length === 3,
            count: users.length,
            users: users,
            hint: 'POST to this endpoint to seed demo users'
        })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
