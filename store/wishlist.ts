"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct } from "@/lib/products";
import { jsonStorage } from "./storage";

interface WishlistState {
  ids: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [id, ...s.ids] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
    }),
    {
      name: "dripyard-wishlist-v1",
      version: 1,
      storage: jsonStorage<{ ids: string[] }>(),
      partialize: (s) => ({ ids: s.ids }),
      skipHydration: true,
      merge: (persisted, current) => {
        const saved = (persisted as { ids?: string[] } | undefined)?.ids ?? [];
        return { ...current, ids: saved.filter((id) => typeof id === "string" && getProduct(id)) };
      },
    },
  ),
);
