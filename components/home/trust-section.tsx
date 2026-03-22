import { Clock, Shield, Sparkles, Heart } from 'lucide-react'

const TRUST_ITEMS = [
  {
    icon: Sparkles,
    title: 'Korean Technique',
    description: 'Trained in the latest Korean lash lifting methods for a natural, dramatic curl.',
  },
  {
    icon: Clock,
    title: 'Long-Lasting',
    description: 'Enjoy beautifully lifted lashes for 6-8 weeks.',
  },
  {
    icon: Shield,
    title: 'Safe & Gentle',
    description: 'We use premium, cruelty-free products that are gentle on sensitive eyes.',
  },
  {
    icon: Heart,
    title: 'Personalised Care',
    description: 'Every treatment is tailored to your unique eye shape and desired look.',
  },
]

export function TrustSection() {
  return (
    <section className="border-y border-border/60 bg-card">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Why Hauslash
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground md:text-4xl text-balance">
            Beauty that speaks for itself
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center gap-4 text-center rounded-xl bg-card/80 p-6 transition-shadow hover:shadow-lg focus-within:shadow-lg outline-none"
              tabIndex={0}
              aria-label={item.title + ': ' + item.description}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent mb-2">
                <item.icon className="h-6 w-6 text-accent-foreground" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
