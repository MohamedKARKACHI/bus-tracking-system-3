export interface User {
  id: number
  email: string
  password: string
  role: 'admin' | 'driver' | 'client'
  first_name: string
  last_name: string
  phone: string | null
  created_at: Date
  updated_at: Date
  is_active: boolean
}

export interface Driver {
  id: number
  user_id: number
  license_number: string
  license_expiry: Date
  status: 'available' | 'on_duty' | 'off_duty' | 'on_leave'
  rating: number
  total_trips: number
  created_at: Date
  updated_at: Date
}

export interface Bus {
  id: number
  bus_number: string
  plate_number: string
  model: string
  capacity: number
  year: number
  status: 'active' | 'maintenance' | 'out_of_service'
  last_maintenance: Date | null
  next_maintenance: Date | null
  fuel_type: 'diesel' | 'electric' | 'hybrid' | 'cng'
  current_driver_id: number | null
  created_at: Date
  updated_at: Date
}

export interface Route {
  id: number
  route_number: string
  name: string
  start_location: string
  end_location: string
  distance_km: number | null
  estimated_duration_minutes: number | null
  status: 'active' | 'inactive' | 'suspended'
  fare: number
  created_at: Date
  updated_at: Date
}

export interface RouteStop {
  id: number
  route_id: number
  stop_name: string
  stop_order: number
  latitude: number
  longitude: number
  estimated_arrival_time: string | null
}

export interface Schedule {
  id: number
  route_id: number
  bus_id: number
  driver_id: number
  departure_time: Date
  arrival_time: Date
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  actual_departure_time: Date | null
  actual_arrival_time: Date | null
  created_at: Date
  updated_at: Date
}

export interface Ticket {
  id: number
  ticket_number: string
  user_id: number
  schedule_id: number
  seat_number: string | null
  boarding_stop_id: number
  destination_stop_id: number
  fare: number
  status: 'booked' | 'confirmed' | 'cancelled' | 'used'
  booking_date: Date
  payment_status: 'pending' | 'paid' | 'refunded'
  payment_method: 'cash' | 'card' | 'mobile' | 'wallet'
  qr_code: string | null
}

export interface GPSTracking {
  id: number
  bus_id: number
  schedule_id: number | null
  latitude: number
  longitude: number
  speed: number | null
  heading: number | null
  altitude: number | null
  timestamp: Date
}

export interface Payment {
  id: number
  ticket_id: number
  amount: number
  payment_method: 'cash' | 'card' | 'mobile' | 'wallet'
  transaction_id: string | null
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_date: Date
}

export interface Incident {
  id: number
  bus_id: number
  driver_id: number
  schedule_id: number | null
  incident_type: 'accident' | 'breakdown' | 'delay' | 'other'
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'reported' | 'investigating' | 'resolved' | 'closed'
  reported_at: Date
  resolved_at: Date | null
}

export interface Camera {
  id: number
  bus_id: number
  camera_type: 'front' | 'rear' | 'interior' | 'side'
  camera_url: string
  status: 'active' | 'inactive' | 'maintenance'
  installed_date: Date | null
  last_maintenance: Date | null
  created_at: Date
}

export interface Message {
  id: number
  sender_id: number
  receiver_id: number
  subject: string | null
  message: string
  is_read: boolean
  sent_at: Date
}

export interface PerformanceMetrics {
  id: number
  driver_id: number
  schedule_id: number
  on_time_performance: number | null
  fuel_efficiency: number | null
  safety_score: number | null
  customer_rating: number | null
  date: Date
}
