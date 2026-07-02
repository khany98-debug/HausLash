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

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const LASH_LIFT_SLOT_MINUTES = 90

const SLOT_TEMPLATES = [
  {
    id: 'full',
    label: 'Full studio day',
    description: 'Six 90-minute appointments from 09:00 to 18:00.',
    starts: ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'],
  },
  {
    id: 'balanced',
    label: 'Balanced day',
    description: 'Four calm appointments with space to reset.',
    starts: ['10:00', '11:30', '13:30', '15:00'],
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
    starts: ['13:30', '15:00', '16:30'],
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

  return dates
}

export default function AdminAvailabilityPage() {
  const { token } = useAdminAuth()

  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([])
  const [loading, setLoading] = useState(true)
  const [processingActionId, setProcessingActionId] = useState<string | null>(null)

  const [slotDate, setSlotDate] = useState(formatDateInput(new Date()))
  const [selectedTemplateId, setSelectedTemplateId] = useState(SLOT_TEMPLATES[0].id)
  const [selectedSlotStarts, setSelectedSlotStarts] = useState<string[]>(SLOT_TEMPLATES[0].starts)
  const [customSlotStart, setCustomSlotStart] = useState('09:00')

  const [repeatStartDate, setRepeatStartDate] = useState(formatDateInput(new Date()))
  const [repeatEndDate, setRepeatEndDate] = useState(formatDateInput(addDays(new Date(), 14)))
  const [repeatDays, setRepeatDays] = useState<number[]>([6])

  const [editingRuleDay, setEditingRuleDay] = useState<number | null>(null)
  const [ruleStart, setRuleStart] = useState('')
  const [ruleEnd, setRuleEnd] = useState('')
  const [ruleBuffer, setRuleBuffer] = useState('15')

  const [blockStart, setBlockStart] = useState('')
  const [blockEnd, setBlockEnd] = useState('')
  const [blockReason, setBlockReason] = useState('')

  const [expandedSections, setExpandedSections] = useState({
    repeat: false,
    rules: false,
    blockedTimes: false,
  })

  const existingStarts = useMemo(
    () => new Set(slots.map((slot) => slot.start_time.slice(0, 5))),
    [slots]
  )

  const selectedTemplate = SLOT_TEMPLATES.find((template) => template.id === selectedTemplateId)
  const selectedNewStarts = selectedSlotStarts.filter((start) => !existingStarts.has(start))
  const selectedExistingStarts = selectedSlotStarts.filter((start) => existingStarts.has(start))
  const repeatDates = useMemo(
    () => buildDateRange(repeatStartDate, repeatEndDate, repeatDays),
    [repeatStartDate, repeatEndDate, repeatDays]
  )

  useEffect(() => {
    if (!token) return
    loadAllData()
    loadSlots(slotDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  useEffect(() => {
    if (!token || !slotDate) return
    loadSlots(slotDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotDate, token])

  async function loadAllData() {
    try {
      setLoading(true)
      const [rulesRes, blockedRes] = await Promise.all([
        fetch('/api/admin/availability', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/availability', {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (rulesRes.ok) {
        const data = await rulesRes.json()
        setRules(data.rules || [])
      }

      if (blockedRes.ok) {
        const data = await blockedRes.json()
        setBlockedTimes(data.blocked || [])
      }
    } catch {
      toast.error('Failed to load availability data')
    } finally {
      setLoading(false)
    }
  }

  async function loadSlots(date: string) {
    if (!date) return
    try {
      const res = await fetch(`/api/admin/slots?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setSlots(data.slots || [])
    } catch {
      toast.error('Failed to load slots')
    }
  }

  function validateTimeRange(start: string, end: string, fieldName = 'Time') {
    if (!start || !end) return true
    if (start >= end) {
      toast.error(`${fieldName}: End time must be after start time`)
      return false
    }
    return true
  }

  async function createSlotForDate(date: string, start: string) {
    const end = addMinutesToTime(start, LASH_LIFT_SLOT_MINUTES)

    const res = await fetch('/api/admin/slots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        date,
        start_time: start,
        end_time: end,
      }),
    })

    if (res.ok) return 'created'
    if (res.status === 409) return 'skipped'
    return 'failed'
  }

  async function createSelectedSlots() {
    if (!slotDate) {
      toast.error('Please select a date')
      return
    }

    if (selectedSlotStarts.length === 0) {
      toast.error('Please choose at least one slot')
      return
    }

    if (selectedNewStarts.length === 0) {
      toast.info('All selected slots already exist for this date')
      return
    }

    setProcessingActionId('create-selected')
    try {
      let created = 0
      let skipped = 0
      let failed = 0

      for (const start of selectedSlotStarts) {
        if (existingStarts.has(start)) {
          skipped++
          continue
        }

        const result = await createSlotForDate(slotDate, start)
        if (result === 'created') created++
        if (result === 'skipped') skipped++
        if (result === 'failed') failed++
      }

      await loadSlots(slotDate)
      if (created > 0) {
        toast.success(`${created} slot${created !== 1 ? 's' : ''} added${skipped ? `, ${skipped} skipped` : ''}`)
      } else if (failed > 0) {
        toast.error('No slots were added')
      } else {
        toast.info('Those slots already exist')
      }
    } catch {
      toast.error('Failed to add slots')
    } finally {
      setProcessingActionId(null)
    }
  }

  async function createRepeatingSlots() {
    if (repeatDates.length === 0) {
      toast.error('Choose a valid date range and at least one day')
      return
    }

    if (repeatDates.length > 90) {
      toast.error('Please keep repeat ranges under 90 selected dates')
      return
    }

    if (selectedSlotStarts.length === 0) {
      toast.error('Please choose at least one slot')
      return
    }

    setProcessingActionId('repeat-slots')
    try {
      let created = 0
      let skipped = 0
      let failed = 0

      for (const date of repeatDates) {
        for (const start of selectedSlotStarts) {
          const result = await createSlotForDate(date, start)
          if (result === 'created') created++
          if (result === 'skipped') skipped++
          if (result === 'failed') failed++
        }
      }

      await loadSlots(slotDate)
      if (created > 0) {
        toast.success(
          `${created} slot${created !== 1 ? 's' : ''} created across ${repeatDates.length} date${repeatDates.length !== 1 ? 's' : ''}${skipped ? `, ${skipped} skipped` : ''}`
        )
      } else if (failed > 0) {
        toast.error('No repeat slots were created')
      } else {
        toast.info('All repeat slots already existed')
      }
    } catch {
      toast.error('Failed to repeat slots')
    } finally {
      setProcessingActionId(null)
    }
  }

  async function clearSlotsForDate() {
    if (!slotDate || slots.length === 0) return

    const confirmed = window.confirm(`Remove all ${slots.length} slot${slots.length !== 1 ? 's' : ''} for ${slotDate}?`)
    if (!confirmed) return

    setProcessingActionId('clear-slots')
    try {
      for (const slot of slots) {
        await fetch('/api/admin/slots', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: slot.id }),
        })
      }

      toast.success('All slots removed for this date')
      await loadSlots(slotDate)
    } catch {
      toast.error('Failed to clear slots')
    } finally {
      setProcessingActionId(null)
    }
  }

  async function deleteSlot(id: string) {
    setProcessingActionId(`delete-slot-${id}`)
    try {
      const res = await fetch('/api/admin/slots', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        toast.success('Slot deleted')
        await loadSlots(slotDate)
      } else {
        toast.error('Failed to delete slot')
      }
    } catch {
      toast.error('Failed to delete slot')
    } finally {
      setProcessingActionId(null)
    }
  }

  async function saveRule() {
    if (editingRuleDay === null) return

    if (!validateTimeRange(ruleStart, ruleEnd, 'Availability hours')) return

    setProcessingActionId(`rule-${editingRuleDay}`)
    try {
      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          weekday: editingRuleDay,
          start_time: ruleStart,
          end_time: ruleEnd,
          buffer_minutes: parseInt(ruleBuffer),
        }),
      })

      if (res.ok) {
        toast.success(`${DAYS[editingRuleDay]} availability updated`)
        setEditingRuleDay(null)
        await loadAllData()
      } else {
        toast.error('Failed to save availability rule')
      }
    } catch {
      toast.error('Failed to save availability rule')
    } finally {
      setProcessingActionId(null)
    }
  }

  async function deleteRule(weekday: number) {
    setProcessingActionId(`delete-rule-${weekday}`)
    try {
      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          weekday,
          enabled: false,
        }),
      })

      if (res.ok) {
        toast.success(`${DAYS[weekday]} availability removed`)
        await loadAllData()
      } else {
        toast.error('Failed to delete availability rule')
      }
    } catch {
      toast.error('Failed to delete availability rule')
    } finally {
      setProcessingActionId(null)
    }
  }

  async function addBlockedTime() {
    if (!blockStart || !blockEnd) {
      toast.error('Please fill in all blocked time fields')
      return
    }

    if (!validateTimeRange(blockStart, blockEnd, 'Blocked time')) return

    setProcessingActionId('add-blocked')
    try {
      const res = await fetch('/api/admin/availability', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'add',
          start_at: blockStart,
          end_at: blockEnd,
          reason: blockReason || null,
        }),
      })

      if (res.ok) {
        toast.success('Blocked time added')
        setBlockStart('')
        setBlockEnd('')
        setBlockReason('')
        await loadAllData()
      } else {
        toast.error('Failed to add blocked time')
      }
    } catch {
      toast.error('Failed to add blocked time')
    } finally {
      setProcessingActionId(null)
    }
  }

  async function deleteBlockedTime(id: string) {
    setProcessingActionId(`delete-blocked-${id}`)
    try {
      const res = await fetch('/api/admin/availability', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'delete',
          id,
        }),
      })

      if (res.ok) {
        toast.success('Blocked time removed')
        await loadAllData()
      } else {
        toast.error('Failed to remove blocked time')
      }
    } catch {
      toast.error('Failed to remove blocked time')
    } finally {
      setProcessingActionId(null)
    }
  }

  function applyTemplate(templateId: string) {
    const template = SLOT_TEMPLATES.find((item) => item.id === templateId)
    if (!template) return
    setSelectedTemplateId(templateId)
    setSelectedSlotStarts(template.starts)
  }

  function toggleSlot(start: string) {
    setSelectedTemplateId('custom')
    setSelectedSlotStarts((current) =>
      current.includes(start) ? current.filter((item) => item !== start) : [...current, start].sort()
    )
  }

  function addCustomSlot() {
    if (!customSlotStart) return
    setSelectedTemplateId('custom')
    setSelectedSlotStarts((current) => Array.from(new Set([...current, customSlotStart])).sort())
    setCustomSlotStart(addMinutesToTime(customSlotStart, LASH_LIFT_SLOT_MINUTES))
  }

  function toggleRepeatDay(day: number) {
    setRepeatDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day].sort()
    )
  }

  function toggleSection(section: keyof typeof expandedSections) {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  if (loading) {
    return <AdminLoadingState label="Loading availability settings..." />
  }

  return (
    <div className="flex max-w-7xl flex-col gap-6">
      <AdminPageHeader
        eyebrow="Schedule control"
        title="Availability"
        description="Create bookable 90-minute lash lift slots quickly, repeat your best days, and keep blocked time out of the booking calendar."
        action={
          <Button
            className="rounded-full"
            onClick={() => {
              setSlotDate(formatDateInput(new Date()))
              setExpandedSections((current) => ({ ...current, repeat: false }))
            }}
          >
            <CalendarDays className="h-4 w-4" />
            Today
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
        <Card className="overflow-hidden rounded-[1.75rem] border-foreground/10 bg-card/85 shadow-sm">
          <div className="border-b border-foreground/10 bg-muted/30 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="eyebrow">Quick builder</p>
                <h2 className="mt-2 font-serif text-2xl text-foreground">Add availability</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  Pick a date, choose the slots you want, then add them in one tap. Existing slots are skipped automatically.
                </p>
              </div>
              <Badge variant="outline" className="w-fit rounded-full bg-background px-3 py-1">
                {LASH_LIFT_SLOT_MINUTES} min slots
              </Badge>
            </div>
          </div>

          <div className="grid gap-6 p-5">
            <section className="grid gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  1
                </div>
                <h3 className="font-semibold text-foreground">Choose date</h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <Input
                  type="date"
                  value={slotDate}
                  onChange={(event) => setSlotDate(event.target.value)}
                  className="rounded-full bg-background/80"
                />
                <div className="grid grid-cols-3 gap-2 sm:flex">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setSlotDate(formatDateInput(new Date()))}
                  >
                    Today
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setSlotDate(formatDateInput(addDays(new Date(), 1)))}
                  >
                    Tomorrow
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setSlotDate(getNextWeekday(6))}
                  >
                    Saturday
                  </Button>
                </div>
              </div>
            </section>

            <section className="grid gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  2
                </div>
                <h3 className="font-semibold text-foreground">Choose a slot pattern</h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {SLOT_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplate(template.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selectedTemplateId === template.id
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-foreground/10 bg-background/70 hover:border-foreground/25'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{template.label}</span>
                      <span className={`text-xs ${selectedTemplateId === template.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {template.starts.length} slots
                      </span>
                    </span>
                    <span className={`mt-2 block text-sm leading-5 ${selectedTemplateId === template.id ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>
                      {template.description}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="grid gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  3
                </div>
                <h3 className="font-semibold text-foreground">Fine tune times</h3>
              </div>

              <div className="rounded-2xl border border-foreground/10 bg-background/70 p-4">
                <div className="flex flex-wrap gap-2">
                  {ALL_SLOT_STARTS.map((start) => {
                    const selected = selectedSlotStarts.includes(start)
                    const exists = existingStarts.has(start)
                    const end = addMinutesToTime(start, LASH_LIFT_SLOT_MINUTES)

                    return (
                      <button
                        key={start}
                        type="button"
                        onClick={() => toggleSlot(start)}
                        className={`rounded-full border px-3 py-2 text-sm transition ${
                          selected
                            ? exists
                              ? 'border-amber-300 bg-amber-50 text-amber-900'
                              : 'border-primary bg-primary text-primary-foreground'
                            : 'border-foreground/10 bg-card text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {start} - {end}
                        {selected && exists ? ' exists' : ''}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-4 grid gap-2 border-t border-foreground/10 pt-4 sm:grid-cols-[1fr_auto]">
                  <Input
                    type="time"
                    value={customSlotStart}
                    onChange={(event) => setCustomSlotStart(event.target.value)}
                    className="rounded-full bg-card"
                  />
                  <Button type="button" variant="outline" onClick={addCustomSlot} className="rounded-full">
                    <Plus className="h-4 w-4" />
                    Add custom time
                  </Button>
                </div>
              </div>
            </section>

            <div className="rounded-2xl border border-foreground/10 bg-muted/35 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedNewStarts.length} new slot{selectedNewStarts.length !== 1 ? 's' : ''} ready for {slotDate ? formatDisplayDate(slotDate) : 'this date'}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {selectedExistingStarts.length > 0
                      ? `${selectedExistingStarts.length} selected slot${selectedExistingStarts.length !== 1 ? 's are' : ' is'} already open and will be skipped.`
                      : selectedTemplate
                        ? `Using the ${selectedTemplate.label.toLowerCase()} pattern.`
                        : 'Custom pattern selected.'}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    onClick={createSelectedSlots}
                    disabled={processingActionId === 'create-selected' || selectedNewStarts.length === 0}
                    className="rounded-full"
                  >
                    {processingActionId === 'create-selected' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CalendarPlus className="h-4 w-4" />
                    )}
                    Add selected slots
                  </Button>
                  {slots.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearSlotsForDate}
                      disabled={processingActionId === 'clear-slots'}
                      className="rounded-full"
                    >
                      {processingActionId === 'clear-slots' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Clear date
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[1.75rem] border-foreground/10 bg-card/85 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Selected day</p>
              <h2 className="mt-2 font-serif text-2xl text-foreground">
                {slotDate ? formatDisplayDate(slotDate) : 'Choose a date'}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {slots.length} live slot{slots.length !== 1 ? 's' : ''} open for booking.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-foreground">
              <Scissors className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            {slots.length > 0 ? (
              slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-foreground/10 bg-background/80 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getSlotDuration(slot.start_time, slot.end_time)} minutes
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => deleteSlot(slot.id)}
                    disabled={processingActionId === `delete-slot-${slot.id}`}
                    className="rounded-full text-muted-foreground hover:text-destructive"
                    aria-label="Delete slot"
                  >
                    {processingActionId === `delete-slot-${slot.id}` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-foreground/15 bg-background/65 p-6 text-center">
                <Sparkles className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-3 text-sm font-semibold text-foreground">No slots yet</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Choose a template and tap add selected slots to open this day.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-[1.75rem] border-foreground/10 bg-card/80 shadow-sm">
        <button
          onClick={() => toggleSection('repeat')}
          className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-muted/35"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Repeat className="h-4 w-4" />
            </span>
            <span>
              <span className="block font-semibold text-foreground">Repeat this pattern</span>
              <span className="block text-sm text-muted-foreground">
                Create the selected slots across multiple dates.
              </span>
            </span>
          </span>
          {expandedSections.repeat ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {expandedSections.repeat && (
          <div className="grid gap-5 border-t border-foreground/10 p-5">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Start date</label>
                <Input
                  type="date"
                  value={repeatStartDate}
                  onChange={(event) => setRepeatStartDate(event.target.value)}
                  className="mt-1 rounded-full bg-background/80"
                />
              </div>
              <div>
                <label className="text-sm font-medium">End date</label>
                <Input
                  type="date"
                  value={repeatEndDate}
                  onChange={(event) => setRepeatEndDate(event.target.value)}
                  className="mt-1 rounded-full bg-background/80"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">Repeat on</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {DAYS.map((day, index) => (
                  <Button
                    key={day}
                    type="button"
                    size="sm"
                    variant={repeatDays.includes(index) ? 'default' : 'outline'}
                    className="rounded-full"
                    onClick={() => toggleRepeatDay(index)}
                  >
                    {day.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-background/70 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {repeatDates.length} date{repeatDates.length !== 1 ? 's' : ''} selected
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    This will try to create {repeatDates.length * selectedSlotStarts.length} slot{repeatDates.length * selectedSlotStarts.length !== 1 ? 's' : ''}. Existing overlaps are skipped.
                  </p>
                </div>
                <Button
                  onClick={createRepeatingSlots}
                  disabled={processingActionId === 'repeat-slots' || repeatDates.length === 0 || selectedSlotStarts.length === 0}
                  className="rounded-full"
                >
                  {processingActionId === 'repeat-slots' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  Create repeat slots
                </Button>
              </div>

              {repeatDates.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {repeatDates.slice(0, 18).map((date) => (
                    <span key={date} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                      {formatDisplayDate(date)}
                    </span>
                  ))}
                  {repeatDates.length > 18 && (
                    <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                      +{repeatDates.length - 18} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden rounded-[1.75rem] border-foreground/10 bg-card/80 shadow-sm">
          <button
            onClick={() => toggleSection('rules')}
            className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-muted/35"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Settings2 className="h-4 w-4" />
              </span>
              <span>
                <span className="block font-semibold text-foreground">Advanced weekly rules</span>
                <span className="block text-sm text-muted-foreground">
                  Optional recurring windows. Daily slots are usually simpler.
                </span>
              </span>
            </span>
            {expandedSections.rules ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {expandedSections.rules && (
            <div className="grid gap-3 border-t border-foreground/10 p-5">
              {editingRuleDay === null ? (
                DAYS.map((day, index) => {
                  const rule = rules.find((item) => item.weekday === index)

                  return (
                    <div
                      key={day}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-foreground/10 bg-background/70 p-3"
                    >
                      <div>
                        <p className="font-medium text-foreground">{day}</p>
                        {rule ? (
                          <p className="text-sm text-muted-foreground">
                            {rule.start_time.slice(0, 5)} - {rule.end_time.slice(0, 5)}
                            <span className="ml-2 text-xs">Buffer: {rule.buffer_minutes} min</span>
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not set</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => {
                            if (rule) {
                              setRuleStart(rule.start_time.slice(0, 5))
                              setRuleEnd(rule.end_time.slice(0, 5))
                              setRuleBuffer(rule.buffer_minutes.toString())
                            } else {
                              setRuleStart('09:00')
                              setRuleEnd('17:00')
                              setRuleBuffer('0')
                            }
                            setEditingRuleDay(index)
                          }}
                        >
                          {rule ? 'Edit' : 'Set'}
                        </Button>
                        {rule && (
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="rounded-full text-muted-foreground hover:text-destructive"
                            onClick={() => deleteRule(index)}
                            disabled={processingActionId?.startsWith('delete-rule')}
                            aria-label={`Remove ${day} rule`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="rounded-2xl border border-foreground/10 bg-background/70 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{DAYS[editingRuleDay]}</h3>
                    <Button size="icon-sm" variant="ghost" onClick={() => setEditingRuleDay(null)} className="rounded-full">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium">Start time</label>
                      <Input type="time" value={ruleStart} onChange={(event) => setRuleStart(event.target.value)} className="mt-1 rounded-full" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End time</label>
                      <Input type="time" value={ruleEnd} onChange={(event) => setRuleEnd(event.target.value)} className="mt-1 rounded-full" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Buffer minutes</label>
                      <Input type="number" value={ruleBuffer} onChange={(event) => setRuleBuffer(event.target.value)} min="0" max="120" className="mt-1 rounded-full" />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={saveRule}
                      disabled={processingActionId?.startsWith('rule-')}
                      className="flex-1 rounded-full"
                    >
                      {processingActionId?.startsWith('rule-') && <Loader2 className="h-4 w-4 animate-spin" />}
                      Save rule
                    </Button>
                    <Button variant="outline" onClick={() => setEditingRuleDay(null)} className="flex-1 rounded-full">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        <Card className="overflow-hidden rounded-[1.75rem] border-foreground/10 bg-card/80 shadow-sm">
          <button
            onClick={() => toggleSection('blockedTimes')}
            className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-muted/35"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Ban className="h-4 w-4" />
              </span>
              <span>
                <span className="block font-semibold text-foreground">Blocked time</span>
                <span className="block text-sm text-muted-foreground">
                  Hide holidays, personal time, or unavailable hours.
                </span>
              </span>
            </span>
            {expandedSections.blockedTimes ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {expandedSections.blockedTimes && (
            <div className="grid gap-4 border-t border-foreground/10 p-5">
              <div className="grid gap-3">
                <div>
                  <label className="text-sm font-medium">Start date and time</label>
                  <Input type="datetime-local" value={blockStart} onChange={(event) => setBlockStart(event.target.value)} className="mt-1 rounded-full" />
                </div>
                <div>
                  <label className="text-sm font-medium">End date and time</label>
                  <Input type="datetime-local" value={blockEnd} onChange={(event) => setBlockEnd(event.target.value)} className="mt-1 rounded-full" />
                </div>
                <div>
                  <label className="text-sm font-medium">Reason</label>
                  <Input
                    type="text"
                    placeholder="Holiday, personal time, training"
                    value={blockReason}
                    onChange={(event) => setBlockReason(event.target.value)}
                    className="mt-1 rounded-full"
                  />
                </div>
              </div>

              <Button
                onClick={addBlockedTime}
                disabled={processingActionId === 'add-blocked' || !blockStart || !blockEnd}
                className="rounded-full"
              >
                {processingActionId === 'add-blocked' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add blocked time
              </Button>

              <div className="grid gap-2">
                {blockedTimes.length > 0 ? (
                  blockedTimes.map((blocked) => (
                    <div key={blocked.id} className="flex items-start justify-between gap-3 rounded-2xl border border-foreground/10 bg-background/70 p-3">
                      <div className="flex min-w-0 items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {new Date(blocked.start_at).toLocaleDateString()} {new Date(blocked.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                            {new Date(blocked.end_at).toLocaleDateString()} {new Date(blocked.end_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {blocked.reason && <p className="mt-1 text-xs text-muted-foreground">{blocked.reason}</p>}
                        </div>
                      </div>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => deleteBlockedTime(blocked.id)}
                        disabled={processingActionId === `delete-blocked-${blocked.id}`}
                        className="rounded-full text-muted-foreground hover:text-destructive"
                        aria-label="Delete blocked time"
                      >
                        {processingActionId === `delete-blocked-${blocked.id}` ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-foreground/15 bg-background/65 p-5 text-center">
                    <p className="text-sm text-muted-foreground">No blocked time set.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
