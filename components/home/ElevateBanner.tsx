import Link from "next/link";
import type { CSSProperties } from "react";
import type { Product } from "@/types";
import ProductImage from "@/components/product/ProductImage";
import Price from "@/components/ui/Price";
import { ArrowIcon } from "@/components/ui/icons";

/** Campaign banner: real product photo sandwiched between outlined and solid type with scroll-linked drift (CSS scroll-driven, compositor only). */
export default function ElevateBanner({ product }: { product: Product }) {
  const word = "text-[clamp(4.6rem,21vw,21rem)] leading-[0.8] whitespace-nowrap";

  return (
    <section data-dark aria-labelledby="elevate-title" className="grain relative overflow-hidden bg-brand py-16 text-cream sm:py-24">
      <h2 id="elevate-title" className="sr-only">
        Elevate your rotation
      </h2>

      <p aria-hidden className={`sd-x display outline-text select-none text-center ${word} text-cream/90`} style={{ "--from": "6%", "--to": "-10%" } as CSSProperties}>
        Elevate
      </p>

      <div className="relative z-10 mx-auto -my-[7vw] w-[min(74vw,400px)] sm:-my-[4vw]">
        <div className="sd-y" style={{ "--from": "4%", "--to": "-4%" } as CSSProperties}>
          <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] shadow-[0_30px_60px_-30px_rgba(26,5,5,0.6)]">
            <ProductImage product={product} sizes="(min-width:640px) 400px, 74vw" />
          </div>
        </div>
      </div>

      <p aria-hidden className={`sd-x display relative z-20 select-none text-center text-maroon ${word}`} style={{ "--from": "-8%", "--to": "8%" } as CSSProperties}>
        Elevate
      </p>

      <div className="container-x relative z-30 mt-10 flex flex-col items-center justify-between gap-6 text-center sm:mt-14 sm:flex-row sm:text-left">
        <div>
          <p className="eyebrow !text-cream/70">Campaign</p>
          <p className="display mt-2 text-3xl sm:text-4xl">{product.name}</p>
          <p className="text-cream/80">{product.colorway}</p>
        </div>
        <div className="flex flex-col items-center gap-4 sm:items-end">
          <Price product={product} size="lg" className="[&_span]:!text-cream" />
          <Link href={`/product/${product.id}`} className="pill bg-cream text-maroon shadow-card hover:bg-white">
            Shop this pair <ArrowIcon width={18} height={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
