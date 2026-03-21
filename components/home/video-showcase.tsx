'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

interface VideoShowcaseProps {
  videoUrl?: string
  videoId?: string // YouTube video ID
  title?: string
  description?: string
  thumbnailUrl?: string
  provider?: 'youtube' | 'vimeo' | 'hosted'
}

export default function VideoShowcase({
  videoUrl = '',
  videoId = '',
  title = 'HausLash Brand Story',
  description = 'Discover the HausLash experience',
  thumbnailUrl = '/images/video-thumbnail.jpg',
  provider = 'youtube',
}: VideoShowcaseProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getEmbedUrl = () => {
    switch (provider) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`
      case 'vimeo':
        return `https://player.vimeo.com/video/${videoId}?autoplay=1`
      case 'hosted':
        return videoUrl
      default:
        return ''
    }
  }

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Video Container */}
          <div className="relative group cursor-pointer" onClick={() => setIsOpen(true)}>
            {/* Thumbnail */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                <Button
                  size="lg"
                  className="rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all duration-300 group-hover:scale-110"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsOpen(true)
                  }}
                >
                  <Play className="h-6 w-6 mr-2 fill-current" />
                  Watch Now
                </Button>
              </div>

              {/* Decorative border animation */}
              <div className="absolute inset-0 rounded-xl border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
                Our Story
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                {title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-primary/10">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Premium Quality</h4>
                  <p className="text-sm text-muted-foreground">
                    Professional technique and premium products
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Personalized Service</h4>
                  <p className="text-sm text-muted-foreground">
                    Tailored to your unique preferences
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Lasting Results</h4>
                  <p className="text-sm text-muted-foreground">
                    Beautiful lashes for up to 8 weeks
                  </p>
                </div>
              </div>
            </div>

            <Button asChild size="lg" className="rounded-full w-full md:w-auto">
              <a href="/book">Book Your Appointment</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl aspect-video p-0 bg-black border-0">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">{description}</DialogDescription>
          {getEmbedUrl() && (
            <iframe
              width="100%"
              height="100%"
              src={getEmbedUrl()}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
