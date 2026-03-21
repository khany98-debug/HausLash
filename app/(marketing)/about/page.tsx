'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Award, Heart, Sparkles } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-transparent border-b border-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            About HausLash
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bringing premium lash services directly to you with professionalism, passion, and perfection.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Our Story</Badge>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
                Lash Service With a Personal Touch
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  HausLash was born from a passion for beauty and a commitment to bringing premium lash services to the people of Stoke-on-Trent. What started as a dream has become a trusted beauty service that clients love.
                </p>
                <p>
                  We specialize in professional lash lifts using premium Korean techniques and quality products. Every appointment is tailored to your unique eye shape and beauty goals, ensuring stunning results that last.
                </p>
                <p>
                  Our mission is simple: provide salon-quality lash services in the comfort of your home (or our studio), with the professionalism and attention to detail you deserve.
                </p>
              </div>
            </div>
            <div className="relative h-96 lg:h-full rounded-xl overflow-hidden bg-muted">
              {/* Placeholder - will be replaced with actual image */}
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="h-16 w-16 text-primary/40 mx-auto mb-4" />
                  <p className="text-muted-foreground">Your image here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
              Our Team
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">
              Meet the Artist Behind HausLash
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Team Member */}
            <Card className="overflow-hidden border-primary/10">
              <div className="relative h-64 bg-muted">
                {/* Placeholder - will be replaced with actual photo */}
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="h-12 w-12 text-primary/40 mx-auto mb-2" />
                    <p className="text-muted-foreground">Your photo here</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl text-foreground mb-2">
                  [Your Name]
                </h3>
                <p className="text-primary font-semibold mb-4">
                  Founder & Lash Artist
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  With [X] years of professional excellence in lash and beauty services, I'm dedicated to delivering flawless results. Certified in Korean lash techniques with a passion for perfecting the art of lash lifting.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Korean Lash Lift</Badge>

                  <Badge variant="secondary">Trained Professional</Badge>
                </div>
              </div>
            </Card>

            {/* Services Highlight */}
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-foreground mb-6">
                  Why Choose HausLash?
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Award className="h-6 w-6 text-primary mt-1" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Professional Training
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Certified in premium Korean lash lift techniques with ongoing professional development
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-primary mt-1" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Premium Products
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Using only high-quality, professional-grade products for lasting results
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Heart className="h-6 w-6 text-primary mt-1" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Client-Focused
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Every appointment is tailored to your comfort and beauty goals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything we do is guided by these core principles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Quality',
                description: 'Premium products and professional techniques for flawless results every time',
              },
              {
                title: 'Professionalism',
                description: 'Punctual, reliable, and maintaining the highest hygiene and safety standards',
              },
              {
                title: 'Passion',
                description: 'Genuine love for beauty and commitment to making our clients feel confident',
              },
            ].map((value) => (
              <Card
                key={value.title}
                className="p-6 text-center border-primary/10 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-primary/5 border-t border-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Ready to Experience HausLash?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book your personalized lash appointment and see why our clients love HausLash.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <a href="/book">Book Your Appointment</a>
          </Button>
        </div>
      </section>
    </main>
  )
}
