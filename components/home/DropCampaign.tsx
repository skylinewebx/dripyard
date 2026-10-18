import Link from "next/link";
import { DROP_GALLERY_IDS, getProducts } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import DriftText from "@/components/ui/DriftText";
import DropLanes from "./DropLanes";
import { ArrowIcon } from "@/components/ui/icons";

export default function DropCampaign() {
  const [a, b, c, d] = getProducts(DROP_GALLERY_IDS).slice(0, 4);
  return (
    <section id="drop" aria-labelledby="drop-title" className="relative overflow-hidden py-20 sm:py-32">
      <DriftText className="top-[4%]" from="-6%" to="8%">
        Just dropped
      </DriftText>
      <div className="container-x relative grid items-start gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
        <Reveal className="lg:sticky lg:top-32 lg:pt-10">
          <p className="eyebrow">New drop</p>
          <h2 id="drop-title" className="display mt-4 text-[clamp(2.9rem,7.5vw,6.5rem)]">
            Your Next Level Kicks Just Dropped
          </h2>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-maroon/70">Fresh arrivals across Jordan 1, Air Force 1 and SB Dunk. Limited sizes, first come first served.</p>
          <div className="mt-9">
            <Magnetic>
              <Link href="/shop?new=1&sort=newest" className="pill-solid px-8 py-4 text-base">
                Shop The Drop <ArrowIcon width={18} height={18} />
              </Link>
            </Magnetic>
          </div>
        </Reveal>

        <DropLanes
          laneA={
            <>
              <Reveal>
                <ProductCard product={a} aspect="aspect-[4/5]" sizes="(min-width:1024px) 300px, 45vw" />
              </Reveal>
              <Reveal>
                <ProductCard product={c} aspect="aspect-[3/4]" sizes="(min-width:1024px) 300px, 45vw" />
              </Reveal>
            </>
          }
          laneB={
            <>
              <Reveal delay={0.08}>
                <ProductCard product={b} aspect="aspect-[3/4]" sizes="(min-width:1024px) 300px, 45vw" />
              </Reveal>
              <Reveal delay={0.08}>
                <ProductCard product={d} aspect="aspect-[4/5]" sizes="(min-width:1024px) 300px, 45vw" />
              </Reveal>
            </>
          }
        />
      </div>
    </section>
  );
}
