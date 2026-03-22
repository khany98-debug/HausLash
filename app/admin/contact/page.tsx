'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useAdminAuth } from '../layout'
import { useToast } from '@/hooks/use-toast'
import { format, formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Mail, Phone, Trash2, Loader2, Send, ChevronDown } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ContactMessage {
  id: string
  message: string
  sender: 'customer' | 'admin'
  sender_name: string
  created_at: string
}

interface ContactInquiry {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: 'new' | 'replied' | 'archived'
  created_at: string
}

interface Conversation {
  inquiry: ContactInquiry
  messages: ContactMessage[]
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
  const { toast } = useToast()

  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'new' | 'replied' | 'archived'>('all')
  const [selectedInquiry, setSelectedInquiry] = useState<Conversation | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replySending, setReplySending] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchInquiries()
  }, [filter])

  useEffect(() => {
    scrollToBottom()
  }, [selectedInquiry])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  async function fetchInquiries() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter)

      const response = await fetch(`/api/contact?${params}`)
      if (response.ok) {
        const data = await response.json()
        setInquiries(data.inquiries.sort((a: ContactInquiry, b: ContactInquiry) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ))
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchConversation(id: string) {
    try {
      const response = await fetch(`/api/contact/${id}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Conversation loaded:', data)
        setSelectedInquiry(data)
      } else {
        const error = await response.text()
        console.error('Failed to fetch conversation:', response.status, error)
      }
    } catch (error) {
      console.error('Error fetching conversation:', error)
    }
  }

  async function sendReply() {
    if (!replyText.trim() || !selectedInquiry) return

    try {
      setReplySending(true)
      
      const inquiryId = String(selectedInquiry.inquiry.id)
      
      console.log('Sending reply:', {
        inquiryId,
        email: selectedInquiry.inquiry.email,
        customerName: selectedInquiry.inquiry.name,
        replyMessage: replyText,
      })

      const response = await fetch('/api/contact/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId,
          email: selectedInquiry.inquiry.email,
          customerName: selectedInquiry.inquiry.name,
          replyMessage: replyText,
        }),
      })

      let data
      try {
        data = await response.json()
      } catch (e) {
        console.error('Failed to parse response as JSON:', e)
        data = { error: 'Invalid response from server' }
      }

      console.log('Reply response:', response.status, data)

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Reply sent to customer',
        })
        setReplyText('')
        // Refetch conversation
        await fetchConversation(inquiryId)
        // Refetch inquiries to update status
        await fetchInquiries()
      } else {
        const errorMsg = data?.error || data?.details || `Server error: ${response.statusText}`
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        })
        console.error('Reply failed:', response.status, data)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: String(error),
        variant: 'destructive',
      })
      console.error('Error sending reply:', error)
    } finally {
      setReplySending(false)
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
        if (selectedInquiry?.inquiry.id === id) {
          await fetchConversation(id)
        }
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
        if (selectedInquiry?.inquiry.id === id) {
          setSelectedInquiry(null)
        }
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
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <h1 className="text-2xl font-serif text-foreground">Contact Inquiries</h1>
        <p className="text-sm text-muted-foreground">Manage customer messages</p>
      </div>

      {/* Main Content - Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Contact List */}
        <div className="w-96 border-r flex flex-col overflow-hidden bg-muted/20">
          {/* Filter Buttons */}
          <div className="flex gap-2 p-4 border-b overflow-x-auto">
            {(['all', 'new', 'replied', 'archived'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                onClick={() => setFilter(status)}
                className="capitalize text-xs whitespace-nowrap"
                size="sm"
              >
                {status}
              </Button>
            ))}
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : inquiries.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No inquiries found
              </div>
            ) : (
              <div className="divide-y">
                {inquiries.map((inquiry) => (
                  <button
                    key={inquiry.id}
                    onClick={() => fetchConversation(inquiry.id)}
                    className={`w-full p-4 text-left transition-colors ${
                      selectedInquiry?.inquiry.id === inquiry.id
                        ? 'bg-primary/10 border-l-2 border-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-foreground truncate">
                        {inquiry.name}
                      </h3>
                      <Badge className={`text-xs flex-shrink-0 ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status === 'new' ? 'New' : inquiry.status === 'replied' ? 'Replied' : 'Archived'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {inquiry.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {inquiry.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Conversation */}
        {selectedInquiry ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-background">
            {/* Conversation Header */}
            <div className="border-b bg-muted/50 px-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {selectedInquiry.inquiry.name}
                  </h2>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <a
                      href={`mailto:${selectedInquiry.inquiry.email}`}
                      className="hover:text-foreground flex items-center gap-1"
                    >
                      <Mail className="h-4 w-4" />
                      {selectedInquiry.inquiry.email}
                    </a>
                    <a
                      href={`tel:${selectedInquiry.inquiry.phone}`}
                      className="hover:text-foreground flex items-center gap-1"
                    >
                      <Phone className="h-4 w-4" />
                      {selectedInquiry.inquiry.phone}
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedInquiry.inquiry.status === 'new' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(selectedInquiry.inquiry.id, 'replied')}
                      disabled={actionLoading === selectedInquiry.inquiry.id}
                    >
                      Mark Replied
                    </Button>
                  )}
                  {selectedInquiry.inquiry.status === 'replied' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(selectedInquiry.inquiry.id, 'archived')}
                      disabled={actionLoading === selectedInquiry.inquiry.id}
                    >
                      Archive
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteDialog(selectedInquiry.inquiry.id)}
                    disabled={actionLoading === selectedInquiry.inquiry.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Initial customer message */}
              <div className="flex gap-3 justify-start">
                <div className="flex-1">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {selectedInquiry.inquiry.message}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedInquiry.inquiry.name} • {formatDate(selectedInquiry.inquiry.created_at, 'MMM d, yyyy - HH:mm')}
                  </p>
                </div>
              </div>

              {/* Conversation messages */}
              {selectedInquiry.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex-1 max-w-md ${msg.sender === 'admin' ? 'text-right' : ''}`}>
                    <div
                      className={`rounded-lg p-4 whitespace-pre-wrap ${
                        msg.sender === 'admin'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {msg.sender === 'admin' ? 'You' : msg.sender_name} •{' '}
                      {formatDate(msg.created_at, 'MMM d, yyyy - HH:mm')}
                    </p>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <div className="border-t bg-background p-4">
              <div className="flex gap-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      sendReply()
                    }
                  }}
                  placeholder="Type your reply... (Ctrl+Enter to send)"
                  className="flex-1 p-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                />
                <Button
                  onClick={sendReply}
                  disabled={!replyText.trim() || replySending}
                  className="self-end gap-2"
                >
                  {replySending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p>Select a message to view the conversation</p>
            </div>
          </div>
        )}
      </div>

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
