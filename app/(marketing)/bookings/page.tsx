'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Calendar, Clock, DollarSign, Mail, ShieldCheck } from 'lucide-react'
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
import { formatAppointmentDate, formatAppointmentTime } from '@/lib/appointment-time'

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

const codeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Enter the 6 digit code from your email'),
})

type EmailFormValues = z.infer<typeof emailSchema>
type CodeFormValues = z.infer<typeof codeSchema>
type Step = 'email' | 'code' | 'bookings'

interface Booking {
  id: string
  service_name: string
  start_at: string
  end_at: string
  status: string
  deposit_amount_pence: number
  created_at: string
}

function isPatchTestBooking(serviceName: string) {
  return serviceName.toLowerCase().includes('patch') && serviceName.toLowerCase().includes('test')
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
  const [customerEmail, setCustomerEmail] = useState('')
  const [step, setStep] = useState<Step>('email')
  const [notice, setNotice] = useState('')

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  })

  const codeForm = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: '' },
  })

  async function requestCode(values: EmailFormValues) {
    setIsLoading(true)
    setNotice('')

    try {
      const response = await fetch('/api/customer/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      })

      const data = await response.json()

      if (!response.ok) {
        emailForm.setError('email', {
          message: data.error || 'Failed to send access code',
        })
        return
      }

      setCustomerEmail(values.email)
      setStep('code')
      setNotice(data.message || 'We sent a secure access code to your email.')
    } catch (error) {
      emailForm.setError('email', {
        message: 'An error occurred while sending your access code',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function verifyCode(values: CodeFormValues) {
    setIsLoading(true)
    setNotice('')

    try {
      const response = await fetch('/api/customer/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customerEmail, code: values.code }),
      })

      const data = await response.json()

      if (!response.ok) {
        codeForm.setError('code', {
          message: data.error || 'Failed to verify code',
        })
        return
      }

      setBookings(data.bookings || [])
      setStep('bookings')
    } catch (error) {
      codeForm.setError('code', {
        message: 'An error occurred while verifying your code',
      })
    } finally {
      setIsLoading(false)
    }
  }

  function resetAccess() {
    setStep('email')
    setBookings([])
    setCustomerEmail('')
    setNotice('')
    emailForm.reset()
    codeForm.reset()
  }

  return (
    <main className="min-h-screen">
      <section className="border-b border-primary/10 bg-gradient-to-b from-primary/5 to-transparent px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 font-serif text-4xl text-foreground md:text-5xl">
            Your Bookings
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Securely view your Hauslash appointment history with a one-time email code.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {step === 'email' && (
            <Card className="border-primary/10 p-8">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-foreground">
                    Access your bookings
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Enter the email address used for your booking. We will send a short-lived code before showing any appointment details.
                  </p>
                </div>
              </div>

              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(requestCode)} className="space-y-6">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormDescription>
                          For privacy, appointment history is only shown after email verification.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} size="lg" className="w-full rounded-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send secure code
                  </Button>
                </form>
              </Form>
            </Card>
          )}

          {step === 'code' && (
            <Card className="border-primary/10 p-8">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-foreground">
                    Check your email
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Enter the 6 digit code sent to {customerEmail}. It expires after 10 minutes.
                  </p>
                </div>
              </div>

              {notice && (
                <p className="mb-6 rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
                  {notice}
                </p>
              )}

              <Form {...codeForm}>
                <form onSubmit={codeForm.handleSubmit(verifyCode)} className="space-y-6">
                  <FormField
                    control={codeForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access code</FormLabel>
                        <FormControl>
                          <Input
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="123456"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Codes can only be used once.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} size="lg" className="w-full rounded-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    View my bookings
                  </Button>
                </form>
              </Form>

              <button
                type="button"
                onClick={resetAccess}
                className="mt-5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Use a different email
              </button>
            </Card>
          )}

          {step === 'bookings' && (
            <div>
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <h2 className="mb-1 font-serif text-2xl text-foreground">
                    Your appointments
                  </h2>
                  <p className="text-sm text-muted-foreground">{customerEmail}</p>
                </div>
                <Button variant="outline" onClick={resetAccess}>
                  Change email
                </Button>
              </div>

              {bookings.length === 0 ? (
                <Card className="border-primary/10 p-8 text-center">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mb-2 font-serif text-xl text-foreground">
                    No bookings found
                  </h3>
                  <p className="mb-6 text-muted-foreground">
                    No appointments were found for this verified email address.
                  </p>
                  <Button asChild className="rounded-full">
                    <a href="/book">Book now</a>
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="border-primary/10 p-6 transition-colors hover:border-primary/30">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div>
                            <h3 className="mb-2 font-serif text-lg text-foreground">
                              {booking.service_name}
                            </h3>
                            <Badge className={STATUS_COLORS[booking.status] || 'bg-muted text-muted-foreground'}>
                              {booking.status.replace('_', ' ')}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-3 text-foreground">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span>{formatAppointmentDate(booking.start_at)}</span>
                            </div>
                            <div className="flex items-center gap-3 text-foreground">
                              <Clock className="h-4 w-4 text-primary" />
                              <span>
                                {formatAppointmentTime(booking.start_at)} - {formatAppointmentTime(booking.end_at)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-foreground">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span>
                                {booking.deposit_amount_pence > 0
                                  ? isPatchTestBooking(booking.service_name)
                                    ? `Refundable attendance deposit: ${formatPence(booking.deposit_amount_pence)}`
                                    : `Non-refundable deposit: ${formatPence(booking.deposit_amount_pence)}`
                                  : 'Free appointment'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center rounded-lg bg-muted/30 p-4">
                          {booking.status === 'confirmed' && (
                            <div className="text-center">
                              <p className="mb-2 text-sm text-muted-foreground">Appointment confirmed</p>
                              <p className="text-xs text-muted-foreground">We will send you a reminder before your appointment.</p>
                            </div>
                          )}
                          {booking.status === 'pending_payment' && (
                            <div className="text-center">
                              <p className="mb-2 text-sm text-amber-700">Awaiting payment</p>
                              <Button asChild size="sm" className="rounded-full">
                                <a href="/book">Complete booking</a>
                              </Button>
                            </div>
                          )}
                          {booking.status === 'completed' && (
                            <div className="text-center">
                              <p className="text-sm text-emerald-700">Appointment completed</p>
                              <Button asChild variant="outline" size="sm" className="mt-2 rounded-full">
                                <a href="/book">Book again</a>
                              </Button>
                            </div>
                          )}
                          {booking.status === 'cancelled' && (
                            <div className="text-center">
                              <p className="text-sm text-red-700">Appointment cancelled</p>
                              <Button asChild size="sm" className="mt-2 rounded-full">
                                <a href="/book">Book a new appointment</a>
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
                <div className="mt-8 border-t border-primary/10 pt-8">
                  <Button asChild className="rounded-full">
                    <a href="/book">Book another appointment</a>
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
