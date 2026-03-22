'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    q: 'What is a Korean lash lift?',
    a: 'A Korean lash lift uses a specialised technique to create a dramatic yet natural-looking curl. Unlike traditional perming, it lifts lashes from the root and includes a nourishing tint for fuller, darker results that last 6-8 weeks.',
  },
  {
    q: 'How long does a treatment take?',
    a: 'Most individual treatments take 30-75 minutes depending on the service. Our Korean Lash Lift treatment take approximately maximum 90 minutes.',
  },
  {
    q: 'Do I need a patch test?',
    a: 'If you require a patch test, please let us know when booking. We will arrange it for you before the appointment',
  },
  {
    q: 'How long do results last?',
    a: 'Lash lifts typically last 6-8 weeks. Results vary depending on your natural hair growth cycle.',
  },
  {
    q: 'Is a deposit required to book?',
    a: 'Yes, we take a small deposit when you book online. This secures your appointment and is deducted from the total treatment cost on the day.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'A deposit is required to secure your appointment. Please note that all deposits are non-refundable in the event of a cancellation or if you do not attend your scheduled appointment (no-show). The deposit secures your reserved time slot and is deducted from the total cost of your treatment on the day of your appointment. Please refer to our policies page for full details.',
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="border-t border-border/60 bg-card">
      <div className="mx-auto max-w-3xl px-2 sm:px-6 py-12 md:py-20">
        <div className="mb-8 md:mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            FAQ
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground md:text-4xl text-balance">
            Common questions
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-border/60">
          {FAQS.map((faq, i) => (
            <button
              key={i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full flex-col py-4 md:py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={openIndex === i}
              aria-controls={`faq-panel-${i}`}
              id={`faq-header-${i}`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-base font-medium text-foreground">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                    openIndex === i && 'rotate-180'
                  )}
                  aria-hidden="true"
                />
              </div>
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-header-${i}`}
                className={cn(
                  'overflow-hidden transition-all duration-300 text-muted-foreground',
                  openIndex === i
                    ? 'max-h-40 opacity-100 mt-2'
                    : 'max-h-0 opacity-0 h-0'
                )}
              >
                {openIndex === i && (
                  <p className="text-sm md:text-base leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
