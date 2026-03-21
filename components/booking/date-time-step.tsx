'use client'

import { useState, useEffect } from 'react'
import { Service, TimeSlot, formatDuration } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, addDays, isBefore, startOfDay } from 'date-fns'

export function DateTimeStep({
  service,
  selectedDate,
  selectedTime,
  onSelect,
  onBack,
}: {
  service: Service
  selectedDate: string
  selectedTime: string
  onSelect: (date: string, time: string) => void
  onBack: () => void
}) {
  const [date, setDate] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  )

  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [chosenTime, setChosenTime] = useState(selectedTime)

  const today = startOfDay(new Date())
  const maxDate = addDays(today, 60)

  useEffect(() => {
    if (!date) return

    setLoading(true)
    setChosenTime('')

    const dateStr = format(date, 'yyyy-MM-dd')

    fetch(`/api/availability?date=${dateStr}&serviceId=${service.id}`)
      .then((r) => r.json())
      .then((data) => {
        setSlots(data.slots || [])
      })
      .catch(() => setSlots([]))
      .finally(() => setLoading(false))
  }, [date, service.id])

  const availableSlots = slots.filter((s) => s.available)

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <h2 className="text-lg font-medium text-foreground">
          Pick a date & time
        </h2>
      </div>

      {/* Service info */}
      <p className="text-sm text-muted-foreground">
        {service.name} &middot; {formatDuration(service.duration_minutes)}
      </p>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">

        {/* Calendar - Mobile Optimized */}
        <div className="flex justify-center overflow-x-auto sm:justify-start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}

            /* FIXED: Sundays no longer disabled */
            disabled={(d) =>
              isBefore(d, today) || d > maxDate
            }

            className="rounded-xl border border-border/60 [&_button]:h-11 [&_button]:w-11 sm:[&_button]:h-9 sm:[&_button]:w-9 [&_button]:text-sm sm:[&_button]:text-xs"
          />
        </div>

        {/* Time slots - Mobile Optimized */}
        <div className="flex-1 w-full">

          {!date && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Select a date to see available times
            </p>
          )}

          {date && loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {date && !loading && availableSlots.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No available slots on this date. Please try another day.
            </p>
          )}

          {date && !loading && availableSlots.length > 0 && (
            <div className="flex flex-col gap-4">

              <p className="text-sm font-medium text-foreground">
                Available times for {format(date, 'EEE d MMM')}
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {availableSlots.map((slot) => {

                  const timeStr = slot.start.slice(0, 5)
                  const isChosen = chosenTime === timeStr

                  return (
                    <button
                      key={slot.start}
                      onClick={() => setChosenTime(timeStr)}
                      className={cn(
                        'rounded-lg border px-3 py-3 sm:py-2.5 text-sm font-medium transition-all h-12 sm:h-auto',

                        isChosen
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border/60 bg-card text-foreground hover:border-primary/40'
                      )}
                    >
                      {timeStr}
                    </button>
                  )
                })}
              </div>

            </div>
          )}

          {chosenTime && date && (
            <Button
              onClick={() =>
                onSelect(
                  format(date, 'yyyy-MM-dd'),
                  chosenTime
                )
              }
              className="mt-4 w-full rounded-full"
            >
              Continue
            </Button>
          )}

        </div>

      </div>
    </div>
  )
}