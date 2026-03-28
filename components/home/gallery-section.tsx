'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GalleryImage {
  id: string
  src: string
  alt: string
  title?: string
}

export function GallerySection() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/gallery-images')
        if (response.ok) {
          const images = await response.json()
          setGalleryImages(images)
        }
      } catch (error) {
        console.error('Failed to fetch gallery images:', error)
        setGalleryImages([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [])

  // Auto-scroll effect
  useEffect(() => {
    const autoScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current
        const scrollAmount = 400
        
        // If scrolled to near the end, reset to beginning
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 50) {
          container.scrollLeft = 0
        } else {
          container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth',
          })
        }
      }
    }

    // Auto-scroll every 5 seconds
    autoScrollIntervalRef.current = setInterval(autoScroll, 5000)

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      scroll(diff > 0 ? 'right' : 'left')
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-20">
      <div className="mb-12 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Our Work
        </p>
        <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground md:text-4xl text-balance">
          Results that inspire confidence
        </h2>
      </div>

      {/* Horizontal Scrolling Gallery */}
      <div className="relative group">
        {/* Scroll Container - with snap scroll on mobile */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 md:overflow-hidden md:no-scrollbar"
          style={{
            scrollBehavior: 'smooth',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="flex-shrink-0 w-80 sm:w-96 h-96 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group/image cursor-grab active:cursor-grabbing md:hidden"
              style={{
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always',
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                priority={false}
                quality={95}
              />
            </div>
          ))}
        </div>

        {/* Desktop Static Display */}
        <div className="hidden md:flex gap-4 overflow-hidden">
          {galleryImages.slice(0, 4).map((image) => (
            <div
              key={image.id}
              className="flex-1 h-96 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                priority={false}
                quality={95}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons - Mobile Only */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-black shadow-lg z-10 md:hidden"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-black shadow-lg z-10 md:hidden"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </section>
  )
}