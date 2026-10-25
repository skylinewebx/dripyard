"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { asset } from "@/lib/assets";
import HeroVideo from "./HeroVideo";
import { ArrowIcon } from "@/components/ui/icons";

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};
const mask: Variants = {
  hidden: { y: "108%" },
  show: { y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

const POINTS = ["Comfort", "Flexible", "Faster", "Trendy"];
const ALT = "A model in a black oversized hoodie leaping through red studio smoke in red-and-white Air Jordan 1 Low sneakers";

/**
 * Campaign hero. Two purpose-made compositions (clean plates: the supplied artwork with its baked-in lettering
 * removed, so every word below is live HTML):
 *  - phones: portrait 1125x2000 (stage aspect 1125/2000)
 *  - laptops and up: 2000x1130 (stage aspect 2000/1130)
 * Each stage is exactly its picture's aspect ratio, so nothing is stretched or re-cropped, and all copy is
 * positioned in percentages of the stage (sizes in cqw so it scales with the picture). The looping video
 * (HeroVideo) renders the same plate with camera, light, smoke and ember motion on top of it.
 */
export default function Hero({ hasImage }: { hasImage: boolean }) {
  return (
    <section id="hero" aria-label="Heepzy introduction" className="relative bg-white p-1.5 sm:p-2.5">
      <div
        data-dark
        className="relative isolate overflow-hidden rounded-[10px] text-white sm:rounded-[14px]"
        style={{ background: "radial-gradient(120% 90% at 78% 12%, #4a1015 0%, #1c0609 50%, #0b0306 100%)" }}
      >
        <div className="flex min-h-[calc(100svh-0.75rem)] items-end lg:block lg:min-h-0">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative mx-auto aspect-[1125/2000] w-full [container-type:inline-size] lg:aspect-[2000/1130] lg:w-[min(100%,calc((100svh-1.25rem)*2000/1130))]"
          >
            {/* Plate = poster and fallback; the looping video fades in on top of it once it plays. */}
            <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_6%)] lg:[mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
              {hasImage ? (
                <picture>
                  <source media="(min-width:1024px)" srcSet={asset("/images/hero-desktop.webp")} />
                  <source media="(max-width:1023px)" srcSet={`${asset("/images/hero-phone-750.webp")} 750w, ${asset("/images/hero-phone.webp")} 1125w`} sizes="100vw" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset("/images/hero-phone.webp")}
                    alt={ALT}
                    width={1125}
                    height={2000}
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </picture>
              ) : null}
              {hasImage ? <HeroVideo /> : null}
            </div>

            {/* Soft scrims: keep the small copy readable over smoke and floor reflections */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%] bg-gradient-to-t from-black/55 via-black/20 to-transparent lg:h-[34%]" />

            {/* Headline */}
            <h1 className="absolute left-[6.2%] top-[9.6%] z-10 font-sans text-[19.5cqw] font-extrabold leading-[0.92] tracking-[-0.045em] lg:left-[22.7%] lg:top-[41%] lg:flex lg:items-baseline lg:gap-[6.2cqw] lg:text-[9.1cqw] lg:leading-none">
              <motion.span className="sd-hero sd-hero-title block overflow-hidden pb-[0.08em] pr-[0.06em]">
                <motion.span variants={mask} className="block text-white [text-shadow:0_6px_40px_rgba(0,0,0,0.35)]">
                  Heepzy
                </motion.span>
              </motion.span>
              <motion.span className="sd-hero sd-hero-sub block overflow-hidden pb-[0.08em] pr-[0.06em]">
                <motion.span variants={mask} className="block text-sun [text-shadow:0_6px_40px_rgba(0,0,0,0.3)]">
                  Now
                </motion.span>
              </motion.span>
            </h1>

            {/* Keywords */}
            <motion.ul variants={rise} className="sd-hero sd-hero-left absolute left-[5.5%] top-[72.8%] z-10 font-display text-[2.7cqw] font-medium uppercase leading-[1.62] text-[#f3d9d2]/80 lg:left-[4.1%] lg:top-[44.4%] lg:text-[1.5cqw] lg:leading-[1.7]">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-[0.6em]">
                  <span aria-hidden className="h-[0.28em] w-[0.28em] rounded-full bg-white/85" />
                  {p}
                </li>
              ))}
            </motion.ul>

            {/* Description */}
            <motion.p variants={rise} className="sd-hero sd-hero-left absolute left-[5.6%] top-[84%] z-10 w-[46%] font-display text-[3.05cqw] font-medium uppercase leading-[1.12] lg:left-[4.1%] lg:top-[70.4%] lg:w-[23%] lg:text-[1.72cqw] lg:leading-[1.1]">
              Heepzy sneakers are built for daily walks. Combines reimagined comfort and style.
            </motion.p>

            {/* Flash drop */}
            <motion.div variants={rise} className="sd-hero sd-hero-flash absolute left-[60.4%] top-[79.8%] z-10 w-[36%] font-display uppercase lg:left-[78.4%] lg:top-[63.2%] lg:w-[19.6%]">
              <p className="whitespace-nowrap text-[3.5cqw] font-semibold leading-none lg:ml-[1.4cqw] lg:text-[1.8cqw]">Flash drop 25% off</p>
              <p className="mt-[1.8cqw] text-[2.75cqw] font-medium leading-[1.1] lg:mt-[1.5cqw] lg:text-[1.52cqw] lg:leading-[1.08]">
                Grab our latest Heepzy sneakers on sale and save on every flash-drop pair.
              </p>
            </motion.div>

            {/* Calls to action */}
            <motion.div variants={rise} className="absolute bottom-[2.3%] left-[5.5%] z-10 lg:bottom-[4.1%] lg:left-[4%]">
              <Link
                href="/shop"
                className="group flex items-center gap-[1.2cqw] lg:gap-[0.5cqw]"
                aria-label="Check out the collection"
              >
                <span className="rounded-full border border-white/85 bg-black/15 px-[3.3cqw] py-[2.1cqw] font-display text-[2.7cqw] font-medium uppercase leading-none backdrop-blur-[2px] transition-colors group-hover:bg-white group-hover:text-maroon lg:px-[1.15cqw] lg:py-[0.85cqw] lg:text-[1.1cqw]">
                  Check out collection
                </span>
                <span className="grid h-[7.4cqw] w-[7.4cqw] place-items-center rounded-full border border-white/85 transition-colors group-hover:bg-white group-hover:text-maroon lg:h-[2.45cqw] lg:w-[2.45cqw]">
                  <ArrowIcon className="h-[48%] w-[48%] -rotate-45" />
                </span>
              </Link>
            </motion.div>
            <motion.div variants={rise} className="absolute bottom-[2.3%] right-[5.5%] z-10 lg:bottom-[4.1%] lg:right-[4%]">
              <Link
                href="/shop?new=1&sort=newest"
                className="group flex items-center gap-[1.2cqw] lg:gap-[0.5cqw]"
                aria-label="Shop the flash drop, 25 percent off"
              >
                <span className="rounded-full bg-white px-[3.3cqw] py-[2.1cqw] font-display text-[2.7cqw] font-medium uppercase leading-none text-maroon shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-colors group-hover:bg-sun lg:px-[1.15cqw] lg:py-[0.85cqw] lg:text-[1.1cqw]">
                  Shop the drop <span className="mx-[0.5em] opacity-60">•</span> 25% off
                </span>
                <span className="grid h-[7.4cqw] w-[7.4cqw] place-items-center rounded-full bg-white text-maroon transition-colors group-hover:bg-sun lg:h-[2.45cqw] lg:w-[2.45cqw]">
                  <ArrowIcon className="h-[48%] w-[48%] -rotate-45" />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
