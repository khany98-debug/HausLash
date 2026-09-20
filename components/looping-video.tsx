"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function LoopingVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      video.muted = true;
      void video.play().catch(() => {
        // Autoplay can be deferred by the browser until it is ready.
      });
    };

    play();
    video.addEventListener("canplay", play);
    video.addEventListener("pause", play);
    return () => {
      video.removeEventListener("canplay", play);
      video.removeEventListener("pause", play);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      disablePictureInPicture
      controlsList="nodownload nofullscreen noplaybackrate"
      className={cn("h-full w-full object-cover", className)}
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
