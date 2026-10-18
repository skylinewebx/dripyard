"use client";

import { useMemo } from "react";
import { priceLines, useCartStore } from "@/store/cart";
import { useCartReady } from "@/hooks/use-store-hydration";
import { amountToFreeShipping, shippingCents } from "@/lib/pricing";

/** Priced view of the cart. Reports an empty cart until persisted data has loaded (no wrong counts on first paint). */
export function useCartSummary() {
  const ready = useCartReady();
  const lines = useCartStore((s) => s.lines);
  return useMemo(() => {
    const { priced, subtotalCents, count } = priceLines(ready ? lines : []);
    return {
      ready,
      lines: priced,
      count,
      subtotalCents,
      shippingCents: shippingCents(subtotalCents),
      remainingForFreeCents: amountToFreeShipping(subtotalCents),
    };
  }, [ready, lines]);
}
