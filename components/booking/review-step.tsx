'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookingData } from './booking-wizard'
import { Service, formatPence, formatDuration } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Loader2, Calendar, Clock, User, Mail, Phone } from 'lucide-react'
import { format, parse } from 'date-fns'
import { toast } from 'sonner'

export function ReviewStep({
  data,
  service,
  onBack,
}: {
  data: BookingData
  service: Service
  onBack: () => void
}) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const formattedDate = format(new Date(data.date), 'EEEE d MMMM yyyy')

  async function handleConfirm() {
    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: data.serviceId,
          date: data.date,
          time: data.time,
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          notes: data.notes.trim() || null,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || 'Failed to create booking')
        setSubmitting(false)
        return
      }

      const result = await res.json()

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      } else {
        toast.error('Could not create checkout session')
        setSubmitting(false)
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1" disabled={submitting}>
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <h2 className="text-lg font-medium text-foreground">Review & Pay</h2>
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-6">
        <h3 className="mb-4 font-medium text-foreground">{service.name}</h3>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            {data.time} &middot; {formatDuration(service.duration_minutes)}
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <User className="h-4 w-4 shrink-0" />
            {data.name}
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            {data.email}
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            {data.phone}
          </div>
          {data.notes && (
            <p className="mt-1 text-muted-foreground">
              Notes: {data.notes}
            </p>
          )}
        </div>

        <div className="mt-6 border-t border-border/60 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Deposit to pay now</span>
            <span className="text-lg font-medium text-foreground">
              {formatPence(service.deposit_pence)}
            </span>
          </div>
          {service.price_pence && (
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Remaining balance (pay at appointment)</span>
              <span>{formatPence(service.price_pence - service.deposit_pence)}</span>
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={handleConfirm}
        disabled={submitting}
        size="lg"
        className="rounded-full"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating booking...
          </>
        ) : (
          `Pay Deposit ${formatPence(service.deposit_pence)}`
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        You will be redirected to our secure payment provider to complete your deposit.
        Your appointment will be held for 30 minutes while you complete payment.
      </p>
    </div>
  )
}
