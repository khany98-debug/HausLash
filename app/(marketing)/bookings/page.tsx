'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { Loader2, Calendar, Clock, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { formatPence } from '@/lib/types'

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type EmailFormValues = z.infer<typeof emailSchema>

interface Booking {
  id: string
  service_name: string
  start_at: string
  end_at: string
  status: string
  deposit_amount_pence: number
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-800',
  pending_payment: 'bg-amber-100 text-amber-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
  refunded: 'bg-gray-100 text-gray-800',
}

export default function CustomerPortalPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [showBookings, setShowBookings] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: EmailFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/customer/bookings?email=${encodeURIComponent(values.email)}`
      )

      if (!response.ok) {
        const error = await response.json()
        form.setError('email', {
          message: error.error || 'Failed to fetch bookings',
        })
        return
      }

      const data = await response.json()
      setBookings(data.bookings || [])
      setCustomerEmail(values.email)
      setShowBookings(true)
    } catch (error) {
      form.setError('email', {
        message: 'An error occurred while fetching your bookings',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-12 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-transparent border-b border-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Your Bookings
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            View your appointment history and booking details
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {!showBookings ? (
            // Login Form
            <Card className="p-8 border-primary/10">
              <h2 className="font-serif text-2xl text-foreground mb-6">
                Access Your Bookings
              </h2>
              <p className="text-muted-foreground mb-8">
                Enter the email address associated with your HausLash booking to view your appointment history.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the email used for your booking
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="lg"
                    className="w-full rounded-full"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    View My Bookings
                  </Button>
                </form>
              </Form>
            </Card>
          ) : (
            // Bookings List
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-1">
                    Your Appointments
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {customerEmail}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowBookings(false)
                    form.reset()
                  }}
                >
                  Change Email
                </Button>
              </div>

              {bookings.length === 0 ? (
                <Card className="p-8 text-center border-primary/10">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="font-serif text-xl text-foreground mb-2">
                    No Bookings Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't made any bookings yet. Would you like to book an appointment?
                  </p>
                  <Button asChild className="rounded-full">
                    <a href="/book">Book Now</a>
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card
                      key={booking.id}
                      className="p-6 border-primary/10 hover:border-primary/30 transition-colors"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Booking Details */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-serif text-lg text-foreground mb-2">
                              {booking.service_name}
                            </h3>
                            <Badge
                              className={`${
                                STATUS_COLORS[booking.status] || 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {booking.status.replace('_', ' ')}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-3 text-foreground">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span>
                                {format(
                                  new Date(booking.start_at),
                                  'EEEE, d MMMM yyyy'
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-foreground">
                              <Clock className="h-4 w-4 text-primary" />
                              <span>
                                {format(new Date(booking.start_at), 'HH:mm')} -{' '}
                                {format(new Date(booking.end_at), 'HH:mm')}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-foreground">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span>
                                Deposit: {formatPence(booking.deposit_amount_pence)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Info */}
                        <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                          {booking.status === 'confirmed' && (
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground mb-2">
                                Appointment Confirmed
                              </p>
                              <p className="text-xs text-muted-foreground">
                                We'll send you a reminder before your appointment
                              </p>
                            </div>
                          )}
                          {booking.status === 'pending_payment' && (
                            <div className="text-center">
                              <p className="text-sm text-amber-700 mb-2">
                                Awaiting Payment
                              </p>
                              <Button asChild size="sm" className="rounded-full">
                                <a href="/book">Complete Booking</a>
                              </Button>
                            </div>
                          )}
                          {booking.status === 'completed' && (
                            <div className="text-center">
                              <p className="text-sm text-emerald-700">
                                Appointment Completed
                              </p>
                              <Button asChild variant="outline" size="sm" className="mt-2 rounded-full">
                                <a href="/book">Book Again</a>
                              </Button>
                            </div>
                          )}
                          {booking.status === 'cancelled' && (
                            <div className="text-center">
                              <p className="text-sm text-red-700">
                                Appointment Cancelled
                              </p>
                              <Button asChild size="sm" className="mt-2 rounded-full">
                                <a href="/book">Book a New Appointment</a>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {bookings.length > 0 && (
                <div className="mt-8 pt-8 border-t border-primary/10">
                  <Button asChild className="rounded-full">
                    <a href="/book">Book Another Appointment</a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
