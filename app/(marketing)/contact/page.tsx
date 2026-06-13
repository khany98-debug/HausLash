'use client'

import { useState } from 'react'
import { ArrowUpRight, Instagram, Mail, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const CONTACTS = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@hauslash.co',
    href: 'mailto:info@hauslash.co',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@hauslash_co',
    href: 'https://www.instagram.com/hauslash_co/',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Stoke-on-Trent, England',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Unable to send message')
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-16 text-center sm:px-8 md:pb-16 md:pt-24">
        <p className="eyebrow">Contact Hauslash</p>
        <h1 className="mx-auto mt-5 display-title max-w-3xl">
          Questions before
          <span className="block italic">your appointment?</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-muted-foreground">
          Send a message for treatment guidance, patch test questions, or anything else you would like to know before booking.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 sm:px-8 md:pb-28 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-[1.75rem] bg-[#1b1917] p-7 text-[#f5f1eb] sm:p-9">
          <p className="eyebrow text-[#91887e]">Connect</p>
          <h2 className="mt-5 font-serif text-3xl leading-tight">
            We would love to hear from you.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#bdb5aa]">
            Appointments are booked online. For everything else, reach out by email, Instagram, or the form.
          </p>
          <div className="mt-10 space-y-3">
            {CONTACTS.map((contact) => {
              const content = (
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 p-4 transition-colors hover:border-white/20 hover:bg-white/5">
                  <contact.icon className="h-4 w-4 text-[#91887e]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#91887e]">{contact.label}</p>
                    <p className="mt-1 truncate text-sm text-[#e7e0d7]">{contact.value}</p>
                  </div>
                  {contact.href && <ArrowUpRight className="h-4 w-4 text-[#91887e]" />}
                </div>
              )
              return contact.href ? (
                <a key={contact.label} href={contact.href} target={contact.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  {content}
                </a>
              ) : (
                <div key={contact.label}>{content}</div>
              )
            })}
          </div>
          <p className="mt-10 border-t border-white/10 pt-6 text-xs leading-6 text-[#91887e]">
            Messages are usually answered within one working day.
          </p>
        </aside>

        <div className="luxury-card p-6 sm:p-9">
          <p className="eyebrow">Send a message</p>
          <h2 className="mt-4 font-serif text-3xl tracking-tight sm:text-4xl">How can we help?</h2>

          {submitStatus !== 'idle' && (
            <div
              role="status"
              className={`mt-6 rounded-xl border p-4 text-sm ${
                submitStatus === 'success'
                  ? 'border-emerald-700/20 bg-emerald-50 text-emerald-800'
                  : 'border-red-700/20 bg-red-50 text-red-800'
              }`}
            >
              {submitStatus === 'success'
                ? 'Thank you. Your message has been sent and we will be in touch soon.'
                : 'Something went wrong while sending your message. Please try again or email us directly.'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em]">Name</label>
                <Input id="contact-name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={isSubmitting} className="h-12 rounded-xl bg-background/60" />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em]">Email</label>
                <Input id="contact-email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={isSubmitting} className="h-12 rounded-xl bg-background/60" />
              </div>
            </div>
            <div>
              <label htmlFor="contact-phone" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em]">Phone <span className="normal-case tracking-normal text-muted-foreground">(optional)</span></label>
              <Input id="contact-phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={isSubmitting} className="h-12 rounded-xl bg-background/60" />
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em]">Message</label>
              <Textarea id="contact-message" required minLength={10} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} disabled={isSubmitting} rows={7} className="rounded-xl bg-background/60" />
            </div>
            <Button type="submit" disabled={isSubmitting} size="lg" className="h-12 w-full rounded-full">
              <Send className="h-4 w-4" />
              {isSubmitting ? 'Sending...' : 'Send message'}
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}
