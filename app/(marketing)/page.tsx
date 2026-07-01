export const metadata = {
  title: 'HausLash - Premium Korean Lash Lift Studio in Stoke-on-Trent',
  description: 'Professional Korean lash lifts in Stoke-on-Trent. Expert treatments for effortless, naturally elevated beauty. Book your appointment today.',
  keywords: 'lash lift, Korean lash lift, lash tinting, Stoke-on-Trent, beauty',
  openGraph: {
    title: 'HausLash - Premium Lash Lift Treatments',
    description: 'Professional Korean lash lifts in Stoke-on-Trent',
    url: '/',
    images: [
      {
        url: '/images/hauslash-social-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'Hauslash Korean lash lift studio in Stoke-on-Trent',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HausLash - Premium Lash Lift Treatments',
    description: 'Professional Korean lash lifts in Stoke-on-Trent',
    images: ['/images/hauslash-social-preview.jpg'],
  },
}

import { HeroSection } from '@/components/home/hero-section'
import { VideoHero } from '@/components/home/video-hero'
import { TrustSection } from '@/components/home/trust-section'
import { ExperienceSection } from '@/components/home/experience-section'
import { GallerySection } from '@/components/home/gallery-section'
import TestimonialsSection from '@/components/home/testimonials-section'
import { ReviewInvite } from '@/components/home/review-invite'
import { FaqSection } from '@/components/home/faq-section'
import { CtaSection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <>
      <VideoHero />
      <HeroSection />
      <TrustSection />
      <ExperienceSection />
      <GallerySection />
      <TestimonialsSection />
      <ReviewInvite />
      <FaqSection />
      <CtaSection />
    </>
  )
}
