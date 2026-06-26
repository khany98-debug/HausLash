import { getDb } from '@/lib/db'
import { FALLBACK_SERVICES, isMissingDatabaseConfig } from '@/lib/service-fallbacks'
import { Service } from '@/lib/types'
import { BookingWizard } from '@/components/booking/booking-wizard'
import { SiteHeader } from '@/components/site-header'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Book an Appointment',
  description: 'Choose your treatment, pick a date and time, and secure your booking with a small deposit.',
}

async function getServices(): Promise<Service[]> {
  try {
    const sql = getDb()
    const rows = await sql`SELECT * FROM services WHERE active = true ORDER BY sort_order ASC`
    return rows as Service[]
  } catch (error) {
    if (isMissingDatabaseConfig(error)) {
      return FALLBACK_SERVICES
    }

    throw error
  }
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const params = await searchParams
  const services = await getServices()

  return (
    <>
      <SiteHeader />
      <main className="min-h-[80vh]">
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8 md:py-20">
          <div className="mb-10 text-center">
            <p className="eyebrow">Online booking</p>
            <h1 className="mx-auto mt-4 max-w-[11ch] font-serif text-3xl leading-tight tracking-tight text-foreground sm:max-w-none sm:text-4xl md:text-5xl">
              Reserve your appointment
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
              Choose your treatment and preferred time, then secure it with a small deposit. The remaining balance is paid at your appointment.
            </p>
          </div>
          <div className="luxury-card p-5 sm:p-8">
            <BookingWizard services={services} preselectedSlug={params.service} />
          </div>
        </div>
      </main>
    </>
  )
}
