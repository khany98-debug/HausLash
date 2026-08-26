import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { resend } from '@/lib/email'
import AppointmentReminderEmail from '@/emails/appointment-reminder'
import { isAdminRequest, isCronOrAdminRequest } from '@/lib/admin-auth'
import { formatAppointmentDate, formatAppointmentTime } from '@/lib/appointment-time'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (!isCronOrAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sql = getDb()
    const fromAddress = process.env.RESEND_FROM_ADDRESS || 'noreply@hauslash.co'
    const replyTo = process.env.ADMIN_EMAIL || 'Hauslash@outlook.com'

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

    for (const reminder of reminders24h) {
      try {
        const formattedDate = formatAppointmentDate(reminder.start_at)
        const formattedTime = formatAppointmentTime(reminder.start_at)

        await resend.emails.send({
          from: fromAddress,
          to: reminder.customer_email,
          replyTo,
          subject: 'Appointment Reminder - HausLash',
          react: AppointmentReminderEmail({
            name: reminder.customer_name,
            service: reminder.service_name,
            date: formattedDate,
            time: formattedTime,
            reminderType: '24h',
          }),
        })

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

    for (const reminder of reminders1h) {
      try {
        const formattedDate = formatAppointmentDate(reminder.start_at)
        const formattedTime = formatAppointmentTime(reminder.start_at)

        await resend.emails.send({
          from: fromAddress,
          to: reminder.customer_email,
          replyTo,
          subject: 'Your Appointment is Coming Up - HausLash',
          react: AppointmentReminderEmail({
            name: reminder.customer_name,
            service: reminder.service_name,
            date: formattedDate,
            time: formattedTime,
            reminderType: '1h',
          }),
        })

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

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
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
