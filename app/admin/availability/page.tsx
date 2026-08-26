'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAdminAuth } from '../layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  AlertCircle,
  Ban,
  CalendarDays,
  CalendarPlus,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Loader2,
  Plus,
  Repeat,
  Scissors,
  Settings2,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { AdminLoadingState, AdminPageHeader } from '@/components/admin/admin-page-shell'
import { formatAppointmentDate, formatAppointmentTime } from '@/lib/appointment-time'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const LASH_LIFT_SLOT_MINUTES = 90

const SLOT_TEMPLATES = [
  {
    id: 'signature',
    label: 'Signature day',
    description: 'Your usual four slots: 10:30, 12:00, 14:30, and 18:00.',
    starts: ['10:30', '12:00', '14:30', '18:00'],
  },
  {
    id: 'full',
    label: 'Full studio day',
    description: 'Six 90-minute appointments from 09:00 to 18:00.',
    starts: ['09:00', '10:30', '12:00', '14:30', '16:30', '18:00'],
  },
  {
    id: 'balanced',
    label: 'Balanced day',
    description: 'Four calm appointments with space to reset.',
    starts: ['10:30', '12:00', '14:30', '18:00'],
  },
  {
    id: 'morning',
    label: 'Morning only',
    description: 'Open the first half of the day.',
    starts: ['09:00', '10:30', '12:00'],
  },
  {
    id: 'afternoon',
    label: 'Afternoon only',
    description: 'Open later appointments only.',
    starts: ['14:30', '16:30', '18:00'],
  },
]

const ALL_SLOT_STARTS = Array.from(
  new Set(SLOT_TEMPLATES.flatMap((template) => template.starts))
).sort()

interface AvailabilityRule {
  id: string
  weekday: number
  start_time: string
  end_time: string
  buffer_minutes: number
}

interface Slot {
  id: string
  date: string
  start_time: string
  end_time: string
}

interface BlockedTime {
  id: string
  start_at: string
  end_at: string
  reason?: string
}

function addMinutesToTime(time: string, minutes: number) {
  const [hours, mins] = time.split(':').map(Number)
  const total = hours * 60 + mins + minutes
  const nextHours = Math.floor(total / 60)
  const nextMins = total % 60
  return `${String(nextHours).padStart(2, '0')}:${String(nextMins).padStart(2, '0')}`
}

function getSlotDuration(start: string, end: string) {
  const [startHours, startMins] = start.slice(0, 5).split(':').map(Number)
  const [endHours, endMins] = end.slice(0, 5).split(':').map(Number)
  return endHours * 60 + endMins - (startHours * 60 + startMins)
}

function formatDateInput(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateInput(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function addDays(date: Date, days: number) {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

function formatDisplayDate(date: string) {
  return parseDateInput(date).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function getNextWeekday(targetWeekday: number) {
  const today = new Date()
  const diff = (targetWeekday + 7 - today.getDay()) % 7
  return formatDateInput(addDays(today, diff || 7))
}

function buildDateRange(startDate: string, endDate: string, weekdays: number[]) {
  if (!startDate || !endDate) return []

  const dates: string[] = []
  const start = parseDateInput(startDate)
  const end = parseDateInput(endDate)

  if (start > end) return dates

  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    if (weekdays.includes(date.getDay())) {
      dates.push(formatDateInput(date))
    }
  }

…26776 tokens truncated…   SELECT
        ar.id,
        ar.reminder_type,
        ar.sent_at,
        b.customer_name,
        b.start_at
      FROM appointment_reminders ar
      JOIN bookings b ON ar.booking_id = b.id
      WHERE ar.sent_at IS NOT NULL
      AND ar.sent_at > now() - interval '24 hours'
      ORDER BY ar.sent_at DESC
      LIMIT 20
    `

    return NextResponse.json({
      pending: pendingReminders,
      recentlySent: recentlySent,
    })
  } catch (error) {
    console.error('Error fetching reminder status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reminder status' },
      { status: 500 }
    )
  }
}
