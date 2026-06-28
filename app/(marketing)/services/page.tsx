import Link from 'next/link'
import { ArrowUpRight, Clock3, Sparkles } from 'lucide-react'
import { getDb } from '@/lib/db'
import { FALLBACK_SERVICES, isMissingDatabaseConfig } from '@/lib/service-fallbacks'
import { normalisePublicServices } from '@/lib/service-display'
import { Service, formatDuration, formatPence } from '@/lib/types'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

async function getServices(): Promise<Service[]> {
  try {
    const sql = getDb()
    const rows = await sql`SELECT * FROM services WHERE active = true ORDER BY sort_order ASC`
    return normalisePublicServices(rows as Service[])
  } catch (error) {
    if (isMissingDatabaseConfig(error)) {
      return normalisePublicServices(FALLBACK_SERVICES)
    }

    throw error
  }
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <main>
      <section className="relative isolate overflow-hidden px-5 pb-12 pt-16 text-center sm:px-8 md:pb-16 md:pt-24">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.9),transparent_35%),radial-gradient(circle_at_85%_40%,rgba(201,185,167,0.22),transparent_28%)]" />
        <p className="eyebrow">Treatment menu</p>
        <h1 className="mx-auto mt-5 display-title max-w-3xl">
          A beautiful lift,
          <span className="block italic">made personal.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-muted-foreground">
          Clear treatment options, simple booking, and a consultation-led Korean lash lift experience from start to finish.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 md:pb-28">
        <div className="mb-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <div className="rounded-2xl border border-foreground/10 bg-card/65 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">Consultation</p>
            <p className="mt-2 leading-6">We discuss your natural lashes, preferred finish, and any sensitivity concerns.</p>
          </div>
          <div className="rounded-2xl border border-foreground/10 bg-card/65 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">Patch test</p>
            <p className="mt-2 leading-6">Available before treatment for peace of mind, especially for first-time clients.</p>
          </div>
          <div className="rounded-2xl border border-foreground/10 bg-card/65 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">Easy booking</p>
            <p className="mt-2 leading-6">Choose the treatment, pick your time, and secure your appointment online.</p>
          </div>
        </div>

        <div className="space-y-4">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="group luxury-card grid gap-6 overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:bg-card sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-center"
            >
              <span className="font-serif text-4xl italic text-muted-foreground/40 transition group-hover:text-foreground/45">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">{service.name}</h2>
                {service.description && (
                  <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{service.description}</p>
                )}
                <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatDuration(service.duration_minutes)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    Consultation and patch test guidance
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-5 md:flex-col md:items-end">
                {service.price_pence !== null && (
                  <p className="font-serif text-4xl tracking-tight">
                    {service.price_pence > 0 ? formatPence(service.price_pence) : 'Free'}
                  </p>
                )}
                <Button asChild variant="outline" className="rounded-full border-foreground/15 bg-transparent">
                  <Link href={`/book?service=${service.slug}`}>
                    Book
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[1.75rem] border border-foreground/10 bg-foreground px-6 py-8 text-primary-foreground shadow-[0_32px_90px_-55px_rgba(42,34,28,0.75)] sm:flex sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="eyebrow text-primary-foreground/50">Booking note</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-primary-foreground/70">
              Lash lift appointments are secured with a {formatPence(1500)} non-refundable deposit. Patch tests are free and should be booked at least 24 hours before a first treatment.
            </p>
          </div>
          <Button asChild variant="secondary" className="mt-5 rounded-full sm:mt-0">
            <Link href="/policies">View policies</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
