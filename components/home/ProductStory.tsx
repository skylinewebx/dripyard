"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/types";
import { formatPrice, listPriceCents, unitPriceCents } from "@/lib/pricing";
import { sizeStock, totalStock } from "@/lib/products";
import { useCartStore } from "@/store/cart";
import { useUiStore } from "@/store/ui";
import ProductImage from "@/components/product/ProductImage";
import WishlistButton from "@/components/ui/WishlistButton";
import Stars from "@/components/ui/Stars";
import Reveal from "@/components/ui/Reveal";
import { ArrowIcon, BagIcon, CheckIcon } from "@/components/ui/icons";

/** SAMPLE content. Clearly labelled on the page; not verified customer reviews. */
const STORIES = [
  {
    initials: "AK",
    name: "Aria K.",
    role: "Sneaker collector",
    text: "The colours are even better in person. Comfortable from the first walk, and the pair arrived neatly packed.",
  },
  {
    initials: "JM",
    name: "Jordan M.",
    role: "Weekend runner",
    text: "Light, clean and easy to style. I wear them from errands to evenings out and they still look fresh.",
  },
  {
    initials: "SR",
    name: "Sam R.",
    role: "Daily commuter",
    text: "True to size and supportive all day. Checkout was quick and the whole order showed up sooner than expected.",
  },
];

const AVATAR_TONES = ["bg-brand text-white", "bg-sun text-maroon", "bg-cream text-maroon"];

const selectCls =
  "h-12 w-full appearance-none rounded-full border border-maroon/20 bg-white px-5 pr-11 text-[15px] text-maroon outline-none transition focus:border-maroon/60 bg-[length:16px] bg-[right_1.1rem_center] bg-no-repeat bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231a0505' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")]";

