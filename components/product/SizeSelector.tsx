"use client";

import { useRef } from "react";
import type { Product } from "@/types";
import { sizeStock } from "@/lib/products";

/** Accessible radiogroup with roving tabindex and arrow-key navigation. Sold-out sizes are disabled. */
export default function SizeSelector({ product, value, onChange }: { product: Product; value: number | null; onChange: (size: number) => void }) {
  const refs = useRef<Record<number, HTMLButtonElement | null>>({});
  const enabled = product.sizes.filter((s) => sizeStock(product, s) > 0);
  const tabbable = value ?? enabled[0];

  const move = (from: number, dir: 1 | -1) => {
    const i = enabled.indexOf(from);
    const next = enabled[(i + dir + enabled.length) % enabled.length];
    if (next !== undefined) {
      onChange(next);
      refs.current[next]?.focus();
    }
  };

  return (
    <div role="radiogroup" aria-label="US size" className="grid grid-cols-4 gap-2 sm:grid-cols-8">
      {product.sizes.map((size) => {
        const stock = sizeStock(product, size);
        const out = stock === 0;
        const selected = value === size;
        return (
          <button
            key={size}
            ref={(el) => {
              refs.current[size] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`US ${size}${out ? ", sold out" : stock <= 2 ? `, only ${stock} left` : ""}`}
            disabled={out}
            tabIndex={size === tabbable ? 0 : -1}
            onClick={() => onChange(size)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                move(size, 1);
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                move(size, -1);
              }
            }}
            className={`relative h-12 rounded-full border text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-95 ${
              selected
                ? "border-brand bg-brand text-white shadow-card"
                : out
                  ? "cursor-not-allowed border-maroon/10 text-maroon/30 line-through"
                  : "border-maroon/15 bg-white hover:border-maroon"
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
