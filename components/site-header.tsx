'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BrandMark } from '@/components/brand-mark'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Treatments', href: '/services' },
  { label: 'Results', href: '/#results' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'About', href: '/about' },
  { label: 'Aftercare', href: '/aftercare' },
  { label: 'Contact', href: '/contact' },
]

const LEFT_NAV_ITEMS = NAV_ITEMS.slice(0, 3)
const RIGHT_NAV_ITEMS = NAV_ITEMS.slice(3)

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 xl:px-8">
        <div className="relative flex h-[68px] items-center justify-between xl:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:border-foreground/30 hover:bg-foreground/[0.04]"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            href="/"
            aria-label="Hauslash home"
            className="absolute left-1/2 flex -translate-x-1/2 items-center py-2"
            onClick={() => setOpen(false)}
          >
            <BrandMark className="text-[1.7rem]" />
          </Link>

          <Button asChild size="sm" className="h-10 rounded-full px-4 text-xs">
            <Link href="/book" onClick={() => setOpen(false)}>
              Book
            </Link>
          </Button>
        </div>

        <div className="hidden h-[82px] grid-cols-[1fr_auto_1fr] items-center gap-8 xl:grid">
          <nav className="flex items-center gap-6 justify-self-start" aria-label="Primary navigation">
            {LEFT_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-[12px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground',
                  pathname === item.href && 'text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/" aria-label="Hauslash home" className="flex items-center px-3 py-2">
            <BrandMark className="text-[2rem]" />
          </Link>

          <nav className="flex items-center gap-6 justify-self-end" aria-label="Booking and information navigation">
            {RIGHT_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-[12px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground',
                  pathname === item.href && 'text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/bookings"
              className={cn(
                'text-[12px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground',
                pathname === '/bookings' && 'text-foreground',
              )}
            >
              My bookings
            </Link>
            <Button asChild size="sm" className="rounded-full px-5">
              <Link href="/book">Book Now</Link>
            </Button>
          </nav>
        </div>
      </div>

      {open && (
        <nav className="border-t border-foreground/10 bg-background px-5 py-8 xl:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-7xl flex-col">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-foreground/10 py-4 font-serif text-2xl text-foreground"
              >
                {item.label}
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
            <Link
              href="/bookings"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-foreground/10 py-4 font-serif text-2xl text-foreground"
            >
              My bookings
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Button asChild size="lg" className="mt-8 rounded-full">
              <Link href="/book" onClick={() => setOpen(false)}>
                Book an appointment
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
