"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
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

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
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

/** Campaign hero: thin white frame, full-bleed photo, copy placed around the subject (live HTML over the image). */
export default function Hero({ hasImage }: { hasImage: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [mood, setMood] = useState<Mood>("style");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);
  const m = MOODS[mood];

  const onMoodKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = ORDER[(i + dir + ORDER.length) % ORDER.length];
    setMood(next);
    (e.currentTarget.parentElement?.querySelector(`[data-mood="${next}"]`) as HTMLElement | null)?.focus();
  };

  return (
    <section id="hero" ref={ref} aria-label="DRIPYARD introduction" className="relative bg-white p-1.5 sm:p-2.5">
      <div
        data-dark
        className="relative isolate flex min-h-[calc(100svh-0.75rem)] flex-col overflow-hidden rounded-[10px] bg-[#8e1a22] text-white sm:rounded-[14px] lg:min-h-[min(calc(100svh-1.25rem),900px)]"
      >
        {/* Photograph: full-bleed, original untouched, gentle parallax */}
        <motion.div className="absolute inset-x-0 -bottom-[4%] -top-[4%] -z-20" style={{ y }}>
          {hasImage ? (
            <Image
              src="/images/hero.webp"
              alt="A model leaning on a giant red Air Jordan sneaker against a deep-red smoky backdrop"
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-[50%_50%]"
            />
          ) : null}
        </motion.div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-maroon/45 via-transparent to-maroon/35" />

        {process.env.NODE_ENV !== "production" && !hasImage && (
          <p className="absolute left-1/2 top-24 z-10 max-w-[260px] -translate-x-1/2 rounded-xl bg-maroon/80 px-3 py-2 text-[11px] leading-snug text-cream">
            Dev note: <code>/public/images/hero.webp</code> not found. Add the supplied hero photo and it will appear here.
          </p>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="container-x relative z-10 flex flex-1 flex-col gap-6 pb-28 pt-28 sm:pt-32 lg:block lg:px-12 lg:pb-0 lg:pt-0"
        >
          {/* Headline, top-left */}
          <h1 className="display lg:absolute lg:left-12 lg:top-[136px]">
            <span className="block overflow-hidden pb-[0.05em]">
              <motion.span variants={mask} className="block text-[clamp(3.2rem,13.5vw,7.8rem)] leading-[0.95] text-white">
                Reimagined
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.05em]">
              <motion.span variants={mask} className="block text-[clamp(2rem,8vw,4.4rem)] font-medium leading-[1] text-sun">
                Comfort
              </motion.span>
            </span>
          </h1>

          {/* Tagline + mood pills, top-right */}
          <motion.div variants={rise} className="max-w-[300px] lg:absolute lg:right-12 lg:top-[150px] lg:w-[270px]">
            <p className="text-[13.5px] leading-relaxed text-white/90 sm:text-sm">Built For Every Mood, Every Outfit, And Every Move Lace Up And Show Vibe.</p>
            <div role="radiogroup" aria-label="Pick your mood" className="mt-4 flex flex-wrap gap-2">
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
                    className={`rounded-full px-5 py-2 text-[13px] font-medium text-maroon transition-[background-color,transform,box-shadow] duration-300 ease-premium active:scale-95 ${
                      selected ? "bg-sun shadow-[0_6px_20px_-6px_rgba(245,226,59,.55)]" : "bg-white hover:bg-cream"
                    }`}
                  >
                    {MOODS[key].label}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-white/85" aria-live="polite">
              <Link href={m.href} className="group inline-flex items-center gap-1.5 font-semibold text-white underline-offset-4 hover:underline">
                {m.cta} <ArrowIcon width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <span className="ml-2 text-white/70">
                {m.count} pairs · {m.blurb}
              </span>
            </p>
          </motion.div>

          {/* Supporting headline, left-middle */}
          <motion.h2 variants={rise} className="max-w-[17ch] text-[15px] font-medium leading-snug lg:absolute lg:left-12 lg:top-[47%] lg:text-base">
            Comfort Evolved Style Perfected.
          </motion.h2>

          {/* Flash drop, right-middle */}
          <motion.div variants={rise} className="lg:absolute lg:right-12 lg:top-[46%] lg:w-[270px]">
            <p className="display text-[clamp(1.7rem,3vw,2.1rem)] leading-none">Flash Drop 25%</p>
            <p className="mt-1.5 text-sm text-white/70">Our All New Arrival</p>
          </motion.div>

          {/* Social proof, bottom-left */}
          <motion.div variants={rise} className="flex items-center gap-3 lg:absolute lg:bottom-8 lg:left-12">
            <div className="flex -space-x-3" aria-hidden>
              {AVATARS.map((a) => (
                <span key={a.t} className={`grid h-11 w-11 place-items-center rounded-full text-[11px] font-semibold ring-2 ring-[#5b0f14] ${a.c}`}>
                  {a.t}
                </span>
              ))}
            </div>
            <div>
              <p className="flex items-center gap-1 text-[13px] leading-tight">
                <StarIcon width={13} height={13} className="text-sun" /> 4.8/5 From 12,000+
                <br className="hidden sm:block" /> Customers
              </p>
              <p className="mt-0.5 text-[10px] text-white/55">Sample marketing content</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll to explore, bottom-right */}
        <motion.button
          type="button"
          onClick={() => scrollToElement(document.getElementById("featured"))}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Scroll to explore: jump to featured sneakers"
          className="group absolute bottom-6 right-5 z-10 flex flex-col items-center gap-2 text-[11px] text-white/85 sm:right-8 lg:bottom-8 lg:right-12"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full border border-white/70 transition-colors duration-300 group-hover:bg-white group-hover:text-maroon">
            <ArrowDownIcon width={20} height={20} className="transition-transform duration-300 group-hover:translate-y-0.5" />
          </span>
          Scroll To Explore
        </motion.button>
      </div>
    </section>
  );
}
