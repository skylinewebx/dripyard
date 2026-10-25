"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/types";
import { imageMeta } from "@/lib/products";
import ProductImage from "./ProductImage";

/**
 * Each product has one real photograph. The gallery presents that same photograph as up to three
 * views (full frame plus two close-up crops of the original), so no alternate imagery is invented.
 * A close-up is only offered when the source has enough pixels for it: the zoom is capped so the
 * crop is never magnified beyond the photo's native resolution (no upscaling blur).
 */
const STAGE_PX = 650; // approximate CSS width of the large stage on desktop

const VIEW_DEFS = [
  { id: "full", label: "Full view", origin: "50% 50%" },
  { id: "close", label: "Close-up", origin: "48% 56%" },
  { id: "detail", label: "Detail", origin: "36% 42%" },
] as const;

export default function ProductGallery({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [index, setIndex] = useState(0);
  const views = useMemo(() => {
    const meta = imageMeta(product);
    if (meta?.studio) return [{ ...VIEW_DEFS[0], scale: 1 }]; // studio shots show the whole shoe; no cropped close-ups
    const native = meta?.width ?? 0;
    const zoom = Math.min(1.7, native / STAGE_PX);
    return VIEW_DEFS.map((v, i) => ({ ...v, scale: i === 0 ? 1 : zoom })).filter((v, i) => i === 0 || v.scale >= 1.25);
  }, [product]);
  const view = views[Math.min(index, views.length - 1)];
  const alt = `${product.name} ${product.colorway}`;

  return (
    <div className="flex flex-col gap-3 md:flex-row-reverse md:gap-4">
      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-[6px] bg-[#e6ded2]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={view.id}
            className="absolute inset-0"
            style={{ transformOrigin: view.origin }}
            initial={{ opacity: 0, scale: view.scale === 1 ? 1 : view.scale * 1.03 }}
            animate={{ opacity: 1, scale: view.scale }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductImage product={product} priority={priority} sizes="(min-width:1024px) 650px, 100vw" alt={`${alt}, ${view.label.toLowerCase()}`} />
          </motion.div>
        </AnimatePresence>
      </div>

      {views.length > 1 && (
        <div role="group" aria-label="Product views" className="flex gap-3 md:flex-col">
          {views.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={i === index}
              aria-label={`Show ${v.label.toLowerCase()}`}
              className={`relative h-20 w-16 overflow-hidden rounded-[4px] bg-[#e6ded2] transition-[box-shadow,opacity] duration-300 sm:h-24 sm:w-[76px] ${
                i === index ? "opacity-100 ring-2 ring-brand ring-offset-2 ring-offset-cream" : "opacity-70 hover:opacity-100"
              }`}
            >
              <div className="absolute inset-0" style={{ transform: `scale(${v.scale})`, transformOrigin: v.origin }}>
                <ProductImage product={product} sizes="160px" alt="" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
