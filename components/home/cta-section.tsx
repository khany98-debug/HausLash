import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const INSTAGRAM_DM_URL = 'https://ig.me/m/hauslash_co'

export function CtaSection() {
  return (
    <section className="px-5 py-20 sm:px-8 md:py-28">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] bg-[#1b1917] px-6 py-16 text-center text-[#f5f1eb] shadow-[0_36px_100px_-62px_rgba(0,0,0,0.9)] sm:px-10 md:py-24">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(201,185,167,0.18),transparent_28%),radial-gradient(circle_at_88%_70%,rgba(255,255,255,0.08),transparent_24%)]" />
        <div className="absolute left-[-6rem] top-[-8rem] h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute bottom-[-10rem] right-[-5rem] h-80 w-80 rounded-full border border-white/10" />
        <div aria-hidden="true" className="absolute inset-x-10 top-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="eyebrow text-[#91887e]">Your next appointment</p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.05] tracking-[-0.04em] sm:text-6xl">
            Wake up ready,
            <span className="block italic text-[#c9b9a7]">every single day.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-[#bdb5aa] sm:text-base">
            Choose your treatment, find a time that suits you, and secure your appointment online in minutes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full bg-[#f5f1eb] px-7 text-[#1b1917] hover:bg-[#ded6cc]">
              <Link href="/book">
                Book your lash lift
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-full border-white/15 bg-white/5 px-7 text-[#f5f1eb] hover:bg-white/10 hover:text-[#f5f1eb]">
              <a href={INSTAGRAM_DM_URL} target="_blank" rel="noreferrer">
                Enquire Now
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
