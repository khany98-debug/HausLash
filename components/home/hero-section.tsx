import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section id="signature" className="relative scroll-mt-20 overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100svh-72px)] max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-16">
        <div className="relative z-10 order-2 lg:order-1">
          <p className="eyebrow">Korean lash lift specialist · Stoke-on-Trent</p>
          <h1 className="mt-6 max-w-xl font-serif text-5xl leading-[0.98] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-[5.25rem]">
            Your lashes,
            <span className="block italic">beautifully considered.</span>
          </h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Bespoke lash lifts that open the eye, honour your natural features, and make every morning feel effortless.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full px-7">
              <Link href="/book">
                Reserve your appointment
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-full border-foreground/15 bg-transparent px-7">
              <Link href="/services">Explore treatments</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {['Tailored mapping', 'Premium products', '6-8 week results'].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-foreground/15">
                  <Check className="h-3 w-3 text-foreground" />
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative order-1 min-h-[460px] lg:order-2 lg:min-h-[650px]">
          <div className="absolute inset-x-0 top-0 h-[88%] overflow-hidden rounded-[2rem] bg-[#d8cec0] shadow-[0_40px_100px_-55px_rgba(37,30,24,0.65)]">
            <Image
              src="/images/work/Model3.jpeg"
              alt="Bespoke Hauslash lash lift result"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
            <div className="absolute bottom-5 left-5 rounded-full border border-white/25 bg-black/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              Real client result
            </div>
          </div>

          <div className="absolute bottom-0 right-3 w-[43%] overflow-hidden rounded-[1.5rem] border-[6px] border-background bg-muted shadow-2xl sm:right-7">
            <div className="relative aspect-[3/4]">
              <Image
                src="/images/work/Model2.jpeg"
                alt="Detailed Korean lash lift result"
                fill
                sizes="(max-width: 1024px) 40vw, 22vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="absolute bottom-[8%] left-[-0.5rem] max-w-[12rem] rounded-2xl border border-white/50 bg-background/85 p-4 shadow-xl backdrop-blur-md sm:left-[-1.5rem] sm:p-5">
            <p className="font-serif text-3xl tracking-tight">6-8</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              weeks of lifted, low-maintenance lashes
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
