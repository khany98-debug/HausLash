import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const INSTAGRAM_URL = 'https://www.instagram.com/hauslash_co/'

export function HeroSection() {
  return (
    <section id="signature" className="relative isolate scroll-mt-20 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(244,240,233,1)_0%,rgba(250,247,242,0.72)_42%,rgba(244,240,233,1)_100%)]" />
      <div aria-hidden="true" className="absolute left-[-12rem] top-24 -z-10 h-96 w-96 rounded-full bg-[#d9cbbc]/30 blur-3xl" />
      <div className="mx-auto grid min-w-0 max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[0.84fr_1.16fr] lg:gap-20 lg:py-24">
        <div className="relative z-10 order-2 mx-auto w-full max-w-[38rem] min-w-0 lg:order-1 lg:max-w-none">
          <p className="eyebrow max-w-[20rem] leading-5 sm:max-w-none">Signature Korean lash lift · Stoke-on-Trent</p>
          <h1 className="mt-6 max-w-xl font-serif text-4xl leading-[0.98] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-[4.65rem]">
            Your lashes,
            <span className="block italic">
              <span className="block">beautifully</span>
              <span className="block">considered.</span>
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
            <Button asChild variant="outline" size="lg" className="h-12 w-full justify-center rounded-full border-foreground/15 bg-transparent px-7 sm:w-auto">
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                Enquire via Instagram
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <p className="mt-9 max-w-md border-l border-foreground/15 pl-5 text-sm leading-7 text-muted-foreground">
            A soft, polished lift with a glossy tint, designed for natural lashes and low-maintenance mornings.
          </p>
        </div>

        <div className="relative order-1 mx-auto min-h-[440px] w-full max-w-[38rem] lg:order-2 lg:min-h-[650px] lg:max-w-none">
          <div className="absolute inset-x-0 top-0 h-[88%] overflow-hidden rounded-[2rem] bg-[#d8cec0] shadow-[0_46px_110px_-55px_rgba(37,30,24,0.7)]">
            <Image
              src="/images/work/hauslash-client-mirror-lift.jpg"
              alt="Bespoke Hauslash lash lift result"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-[50%_50%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/20" />
            <div className="absolute bottom-5 left-5 rounded-full border border-white/25 bg-black/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              Real client result
            </div>
          </div>

          <div className="absolute bottom-0 right-4 w-[34%] max-w-[9rem] overflow-hidden rounded-[1.5rem] border-[5px] border-background bg-muted shadow-[0_30px_80px_-42px_rgba(31,25,20,0.85)] sm:right-7 sm:w-[43%] sm:max-w-none sm:border-[6px]">
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

          <div className="absolute bottom-[8%] left-0 max-w-[12.5rem] rounded-2xl border border-white/55 bg-background/88 p-4 shadow-xl backdrop-blur-md sm:left-[-1.5rem] sm:max-w-[13rem] sm:p-5">
            <p className="font-serif text-3xl tracking-tight">6-8 weeks</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              lifted, low-maintenance lashes
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
