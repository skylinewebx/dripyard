"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFancyPointer } from "@/hooks/use-pointer-fine";

/** Subtle magnetic pull toward the cursor. Only active on hover-capable fine pointers. */
export default function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const enabled = useFancyPointer();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (!enabled || e.pointerType !== "mouse") return;
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} className={`inline-block ${className ?? ""}`} style={enabled ? { x, y } : undefined} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.div>
  );
}
