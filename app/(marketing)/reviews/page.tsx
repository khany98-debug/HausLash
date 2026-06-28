import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Quote, ShieldCheck, Star } from 'lucide-react'

import TestimonialForm from '@/components/home/testimonial-form'
import { Button } from '@/components/ui/button'
import { getDb } from '@/lib/db'
import { FALLBACK_SERVICES, isMissingDatabaseConfig } from '@/lib/service-fallbacks'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Client Reviews',
  description:
    'Read verified Hauslash client reviews or share your experience after a Korean lash lift treatment.',
}

type Review = {
  id: string
  customer_name: string
  rating: number
  review_text: string
  verified_booking: boolean
  service_name: string | null
  created_at: string
}

async function getReviewPageData() {
  try {
    const sql = getDb()
    const [services, reviews] = await Promise.all([
      sql`
        SELECT id, name
        FROM services
        WHERE active = true
        ORDER BY sort_order ASC
      `,
      sql`
        SELECT
          t.id,
          t.customer_name,
          t.rating,
          t.review_text,
          t.created_at,
          s.name AS service_name,
          EXISTS (
            SELECT 1
            FROM bookings b
            JOIN customer_profiles cp ON cp.id = t.customer_id
            WHERE lower(b.customer_email) = lower(cp.email)
            AND b.status IN ('confirmed', 'completed')
          ) AS verified_booking
        FROM testimonials t
        LEFT JOIN services s
          ON s.id::text = t.service_id
          OR s.slug = t.service_id
        WHERE t.status = 'approved'
        ORDER BY t.featured DESC, t.created_at DESC
        LIMIT 12
      `,
    ])

    return {
      services: services as { id: string; name: string }[],
      reviews: reviews as Review[],
    }
  } catch (error) {
    if (isMissingDatabaseConfig(error)) {
      return {
        services: FALLBACK_SERVICES.map(({ id, name }) => ({ id, name })),
        reviews: [],
      }
    }

    console.error('Could not load review page data:', error)
    return {
      services: [],
      reviews: [],
    }
  }
}

export default async function ReviewsPage() {
  const { services, reviews } = await getReviewPageData()

  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-16 text-center sm:px-8 md:pb-16 md:pt-24">
        <p className="eyebrow">Client stories</p>
        <h1 className="mx-auto mt-5 max-w-4xl display-title">
          Real results,
          <span className="block italic">beautifully remembered.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
          Read honest words from Hauslash clients, or share the details that made your own appointment feel special.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 md:pb-28">
        {reviews.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <article key={review.id} className="luxury-card flex min-h-72 flex-col p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <Quote className="h-5 w-5 text-muted-foreground/40" />
                  <div className="flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-3.5 w-3.5 ${
                          index < review.rating
                            ? 'fill-foreground text-foreground'
                            : 'text-muted-foreground/25'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <blockquote className="mt-6 flex-1 font-serif text-2xl leading-[1.35] tracking-[-0.02em]">
                  “{review.review_text}”
                </blockquote>
                <div className="mt-7 border-t border-foreground/10 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                    {review.customer_name}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {review.service_name && <span>{review.service_name}</span>}
                    {review.verified_booking && (
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified client
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="luxury-card mx-auto max-w-3xl p-8 text-center sm:p-12">
            <Quote className="mx-auto h-7 w-7 text-muted-foreground/40" />
            <h2 className="mt-6 font-serif text-3xl tracking-tight">
              Client reviews will appear here.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              Once a customer shares their experience and it is approved, it will be displayed in this section so future clients can read real Hauslash stories before booking.
            </p>
            <Button asChild variant="outline" className="mt-7 rounded-full border-foreground/15 bg-transparent">
              <Link href="#leave-a-review">Leave the first review</Link>
            </Button>
          </div>
        )}
      </section>

      <section id="leave-a-review" className="scroll-mt-24 border-y border-foreground/10 bg-card/55">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Share your experience</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Your words help someone else
              <span className="block italic">feel confident booking.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">
              Tell us about your treatment, your result, or how the experience made you feel. Reviews are checked before they appear publicly.
            </p>
            <div className="mt-8 space-y-4 border-t border-foreground/10 pt-7 text-sm text-muted-foreground">
              <p className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                Booking history is checked automatically so genuine clients can be marked as verified.
              </p>
              <p className="flex gap-3">
                <Star className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                Constructive feedback is always welcome and helps Hauslash keep improving.
              </p>
            </div>
          </div>

          <div className="luxury-card p-6 sm:p-9">
            <TestimonialForm services={services} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 md:py-28">
        <p className="eyebrow">Ready for your own result?</p>
        <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl">
          Your lashes,
          <span className="block italic">beautifully considered.</span>
        </h2>
        <Button asChild size="lg" className="mt-8 h-12 rounded-full px-7">
          <Link href="/book">
            Reserve your appointment
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </main>
  )
}
