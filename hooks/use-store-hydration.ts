"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

/** Rehydrates persisted stores once on the client, after the first paint matches SSR. */
export function useStoreRehydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useWishlistStore.persist.rehydrate();
  }, []);
}

/** True once a persisted store has loaded from localStorage (avoids wrong counts on first paint). */
function usePersistReady(store: { persist: { hasHydrated: () => boolean; onFinishHydration: (fn: () => void) => () => void } }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (store.persist.hasHydrated()) setReady(true);
    return store.persist.onFinishHydration(() => setReady(true));
  }, [store]);
  return ready;
}

export const useCartReady = () => usePersistReady(useCartStore);
export const useWishlistReady = () => usePersistReady(useWishlistStore);
