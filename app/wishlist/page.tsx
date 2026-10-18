import type { Metadata } from "next";
import WishlistView from "@/components/shop/WishlistView";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <div className="container-x pb-8 pt-32 sm:pt-40">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow">Saved for later</p>
        <h1 className="display mt-3 text-[clamp(3rem,8vw,6rem)]">Wishlist</h1>
      </header>
      <WishlistView />
    </div>
  );
}
