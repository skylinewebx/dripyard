"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Clipped frame whose contents drift slowly against the scroll (layered depth). Transform-only; static for reduced-motion users.
 */
export default function ParallaxFrame({
  children,
  className = "",
  range = 6,
}: {
  children: React.ReactNode;
  className?: string;
  /** Max drift in percent of the frame height */
  range?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-range}%`, `${range}%`]);

  return (
    <div ref={ref} className={`overflow-hidden ${className || "relative"}`}>
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { y, scale: 1 + (range * 2.4) / 100 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
