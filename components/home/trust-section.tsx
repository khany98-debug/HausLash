import { Clock3, Eye, ShieldCheck, Sparkles } from 'lucide-react'

const ITEMS = [
  { icon: Eye, value: 'Bespoke', label: 'Mapped to your eye shape' },
  { icon: Sparkles, value: 'Korean', label: 'Modern lift technique' },
  { icon: Clock3, value: '6-8 weeks', label: 'Long-lasting definition' },
  { icon: ShieldCheck, value: 'Considered', label: 'Gentle, premium products' },
]

export function TrustSection() {
  return (
    <section className="border-y border-foreground/10 bg-card/55">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-8 lg:grid-cols-4">
        {ITEMS.map((item, index) => (
          <div
            key={item.value}
            className={`flex min-h-36 flex-col justify-center gap-3 px-3 py-7 sm:px-6 ${
              index % 2 === 0 ? 'border-r border-foreground/10' : ''
            } ${index > 1 ? 'border-t border-foreground/10 lg:border-t-0' : ''} ${
              index === 1 ? 'lg:border-r' : ''
            }`}
          >
            <item.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="font-serif text-2xl tracking-tight">{item.value}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
