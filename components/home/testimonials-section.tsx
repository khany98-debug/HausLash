'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { Testimonial } from '@/lib/types'
import { Button } from '@/components/ui/button'

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetch('/api/testimonials?limit=5')
      .then((res) => (res.ok ? res.json() : { testimonials: [] }))
      .then((data) => setTestimonials(data.testimonials || []))
      .catch(() => setTestimonials([]))
  }, [])

  if (testimonials.length === 0) return null
  const testimonial = testimonials[currentIndex]

  return (
    <section className="border-y border-foreground/10 bg-card/55">
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-28 text-center sm:px-8 sm:pt-24 md:py-28">
        <Quote className="mx-auto h-7 w-7 text-muted-foreground/50" />
        <p className="mt-7 eyebrow">Client words</p>
        <blockquote className="mx-auto mt-7 max-w-4xl font-serif text-3xl leading-[1.3] tracking-[-0.025em] sm:text-4xl md:text-5xl">
          “{testimonial.review_text}”
        </blockquote>
        <div className="mt-7 flex justify-center gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className={`h-3.5 w-3.5 ${index < testimonial.rating ? 'fill-foreground text-foreground' : 'text-muted'}`} />
          ))}
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {testimonial.customer_name}
          {testimonial.verified_booking ? ' · Verified client' : ''}
        </p>
        {testimonials.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-foreground/15 bg-transparent"
              onClick={() => setCurrentIndex((currentIndex - 1 + testimonials.length) % testimonials.length)}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-foreground/15 bg-transparent"
              onClick={() => setCurrentIndex((currentIndex + 1) % testimonials.length)}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
