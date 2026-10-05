'use client'

import { useState } from 'react'
import { BookingData } from './booking-wizard'
import { Service, formatPence, formatDuration } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, Loader2, Calendar, Clock, User, Mail, Phone, Tag, X } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { getAppointmentLocationDetails } from '@/lib/appointment-location'
import { isPatchTestService } from '@/lib/service-display'
import { calculatePromotion, OCTOBER10_CODE, promotionErrorMessage } from '@/lib/promotions'

export function ReviewStep({
  data,
  service,
  onBack,
}: {
  data: BookingData
  service: Service
  onBack: () => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const [promotionInput, setPromotionInput] = useState('')
  const [appliedPromotionCode, setAppliedPromotionCode] = useState<string | null>(null)
  const [promotionError, setPromotionError] = useState<string | null>(null)

  const formattedDate = format(new Date(data.date), 'EEEE d MMMM yyyy')
  const isFreeBooking = service.deposit_pence <= 0
  const isPatchTest = isPatchTestService(service)
  const promotionResult = calculatePromotion({
    code: appliedPromotionCode,
    pricePence: service.price_pence,
    depositPence: service.deposit_pence,
    eligible: !isPatchTest,
  })
  const promotion = promotionResult.promotion
  const depositPence = promotion?.depositPence ?? service.deposit_pence
  const finalPricePence = promotion?.finalPricePence ?? service.price_pence
  const remainingPence =
    finalPricePence && finalPricePence > depositPence
      ? finalPricePence - depositPence
      : null
  const locationDetails = getAppointmentLocationDetails(service.name)

  function applyPromotion() {
    const result = calculatePromotion({
      code: promotionInput,
      pricePence: service.price_pence,
      depositPence: service.deposit_pence,
      eligible: !isPatchTest,
    })

    if (result.error) {
      setAppliedPromotionCode(null)
      setPromotionError(promotionErrorMessage(result.error))
      return
    }

    setAppliedPromotionCode(result.promotion?.code ?? null)
    setPromotionInput(result.promotion?.code ?? '')
    setPromotionError(null)
  }

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
          promotionCode: appliedPromotionCode,
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
    <div className="flex flex-col gap-5 md:gap-8">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 focus-visible:ring-2 focus-visible:ring-primary" disabled={submitting}>
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <h2 className="text-lg md:text-xl font-medium text-foreground">Review & Pay</h2>
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-6 md:p-8">
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

        {locationDetails.href && (
          <div className="mt-5 rounded-lg bg-muted p-4 text-sm">
            <p className="font-medium text-foreground">{locationDetails.label}</p>
            <p className="mt-1 leading-6 text-muted-foreground">{locationDetails.value}</p>
            <a
              href={locationDetails.href}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex font-medium text-foreground underline underline-offset-4"
            >
              {locationDetails.linkLabel}
            </a>
          </div>
        )}

        <div className="mt-6 border-t border-border/60 pt-4">
          {!isFreeBooking && !isPatchTest && service.price_pence && (
            <div className="mb-5 rounded-lg border border-border/60 bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Tag className="h-4 w-4" />
                Website booking offer
              </div>
              {promotion ? (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-md bg-background px-3 py-2 text-sm">
                  <span className="font-medium text-foreground">{promotion.code} applied — {promotion.percentage}% off</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedPromotionCode(null)
                      setPromotionInput('')
                    }}
                    className="rounded-sm p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Remove promotional code"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <Input
                    value={promotionInput}
                    onChange={(event) => {
                      setPromotionInput(event.target.value)
                      setPromotionError(null)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        applyPromotion()
                      }
                    }}
                    placeholder="Promotional code"
                    aria-label="Promotional code"
                    className="bg-background uppercase"
                    disabled={submitting}
                  />
                  <Button type="button" variant="outline" onClick={applyPromotion} disabled={!promotionInput.trim() || submitting}>
                    Apply
                  </Button>
                </div>
              )}
              {promotionError && <p className="mt-2 text-xs text-destructive">{promotionError}</p>}
              {promotion && (
                <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                  <span>You save</span>
                  <span>-{formatPence(promotion.discountPence)}</span>
                </div>
              )}
            </div>
          )}
          {isPatchTest && (
            <p className="mb-5 text-xs leading-5 text-muted-foreground">
              Promotional codes apply to paid lash-lift appointments, not refundable patch-test deposits.
            </p>
          )}
          {promotion && service.price_pence && (
            <>
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>Service total</span>
                <span className="line-through">{formatPence(service.price_pence)}</span>
              </div>
              <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{OCTOBER10_CODE} discount</span>
                <span>-{formatPence(promotion.discountPence)}</span>
              </div>
            </>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {isFreeBooking
                ? 'Payment due now'
                : isPatchTest
                  ? 'Refundable deposit to pay now'
                  : 'Deposit to pay now'}
            </span>
            <span className="text-lg font-medium text-foreground">
              {isFreeBooking ? 'Free' : formatPence(depositPence)}
            </span>
          </div>
          {!isFreeBooking && (
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {isPatchTest
                ? 'This £5 attendance deposit is refunded once you attend your patch test.'
                : 'Deposits are non-refundable once the booking has been made.'}
            </p>
          )}
          {remainingPence !== null && (
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Remaining balance (pay at appointment)</span>
              <span>{formatPence(remainingPence)}</span>
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={handleConfirm}
        disabled={submitting}
        size="lg"
        className="rounded-full focus-visible:ring-2 focus-visible:ring-primary"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating booking...
          </>
        ) : (
          isFreeBooking
            ? 'Confirm free booking'
            : isPatchTest
              ? `Pay refundable deposit ${formatPence(depositPence)}`
              : `Pay Deposit ${formatPence(depositPence)}`
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        {isFreeBooking
          ? 'No payment is needed for this appointment. You will receive a confirmation email once it is booked.'
          : isPatchTest
            ? 'You will be redirected to our secure payment provider to complete your refundable patch test deposit. It is refunded once you attend your patch test.'
            : 'You will be redirected to our secure payment provider to complete your deposit. Your appointment will be held for 30 minutes while you complete payment. Deposits are non-refundable once the booking has been made.'}
      </p>
    </div>
  )
}
