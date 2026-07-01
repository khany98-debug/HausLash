'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from './layout'
import { formatPence } from '@/lib/types'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  CalendarDays,
  Clock,
  CreditCard,
  Inbox,
  Loader2,
  Sparkles,
  Users,
} from 'lucide-react'
import {
  AdminEmptyState,
  AdminLoadingState,
  AdminPageHeader,
  AdminStatCard,
} from '@/components/admin/admin-page-shell'

interface BookingRow {
  id: string
  service_name: string
  customer_name: string
  customer_email: string
  customer_phone: string
  start_at: string
  end_at: string
  status: string
  deposit_amount_pence: number
  price_pence: number | null
  notes: string | null
  created_at: string
  duration_minutes: number
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-800',
  pending_payment: 'bg-amber-100 text-amber-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
  refunded: 'bg-gray-100 text-gray-800',
}

export default function AdminBookingsPage() {
  const { token } = useAdminAuth()
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  
  // Cancel modal state
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<BookingRow | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelLoading, setCancelLoading] = useState(false)
  
  // Reschedule modal state
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [selectedBookingForReschedule, setSelectedBookingForReschedule] = useState<BookingRow | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')
  const [rescheduleReason, setRescheduleReason] = useState('')
  const [rescheduleLoading, setRescheduleLoading] = useState(false)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetch(`/api/admin/bookings?status=${statusFilter}&page=1`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setBookings(data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [token, statusFilter])

  const confirmedBookings = bookings.filter((booking) => booking.status === 'confirmed')
  const pendingBookings = bookings.filter((booking) => booking.status === 'pending_payment')
  const upcomingBookings = bookings.filter(
    (booking) =>
      ['confirmed', 'pending_payment'].includes(booking.status) &&
      new Date(booking.start_at).getTime() >= Date.now()
  )
  const todayKey = format(new Date(), 'yyyy-MM-dd')
  const todayBookings = bookings.filter(
    (booking) =>
      format(new Date(booking.start_at), 'yyyy-MM-dd') === todayKey &&
      !['cancelled', 'refunded'].includes(booking.status)
  )
  const depositTotal = bookings
    .filter((booking) => ['confirmed', 'completed'].includes(booking.status))
    .reduce((sum, booking) => sum + (booking.deposit_amount_pence || 0), 0)

  const handleCancelClick = (booking: BookingRow) => {
    setSelectedBookingForCancel(booking)
    setCancelReason('')
    setShowCancelDialog(true)
  }

  const handleRescheduleClick = (booking: BookingRow) => {
    setSelectedBookingForReschedule(booking)
    const startDate = new Date(booking.start_at)
    setRescheduleDate(format(startDate, 'yyyy-MM-dd'))
    setRescheduleTime(format(startDate, 'HH:mm'))
    setRescheduleReason('')
    setShowRescheduleDialog(true)
  }

  const handleConfirmCancel = async () => {
    if (!selectedBookingForCancel || !token) return
    
    setCancelLoading(true)
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cancel',
          bookingId: selectedBookingForCancel.id,
          reason: cancelReason || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to cancel booking'}`)
        return
      }

      // Refresh bookings
      const listResponse = await fetch(`/api/admin/bookings?status=${statusFilter}&page=1`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await listResponse.json()
      setBookings(data.bookings || [])

      setShowCancelDialog(false)
      setSelectedBookingForCancel(null)
      setCancelReason('')
      setActionMessage('Appointment cancelled and the customer cancellation email has been sent.')
    } catch (error) {
      console.error('Error cancelling booking:', error)
      setActionMessage('The cancellation could not be completed. Please try again.')
    } finally {
      setCancelLoading(false)
    }
  }

  const handleConfirmReschedule = async () => {
    if (!selectedBookingForReschedule || !token || !rescheduleDate || !rescheduleTime) {
      alert('Please enter a date and time')
      return
    }

    setRescheduleLoading(true)
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reschedule',
          bookingId: selectedBookingForReschedule.id,
          newDate: rescheduleDate,
          newTime: rescheduleTime,
          reason: rescheduleReason || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to reschedule booking'}`)
        return
      }

      // Refresh bookings
      const listResponse = await fetch(`/api/admin/bookings?status=${statusFilter}&page=1`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await listResponse.json()
      setBookings(data.bookings || [])

      setShowRescheduleDialog(false)
      setSelectedBookingForReschedule(null)
      setRescheduleDate('')
      setRescheduleTime('')
      setRescheduleReason('')
      setActionMessage('Appointment rescheduled and the customer update email has been sent.')
    } catch (error) {
      console.error('Error rescheduling booking:', error)
      setActionMessage('The reschedule could not be completed. Please try again.')
    } finally {
      setRescheduleLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <AdminPageHeader
        eyebrow="Studio command"
        title="Bookings"
        description="Manage upcoming appointments, reschedule customers, and keep every booking status tidy from one calm dashboard."
        action={
          <div className="flex w-full min-w-48 flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Filter
            </span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full rounded-full bg-background/80 focus-visible:ring-2 focus-visible:ring-primary md:w-[190px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending_payment">Pending Payment</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Today"
          value={todayBookings.length}
          detail="Appointments happening today"
          icon={CalendarDays}
        />
        <AdminStatCard
          label="Upcoming"
          value={upcomingBookings.length}
          detail={`${confirmedBookings.length} confirmed in this view`}
          icon={Clock}
          tone="success"
        />
        <AdminStatCard
          label="Needs Payment"
          value={pendingBookings.length}
          detail="Pending appointments to watch"
          icon={Inbox}
          tone={pendingBookings.length > 0 ? 'warning' : 'neutral'}
        />
        <AdminStatCard
          label="Deposits"
          value={formatPence(depositTotal)}
          detail="Confirmed and completed deposits"
          icon={CreditCard}
        />
      </div>

      {actionMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-sm">
          {actionMessage}
        </div>
      )}

      {loading ? (
        <AdminLoadingState label="Loading bookings..." />
      ) : bookings.length === 0 ? (
        <AdminEmptyState
          title="No bookings found"
          description="Once customers reserve a lash lift, their appointments and details will appear here."
          icon={Users}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-card/80 shadow-sm backdrop-blur md:block">
            <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Appointment list</p>
                <p className="text-xs text-muted-foreground">Newest bookings in the selected status view.</p>
              </div>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-foreground/10 bg-muted/35">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Customer</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Service</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Date & Time</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Deposit</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-foreground/10 last:border-0 hover:bg-muted/25">
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground">{b.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{b.customer_email}</div>
                      <div className="text-xs text-muted-foreground">{b.customer_phone}</div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{b.service_name}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {format(new Date(b.start_at), 'EEE d MMM yyyy')}
                      <br />
                      <span className="text-xs">{format(new Date(b.start_at), 'HH:mm')}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[b.status] || 'bg-muted text-muted-foreground'}`}
                      >
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {formatPence(b.deposit_amount_pence)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {b.status === 'confirmed' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRescheduleClick(b)}
                              className="text-xs focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelClick(b)}
                              className="text-xs focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {b.status === 'pending_payment' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelClick(b)}
                            className="text-xs focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3">
            {bookings.map((b) => (
              <div key={b.id} className="space-y-3 rounded-2xl border border-foreground/10 bg-card/80 p-4 shadow-sm">
                {/* Header: Customer Name and Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{b.customer_name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{b.customer_email}</p>
                  </div>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${STATUS_COLORS[b.status] || 'bg-muted text-muted-foreground'}`}
                  >
                    {b.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Service and Phone */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Service</p>
                    <p className="font-medium text-foreground">{b.service_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date & Time</p>
                    <p className="font-medium text-foreground">
                      {format(new Date(b.start_at), 'MMM d, HH:mm')}
                    </p>
                  </div>
                </div>

                {/* Deposit and Phone */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Deposit</p>
                    <p className="font-medium text-foreground">{formatPence(b.deposit_amount_pence)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground text-sm">{b.customer_phone}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {b.status === 'confirmed' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRescheduleClick(b)}
                        className="flex-1 text-xs h-9 focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Reschedule
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelClick(b)}
                        className="flex-1 text-xs h-9 focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {b.status === 'pending_payment' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleCancelClick(b)}
                      className="w-full text-xs h-9 focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the appointment for{' '}
              <strong>{selectedBookingForCancel?.customer_name}</strong> on{' '}
              <strong>{selectedBookingForCancel && format(new Date(selectedBookingForCancel.start_at), 'EEEE, d MMMM yyyy')}</strong>?
              <br />
              <br />
              A cancellation email will be sent to the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-3 py-4">
            <div>
              <Label htmlFor="cancel-reason" className="text-sm">
                Cancellation Reason (Optional)
              </Label>
              <Textarea
                id="cancel-reason"
                placeholder="Enter reason for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="mt-2 text-sm"
                rows={3}
              />
            </div>
          </div>

          <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmCancel}
            disabled={cancelLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {cancelLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cancel Appointment
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Change the appointment for{' '}
              <strong>{selectedBookingForReschedule?.customer_name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">New Date</Label>
              <Input
                id="reschedule-date"
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reschedule-time">New Time</Label>
              <Input
                id="reschedule-time"
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reschedule-reason">Reason for Reschedule (Optional)</Label>
              <Textarea
                id="reschedule-reason"
                placeholder="Enter reason for rescheduling..."
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                className="text-sm"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReschedule}
              disabled={rescheduleLoading || !rescheduleDate || !rescheduleTime}
            >
              {rescheduleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
