import Link from "next/link";
import type { Product } from "@/types";
import { isSoldOut } from "@/lib/products";
import ProductImage from "./ProductImage";
import Price from "@/components/ui/Price";
import Stars from "@/components/ui/Stars";
import WishlistButton from "@/components/ui/WishlistButton";
import Tilt from "@/components/ui/Tilt";
import { ArrowIcon } from "@/components/ui/icons";

/** Server-rendered card; only the heart and tilt wrapper are client islands. */
export default function ProductCard({ product, priority = false, sizes }: { product: Product; priority?: boolean; sizes?: string }) {
  const soldOut = isSoldOut(product);
  return (
    <Tilt className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-card transition-shadow duration-500 ease-premium hover:shadow-lift">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream">
          <ProductImage
            product={product}
            priority={priority}
            sizes={sizes ?? "(min-width:1280px) 300px, (min-width:768px) 33vw, 50vw"}
            className="transition-transform duration-[900ms] ease-premium group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-maroon backdrop-blur">{product.category}</span>
            {product.isNew && <span className="rounded-full bg-maroon px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">New</span>}
            {product.flashDropDiscount > 0 && (
              <span className="rounded-full bg-brand px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">Flash −{product.flashDropDiscount}%</span>
            )}
          </div>
          {soldOut && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center bg-maroon/55">
              <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-maroon">Sold out</span>
            </div>
          )}
          <span className="pointer-events-none absolute bottom-3 right-3 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-white text-maroon opacity-0 shadow-card transition-all duration-500 ease-premium group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 max-md:hidden">
            <ArrowIcon />
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4 sm:p-5">
          <h3 className="text-[15px] font-semibold leading-snug">
            <Link href={`/product/${product.id}`} className="after:absolute after:inset-0 after:z-[1] focus-visible:after:rounded-[28px]">
              {product.name}
            </Link>
          </h3>
          <p className="text-sm text-maroon/60">{product.colorway}</p>
          <div className="mt-auto flex items-end justify-between gap-3 pt-2">
            <Price product={product} />
            <Stars rating={product.rating} size={12} className="hidden sm:inline-flex" />
          </div>
        </div>

        <div className="absolute right-3 top-3 z-[2]">
          <WishlistButton productId={product.id} productName={`${product.name} ${product.colorway}`} />
        </div>
      </article>
    </Tilt>
  );
}
