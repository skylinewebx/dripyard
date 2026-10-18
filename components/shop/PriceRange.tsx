"use client";

import { priceBounds } from "@/lib/products";

/** Dual-thumb price slider built from two native range inputs (keyboard + touch friendly). */
export default function PriceRange({ min, max, onChange }: { min: number; max: number; onChange: (min: number, max: number) => void }) {
  const { min: lo, max: hi } = priceBounds;
  const span = Math.max(1, hi - lo);
  const left = ((min - lo) / span) * 100;
  const right = 100 - ((max - lo) / span) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold">${min}</span>
        <span className="text-maroon/50">to</span>
        <span className="font-semibold">${max}</span>
      </div>
      <div className="relative mt-4 h-6">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-maroon/12" />
        <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand" style={{ left: `${left}%`, right: `${right}%` }} />
        <input
          type="range"
          className="range"
          min={lo}
          max={hi}
          step={1}
          value={min}
          aria-label="Minimum price"
          onChange={(e) => onChange(Math.min(Number(e.target.value), max), max)}
        />
        <input
          type="range"
          className="range"
          min={lo}
          max={hi}
          step={1}
          value={max}
          aria-label="Maximum price"
          onChange={(e) => onChange(min, Math.max(Number(e.target.value), min))}
        />
      </div>
      <p className="mt-1 text-xs text-maroon/50">
        Catalog range ${lo} to ${hi} (sale prices)
      </p>
    </div>
  );
}
