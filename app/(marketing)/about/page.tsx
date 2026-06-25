import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Eye, Heart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const VALUES = [
  {
    icon: Eye,
    title: 'Every eye is different',
    copy: 'Your lift is mapped around your natural lashes, eye shape, and the finish you want.',
  },
  {
    icon: Sparkles,
    title: 'Refinement over excess',
    copy: 'The goal is a beautifully open eye and a polished result that still feels like you.',
  },
  {
    icon: Heart,
    title: 'Care in every detail',
    copy: 'From consultation to aftercare, your comfort and lash health stay at the centre.',
  },
]

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <div>
          <p className="eyebrow">About Hauslash</p>
          <h1 className="mt-5 display-title">
            A considered approach to
            <span className="block italic">natural beauty.</span>
          </h1>
          <p className="mt-7 max-w-lg text-base leading-8 text-muted-foreground">
            Hauslash is a Stoke-on-Trent lash studio devoted to precise, personalised treatments. We specialise in Korean lash lifts that enhance what is already yours: no extensions, no heavy upkeep, just beautifully elevated lashes.
          </p>
          <Button asChild size="lg" className="mt-8 h-12 rounded-full px-7">
            <Link href="/book">
              Reserve your appointment
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="relative min-h-[540px]">
          <div className="absolute inset-y-0 right-0 w-[82%] overflow-hidden rounded-[2rem] border border-foreground/10 bg-muted shadow-[0_40px_110px_-60px_rgba(42,34,28,0.75)]">
            <Image
              src="/images/work/hauslash-editorial-mirror.jpg"
              alt="Hauslash Korean lash lift result"
              fill
              priority
              sizes="(max-width: 1024px) 82vw, 45vw"
              className="object-cover object-[50%_47%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
          </div>
          <div className="absolute bottom-8 left-0 w-[43%] overflow-hidden rounded-[1.5rem] border-[6px] border-background shadow-xl">
            <div className="relative aspect-[3/4]">
              <Image
                src="/images/work/hauslash-blue-eye-detail.jpg"
                alt="Natural lifted lashes"
                fill
                sizes="(max-width: 1024px) 43vw, 23vw"
                className="object-cover object-[50%_45%]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-foreground/10 bg-card/55">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="eyebrow">Our philosophy</p>
              <h2 className="mt-4 font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                Small details make the
                <span className="block italic">biggest difference.</span>
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {VALUES.map((value) => (
                <article key={value.title} className="luxury-card p-6">
                  <value.icon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="mt-8 font-serif text-xl">{value.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{value.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem]">
          <Image
            src="/images/work/hauslash-green-eye-detail.jpg"
            alt="Finished Hauslash treatment"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-[45%_50%]"
          />
        </div>
        <div>
          <p className="eyebrow">What to expect</p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            Calm, personal,
            <span className="block italic">never rushed.</span>
          </h2>
          <p className="mt-6 text-base leading-8 text-muted-foreground">
            Your appointment starts with a consultation and ends with tailored aftercare. Between those moments, every step is performed with patience and precision so you can relax and leave feeling polished, confident, and completely yourself.
          </p>
          <Link href="/aftercare" className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
            Read the aftercare guide
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
