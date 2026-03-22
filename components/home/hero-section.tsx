import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { VideoHero } from './video-hero'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 px-4 md:px-6 lg:px-8 bg-transparent">
      <div className="mx-auto flex flex-col items-center max-w-3xl gap-10">
        {/* Centered Video */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-black/10 bg-black transition-all duration-300">
            <VideoHero
              videoBasePath="/videos/logo-animation"
              alt="HausLash Logo Animation"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Headline and Content below video */}
        <div className="flex flex-col items-center gap-5 text-center mt-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-foreground">
            Premium Lash Studio
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground">
            Stoke-on-Trent
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-foreground text-balance">
            Effortless beauty,{' '}
            <span className="italic">naturally elevated</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Premium Korean lash lifts and tinting treatments in Stoke-on-Trent designed to enhance your natural features. Wake up ready, every day.
          </p>
          <div className="flex flex-col w-full sm:flex-row sm:w-auto gap-4 mt-6">
            <Button asChild size="lg" className="rounded-full px-8 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <Link href="/book" aria-label="Book your appointment">Book Your Appointment</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <Link href="/services" aria-label="View services">View Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}