import { getDb } from '@/lib/db'
import { Service, formatPence, formatDuration } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getServices(): Promise<Service[]> {
  const sql = getDb()
  const rows = await sql`SELECT * FROM services WHERE active = true ORDER BY sort_order ASC`
  return rows as Service[]
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <div className="mb-12 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Our Treatments
        </p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-foreground md:text-4xl text-balance">
          Services & Pricing
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
          Each treatment is tailored to enhance your natural beauty. All prices
          include a consultation to find the perfect look for you.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-1 flex-col gap-2">
              <h2 className="text-lg font-medium text-foreground">{service.name}</h2>
              {service.description && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(service.duration_minutes)}
                </span>
                {service.price_pence && (
                  <span className="font-medium text-foreground">
                    {formatPence(service.price_pence)}
                  </span>
                )}
              </div>
            </div>

            <Button asChild variant="outline" className="shrink-0 rounded-full">
              <Link href={`/book?service=${service.slug}`}>
                Book
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          A deposit of {formatPence(1500)} is required to secure your booking.
          The remaining balance is paid at the appointment.
        </p>
      </div>
    </div>
  )
}
