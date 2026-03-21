export interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  duration_minutes: number
  price_pence: number | null
  deposit_pence: number
  active: boolean
  sort_order: number
  created_at: string
}

export interface AvailabilityRule {
  id: string
  weekday: number
  start_time: string
  end_time: string
  buffer_minutes: number
}

export interface BlockedTime {
  id: string
  start_at: string
  end_at: string
  reason: string | null
}

export interface Booking {
  id: string
  service_id: string
  start_at: string
  end_at: string
  customer_name: string
  customer_email: string
  customer_phone: string
  notes: string | null
  status: 'pending_payment' | 'confirmed' | 'cancelled' | 'completed' | 'refunded'
  stripe_checkout_session_id: string | null
  deposit_amount_pence: number
  created_at: string
  updated_at: string
  expires_at: string | null
}

export interface TimeSlot {
  start: string
  end: string
  available: boolean
}

export interface AvailabilitySlot {
  id: string
  start_at: string
  end_at: string
  max_capacity: number
  current_bookings: number
  created_at: string
  updated_at: string
}

export interface CustomerProfile {
  id: string
  email: string
  name: string
  phone: string | null
  total_visited: number
  last_visited: string | null
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  customer_id: string | null
  customer_name: string
  service_id: string | null
  rating: number
  review_text: string
  featured: boolean
  verified_booking: boolean
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export function formatPence(pence: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(pence / 100)
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hrs} hr`
  return `${hrs} hr ${mins} min`
}
