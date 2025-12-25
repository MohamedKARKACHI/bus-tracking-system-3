import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('user_id')
        const startDate = searchParams.get('start_date')
        const endDate = searchParams.get('end_date')

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        let query = `
      SELECT 
        tr.*,
        t.ticket_number,
        r.name as route_name
      FROM transactions tr
      LEFT JOIN tickets t ON tr.ticket_id = t.id
      LEFT JOIN routes r ON t.route_id = r.id
      WHERE tr.user_id = ?
    `

        const params: any[] = [userId]

        if (startDate) {
            query += ' AND tr.transaction_date >= ?'
            params.push(startDate)
        }

        if (endDate) {
            query += ' AND tr.transaction_date <= ?'
            params.push(endDate)
        }

        query += ' ORDER BY tr.transaction_date DESC'

        const [rows] = await pool.query(query, params)

        return NextResponse.json(rows)
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        )
    }
}
