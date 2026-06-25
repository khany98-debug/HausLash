import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Clock3, Sparkles } from 'lucide-react'
import { getDb } from '@/lib/db'
import { FALLBACK_SERVICES, isMissingDatabaseConfig } from '@/lib/service-fallbacks'
import { Service, formatDuration, formatPence } from '@/lib/types'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

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
          Every treatment includes a consultation and a bespoke approach to your natural lashes, eye shape, and preferred finish.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 md:pb-28">
        <div className="mb-10 grid gap-3 sm:grid-cols-3 md:mb-14">
          {[
            {
              src: '/images/work/hauslash-blue-eye-detail.jpg',
              alt: 'Detailed blue eye lash lift result',
              className: 'object-[50%_48%]',
            },
            {
              src: '/images/work/hauslash-editorial-mirror.jpg',
              alt: 'Hauslash branded mirror with lifted lashes',
              className: 'object-[50%_48%]',
            },
            {
              src: '/images/work/hauslash-green-eye-detail.jpg',
              alt: 'Detailed green eye lash lift result',
              className: 'object-[46%_50%]',
            },
          ].map((image, index) => (
            <div
              key={image.src}
              className="group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-muted shadow-[0_28px_80px_-50px_rgba(42,34,28,0.65)] sm:aspect-[3/4]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={`object-cover transition-transform duration-700 group-hover:scale-[1.025] ${image.className}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5" />
              <span className="absolute bottom-4 left-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                Finish {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
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
                    Bespoke consultation included
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-5 md:flex-col md:items-end">
                {service.price_pence && <p className="font-serif text-4xl tracking-tight">{formatPence(service.price_pence)}</p>}
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
