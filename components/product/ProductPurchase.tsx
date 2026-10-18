"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { isSoldOut, sizeStock } from "@/lib/products";
import { MAX_PER_LINE } from "@/lib/pricing";
import { useCartStore } from "@/store/cart";
import { useUiStore } from "@/store/ui";
import SizeSelector from "./SizeSelector";
import ColorSelector from "./ColorSelector";
import QuantityStepper from "./QuantityStepper";
import WishlistButton from "@/components/ui/WishlistButton";
import Magnetic from "@/components/ui/Magnetic";
import { BagIcon, CheckIcon } from "@/components/ui/icons";

/** Selection state -> cart. Selected size, colour and quantity are exactly what gets added. */
export default function ProductPurchase({ product }: { product: Product }) {
  const [size, setSize] = useState<number | null>(null);
  const [color, setColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [hint, setHint] = useState(false);
  const add = useCartStore((s) => s.add);
  const setCartOpen = useUiStore((s) => s.setCartOpen);

  const soldOut = isSoldOut(product);
  const stock = size ? sizeStock(product, size) : 0;
  const max = Math.max(1, Math.min(MAX_PER_LINE, stock));
  const ready = size !== null && !soldOut;

  const pickSize = (s: number) => {
    setSize(s);
    setHint(false);
    setQuantity((q) => Math.min(q, Math.max(1, Math.min(MAX_PER_LINE, sizeStock(product, s)))));
  };

  const submit = () => {
    if (!ready || size === null) {
      setHint(true);
      return;
    }
    add({ productId: product.id, size, color, quantity });
    setAdded(true);
    setCartOpen(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold">Colour</h3>
          <span className="text-sm text-maroon/60">{color}</span>
        </div>
        <ColorSelector product={product} value={color} onChange={setColor} isAvailable={() => !soldOut && (size === null || stock > 0)} />
      </div>

      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold">Size (US)</h3>
          <span className={`text-sm ${hint ? "font-medium text-brand" : "text-maroon/60"}`} role="status">
            {hint ? "Please select a size" : size ? (stock <= 3 ? `Only ${stock} left` : `US ${size} selected`) : "Select one"}
          </span>
        </div>
        <SizeSelector product={product} value={size} onChange={pickSize} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={quantity} max={max} onChange={setQuantity} label={product.name} />
        <Magnetic className="min-w-0 flex-1">
          <motion.button
            type="button"
            onClick={submit}
            disabled={soldOut}
            whileTap={{ scale: 0.97 }}
            className="pill-solid h-12 w-full gap-2.5 text-base disabled:cursor-not-allowed disabled:bg-maroon/25 disabled:shadow-none"
          >
            {soldOut ? (
              "Sold out"
            ) : added ? (
              <>
                <CheckIcon width={18} height={18} /> Added to bag
              </>
            ) : (
              <>
                <BagIcon width={18} height={18} /> My Drip Bag
              </>
            )}
          </motion.button>
        </Magnetic>
        <WishlistButton productId={product.id} productName={`${product.name} ${product.colorway}`} variant="inline" />
      </div>
    </div>
  );
}
