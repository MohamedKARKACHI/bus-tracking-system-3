import { NextRequest, NextResponse } from 'next/server'

/**
 * Fetch bus stops from OpenStreetMap using Overpass API
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const city = searchParams.get('city') || 'Marrakech'
        const lat = parseFloat(searchParams.get('lat') || '31.6295')
        const lon = parseFloat(searchParams.get('lon') || '-7.9811')
        const radius = parseInt(searchParams.get('radius') || '5000') // meters

        // Overpass API endpoint
        const overpassUrl = 'https://overpass-api.de/api/interpreter'

        // Query to get bus stops around a location
        const query = `
      [out:json][timeout:25];
      (
        node["highway"="bus_stop"](around:${radius},${lat},${lon});
        node["public_transport"="platform"]["bus"="yes"](around:${radius},${lat},${lon});
        node["public_transport"="stop_position"]["bus"="yes"](around:${radius},${lat},${lon});
      );
      out body;
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

        // Process stops
        const stops = data.elements.map((element: any) => ({
            id: element.id,
            name: element.tags?.name || element.tags?.ref || 'Unnamed Stop',
            ref: element.tags?.ref || '',
            operator: element.tags?.operator || '',
            network: element.tags?.network || '',
            coordinates: [element.lon, element.lat],
            shelter: element.tags?.shelter === 'yes',
            bench: element.tags?.bench === 'yes',
            type: element.tags?.public_transport || 'bus_stop'
        }))

        return NextResponse.json({
            success: true,
            city,
            center: { lat, lon },
            radius,
            stopCount: stops.length,
            stops
        })
    } catch (error) {
        console.error('Error fetching OSM stops:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch bus stops from OpenStreetMap',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
