import Link from 'next/link'
import { ArrowUpRight, Clock3, Sparkles } from 'lucide-react'
import { getDb } from '@/lib/db'
import { Service, formatDuration, formatPence } from '@/lib/types'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

async function getServices(): Promise<Service[]> {
  const sql = getDb()
  const rows = await sql`SELECT * FROM services WHERE active = true ORDER BY sort_order ASC`
  return rows as Service[]
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-16 text-center sm:px-8 md:pb-16 md:pt-24">
        <p className="eyebrow">Treatments & pricing</p>
        <h1 className="mx-auto mt-5 display-title max-w-3xl">
          A beautiful lift,
          <span className="block italic">made personal.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-muted-foreground">
          Every treatment includes a consultation and a bespoke approach to your natural lashes, eye shape, and preferred finish.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8 md:pb-28">
        <div className="space-y-4">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="luxury-card grid gap-6 p-6 transition-transform hover:-translate-y-0.5 sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-center"
            >
              <span className="font-serif text-3xl italic text-muted-foreground/45">
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
                    Bespoke consultation included
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-5 md:flex-col md:items-end">
                {service.price_pence && <p className="font-serif text-3xl">{formatPence(service.price_pence)}</p>}
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

        <div className="mt-10 rounded-[1.5rem] border border-foreground/10 bg-foreground px-6 py-8 text-primary-foreground sm:flex sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="eyebrow text-primary-foreground/50">Booking note</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-primary-foreground/70">
              A {formatPence(1500)} deposit secures your appointment and is deducted from your treatment total on the day.
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
