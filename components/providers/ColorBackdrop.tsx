"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, transform, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";

const RED = "#b3202a";
const CREAM = "#f6f1ea";
const MAROON = "#1a0505";

/**
 * Scroll-driven colour journey: deep red (hero) -> cream (shopping) -> maroon (footer).
 * One fixed layer behind the page; the colour is a motion value written straight to style
 * (no React re-renders while scrolling). Stops are measured from the real #hero / #site-footer
 * positions, so they stay correct at every viewport size and on pages without a hero.
 */
export default function ColorBackdrop() {
  const { scrollY } = useScroll();
  const bg = useMotionValue(CREAM);
  const stops = useRef<{ input: number[]; output: string[] }>({ input: [0, 1], output: [CREAM, CREAM] });
  const pathname = usePathname();

  const paint = useCallback(
    (y: number) => {
      const { input, output } = stops.current;
      bg.set(transform(y, input, output));
    },
    [bg],
  );

  const measure = useCallback(() => {
    const hero = document.getElementById("hero");
    const footer = document.getElementById("site-footer");
    const vh = window.innerHeight;
    const y = window.scrollY;
    const input: number[] = [];
    const output: string[] = [];

    if (hero) {
      const heroH = hero.offsetHeight;
      input.push(0, heroH * 0.35, heroH * 0.95);
      output.push(RED, RED, CREAM);
    } else {
      input.push(0);
      output.push(CREAM);
    }
    if (footer) {
      const top = footer.getBoundingClientRect().top + y;
      const from = Math.max(top - vh, (input[input.length - 1] ?? 0) + 1);
      const to = Math.max(top - vh * 0.25, from + 1);
      input.push(from, to);
      output.push(CREAM, MAROON);
    } else {
      input.push((input[input.length - 1] ?? 0) + 1);
      output.push(CREAM);
    }
    stops.current = { input, output };
    paint(y);
  }, [paint]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, pathname]);

  useMotionValueEvent(scrollY, "change", paint);

  return <motion.div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ backgroundColor: bg }} />;
}
