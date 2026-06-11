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

import { HeroSection } from '@/components/home/hero-section'
import { TrustSection } from '@/components/home/trust-section'
import { ExperienceSection } from '@/components/home/experience-section'
import { GallerySection } from '@/components/home/gallery-section'
import TestimonialsSection from '@/components/home/testimonials-section'
import { FaqSection } from '@/components/home/faq-section'
import { CtaSection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <ExperienceSection />
      <GallerySection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
