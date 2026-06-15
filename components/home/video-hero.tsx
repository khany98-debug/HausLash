'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowDown, Pause, Play } from 'lucide-react'

import { BrandMark } from '@/components/brand-mark'
import { cn } from '@/lib/utils'

export function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!video || !reducedMotion.matches) {
      return
    }

    video.pause()
    setIsPlaying(false)
  }, [])

  async function togglePlayback() {
    const video = videoRef.current

    if (!video) {
      return
    }

    if (video.paused) {
      try {
        await video.play()
        setIsPlaying(true)
      } catch {
        setIsPlaying(false)
      }
      return
    }

    video.pause()
    setIsPlaying(false)
  }

  return (
    <section
      aria-label="Welcome to Hauslash"
      className="relative isolate flex items-center overflow-hidden border-b border-foreground/10 sm:min-h-[calc(100svh-68px)] xl:min-h-[calc(100svh-82px)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.85),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent)]"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-5 py-10 sm:px-8 sm:py-16 lg:py-20">
        <p className="eyebrow mb-5 text-center sm:mb-7">Welcome to Hauslash</p>

        <div className="relative w-full max-w-5xl">
          <div className="absolute -inset-5 -z-10 rounded-[2.75rem] bg-white/35 blur-2xl sm:-inset-8" />

          <div className="group relative aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-foreground/15 bg-[#d7c4b8] shadow-[0_36px_100px_-42px_rgba(42,34,28,0.72)] sm:rounded-[2rem]">
            <Image
              src="/images/work/Model2.jpeg"
              alt=""
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1024px"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className={cn(
                'absolute inset-0 bg-background/25 backdrop-blur-[1px] transition-opacity duration-700',
                isReady && !hasError ? 'opacity-0' : 'opacity-100',
              )}
            />

            {!hasError && (
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onCanPlay={() => setIsReady(true)}
                onError={() => {
                  setHasError(true)
                  setIsPlaying(false)
                }}
                className={cn(
                  'absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700',
                  isReady ? 'opacity-100' : 'opacity-0',
                )}
                aria-label="Hauslash eye-opening brand film"
              >
                <source src="/videos/logo-animation.mp4" type="video/mp4" />
              </video>
            )}

            {(!isReady || hasError) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <BrandMark className="text-4xl text-white drop-shadow-lg sm:text-6xl" />
              </div>
            )}

            {isReady && !hasError && (
              <button
                type="button"
                onClick={togglePlayback}
                className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-black/25 text-white opacity-100 shadow-lg backdrop-blur-md transition hover:bg-black/40 focus-visible:opacity-100 sm:bottom-5 sm:right-5 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label={isPlaying ? 'Pause welcome film' : 'Play welcome film'}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 fill-current" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="mt-7 flex flex-col items-center gap-4 text-center sm:mt-10 sm:gap-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-foreground">
            Premium Korean lash studio
          </p>
          <Link
            href="#signature"
            className="group flex items-center gap-2 text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            Discover the Hauslash experience
            <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
