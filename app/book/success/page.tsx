import { getDb } from '@/lib/db'
import { formatPence, formatDuration } from '@/lib/types'
import { confirmPaidBooking } from '@/lib/confirm-booking'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { CheckCircle, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { AddToCalendarButton } from '@/components/booking/add-to-calendar'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Booking Confirmed',
}

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {

  const params = await searchParams
  const sessionId = params.session_id

  if (!sessionId) {
    return (
      <>
        <SiteHeader />
        <main className="flex min-h-[60vh] items-center justify-center px-6">
          <div className="text-center">
            <h1 className="font-serif text-2xl text-foreground">No booking found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The booking session could not be found.
            </p>
            <Button asChild className="mt-4 rounded-full">
              <Link href="/book">Book Again</Link>
            </Button>
          </div>
        </main>
      </>
    )
  }

  let confirmationEmailSent = false

  try {
    const result = await confirmPaidBooking(sessionId)
    confirmationEmailSent = result.customerEmailSent
  } catch (error) {
    console.error('Could not complete booking confirmation email:', error)
  }

  const sql = getDb()
  const bookings = await sql`
    SELECT b.*, s.name as service_name, s.duration_minutes, s.price_pence
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    WHERE b.stripe_checkout_session_id = ${sessionId}
    AND b.status = 'confirmed'
  `

  if (bookings.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="flex min-h-[60vh] items-center justify-center px-6">
          <div className="text-center">
            <h1 className="font-serif text-2xl text-foreground">Booking not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We could not find a booking for this session.
            </p>
            <Button asChild className="mt-4 rounded-full">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </main>
      </>
    )
  }

  const booking = bookings[0]

  const startDate = new Date(booking.start_at as string)
  const formattedDate = format(startDate, 'EEEE d MMMM yyyy')
  const formattedTime = format(startDate, 'HH:mm')

  const depositPence = booking.deposit_amount_pence as number
  const pricePence = booking.price_pence as number | null
  const remainingPence = pricePence ? pricePence - depositPence : null

  return (
    <>
      <SiteHeader />

      <main className="min-h-[80vh]">
        <div className="mx-auto max-w-xl px-6 py-16 md:py-20">

          <div className="flex flex-col items-center gap-4 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <CheckCircle className="h-8 w-8 text-accent-foreground" />
            </div>

            <h1 className="font-serif text-3xl tracking-tight text-foreground">
              Booking Confirmed
            </h1>

            <p className="text-sm text-muted-foreground">
              Thank you, {booking.customer_name}! Your appointment is secured.
              {confirmationEmailSent
                ? ' A confirmation email is on its way.'
                : ' Please keep the appointment details below. If your email does not arrive shortly, contact us and we will resend it.'}
            </p>

          </div>

          <div className="mt-8 rounded-xl border border-border/60 bg-card p-6">

            <h2 className="mb-4 text-lg font-medium text-foreground">
              {booking.service_name}
            </h2>

            <div className="flex flex-col gap-3 text-sm">

              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formattedTime} · {formatDuration(booking.duration_minutes)}
              </div>

            </div>

            <div className="mt-4 border-t border-border/60 pt-4">

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deposit paid</span>
                <span className="font-medium">{formatPence(depositPence)}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Deposits are non-refundable once the booking has been made.
              </p>

              {remainingPence !== null && remainingPence > 0 && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">
                    Remaining (pay at appointment)
                  </span>
                  <span className="text-muted-foreground">
                    {formatPence(remainingPence)}
                  </span>
                </div>
              )}

            </div>

          </div>

          <div className="mt-6 flex flex-col gap-3">

            <AddToCalendarButton
              title={booking.service_name}
              startAt={booking.start_at}
              endAt={booking.end_at}
            />

            <Button asChild variant="outline" className="rounded-full">
              <Link href="/">Back to Home</Link>
            </Button>

          </div>

          <div className="mt-8 rounded-lg bg-muted p-4">

            <h3 className="text-sm font-medium text-foreground">
              Before your appointment
            </h3>

            <ul className="mt-2 flex flex-col gap-1.5 text-xs text-muted-foreground">

              <li>Arrive with clean, makeup-free eyes</li>
              <li>Avoid waterproof mascara for 48 hours prior</li>
              <li>Remove contact lenses before the treatment</li>
              <li>If you would like a patch test before your appointment, please contact us and we will arrange this for you.</li>

            </ul>

          </div>

        </div>
      </main>
    </>
  )
}
