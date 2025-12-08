import { NextRequest, NextResponse } from 'next/server'

/**
 * Fetch bus routes from OpenStreetMap using Overpass API
 * This fetches real bus route data for a given area
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const city = searchParams.get('city') || 'Marrakech'
        const country = searchParams.get('country') || 'Morocco'

        // Overpass API endpoint
        const overpassUrl = 'https://overpass-api.de/api/interpreter'

        // Overpass QL query to get bus routes
        // This fetches all bus routes in the specified area
        const query = `
      [out:json][timeout:25];
      area["name"="${city}"]["admin_level"~"[4-8]"]->.searchArea;
      (
        relation["type"="route"]["route"="bus"](area.searchArea);
      );
      out body;
      >;
      out skel qt;
    `

        const response = await fetch(overpassUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `data=${encodeURIComponent(query)}`
        })

        if (!response.ok) {
            throw new Error('Failed to fetch from Overpass API')
        }

        const data = await response.json()

        // Process the data
        const routes = processOverpassData(data)

        return NextResponse.json({
            success: true,
            city,
            country,
            routeCount: routes.length,
            routes
        })
    } catch (error) {
        console.error('Error fetching OSM data:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch bus routes from OpenStreetMap',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

/**
 * Process Overpass API response to extract route information
 */
function processOverpassData(data: any) {
    const routes: any[] = []
    const nodes: Map<number, { lat: number; lon: number }> = new Map()
    const ways: Map<number, number[]> = new Map()

    // First pass: collect all nodes and ways
    data.elements.forEach((element: any) => {
        if (element.type === 'node') {
            nodes.set(element.id, { lat: element.lat, lon: element.lon })
        } else if (element.type === 'way') {
            ways.set(element.id, element.nodes)
        }
    })

    // Second pass: process relations (routes)
    data.elements.forEach((element: any) => {
        if (element.type === 'relation' && element.tags?.route === 'bus') {
            const route = {
                id: element.id,
                name: element.tags.name || element.tags.ref || 'Unnamed Route',
                ref: element.tags.ref || '',
                operator: element.tags.operator || '',
                network: element.tags.network || '',
                from: element.tags.from || '',
                to: element.tags.to || '',
                color: element.tags.colour || element.tags.color || generateRandomColor(),
                coordinates: [] as [number, number][],
                stops: [] as { name: string; coordinates: [number, number] }[]
            }

            // Extract route path from members
            element.members?.forEach((member: any) => {
                if (member.type === 'way' && member.role !== 'platform') {
                    const wayNodes = ways.get(member.ref)
                    if (wayNodes) {
                        wayNodes.forEach((nodeId: number) => {
                            const node = nodes.get(nodeId)
                            if (node) {
                                route.coordinates.push([node.lon, node.lat])
                            }
                        })
                    }
                } else if (member.type === 'node' && member.role === 'stop') {
                    const node = nodes.get(member.ref)
                    if (node) {
                        route.stops.push({
                            name: element.tags?.name || 'Stop',
                            coordinates: [node.lon, node.lat]
                        })
                    }
                }
            })

            // Only add routes with valid coordinates
            if (route.coordinates.length > 0) {
                routes.push(route)
            }
        }
    })

    return routes
}

/**
 * Generate a random color for routes without a specified color
 */
function generateRandomColor(): string {
    const colors = [
        '#3b82f6', // blue
        '#22c55e', // green
        '#ef4444', // red
        '#f59e0b', // orange
        '#8b5cf6', // purple
        '#06b6d4', // cyan
        '#ec4899', // pink
        '#10b981', // emerald
    ]
    return colors[Math.floor(Math.random() * colors.length)]
}
