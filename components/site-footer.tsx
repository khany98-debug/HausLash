'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Testimonial {
  id: string
  customer_name: string
  rating: number
  review_text: string
}

export function SiteFooter() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/testimonials?limit=3')
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data.testimonials || [])
      })
      .catch((error) => {
        console.error('Error fetching testimonials:', error)
      })
      .finally(() => setLoading(false))
  }, [])

  const currentTestimonial = testimonials[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    )
  }

  return (
    <footer className="border-t border-border/40 bg-[#EEEDE9]">
      {/* Testimonials Carousel */}
      {!loading && testimonials.length > 0 && (
        <div className="border-b border-border/40 px-6 py-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
              Customer Love
            </p>
            <div className="space-y-4">
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < currentTestimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-sm leading-relaxed text-foreground italic">
                "{currentTestimonial.review_text}"
              </p>

              {/* Customer Name */}
              <p className="text-xs font-medium text-muted-foreground">
                — {currentTestimonial.customer_name}
              </p>

              {/* Navigation */}
              <div className="flex gap-2 pt-2 items-center">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={goToPrevious}
                  className="h-8 w-8 p-0"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Dots Indicator */}
                <div className="flex gap-1 items-center flex-1">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentIndex
                          ? 'bg-primary w-4'
                          : 'bg-primary/30 w-1.5'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={goToNext}
                  className="h-8 w-8 p-0"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-4 md:max-w-xs">
            <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-80">
              <Image
                src="/images/IMG_3451.jpeg"
                alt="Hauslash"
                width={959}
                height={1084}
                priority
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Premium lash lift treatments that enhance your natural beauty.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
            <Link href="/services" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Services
            </Link>
            <Link href="/book" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Book Appointment
            </Link>
            <Link href="/policies" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Policies
            </Link>
          </div>

          {/* Policies */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Policies</h4>
            <Link href="/policies#cancellation" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Cancellation Policy
            </Link>
            <Link href="/policies#aftercare" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Aftercare
            </Link>
            <Link href="/policies#patch-test" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Patch Test Info
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-8">
          <p className="text-center text-xs text-muted-foreground">
            {new Date().getFullYear()} Hauslash. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
