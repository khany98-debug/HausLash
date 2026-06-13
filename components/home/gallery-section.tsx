import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const IMAGES = [
  { src: '/images/work/Model3.jpeg', alt: 'Korean lash lift close-up', className: 'md:col-span-7 md:row-span-2' },
  { src: '/images/work/Model2.jpeg', alt: 'Natural lifted lash result', className: 'md:col-span-5' },
  { src: '/images/work/Model5.JPG', alt: 'Soft lash lift result', className: 'md:col-span-5' },
  { src: '/images/work/Model1.jpg', alt: 'Hauslash client result', className: 'md:col-span-5' },
  { src: '/images/work/Model6.JPG', alt: 'Detailed lash treatment result', className: 'md:col-span-7' },
]

export function GallerySection() {
  return (
    <section id="results" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Real clients · Real results</p>
          <h2 className="mt-4 display-title max-w-2xl">
            Refined from every angle.
          </h2>
        </div>
        <Link href="/book" className="inline-flex items-center gap-2 text-sm font-medium">
          Create your result
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid auto-rows-[260px] gap-4 md:grid-cols-12 md:auto-rows-[280px]">
        {IMAGES.map((image, index) => (
          <div
            key={image.src}
            className={`group relative overflow-hidden rounded-[1.5rem] bg-muted ${image.className}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-70" />
            <span className="absolute bottom-4 left-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
              Result {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
