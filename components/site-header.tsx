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

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-[13px] tracking-wide text-muted-foreground transition-colors hover:text-foreground',
                pathname === item.href && 'text-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/bookings"
            className="text-[13px] tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            My bookings
          </Link>
          <Button asChild size="sm" className="rounded-full px-5">
            <Link href="/book">Book Now</Link>
          </Button>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 text-foreground lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-foreground/10 bg-background px-5 py-8 lg:hidden" aria-label="Mobile navigation">
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
