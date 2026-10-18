"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { products } from "@/lib/products";
import type { Category } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";

const STEP = 12;

/** Browse the whole catalogue from the home page: category tabs, then a clean grid that grows on demand. */
export default function CollectionSection() {
  const categories = useMemo(() => {
    const counts = new Map<Category, number>();
    for (const p of products) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return [...counts.entries()];
  }, []);
  const [active, setActive] = useState<"All" | Category>("All");
  const [shown, setShown] = useState(STEP);

  const list = useMemo(() => (active === "All" ? products : products.filter((p) => p.category === active)), [active]);
  const visible = list.slice(0, shown);

  const choose = (c: "All" | Category) => {
    setActive(c);
    setShown(STEP);
  };

  const tab = (on: boolean) =>
    `border-b-2 pb-2 text-sm font-medium transition-colors duration-300 ${on ? "border-brand text-maroon" : "border-transparent text-maroon/55 hover:text-maroon"}`;

  return (
    <section id="collection" aria-labelledby="collection-title" className="scroll-mt-4 pb-24 pt-8 sm:pb-36">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">The collection</p>
            <SplitReveal id="collection-title" className="display mt-3 text-[clamp(2.6rem,6.5vw,5rem)]" text={"Every pair\nin the yard"} />
          </div>
          <Link href="/shop" className="group inline-flex w-fit items-center gap-2 border-b border-maroon/30 pb-1 text-sm font-medium transition-colors hover:border-brand hover:text-brand">
            Open full shop with filters
            <ArrowIcon width={16} height={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div role="group" aria-label="Filter collection by category" className="no-scrollbar mt-10 flex gap-7 overflow-x-auto border-b border-maroon/12">
          <button type="button" aria-pressed={active === "All"} onClick={() => choose("All")} className={tab(active === "All")}>
            All <span className="text-maroon/40">({products.length})</span>
          </button>
          {categories.map(([c, n]) => (
            <button key={c} type="button" aria-pressed={active === c} onClick={() => choose(c)} className={tab(active === c)}>
              {c} <span className="text-maroon/40">({n})</span>
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm text-maroon/60" role="status" aria-live="polite">
          Showing <strong className="text-maroon">{visible.length}</strong> of {list.length} pairs
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4">
          {visible.map((p, i) => (
            <motion.li
              key={`${active}-${p.id}`}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: Math.min(i % STEP, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={p} sizes="(min-width:1024px) 300px, 50vw" />
            </motion.li>
          ))}
        </ul>

        {shown < list.length && (
          <div className="mt-14 flex justify-center">
            <button type="button" onClick={() => setShown((n) => n + STEP)} className="pill-ghost px-8 py-3.5">
              Show more pairs
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
