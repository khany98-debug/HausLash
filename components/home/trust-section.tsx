import { Clock3, Eye, ShieldCheck, Sparkles } from 'lucide-react'

const ITEMS = [
  { icon: Eye, value: '01', label: 'Consultation and patch test', detail: 'A calm check-in before treatment so your lift feels right for you.' },
  { icon: Sparkles, value: '02', label: 'Korean lift technique', detail: 'A modern finish for open, glossy, natural-looking lashes.' },
  { icon: Clock3, value: '03', label: '6-8 week results', detail: 'Designed for low-maintenance definition between visits.' },
  { icon: ShieldCheck, value: '04', label: 'Aftercare led', detail: 'Clear guidance to protect the lift and your natural lashes.' },
]

export function TrustSection() {
  return (
    <section className="relative overflow-hidden border-y border-foreground/10 bg-card/60">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.72),transparent_42%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {ITEMS.map((item, index) => (
          <div
            key={item.value}
            className="group relative flex min-h-48 flex-col justify-between overflow-hidden rounded-[1.35rem] border border-foreground/10 bg-background/45 p-6 transition duration-300 hover:-translate-y-1 hover:bg-background/70 hover:shadow-[0_22px_70px_-48px_rgba(42,34,28,0.55)]"
          >
            <div className="absolute right-4 top-4 font-serif text-5xl italic tracking-tight text-foreground/[0.055] transition group-hover:text-foreground/[0.09]">
              {item.value}
            </div>
            <item.icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="font-serif text-2xl tracking-tight">{item.label}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
