'use client'

import { AlertCircle, Clock, Droplet, Wind, Zap, Coffee } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AftercareInstructionsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-12 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-transparent border-b border-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Aftercare Instructions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow these simple steps to maximize your lash lift results and ensure beautiful lashes for up to 8 weeks.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Important Alert */}
          <Alert className="mb-8 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-700" />
            <AlertDescription className="text-amber-700">
              <strong>First 24-48 Hours:</strong> Your lashes are setting during this critical period. Following these instructions is essential for optimal results.
            </AlertDescription>
          </Alert>

          {/* Timeline Section */}
          <div className="mb-16">
            <h2 className="font-serif text-3xl text-foreground mb-8">
              Timeline for Care
            </h2>

            <div className="space-y-6">
              {/* First 24 Hours */}
              <Card className="p-6 border-primary/10">
                <div className="flex gap-4 mb-4">
                  <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif text-xl text-foreground mb-2">
                      First 24 Hours - Critical Setting Period
                    </h3>
                    <Badge className="mb-4">Most Important</Badge>
                  </div>
                </div>

                <ul className="space-y-3 text-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>
                      <strong>No water, steam, or moisture</strong> - Avoid washing your face, showering, or exposing lashes to steam
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>
                      <strong>No makeup</strong> - Skip eye makeup, mascara, and liner during this period
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>
                      <strong>No touching or rubbing</strong> - Avoid touching, rubbing, or manipulating your lashes
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>
                      <strong>Sleep on your back</strong> - Prevent pressure on your lashes by sleeping on your back
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>
                      <strong>No saunas or swimming</strong> - Avoid hot environments and chlorinated pools
                    </span>
                  </li>
                </ul>
              </Card>

              {/* Days 2-7 */}
              <Card className="p-6 border-primary/10">
                <div className="flex gap-4 mb-4">
                  <Droplet className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <h3 className="font-serif text-xl text-foreground">
                    Days 2-7 - Careful Management
                  </h3>
                </div>

                <ul className="space-y-3 text-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>
                      <strong>Gentle cleansing</strong> - When washing, keep eyes closed and use only gentle, lukewarm water
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>
                      <strong>Oil-free products</strong> - Use oil-free makeup and skincare products around the eyes
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>
                      <strong>Minimal makeup</strong> - When wearing makeup, apply lighter amounts and remove gently
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>
                      <strong>Avoid hot showers</strong> - Keep water temperature lukewarm when near your face
                    </span>
                  </li>
                </ul>
              </Card>

              {/* Week 2 Onwards */}
              <Card className="p-6 border-primary/10">
                <div className="flex gap-4 mb-4">
                  <Zap className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <h3 className="font-serif text-xl text-foreground">
                    Week 2 & Beyond - Maintenance
                  </h3>
                </div>

                <ul className="space-y-3 text-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>
                      <strong>Regular gentle cleansing</strong> - Use makeup remover or gentle cleanser as usual
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>
                      <strong>Avoid waterproof mascara</strong> - It's harder to remove and can strain delicate lashes
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>
                      <strong>Use lash serum</strong> - Consider using a nourishing lash serum to maintain health
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>
                      <strong>Brush gently</strong> - Use a clean spoolie brush to comb lashes gently
                    </span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Do's and Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Do's */}
            <div>
              <h3 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-2">
                <span className="text-green-600">✓</span> Do's
              </h3>
              <ul className="space-y-3 text-foreground">
                {[
                  'Sleep on your back',
                  'Use lukewarm water for washing',
                  'Keep eyes closed in showers',
                  'Use oil-free makeup and skincare',
                  'Be gentle when cleansing',
                  'Use mascara (after 2-3 days)',
                  'Apply makeup remover gently',
                  'Use lash serum for maintenance',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div>
              <h3 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-2">
                <span className="text-red-600">✗</span> Don'ts
              </h3>
              <ul className="space-y-3 text-foreground">
                {[
                  'Get lashes wet in first 24-48 hours',
                  'Use hot water or steam on face',
                  'Rub or pull your lashes',
                  'Sleep on your side or stomach',
                  'Use waterproof mascara',
                  'Use oil-based treatments or makeup',
                  'Visit saunas or steam rooms',
                  'Go swimming for 1 week',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-red-600 font-bold flex-shrink-0">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="font-serif text-3xl text-foreground mb-8">
              Common Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: 'How long do results last?',
                  a: 'Your lash lift results typically last 6-8 weeks. After this period, your natural lash growth cycle will cause the curl to gradually return to normal.',
                },
                {
                  q: 'Can I wear makeup after my appointment?',
                  a: 'We recommend avoiding eye makeup for the first 24-48 hours. After that, you can wear makeup, but use oil-free products and avoid waterproof formulas for the best results.',
                },
                {
                  q: 'What if I accidentally get my lashes wet?',
                  a: 'If you get your lashes wet within the first 48 hours, gently pat them dry with a clean cloth. Avoid rubbing. It may slightly affect the longevity of your lift, so try to reschedule if you know water exposure is unavoidable.',
                },
                {
                  q: 'Can I use mascara?',
                  a: 'Yes, you can use regular mascara after 2-3 days. Avoid waterproof formulas as they require more aggressive removal that can damage your lifted lashes.',
                },
                {
                  q: 'What should I do if my lashes feel uncomfortable?',
                  a: 'Some slight sensitivity is normal for the first few hours. If discomfort persists or worsens, contact us immediately. Avoid touching or rubbing your eyes.',
                },
                {
                  q: 'Can I combine a lash lift with other treatments?',
                  a: 'Lash lifts pair beautifully with tinting. However, space them out if possible. Never combine with eyelash extensions.',
                },
              ].map((item, idx) => (
                <Card key={idx} className="p-6 border-primary/10">
                  <h4 className="font-semibold text-foreground mb-2">{item.q}</h4>
                  <p className="text-muted-foreground">{item.a}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <Card className="p-8 border-primary/20 bg-primary/5 text-center">
            <h3 className="font-serif text-2xl text-foreground mb-4">
              Questions About Your Aftercare?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you have any concerns or complications, please don't hesitate to contact us. We're here to ensure your lashes look and feel perfect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+441782123456"
                className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
              >
                Call Us
              </a>
              <a
                href="mailto:hello@hauslash.co"
                className="inline-flex items-center justify-center px-6 py-2 border border-primary text-primary rounded-full hover:bg-primary/5 transition-colors"
              >
                Email Us
              </a>
            </div>
          </Card>
        </div>
      </section>
    </main>
  )
}
