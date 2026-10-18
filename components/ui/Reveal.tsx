"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { observeReveal } from "@/lib/reveal-observer";

/** Scroll-triggered entrance (opacity + transform only, plays once, CSS-driven). Reduced motion shows content immediately. */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => (ref.current ? observeReveal(ref.current) : undefined), []);
  const Comp = as as "div";
  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${className}`}
      style={{ "--reveal-y": `${y}px`, "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </Comp>
  );
}
