'use client'

import { useState } from 'react'
import { BookingData } from './booking-wizard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft } from 'lucide-react'

export function DetailsStep({
  data,
  onUpdate,
  onNext,
  onBack,
}: {
  data: BookingData
  onUpdate: (partial: Partial<BookingData>) => void
  onNext: () => void
  onBack: () => void
}) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const errs: Record<string, string> = {}
    if (!data.name.trim()) errs.name = 'Name is required'
    if (!data.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Invalid email'
    if (!data.phone.trim()) errs.phone = 'Phone number is required'
    else if (!/^[\d\s+()-]{7,20}$/.test(data.phone)) errs.phone = 'Invalid phone number'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <h2 className="text-lg font-medium text-foreground">Your Details</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Jane Smith"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            value={data.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="07xxx xxxxxx"
            value={data.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any allergies, preferences, or questions..."
            value={data.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <Button
        onClick={() => validate() && onNext()}
        className="rounded-full"
      >
        Review Booking
      </Button>
    </div>
  )
}
