'use client'


import { useState, useEffect } from 'react'

interface VideoHeroProps {
  videoBasePath: string // e.g. '/videos/logo-animation'
  alt: string
  className?: string
  fallbackImage?: string
}

export function VideoHero({
  videoBasePath,
  alt,
  className = '',
}: VideoHeroProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)

  useEffect(() => {
    // Try .mp4 first, then .mov
    const checkVideo = async () => {
      const mp4 = videoBasePath + '.mp4'
      const mov = videoBasePath + '.mov'
      try {
        let response = await fetch(mp4, { method: 'HEAD' })
        if (response.ok) {
          setVideoSrc(mp4)
          return
        }
        response = await fetch(mov, { method: 'HEAD' })
        if (response.ok) {
          setVideoSrc(mov)
          return
        }
        setVideoSrc(null)
      } catch {
        setVideoSrc(null)
      }
    }
    checkVideo()
  }, [videoBasePath])

  return (
    <div className={`relative flex-1 overflow-hidden rounded-2xl bg-black ${className}`}>
      {videoSrc ? (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            aria-label={alt}
          >
            <source src={videoSrc} type={videoSrc.endsWith('.mp4') ? 'video/mp4' : 'video/quicktime'} />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </>
      ) : null}
    </div>
  )
}
