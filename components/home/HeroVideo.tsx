"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { asset } from "@/lib/assets";

const DESKTOP = "/videos/hero-loop.mp4"; // 1440x814, 12 s seamless loop
const PHONE = "/videos/hero-loop-phone.mp4"; // 720x1280, 12 s seamless loop

/**
 * Looping hero video (muted, inline, autoplay). It sits on top of the hero photograph, which stays as the
 * poster/fallback: the photo shows until the first frame is ready, and remains if the video can't play.
 * The motion is slow and subtle, so it autoplays for everyone; visitors who prefer reduced motion also get a
 * Pause button. Playback pauses while the hero is off-screen or the tab is hidden.
 */
export default function HeroVideo() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false); // the visitor chose to stop the video
  const allowed = !paused;

  useEffect(() => {
    if (!allowed) {
      setSrc(null);
      setPlaying(false);
      return;
    }
    const mq = window.matchMedia("(min-width:1024px)");
    const pick = () => setSrc(asset(mq.matches ? DESKTOP : PHONE));
    pick();
    mq.addEventListener("change", pick);
    return () => mq.removeEventListener("change", pick);
  }, [allowed]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    v.muted = true;
    let visible = true;
    const sync = () => {
      if (visible && !document.hidden) v.play().catch(() => {});
      else v.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(v);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [src]);

  const toggle = reduced ? (
    <button
      type="button"
      onClick={() => setPaused((m) => !m)}
      aria-pressed={paused}
      className="pointer-events-auto absolute bottom-[3%] left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/55 px-4 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-black/75"
    >
      {paused ? "Play background video" : "Pause background video"}
    </button>
  ) : null;

  if (!src) return toggle;
  return (
    <>
      <video
        key={src}
        ref={ref}
        src={src}
        aria-hidden
        tabIndex={-1}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        onPlaying={() => setPlaying(true)}
        onError={() => setSrc(null)}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
      />
      {toggle}
    </>
  );
}
