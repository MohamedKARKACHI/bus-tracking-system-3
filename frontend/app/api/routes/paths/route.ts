import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const query = `
      SELECT 
        r.id,
        r.name,
        r.route_number,
        r.color,
        r.description,
        GROUP_CONCAT(
          CONCAT(rs.latitude, ',', rs.longitude)
          ORDER BY rs.stop_order
          SEPARATOR ';'
        ) as coordinates
      FROM routes r
      LEFT JOIN route_stops rs ON r.id = rs.route_id AND rs.is_active = TRUE
      WHERE r.is_active = TRUE
      GROUP BY r.id, r.name, r.route_number, r.color, r.description
      ORDER BY r.route_number
    `

        const [rows] = await pool.query(query)

        // Transform data for map display
        const routes = (rows as any[]).map(route => {
            // Parse coordinates from concatenated string
            const coords = route.coordinates
                ? route.coordinates.split(';').map((coord: string) => {
                    const [lat, lng] = coord.split(',').map(Number)
                    return [lng, lat] // GeoJSON format: [longitude, latitude]
                })
                : []

            return {
                id: route.id,
                name: route.name,
                routeNumber: route.route_number,
                color: route.color || '#3b82f6',
                description: route.description,
                coordinates: coords
            }
        })

        return NextResponse.json(routes)
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch route paths' },
            { status: 500 }
        )
    }
}
