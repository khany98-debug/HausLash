'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '../layout'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Star, Loader2, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Testimonial {
  id: string
  customer_name: string
  customer_id: string
  service_id: string | null
  rating: number
  review_text: string
  status: 'pending' | 'approved' | 'rejected'
  featured: boolean
  created_at: string
  updated_at: string
}

export default function TestimonialsAdmin() {
  useAdminAuth()

  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [filter])

  async function fetchTestimonials() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter)

      const response = await fetch(`/api/admin/testimonials?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data.testimonials)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    try {
      setActionLoading(id)
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setTestimonials(testimonials.map(t => 
          t.id === id ? { ...t, status } : t
        ))
      }
    } catch (error) {
      console.error('Error updating testimonial:', error)
    } finally {
      setActionLoading(null)
    }
  }

  async function deleteTestimonial(id: string) {
    try {
      setActionLoading(id)
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTestimonials(testimonials.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
    } finally {
      setActionLoading(null)
      setDeleteDialog(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800'
      case 'pending':
        return 'bg-amber-100 text-amber-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-foreground mb-2">Testimonials</h1>
        <p className="text-muted-foreground">
          Review and manage customer testimonials
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : testimonials.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No testimonials found
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {testimonial.customer_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.service_id && `Service: ${testimonial.service_id}`}
                    </p>
                  </div>
                  <Badge className={getStatusColor(testimonial.status)}>
                    {testimonial.status}
                  </Badge>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  {renderStars(testimonial.rating)}
                  <span className="text-sm text-muted-foreground">
                    {testimonial.rating}/5
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-foreground leading-relaxed">
                  {testimonial.review_text}
                </p>

                {/* Date */}
                <p className="text-xs text-muted-foreground">
                  Submitted {format(new Date(testimonial.created_at), 'MMM d, yyyy')}
                </p>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {testimonial.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        disabled={actionLoading === testimonial.id}
                        onClick={() => updateStatus(testimonial.id, 'approved')}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading === testimonial.id}
                        onClick={() => updateStatus(testimonial.id, 'rejected')}
                        className="gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={actionLoading === testimonial.id}
                    onClick={() => setDeleteDialog(testimonial.id)}
                    className="gap-2 ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog !== null} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteDialog && deleteTestimonial(deleteDialog)}
            className="bg-destructive"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
