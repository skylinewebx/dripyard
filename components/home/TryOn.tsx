"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice, unitPriceCents } from "@/lib/pricing";
import type { Product } from "@/types";

type Style = { id: string; name: string; fill: string; shade: string; hem: number; cuff: boolean };

// Five trouser cuts. `hem` is the half-width of the leg opening (viewBox units); `cuff` adds a turned-up hem.
const STYLES: Style[] = [
  { id: "black", name: "Slim Black", fill: "#17171a", shade: "#050506", hem: 40, cuff: false },
  { id: "olive", name: "Olive Chino", fill: "#6b6f45", shade: "#3f4226", hem: 46, cuff: true },
  { id: "denim", name: "Washed Denim", fill: "#4b6a8f", shade: "#26384f", hem: 50, cuff: true },
  { id: "stone", name: "Stone Wide", fill: "#cbbfa8", shade: "#8d826d", hem: 62, cuff: false },
  { id: "navy", name: "Navy Jogger", fill: "#1d2a52", shade: "#0b1129", hem: 36, cuff: true },
];

// Generic, category-level construction notes. They are NOT measured from the exact pair in the photo.
const GENERIC: Record<string, { label: string; text: string }[]> = {
  Basketball: [
    { label: "Upper", text: "Leather and synthetic-leather panels over a structured collar." },
    { label: "Lining", text: "Breathable textile lining with a padded ankle collar." },
    { label: "Outsole", text: "Rubber cupsole with a pivot circle and flex grooves for court grip." },
    { label: "Stitching", text: "Double-stitched overlays at the toe box, eyestay and heel." },
    { label: "Construction", text: "Stitched cupsole: upper sewn to a rubber cup, then bonded to the sole unit." },
    { label: "Cushioning", text: "Foam midsole with a heel Air-style unit for impact comfort." },
    { label: "Care", text: "Wipe leather with a damp cloth, air-dry away from heat, stuff with paper to hold shape." },
  ],
  Running: [
    { label: "Upper", text: "Engineered mesh with synthetic overlays for airflow and support." },
    { label: "Lining", text: "Soft textile lining with a cushioned tongue and heel." },
    { label: "Outsole", text: "Rubber outsole with a multi-direction tread." },
    { label: "Stitching", text: "Bonded and stitched overlays at stress points." },
    { label: "Construction", text: "Cemented construction: upper glued to the midsole and outsole." },
    { label: "Cushioning", text: "Responsive foam midsole for everyday mileage." },
    { label: "Care", text: "Spot-clean mesh with mild soap, never machine-dry." },
  ],
  Lifestyle: [
    { label: "Upper", text: "Leather and suede or textile panels, depending on colourway." },
    { label: "Lining", text: "Soft textile lining with a lightly padded collar." },
    { label: "Outsole", text: "Flat rubber cupsole with a herringbone or pivot pattern." },
    { label: "Stitching", text: "Visible stitched overlays along the vamp, quarter and heel." },
    { label: "Construction", text: "Stitched cupsole construction for durability." },
    { label: "Cushioning", text: "Foam midsole with a cushioned insole for all-day wear." },
    { label: "Care", text: "Brush off dust, wipe with a damp cloth, avoid soaking." },
  ],
};

