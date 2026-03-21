export const metadata = {
  title: 'HausLash - Premium Korean Lash Lift Studio in Stoke-on-Trent',
  description: 'Professional Korean lash lifts in Stoke-on-Trent. Expert treatments for effortless, naturally elevated beauty. Book your appointment today.',
  keywords: 'lash lift, Korean lash lift, lash tinting, Stoke-on-Trent, beauty',
  openGraph: {
    title: 'HausLash - Premium Lash Lift Treatments',
    description: 'Professional Korean lash lifts in Stoke-on-Trent',
    type: 'website',
  },
}

import { getDb } from '@/lib/db'
import { Service } from '@/lib/types'
import { HeroSection } from '@/components/home/hero-section'
import { TrustSection } from '@/components/home/trust-section'
import { GallerySection } from '@/components/home/gallery-section'
import VideoShowcase from '@/components/home/video-showcase'
import TestimonialsSection from '@/components/home/testimonials-section'
import TestimonialForm from '@/components/home/testimonial-form'
import { FaqSection } from '@/components/home/faq-section'
import { CtaSection } from '@/components/home/cta-section'

export const dynamic = 'force-dynamic'

async function getServices(): Promise<Service[]> {
  const sql = getDb()
  const rows = await sql`SELECT * FROM services WHERE active = true ORDER BY sort_order ASC`
  return rows as Service[]
}

export default async function HomePage() {
  const services = await getServices()

  return (
    <>
      <HeroSection />
      <TrustSection />
      <VideoShowcase
        videoId={process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || ''}
        title="The HausLash Experience"
        description="Discover professional lash lift services delivered with expertise and elegance. Watch our brand story and see why clients choose HausLash."
        provider="youtube"
      />
      <GallerySection />
      <TestimonialsSection />
      <TestimonialForm />
      <FaqSection />
      <CtaSection />
    </>
  )
}
