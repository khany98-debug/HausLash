import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="px-5 py-20 sm:px-8 md:py-28">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#d9cbbc] px-6 py-16 text-center sm:px-10 md:py-24">
        <div className="absolute left-[-6rem] top-[-8rem] h-72 w-72 rounded-full border border-white/40" />
        <div className="absolute bottom-[-10rem] right-[-5rem] h-80 w-80 rounded-full border border-white/40" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="eyebrow text-foreground/60">Your next appointment</p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.05] tracking-[-0.04em] sm:text-6xl">
            Wake up ready,
            <span className="block italic">every single day.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-foreground/65 sm:text-base">
            Choose your treatment, find a time that suits you, and secure your appointment online in minutes.
          </p>
          <Button asChild size="lg" className="mt-8 h-12 rounded-full px-7">
            <Link href="/book">
              Book your lash lift
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
