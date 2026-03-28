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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isResettingRef = useRef(false)

  // Fetch images on mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/gallery-images')
        const images = await response.json()
        setGalleryImages(Array.isArray(images) ? images : [])
      } catch (error) {
        console.error('Failed to fetch gallery images:', error)
        setGalleryImages([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [])

  // Detect mobile and mark as mounted on client
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    setMounted(true)
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-scroll for mobile carousel
  useEffect(() => {
    if (!mounted || !isMobile || galleryImages.length === 0) return

    const autoScroll = () => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
    }

    autoScrollIntervalRef.current = setInterval(autoScroll, 5000)

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }
  }, [mounted, isMobile, galleryImages.length])

  // Desktop auto-scroll
  useEffect(() => {
    if (!mounted || isMobile || galleryImages.length === 0) return

    const autoScroll = () => {
      if (isResettingRef.current || !scrollContainerRef.current) return

      const container = scrollContainerRef.current
      const scrollAmount = 400
      const isNearEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 100
      
      if (isNearEnd) {
        isResettingRef.current = true
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0
          }
          isResettingRef.current = false
        }, 600)
      } else {
        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        })
      }
    }

    autoScrollIntervalRef.current = setInterval(autoScroll, 5000)

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }
  }, [mounted, isMobile, galleryImages.length])

  const goToSlide = (index: number) => {
    if (galleryImages.length > 0) {
      setCurrentIndex(index % galleryImages.length)
    }
  }

  const nextSlide = () => {
    if (galleryImages.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
    }
  }

  const prevSlide = () => {
    if (galleryImages.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
    }
  }

  const scrollDesktop = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (isLoading) {
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
        <div className="flex justify-center items-center h-96">
          <p className="text-muted-foreground">Loading images...</p>
        </div>
      </section>
    )
  }

  if (!mounted || galleryImages.length === 0) {
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
        <div className="flex justify-center items-center h-96">
          <p className="text-muted-foreground">No images available</p>
        </div>
      </section>
    )
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

      {/* Mobile Carousel */}
      {isMobile ? (
        <div className="relative w-full">
          {/* Main Image Container */}
          <div className="relative w-full bg-muted rounded-2xl overflow-hidden shadow-2xl mb-6">
            <div className="relative w-full" style={{ aspectRatio: '9 / 12' }}>
              <Image
                key={`mobile-${currentIndex}`}
                src={galleryImages[currentIndex].src}
                alt={galleryImages[currentIndex].alt}
                fill
                className="object-cover transition-opacity duration-500"
                priority
                quality={100}
                sizes="(max-width: 640px) 100vw, 90vw"
              />

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                {currentIndex + 1} / {galleryImages.length}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={prevSlide}
              className="flex-shrink-0 rounded-full w-12 h-12 p-0 border-2"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Pagination Dots */}
            <div className="flex gap-2 justify-center flex-1">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-foreground w-8'
                      : 'bg-muted-foreground/40 w-2.5 hover:bg-muted-foreground/60'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={nextSlide}
              className="flex-shrink-0 rounded-full w-12 h-12 p-0 border-2"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Image Title */}
          {galleryImages[currentIndex]?.title && (
            <div className="text-center">
              <h3 className="font-serif text-lg text-foreground mb-2">
                {galleryImages[currentIndex].title}
              </h3>
            </div>
          )}
        </div>
      ) : (
        /* Desktop Horizontal Scrolling Gallery */
        <div className="relative group">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4 no-scrollbar snap-x snap-mandatory"
            style={{
              scrollBehavior: 'smooth',
              paddingLeft: 'calc(50vw - 192px)',
              paddingRight: 'calc(50vw - 192px)',
            }}
          >
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="flex-shrink-0 w-80 sm:w-96 h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group/image cursor-grab active:cursor-grabbing snap-center"
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

          {/* Desktop Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollDesktop('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-black shadow-lg z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollDesktop('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-black shadow-lg z-10"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      )}
    </section>
  )
}