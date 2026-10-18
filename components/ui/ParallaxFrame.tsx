import type { CSSProperties } from "react";

/**
 * Clipped frame whose contents drift slowly against the scroll (layered depth). The drift is a pure
 * translate inside a slightly taller layer, so the photo is never scaled up (no zoom, no resampling
 * blur). CSS scroll-driven animation: runs on the compositor, no JavaScript, static where
 * unsupported or for reduced-motion users.
 */
export default function ParallaxFrame({
  children,
  className = "",
  range = 3,
}: {
  children: React.ReactNode;
  className?: string;
  /** Overscan / max drift, in percent of the frame height */
  range?: number;
}) {
  // The layer is (100 + 2*range)% tall; translating by +/- range/(1+2*range/100) % of itself stays inside the overscan.
  const drift = range / (1 + (2 * range) / 100);
  return (
    <div className={`overflow-hidden ${className || "relative"}`}>
      <div
        className="sd-y absolute inset-x-0"
        style={{ top: `-${range}%`, bottom: `-${range}%`, "--from": `-${drift}%`, "--to": `${drift}%` } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
