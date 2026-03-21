// lib/schema.ts
// JSON-LD Schema markup for SEO

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'HausLash',
    image: 'https://hauslash.co/images/logo.png',
    description: 'Premium Korean lash lift and lash tinting studio in Stoke-on-Trent',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Stoke-on-Trent',
      addressRegion: 'England',
      postalCode: 'ST3',
      addressCountry: 'UK',
    },
    telephone: '+44 (0) 7700 900000',
    email: 'hello@hauslash.co',
    url: 'https://hauslash.co',
    sameAs: [
      'https://www.instagram.com/hauslash',
      'https://www.facebook.com/hauslash',
    ],
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '15:00',
      },
    ],
  }
}

export function getServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Professional Lash Lift Services',
    provider: {
      '@type': 'LocalBusiness',
      name: 'HausLash',
      url: 'https://hauslash.co',
    },
    description: 'Expert Korean lash lifts and lash tinting treatments',
    areaServed: {
      '@type': 'City',
      name: 'Stoke-on-Trent',
    },
  }
}

export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function getAggregateRatingSchema(ratingValue: number, reviewCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: ratingValue,
    reviewCount: reviewCount,
  }
}
