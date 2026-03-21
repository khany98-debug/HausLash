'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const testimonialFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  serviceId: z.string().optional(),
  rating: z.string().refine((val) => ['1', '2', '3', '4', '5'].includes(val), {
    message: 'Please select a rating',
  }),
  review: z.string().min(10, 'Review must be at least 10 characters').max(1000),
})

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>

const SERVICES = [
  { id: 'classic-lash-lift', name: 'Classic Lash Lift' },
  { id: 'korean-lash-lift', name: 'Korean Lash Lift' },
  { id: 'lash-lift', name: 'Lash Lift' },

  { id: 'lash-tint', name: 'Lash Tint' },
]

export default function TestimonialForm() {
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
          rating: parseInt(values.rating),
          review: values.review,
        }),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        form.reset()
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        const error = await response.json()
        form.setError('review', {
          message: error.error || 'Failed to submit review',
        })
      }
    } catch (error) {
      form.setError('review', {
        message: 'An error occurred while submitting your review',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="review-form" className="py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Share Your Experience
          </h2>
          <p className="text-muted-foreground">
            We'd love to hear about your HausLash experience. Your feedback helps us improve and helps others discover our services.
          </p>
        </div>

        {submitSuccess ? (
          <Card className="p-8 text-center border-green-200 bg-green-50">
            <Star className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-serif text-xl text-foreground mb-2">
              Thank You!
            </h3>
            <p className="text-muted-foreground mb-4">
              Your review has been submitted and is pending approval. We'll display it shortly!
            </p>
          </Card>
        ) : (
          <Card className="p-8 border-primary/10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            {...field}
                            disabled={isSubmitting}
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                            disabled={isSubmitting}
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
                      <FormLabel>Service (Optional)</FormLabel>
                      <Select 
                        value={field.value ?? ''} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__none__">All Services</SelectItem>
                          {SERVICES.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Which service would you like to review?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <div className="flex gap-3">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => field.onChange(rating.toString())}
                              onMouseEnter={() => setHoverRating(rating)}
                              onMouseLeave={() => setHoverRating(0)}
                              disabled={isSubmitting}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  rating <= (hoverRating || parseInt(field.value))
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted'
                                }`}
                              />
                            </button>
                          ))}
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
                      <FormLabel>Your Review</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your experience with HausLash..."
                          rows={5}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        {1000 - field.value.length} characters remaining
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full"
                  size="lg"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Review
                </Button>
              </form>
            </Form>
          </Card>
        )}
      </div>
    </section>
  )
}
