import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return false
  const token = authHeader.replace('Bearer ', '')
  return token === (process.env.ADMIN_PASSWORD || 'admin123')
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const period = parseInt(searchParams.get('period') || '30', 10) // days

    const sql = getDb()

    // Total Revenue
    const revenueData = await sql`
      SELECT 
        SUM(deposit_amount_pence) as total_deposits,
        COUNT(*) as total_bookings
      FROM bookings
      WHERE status IN ('confirmed', 'completed')
      AND created_at > now() - make_interval(days => ${period})
    `

    // Booking Status Breakdown
    const statusBreakdown = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM bookings
      WHERE created_at > now() - make_interval(days => ${period})
      GROUP BY status
      ORDER BY count DESC
    `

    // Popular Services
    const popularServices = await sql`
      SELECT 
        s.name,
        s.id,
        COUNT(b.id) as booking_count,
        SUM(b.deposit_amount_pence) as total_revenue
      FROM services s
      LEFT JOIN bookings b ON s.id = b.service_id 
        AND b.status IN ('confirmed', 'completed')
        AND b.created_at > now() - make_interval(days => ${period})
      WHERE s.active = true
      GROUP BY s.id, s.name
      ORDER BY booking_count DESC
    `

    // Booking Trends by Day
    const trends = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as bookings,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM bookings
      WHERE created_at > now() - make_interval(days => ${period})
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `

    // Upcoming Appointments
    const upcomingAppointments = await sql`
      SELECT 
        b.id,
        b.customer_name,
        b.customer_email,
        b.start_at,
        s.name as service_name,
        b.deposit_amount_pence
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.status = 'confirmed'
      AND b.start_at > now()
      ORDER BY b.start_at ASC
      LIMIT 10
    `

    const totalRevenue = revenueData[0]?.total_deposits || 0
    const totalBookings = revenueData[0]?.total_bookings || 0

    return NextResponse.json({
      period,
      summary: {
        totalRevenue,
        totalBookings,
        averageRevenue: totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0,
      },
      statusBreakdown,
      popularServices,
      trends,
      upcomingAppointments,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
