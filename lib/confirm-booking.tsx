import 'server-only'

import AdminBookingNotificationEmail from '@/emails/admin-booking-notification'
import BookingConfirmationEmail from '@/emails/booking-confirmation'
import {
  createBookingCalendarAttachment,
  createBookingCalendarEvent,
  createGoogleCalendarUrl,
} from '@/lib/calendar'
import { getDb } from '@/lib/db'
import { resend } from '@/lib/email'
import { stripe } from '@/lib/stripe'
import { formatPence } from '@/lib/types'
import { formatAppointmentDate, formatAppointmentTime } from '@/lib/appointment-time'

type BookingDetails = {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  notes: string | null
  start_at: string
  end_at: string | null
  service_name: string
  duration_minutes: number | null
  price_pence: number | null
  deposit_amount_pence: number
}

type ConfirmationResult = {
  booking: BookingDetails | null
  confirmed: boolean
  customerEmailSent: boolean
}

async function hasSuccessfulEmailLog(
  bookingId: string,
  emailType: string
): Promise<boolean> {
  try {
    const sql = getDb()
    const rows = await sql`
      SELECT id
      FROM email_logs
      WHERE booking_id = ${bookingId}
      AND email_type = ${emailType}
      AND status = 'sent'
      LIMIT 1
    `

    return rows.length > 0
  } catch (error) {
    console.error(`Could not check ${emailType} email log:`, error)
    return false
  }
}

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

