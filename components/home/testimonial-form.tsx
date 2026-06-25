'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, Loader2, ShieldCheck, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const testimonialFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100),
  email: z.string().trim().email('Please enter a valid email address'),
  serviceId: z.string().uuid().optional(),
  rating: z.string().refine((value) => ['1', '2', '3', '4', '5'].includes(value), {
    message: 'Please select a rating',
  }),
  review: z
    .string()
    .trim()
    .min(20, 'Please share at least 20 characters')
    .max(1000, 'Please keep your review under 1,000 characters'),
  website: z.string().max(0).optional(),
})

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>

type ReviewService = {
  id: string
  name: string
}

export default function TestimonialForm({
  services,
}: {
  services: ReviewService[]
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: '',
      email: '',
      serviceId: undefined,
      rating: '5',
      review: '',
      website: '',
    },
  })

  async function onSubmit(values: TestimonialFormValues) {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          serviceId: values.serviceId || null,
          rating: Number(values.rating),
          review: values.review,
          website: values.website,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        form.setError('review', {
          message: result.error || 'We could not submit your review. Please try again.',
        })
        return
      }

      setSubmitSuccess(true)
      form.reset()
    } catch {
      form.setError('review', {
        message: 'We could not submit your review. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div
        role="status"
        className="flex min-h-[32rem] flex-col items-center justify-center rounded-[1.75rem] border border-emerald-900/10 bg-emerald-50/70 p-8 text-center"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-900 text-white">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="mt-6 font-serif text-3xl tracking-tight">Thank you for sharing.</h2>
        <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
          Your review has been received and will appear on the reviews page shortly.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-7 rounded-full border-foreground/15 bg-transparent"
          onClick={() => setSubmitSuccess(false)}
        >
          Leave another review
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-[0.12em]">Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="name"
                    placeholder="Your name"
                    disabled={isSubmitting}
                    className="h-12 rounded-xl bg-background/60"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-[0.12em]">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                    className="h-12 rounded-xl bg-background/60"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-[0.12em]">
                Treatment <span className="normal-case tracking-normal text-muted-foreground">(optional)</span>
              </FormLabel>
              <Select
                value={field.value || 'none'}
                onValueChange={(value) => field.onChange(value === 'none' ? undefined : value)}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger className="h-12 w-full rounded-xl bg-background/60">
                    <SelectValue placeholder="Select your treatment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Prefer not to say</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-[0.12em]">Your rating</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Review rating">
                  {[1, 2, 3, 4, 5].map((rating) => {
                    const selectedRating = Number(field.value)
                    const active = rating <= (hoverRating || selectedRating)

                    return (
                      <button
                        key={rating}
                        type="button"
                        role="radio"
                        aria-checked={rating === selectedRating}
                        aria-label={`${rating} out of 5 stars`}
                        onClick={() => field.onChange(String(rating))}
                        onMouseEnter={() => setHoverRating(rating)}
                        onMouseLeave={() => setHoverRating(0)}
                        onFocus={() => setHoverRating(rating)}
                        onBlur={() => setHoverRating(0)}
                        disabled={isSubmitting}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/10 bg-background/55 transition hover:-translate-y-0.5 hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            active ? 'fill-foreground text-foreground' : 'text-muted-foreground/35'
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="review"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-[0.12em]">Your experience</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What did you love about your treatment or result?"
                  rows={7}
                  disabled={isSubmitting}
                  className="min-h-40 rounded-xl bg-background/60"
                  {...field}
                />
              </FormControl>
              <FormDescription className="flex justify-between gap-4 text-xs">
                <span>Reviews appear publicly after submission.</span>
                <span>{field.value.length}/1000</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem className="hidden" aria-hidden="true">
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input tabIndex={-1} autoComplete="off" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="rounded-xl border border-foreground/10 bg-background/45 p-4 text-xs leading-6 text-muted-foreground">
          <p className="flex gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
            Your email is never displayed. It is used only to identify verified Hauslash bookings and moderate submissions.
          </p>
        </div>

        <Button type="submit" disabled={isSubmitting} size="lg" className="h-12 w-full rounded-full">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
          {isSubmitting ? 'Submitting review...' : 'Submit review'}
        </Button>
      </form>
    </Form>
  )
}
