export const APPOINTMENT_TIME_ZONE = 'Europe/London'

type DateTimeParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

type LocalDateTime = {
  date: string
  time: string
}

const dateTimePartsFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: APPOINTMENT_TIME_ZONE,
  calendar: 'gregory',
  numberingSystem: 'latn',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: APPOINTMENT_TIME_ZONE,
  calendar: 'gregory',
  numberingSystem: 'latn',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: APPOINTMENT_TIME_ZONE,
  calendar: 'gregory',
  numberingSystem: 'latn',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

function getPart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes
) {
  const value = parts.find((part) => part.type === type)?.value

  if (!value) {
    throw new RangeError(`Could not read ${type} from formatted date`)
  }

  return value
}

function getAppointmentDateTimeParts(value: Date | string): DateTimeParts {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new RangeError('Invalid appointment date')
  }

  const parts = dateTimePartsFormatter.formatToParts(date)

  return {
    year: Number(getPart(parts, 'year')),
    month: Number(getPart(parts, 'month')),
    day: Number(getPart(parts, 'day')),
    hour: Number(getPart(parts, 'hour')),
    minute: Number(getPart(parts, 'minute')),
    second: Number(getPart(parts, 'second')),
  }
}

function parseLocalDateTime(date: string, time: string): DateTimeParts {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  const timeMatch = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(time)

  if (!dateMatch || !timeMatch) {
    throw new RangeError('Invalid appointment date or time')
  }

  const parts = {
    year: Number(dateMatch[1]),
    month: Number(dateMatch[2]),
    day: Number(dateMatch[3]),
    hour: Number(timeMatch[1]),
    minute: Number(timeMatch[2]),
    second: Number(timeMatch[3] || 0),
  }

  if (
    parts.month < 1 ||
    parts.month > 12 ||
    parts.hour > 23 ||
    parts.minute > 59 ||
    parts.second > 59
  ) {
    throw new RangeError('Invalid appointment date or time')
  }

  const probe = new Date(0)
  probe.setUTCFullYear(parts.year, parts.month - 1, parts.day)
  probe.setUTCHours(parts.hour, parts.minute, parts.second, 0)

  if (
    probe.getUTCFullYear() !== parts.year ||
    probe.getUTCMonth() !== parts.month - 1 ||
    probe.getUTCDate() !== parts.day ||
    probe.getUTCHours() !== parts.hour ||
    probe.getUTCMinutes() !== parts.minute ||
    probe.getUTCSeconds() !== parts.second
  ) {
    throw new RangeError('Invalid appointment date or time')
  }

  return parts
}

function localPartsToNaiveMilliseconds(parts: DateTimeParts) {
  const probe = new Date(0)
  probe.setUTCFullYear(parts.year, parts.month - 1, parts.day)
  probe.setUTCHours(parts.hour, parts.minute, parts.second, 0)
  return probe.getTime()
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function naiveMillisecondsToLocalDateTime(milliseconds: number): LocalDateTime {
  const date = new Date(milliseconds)

  return {
    date: `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`,
    time: `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`,
  }
}

function getTimeZoneOffsetMilliseconds(instant: Date) {
  const instantMilliseconds = Math.floor(instant.getTime() / 1000) * 1000
  const localParts = getAppointmentDateTimeParts(new Date(instantMilliseconds))
  return localPartsToNaiveMilliseconds(localParts) - instantMilliseconds
}

function sameDateTimeParts(left: DateTimeParts, right: DateTimeParts) {
  return (
    left.year === right.year &&
    left.month === right.month &&
    left.day === right.day &&
    left.hour === right.hour &&
    left.minute === right.minute &&
    left.second === right.second
  )
}

/**
 * Convert a London wall-clock appointment time into an absolute UTC instant.
 * The booking form collects local business time, while the database stores
 * timestamptz values. The conversion must therefore account for GMT/BST.
 */
export function localDateTimeToUtc(
  date: string,
  time: string
): Date {
  const target = parseLocalDateTime(date, time)
  const naiveMilliseconds = localPartsToNaiveMilliseconds(target)
  const offsets = new Set<number>()

  // Sample around the target so dates close to a DST transition still get
  // both possible offsets considered.
  for (const hours of [-48, -24, -6, 0, 6, 24, 48]) {
    offsets.add(
      getTimeZoneOffsetMilliseconds(
        new Date(naiveMilliseconds + hours * 60 * 60 * 1000)
      )
    )
  }

  const matches = [...offsets]
    .map((offset) => new Date(naiveMilliseconds - offset))
    .filter((candidate) =>
      sameDateTimeParts(getAppointmentDateTimeParts(candidate), target)
    )
    .sort((left, right) => left.getTime() - right.getTime())

  if (matches.length === 0) {
    throw new RangeError(
      `${date} ${time} does not exist in ${APPOINTMENT_TIME_ZONE}`
    )
  }

  return matches[0]
}

export function localDateTimeToUtcIso(date: string, time: string) {
  return localDateTimeToUtc(date, time).toISOString()
}

export function localDateTimeInputToUtcIso(value: string) {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::(\d{2}))?$/.exec(value)

  if (!match) {
    throw new RangeError('Invalid local date-time input')
  }

  return localDateTimeToUtcIso(match[1], `${match[2]}:${match[3] || '00'}`)
}

export function addMinutesToLocalDateTime(
  date: string,
  time: string,
  minutes: number
): LocalDateTime {
  if (!Number.isInteger(minutes)) {
    throw new RangeError('Appointment duration must be a whole number of minutes')
  }

  const parts = parseLocalDateTime(date, time)
  return naiveMillisecondsToLocalDateTime(
    localPartsToNaiveMilliseconds(parts) + minutes * 60 * 1000
  )
}

export function getAppointmentTimeWindow(
  date: string,
  time: string,
  durationMinutes: number
) {
  if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
    throw new RangeError('Appointment duration must be a positive whole number')
  }

  const end = addMinutesToLocalDateTime(date, time, durationMinutes)

  return {
    startAt: localDateTimeToUtcIso(date, time),
    endAt: localDateTimeToUtcIso(end.date, end.time),
  }
}

export function formatAppointmentDate(value: Date | string) {
  const parts = dateFormatter.formatToParts(
    value instanceof Date ? value : new Date(value)
  )

  return [
    getPart(parts, 'weekday'),
    getPart(parts, 'day'),
    getPart(parts, 'month'),
    getPart(parts, 'year'),
  ].join(' ')
}

export function formatAppointmentTime(value: Date | string) {
  const parts = timeFormatter.formatToParts(
    value instanceof Date ? value : new Date(value)
  )

  return `${getPart(parts, 'hour')}:${getPart(parts, 'minute')}`
}

export function getAppointmentDateKey(value: Date | string) {
  const parts = getAppointmentDateTimeParts(value)
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`
}

