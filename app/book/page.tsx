import { getDb } from '@/lib/db'
import { Service } from '@/lib/types'
import { BookingWizard } from '@/components/booking/booking-wizard'
import { SiteHeader } from '@/components/site-header'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Book an Appointment',
  description: 'Choose your treatment, pick a date and time, and secure your booking with a small deposit.',
}

async function getServices(): Promise<Service[]> {
  const sql = getDb()
  const rows = await sql`SELECT * FROM services WHERE active = true ORDER BY sort_order ASC`
  return rows as Service[]
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
        <div className="mx-auto max-w-2xl px-6 py-10 md:py-16">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
              Book Your Appointment
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Secure your spot with a small deposit. The remaining balance is paid at the appointment.
            </p>
          </div>
          <BookingWizard services={services} preselectedSlug={params.service} />
        </div>
      </main>
    </>
  )
}
