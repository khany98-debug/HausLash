import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Share, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Install Admin App',
  description: 'Add the Hauslash admin dashboard to your iPhone Home Screen.',
  manifest: '/admin.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Hauslash Admin',
    statusBarStyle: 'black-translucent',
  },
}

const steps = [
  {
    title: 'Open this page in Safari',
    detail: 'On iPhone, use Safari rather than Instagram, Gmail, or another in-app browser.',
  },
  {
    title: 'Tap the Share button',
    detail: 'It is the square icon with the upward arrow at the bottom of Safari.',
  },
  {
    title: 'Choose Add to Home Screen',
    detail: 'Name it Hauslash Admin, then tap Add.',
  },
  {
    title: 'Open from the new icon',
    detail: 'The icon will launch straight into the admin area for bookings and availability.',
  },
]

export default function AdminInstallPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow">iPhone shortcut</p>
            <h1 className="mt-3 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
              Add Hauslash Admin to the Home Screen
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              This creates an app-style icon for the admin dashboard, so bookings,
              availability, services, reviews, and messages are always one tap away.
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Smartphone className="h-7 w-7" />
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex gap-4 rounded-2xl border border-border/60 bg-background/70 p-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">{step.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border/60 bg-muted/40 p-4">
          <div className="flex gap-3">
            <Share className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <p className="text-sm leading-6 text-muted-foreground">
              iPhone does not let websites install themselves automatically. The
              Share menu step is required once, then the admin icon works like an app.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="rounded-full">
            <Link href="/admin">
              Go to admin dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">Back to website</Link>
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
        <h2 className="font-serif text-2xl text-foreground">What she will get</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            'A Hauslash Admin icon on the iPhone Home Screen',
            'Quick access to bookings and customer details',
            'Availability management without typing the URL',
            'A cleaner full-screen feel when launched from the icon',
          ].map((item) => (
            <div key={item} className="flex gap-3 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
