"use client";

import Link from "next/link";
import { useWishlistStore } from "@/store/wishlist";
import { useWishlistReady } from "@/hooks/use-store-hydration";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistView() {
  const ready = useWishlistReady();
  const ids = useWishlistStore((s) => s.ids);

  if (!ready) {
    return (
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4" aria-busy="true" aria-label="Loading wishlist">
        {Array.from({ length: 4 }, (_, i) => (
          <li key={i}>
            <div className="skeleton aspect-[4/5] rounded-[28px]" />
            <div className="skeleton mt-4 h-4 w-3/4 rounded-full" />
          </li>
        ))}
      </ul>
    );
  }

  const items = getProducts(ids);
  if (items.length === 0) {
    return (
      <div className="grid place-items-center rounded-[32px] bg-white/60 px-6 py-20 text-center shadow-card ring-1 ring-maroon/5">
        <p className="display text-3xl sm:text-4xl">Nothing saved yet</p>
        <p className="mt-3 max-w-sm text-sm text-maroon/65">Tap the heart on any sneaker and it will be waiting for you here, even after you close the tab.</p>
        <Link href="/shop" className="pill-solid mt-6">
          Browse sneakers
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-maroon/65" role="status">
        <strong className="text-maroon">{items.length}</strong> saved {items.length === 1 ? "pair" : "pairs"}
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {items.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
