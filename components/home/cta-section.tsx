import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl text-balance">
          Ready to elevate your look?
        </h2>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground">
          Book your appointment today and discover the Hauslash difference.
          Your natural beauty, beautifully enhanced.
        </p>
        <Button asChild size="lg" className="rounded-full px-10">
          <Link href="/book">Book Your Appointment</Link>
        </Button>
      </div>
    </section>
  )
}
