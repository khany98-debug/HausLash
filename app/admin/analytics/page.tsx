'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '../layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPence } from '@/lib/types'
import { format } from 'date-fns'
import { TrendingUp, DollarSign, Calendar, BarChart3 } from 'lucide-react'
import {
  AdminEmptyState,
  AdminLoadingState,
  AdminPageHeader,
  AdminStatCard,
} from '@/components/admin/admin-page-shell'

interface AnalyticsData {
  period: string
  summary: {
    totalRevenue: number
    totalBookings: number
    averageRevenue: number
  }
  statusBreakdown: Array<{
    status: string
    count: number
  }>
  popularServices: Array<{
    name: string
    booking_count: number
    total_revenue: number
  }>
  trends: Array<{
    date: string
    bookings: number
    confirmed: number
    cancelled: number
  }>
  upcomingAppointments: Array<{
    id: string
    customer_name: string
    customer_email: string
    start_at: string
    service_name: string
    deposit_amount_pence: number
  }>
}

export default function AdminAnalyticsPage() {
  const { token } = useAdminAuth()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    if (!token) return

    setLoading(true)
    fetch(`/api/admin/analytics?period=${period}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        // Validate that we got the expected structure
        if (data && data.summary && data.statusBreakdown !== undefined) {
          setData(data)
        } else {
          console.error('Invalid analytics response structure:', data)
          setData(null)
        }
      })
      .catch((error) => {
        console.error('Error fetching analytics:', error)
        setData(null)
      })
      .finally(() => setLoading(false))
  }, [token, period])

  if (loading) {
    return <AdminLoadingState label="Loading analytics..." />
  }

  if (!data) {
    return (
      <AdminEmptyState
        title="Analytics could not be loaded"
        description="Refresh the page and try again. If it continues, the analytics API may need checking."
        icon={BarChart3}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        eyebrow="Performance"
        title="Analytics"
        description="Track revenue, booking health, popular services, and the appointments coming up next."
        action={
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full rounded-full bg-background/80 sm:w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="365">Last Year</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AdminStatCard
          label="Total revenue"
          value={formatPence(data.summary?.totalRevenue || 0)}
          detail={`From ${data.summary?.totalBookings || 0} bookings`}
          icon={DollarSign}
          tone="success"
        />
        <AdminStatCard
          label="Total bookings"
          value={data.summary?.totalBookings || 0}
          detail={`Average ${formatPence(data.summary?.averageRevenue || 0)} per booking`}
          icon={Calendar}
        />
        <AdminStatCard
          label="Confirmation rate"
          value={`${data.summary && data.summary.totalBookings > 0 && data.statusBreakdown
            ? Math.round(
                ((data.statusBreakdown.find((s) => s.status === 'confirmed')?.count || 0) /
                  data.summary.totalBookings) *
                  100
              )
            : 0}%`}
          detail="Confirmed appointments"
          icon={TrendingUp}
        />
      </div>

      {/* Status Breakdown */}
      <Card className="rounded-[1.5rem] border-foreground/10 bg-card/80 p-6 shadow-sm">
        <h2 className="font-serif text-xl text-foreground mb-4">Booking Status</h2>
        {data.statusBreakdown && data.statusBreakdown.length > 0 ? (
          <div className="space-y-3">
            {data.statusBreakdown.map((status) => (
              <div key={status.status} className="flex items-center justify-between">
                <span className="text-foreground capitalize">
                  {status.status.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{
                        width: `${data.summary.totalBookings > 0 ? (status.count / data.summary.totalBookings) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-10 text-right">
                    {status.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No booking data available</p>
        )}
      </Card>

      {/* Popular Services */}
      <Card className="rounded-[1.5rem] border-foreground/10 bg-card/80 p-6 shadow-sm">
        <h2 className="font-serif text-xl text-foreground mb-4">Popular Services</h2>
        {data.popularServices && data.popularServices.length > 0 ? (
          <div className="space-y-3">
            {data.popularServices.map((service) => (
              <div key={service.name} className="flex items-center justify-between pb-3 border-b border-primary/10 last:border-0">
                <div>
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {service.booking_count} booking{service.booking_count !== 1 ? 's' : ''}
                  </p>
                </div>
                <p className="font-semibold text-primary">
                  {formatPence(service.total_revenue || 0)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No service data available</p>
        )}
      </Card>

      {/* Upcoming Appointments */}
      <Card className="rounded-[1.5rem] border-foreground/10 bg-card/80 p-6 shadow-sm">
        <h2 className="font-serif text-xl text-foreground mb-4">Upcoming Appointments</h2>
        {data.upcomingAppointments && data.upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {data.upcomingAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between pb-3 border-b border-primary/10 last:border-0">
                <div>
                  <p className="font-medium text-foreground">{apt.customer_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {apt.service_name} • {format(new Date(apt.start_at), 'MMM d, HH:mm')}
                  </p>
                </div>
                <Badge variant="secondary">
                  {formatPence(apt.deposit_amount_pence)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No upcoming appointments</p>
        )}
      </Card>
    </div>
  )
}
