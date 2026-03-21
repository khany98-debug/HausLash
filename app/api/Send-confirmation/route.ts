import { NextResponse } from "next/server"
import { resend } from "@/lib/email"
import { getDb } from "@/lib/db"
import { format } from "date-fns"
import { formatPence } from "@/lib/types"

export async function POST(req: Request) {
  const { bookingId } = await req.json()

  const sql = getDb()

  const rows = await sql`
    SELECT b.*, s.name as service_name, s.duration_minutes, s.price_pence
    FROM bookings b
    JOIN services s ON s.id = b.service_id
    WHERE b.id = ${bookingId}
  `

  if (rows.length === 0) {
    return NextResponse.json({ error: "Booking not found" })
  }

  const booking = rows[0]
  const startDate = new Date(booking.start_at)
  const formattedDate = format(startDate, 'EEEE d MMMM yyyy')
  const formattedTime = format(startDate, 'HH:mm')
  const depositPence = booking.deposit_amount_pence as number
  const pricePence = booking.price_pence as number | null
  const remainingPence = pricePence ? pricePence - depositPence : null

  // Email to customer
  await resend.emails.send({
    from: process.env.RESEND_FROM_ADDRESS || "noreply@hauslash.co",
    to: booking.customer_email,
    subject: "Your HausLash appointment is confirmed",
    html: `
      <h2>Booking Confirmed</h2>

      <p>Hello ${booking.customer_name},</p>

      <p>Your appointment has been confirmed.</p>

      <p><strong>Service:</strong> ${booking.service_name}</p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Time:</strong> ${formattedTime}</p>
      <p><strong>Duration:</strong> ${booking.duration_minutes} minutes</p>

      <p><strong>Deposit paid:</strong> ${formatPence(depositPence)}</p>
      ${remainingPence ? `<p><strong>Remaining balance (due at appointment):</strong> ${formatPence(remainingPence)}</p>` : ''}

      <p>Thank you,<br/>HausLash Studio</p>
    `,
  })

  // Email to admin
  await resend.emails.send({
    from: process.env.RESEND_FROM_ADDRESS || "noreply@hauslash.co",
    to: process.env.ADMIN_EMAIL || "admin@hauslash.co",
    subject: "New booking received",
    html: `
      <h2>New Booking - ${booking.customer_name}</h2>

      <p><strong>Name:</strong> ${booking.customer_name}</p>
      <p><strong>Email:</strong> ${booking.customer_email}</p>
      <p><strong>Phone:</strong> ${booking.customer_phone}</p>
      <p><strong>Service:</strong> ${booking.service_name}</p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Time:</strong> ${formattedTime}</p>
      <p><strong>Deposit Paid:</strong> ${formatPence(depositPence)}</p>
    `,
  })

  return NextResponse.json({ success: true })
}