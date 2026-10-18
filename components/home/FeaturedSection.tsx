import Link from "next/link";
import { FEATURED_IDS, getProducts } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import Reveal from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";

/**
 * Asymmetric editorial composition instead of a uniform grid: one large lead pair, staggered
 * companions at different scales, and a text block that sits in the negative space.
 */
export default function FeaturedSection() {
  const [a, b, c, d] = getProducts(FEATURED_IDS).slice(0, 4);
  return (
    <section id="featured" aria-labelledby="featured-title" className="relative scroll-mt-4 overflow-hidden py-20 sm:py-32">
      {/* Oversized background word: depth layer behind the product photography */}
      <p aria-hidden className="display pointer-events-none absolute -left-[2vw] top-8 select-none whitespace-nowrap text-[clamp(7rem,26vw,26rem)] leading-none text-maroon/[0.035]">
        Featured
      </p>

      <div className="container-x relative">
        <Reveal className="flex items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow">Featured sneakers</p>
            <h2 id="featured-title" className="display mt-3 text-[clamp(2.6rem,6.5vw,5rem)]">
              Pairs worth
              <br />
              the hype
            </h2>
          </div>
          <Link href="/shop" className="group hidden shrink-0 items-center gap-2 border-b border-maroon/30 pb-1 text-sm font-medium transition-colors hover:border-brand hover:text-brand sm:inline-flex">
            See all
            <ArrowIcon width={16} height={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:mt-20 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
          <Reveal className="col-span-2 lg:col-span-5">
            <ProductCard product={a} index={1} priority parallax aspect="aspect-[4/5]" sizes="(min-width:1024px) 520px, 100vw" />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-3 lg:mt-36">
            <ProductCard product={b} index={2} parallax aspect="aspect-[3/4]" sizes="(min-width:1024px) 320px, 50vw" />
          </Reveal>
          <Reveal delay={0.16} className="mt-12 lg:col-span-4 lg:mt-12">
            <ProductCard product={c} index={3} parallax aspect="aspect-[4/5]" sizes="(min-width:1024px) 420px, 50vw" />
          </Reveal>

          <div className="col-span-2 flex flex-col justify-center gap-6 lg:col-span-4 lg:col-start-6 lg:row-start-2 lg:-mt-16 lg:pl-6">
            <Reveal>
              <p className="max-w-[34ch] text-[15px] leading-relaxed text-maroon/70">
                Four standouts from the yard: Jordan 1 heat and an Air Force 1 classic, in clean colourways that go with everything.
              </p>
              <Link href="/shop" className="group mt-5 inline-flex items-center gap-2 border-b border-maroon/30 pb-1 text-sm font-medium transition-colors hover:border-brand hover:text-brand">
                See all sneakers
                <ArrowIcon width={16} height={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="col-span-2 sm:col-span-1 lg:col-span-3 lg:col-start-10 lg:row-start-2 lg:mt-24">
            <ProductCard product={d} index={4} parallax aspect="aspect-[3/4]" sizes="(min-width:1024px) 320px, 70vw" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
