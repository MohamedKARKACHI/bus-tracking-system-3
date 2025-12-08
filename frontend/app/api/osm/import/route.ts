import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

/**
 * Import OpenStreetMap bus routes into the database
 * This endpoint fetches data from OSM and saves it to your database
 */
export async function POST(request: NextRequest) {
    try {
        const { city, country } = await request.json()

        // Fetch routes from OSM
        const osmResponse = await fetch(
            `${request.nextUrl.origin}/api/osm/routes?city=${encodeURIComponent(city || 'Marrakech')}&country=${encodeURIComponent(country || 'Morocco')}`
        )

        if (!osmResponse.ok) {
            throw new Error('Failed to fetch OSM data')
        }

        const osmData = await osmResponse.json()

        if (!osmData.success || !osmData.routes) {
            throw new Error('Invalid OSM data received')
        }

        const connection = await pool.getConnection()
        const importedRoutes: any[] = []
        const importedStops: any[] = []

        try {
            await connection.beginTransaction()

            // Import each route
            for (const route of osmData.routes) {
                // Insert route
                const [routeResult]: any = await connection.query(
                    `INSERT INTO routes (name, route_number, description, color, is_active, created_at)
           VALUES (?, ?, ?, ?, TRUE, NOW())
           ON DUPLICATE KEY UPDATE 
           name = VALUES(name),
           color = VALUES(color),
           description = VALUES(description)`,
                    [
                        route.name,
                        route.ref || route.name,
                        `${route.from ? 'From: ' + route.from : ''} ${route.to ? 'To: ' + route.to : ''} (Imported from OSM)`.trim(),
                        route.color
                    ]
                )

                const routeId = routeResult.insertId || routeResult.affectedRows

                // Import stops for this route
                let stopOrder = 1
                for (const stop of route.stops) {
                    const [stopResult]: any = await connection.query(
                        `INSERT INTO route_stops (route_id, stop_name, latitude, longitude, stop_order, is_active, created_at)
             VALUES (?, ?, ?, ?, ?, TRUE, NOW())`,
                        [
                            routeId,
                            stop.name,
                            stop.coordinates[1], // latitude
                            stop.coordinates[0], // longitude
                            stopOrder++
                        ]
                    )

                    importedStops.push({
                        id: stopResult.insertId,
                        name: stop.name,
                        routeId
                    })
                }

                importedRoutes.push({
                    id: routeId,
                    name: route.name,
                    ref: route.ref,
                    stopCount: route.stops.length
                })
            }

            await connection.commit()
            connection.release()

            return NextResponse.json({
                success: true,
                message: 'Successfully imported OSM data',
                imported: {
                    routes: importedRoutes.length,
                    stops: importedStops.length
                },
                data: {
                    routes: importedRoutes,
                    stops: importedStops
                }
            })
        } catch (error) {
            await connection.rollback()
            connection.release()
            throw error
        }
    } catch (error) {
        console.error('Error importing OSM data:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to import OSM data to database',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

/**
 * Get import status and statistics
 */
export async function GET(request: NextRequest) {
    try {
        const [routeCount]: any = await pool.query(
            'SELECT COUNT(*) as count FROM routes WHERE is_active = TRUE'
        )

        const [stopCount]: any = await pool.query(
            'SELECT COUNT(*) as count FROM route_stops WHERE is_active = TRUE'
        )

        return NextResponse.json({
            success: true,
            statistics: {
                totalRoutes: routeCount[0]?.count || 0,
                totalStops: stopCount[0]?.count || 0
            }
        })
    } catch (error) {
        console.error('Error fetching statistics:', error)
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        )
    }
}
