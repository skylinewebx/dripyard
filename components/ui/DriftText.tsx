import type { CSSProperties } from "react";

/** Huge outlined background word that drifts sideways as its section scrolls past. Pure CSS scroll-driven animation (compositor, no JS). */
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
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 select-none ${className}`}>
      <p
        className="sd-x display whitespace-nowrap text-[clamp(7rem,27vw,27rem)] leading-none text-maroon/[0.035]"
        style={{ "--from": from, "--to": to } as CSSProperties}
      >
        {children}
      </p>
    </div>
  );
}
