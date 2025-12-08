import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const query = `
      SELECT 
        rs.id,
        rs.stop_name,
        rs.latitude,
        rs.longitude,
        rs.stop_order,
        rs.is_active,
        r.id as route_id,
        r.name as route_name,
        r.route_number,
        r.color as route_color
      FROM route_stops rs
      INNER JOIN routes r ON rs.route_id = r.id
      WHERE rs.is_active = TRUE AND r.is_active = TRUE
      ORDER BY r.route_number, rs.stop_order
    `

        const [rows] = await pool.query(query)

        // Transform data for map display
        const stops = (rows as any[]).map(stop => ({
            id: stop.id,
            name: stop.stop_name,
            coordinates: [stop.longitude, stop.latitude],
            stopOrder: stop.stop_order,
            route: {
                id: stop.route_id,
                name: stop.route_name,
                number: stop.route_number,
                color: stop.route_color || '#3b82f6'
            }
        }))

        return NextResponse.json(stops)
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch route stops' },
            { status: 500 }
        )
    }
}
