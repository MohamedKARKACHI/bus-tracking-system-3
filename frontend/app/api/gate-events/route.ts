import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS gate_events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bus_id INT NULL,
      driver_id INT NULL,
      plate_number VARCHAR(50) NOT NULL,
      event_type ENUM('check_in','check_out') NOT NULL,
      confidence DECIMAL(5,2) NULL,
      source ENUM('camera','upload','simulation','websocket') DEFAULT 'camera',
      detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_event_type (event_type),
      INDEX idx_plate_number (plate_number),
      INDEX idx_detected_at (detected_at),
      CONSTRAINT fk_gate_events_bus FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE SET NULL,
      CONSTRAINT fk_gate_events_driver FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)
}

type EventType = 'check_in' | 'check_out'

function normalizePlate(plate: string): string {
  if (!plate) return ''
  // Common formats: "12345 | أ | 27" or "12345-أ-27"
  const trimmed = plate.trim()
  // Replace pipes and spaces with hyphens, collapse repeated hyphens
  const unified = trimmed
    .replace(/\|/g, '-')
    .replace(/\s+/g, '')
    .replace(/-+/g, '-')
  return unified
}

export async function GET(request: NextRequest) {
  try {
    await ensureTable()
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200)

    const [rows] = await pool.query(
      `SELECT ge.*, b.bus_number, b.plate_number as bus_plate,
              u.first_name, u.last_name
       FROM gate_events ge
       LEFT JOIN buses b ON ge.bus_id = b.id
       LEFT JOIN drivers d ON ge.driver_id = d.id
       LEFT JOIN users u ON d.user_id = u.id
       ORDER BY ge.detected_at DESC
       LIMIT ?`,
      [limit]
    )

    return NextResponse.json({ events: rows })
  } catch (error) {
    console.error('Gate events GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch gate events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTable()
    const body = await request.json()
    // Accepts either specific fields or a generic detection payload
    const {
      plate,
      plate_text,
      formatted,
      event_type,
      confidence,
      detected_at,
      source = 'camera',
    } = body || {}

    const type: EventType | undefined = event_type
    if (!type || (type !== 'check_in' && type !== 'check_out')) {
      return NextResponse.json({ error: 'event_type must be check_in or check_out' }, { status: 400 })
    }

    const rawPlate: string = plate || plate_text || formatted
    if (!rawPlate) {
      return NextResponse.json({ error: 'plate is required' }, { status: 400 })
    }

    const norm = normalizePlate(rawPlate)

    // Try to find a bus by exact plate_number or relaxed comparisons
    const [buses]: any = await pool.query(
      `SELECT id, plate_number FROM buses
       WHERE REPLACE(REPLACE(plate_number, ' ', ''), '|', '-') = ?
          OR plate_number = ?
          OR REPLACE(plate_number, ' ', '') = ?
       LIMIT 1`,
      [norm, norm, norm]
    )

    const bus = buses[0] || null
    let driverId: number | null = null

    if (bus) {
      // Optionally find current driver assigned to this bus
      const [drivers]: any = await pool.query(
        `SELECT current_driver_id AS driver_id FROM buses WHERE id = ?`,
        [bus.id]
      )
      if (drivers && drivers[0] && drivers[0].driver_id) {
        driverId = drivers[0].driver_id
      }
    }

    const [result]: any = await pool.query(
      `INSERT INTO gate_events (bus_id, driver_id, plate_number, event_type, confidence, source, detected_at)
       VALUES (?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))`,
      [bus ? bus.id : null, driverId, norm, type, confidence ?? null, source, detected_at || null]
    )

    return NextResponse.json({
      id: result.insertId,
      bus_id: bus ? bus.id : null,
      driver_id: driverId,
      plate_number: norm,
      event_type: type,
      confidence: confidence ?? null,
      source,
      detected_at: detected_at || new Date().toISOString(),
      matched: !!bus,
    }, { status: 201 })
  } catch (error) {
    console.error('Gate events POST error:', error)
    return NextResponse.json({ error: (error as any).message || 'Failed to create gate event' }, { status: 500 })
  }
}
