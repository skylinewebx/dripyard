"use client";

import type { Product } from "@/types";

export default function ColorSelector({
  product,
  value,
  onChange,
  isAvailable,
}: {
  product: Product;
  value: string;
  onChange: (color: string) => void;
  isAvailable: (color: string) => boolean;
}) {
  return (
    <div role="radiogroup" aria-label="Colour" className="flex flex-wrap gap-3">
      {product.colors.map((c) => {
        const ok = isAvailable(c.name);
        const selected = value === c.name;
        return (
          <button
            key={c.name}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${c.name}${ok ? "" : ", unavailable in this size"}`}
            disabled={!ok}
            onClick={() => onChange(c.name)}
            className={`flex items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              selected ? "border-maroon bg-white" : "border-maroon/15 bg-white/60 hover:border-maroon/50"
            }`}
          >
            <span className="h-7 w-7 rounded-full ring-1 ring-maroon/15" style={{ backgroundColor: c.hex }} />
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
