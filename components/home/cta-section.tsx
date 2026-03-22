import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-2 sm:px-6 py-12 md:py-20">
      <div className="flex flex-col items-center gap-5 md:gap-6 text-center">
        <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl text-balance mb-2 md:mb-3">
          Ready to elevate your look?
        </h2>
        <p className="max-w-md text-base md:text-lg leading-relaxed text-muted-foreground mb-2">
          Book your appointment today and discover the Hauslash difference.
          Your natural beauty, beautifully enhanced.
        </p>
        <Button asChild size="lg" className="rounded-full px-10 focus-visible:ring-2 focus-visible:ring-primary">
          <Link href="/book">Book Your Appointment</Link>
        </Button>
      </div>
    </section>
  )
}
