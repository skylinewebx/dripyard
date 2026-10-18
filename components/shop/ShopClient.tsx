"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { products, priceBounds } from "@/lib/products";
import { DEFAULT_FILTERS, SORT_OPTIONS, applyFilters, countActive, parseFilters, serializeFilters, type ShopFilters, type SortKey } from "@/lib/filters";
import ProductCard from "@/components/product/ProductCard";
import FilterPanel from "./FilterPanel";
import { useDialog } from "@/hooks/use-dialog";
import { CloseIcon, SearchIcon, SlidersIcon } from "@/components/ui/icons";

const DEBOUNCE_MS = 250;

function FilterSheet({ onClose, children, count }: { onClose: () => void; children: React.ReactNode; count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, onClose);
  return (
    <>
      <motion.div aria-hidden className="fixed inset-0 z-50 bg-maroon/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="fixed inset-x-0 bottom-0 z-[51] flex max-h-[88svh] flex-col rounded-t-[32px] bg-cream shadow-lift"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 38 }}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="display text-2xl">Filters</h2>
          <button type="button" onClick={onClose} aria-label="Close filters" className="grid h-10 w-10 place-items-center rounded-full hover:bg-maroon/8">
            <CloseIcon />
          </button>
        </div>
        <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
          {children}
        </div>
        <div className="border-t border-maroon/10 bg-white p-4">
          <button type="button" onClick={onClose} className="pill-solid w-full py-3.5">
            Show {count} {count === 1 ? "result" : "results"}
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default function ShopClient({ initial }: { initial: ShopFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const urlFilters = useMemo(() => parseFilters(sp), [sp]);

  // q and the price range are edited live and written to the URL after a short pause.
  const [local, setLocal] = useState({ q: initial.q, min: initial.min, max: initial.max });
  const localRef = useRef(local);
  const pending = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const urlRef = useRef(urlFilters);
  urlRef.current = urlFilters;
  const [sheetOpen, setSheetOpen] = useState(false);

  const write = (next: ShopFilters) => {
    const qs = serializeFilters(next);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Follow external URL changes (back/forward, menu links) unless the user is mid-edit.
  useEffect(() => {
    if (pending.current) return;
    const next = { q: urlFilters.q, min: urlFilters.min, max: urlFilters.max };
    localRef.current = next;
    setLocal(next);
  }, [urlFilters.q, urlFilters.min, urlFilters.max]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const editLocal = (patch: Partial<typeof local>) => {
    localRef.current = { ...localRef.current, ...patch };
    setLocal(localRef.current);
    pending.current = true;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      pending.current = false;
      write({ ...urlRef.current, ...localRef.current });
    }, DEBOUNCE_MS);
  };

  const filters: ShopFilters = { ...urlFilters, ...local };

  const update = (patch: Partial<ShopFilters>) => {
    clearTimeout(timer.current);
    pending.current = false;
    write({ ...urlRef.current, ...localRef.current, ...patch });
  };

  const clearAll = () => {
    clearTimeout(timer.current);
    pending.current = false;
    const next = { q: "", min: priceBounds.min, max: priceBounds.max };
    localRef.current = next;
    setLocal(next);
    write({ ...DEFAULT_FILTERS });
  };

  const results = useMemo(() => applyFilters(products, filters), [filters.q, filters.categories, filters.sizes, filters.colors, filters.min, filters.max, filters.sort, filters.onlyNew, filters.onlyFlash]); // eslint-disable-line react-hooks/exhaustive-deps
  const active = countActive(filters);

  const chips: { label: string; remove: () => void }[] = [
    ...(filters.q.trim() ? [{ label: `“${filters.q.trim()}”`, remove: () => update({ q: "" }) }] : []),
    ...filters.categories.map((c) => ({ label: c, remove: () => update({ categories: filters.categories.filter((x) => x !== c) }) })),
    ...filters.sizes.map((s) => ({ label: `US ${s}`, remove: () => update({ sizes: filters.sizes.filter((x) => x !== s) }) })),
    ...filters.colors.map((c) => ({ label: c, remove: () => update({ colors: filters.colors.filter((x) => x !== c) }) })),
    ...(filters.min > priceBounds.min || filters.max < priceBounds.max
      ? [{ label: `$${filters.min} – $${filters.max}`, remove: () => update({ min: priceBounds.min, max: priceBounds.max }) }]
      : []),
    ...(filters.onlyNew ? [{ label: "New arrivals", remove: () => update({ onlyNew: false }) }] : []),
    ...(filters.onlyFlash ? [{ label: "Flash Drop", remove: () => update({ onlyFlash: false }) }] : []),
  ];

  const panel = (
    <FilterPanel
      filters={filters}
      draft={{ min: filters.min, max: filters.max }}
      onChange={update}
      onPrice={(min, max) => editLocal({ min, max })}
    />
  );

  const runningOnly = filters.categories.length === 1 && filters.categories[0] === "Running";

  return (
    <div className="grid gap-8 lg:grid-cols-[272px_1fr] lg:gap-12">
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto rounded-[28px] bg-white/60 p-6 shadow-card ring-1 ring-maroon/5" data-lenis-prevent>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="display text-2xl">Filters</h2>
            {active > 0 && (
              <button type="button" onClick={clearAll} className="text-xs font-medium text-brand underline-offset-4 hover:underline">
                Clear all
              </button>
            )}
          </div>
          {panel}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block flex-1">
            <span className="sr-only">Search sneakers</span>
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-maroon/50" width={18} height={18} />
            <input
              type="search"
              value={local.q}
              onChange={(e) => editLocal({ q: e.target.value })}
              placeholder="Search by model or colourway"
              className="h-12 w-full rounded-full border border-maroon/15 bg-white pl-11 pr-4 text-[15px] outline-none transition-colors placeholder:text-maroon/40 focus:border-brand"
            />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="relative inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-maroon/15 bg-white px-5 text-sm font-medium lg:hidden"
            >
              <SlidersIcon width={18} height={18} /> Filters
              {active > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] text-white">{active}</span>}
            </button>
            <label className="relative block flex-1 sm:flex-none">
              <span className="sr-only">Sort by</span>
              <select
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as SortKey })}
                className="h-12 w-full cursor-pointer appearance-none rounded-full border border-maroon/15 bg-white pl-5 pr-10 text-sm font-medium outline-none focus:border-brand sm:w-[210px]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="m5 8 5 5 5-5" />
              </svg>
            </label>
          </div>
        </div>

        <div className="mt-5 flex min-h-8 flex-wrap items-center gap-2">
          <p className="mr-2 text-sm text-maroon/65" role="status" aria-live="polite">
            <strong className="text-maroon">{results.length}</strong> {results.length === 1 ? "pair" : "pairs"}
          </p>
          {chips.map((c) => (
            <button key={c.label} type="button" onClick={c.remove} className="group inline-flex items-center gap-1.5 rounded-full bg-maroon px-3 py-1.5 text-xs font-medium text-cream" aria-label={`Remove filter ${c.label}`}>
              {c.label}
              <CloseIcon width={12} height={12} className="opacity-70 group-hover:opacity-100" />
            </button>
          ))}
          {active > 0 && (
            <button type="button" onClick={clearAll} className="ml-1 text-xs font-medium text-brand underline-offset-4 hover:underline">
              Clear all
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
            {results.map((p, i) => (
              <motion.li key={p.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}>
                <ProductCard product={p} priority={i < 3} sizes="(min-width:1024px) 280px, (min-width:768px) 33vw, 50vw" />
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 grid place-items-center rounded-[32px] bg-white/60 px-6 py-20 text-center shadow-card ring-1 ring-maroon/5">
            <p className="display text-3xl sm:text-4xl">{runningOnly ? "Running drops are on the way" : "No pairs match"}</p>
            <p className="mt-3 max-w-sm text-sm text-maroon/65">
              {runningOnly
                ? "We haven't listed any running sneakers yet. Browse the rest of the yard in the meantime."
                : "Try removing a filter or searching for a different model."}
            </p>
            <button type="button" onClick={clearAll} className="pill-solid mt-6">
              Reset all filters
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {sheetOpen && (
          <FilterSheet key="sheet" onClose={() => setSheetOpen(false)} count={results.length}>
            {panel}
            {active > 0 && (
              <button type="button" onClick={clearAll} className="mb-4 mt-1 text-sm font-medium text-brand underline-offset-4 hover:underline">
                Clear all filters
              </button>
            )}
          </FilterSheet>
        )}
      </AnimatePresence>
    </div>
  );
}
