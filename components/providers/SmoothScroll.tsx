"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { cancelFrame, frame, useReducedMotion } from "framer-motion";
import { setLenis } from "@/lib/scroll";

/**
 * One smooth-scroll system. Lenis is driven by Framer Motion's frame loop (no second rAF loop),
 * so useScroll / useTransform and Lenis always read the same scroll position in the same frame.
 * Touch scrolling stays native (syncTouch is off) and it is disabled for reduced-motion users.
 */
export default function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
    setLenis(lenis);

    const update = ({ timestamp }: { timestamp: number }) => lenis.raf(timestamp);
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return null;
}
