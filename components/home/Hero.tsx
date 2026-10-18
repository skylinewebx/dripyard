"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { products } from "@/lib/products";
import { scrollToElement } from "@/lib/scroll";
import Magnetic from "@/components/ui/Magnetic";
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
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};
const mask: Variants = {
  hidden: { y: "108%" },
  show: { y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

const AVATARS = [
  { t: "AK", c: "bg-cream text-maroon" },
  { t: "JM", c: "bg-coral text-white" },
  { t: "SR", c: "bg-brand text-white" },
  { t: "TL", c: "bg-white text-maroon" },
];

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
    <section id="hero" ref={ref} aria-label="DRIPYARD introduction" className="relative bg-white p-2 pb-3 sm:p-3 sm:pb-4 rounded-b-[32px] sm:rounded-b-[44px]">
      <div data-dark className="relative isolate flex min-h-[calc(100svh-1.25rem)] flex-col overflow-hidden rounded-[26px] bg-[#b3202a] text-white sm:rounded-[38px] lg:min-h-[min(100svh,980px)]">
        {/* Photograph: full-bleed, original untouched, gentle parallax */}
        <motion.div className="absolute inset-x-0 -bottom-[5%] -top-[5%] -z-20" style={{ y }}>
          {hasImage ? (
            <Image
              src="/images/hero.webp"
              alt="A model holding a giant red Air Jordan sneaker against a deep-red backdrop"
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-[70%_40%] sm:object-[62%_45%] lg:object-center"
            />
          ) : null}
        </motion.div>
        {/* Legibility scrims (palette maroon, no hue shift) */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-maroon/80 via-maroon/10 to-maroon/25" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-maroon/55 via-transparent to-transparent max-lg:from-maroon/35" />

        {process.env.NODE_ENV !== "production" && !hasImage && (
          <p className="absolute right-4 top-24 z-10 max-w-[240px] rounded-xl bg-maroon/80 px-3 py-2 text-[11px] leading-snug text-cream">
            Dev note: <code>/public/images/hero.webp</code> not found. Add the supplied hero photo and it will appear here automatically.
          </p>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="container-x relative z-10 flex flex-1 flex-col justify-end gap-7 pb-28 pt-32 sm:pb-24 lg:gap-9 lg:pb-14 lg:pt-36"
        >
          <h1 className="display text-[clamp(3.1rem,13.2vw,12rem)] leading-[0.86]">
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span variants={mask} className="block text-white">
                Reimagined
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span variants={mask} className="block bg-gradient-to-r from-cream from-45% to-coral bg-clip-text text-transparent">
                Comfort
              </motion.span>
            </span>
          </h1>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] lg:items-end lg:gap-0">
          {/* Left: tagline, mood selector */}
          <div>
            <motion.p variants={rise} className="max-w-[34rem] text-[15px] leading-relaxed text-white/90 sm:text-base">
              Built For Every Mood, Every Outfit, And Every Move Lace Up And Show Vibe.
            </motion.p>

            <motion.div variants={rise} className="mt-6">
              <div role="radiogroup" aria-label="Pick your mood" className="inline-flex flex-wrap gap-2">
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
                      className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-[background-color,border-color,transform,box-shadow] duration-300 ease-premium active:scale-95 ${
                        selected
                          ? "border-white/50 bg-brand text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,.6)]"
                          : "border-white/35 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                      }`}
                    >
                      {MOODS[key].label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Magnetic>
                  <Link href={m.href} className="pill bg-cream text-maroon shadow-card hover:bg-white">
                    {m.cta} <ArrowIcon width={18} height={18} />
                  </Link>
                </Magnetic>
                <p className="text-sm text-white/85" aria-live="polite">
                  <span className="font-semibold text-white">{m.count} pairs</span> · {m.blurb}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: supporting headline, flash drop, social proof */}
          <div className="lg:col-start-3 lg:justify-self-end">
            <motion.h2 variants={rise} className="display max-w-[16ch] text-[clamp(1.6rem,3.2vw,2.75rem)] leading-[1] text-white lg:text-right">
              Comfort Evolved Style Perfected.
            </motion.h2>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end">
              <motion.div
                variants={rise}
                whileHover={{ y: -3 }}
                className="flex items-center gap-4 rounded-3xl border border-white/25 bg-white/12 px-5 py-4 backdrop-blur-md"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand text-sm font-semibold ring-4 ring-white/15">%</span>
                <div>
                  <p className="display text-2xl leading-none">Flash Drop 25%</p>
                  <p className="mt-1 text-sm text-white/80">Our All New Arrival</p>
                </div>
              </motion.div>
              <motion.div variants={rise} className="flex items-center gap-3 sm:px-1">
                <div className="flex -space-x-3" aria-hidden>
                  {AVATARS.map((a) => (
                    <span key={a.t} className={`grid h-10 w-10 place-items-center rounded-full text-[11px] font-semibold ring-2 ring-[#5b0f14] ${a.c}`}>
                      {a.t}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="flex items-center gap-1 text-sm font-semibold">
                    <StarIcon width={14} height={14} className="text-coral" /> 4.8/5 From 12,000+ Customers
                  </p>
                  <p className="text-[11px] text-white/60">Sample marketing content, not verified review data.</p>
                </div>
              </motion.div>
            </div>
          </div>
          </div>
        </motion.div>

        {/* Scroll to explore */}
        <motion.button
          type="button"
          onClick={() => scrollToElement(document.getElementById("featured"))}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Scroll to explore: jump to featured sneakers"
          className="group absolute bottom-5 right-5 z-10 grid h-[88px] w-[88px] place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md transition-colors hover:bg-white hover:text-maroon sm:right-8 lg:bottom-8 lg:left-1/2 lg:right-auto lg:-translate-x-1/2"
        >
          <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full motion-safe:animate-[spin_24s_linear_infinite]">
            <defs>
              <path id="scroll-ring" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
            </defs>
            <text fontSize="9.5" fontWeight="600" letterSpacing="2.6" fill="currentColor" className="font-sans uppercase">
              <textPath href="#scroll-ring">Scroll to explore · Scroll to explore ·</textPath>
            </text>
          </svg>
          <ArrowDownIcon width={22} height={22} className="transition-transform duration-300 group-hover:translate-y-0.5" />
        </motion.button>
      </div>
    </section>
  );
}
