import Link from "next/link";
import { SPOTLIGHT_ID, getProduct } from "@/lib/products";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import Price from "@/components/ui/Price";
import Stars from "@/components/ui/Stars";
import Reveal from "@/components/ui/Reveal";
import SplitReveal from "@/components/ui/SplitReveal";
import DriftText from "@/components/ui/DriftText";
import { ArrowIcon } from "@/components/ui/icons";

/** Spotlight sits directly on the page: a drifting oversized word behind, hairlines instead of boxes. */
export default function SpotlightSection() {
  const p = getProduct(SPOTLIGHT_ID)!;
  return (
    <section id="spotlight" aria-labelledby="spotlight-title" className="relative overflow-hidden pb-24 pt-4 sm:pb-36">
      <DriftText className="top-[6%]" from="4%" to="-14%">
        Spotlight
      </DriftText>

      <div className="container-x relative">
        <Reveal className="mb-8 flex items-center gap-4 sm:mb-12">
          <span className="eyebrow">Product spotlight</span>
          <span aria-hidden className="h-px flex-1 bg-maroon/15" />
        </Reveal>

        <div className="grid items-start gap-10 lg:grid-cols-[1.08fr_1fr] lg:gap-20">
          <Reveal>
            <ProductGallery product={p} />
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-7 lg:sticky lg:top-28 lg:pt-6">
            <div>
              <SplitReveal id="spotlight-title" className="display text-[clamp(2.6rem,5.5vw,4.5rem)]" text={p.name} />
              <p className="mt-1 text-lg text-maroon/60">{p.colorway}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Price product={p} size="lg" />
              <div className="flex items-center gap-2 text-sm text-maroon/60">
                <Stars rating={p.rating} />
                <span>
                  {p.rating.toFixed(1)} · {p.reviewCount} sample reviews
                </span>
              </div>
            </div>
            <p className="max-w-[52ch] text-[15px] leading-relaxed text-maroon/75">{p.description}</p>
            <div className="h-px bg-maroon/12" />
            <ProductPurchase product={p} />
            <Link href={`/product/${p.id}`} className="group inline-flex w-fit items-center gap-2 border-b border-maroon/30 pb-1 text-sm font-medium transition-colors hover:border-brand hover:text-brand">
              View full details <ArrowIcon width={16} height={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
