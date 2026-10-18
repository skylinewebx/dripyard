"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/** Huge outlined background word that drifts sideways as its section scrolls past (decorative depth layer). */
export default function DriftText({
  children,
  from = "0%",
  to = "-12%",
  className = "",
}: {
  children: React.ReactNode;
  from?: string;
  to?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [from, to]);
  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute inset-x-0 select-none ${className}`}>
      <motion.p style={reduced ? undefined : { x }} className="display whitespace-nowrap text-[clamp(7rem,27vw,27rem)] leading-none text-maroon/[0.035]">
        {children}
      </motion.p>
    </div>
  );
}
