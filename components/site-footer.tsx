import Link from 'next/link'
import { ArrowUpRight, Instagram, Mail, MapPin } from 'lucide-react'
import { BrandMark } from '@/components/brand-mark'

const LINKS = [
  { label: 'Treatments', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Aftercare', href: '/aftercare' },
  { label: 'Policies', href: '/policies' },
  { label: 'My bookings', href: '/bookings' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#1b1917] text-[#f4f0e9]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.35fr_0.65fr_0.8fr]">
          <div>
            <BrandMark className="text-4xl text-[#f4f0e9]" />
            <h2 className="mt-8 max-w-xl font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Quiet luxury for your natural lashes.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#bdb5aa]">
              Bespoke Korean lash lifts and tinting in Stoke-on-Trent, shaped around your eyes and your style.
            </p>
            <Link
              href="/book"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f4f0e9] px-6 py-3 text-sm font-medium text-[#1b1917] transition-transform hover:-translate-y-0.5"
            >
              Reserve your appointment
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <p className="eyebrow text-[#8f877d]">Explore</p>
            <div className="mt-6 flex flex-col gap-3">
              {LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-[#d8d1c8] transition-colors hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow text-[#8f877d]">Visit & connect</p>
            <div className="mt-6 flex flex-col gap-4 text-sm text-[#d8d1c8]">
              <span className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#8f877d]" />
                Stoke-on-Trent, England
              </span>
              <a href="mailto:info@hauslash.co" className="flex items-center gap-3 transition-colors hover:text-white">
                <Mail className="h-4 w-4 text-[#8f877d]" />
                info@hauslash.co
              </a>
              <a
                href="https://www.instagram.com/hauslash_co/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <Instagram className="h-4 w-4 text-[#8f877d]" />
                @hauslash_co
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[#8f877d] sm:flex-row sm:items-center sm:justify-between">
          <p>{new Date().getFullYear()} Hauslash. All rights reserved.</p>
          <p>Precision treatments. Naturally elevated results.</p>
        </div>
      </div>
    </footer>
  )
}
