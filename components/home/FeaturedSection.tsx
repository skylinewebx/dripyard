import Link from "next/link";
import { FEATURED_IDS, getProducts } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import Reveal from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";

export default function FeaturedSection() {
  const featured = getProducts(FEATURED_IDS).slice(0, 4);
  return (
    <section id="featured" aria-labelledby="featured-title" className="scroll-mt-4 py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="flex items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow">Featured sneakers</p>
            <h2 id="featured-title" className="display mt-3 text-[clamp(2.4rem,6vw,4.5rem)]">
              Pairs worth the hype
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-maroon/70">
              Four standouts from the yard: Jordan 1 heat and an Air Force 1 classic, in clean colourways that go with everything.
            </p>
          </div>
          <Link href="/shop" className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-maroon/20 bg-white/60 px-4 py-2.5 text-sm font-medium transition-colors hover:border-maroon hover:bg-white">
            See all
            <ArrowIcon width={16} height={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.08} y={36}>
              <ProductCard product={p} sizes="(min-width:1024px) 300px, 50vw" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
