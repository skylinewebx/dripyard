import Link from "next/link";
import type { Product } from "@/types";
import { isSoldOut } from "@/lib/products";
import ProductImage from "./ProductImage";
import Price from "@/components/ui/Price";
import WishlistButton from "@/components/ui/WishlistButton";
import ParallaxFrame from "@/components/ui/ParallaxFrame";

/**
 * Editorial product tile: no container, no shadow. The photograph is the object; text sits on the
 * page beneath it. Server-rendered; only the heart and the parallax frame are client islands.
 */
export default function ProductCard({
  product,
  priority = false,
  sizes,
  aspect = "aspect-[4/5]",
  parallax = false,
  index,
  className = "",
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  aspect?: string;
  parallax?: boolean;
  /** Optional editorial numbering (1-based) */
  index?: number;
  className?: string;
}) {
  const soldOut = isSoldOut(product);
  const image = (
    <ProductImage
      product={product}
      priority={priority}
      sizes={sizes ?? "(min-width:1024px) 300px, 50vw"}
      className="transition-transform duration-[1100ms] ease-premium group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
  );

  return (
    <article className={`group relative ${className}`}>
      <div className={`relative overflow-hidden rounded-[6px] bg-[#e6ded2] ${aspect}`}>
        {parallax ? (
          <ParallaxFrame className="absolute inset-0" range={4}>
            {image}
          </ParallaxFrame>
        ) : (
          image
        )}

        {/* Gentle floor shade so labels stay legible on any photograph */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-maroon/35 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 max-md:hidden" />

        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap gap-1.5 sm:left-3 sm:top-3">
          {product.isNew && <span className="bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.14em] text-maroon backdrop-blur-sm">New</span>}
          {product.flashDropDiscount > 0 && (
            <span className="bg-brand px-2 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.14em] text-white">−{product.flashDropDiscount}%</span>
          )}
        </div>

        {soldOut && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-maroon/80 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white">Sold out</span>
        )}

        <span className="pointer-events-none absolute bottom-3 left-3 translate-y-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white opacity-0 transition-all duration-700 ease-premium group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden">
          View pair →
        </span>

        <div className="absolute right-2 top-2 z-[2] sm:right-2.5 sm:top-2.5">
          <WishlistButton productId={product.id} productName={`${product.name} ${product.colorway}`} />
        </div>
      </div>

      <div className="mt-3.5 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="text-[14px] font-semibold leading-snug sm:text-[15px]">
            {index ? <span className="mr-2 font-display text-[13px] font-medium text-brand">{String(index).padStart(2, "0")}</span> : null}
            <Link href={`/product/${product.id}`} className="bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-premium after:absolute after:inset-0 after:z-[1] group-hover:bg-[length:100%_1px]">
              {product.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-[13px] text-maroon/55">{product.colorway}</p>
        </div>
        <Price product={product} size="sm" className="shrink-0 sm:pt-0.5 sm:text-right" />
      </div>
    </article>
  );
}
