"use client";

import { MinusIcon, PlusIcon } from "@/components/ui/icons";

export default function QuantityStepper({
  value,
  max,
  onChange,
  compact = false,
  label,
}: {
  value: number;
  max: number;
  onChange: (next: number) => void;
  compact?: boolean;
  label: string;
}) {
  const btn =
    "grid place-items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-35 " +
    (compact ? "h-8 w-8 hover:bg-maroon/8" : "h-10 w-10 hover:bg-maroon/8");
  return (
    <div role="group" aria-label={`Quantity for ${label}`} className={`inline-flex items-center rounded-full border border-maroon/15 bg-white ${compact ? "p-0.5" : "p-1"}`}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <MinusIcon width={14} height={14} />
      </button>
      <output aria-live="polite" className={`text-center font-semibold tabular-nums ${compact ? "w-7 text-sm" : "w-10"}`}>
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <PlusIcon width={14} height={14} />
      </button>
    </div>
  );
}
