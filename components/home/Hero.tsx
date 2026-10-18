"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue, type Variants } from "framer-motion";
import { products } from "@/lib/products";
import { scrollToElement } from "@/lib/scroll";
import { ArrowDownIcon, ArrowIcon, StarIcon } from "@/components/ui/icons";

type Mood = "comfort" | "style" | "trendy";

const MOODS: Record<Mood, { label: string; blurb: string; href: string; cta: string; count: number }> = {
  comfort: {
    label: "Comfort",
    blurb: "Easy, everyday Air Force 1 and SB Dunk pairs.",
    href: "/shop?category=Lifestyle",
    cta: "Shop Comfort",
    count: products.filter((p) => p.category === "Lifestyle").length,
  },
  style: {
    label: "Style",
    blurb: "Court-born Jordan icons with a fresh finish.",
    href: "/shop?category=Basketball",
    cta: "Shop Style",
    count: products.filter((p) => p.category === "Basketball").length,
  },
  trendy: {
    label: "Trendy",
    blurb: "The newest arrivals, straight off the drop.",
    href: "/shop?new=1&sort=newest",
    cta: "Shop Trendy",
    count: products.filter((p) => p.isNew).length,
  },
};
const ORDER: Mood[] = ["comfort", "style", "trendy"];

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};
const mask: Variants = {
  hidden: { y: "108%" },
  show: { y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

const AVATARS = [
  { t: "AK", c: "bg-[#f08a3c] text-maroon" },
  { t: "JM", c: "bg-cream text-maroon" },
  { t: "SR", c: "bg-coral text-white" },
];

/** Scroll-linked drift for one text block (kept on its own wrapper so it never fights the entrance animation). */
function useDrift(p: MotionValue<number>, x: [number, number], y: [number, number], fadeEnd: number) {
  const reduced = useReducedMotion();
  const tx = useTransform(p, [0, 1], x);
  const ty = useTransform(p, [0, 1], y);
  const opacity = useTransform(p, [0, fadeEnd], [1, 0]);
  return reduced ? {} : { x: tx, y: ty, opacity };
}

const ALT = "A model leaning against a giant red Air Jordan sneaker in deep-red studio smoke";

/**
 * Campaign hero with two purpose-made photographs:
 *  - phones: portrait 1130x2000 composition (stage aspect 1130/2000)
 *  - laptops and up: 16:9 composition (stage aspect 1320/746)
 * Each stage is exactly the picture's aspect ratio, so nothing is stretched or re-cropped, and all
 * copy is live HTML positioned in percentages of the stage (sizes in cqw so it scales with the photo).
 */
export default function Hero({ hasImage }: { hasImage: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [mood, setMood] = useState<Mood>("style");
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const m = MOODS[mood];

  const imgY = useTransform(p, [0, 1], ["0%", "6%"]);
  const imgScale = useTransform(p, [0, 1], [1, 1.08]);
  const dTitle = useDrift(p, [0, -150], [0, 0], 0.55);
  const dSub = useDrift(p, [0, -70], [0, 0], 0.5);
  const dRight = useDrift(p, [0, 0], [0, -80], 0.5);
  const dLeftMid = useDrift(p, [0, -60], [0, -30], 0.45);
  const dFlash = useDrift(p, [0, 60], [0, -40], 0.45);
  const dBottom = useDrift(p, [0, 0], [0, 50], 0.35);

  const onMoodKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = ORDER[(i + dir + ORDER.length) % ORDER.length];
    setMood(next);
    (e.currentTarget.closest("[role=radiogroup]")?.querySelector(`[data-mood="${next}"]`) as HTMLElement | null)?.focus();
  };

  return (
    <section id="hero" ref={ref} aria-label="DRIPYARD introduction" className="relative bg-white p-1.5 sm:p-2.5">
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
            className="relative mx-auto aspect-[1130/2000] w-full [container-type:inline-size] lg:aspect-[1320/746] lg:w-[min(100%,calc((100svh-1.25rem)*1320/746))]"
          >
            {/* Photograph (feathered into the backdrop at the edges) */}
            <motion.div
              style={reduced ? undefined : { y: imgY, scale: imgScale }}
              className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_9%)] lg:[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
            >
              {hasImage ? (
                <>
                  <Image src="/images/hero-phone.webp" alt={ALT} fill quality={90} sizes="100vw" className="object-cover lg:hidden" />
                  <Image src="/images/hero-desktop.webp" alt={ALT} fill quality={90} sizes="(min-width:1024px) 100vw, 1px" className="hidden object-cover lg:block" />
                </>
              ) : null}
            </motion.div>

            {/* Headline */}
            <h1 className="display absolute left-[5.8%] top-[11.2%] z-10 lg:left-[4.2%] lg:top-[16%]">
              <motion.span style={dTitle} className="block overflow-hidden pb-[0.05em]">
                <motion.span variants={mask} className="block text-[13.3cqw] leading-[0.95] text-white lg:text-[6.7cqw]">
                  Reimagined
                </motion.span>
              </motion.span>
              <motion.span style={dSub} className="block overflow-hidden pb-[0.05em]">
                <motion.span variants={mask} className="block text-[12.3cqw] font-medium leading-[1] text-sun lg:text-[4.8cqw]">
                  Comfort
                </motion.span>
              </motion.span>
            </h1>

            {/* Supporting headline */}
            <motion.div style={dLeftMid} className="absolute left-[5.8%] top-[28%] z-10 lg:left-[4.2%] lg:top-[69.5%]">
              <motion.h2 variants={rise} className="text-[max(13px,3.5cqw)] leading-[1.45] lg:text-[max(13px,1.35cqw)] lg:leading-[1.4]">
                Comfort Evolved
                <br />
                Style Perfected.
              </motion.h2>
            </motion.div>

            {/* Tagline */}
            <motion.div style={dRight} className="absolute left-[66%] top-[36%] z-10 w-[30%] lg:left-[79%] lg:top-[20%] lg:w-[18.5%]">
              <motion.p variants={rise} className="text-[max(11px,2.8cqw)] font-medium leading-[1.4] lg:text-[max(12px,1.1cqw)] lg:font-normal lg:leading-[1.5]">
                Built For Every Mood, Every Outfit, And Every Move Lace Up And Show Vibe.
              </motion.p>
            </motion.div>

            {/* Mood pills + shop link */}
            <motion.div style={dRight} className="absolute right-[4.7%] top-[48.5%] z-10 lg:left-[79%] lg:right-auto lg:top-[29.8%]">
              <motion.div variants={rise} className="flex flex-col items-end gap-[max(6px,1.8cqw)] lg:items-start lg:gap-[0.5cqw]">
                <div role="radiogroup" aria-label="Pick your mood" className="flex flex-col items-end gap-[max(6px,1.8cqw)] lg:flex-row lg:items-start lg:gap-[0.5cqw]">
                  {ORDER.map((key, i) => {
                    const selected = mood === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        data-mood={key}
                        aria-checked={selected}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => setMood(key)}
                        onKeyDown={(e) => onMoodKey(e, i)}
                        className={`rounded-full px-[max(12px,3cqw)] py-[max(6px,1.6cqw)] text-[max(11.5px,2.9cqw)] font-medium text-maroon transition-[background-color,transform,box-shadow] duration-300 ease-premium active:scale-95 lg:px-[1.2cqw] lg:py-[0.5cqw] lg:text-[max(11px,1cqw)] ${
                          selected ? "bg-sun shadow-[0_6px_20px_-6px_rgba(245,226,59,.55)]" : "bg-white hover:bg-cream"
                        }`}
                      >
                        {MOODS[key].label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[max(11px,2.6cqw)] text-white/85 lg:mt-[0.4cqw] lg:text-[max(11px,0.9cqw)]" aria-live="polite">
                  <Link href={m.href} className="group inline-flex items-center gap-1.5 font-semibold text-white underline-offset-4 hover:underline">
                    {m.cta} <ArrowIcon width={13} height={13} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <span className="ml-2 text-white/65">{m.count} pairs</span>
                </p>
              </motion.div>
            </motion.div>

            {/* Rules + divider (phone composition only) */}
            <span aria-hidden className="absolute left-[5.8%] right-[5.7%] top-[85.5%] h-px bg-white/20 lg:hidden" />
            <span aria-hidden className="absolute left-[50%] top-[87.2%] h-[4.2%] w-px bg-white/25 lg:hidden" />
            <span aria-hidden className="absolute left-[5.8%] right-[5.7%] top-[93.9%] h-px bg-white/20 lg:hidden" />

            {/* Social proof */}
            <motion.div style={dBottom} className="absolute left-[5.8%] top-[87.6%] z-10 lg:left-[4.2%] lg:top-[90.3%]">
              <motion.div variants={rise} className="flex items-center gap-[2.4cqw] lg:gap-[1cqw]">
                <div className="flex -space-x-[2.4cqw] lg:-space-x-[0.9cqw]" aria-hidden>
                  {AVATARS.map((a) => (
                    <span key={a.t} className={`grid h-[max(26px,6.6cqw)] w-[max(26px,6.6cqw)] place-items-center rounded-full text-[9px] font-semibold ring-2 ring-[#2a080c] lg:h-[3.2cqw] lg:w-[3.2cqw] lg:text-[max(9px,0.9cqw)] ${a.c}`}>
                      {a.t}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="flex items-center gap-1 text-[max(9.5px,2.2cqw)] leading-tight lg:text-[max(11px,1cqw)]">
                    <StarIcon className="h-[1em] w-[1em] shrink-0 text-sun" /> 4.8/5 From 12,000+
                    <br className="hidden" />
                  </p>
                  <p className="text-[max(9.5px,2.2cqw)] leading-tight lg:text-[max(11px,1cqw)]">Customers</p>
                  <p className="mt-0.5 hidden text-[max(9px,0.75cqw)] text-white/55 lg:block">Sample marketing content</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Flash drop */}
            <motion.div style={dFlash} className="absolute right-[5.7%] top-[87.1%] z-10 text-right lg:left-[81%] lg:right-auto lg:top-[68.8%] lg:text-left">
              <motion.div variants={rise}>
                <p className="display text-[max(18px,4.9cqw)] font-medium leading-none lg:text-[max(20px,2.3cqw)]">Flash Drop 25%</p>
                <p className="mt-[1cqw] text-[max(11px,3cqw)] text-white/70 lg:mt-[0.6cqw] lg:text-[max(12px,1.2cqw)]">Our All New Arrival</p>
              </motion.div>
            </motion.div>

            {/* Scroll to explore */}
            <div className="absolute inset-x-0 top-[94.6%] z-10 flex justify-center lg:inset-x-auto lg:right-[3.2%] lg:top-[88.6%]">
              <motion.div style={dBottom}>
                <motion.button
                  type="button"
                  onClick={() => scrollToElement(document.getElementById("featured"))}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  aria-label="Scroll to explore: jump to featured sneakers"
                  className="group flex flex-col items-center gap-[1cqw] text-[max(9.5px,2.2cqw)] text-white/85 lg:gap-[0.5cqw] lg:text-[max(10px,0.85cqw)]"
                >
                  <span className="grid h-[max(30px,8cqw)] w-[max(30px,8cqw)] place-items-center rounded-full border border-white/70 transition-colors duration-300 group-hover:bg-white group-hover:text-maroon lg:h-[3.4cqw] lg:w-[3.4cqw]">
                    <ArrowDownIcon className="h-[50%] w-[50%] transition-transform duration-300 group-hover:translate-y-0.5" />
                  </span>
                  Scroll To Explore
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
