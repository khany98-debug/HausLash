import { getAppointmentLocationDetails, STUDIO_ADDRESS } from '@/lib/appointment-location'

export { STUDIO_ADDRESS }

type CalendarEventInput = {
  uid: string
  title: string
  startAt: Date
  endAt: Date
  description: string
  location?: string
}

function toCalendarDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

export function getBookingEndAt(
  startAt: string | Date,
  endAt?: string | Date | null,
  durationMinutes = 60
) {
  if (endAt) {
    return new Date(endAt)
  }

  const start = new Date(startAt)
  return new Date(start.getTime() + durationMinutes * 60 * 1000)
}

export function createGoogleCalendarUrl(event: CalendarEventInput) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toCalendarDate(event.startAt)}/${toCalendarDate(event.endAt)}`,
    details: event.description,
    location: event.location || STUDIO_ADDRESS,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function createIcsCalendar(event: CalendarEventInput, method = 'PUBLISH') {
  const location = event.location || STUDIO_ADDRESS
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hauslash//Appointments//EN',
    'CALSCALE:GREGORIAN',
    `METHOD:${method}`,
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${toCalendarDate(new Date())}`,
    `DTSTART:${toCalendarDate(event.startAt)}`,
    `DTEND:${toCalendarDate(event.endAt)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `LOCATION:${escapeIcsText(location)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    method === 'CANCEL' ? 'STATUS:CANCELLED' : 'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.join('\r\n')
}

export function createBookingCalendarEvent({
  bookingId,
  service,
  customerName,
  startAt,
  endAt,
  durationMinutes,
}: {
  bookingId: string
  service: string
  customerName?: string
  startAt: string | Date
  endAt?: string | Date | null
  durationMinutes?: number | null
}) {
  const start = new Date(startAt)
  const end = getBookingEndAt(start, endAt, durationMinutes || 60)
  const title = `${service} at Hauslash`
  const locationDetails = getAppointmentLocationDetails(service)
  const description = [
    customerName ? `Appointment for ${customerName}.` : null,
    locationDetails.href
      ? 'Mobile outcall appointment. Please message Hauslash on Instagram to confirm the treatment address and where you are located: https://ig.me/m/hauslash_co'
      : 'Please arrive with clean, makeup-free lashes.',
    locationDetails.href ? null : 'Hauslash Korean lash lift studio.',
  ]
    .filter(Boolean)
    .join('\n')

  return {
    uid: `${bookingId}@hauslash.co.uk`,
    title,
    startAt: start,
    endAt: end,
    description,
    location: locationDetails.calendarLocation,
  }
}

export function createBookingCalendarAttachment(event: CalendarEventInput, method = 'PUBLISH') {
  return {
    filename: method === 'CANCEL' ? 'hauslash-cancellation.ics' : 'hauslash-appointment.ics',
    content: createIcsCalendar(event, method),
    contentType: 'text/calendar; charset=utf-8; method=' + method,
  }
}
