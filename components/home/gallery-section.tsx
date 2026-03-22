import Image from 'next/image'

const GALLERY_IMAGES = [
  {
    src: '/images/work/Model1.jpg',
    alt: 'Korean lash lift result - beautifully lifted lashes',
  },
  {
    src: '/images/work/Model2.jpeg',
    alt: 'Professional lash lift result from Hauslash studio',
  },
  {
    src: '/images/work/Model1.jpg',
    alt: 'Natural lash enhancement result',
  },
]

export function GallerySection() {
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
      <div className="grid gap-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3">
        {GALLERY_IMAGES.map((img, idx) => (
          <div
            key={img.src + idx}
            className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-md focus-within:ring-2 focus-within:ring-primary"
            tabIndex={0}
            aria-label={img.alt}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105 focus:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  )
}