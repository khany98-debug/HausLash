'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { Testimonial } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Fetch approved testimonials
    fetch('/api/testimonials?limit=5')
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data.testimonials || [])
      })
      .catch((error) => {
        console.error('Error fetching testimonials:', error)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading testimonials...</p>
      </div>
    )
  }

  if (testimonials.length === 0) {
    return null
  }

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

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary mb-2">
            WHAT OUR CLIENTS SAY
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Loved by Our Customers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what our satisfied clients have to say about their HausLash experience
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="mb-8">
          <Card className="p-8 md:p-10 border-primary/10">
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < currentTestimonial.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted'
                  }`}
                />
              ))}
            </div>

            {/* Review Text */}
            <blockquote className="text-lg md:text-xl font-serif text-foreground mb-6 italic">
              "{currentTestimonial.review_text}"
            </blockquote>

            {/* Author */}
            <div className="border-t border-primary/10 pt-6">
              <p className="font-semibold text-foreground">
                {currentTestimonial.customer_name}
              </p>
              <p className="text-sm text-muted-foreground">
                Verified Customer
              </p>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={goToPrevious}>
            ← Previous
          </Button>

          {/* Indicator Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-6'
                    : 'bg-primary/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <Button variant="outline" onClick={goToNext}>
            Next →
          </Button>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Have you visited HausLash?</p>
          <Button asChild className="rounded-full px-8">
            <a href="#review-form">Share Your Experience</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
