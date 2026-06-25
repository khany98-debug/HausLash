import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'

const DETAILS = [
  'A consultation shaped around your desired finish',
  'A considered technique for lift without harshness',
  'Clear aftercare guidance for beautiful longevity',
]

export function ExperienceSection() {
  return (
    <section className="relative overflow-hidden bg-[#1b1917] text-[#f5f1eb]">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(201,185,167,0.18),transparent_28%),radial-gradient(circle_at_88%_70%,rgba(255,255,255,0.08),transparent_24%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="relative min-h-[500px]">
          <div className="absolute inset-y-0 left-0 w-[78%] overflow-hidden rounded-[1.75rem] shadow-[0_42px_120px_-62px_rgba(0,0,0,0.95)]">
            <Image
              src="/images/work/hauslash-green-eye-detail.jpg"
              alt="Detailed lash lift result"
              fill
              sizes="(max-width: 1024px) 78vw, 39vw"
              className="object-cover object-[45%_48%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/5" />
          </div>
          <div className="absolute bottom-6 right-0 w-[48%] overflow-hidden rounded-[1.35rem] border-[5px] border-[#1b1917] shadow-2xl">
            <div className="relative aspect-[3/4]">
              <Image
                src="/images/work/hauslash-blue-eye-detail.jpg"
                alt="Natural Hauslash result"
                fill
                sizes="(max-width: 1024px) 48vw, 24vw"
                className="object-cover object-center"
              />
            </div>
          </div>
          <div className="absolute left-6 top-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur-md">
            Detail-led results
          </div>
        </div>

        <div className="relative">
          <p className="eyebrow text-[#91887e]">The Hauslash approach</p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.08] tracking-[-0.035em] sm:text-5xl">
            Precision you can see.
            <span className="block italic text-[#c9b9a7]">Care you can feel.</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-8 text-[#bdb5aa]">
            No two sets of eyes are the same. Every appointment begins with a thoughtful consultation, then every detail is tailored for a refined result that still feels unmistakably you.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {['Consult', 'Map', 'Lift'].map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="font-serif text-2xl italic text-[#c9b9a7]">{String(index + 1).padStart(2, '0')}</p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#91887e]">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-4 border-y border-white/10 py-7">
            {DETAILS.map((detail) => (
              <div key={detail} className="flex items-start gap-3 text-sm leading-6 text-[#d8d1c8]">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[#c9b9a7]" />
                {detail}
              </div>
            ))}
          </div>
          <Link href="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
            Discover the Hauslash story
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
