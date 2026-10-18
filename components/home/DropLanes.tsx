"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/** Two photo lanes that travel at different speeds as the section scrolls (layered depth). Static on reduced motion / small screens. */
export default function DropLanes({ laneA, laneB }: { laneA: React.ReactNode; laneB: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], ["3%", "-7%"]);
  const yB = useTransform(scrollYProgress, [0, 1], ["-4%", "9%"]);
  return (
    <div ref={ref} className="grid grid-cols-2 gap-x-3 sm:gap-x-6">
      <motion.div style={reduced ? undefined : { y: yA }} className="flex flex-col gap-10 sm:gap-16 lg:will-change-transform">
        {laneA}
      </motion.div>
      <motion.div style={reduced ? undefined : { y: yB }} className="mt-14 flex flex-col gap-10 sm:mt-24 sm:gap-16 lg:will-change-transform">
        {laneB}
      </motion.div>
    </div>
  );
}
