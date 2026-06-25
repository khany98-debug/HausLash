import Link from 'next/link'
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  Clock3,
  Droplet,
  ShieldCheck,
  Sparkles,
  Wind,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

const TIMELINE = [
  {
    icon: Clock3,
    period: 'First 24 hours',
    title: 'Let the lift set',
    note: 'This is the most important window for keeping the lift clean, dry, and undisturbed.',
    items: [
      'Avoid water, steam, heavy moisture, saunas, and swimming.',
      'Do not apply eye makeup, mascara, liner, or oil-based products.',
      'Sleep on your back where possible and avoid pressing lashes into the pillow.',
      'Keep hands away from the eye area. No rubbing, pulling, or brushing yet.',
    ],
  },
  {
    icon: Droplet,
    period: 'Days 2-7',
    title: 'Cleanse with care',
    note: 'Your lift is set, but gentle habits help preserve the shape and finish.',
    items: [
      'Use lukewarm water and keep cleansing soft around the eyes.',
      'Choose oil-free skincare and makeup around the lash line.',
      'Brush lashes lightly with a clean spoolie when needed.',
      'Avoid hot showers directly on the face and skip waterproof mascara.',
    ],
  },
  {
    icon: Sparkles,
    period: 'Week 2 onward',
    title: 'Maintain the polish',
    note: 'A simple routine keeps lashes soft, separated, and beautifully lifted.',
    items: [
      'Cleanse gently and remove makeup without tugging.',
      'Use a nourishing lash serum if recommended for your lashes.',
      'Brush through only when lashes are dry and settled.',
      'Book your next lift around the 6-8 week mark when the natural cycle softens.',
    ],
  },
]

const DOS = [
  'Keep lashes dry during the first setting window.',
  'Use lukewarm water when cleansing near the eyes.',
  'Choose oil-free products around the lash line.',
  'Brush gently with a clean spoolie after the first day.',
  'Contact Hauslash if anything feels uncomfortable.',
]

const DONTS = [
  'Rub, pull, pick, or sleep with pressure on lashes.',
  'Use steam rooms, saunas, or swimming pools in the first week.',
  'Apply waterproof mascara or harsh makeup removers.',
  'Use oil-based serums or balms around the eyes.',
  'Re-lift lashes before the natural growth cycle is ready.',
]

const FAQS = [
  {
    q: 'How long will my lift last?',
    a: 'Most lash lifts last around 6-8 weeks. Your natural growth cycle, skincare, and aftercare routine can all affect longevity.',
  },
  {
    q: 'What if I accidentally get my lashes wet?',
    a: 'Gently pat them dry with a clean towel and avoid rubbing. One small splash is not usually a disaster, but repeated moisture in the first 24 hours can soften the result.',
  },
  {
    q: 'Can I wear mascara?',
    a: 'Yes, after the first 24-48 hours. A regular, non-waterproof mascara is best because it removes more gently.',
  },
  {
    q: 'Can I use lash serum?',
    a: 'Yes, once the lift has settled. Keep the product light, clean, and away from the lash line if it contains oils.',
  },
]

export default function AftercareInstructionsPage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-foreground/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_15%,rgba(255,255,255,0.86),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(201,185,167,0.25),transparent_28%)]"
        />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <p className="eyebrow">Aftercare ritual</p>
            <h1 className="mt-5 display-title max-w-3xl">
              Protect the lift,
              <span className="block italic">preserve the softness.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
              Your treatment continues after you leave the studio. These simple, calm steps help your lashes stay lifted, glossy, and comfortable for as long as possible.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-foreground/10 bg-foreground p-7 text-primary-foreground shadow-[0_32px_90px_-55px_rgba(42,34,28,0.75)]">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-[#c9b9a7]" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-foreground/45">
                  Most important
                </p>
                <h2 className="mt-3 font-serif text-3xl leading-tight">The first 24 hours matter most.</h2>
                <p className="mt-4 text-sm leading-7 text-primary-foreground/68">
                  Keep lashes dry, clean, and untouched while the lift settles. This one window has the biggest impact on the final result.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <p className="eyebrow">The setting timeline</p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Three phases,
              <span className="block italic">one beautiful finish.</span>
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground lg:justify-self-end">
            Follow the timeline below, then return to your normal routine with a gentler touch around the eye area.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {TIMELINE.map((step, index) => (
            <article key={step.period} className="luxury-card relative overflow-hidden p-6 sm:p-7">
              <span className="absolute right-5 top-4 font-serif text-6xl italic text-foreground/[0.045]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <step.icon className="h-5 w-5 text-muted-foreground" />
              <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {step.period}
              </p>
              <h3 className="mt-3 font-serif text-3xl tracking-tight">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{step.note}</p>
              <ul className="mt-6 space-y-3 border-t border-foreground/10 pt-6">
                {step.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-foreground/80">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-foreground/10 bg-card/55">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-2">
          <article className="rounded-[1.75rem] border border-foreground/10 bg-background/70 p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-foreground" />
              <h2 className="font-serif text-3xl tracking-tight">Do</h2>
            </div>
            <ul className="mt-7 space-y-4">
              {DOS.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[1.75rem] border border-foreground/10 bg-[#1b1917] p-7 text-[#f5f1eb] sm:p-9">
            <div className="flex items-center gap-3">
              <Wind className="h-5 w-5 text-[#c9b9a7]" />
              <h2 className="font-serif text-3xl tracking-tight">Avoid</h2>
            </div>
            <ul className="mt-7 space-y-4">
              {DONTS.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-[#d8d1c8]">
                  <X className="mt-1 h-4 w-4 shrink-0 text-[#c9b9a7]" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="eyebrow">Questions after treatment</p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            Clear answers,
            <span className="block italic">calm guidance.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">
            If something feels unusual, contact Hauslash directly. Aftercare should feel simple, never stressful.
          </p>
        </div>

        <div className="grid gap-4">
          {FAQS.map((item) => (
            <article key={item.q} className="luxury-card p-6 sm:p-7">
              <h3 className="font-serif text-2xl tracking-tight">{item.q}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 md:pb-28">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-foreground/10 bg-[#d9cbbc] p-8 text-center sm:p-12">
          <Sparkles className="mx-auto h-5 w-5 text-foreground/55" />
          <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            Need a second look at your aftercare?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-foreground/65">
            Send a message with your question and Hauslash will help you protect the result.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full px-7">
              <Link href="/contact">
                Contact Hauslash
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-full border-foreground/15 bg-transparent px-7">
              <Link href="/book">Book your next lift</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
