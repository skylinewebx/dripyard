"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types";
import { getProduct, sizeStock, variantKey } from "@/lib/products";
import { MAX_PER_LINE, unitPriceCents } from "@/lib/pricing";
import { jsonStorage } from "./storage";

interface CartState {
  lines: CartLine[];
  add: (line: { productId: string; size: number; color: string; quantity: number }) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

/** Stores only variant identity + quantity; prices always come from the catalog. */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: ({ productId, size, color, quantity }) =>
        set((state) => {
          const product = getProduct(productId);
          if (!product) return state;
          const cap = Math.min(MAX_PER_LINE, sizeStock(product, size));
          if (cap <= 0) return state;
          const key = variantKey(productId, size, color);
          const existing = state.lines.find((l) => l.key === key);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.key === key ? { ...l, quantity: Math.min(cap, l.quantity + quantity) } : l,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              { key, productId, size, color, quantity: Math.min(cap, Math.max(1, quantity)) },
            ],
          };
        }),
      setQuantity: (key, quantity) =>
        set((state) => ({
          lines: state.lines.flatMap((l) => {
            if (l.key !== key) return [l];
            const product = getProduct(l.productId);
            const cap = product ? Math.min(MAX_PER_LINE, sizeStock(product, l.size)) : 0;
            if (quantity <= 0 || cap <= 0) return [];
            return [{ ...l, quantity: Math.min(cap, quantity) }];
          }),
        })),
      remove: (key) => set((state) => ({ lines: state.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "dripyard-cart-v1",
      version: 1,
      storage: jsonStorage<{ lines: CartLine[] }>(),
      partialize: (s) => ({ lines: s.lines }),
      // Hydrated manually after mount so SSR and first client render match.
      skipHydration: true,
      // Drop anything that no longer exists in the catalog.
      merge: (persisted, current) => {
        const saved = (persisted as { lines?: CartLine[] } | undefined)?.lines ?? [];
        const valid = saved.filter(
          (l) =>
            getProduct(l.productId) &&
            Number.isInteger(l.quantity) &&
            l.quantity > 0 &&
            l.key === variantKey(l.productId, l.size, l.color),
        );
        return { ...current, lines: valid };
      },
    },
  ),
);

export interface PricedLine extends CartLine {
  unitCents: number;
  lineCents: number;
}

export function priceLines(lines: CartLine[]): { priced: PricedLine[]; subtotalCents: number; count: number } {
  let subtotalCents = 0;
  let count = 0;
  const priced: PricedLine[] = [];
  for (const l of lines) {
    const p = getProduct(l.productId);
    if (!p) continue;
    const unitCents = unitPriceCents(p);
    const lineCents = unitCents * l.quantity;
    subtotalCents += lineCents;
    count += l.quantity;
    priced.push({ ...l, unitCents, lineCents });
  }
  return { priced, subtotalCents, count };
}
