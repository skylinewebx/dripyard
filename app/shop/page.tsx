import type { Metadata } from "next";
import { Suspense } from "react";
import ShopClient from "@/components/shop/ShopClient";
import ShopSkeleton from "@/components/shop/ShopSkeleton";
import { DEFAULT_FILTERS } from "@/lib/filters";

export const metadata: Metadata = {
  title: "Shop all sneakers",
  description: "Search and filter every Nike sneaker in the DRIPYARD catalog by category, size, colour and price.",
};

export default function ShopPage() {
  return (
    <div className="container-x pb-8 pt-32 sm:pt-40">
      <header className="mb-10 max-w-2xl sm:mb-14">
        <p className="eyebrow">The catalog</p>
        <h1 className="display mt-3 text-[clamp(3rem,8vw,6rem)]">Shop all</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-maroon/70">
          Every pair in the yard. Search, filter and sort. Your selections live in the URL, so you can share any view.
        </p>
      </header>
      {/* useSearchParams needs a Suspense boundary; the skeleton shows only until the client reads the URL. */}
      <Suspense fallback={<ShopSkeleton />}>
        <ShopClient initial={DEFAULT_FILTERS} />
      </Suspense>
    </div>
  );
}
