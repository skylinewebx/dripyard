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
    blurb: "Court-born Jordan 1 icons with a fresh finish.",
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

/**
 * Campaign hero. The supplied photograph (public/images/hero.webp) defines a stage; on desktop all
 * copy is live HTML placed in percentages of that stage (so it scales with the picture exactly as in
 * the reference), on mobile the copy stacks above the full photograph. Each block drifts at its own
 * speed as the page scrolls.
 */
export default function Hero({ hasImage }: { hasImage: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [mood, setMood] = useState<Mood>("style");
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const m = MOODS[mood];

  const imgY = useTransform(p, [0, 1], ["0%", "7%"]);
  const imgScale = useTransform(p, [0, 1], [1, 1.1]);
  const dTitle = useDrift(p, [0, -150], [0, 0], 0.55);
  const dSub = useDrift(p, [0, -70], [0, 0], 0.5);
  const dRight = useDrift(p, [0, 0], [0, -90], 0.5);
  const dLeftMid = useDrift(p, [0, -70], [0, -30], 0.45);
  const dFlash = useDrift(p, [0, 70], [0, -40], 0.45);
  const dBottom = useDrift(p, [0, 0], [0, 60], 0.35);

  const onMoodKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = ORDER[(i + dir + ORDER.length) % ORDER.length];
    setMood(next);
    (e.currentTarget.parentElement?.querySelector(`[data-mood="${next}"]`) as HTMLElement | null)?.focus();
  };

  const pad = "px-5 sm:px-8 lg:px-0";

  return (
    <section id="hero" ref={ref} aria-label="DRIPYARD introduction" className="relative bg-white p-1.5 sm:p-2.5">
      <div
        data-dark
        className="relative isolate overflow-hidden rounded-[10px] text-white sm:rounded-[14px]"
        style={{ background: "radial-gradient(120% 90% at 78% 12%, #5b1218 0%, #2a080c 48%, #12040a 100%)" }}
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ ["--h" as string]: "min(calc(100svh - 1.25rem), 980px)" }}
          className="relative mx-auto flex min-h-[calc(100svh-0.75rem)] flex-col gap-5 pt-28 [container-type:inline-size] sm:pt-32 lg:block lg:aspect-[1320/746] lg:min-h-0 lg:w-[min(100%,calc((100svh-1.25rem)*1320/746))] lg:pt-0"
        >
          {/* Photograph: full composition, original framing, edges feathered into the backdrop */}
          <motion.div
            aria-hidden={!hasImage}
            style={reduced ? undefined : { y: imgY, scale: imgScale }}
            className="relative order-5 mt-auto aspect-[844/746] w-full [mask-image:linear-gradient(to_bottom,transparent,black_16%)] lg:absolute lg:inset-0 lg:mt-0 lg:aspect-auto lg:[mask-image:linear-gradient(to_right,transparent,black_9%,black_91%,transparent)]"
          >
            {hasImage ? (
              <>
                {/* Phones: portrait-friendly crop. Laptops and up: the 16:9 desktop composition. Each is served only where it is shown. */}
                <Image
                  src="/images/hero-mobile.webp"
                  alt="A model leaning against a giant red Air Jordan sneaker in deep-red studio smoke"
                  fill
                  quality={90}
                  sizes="100vw"
                  className="object-cover lg:hidden"
                />
                <Image
                  src="/images/hero-desktop.webp"
                  alt="A model leaning against a giant red Air Jordan sneaker in deep-red studio smoke"
                  fill
                  quality={90}
                  sizes="(min-width:1024px) 100vw, 1px"
                  className="hidden object-cover lg:block"
                />
              </>
            ) : null}
          </motion.div>

          {/* Headline */}
          <h1 className={`display order-1 lg:absolute lg:left-[4.2%] lg:top-[16%] lg:z-10 ${pad}`}>
            <motion.span style={dTitle} className="block overflow-hidden pb-[0.05em]">
              <motion.span variants={mask} className="block text-[clamp(3.1rem,15.5vw,6rem)] leading-[0.95] text-white lg:text-[6.7cqw]">
                Reimagined
              </motion.span>
            </motion.span>
            <motion.span style={dSub} className="block overflow-hidden pb-[0.05em]">
              <motion.span variants={mask} className="block text-[clamp(1.9rem,9vw,3.4rem)] font-medium leading-[1] text-sun lg:text-[4.8cqw]">
                Comfort
              </motion.span>
            </motion.span>
          </h1>

          {/* Tagline + mood pills */}
          <motion.div style={dRight} className={`order-2 lg:absolute lg:left-[79%] lg:top-[20%] lg:z-10 lg:w-[18.5%] ${pad}`}>
            <motion.div variants={rise}>
              <p className="max-w-[34ch] text-[13.5px] leading-relaxed text-white/90 lg:max-w-none lg:text-[max(12px,1.1cqw)] lg:leading-[1.5]">
                Built For Every Mood, Every Outfit, And Every Move Lace Up And Show Vibe.
              </p>
              <div role="radiogroup" aria-label="Pick your mood" className="mt-4 flex flex-wrap gap-2 lg:mt-[1.1cqw] lg:flex-nowrap lg:gap-[0.5cqw]">
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
                      className={`rounded-full px-5 py-2 text-[13px] font-medium text-maroon transition-[background-color,transform,box-shadow] duration-300 ease-premium active:scale-95 lg:px-[1.2cqw] lg:py-[0.5cqw] lg:text-[max(11px,1cqw)] ${
                        selected ? "bg-sun shadow-[0_6px_20px_-6px_rgba(245,226,59,.55)]" : "bg-white hover:bg-cream"
                      }`}
                    >
                      {MOODS[key].label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-white/80 lg:mt-[0.9cqw] lg:text-[max(11px,0.9cqw)]" aria-live="polite">
                <Link href={m.href} className="group inline-flex items-center gap-1.5 font-semibold text-white underline-offset-4 hover:underline">
                  {m.cta} <ArrowIcon width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <span className="ml-2 text-white/65">{m.count} pairs</span>
              </p>
            </motion.div>
          </motion.div>

          {/* Supporting headline */}
          <motion.div style={dLeftMid} className={`order-3 lg:absolute lg:left-[4.2%] lg:top-[69.5%] lg:z-10 ${pad}`}>
            <motion.h2 variants={rise} className="max-w-[18ch] text-[15px] font-medium leading-snug lg:max-w-none lg:text-[max(13px,1.35cqw)] lg:leading-[1.4]">
              Comfort Evolved
              <br />
              Style Perfected.
            </motion.h2>
          </motion.div>

          {/* Flash drop */}
          <motion.div style={dFlash} className={`order-4 lg:absolute lg:left-[81%] lg:top-[68.8%] lg:z-10 ${pad}`}>
            <motion.div variants={rise}>
              <p className="display text-[clamp(1.6rem,7vw,2.1rem)] font-medium leading-none lg:text-[max(20px,2.3cqw)]">Flash Drop 25%</p>
              <p className="mt-1.5 text-sm text-white/70 lg:mt-[0.6cqw] lg:text-[max(12px,1.2cqw)]">Our All New Arrival</p>
            </motion.div>
          </motion.div>

          {/* Social proof */}
          <motion.div style={dBottom} className={`order-6 pb-6 lg:absolute lg:bottom-auto lg:left-[4.2%] lg:top-[90.3%] lg:z-10 lg:pb-0 ${pad}`}>
            <motion.div variants={rise} className="flex items-center gap-3 lg:gap-[1cqw]">
              <div className="flex -space-x-3 lg:-space-x-[0.9cqw]" aria-hidden>
                {AVATARS.map((a) => (
                  <span key={a.t} className={`grid h-11 w-11 place-items-center rounded-full text-[11px] font-semibold ring-2 ring-[#3a0a0e] lg:h-[3.2cqw] lg:w-[3.2cqw] lg:text-[max(9px,0.9cqw)] ${a.c}`}>
                    {a.t}
                  </span>
                ))}
              </div>
              <div>
                <p className="flex items-center gap-1 text-[13px] leading-tight lg:text-[max(11px,1cqw)]">
                  <StarIcon width={13} height={13} className="text-sun" /> 4.8/5 From 12,000+
                  <br className="hidden lg:block" /> <span className="lg:ml-[1.5cqw]">Customers</span>
                </p>
                <p className="mt-0.5 text-[10px] text-white/55 lg:text-[max(9px,0.75cqw)]">Sample marketing content</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Scroll to explore */}
          <motion.div style={dBottom} className="absolute bottom-6 right-5 z-10 sm:right-8 lg:bottom-auto lg:right-[3.2%] lg:top-[88.6%]">
            <motion.button
              type="button"
              onClick={() => scrollToElement(document.getElementById("featured"))}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Scroll to explore: jump to featured sneakers"
              className="group flex flex-col items-center gap-2 text-[11px] text-white/85 lg:gap-[0.5cqw] lg:text-[max(10px,0.85cqw)]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full border border-white/70 transition-colors duration-300 group-hover:bg-white group-hover:text-maroon lg:h-[3.4cqw] lg:w-[3.4cqw]">
                <ArrowDownIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5 lg:h-[1.4cqw] lg:w-[1.4cqw]" />
              </span>
              Scroll To Explore
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
