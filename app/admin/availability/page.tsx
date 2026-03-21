'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '../layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Trash2, Copy, ChevronDown, ChevronUp, Clock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

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

export default function AdminAvailabilityPage() {
  const { token } = useAdminAuth()

  // State
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([])
  const [loading, setLoading] = useState(true)
  const [processingActionId, setProcessingActionId] = useState<string | null>(null)

  // Daily Slots form
  const [slotDate, setSlotDate] = useState('')
  const [slotStart, setSlotStart] = useState('')
  const [slotEnd, setSlotEnd] = useState('')

  // Copy Schedule form
  const [copySourceDate, setCopySourceDate] = useState('')
  const [copyStartDate, setCopyStartDate] = useState('')
  const [copyEndDate, setCopyEndDate] = useState('')
  const [copyDays, setCopyDays] = useState<number[]>([6, 0]) // default Sat + Sun
  const [copyPreview, setCopyPreview] = useState<string[]>([])

  // Rules form
  const [editingRuleDay, setEditingRuleDay] = useState<number | null>(null)
  const [ruleStart, setRuleStart] = useState('')
  const [ruleEnd, setRuleEnd] = useState('')
  const [ruleBuffer, setRuleBuffer] = useState('15')

  // Blocked times form
  const [blockStart, setBlockStart] = useState('')
  const [blockEnd, setBlockEnd] = useState('')
  const [blockReason, setBlockReason] = useState('')

  // UI state
  const [expandedSections, setExpandedSections] = useState({
    rules: true,
    dailySlots: true,
    copySlots: false,
    blockedTimes: false,
  })

  // Load data on mount
  useEffect(() => {
    if (!token) return
    loadAllData()
  }, [token])

  async function loadAllData() {
    try {
      setLoading(true)
      const [rulesRes, blockedRes] = await Promise.all([
        fetch('/api/admin/availability', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/availability', { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }),
      ])

      if (rulesRes.ok) {
        const data = await rulesRes.json()
        setRules(data.rules || [])
      }

      if (blockedRes.ok) {
        const data = await blockedRes.json()
        setBlockedTimes(data.blocked || [])
      }
    } catch (error) {
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
    } catch (error) {
      toast.error('Failed to load slots')
    }
  }

  function validateTimeRange(start: string, end: string, fieldName = 'Time') {
    if (!start || !end) return true // Let required validation handle this
    if (start >= end) {
      toast.error(`${fieldName}: End time must be after start time`)
      return false
    }
    return true
  }

  async function createSlot() {
    if (!slotDate) {
      toast.error('Please select a date')
      return
    }

    if (!validateTimeRange(slotStart, slotEnd, 'Slot time')) return

    setProcessingActionId('create-slot')
    try {
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: slotDate,
          start_time: slotStart,
          end_time: slotEnd,
        }),
      })

      if (res.ok) {
        toast.success('Slot added successfully')
        setSlotStart('')
        setSlotEnd('')
        await loadSlots(slotDate)
      } else {
        const error = await res.json()
        toast.error(error.error || 'Failed to add slot')
      }
    } catch (error) {
      toast.error('Failed to add slot')
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
    } catch (error) {
      toast.error('Failed to delete slot')
    } finally {
      setProcessingActionId(null)
    }
  }

  function generateCopyPreview() {
    if (!copyStartDate || !copyEndDate) {
      setCopyPreview([])
      return
    }

    const dates: string[] = []
    const start = new Date(copyStartDate)
    const end = new Date(copyEndDate)

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const weekday = d.getDay()
      if (copyDays.includes(weekday)) {
        dates.push(d.toISOString().split('T')[0])
      }
    }

    setCopyPreview(dates)
  }

  useEffect(() => {
    generateCopyPreview()
  }, [copyStartDate, copyEndDate, copyDays])

  async function copySlots() {
    if (!copySourceDate || !copyStartDate || !copyEndDate) {
      toast.error('Please fill in all copy fields')
      return
    }

    if (copyPreview.length === 0) {
      toast.error('No dates selected to copy to')
      return
    }

    setProcessingActionId('copy-slots')
    try {
      const sourceRes = await fetch(`/api/admin/slots?date=${copySourceDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const sourceData = await sourceRes.json()
      const sourceSlots = sourceData.slots || []

      if (!sourceSlots.length) {
        toast.error('No slots found on source date')
        setProcessingActionId(null)
        return
      }

      let created = 0
      let failed = 0

      for (const date of copyPreview) {
        for (const slot of sourceSlots) {
          try {
            const res = await fetch('/api/admin/slots', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                date,
                start_time: slot.start_time.slice(0, 5),
                end_time: slot.end_time.slice(0, 5),
              }),
            })

            if (res.ok) {
              created++
            } else {
              failed++
            }
          } catch {
            failed++
          }
        }
      }

      if (created > 0) {
        toast.success(`${created} slot${created !== 1 ? 's' : ''} copied successfully${failed > 0 ? ` (${failed} failed)` : ''}`)
      } else {
        toast.error('No slots were copied')
      }
    } catch (error) {
      toast.error('Failed to copy slots')
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      toast.error('Failed to remove blocked time')
    } finally {
      setProcessingActionId(null)
    }
  }

  function toggleSection(section: keyof typeof expandedSections) {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading availability settings...
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div>
        <h1 className="font-serif text-3xl text-foreground">Availability Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage your weekly availability rules, specific time slots, and blocked times
        </p>
      </div>

      {/* WEEKLY AVAILABILITY RULES */}
      <Card className="border-primary/10">
        <button
          onClick={() => toggleSection('rules')}
          className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-lg">Weekly Availability Rules</h2>
            <Badge variant="outline" className="text-xs">
              {rules.length > 0 ? `${rules.length} days` : 'Setup required'}
            </Badge>
          </div>
          {expandedSections.rules ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {expandedSections.rules && (
          <div className="border-t border-primary/10 p-4 gap-4 flex flex-col">
            <p className="text-sm text-muted-foreground">
              Set your recurring availability for each day of the week. These are the default hours shown to customers.
            </p>

            {editingRuleDay === null ? (
              <div className="grid gap-3">
                {DAYS.map((day, index) => {
                  const rule = rules.find((r) => r.weekday === index)
                  return (
                    <div key={day} className="flex items-center justify-between p-3 border border-primary/10 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{day}</p>
                        {rule ? (
                          <p className="text-sm text-muted-foreground">
                            {rule.start_time} — {rule.end_time}
                            <span className="ml-2 text-xs">(Buffer: {rule.buffer_minutes}min)</span>
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">Not set</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (rule) {
                              setRuleStart(rule.start_time)
                              setRuleEnd(rule.end_time)
                              setRuleBuffer(rule.buffer_minutes.toString())
                            } else {
                              setRuleStart('09:00')
                              setRuleEnd('17:00')
                              setRuleBuffer('15')
                            }
                            setEditingRuleDay(index)
                          }}
                        >
                          {rule ? 'Edit' : 'Set'}
                        </Button>
                        {rule && (
                          <Button size="sm" variant="ghost" onClick={() => deleteRule(index)} disabled={processingActionId?.startsWith('delete-rule')}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-4 border border-primary/20 rounded-lg bg-accent/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{DAYS[editingRuleDay]}</h3>
                  <Button size="sm" variant="ghost" onClick={() => setEditingRuleDay(null)}>
                    ✕
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium">Start Time</label>
                    <Input type="time" value={ruleStart} onChange={(e) => setRuleStart(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Time</label>
                    <Input type="time" value={ruleEnd} onChange={(e) => setRuleEnd(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Buffer (minutes)</label>
                    <Input type="number" value={ruleBuffer} onChange={(e) => setRuleBuffer(e.target.value)} min="0" max="120" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={saveRule}
                    disabled={processingActionId?.startsWith('rule-')}
                    className="flex-1"
                  >
                    {processingActionId?.startsWith('rule-') && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setEditingRuleDay(null)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* DAILY SLOTS */}
      <Card className="border-primary/10">
        <button
          onClick={() => toggleSection('dailySlots')}
          className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-lg">Daily Slots</h2>
            <Badge variant="outline" className="text-xs">
              {slots.length} slot{slots.length !== 1 ? 's' : ''} on {slotDate || 'selected date'}
            </Badge>
          </div>
          {expandedSections.dailySlots ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {expandedSections.dailySlots && (
          <div className="border-t border-primary/10 p-4 gap-4 flex flex-col">
            <p className="text-sm text-muted-foreground">
              Add specific time slots for individual dates. These override your weekly availability rules.
            </p>

            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={slotDate}
                  onChange={(e) => {
                    setSlotDate(e.target.value)
                    loadSlots(e.target.value)
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <Input type="time" value={slotStart} onChange={(e) => setSlotStart(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">End Time</label>
                <Input type="time" value={slotEnd} onChange={(e) => setSlotEnd(e.target.value)} />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={createSlot}
                  disabled={processingActionId === 'create-slot' || !slotDate}
                  className="w-full"
                >
                  {processingActionId === 'create-slot' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Slot
                </Button>
              </div>
            </div>

            {slotDate && (
              <div>
                {slots.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Slots for {slotDate}</p>
                    {slots.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-3 border border-primary/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {slot.start_time.slice(0, 5)} — {slot.end_time.slice(0, 5)}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSlot(slot.id)}
                          disabled={processingActionId?.startsWith('delete-slot')}
                        >
                          {processingActionId === `delete-slot-${slot.id}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 border border-dashed border-primary/20 rounded-lg bg-accent/20 text-center">
                    <p className="text-sm text-muted-foreground">No slots added for this date yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* COPY SCHEDULE */}
      <Card className="border-primary/10">
        <button
          onClick={() => toggleSection('copySlots')}
          className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-lg">Copy Schedule</h2>
            {copyPreview.length > 0 && <Badge className="text-xs">{copyPreview.length} dates selected</Badge>}
          </div>
          {expandedSections.copySlots ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {expandedSections.copySlots && (
          <div className="border-t border-primary/10 p-4 gap-4 flex flex-col">
            <p className="text-sm text-muted-foreground">
              Copy all slots from a source date to multiple dates. Filter by specific days of the week.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium">Source Date (copy from)</label>
                <Input
                  type="date"
                  value={copySourceDate}
                  onChange={(e) => setCopySourceDate(e.target.value)}
                  placeholder="Choose date to copy from"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Start Date (copy to)</label>
                <Input
                  type="date"
                  value={copyStartDate}
                  onChange={(e) => setCopyStartDate(e.target.value)}
                  placeholder="First date in range"
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date (copy to)</label>
                <Input
                  type="date"
                  value={copyEndDate}
                  onChange={(e) => setCopyEndDate(e.target.value)}
                  placeholder="Last date in range"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Copy to these days of the week</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day, index) => (
                  <Button
                    key={day}
                    size="sm"
                    variant={copyDays.includes(index) ? 'default' : 'outline'}
                    onClick={() => {
                      if (copyDays.includes(index)) {
                        setCopyDays(copyDays.filter((d) => d !== index))
                      } else {
                        setCopyDays([...copyDays, index])
                      }
                    }}
                  >
                    {day.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </div>

            {copyPreview.length > 0 && (
              <div className="p-3 border border-primary/20 rounded-lg bg-accent/20">
                <p className="text-sm font-medium mb-2">Will copy to {copyPreview.length} dates:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {copyPreview.map((date) => (
                    <div key={date} className="text-xs px-2 py-1 bg-primary/10 rounded text-center">
                      {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={copySlots}
              disabled={processingActionId === 'copy-slots' || copyPreview.length === 0}
              className="w-full"
            >
              {processingActionId === 'copy-slots' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Copy className="h-4 w-4 mr-2" />
              Copy Slots ({copyPreview.length})
            </Button>
          </div>
        )}
      </Card>

      {/* BLOCKED TIMES */}
      <Card className="border-primary/10">
        <button
          onClick={() => toggleSection('blockedTimes')}
          className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-lg">Blocked Times</h2>
            <Badge variant="outline" className="text-xs">
              {blockedTimes.length} blocked
            </Badge>
          </div>
          {expandedSections.blockedTimes ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {expandedSections.blockedTimes && (
          <div className="border-t border-primary/10 p-4 gap-4 flex flex-col">
            <p className="text-sm text-muted-foreground">
              Mark time periods as unavailable (vacation, personal time, etc). Customers won't be able to book these times.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium">Start Date & Time</label>
                <Input type="datetime-local" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">End Date & Time</label>
                <Input type="datetime-local" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} />
              </div>
              <div className="flex gap-2 items-end flex-col">
                <label className="text-sm font-medium w-full">Reason (optional)</label>
                <Input
                  type="text"
                  placeholder="e.g., Vacation, Personal time"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="!m-0"
                />
              </div>
            </div>

            <Button
              onClick={addBlockedTime}
              disabled={processingActionId === 'add-blocked' || !blockStart || !blockEnd}
              className="w-full"
            >
              {processingActionId === 'add-blocked' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Blocked Time
            </Button>

            {blockedTimes.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Blocked Times</p>
                {blockedTimes.map((blocked) => (
                  <div key={blocked.id} className="flex items-start justify-between p-3 border border-primary/10 rounded-lg">
                    <div className="flex items-start gap-2 flex-1">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {new Date(blocked.start_at).toLocaleDateString()} {new Date(blocked.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} —{' '}
                          {new Date(blocked.end_at).toLocaleDateString()} {new Date(blocked.end_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {blocked.reason && <p className="text-xs text-muted-foreground mt-1">{blocked.reason}</p>}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteBlockedTime(blocked.id)}
                      disabled={processingActionId?.startsWith('delete-blocked')}
                      className="flex-shrink-0"
                    >
                      {processingActionId === `delete-blocked-${blocked.id}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 border border-dashed border-primary/20 rounded-lg bg-accent/20 text-center">
                <p className="text-sm text-muted-foreground">No blocked times set</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}