export default function ProductStory({ items }: { items: Product[] }) {
  const [i, setI] = useState(0);
  const [size, setSize] = useState("");
  const [colorByProduct, setColorByProduct] = useState<Record<string, string>>({});
  const [hint, setHint] = useState(false);
  const [added, setAdded] = useState(false);
  const add = useCartStore((s) => s.add);
  const setCartOpen = useUiStore((s) => s.setCartOpen);

  const p = items[i];
  const sale = unitPriceCents(p);
  const list = listPriceCents(p);
  const color = colorByProduct[p.id] ?? p.colors[0].name;
  const sizesAvailable = p.sizes.filter((s) => sizeStock(p, s) > 0).length;
  const pairs = totalStock(p);

  const pick = (n: number) => {
    setI(n);
    setSize("");
    setHint(false);
  };

  const submit = () => {
    const s = Number(size);
    if (!s) {
      setHint(true);
      return;
    }
    add({ productId: p.id, size: s, color, quantity: 1 });
    setAdded(true);
    setCartOpen(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <>
      {/* Product detail */}
      <section id="featured-story" aria-labelledby="story-title" className="bg-cream pb-20 pt-16 sm:pb-28 sm:pt-24">
        <div className="container-x">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)] lg:gap-16">
            <Reveal>
              <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_40px_80px_-50px_rgba(26,5,5,0.45)] ring-1 ring-maroon/10">
                <div className="relative aspect-[4/5]">
                  <ProductImage key={p.id} product={p} sizes="(min-width:1024px) 600px, 92vw" priority={false} />
                </div>
              </div>
              <ul className="mt-4 grid grid-cols-4 gap-3" aria-label="Choose a sneaker">
                {items.map((it, n) => (
                  <li key={it.id}>
                    <button
                      type="button"
                      onClick={() => pick(n)}
                      aria-label={`${it.name}, ${it.colorway}`}
                      aria-current={n === i}
                      className={`relative block aspect-square w-full overflow-hidden rounded-[14px] bg-white ring-2 transition ${n === i ? "ring-brand" : "ring-maroon/10 hover:ring-maroon/35"}`}
                    >
                      <ProductImage product={it} sizes="140px" />
                    </button>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="eyebrow">Heepzy · {p.category}</p>
              <h2 id="story-title" className="display mt-3 text-[clamp(2.3rem,5vw,4.2rem)] normal-case">
                {p.name}
              </h2>
              <p className="mt-1 text-lg text-maroon/70">{p.colorway}</p>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-maroon/75">{p.description}</p>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                <p className="flex items-baseline gap-3">
                  <span className={`text-4xl font-semibold ${sale < list ? "text-brand" : ""}`}>{formatPrice(sale)}</span>
                  {sale < list && <span className="text-lg text-maroon/50 line-through">{formatPrice(list)}</span>}
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <Stars rating={p.rating} size={16} />
                  <span className="font-semibold">{p.rating.toFixed(1)}</span>
                  <span className="text-maroon/55">({p.reviewCount})</span>
                </p>
              </div>

              <p className="mt-8 text-sm font-semibold">Available options:</p>
              <div className="mt-3 grid max-w-xl grid-cols-2 gap-3">
                <div className="flex items-center gap-4 rounded-[18px] bg-white p-4 ring-1 ring-maroon/10">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cream text-maroon">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M3 17h18M6 17V9m4 8V6m4 11v-6m4 6v-9" />
                    </svg>
                  </span>
                  <span>
                    <span className="block text-sm text-maroon/65">Sizes in stock</span>
                    <span className="block text-xl font-semibold">{sizesAvailable} of {p.sizes.length}</span>
                  </span>
                </div>
                <div className="flex items-center gap-4 rounded-[18px] bg-white p-4 ring-1 ring-maroon/10">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cream text-maroon">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M3 3v18h18M7 15l4-4 3 3 5-6" />
                    </svg>
                  </span>
                  <span>
                    <span className="block text-sm text-maroon/65">Pairs in stock</span>
                    <span className="block text-xl font-semibold">{pairs}</span>
                  </span>
                </div>
              </div>

              <p className="mt-8 text-sm font-semibold">Size chart</p>
              <div className="mt-3 flex max-w-xl items-center gap-3">
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Size (US)</span>
                  <select value={size} onChange={(e) => { setSize(e.target.value); setHint(false); }} className={selectCls}>
                    <option value="">Size (US)</option>
                    {p.sizes.map((s) => {
                      const out = sizeStock(p, s) <= 0;
                      return (
                        <option key={s} value={s} disabled={out}>
                          US {s}{out ? " (sold out)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Colour</span>
                  <select value={color} onChange={(e) => setColorByProduct((m) => ({ ...m, [p.id]: e.target.value }))} className={selectCls}>
                    {p.colors.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </label>
                <WishlistButton productId={p.id} productName={p.name} variant="inline" className="!h-12 !w-12 !border-0 !bg-sun hover:!bg-[#ecd92a]" />
              </div>
              <p className={`mt-2 h-5 text-sm ${hint ? "font-medium text-brand" : "text-transparent"}`} role="status">
                {hint ? "Please select a size" : "."}
              </p>

              <div className="mt-2 flex max-w-xl flex-wrap items-center gap-3">
                <button type="button" onClick={submit} className="pill-solid h-12 min-w-0 flex-1 gap-2.5 text-base">
                  {added ? (<><CheckIcon width={18} height={18} /> Added to bag</>) : (<><BagIcon width={18} height={18} /> Add to bag</>)}
                </button>
                <Link href={`/product/${p.id}`} className="pill h-12 gap-2 border border-maroon/20 bg-white px-6 text-base text-maroon hover:border-maroon/50">
                  Full details <ArrowIcon width={16} height={16} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stories */}
      <section
        id="story-reviews"
        aria-labelledby="reviews-title"
        data-dark
        // Extends over the footer's top margin so the footer's rounded corners sit on the same maroon (no cream seam).
        className="grain relative -mb-24 overflow-hidden pb-44 pt-20 text-white sm:-mb-32 sm:pb-60 sm:pt-28"
        style={{
          background:
            "radial-gradient(60% 50% at 18% 20%, rgba(179,32,42,0.45) 0%, rgba(179,32,42,0) 70%), radial-gradient(55% 45% at 85% 70%, rgba(217,74,74,0.28) 0%, rgba(217,74,74,0) 70%), linear-gradient(to bottom, #2a070b 0%, #1a0505 60%, #1a0505 100%)",
        }}
      >
        <div className="container-x relative">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 id="reviews-title" className="display text-[clamp(2.4rem,6vw,4.6rem)] normal-case">
              Every Pair Tells A Story
              <br />
              Here&apos;s Theirs
            </h2>
            <div className="mt-7 flex justify-center -space-x-3" aria-hidden>
              {STORIES.map((s, n) => (
                <span key={s.name} className={`grid h-14 w-14 place-items-center rounded-full text-sm font-semibold ring-4 ring-[#2a070b] ${AVATAR_TONES[n]}`}>
                  {s.initials}
                </span>
              ))}
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm">
              <Stars rating={4.5} size={16} />
              <span className="font-semibold">4.5/5</span>
              <span className="text-white/60">sample rating</span>
            </p>
          </Reveal>

          <ul className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
            {STORIES.map((s, n) => (
              <Reveal as="li" key={s.name} delay={n * 0.08}>
                <figure className="flex h-full flex-col rounded-[22px] bg-[#f8f6f3] p-7 text-maroon shadow-[0_30px_60px_-35px_rgba(0,0,0,0.7)] sm:p-8">
                  <span aria-hidden className="font-display text-7xl leading-[0.7] text-brand/70">“</span>
                  <div className="mt-5 border-t-2 border-dotted border-maroon/20" />
                  <blockquote className="mt-6 flex-1 text-[15px] font-medium leading-relaxed">{s.text}</blockquote>
                  <figcaption className="mt-8 flex items-center gap-3">
                    <span className={`grid h-11 w-11 place-items-center rounded-full text-xs font-semibold ${AVATAR_TONES[n]} ${n === 2 ? "ring-1 ring-maroon/15" : ""}`}>{s.initials}</span>
                    <span>
                      <span className="block text-[15px] font-semibold">{s.name}</span>
                      <span className="block text-sm text-maroon/60">{s.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
          <p className="mt-8 text-center text-xs text-white/50">Sample stories for this demonstration storefront. They are not verified customer reviews.</p>
        </div>
      </section>
    </>
  );
}