export default function TryOn({ items }: { items: Product[] }) {
  const [i, setI] = useState(0);
  const [s, setS] = useState(0);
  const [tab, setTab] = useState(0);
  const p = items[i];
  const st = STYLES[s];
  const go = (d: number) => setI((n) => (n + d + items.length) % items.length);
  const file = p.image.split("/").pop()!;
  const notes = GENERIC[p.category] ?? GENERIC.Lifestyle;

  // Legs: two tapered columns that end behind the shoe's collar
  const leg = (cx: number, w: number) => {
    const top = 36;
    const bot = 330;
    return `M${cx - 62} 0 L${cx + 62} 0 L${cx + w} ${bot} L${cx - w} ${bot} Z`;
  };

  return (
    <section
      id="try-on"
      aria-labelledby="tryon-title"
      data-dark
      className="grain relative -mb-24 overflow-hidden pb-44 pt-28 sm:-mb-32 sm:pb-60 sm:pt-40"
      style={{ background: "linear-gradient(to bottom, #f6f1ea 0%, #3a0d11 16%, #1f0608 34%, #1a0505 100%)" }}
    >
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[10%] h-[70%] w-[150%] -translate-x-1/2">
        <div
          className="h-full w-full"
          style={{ background: "radial-gradient(50% 55% at 50% 30%, rgba(217,74,74,0.34) 0%, rgba(179,32,42,0.16) 38%, rgba(26,5,5,0) 72%)" }}
        />
      </div>

      <div className="container-x relative">
        <p className="eyebrow text-white/60">Try them on</p>
        <h2 id="tryon-title" className="display mt-4 text-[clamp(2.6rem,6.5vw,5.5rem)] text-white">
          Style it before you buy it
        </h2>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/65">
          Pick a trouser cut, flip through the store&apos;s sneakers and see the pair against your fit. This is a styling preview, not a body scan.
        </p>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-16">
          {/* Stage */}
          <div>
            <div
              className="relative mx-auto w-full max-w-[460px] overflow-hidden rounded-[14px] shadow-[0_60px_100px_-40px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)]"
              style={{ aspectRatio: "4 / 5", background: "radial-gradient(80% 60% at 50% 35%, #6e1620 0%, #3a0c12 55%, #14050a 100%)" }}
            >
              <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" role="img" aria-label={`${st.name} trousers`}>
                <defs>
                  <linearGradient id="trShade" x1="0" x2="1">
                    <stop offset="0" stopColor={st.shade} stopOpacity=".55" />
                    <stop offset=".5" stopColor={st.shade} stopOpacity="0" />
                    <stop offset="1" stopColor={st.shade} stopOpacity=".6" />
                  </linearGradient>
                </defs>
                {[128, 272].map((cx) => (
                  <g key={cx}>
                    <path d={leg(cx, st.hem)} fill={st.fill} style={{ transition: "fill .35s" }} />
                    <path d={leg(cx, st.hem)} fill="url(#trShade)" />
                    {st.cuff && <rect x={cx - st.hem - 2} y={312} width={st.hem * 2 + 4} height={22} rx={3} fill={st.fill} stroke={st.shade} strokeOpacity=".5" />}
                    <path d={`M${cx} 0 L${cx + (st.hem - 62) * 0.02} 330`} stroke={st.shade} strokeOpacity=".35" strokeWidth="1.5" fill="none" />
                  </g>
                ))}
                {/* Belt line */}
                <rect x="0" y="0" width="400" height="14" fill={st.shade} opacity=".7" />
              </svg>

              <div aria-hidden className="pointer-events-none absolute bottom-[8%] left-1/2 h-[7%] w-[70%] -translate-x-1/2 rounded-full bg-black/60 blur-xl" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={file}
                src={`/images/tryon/${file}`}
                alt={`${p.name} ${p.colorway}`}
                className="absolute bottom-[9%] left-[11%] h-[56%] w-[78%] object-contain object-bottom drop-shadow-[0_18px_22px_rgba(0,0,0,0.45)]"
                loading="lazy"
                decoding="async"
              />

              <button type="button" onClick={() => go(-1)} aria-label="Previous sneaker" className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/65">
                ‹
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next sneaker" className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/65">
                ›
              </button>
              <p className="absolute right-3 top-3 rounded-full bg-black/45 px-3 py-1 text-xs text-white/80 backdrop-blur">
                {i + 1} / {items.length}
              </p>
            </div>

            <div className="mx-auto mt-6 flex max-w-[460px] flex-wrap justify-center gap-3" role="radiogroup" aria-label="Trouser style">
              {STYLES.map((t, n) => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={n === s}
                  aria-label={t.name}
                  title={t.name}
                  onClick={() => setS(n)}
                  className={`h-11 w-11 rounded-full border-2 transition ${n === s ? "scale-110 border-white" : "border-white/25 hover:border-white/60"}`}
                  style={{ background: t.fill }}
                />
              ))}
            </div>
            <p className="mt-3 text-center text-sm text-white/70">{st.name}</p>
          </div>

          {/* Details */}
          <div className="text-white">
            <p className="eyebrow text-white/50">{p.category}</p>
            <h3 className="display mt-2 text-[clamp(1.8rem,3.4vw,3rem)]">{p.name}</h3>
            <p className="mt-1 text-white/70">{p.colorway}</p>
            <p className="mt-4 text-2xl font-semibold">{formatPrice(unitPriceCents(p))}</p>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">{p.description}</p>
            <p className="mt-4 text-sm text-white/60">Sizes: {p.sizes.join(" · ")}</p>

            <div className="mt-8 border-t border-white/15 pt-6">
              <p className="eyebrow text-white/50">Sneaker details</p>
              <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Sneaker details">
                {notes.map((n, k) => (
                  <button
                    key={n.label}
                    type="button"
                    role="tab"
                    aria-selected={k === tab}
                    onClick={() => setTab(k)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${k === tab ? "border-white bg-white text-maroon" : "border-white/25 text-white/80 hover:border-white/60"}`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
              <p role="tabpanel" className="mt-5 min-h-[3.5rem] max-w-xl text-[15px] leading-relaxed text-white/85">
                {notes[tab].text}
              </p>
              <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/45">
                Illustrative: these materials and construction notes describe the {p.category.toLowerCase()} category in general, not a verified spec of this exact pair. Name, colourway, price and sizes come from the store listing.
              </p>
            </div>

            <Link href={`/product/${p.id}`} className="pill-solid mt-8 inline-flex px-8 py-4 text-base">
              View this sneaker
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
