'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '../layout'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format, addDays, isSameDay, parseISO } from 'date-fns'
import { Clock, Phone, Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Booking {
  id: string
  service_name: string
  customer_name: string
  customer_email: string
  customer_phone: string
  start_at: string
  end_at: string
  status: string
  notes?: string
  duration_minutes: number
  price_pence?: number
}

export default function AdminCalendarPage() {
  const { token } = useAdminAuth()

  const [date, setDate] = useState<Date>(new Date())
  const [availability, setAvailability] = useState<Date[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookedDays, setBookedDays] = useState<Date[]>([])
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('timeline')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loadingBookingId, setLoadingBookingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!token) return
    fetch('/api/admin/calendar', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const availableDates = (data.availability || []).map((d: string) => new Date(d))
        setAvailability(availableDates)
        setBookings((data.bookings || []) as Booking[])
        setBookedDays((data.bookedDays || []).map((d: string) => new Date(d)))
      })
  }, [token])

  // Get bookings for selected date
  const selectedDateStr = date ? date.toISOString().split('T')[0] : null
  const bookingsForDate = selectedDateStr
    ? bookings.filter((b) => b.start_at && b.start_at.startsWith(selectedDateStr))
    : []

  // Get upcoming bookings (next 7 days)
  const upcomingBookings = bookings
    .filter((b) => {
      const bookingDate = parseISO(b.start_at)
      const today = new Date()
      const sevenDaysFromNow = addDays(today, 7)
      return bookingDate >= today && bookingDate <= sevenDaysFromNow
    })
    .filter((b) => {
      if (statusFilter !== 'all') return b.status === statusFilter
      return true
    })
    .filter((b) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        b.customer_name.toLowerCase().includes(query) ||
        b.customer_email.toLowerCase().includes(query) ||
        b.service_name.toLowerCase().includes(query) ||
        b.customer_phone.includes(query)
      )
    })
    .sort((a, b) => parseISO(a.start_at).getTime() - parseISO(b.start_at).getTime())

  // Handle booking status update
  const handleBookingAction = async (bookingId: string, action: 'confirm' | 'complete' | 'cancel') => {
    if (!token) return

    setLoadingBookingId(bookingId)
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: action === 'complete' ? 'mark_complete' : action,
          bookingId,
          reason: action === 'cancel' ? 'Cancelled by admin' : undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update booking')
      }

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, status: action === 'complete' ? 'completed' : action }
            : b
        )
      )

      const actionLabel = action === 'complete' ? 'marked as completed' : action + 'led'
      toast.success(`Booking ${actionLabel}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update booking')
    } finally {
      setLoadingBookingId(null)
    }
  }

  // Get stats
  const allUpcomingBookings = bookings
    .filter((b) => {
      const bookingDate = parseISO(b.start_at)
      const today = new Date()
      const sevenDaysFromNow = addDays(today, 7)
      return bookingDate >= today && bookingDate <= sevenDaysFromNow
    })
  const totalUpcoming = allUpcomingBookings.length
  const confirmedCount = allUpcomingBookings.filter((b) => b.status === 'confirmed').length
  const pendingCount = allUpcomingBookings.filter((b) => b.status === 'pending_payment').length
  const completedCount = allUpcomingBookings.filter((b) => b.status === 'completed').length
  
  // Calculate confirmed revenue (in pence)
  const confirmedRevenue = allUpcomingBookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.price_pence || 0), 0)
  const confirmedRevenueGBP = (confirmedRevenue / 100).toFixed(2)

  const statusConfig: Record<string, { bg: string; text: string; badgeBg: string }> = {
    confirmed: { bg: 'bg-green-50', text: 'text-green-700', badgeBg: 'bg-green-100' },
    pending_payment: { bg: 'bg-amber-50', text: 'text-amber-700', badgeBg: 'bg-amber-100' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-700', badgeBg: 'bg-red-100' },
    completed: { bg: 'bg-blue-50', text: 'text-blue-700', badgeBg: 'bg-blue-100' },
  }

  const getStatusConfig = (status: string) => statusConfig[status] || { bg: 'bg-gray-50', text: 'text-gray-700', badgeBg: 'bg-gray-100' }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-foreground">Booking Schedule</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            onClick={() => setViewMode('timeline')}
          >
            Timeline
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
          >
            Calendar
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      {viewMode === 'timeline' && (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            type="text"
            placeholder="Search by name, email, phone, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-1 flex-wrap">
            {(['all', 'confirmed', 'pending_payment', 'completed', 'cancelled'] as const).map((status) => (
              <Button
                key={status}
                size="sm"
                variant={statusFilter === status ? 'default' : 'outline'}
                onClick={() => setStatusFilter(status)}
                className="whitespace-nowrap text-xs"
              >
                {status === 'all' ? 'All' : status.replace('_', ' ')}
                {status !== 'all' && (
                  <span className="ml-1 text-xs font-semibold">
                    ({allUpcomingBookings.filter((b) => b.status === status).length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Timeline View (Default) */}
      {viewMode === 'timeline' && (
        <div className="flex flex-col gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-primary/10">
              <p className="text-sm text-muted-foreground mb-1">Upcoming (7 days)</p>
              <p className="text-2xl font-bold text-foreground">{totalUpcoming}</p>
              <p className="text-xs text-muted-foreground mt-1">{confirmedCount} confirmed</p>
            </Card>
            <Card className="p-4 border-primary/10">
              <p className="text-sm text-muted-foreground mb-1">Confirmed Revenue</p>
              <p className="text-2xl font-bold text-green-600">£{confirmedRevenueGBP}</p>
              <p className="text-xs text-muted-foreground mt-1">{confirmedCount + completedCount} bookings</p>
            </Card>
            <Card className="p-4 border-primary/10">
              <p className="text-sm text-muted-foreground mb-1">Pending Payment</p>
              <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Action needed</p>
            </Card>
            <Card className="p-4 border-primary/10">
              <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-blue-600">{totalUpcoming > 0 ? Math.round((completedCount / totalUpcoming) * 100) : 0}%</p>
              <p className="text-xs text-muted-foreground mt-1">{completedCount} completed</p>
            </Card>
          </div>

          {/* Upcoming Bookings Timeline */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-lg text-foreground">Next 7 Days</h2>
            {upcomingBookings.length === 0 ? (
              <Card className="p-6 text-center border-primary/10">
                <p className="text-muted-foreground">No upcoming bookings in the next 7 days</p>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Group bookings by day */}
                {Array.from(
                  upcomingBookings.reduce((acc, booking) => {
                    const dateKey = format(parseISO(booking.start_at), 'yyyy-MM-dd')
                    if (!acc.has(dateKey)) {
                      acc.set(dateKey, [])
                    }
                    acc.get(dateKey)!.push(booking)
                    return acc
                  }, new Map<string, Booking[]>())
                ).map(([dateKey, dayBookings]) => {
                  const dayDate = parseISO(dateKey)
                  const isToday = isSameDay(dayDate, new Date())

                  return (
                    <div key={dateKey} className="space-y-3">
                      {/* Day Header */}
                      <div className={`flex items-center gap-3 px-4 py-2 ${isToday ? 'bg-primary/10 rounded-lg' : ''}`}>
                        <div>
                          <h3 className={`font-semibold text-foreground ${isToday ? 'text-primary' : ''}`}>
                            {format(dayDate, 'EEEE, MMMM d')}
                          </h3>
                          {isToday && <p className="text-xs text-primary font-medium">Today</p>}
                        </div>
                        <div className="ml-auto text-sm text-muted-foreground">
                          {dayBookings.length} booking{dayBookings.length !== 1 ? 's' : ''}
                        </div>
                      </div>

                      {/* Bookings for this day */}
                      <div className="space-y-2">
                        {dayBookings
                          .sort((a, b) => parseISO(a.start_at).getTime() - parseISO(b.start_at).getTime())
                          .map((booking) => {
                            const bookingDate = parseISO(booking.start_at)
                            const config = getStatusConfig(booking.status)
                            const isServiceMobile = booking.service_name.toLowerCase().includes('mobile') || booking.service_name.toLowerCase().includes('outcall')

                            return (
                              <Card
                                key={booking.id}
                                className={`p-4 border-primary/10 transition-all hover:shadow-md ${config.bg}`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                  {/* Left: Time */}
                                  <div className="flex-shrink-0 flex items-center gap-3">
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-foreground">
                                        {format(bookingDate, 'HH:mm')}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {booking.duration_minutes}min
                                      </p>
                                    </div>
                                  </div>

                                  {/* Center: Service & Customer */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h3 className="font-semibold text-foreground truncate">{booking.service_name}</h3>
                                          <div className="flex gap-1 flex-shrink-0">
                                            {/* Service Type Badge */}
                                            <Badge variant="outline" className="text-xs whitespace-nowrap">
                                              {isServiceMobile ? '🚗 Mobile' : '🏢 Studio'}
                                            </Badge>
                                          </div>
                                        </div>
                                        <p className="text-sm font-medium text-foreground">{booking.customer_name}</p>
                                      </div>
                                      <Badge className={`whitespace-nowrap ${config.badgeBg} text-xs`}>
                                        {booking.status.replace('_', ' ')}
                                      </Badge>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5" />
                                        <a href={`mailto:${booking.customer_email}`} className="hover:text-foreground truncate">
                                          {booking.customer_email}
                                        </a>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-3.5 w-3.5" />
                                        <a href={`tel:${booking.customer_phone}`} className="hover:text-foreground">
                                          {booking.customer_phone}
                                        </a>
                                      </div>
                                    </div>

                                    {booking.notes && (
                                      <p className="text-xs text-muted-foreground mt-2 italic bg-white/30 px-2 py-1 rounded">
                                        {booking.notes}
                                      </p>
                                    )}
                                  </div>

                                  {/* Right: Actions */}
                                  <div className="flex items-center gap-1 flex-shrink-0 flex-wrap justify-end">
                                    {booking.status === 'pending_payment' && (
                                      <Button
                                        size="sm"
                                        variant="default"
                                        className="text-xs whitespace-nowrap"
                                        onClick={() => handleBookingAction(booking.id, 'confirm')}
                                        disabled={loadingBookingId === booking.id}
                                      >
                                        {loadingBookingId === booking.id ? (
                                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                        ) : (
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                        )}
                                        Confirm
                                      </Button>
                                    )}
                                    {booking.status === 'confirmed' && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs whitespace-nowrap"
                                        onClick={() => handleBookingAction(booking.id, 'complete')}
                                        disabled={loadingBookingId === booking.id}
                                      >
                                        {loadingBookingId === booking.id ? (
                                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                        ) : (
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                        )}
                                        Done
                                      </Button>
                                    )}
                                    {(booking.status === 'confirmed' || booking.status === 'pending_payment') && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs whitespace-nowrap text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleBookingAction(booking.id, 'cancel')}
                                        disabled={loadingBookingId === booking.id}
                                      >
                                        {loadingBookingId === booking.id ? (
                                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                        ) : (
                                          <XCircle className="h-3 w-3 mr-1" />
                                        )}
                                        Cancel
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            )
                          })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Calendar */}
            <div className="flex justify-center lg:justify-start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                required
                modifiers={{
                  booked: bookedDays,
                  available: availability,
                }}
                modifiersStyles={{
                  booked: { backgroundColor: '#ef4444', color: 'white' },
                  available: { backgroundColor: '#22c55e', color: 'white' },
                }}
              />
            </div>

            {/* Selected Date Bookings */}
            <div className="flex-1">
              <h2 className="font-semibold text-lg mb-4 text-foreground">
                {selectedDateStr ? `Bookings for ${format(date!, 'EEEE, MMMM d, yyyy')}` : 'Select a date'}
              </h2>

              {!date ? (
                <Card className="p-6 text-center border-primary/10">
                  <p className="text-muted-foreground">Please select a date to view bookings</p>
                </Card>
              ) : bookingsForDate.length === 0 ? (
                <Card className="p-6 text-center border-primary/10">
                  <p className="text-muted-foreground">No bookings for this date</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {bookingsForDate
                    .sort((a, b) => parseISO(a.start_at).getTime() - parseISO(b.start_at).getTime())
                    .map((booking) => {
                      const config = getStatusConfig(booking.status)
                      return (
                        <Card key={booking.id} className={`p-4 border-primary/10 ${config.bg}`}>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">{booking.service_name}</h3>
                              <p className="text-sm font-medium text-foreground">{booking.customer_name}</p>
                            </div>
                            <Badge className={`whitespace-nowrap ${config.badgeBg} text-xs`}>
                              {booking.status.replace('_', ' ')}
                            </Badge>
                          </div>

                          <div className="space-y-2 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5" />
                              <span>
                                {format(parseISO(booking.start_at), 'HH:mm')} -{' '}
                                {format(parseISO(booking.end_at), 'HH:mm')} ({booking.duration_minutes}min)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5" />
                              <a href={`mailto:${booking.customer_email}`} className="hover:text-foreground">
                                {booking.customer_email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5" />
                              <a href={`tel:${booking.customer_phone}`} className="hover:text-foreground">
                                {booking.customer_phone}
                              </a>
                            </div>
                          </div>

                          {booking.notes && (
                            <p className="text-sm text-muted-foreground italic px-3 py-2 bg-white/30 rounded">
                              {booking.notes}
                            </p>
                          )}
                        </Card>
                      )
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}