async function sendCustomerEmail(booking: BookingDetails) {
  const emailType = 'booking_confirmation_customer'
  const subject = 'Your HausLash appointment is confirmed'

  if (await hasSuccessfulEmailLog(booking.id, emailType)) {
    return true
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  const depositPence = booking.deposit_amount_pence
  const remainingPence = booking.price_pence
    ? booking.price_pence - depositPence
    : null
  const calendarEvent = createBookingCalendarEvent({
    bookingId: booking.id,
    service: booking.service_name,
    customerName: booking.customer_name,
    startAt: booking.start_at,
    endAt: booking.end_at,
    durationMinutes: booking.duration_minutes,
  })

  const response = await resend.emails.send({
    from: process.env.RESEND_FROM_ADDRESS || 'noreply@hauslash.co',
    to: booking.customer_email,
    replyTo: process.env.ADMIN_EMAIL || 'Hauslash@outlook.com',
    subject,
    attachments: [createBookingCalendarAttachment(calendarEvent)],
    react: BookingConfirmationEmail({
      name: booking.customer_name,
      service: booking.service_name,
      date: formatAppointmentDate(booking.start_at),
      time: formatAppointmentTime(booking.start_at),
      deposit: formatPence(depositPence),
      remaining: remainingPence ? formatPence(remainingPence) : null,
      calendarUrl: createGoogleCalendarUrl(calendarEvent),
    }),
  })

  if (response.error) {
    await recordEmailResult(
      booking.id,
      emailType,
      booking.customer_email,
      subject,
      'failed',
      response.error.message
    )
    throw new Error(`Resend rejected customer confirmation: ${response.error.message}`)
  }

  await recordEmailResult(
    booking.id,
    emailType,
    booking.customer_email,
    subject,
    'sent'
  )

  return true
}

async function sendAdminEmail(booking: BookingDetails) {
  const emailType = 'booking_confirmation_admin'
  const subject = 'New HausLash booking'
  const recipient = process.env.ADMIN_EMAIL || 'Hauslash@outlook.com'

  if (await hasSuccessfulEmailLog(booking.id, emailType)) {
    return
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  const depositPence = booking.deposit_amount_pence
  const remainingPence = booking.price_pence
    ? booking.price_pence - depositPence
    : null
  const calendarEvent = createBookingCalendarEvent({
    bookingId: booking.id,
    service: booking.service_name,
    customerName: booking.customer_name,
    startAt: booking.start_at,
    endAt: booking.end_at,
    durationMinutes: booking.duration_minutes,
  })

  const response = await resend.emails.send({
    from: process.env.RESEND_FROM_ADDRESS || 'noreply@hauslash.co',
    to: recipient,
    replyTo: booking.customer_email,
    subject,
    attachments: [createBookingCalendarAttachment(calendarEvent)],
    react: AdminBookingNotificationEmail({
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_phone,
      service: booking.service_name,
      date: formatAppointmentDate(booking.start_at),
      time: formatAppointmentTime(booking.start_at),
      deposit: formatPence(depositPence),
      remaining: remainingPence ? formatPence(remainingPence) : null,
      notes: booking.notes,
      calendarUrl: createGoogleCalendarUrl(calendarEvent),
    }),
  })

  if (response.error) {
    await recordEmailResult(
      booking.id,
      emailType,
      recipient,
      subject,
      'failed',
      response.error.message
    )
    throw new Error(`Resend rejected admin notification: ${response.error.message}`)
  }

  await recordEmailResult(booking.id, emailType, recipient, subject, 'sent')
}

async function createReminders(booking: BookingDetails) {
  const sql = getDb()
  const appointmentTime = new Date(booking.start_at)
  const reminderTimes = [
    {
      type: '24h',
      scheduledFor: new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000),
    },
    {
      type: '1h',
      scheduledFor: new Date(appointmentTime.getTime() - 60 * 60 * 1000),
    },
  ]

  for (const reminder of reminderTimes) {
    await sql`
      INSERT INTO appointment_reminders (booking_id, reminder_type, scheduled_for)
      SELECT ${booking.id}, ${reminder.type}, ${reminder.scheduledFor.toISOString()}::timestamptz
      WHERE NOT EXISTS (
        SELECT 1
        FROM appointment_reminders
        WHERE booking_id = ${booking.id}
        AND reminder_type = ${reminder.type}
      )
    `
  }
}

export async function confirmPaidBooking(
  checkoutSessionId: string
): Promise<ConfirmationResult> {
  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId)

  if (session.payment_status !== 'paid') {
    return {
      booking: null,
      confirmed: false,
      customerEmailSent: false,
    }
  }

  const sql = getDb()

  await sql`
    UPDATE bookings
    SET status = 'confirmed',
        updated_at = now(),
        expires_at = NULL
    WHERE stripe_checkout_session_id = ${checkoutSessionId}
    AND status = 'pending_payment'
  `

  const bookingRows = await sql`
    SELECT
      b.id,
      b.customer_name,
      b.customer_email,
      b.customer_phone,
      b.notes,
      b.start_at,
      b.end_at,
      b.deposit_amount_pence,
      s.name AS service_name,
      s.duration_minutes,
      s.price_pence
    FROM bookings b
    JOIN services s ON s.id = b.service_id
    WHERE b.stripe_checkout_session_id = ${checkoutSessionId}
    AND b.status = 'confirmed'
  `

  if (bookingRows.length === 0) {
    return {
      booking: null,
      confirmed: false,
      customerEmailSent: false,
    }
  }

  const booking = bookingRows[0] as BookingDetails

  try {
    await createReminders(booking)
  } catch (error) {
    console.error('Could not create booking reminders:', error)
  }

  const customerEmailSent = await sendCustomerEmail(booking)

  try {
    await sendAdminEmail(booking)
  } catch (error) {
    console.error('Could not send admin booking notification:', error)
  }

  return {
    booking,
    confirmed: true,
    customerEmailSent,
  }
}

export async function sendConfirmedBookingEmails(
  bookingId: string
): Promise<ConfirmationResult> {
  const sql = getDb()

  const bookingRows = await sql`
    SELECT
      b.id,
      b.customer_name,
      b.customer_email,
      b.customer_phone,
      b.notes,
      b.start_at,
      b.end_at,
      b.deposit_amount_pence,
      s.name AS service_name,
      s.duration_minutes,
      s.price_pence
    FROM bookings b
    JOIN services s ON s.id = b.service_id
    WHERE b.id = ${bookingId}
    AND b.status = 'confirmed'
  `

  if (bookingRows.length === 0) {
    return {
      booking: null,
      confirmed: false,
      customerEmailSent: false,
    }
  }

  const booking = bookingRows[0] as BookingDetails

  try {
    await createReminders(booking)
  } catch (error) {
    console.error('Could not create booking reminders:', error)
  }

  const customerEmailSent = await sendCustomerEmail(booking)

  try {
    await sendAdminEmail(booking)
  } catch (error) {
    console.error('Could not send admin booking notification:', error)
  }

  return {
    booking,
    confirmed: true,
    customerEmailSent,
  }
}
