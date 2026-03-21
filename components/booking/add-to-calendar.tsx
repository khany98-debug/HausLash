'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export function AddToCalendarButton({
  title,
  startAt,
  endAt,
}: {
  title: string
  startAt: string
  endAt: string
}) {
  function handleDownload() {
    const start = new Date(startAt)
    const end = new Date(endAt)

    const pad = (n: number) => String(n).padStart(2, '0')
    const formatICS = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hauslash//Booking//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatICS(start)}`,
      `DTEND:${formatICS(end)}`,
      `SUMMARY:${title} - Hauslash`,
      'DESCRIPTION:Your Hauslash appointment. Please arrive with clean makeup-free eyes.',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hauslash-appointment.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button onClick={handleDownload} className="gap-2 rounded-full">
      <Download className="h-4 w-4" />
      Add to Calendar
    </Button>
  )
}
