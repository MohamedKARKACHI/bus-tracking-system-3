import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const query = `
      SELECT 
        b.id,
        b.bus_number,
        b.plate_number,
        b.capacity,
        b.status,
        b.current_latitude,
        b.current_longitude,
        b.last_updated,
        r.id as route_id,
        r.name as route_name,
        r.route_number,
        r.color as route_color,
        d.first_name as driver_first_name,
        d.last_name as driver_last_name
      FROM buses b
      LEFT JOIN routes r ON b.route_id = r.id
      LEFT JOIN drivers d ON b.driver_id = d.id
      WHERE b.is_active = TRUE AND b.status = 'active'
      ORDER BY b.bus_number
    `

        const [rows] = await pool.query(query)

        // Transform data for map display
        const buses = (rows as any[]).map(bus => ({
            id: bus.id,
            busNumber: bus.bus_number,
            plateNumber: bus.plate_number,
            capacity: bus.capacity,
            status: bus.status,
            coordinates: [
                bus.current_longitude || -7.9811,
                bus.current_latitude || 31.6695
            ],
            route: {
                id: bus.route_id,
                name: bus.route_name,
                number: bus.route_number,
                color: bus.route_color || '#3b82f6'
            },
            driver: bus.driver_first_name ? {
                firstName: bus.driver_first_name,
                lastName: bus.driver_last_name
            } : null,
            lastUpdated: bus.last_updated
        }))

        return NextResponse.json(buses)
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch live bus data' },
            { status: 500 }
        )
    }
}
