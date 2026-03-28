'use client'

import { useState, useEffect } from 'react'
import RotatingGallery from './rotating-gallery'

interface GalleryImage {
  id: string
  src: string
  alt: string
  title?: string
}

export function GallerySection() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
      <div className="mb-12 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Our Work
        </p>
        <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground md:text-4xl text-balance">
          Results that inspire confidence
        </h2>
      </div>
      <RotatingGallery
        images={galleryImages}
        autoPlay={true}
        interval={5000}
        hideNavButtons={true}
        className="aspect-[4/5] w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto"
      />
    </section>
  )
}