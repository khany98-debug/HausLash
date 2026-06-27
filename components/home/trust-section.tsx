import { CalendarCheck, Clock3, CreditCard, MapPin } from 'lucide-react'

const ITEMS = [
  { icon: CalendarCheck, value: '01', label: 'Patch test', detail: 'Required if this is your first lash lift with Hauslash. Please enquire about your patch test before booking.' },
  { icon: Clock3, value: '02', label: '60-90 minutes', detail: 'Most appointments include lifting, tinting, setting time, and a calm finish.' },
  { icon: CreditCard, value: '03', label: '£15 deposit', detail: 'Your booking is secured online. Deposits are non-refundable once the booking has been made.' },
  { icon: MapPin, value: '04', label: 'Studio or mobile', detail: 'Visit the Stoke-on-Trent studio or choose selected mobile outcall appointments.' },
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
