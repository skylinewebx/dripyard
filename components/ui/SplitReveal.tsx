"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { observeReveal } from "@/lib/reveal-observer";

/**
 * Heading whose words rise out of a mask one after another when it scrolls into view (CSS-driven,
 * transform only). `text` may contain "\n" for line breaks. The full text stays available to assistive tech.
 */
export default function SplitReveal({
  text,
  as = "h2",
  id,
  className = "",
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => (ref.current ? observeReveal(ref.current) : undefined), []);
  const Tag = as as "h2";
  let n = 0;
  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      id={id}
      className={`split ${className}`}
      aria-label={text.replace(/\n/g, " ")}
      style={{ "--split-delay": `${delay}s` } as CSSProperties}
    >
      {text.split("\n").map((line, li) => (
        <span key={li} aria-hidden className="block">
          {line.split(" ").map((word) => {
            const i = n++;
            return (
              <span key={`${li}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span className="split-word inline-block" style={{ "--i": i } as CSSProperties}>
                  {word}&nbsp;
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
