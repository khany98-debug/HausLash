'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Aftercare', href: '/aftercare' },
  { label: 'Contact', href: '/contact' },
  { label: 'My Bookings', href: '/bookings' },
  { label: 'Policies', href: '/policies' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-[#EEEDE9]">
      
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/IMG_3451.jpeg"
            alt="Hauslash"
            width={959}
            height={1084}
            priority
            className="h-16 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}

          <Button asChild size="sm" className="rounded-full px-6">
            <Link href="/book">Book Now</Link>
          </Button>
        </nav>

        {/* Mobile Menu */}
        <button
          onClick={() => setOpen(!open)}
          className="text-foreground md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

      </div>

      {/* Mobile Navigation */}
      {open && (
        <nav className="border-t border-border/60 bg-background px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">

            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}

            <Button asChild className="mt-2 rounded-full">
              <Link href="/book" onClick={() => setOpen(false)}>
                Book Now
              </Link>
            </Button>

          </div>
        </nav>
      )}

    </header>
  )
}