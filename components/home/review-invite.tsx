import Link from 'next/link'
import { ArrowUpRight, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ReviewInvite() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-14">
      <div className="rounded-[1.75rem] border border-foreground/10 bg-foreground px-6 py-8 text-primary-foreground sm:flex sm:items-center sm:justify-between sm:px-9">
        <div>
          <p className="eyebrow text-primary-foreground/50">Client stories</p>
          <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
            Loved your Hauslash experience?
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/65">
            Share a review or read what other clients say about their results.
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:mt-0 sm:flex-row">
          <Button asChild variant="secondary" className="rounded-full">
            <Link href="/reviews#leave-a-review">
              <Star className="h-4 w-4" />
              Leave a review
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-white/20 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
          >
            <Link href="/reviews">
              Read reviews
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
