'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowDown, Pause, Play } from 'lucide-react'

import { BrandMark } from '@/components/brand-mark'
import { cn } from '@/lib/utils'

export function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

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
      className="relative isolate flex items-start overflow-hidden border-b border-foreground/10 bg-[linear-gradient(180deg,rgba(250,247,242,0.82)_0%,rgba(244,240,233,0.98)_72%,rgba(244,240,233,1)_100%)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.94),transparent_34%),radial-gradient(circle_at_12%_52%,rgba(199,174,148,0.22),transparent_28%),radial-gradient(circle_at_88%_62%,rgba(42,34,28,0.08),transparent_32%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-px bg-foreground/20" />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-5 py-8 sm:px-8 sm:py-10 lg:py-12">
        <div className="mb-5 flex w-full max-w-5xl items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground sm:mb-7">
          <span>Welcome to Hauslash</span>
          <span className="hidden sm:inline">Korean lash studio</span>
        </div>

        <div className="relative w-full max-w-6xl">
          <div className="absolute -inset-4 -z-10 rounded-[2.75rem] bg-white/50 blur-2xl sm:-inset-8" />
          <div className="absolute -inset-px -z-10 rounded-[1.65rem] bg-gradient-to-br from-white/80 via-transparent to-foreground/10 sm:rounded-[2.15rem]" />

          <div className="group relative aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-foreground/15 bg-[#d7c4b8] shadow-[0_46px_120px_-48px_rgba(42,34,28,0.78)] sm:rounded-[2rem]">
            <div className="absolute inset-0 flex items-center justify-center">
              <BrandMark className="text-4xl text-foreground/45 drop-shadow-lg sm:text-6xl" />
            </div>

            {!hasError && (
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onLoadedData={() => setIsReady(true)}
                onCanPlay={() => setIsReady(true)}
                onPlaying={() => {
                  setIsReady(true)
                  setIsPlaying(true)
                }}
                onPause={() => setIsPlaying(false)}
                onError={() => {
                  setHasError(true)
                  setIsPlaying(false)
                }}
                className={cn(
                  'absolute inset-0 z-10 h-full w-full object-cover object-center transition-opacity duration-700',
                  isReady ? 'opacity-100' : 'opacity-0',
                )}
                aria-label="Hauslash eye-opening brand film"
              >
                <source src="/videos/logo-animation.mp4" type="video/mp4" />
              </video>
            )}

            {isReady && !hasError && (
              <button
                type="button"
                onClick={togglePlayback}
                className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-black/25 text-white opacity-100 shadow-lg backdrop-blur-md transition hover:bg-black/40 focus-visible:opacity-100 sm:bottom-5 sm:right-5 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label={isPlaying ? 'Pause welcome film' : 'Play welcome film'}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 fill-current" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                )}
              </button>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden items-end justify-between bg-gradient-to-t from-black/35 via-black/5 to-transparent p-5 text-white sm:flex">
              <div className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] backdrop-blur-md">
                Opening the eye
              </div>
              <div className="text-right text-[10px] font-semibold uppercase tracking-[0.22em] text-white/75">
                Bespoke Korean lift
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col items-center gap-4 text-center sm:mt-9 sm:gap-5">
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
