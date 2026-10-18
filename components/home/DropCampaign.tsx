import Link from "next/link";
import { DROP_GALLERY_IDS, getProducts } from "@/lib/products";
import ProductImage from "@/components/product/ProductImage";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import { ArrowIcon } from "@/components/ui/icons";

export default function DropCampaign() {
  const items = getProducts(DROP_GALLERY_IDS).slice(0, 4);
  return (
    <section id="drop" aria-labelledby="drop-title" className="py-20 sm:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">New drop</p>
          <h2 id="drop-title" className="display mt-4 text-[clamp(2.8rem,7.5vw,6.5rem)]">
            Your Next Level Kicks Just Dropped
          </h2>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-maroon/70">
            Fresh arrivals across Jordan 1, Air Force 1 and SB Dunk. Limited sizes, first come first served.
          </p>
          <div className="mt-8">
            <Magnetic>
              <Link href="/shop?new=1&sort=newest" className="pill-solid px-8 py-4 text-base">
                Shop The Drop <ArrowIcon width={18} height={18} />
              </Link>
            </Magnetic>
          </div>
        </Reveal>

        <ul className="grid grid-cols-2 gap-3 sm:gap-5">
          {items.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.08} className={i % 2 === 1 ? "mt-10 sm:mt-16" : ""}>
              <Link href={`/product/${p.id}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-white shadow-card sm:rounded-[32px]">
                  <ProductImage product={p} sizes="(min-width:1024px) 280px, 45vw" className="transition-transform duration-[900ms] ease-premium group-hover:scale-[1.05] motion-reduce:transition-none" />
                </div>
                <p className="mt-3 text-sm font-semibold leading-snug">{p.name}</p>
                <p className="text-xs text-maroon/60">{p.colorway}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
