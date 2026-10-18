"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useFancyPointer } from "@/hooks/use-pointer-fine";

/** Conservative 3D tilt (max 4deg, 1000px perspective). Disabled on touch and for reduced motion. */
export default function Tilt({ children, className, max = 4 }: { children: React.ReactNode; className?: string; max?: number }) {
  const enabled = useFancyPointer();
  const ref = useRef<HTMLDivElement>(null);
  const px = useSpring(useMotionValue(0.5), { stiffness: 180, damping: 20 });
  const py = useSpring(useMotionValue(0.5), { stiffness: 180, damping: 20 });
  const rotateY = useTransform(px, [0, 1], [-max, max]);
  const rotateX = useTransform(py, [0, 1], [max, -max]);

  const onMove = (e: React.PointerEvent) => {
    if (!enabled || e.pointerType !== "mouse") return;
    const r = ref.current!.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        ref={ref}
        style={enabled ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
