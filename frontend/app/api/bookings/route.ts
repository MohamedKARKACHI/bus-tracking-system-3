import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend } from '@/lib/api-proxy'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Proxy to backend's create booking endpoint
    // Backend path is /api/bookings/bookings based on server.ts and booking.routes.ts
    const response = await proxyToBackend('/api/bookings/bookings', {
      method: 'POST',
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Proxy to backend's search routes endpoint if query params exist
  // or list routes
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  
  if (from) {
     const response = await proxyToBackend(`/api/bookings/routes/search?${searchParams.toString()}`)
     const data = await response.json()
     return NextResponse.json(data, { status: response.status })
  }

  const response = await proxyToBackend('/api/bookings/routes')
  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}
