import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { resend } from '@/lib/email'
import AppointmentReminderEmail from '@/emails/appointment-reminder'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const sql = getDb()

    // Get current time
    const now = new Date()
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000)
    const in25Hours = new Date(now.getTime() + 25 * 60 * 60 * 1000)

    // Find 24h reminders to send (appointment is between now+23h and now+25h)
    const reminders24h = await sql`
      SELECT 
        ar.id,
        ar.booking_id,
        b.customer_name,
        b.customer_email,
        b.start_at,
        s.name as service_name
      FROM appointment_reminders ar
      JOIN bookings b ON ar.booking_id = b.id
      JOIN services s ON b.service_id = s.id
      WHERE ar.reminder_type = '24h'
      AND ar.sent_at IS NULL
      AND ar.scheduled_for <= now()
      AND b.status = 'confirmed'
      LIMIT 50
    `

    // Find 1h reminders to send (appointment is between now and now+1h)
    const reminders1h = await sql`
      SELECT 
        ar.id,
        ar.booking_id,
        b.customer_name,
        b.customer_email,
        b.start_at,
        s.name as service_name
      FROM appointment_reminders ar
      JOIN bookings b ON ar.booking_id = b.id
      JOIN services s ON b.service_id = s.id
      WHERE ar.reminder_type = '1h'
      AND ar.sent_at IS NULL
      AND ar.scheduled_for <= now()
      AND b.status = 'confirmed'
      LIMIT 50
    `

    let sentCount = 0
    let failedCount = 0

    // Send 24h reminders
    for (const reminder of reminders24h) {
      try {
        const appointmentDate = new Date(reminder.start_at)
        const formattedDate = format(appointmentDate, 'EEEE, d MMMM yyyy')
        const formattedTime = format(appointmentDate, 'HH:mm')

        await resend.emails.send({
          from: 'noreply@hauslash.co',
          to: reminder.customer_email,
          subject: 'Appointment Reminder - HausLash',
          react: AppointmentReminderEmail({
            name: reminder.customer_name,
            service: reminder.service_name,
            date: formattedDate,
            time: formattedTime,
            reminderType: '24h',
          }),
        })

        // Mark as sent
        await sql`
          UPDATE appointment_reminders
          SET sent_at = now()
          WHERE id = ${reminder.id}
        `

        sentCount++
      } catch (error) {
        console.error(`Failed to send 24h reminder for booking ${reminder.booking_id}:`, error)
        failedCount++
      }
    }

    // Send 1h reminders
    for (const reminder of reminders1h) {
      try {
        const appointmentDate = new Date(reminder.start_at)
        const formattedDate = format(appointmentDate, 'EEEE, d MMMM yyyy')
        const formattedTime = format(appointmentDate, 'HH:mm')

        await resend.emails.send({
          from: 'noreply@hauslash.co',
          to: reminder.customer_email,
          subject: 'Your Appointment is Coming Up - HausLash',
          react: AppointmentReminderEmail({
            name: reminder.customer_name,
            service: reminder.service_name,
            date: formattedDate,
            time: formattedTime,
            reminderType: '1h',
          }),
        })

        // Mark as sent
        await sql`
          UPDATE appointment_reminders
          SET sent_at = now()
          WHERE id = ${reminder.id}
        `

        sentCount++
      } catch (error) {
        console.error(`Failed to send 1h reminder for booking ${reminder.booking_id}:`, error)
        failedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${sentCount} reminders, ${failedCount} failed`,
      details: {
        sent: sentCount,
        failed: failedCount,
        total24h: reminders24h.length,
        total1h: reminders1h.length,
      },
    })
  } catch (error) {
    console.error('Error processing reminders:', error)
    return NextResponse.json(
      { error: 'Failed to process reminders' },
      { status: 500 }
    )
  }
}

// GET endpoint to check reminder status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminToken = searchParams.get('token')

    // Basic admin auth
    if (adminToken !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sql = getDb()

    const pendingReminders = await sql`
      SELECT 
        ar.id,
        ar.reminder_type,
        ar.scheduled_for,
        b.customer_name,
        b.customer_email,
        b.start_at
      FROM appointment_reminders ar
      JOIN bookings b ON ar.booking_id = b.id
      WHERE ar.sent_at IS NULL
      AND b.status = 'confirmed'
      ORDER BY ar.scheduled_for ASC
      LIMIT 20
    `

    const recentlySent = await sql`
      SELECT 
        ar.id,
        ar.reminder_type,
        ar.sent_at,
        b.customer_name,
        b.start_at
      FROM appointment_reminders ar
      JOIN bookings b ON ar.booking_id = b.id
      WHERE ar.sent_at IS NOT NULL
      AND ar.sent_at > now() - interval '24 hours'
      ORDER BY ar.sent_at DESC
      LIMIT 20
    `

    return NextResponse.json({
      pending: pendingReminders,
      recentlySent: recentlySent,
    })
  } catch (error) {
    console.error('Error fetching reminder status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reminder status' },
      { status: 500 }
    )
  }
}
