"use client";

import { motion } from "framer-motion";
import { useWishlistStore } from "@/store/wishlist";
import { useWishlistReady } from "@/hooks/use-store-hydration";
import { HeartIcon } from "./icons";

/** Heart toggle synced across every page through the persisted wishlist store. */
export default function WishlistButton({
  productId,
  productName,
  variant = "floating",
  className = "",
}: {
  productId: string;
  productName: string;
  variant?: "floating" | "inline";
  className?: string;
}) {
  const ready = useWishlistReady();
  const saved = useWishlistStore((s) => s.ids.includes(productId)) && ready;
  const toggle = useWishlistStore((s) => s.toggle);

  const look =
    variant === "floating"
      ? "h-9 w-9 bg-white/75 backdrop-blur-sm hover:bg-white"
      : "h-12 w-12 border border-maroon/15 bg-white hover:border-maroon/40";

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      whileTap={{ scale: 0.88 }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
      className={`inline-flex shrink-0 items-center justify-center rounded-full transition-colors ${look} ${saved ? "text-brand" : "text-maroon"} ${className}`}
    >
      <motion.span key={String(saved)} initial={{ scale: saved ? 0.6 : 1 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 14 }} className="flex">
        <HeartIcon filled={saved} width={20} height={20} />
      </motion.span>
    </motion.button>
  );
}
