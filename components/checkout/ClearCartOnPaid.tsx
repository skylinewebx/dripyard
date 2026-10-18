"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";

/** Rendered only after the server has verified the payment, so the bag is never emptied on an unpaid visit. */
export default function ClearCartOnPaid() {
  useEffect(() => {
    // Wait for persisted data to load first, otherwise rehydration would restore the old lines.
    const run = () => useCartStore.getState().clear();
    if (useCartStore.persist.hasHydrated()) run();
    else return useCartStore.persist.onFinishHydration(run);
  }, []);
  return null;
}
