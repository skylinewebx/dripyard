import Link from "next/link";
import { SPOTLIGHT_ID, getProduct } from "@/lib/products";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import Price from "@/components/ui/Price";
import Stars from "@/components/ui/Stars";
import Reveal from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";

export default function SpotlightSection() {
  const p = getProduct(SPOTLIGHT_ID)!;
  return (
    <section id="spotlight" aria-labelledby="spotlight-title" className="pb-20 sm:pb-28">
      <div className="container-x">
        <div className="rounded-[36px] bg-white/55 p-4 shadow-card ring-1 ring-maroon/5 sm:rounded-[48px] sm:p-8 lg:p-12">
          <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <Reveal>
              <ProductGallery product={p} />
            </Reveal>

            <Reveal delay={0.1} className="flex flex-col gap-6 lg:py-4">
              <div>
                <p className="eyebrow">Product spotlight</p>
                <h2 id="spotlight-title" className="display mt-3 text-[clamp(2.3rem,5vw,4rem)]">
                  {p.name}
                </h2>
                <p className="mt-1 text-lg text-maroon/65">{p.colorway}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <Price product={p} size="lg" />
                <div className="flex items-center gap-2 text-sm text-maroon/65">
                  <Stars rating={p.rating} />
                  <span>
                    {p.rating.toFixed(1)} · {p.reviewCount} sample reviews
                  </span>
                </div>
              </div>
              <p className="max-w-[52ch] text-[15px] leading-relaxed text-maroon/75">{p.description}</p>
              <div className="h-px bg-maroon/10" />
              <ProductPurchase product={p} />
              <Link href={`/product/${p.id}`} className="group inline-flex w-fit items-center gap-2 text-sm font-medium underline-offset-4 hover:underline">
                View full details <ArrowIcon width={16} height={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
