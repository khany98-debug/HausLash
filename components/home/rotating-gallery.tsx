'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GalleryImage {
  id: string
  src: string
  alt: string
  title?: string
}

export default function RotatingGallery({
  images,
  autoPlay = true,
  interval = 5000,
  className = '',
  hideNavButtons = false,
}: {
  images: GalleryImage[]
  autoPlay?: boolean
  interval?: number
  className?: string
  hideNavButtons?: boolean
}) {
  const [current, setCurrent] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const goToPrevious = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    handleSwipe()
  }

  const handleSwipe = () => {
    const swipeThreshold = 50 // minimum distance for a swipe
    const diff = touchStartX.current - touchEndX.current

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - go to next image
        goToNext()
      } else {
        // Swiped right - go to previous image
        goToPrevious()
      }
    }
  }

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || images.length === 0) return

    const timer = setInterval(goToNext, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, goToNext, images.length])

  if (images.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-muted rounded-lg ${className}`}
      >
        <p className="text-muted-foreground">No images available</p>
      </div>
    )
  }

  const currentImage = images[current]

  return (
    <div
      className={`relative group overflow-hidden rounded-lg ${className} cursor-grab active:cursor-grabbing`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Image */}
      <div className="relative w-full h-full bg-muted">
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          className="object-cover transition-opacity duration-500"
          onLoadingComplete={() => setIsLoading(false)}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 90vw"
        />

        {/* Overlay with title */}
        {currentImage.title && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 w-full">
              <h3 className="text-white font-serif text-xl md:text-2xl">
                {currentImage.title}
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrevious}
        className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 ${hideNavButtons ? 'hidden' : ''}`}
        aria-label="Previous image"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 ${hideNavButtons ? 'hidden' : ''}`}
        aria-label="Next image"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === current
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Image counter */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
        {current + 1} / {images.length}
      </div>
    </div>
  )
}
