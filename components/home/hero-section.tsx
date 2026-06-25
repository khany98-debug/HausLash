import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section id="signature" className="relative isolate scroll-mt-20 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(244,240,233,1)_0%,rgba(250,247,242,0.72)_42%,rgba(244,240,233,1)_100%)]" />
      <div aria-hidden="true" className="absolute left-[-12rem] top-24 -z-10 h-96 w-96 rounded-full bg-[#d9cbbc]/30 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-24">
        <div className="relative z-10 order-2 max-w-full lg:order-1">
          <p className="eyebrow max-w-[20rem] leading-5 sm:max-w-none">Signature Korean lash lift · Stoke-on-Trent</p>
          <h1 className="mt-6 max-w-xl font-serif text-5xl leading-[0.98] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-[5.25rem]">
            Your lashes,
            <span className="block italic">
              <span className="block sm:inline">beautifully</span>
              <span className="block sm:inline">considered.</span>
            </span>
          </h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Bespoke lash lifts that open the eye, honour your natural features, and make every morning feel effortless.
          </p>

          <div className="mt-8 flex w-full max-w-[22rem] flex-col gap-3 sm:max-w-none sm:flex-row">
            <Button asChild size="lg" className="h-12 w-full justify-center rounded-full px-7 sm:w-auto">
              <Link href="/book">
                Reserve your appointment
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 w-full justify-center rounded-full border-foreground/15 bg-transparent px-7 sm:w-auto">
              <Link href="/services">Explore treatments</Link>
            </Button>
          </div>

          <div className="mt-10 flex max-w-[22rem] flex-wrap gap-x-6 gap-y-3 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground sm:max-w-none">
            {['Tailored mapping', 'Premium products', '6-8 week results'].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-foreground/15">
                  <Check className="h-3 w-3 text-foreground" />
                </span>
                {item}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-3 border-y border-foreground/10 py-5 text-sm text-muted-foreground sm:grid-cols-3">
            {[
              ['01', 'Consultation and lash mapping'],
              ['02', 'Lift, tint, and refined setting'],
              ['03', 'Aftercare plan before you leave'],
            ].map(([step, label]) => (
              <div key={step} className="flex gap-3">
                <span className="font-serif text-xl italic text-foreground/45">{step}</span>
                <span className="leading-6">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative order-1 min-h-[460px] w-full max-w-full lg:order-2 lg:min-h-[650px]">
          <div className="absolute inset-x-0 top-0 h-[88%] overflow-hidden rounded-[2rem] bg-[#d8cec0] shadow-[0_46px_110px_-55px_rgba(37,30,24,0.7)]">
            <Image
              src="/images/work/hauslash-editorial-mirror.jpg"
              alt="Bespoke Hauslash lash lift result"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-[50%_46%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/20" />
            <div className="absolute bottom-5 left-5 rounded-full border border-white/25 bg-black/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              Real client result
            </div>
          </div>

          <div className="absolute bottom-0 right-10 w-[34%] overflow-hidden rounded-[1.5rem] border-[6px] border-background bg-muted shadow-[0_30px_80px_-42px_rgba(31,25,20,0.85)] sm:right-7 sm:w-[43%]">
            <div className="relative aspect-[3/4]">
              <Image
                src="/images/work/hauslash-amber-eye-closeup.jpg"
                alt="Detailed Korean lash lift result"
                fill
                sizes="(max-width: 1024px) 40vw, 22vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          <div className="absolute bottom-[8%] left-[-0.5rem] max-w-[13rem] rounded-2xl border border-white/55 bg-background/88 p-4 shadow-xl backdrop-blur-md sm:left-[-1.5rem] sm:p-5">
            <p className="font-serif text-3xl tracking-tight">6-8</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              weeks of lifted, low-maintenance lashes
            </p>
          </div>

          <div className="absolute right-8 top-8 hidden max-w-[10rem] rounded-2xl border border-white/45 bg-white/20 p-4 text-white shadow-xl backdrop-blur-md sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/75">Finish</p>
            <p className="mt-2 font-serif text-2xl leading-none">Open, glossy, natural</p>
          </div>
        </div>
      </div>
    </section>
  )
}
