import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { resend } from '@/lib/email'
import BookingCancellationEmail from '@/emails/booking-cancellation'
import BookingRescheduleEmail from '@/emails/booking-reschedule'
import { formatPence } from '@/lib/types'
import { format } from 'date-fns'
import { isAdminRequest } from '@/lib/admin-auth'
import {
  createBookingCalendarAttachment,
  createBookingCalendarEvent,
  createGoogleCalendarUrl,
} from '@/lib/calendar'

export const dynamic = 'force-dynamic'

async function recordEmailResult(
  bookingId: string,
  emailType: string,
  recipient: string,
  subject: string,
  status: 'sent' | 'failed',
  errorMessage?: string
) {
  try {
    const sql = getDb()
    await sql`
      INSERT INTO email_logs (
        booking_id,
        email_type,
        recipient_email,
        subject,
        status,
        error_message
      )
      VALUES (
        ${bookingId},
        ${emailType},
        ${recipient},
        ${subject},
        ${status},
        ${errorMessage || null}
      )
    `
  } catch (error) {
    console.error(`Could not record ${emailType} email result:`, error)
  }
}

async function assertEmailSent(
  bookingId: string,
  emailType: string,
  recipient: string,
  subject: string,
  sendEmail: () => Promise<{ error: { message: string } | null }>
) {
  const response = await sendEmail()

  if (response.error) {
    await recordEmailResult(
      bookingId,
      emailType,
      recipient,
      subject,
      'failed',
      response.error.message
    )
    throw new Error(`Resend rejected ${emailType}: ${response.error.message}`)
  }

  await recordEmailResult(bookingId, emailType, recipient, subject, 'sent')
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  const sql = getDb()

  let bookings
  if (status && status !== 'all') {
    bookings = await sql`
      SELECT b.*, s.name as service_name, s.duration_minutes, s.price_pence
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.status = ${status}
      ORDER BY b.start_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
  } else {
    bookings = await sql`
      SELECT b.*, s.name as service_name, s.duration_minutes, s.price_pence
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      ORDER BY b.start_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
  }

  return NextResponse.json({ bookings })
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action, bookingId, newDate, newTime, reason } = body

    if (!action || !bookingId) {
      return NextResponse.json(
        { error: 'Missing required fields: action and bookingId' },
        { status: 400 }
      )
    }

    const sql = getDb()

    // Get booking details
    const bookingRows = await sql`
      SELECT b.*, s.name as service_name, s.duration_minutes, s.price_pence, s.deposit_pence
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.id = ${bookingId}
    `

    if (bookingRows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const booking = bookingRows[0]

    if (action === 'cancel') {
      // Cancel the booking
      const updatedRows = await sql`
        UPDATE bookings
        SET status = 'cancelled', updated_at = now()
        WHERE id = ${bookingId}
        RETURNING *
      `

      // Send cancellation email
      const startDate = new Date(booking.start_at)
      const formattedDate = format(startDate, 'EEEE, d MMMM yyyy')
      const formattedTime = format(startDate, 'HH:mm')
      const depositAmount = formatPence(booking.deposit_amount_pence ?? booking.deposit_pence ?? 0)
      const calendarEvent = createBookingCalendarEvent({
        bookingId,
        service: booking.service_name,
        customerName: booking.customer_name,
        startAt: booking.start_at,
        endAt: booking.end_at,
        durationMinutes: booking.duration_minutes,
      })
      const subject = 'Your Hauslash appointment has been cancelled'

      await assertEmailSent(
        bookingId,
        'booking_cancellation_customer',
        booking.customer_email,
        subject,
        () =>
          resend.emails.send({
            from: process.env.RESEND_FROM_ADDRESS || 'noreply@hauslash.co',
            to: booking.customer_email,
            replyTo: process.env.ADMIN_EMAIL || 'Hauslash@outlook.com',
            subject,
            attachments: [createBookingCalendarAttachment(calendarEvent, 'CANCEL')],
            react: BookingCancellationEmail({
              name: booking.customer_name,
              service: booking.service_name,
              date: formattedDate,
              time: formattedTime,
              depositAmount,
              reason: reason || null,
            }),
          })
      )

      return NextResponse.json({
        success: true,
        message: 'Booking cancelled and email sent',
        booking: updatedRows[0],
      })
    } else if (action === 'reschedule') {
      // Validate new date and time
      if (!newDate || !newTime) {
        return NextResponse.json(
          { error: 'Missing required fields for reschedule: newDate and newTime' },
          { status: 400 }
        )
      }

      const newStartAt = `${newDate}T${newTime}:00Z`
      const startMinutes =
        parseInt(newTime.split(':')[0]) * 60 + parseInt(newTime.split(':')[1])
      const endMinutes = startMinutes + (booking.duration_minutes || 60)
      const endH = String(Math.floor(endMinutes / 60)).padStart(2, '0')
      const endM = String(endMinutes % 60).padStart(2, '0')
      const newEndAt = `${newDate}T${endH}:${endM}:00Z`

      // Check for conflicts
      const conflicts = await sql`
        SELECT id FROM bookings
        WHERE start_at < ${newEndAt}::timestamptz
        AND end_at > ${newStartAt}::timestamptz
        AND status IN ('confirmed','pending_payment')
        AND id != ${bookingId}
        AND (status != 'pending_payment' OR expires_at > now())
      `

      if (conflicts.length > 0) {
        return NextResponse.json(
          { error: 'The new time slot is not available' },
          { status: 409 }
        )
      }

      // Update booking with new date/time
      const updatedRows = await sql`
        UPDATE bookings
        SET start_at = ${newStartAt}::timestamptz,
            end_at = ${newEndAt}::timestamptz,
            updated_at = now()
        WHERE id = ${bookingId}
        RETURNING *
      `

      // Send reschedule email
      const oldStartDate = new Date(booking.start_at)
      const oldFormattedDate = format(oldStartDate, 'EEEE, d MMMM yyyy')
      const oldFormattedTime = format(oldStartDate, 'HH:mm')

      const newStartDate = new Date(newStartAt)
      const newFormattedDate = format(newStartDate, 'EEEE, d MMMM yyyy')
      const newFormattedTime = format(newStartDate, 'HH:mm')
      const calendarEvent = createBookingCalendarEvent({
        bookingId,
        service: booking.service_name,
        customerName: booking.customer_name,
        startAt: newStartAt,
        endAt: newEndAt,
        durationMinutes: booking.duration_minutes,
      })
      const subject = 'Your Hauslash appointment has been rescheduled'

      await assertEmailSent(
        bookingId,
        'booking_reschedule_customer',
        booking.customer_email,
        subject,
        () =>
          resend.emails.send({
            from: process.env.RESEND_FROM_ADDRESS || 'noreply@hauslash.co',
            to: booking.customer_email,
            replyTo: process.env.ADMIN_EMAIL || 'Hauslash@outlook.com',
            subject,
            attachments: [createBookingCalendarAttachment(calendarEvent)],
            react: BookingRescheduleEmail({
              name: booking.customer_name,
              service: booking.service_name,
              oldDate: oldFormattedDate,
              oldTime: oldFormattedTime,
              newDate: newFormattedDate,
              newTime: newFormattedTime,
              reason: reason || null,
              calendarUrl: createGoogleCalendarUrl(calendarEvent),
            }),
          })
      )

      return NextResponse.json({
        success: true,
        message: 'Booking rescheduled and email sent',
        booking: updatedRows[0],
      })
    } else if (action === 'mark_complete') {
      const updatedRows = await sql`
        UPDATE bookings
        SET status = 'completed', updated_at = now()
        WHERE id = ${bookingId}
        RETURNING *
      `

      return NextResponse.json({
        success: true,
        message: 'Booking marked as complete',
        booking: updatedRows[0],
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be "cancel", "reschedule", or "mark_complete"' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error processing booking action:', error)
    return NextResponse.json(
      { error: 'Failed to process booking action' },
      { status: 500 }
    )
  }
}
