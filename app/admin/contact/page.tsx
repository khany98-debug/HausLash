'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '../layout'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Mail, Phone, Trash2, Loader2, Check } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface ContactInquiry {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: 'new' | 'replied' | 'archived'
  created_at: string
}

// Helper function to safely format dates
const formatDate = (dateString: string | null | undefined, formatStr: string = 'MMM d, yyyy - HH:mm'): string => {
  if (!dateString) return 'Unknown date'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'
    return format(date, formatStr)
  } catch (error) {
    return 'Invalid date'
  }
}

export default function ContactInquiriesAdmin() {
  useAdminAuth()

  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'new' | 'replied' | 'archived'>('new')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)
  const [detailDialog, setDetailDialog] = useState<ContactInquiry | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [filter])

  async function fetchInquiries() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter)

      const response = await fetch(`/api/contact?${params}`)
      if (response.ok) {
        const data = await response.json()
        setInquiries(data.inquiries)
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: 'replied' | 'archived') {
    try {
      setActionLoading(id)
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setInquiries(inquiries.map(i =>
          i.id === id ? { ...i, status } : i
        ))
      }
    } catch (error) {
      console.error('Error updating inquiry:', error)
    } finally {
      setActionLoading(null)
    }
  }

  async function deleteInquiry(id: string) {
    try {
      setActionLoading(id)
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setInquiries(inquiries.filter(i => i.id !== id))
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error)
    } finally {
      setActionLoading(null)
      setDeleteDialog(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'replied':
        return 'bg-emerald-100 text-emerald-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-foreground mb-2">Contact Inquiries</h1>
        <p className="text-muted-foreground">
          Manage customer contact form submissions
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'new', 'replied', 'archived'] as const).map((status) => (
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
      ) : inquiries.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No inquiries found
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id} className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {inquiry.name}
                    </h3>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="hover:text-foreground flex items-center gap-1"
                      >
                        <Mail className="h-4 w-4" />
                        {inquiry.email}
                      </a>
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="hover:text-foreground flex items-center gap-1"
                      >
                        <Phone className="h-4 w-4" />
                        {inquiry.phone}
                      </a>
                    </div>
                  </div>
                  <Badge className={getStatusColor(inquiry.status)}>
                    {inquiry.status}
                  </Badge>
                </div>

                {/* Message Preview */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-foreground text-sm">
                    {inquiry.message.length > 200
                      ? `${inquiry.message.substring(0, 200)}...`
                      : inquiry.message}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(inquiry.created_at)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actionLoading === inquiry.id}
                      onClick={() => setDetailDialog(inquiry)}
                    >
                      View Details
                    </Button>

                    {inquiry.status === 'new' && (
                      <Button
                        size="sm"
                        variant="default"
                        disabled={actionLoading === inquiry.id}
                        onClick={() => updateStatus(inquiry.id, 'replied')}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Mark Replied
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={actionLoading === inquiry.id}
                      onClick={() => setDeleteDialog(inquiry.id)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailDialog !== null} onOpenChange={(open) => !open && setDetailDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{detailDialog?.name}</DialogTitle>
            <DialogDescription>
              Inquiry from {formatDate(detailDialog?.created_at || '', 'MMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <a
                  href={`mailto:${detailDialog?.email}`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {detailDialog?.email}
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <a
                  href={`tel:${detailDialog?.phone}`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {detailDialog?.phone}
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Message</p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-foreground whitespace-pre-wrap">
                  {detailDialog?.message}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Status</p>
              <Badge className={getStatusColor(detailDialog?.status || '')}>
                {detailDialog?.status}
              </Badge>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialog(null)}>
              Close
            </Button>
            {detailDialog?.status === 'new' && (
              <Button
                onClick={() => {
                  if (detailDialog?.id) {
                    updateStatus(detailDialog.id, 'replied')
                    setDetailDialog(null)
                  }
                }}
              >
                Mark as Replied
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog !== null} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inquiry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contact inquiry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteDialog && deleteInquiry(deleteDialog)}
            className="bg-destructive"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
