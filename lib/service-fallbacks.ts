import { Service, TimeSlot } from '@/lib/types'
import { PATCH_TEST_DESCRIPTION } from '@/lib/service-display'

export const FALLBACK_SERVICES: Service[] = [
  {
    id: '7b6f7970-8a35-4b18-9d36-a11c6b4ef101',
    name: 'Korean Lash Lift - In-Studio',
    slug: 'korean-lash-lift-studio',
    description:
      'Experience our signature Korean lash lift technique in our serene studio setting. This advanced treatment creates beautifully curled, lifted lashes that appear longer and fuller for 8-10 weeks. Includes professional tinting and our signature aftercare treatment.',
    duration_minutes: 75,
    price_pence: 3500,
    deposit_pence: 1500,
    active: true,
    sort_order: 1,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '2c2df918-4ed7-47df-9a72-1de5f648b502',
    name: 'Korean Lash Lift - Mobile Outcall',
    slug: 'korean-lash-lift-mobile',
    description:
      'Luxury brings itself to you. Our mobile Korean lash lift service offers the same premium treatment in the comfort of your own home, including consultation, professional setup, and aftercare guidance.',
    duration_minutes: 90,
    price_pence: 5000,
    deposit_pence: 1500,
    active: true,
    sort_order: 2,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '4fda73fb-3b88-4d79-9f5f-c9636aa4ef67',
    name: 'Patch Test',
    slug: 'patch-test',
    description: PATCH_TEST_DESCRIPTION,
    duration_minutes: 15,
    price_pence: 0,
    deposit_pence: 0,
    active: true,
    sort_order: 3,
    created_at: '2026-01-01T00:00:00.000Z',
  },
]

export function isMissingDatabaseConfig(error: unknown) {
  return error instanceof Error && error.message === 'DATABASE_URL is not set'
}

export function getFallbackAvailabilitySlots(date: string): TimeSlot[] {
  const [year, month, day] = date.split('-').map(Number)
  const selectedDate = new Date(year, month - 1, day)
  const today = new Date()
  const selectedStart = new Date(year, month - 1, day).setHours(0, 0, 0, 0)
  const todayStart = new Date().setHours(0, 0, 0, 0)

  if (selectedDate.getDay() === 0 || selectedStart < todayStart) {
    return []
  }

  return ['10:00', '11:30', '13:00', '14:30', '16:00']
    .filter((start) => {
      if (selectedStart !== todayStart) return true
      return new Date(`${date}T${start}:00`) > today
    })
    .map((start) => ({
      start,
      end: addMinutes(start, 75),
      available: true,
    }))
}

function addMinutes(time: string, minutesToAdd: number) {
  const [hours, minutes] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + minutesToAdd
  const endHours = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
  const endMinutes = String(totalMinutes % 60).padStart(2, '0')

  return `${endHours}:${endMinutes}`
}
